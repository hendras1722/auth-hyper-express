const { Router } = require('hyper-express')
const { RegisterOtp } = require('../controller/register')

const Routes = new Router()

Routes.post('/', RegisterOtp)

module.exports = {
  RegisterOtpRoute: Routes,
}