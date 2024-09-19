const { decryptData } = require('../helpers/cryptoProcess.js')

const cryptoMiddleware = (req,res,next) => {
    if(req.body.type == 'crypted'  && req.body.data){
        const newData = decryptData(req.body.data)
        req.body.data = newData
    }
    next()
}

module.exports = {
    cryptoMiddleware
}