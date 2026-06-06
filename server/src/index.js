require('dotenv').config()
require('express-async-errors')

const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const auth = require('./middleware/auth')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'dcprime-api' })
})

app.use('/api/auth', require('./routes/auth'))

app.use(auth)
app.use('/api/dashboard', require('./routes/dashboard'))
app.use('/api/users', require('./routes/users'))
app.use('/api/people', require('./routes/people'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/listings', require('./routes/listings'))
app.use('/api/reservations', require('./routes/reservations'))
app.use('/api/clients', require('./routes/clients'))
app.use('/api/client-units', require('./routes/clientUnits'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/payment-schedules', require('./routes/paymentSchedules'))
app.use('/api/commissions', require('./routes/commissions'))
app.use('/api/commission-releases', require('./routes/commissionReleases'))
app.use('/api/documents', require('./routes/documents'))
app.use('/api/document-requirements', require('./routes/documentRequirements'))
app.use('/api/soa', require('./routes/soa'))
app.use('/api/lookups', require('./routes/lookups'))
app.use('/api/settings', require('./routes/settings'))
app.use('/api/audit-logs', require('./routes/auditLogs'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/balances', require('./routes/balances'))
app.use('/api/cash-advances', require('./routes/cashAdvances'))
app.use('/api/attendance', require('./routes/attendance'))

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' })
})
app.use(errorHandler)

app.listen(port, () => {
  console.log(`D&C Prime API listening on http://localhost:${port}`)
})
