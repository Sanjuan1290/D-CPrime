function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  const status = err.statusCode || err.status || 500
  const payload = {
    message: status >= 500 ? 'Internal server error' : err.message,
  }

  if (process.env.NODE_ENV !== 'production' && status >= 500) {
    payload.detail = err.message
  }

  return res.status(status).json(payload)
}

module.exports = errorHandler
