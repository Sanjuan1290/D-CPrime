const nodemailer = require('nodemailer')

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS are required for Gmail SMTP.')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

async function sendPasswordResetEmail(to, resetUrl) {
  const transporter = createTransporter()

  await transporter.sendMail({
    to,
    from: `"D&C Prime Realty" <${process.env.EMAIL_USER}>`,
    subject: 'Reset your D&C Prime Realty password',
    text: `Reset your password: ${resetUrl}`,
    html: `<p>Reset your password using this secure link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  })
}

module.exports = { sendPasswordResetEmail }
