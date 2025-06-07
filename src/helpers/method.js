function MethodPOST(req, res, next) {
  if (req.method !== 'POST')
    return res.status(405).json({ code: 405, message: 'Method Not Allowed' })
  next()
}

function MethodGET(req, res, next) {
  if (req.method !== 'GET')
    return res.status(405).json({ code: 405, message: 'Method Not Allowed' })
  next()
}

function MethodPUT(req, res, next) {
  if (req.method !== 'PUT')
    return res.status(405).json({ code: 405, message: 'Method Not Allowed' })
  next()
}

function MethodDELETE(req, res, next) {
  if (req.method !== 'DELETE')
    return res.status(405).json({ code: 405, message: 'Method Not Allowed' })
  next()
}
module.exports = { MethodPOST, MethodGET, MethodPUT, MethodDELETE }
