const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
    windowMs: 12 * 60 * 60 * 1000, // 12 saatlik bir pencere
    max: 3, // 12 saat içinde en fazla 3 istek
    handler : (req,res) => {
        return res.json({
            status:false,
            message: 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.'
        })
    }
  })

  module.exports = {
    registerLimiter
  }