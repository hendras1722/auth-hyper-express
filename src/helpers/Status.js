function StatusSuccess(res, code, message, data = undefined) {
  return res.status(code).json({
    code,
    message,
    data,
  })
}

function StatusError(res, code, message, errors = undefined) {
  return res.status(code).json({
    code,
    message,
    errors,
  })
}

module.exports = {
  StatusSuccess,
  StatusError,
}
