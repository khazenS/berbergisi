import { decryptData } from "../helpers/cryptoProcess.js"

export const cryptoMiddleware = (req,res,next) => {
    if(req.body.type == 'crypted'  && req.body.data){
        const newData = decryptData(req.body.data)
        req.body.data = newData
    }
    next()
}