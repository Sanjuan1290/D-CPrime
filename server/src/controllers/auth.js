const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const httpError = require('../utils/httpError')
const { logAudit } = require('../utils/audit')
const { sendPasswordResetEmail } = require('../utils/mailer')

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000,
  }
}

function signUser(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      full_name: user.full_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
}

function publicUser(user) {
  if (!user) return null

  return {
    id: user.id,
    full_name: user.full_name,
    fullName: user.full_name,
    email: user.email,
    contact_no: user.contact_no,
    contactNo: user.contact_no,
    role: user.role,
    status: user.status,
    barcode_value: user.barcode_value,
    barcodeValue: user.barcode_value,
    avatar_url: user.avatar_url,
    avatarUrl: user.avatar_url,
  }
}

async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) throw httpError(400, 'Email and password are required')

  const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
  const user = rows[0]

  if (!user || !user.password_hash) throw httpError(401, 'Invalid email or password')

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) throw httpError(401, 'Invalid email or password')
  if (user.status !== 'active') throw httpError(403, 'User account is inactive')

  const token = signUser(user)
  await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])

  await logAudit({
    userId: user.id,
    action: 'Logged in',
    moduleName: 'Auth',
    entityTable: 'users',
    entityId: user.id,
    ipAddress: req.ip,
  })

  res.cookie('token', token, cookieOptions()).json({ user: publicUser(user) })
}

async function logout(req, res) {
  res.clearCookie('token', cookieOptions()).json({ message: 'Logged out' })
}

async function me(req, res) {
  const [rows] = await db.query(
    `SELECT id, full_name, email, contact_no, role, status, barcode_value, avatar_url
     FROM users WHERE id = ? LIMIT 1`,
    [req.user.id],
  )
  const user = rows[0]

  if (!user || user.status !== 'active') throw httpError(401, 'Not authenticated')
  res.json(publicUser(user))
}

async function forgotPassword(req, res) {
  const { email } = req.body

  if (!email) throw httpError(400, 'Email is required')

  const [rows] = await db.query('SELECT id, email FROM users WHERE email = ? LIMIT 1', [email])
  const user = rows[0]

  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await db.query('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [
      user.id,
      tokenHash,
      expiresAt,
    ])

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`
    await sendPasswordResetEmail(user.email, resetUrl)
  }

  res.json({ message: 'If the account exists, a reset link has been sent.' })
}

async function resetPassword(req, res) {
  const { token, password } = req.body

  if (!token || !password) throw httpError(400, 'Token and password are required')
  if (password.length < 8) throw httpError(400, 'Password must be at least 8 characters')

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const [rows] = await db.query(
    `SELECT * FROM password_reset_tokens
     WHERE token = ? AND used = 0 AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [tokenHash],
  )
  const resetToken = rows[0]

  if (!resetToken) throw httpError(400, 'Reset token is invalid or expired')

  const passwordHash = await bcrypt.hash(password, 12)
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, resetToken.user_id])
  await db.query('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [resetToken.id])

  await logAudit({
    userId: resetToken.user_id,
    action: 'Reset password',
    moduleName: 'Auth',
    entityTable: 'users',
    entityId: resetToken.user_id,
    ipAddress: req.ip,
  })

  res.json({ message: 'Password has been reset.' })
}

module.exports = { login, logout, me, forgotPassword, resetPassword, publicUser }
