const db = require('../config/db')
const httpError = require('./httpError')
const { logAudit } = require('./audit')

function quoteId(identifier) {
  if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
    throw httpError(500, `Invalid SQL identifier: ${identifier}`)
  }

  return `\`${identifier}\``
}

function cleanPayload(body, allowedColumns) {
  return Object.fromEntries(
    Object.entries(body || {}).filter(([key, value]) => allowedColumns.includes(key) && value !== undefined),
  )
}

function pagination(query) {
  const page = Math.max(1, Number(query.page || 1))
  const limit = Math.min(100, Math.max(1, Number(query.limit || 25)))

  return { page, limit, offset: (page - 1) * limit }
}

function createCrudController(config) {
  const table = quoteId(config.table)
  const idColumn = config.idColumn || 'id'
  const quotedId = quoteId(idColumn)
  const orderBy = config.orderBy || `${quotedId} DESC`

  return {
    async list(req, res) {
      const { page, limit, offset } = pagination(req.query)
      const where = []
      const values = []

      for (const filter of config.filters || []) {
        if (req.query[filter]) {
          where.push(`${quoteId(filter)} = ?`)
          values.push(req.query[filter])
        }
      }

      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
      const [rows] = await db.query(
        `SELECT * FROM ${table} ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
        [...values, limit, offset],
      )
      const [[count]] = await db.query(`SELECT COUNT(*) AS total FROM ${table} ${whereSql}`, values)

      res.json({
        data: rows,
        pagination: {
          page,
          limit,
          total: count.total,
          totalPages: Math.max(1, Math.ceil(count.total / limit)),
        },
      })
    },

    async get(req, res) {
      const [rows] = await db.query(`SELECT * FROM ${table} WHERE ${quotedId} = ? LIMIT 1`, [req.params.id])
      const record = rows[0]

      if (!record) throw httpError(404, 'Record not found')
      res.json(record)
    },

    async create(req, res) {
      const payload = cleanPayload(req.body, config.columns)
      const columns = Object.keys(payload)

      if (!columns.length) throw httpError(400, 'No valid fields provided')

      const placeholders = columns.map(() => '?').join(', ')
      const [result] = await db.query(
        `INSERT INTO ${table} (${columns.map(quoteId).join(', ')}) VALUES (${placeholders})`,
        columns.map((column) => payload[column]),
      )
      const [rows] = await db.query(`SELECT * FROM ${table} WHERE ${quotedId} = ? LIMIT 1`, [result.insertId])
      const record = rows[0]

      await logAudit({
        userId: req.user?.id,
        action: `Created ${config.moduleName}`,
        moduleName: config.moduleName,
        entityTable: config.table,
        entityId: result.insertId,
        newValues: record,
        ipAddress: req.ip,
      })

      res.status(201).json(record)
    },

    async update(req, res) {
      const payload = cleanPayload(req.body, config.columns)
      const columns = Object.keys(payload)

      if (!columns.length) throw httpError(400, 'No valid fields provided')

      const [beforeRows] = await db.query(`SELECT * FROM ${table} WHERE ${quotedId} = ? LIMIT 1`, [req.params.id])
      const before = beforeRows[0]
      if (!before) throw httpError(404, 'Record not found')

      await db.query(
        `UPDATE ${table} SET ${columns.map((column) => `${quoteId(column)} = ?`).join(', ')} WHERE ${quotedId} = ?`,
        [...columns.map((column) => payload[column]), req.params.id],
      )
      const [afterRows] = await db.query(`SELECT * FROM ${table} WHERE ${quotedId} = ? LIMIT 1`, [req.params.id])
      const after = afterRows[0]

      await logAudit({
        userId: req.user?.id,
        action: `Updated ${config.moduleName}`,
        moduleName: config.moduleName,
        entityTable: config.table,
        entityId: req.params.id,
        oldValues: before,
        newValues: after,
        ipAddress: req.ip,
      })

      res.json(after)
    },

    async remove(req, res) {
      const [beforeRows] = await db.query(`SELECT * FROM ${table} WHERE ${quotedId} = ? LIMIT 1`, [req.params.id])
      const before = beforeRows[0]
      if (!before) throw httpError(404, 'Record not found')

      await db.query(`DELETE FROM ${table} WHERE ${quotedId} = ?`, [req.params.id])

      await logAudit({
        userId: req.user?.id,
        action: `Deleted ${config.moduleName}`,
        moduleName: config.moduleName,
        entityTable: config.table,
        entityId: req.params.id,
        oldValues: before,
        ipAddress: req.ip,
      })

      res.status(204).send()
    },
  }
}

module.exports = { createCrudController, pagination }
