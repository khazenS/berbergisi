const {Admin} = require('../database/schemas/adminSchema.js')
const { verificationToken } = require('../helpers/jwtProcesses.js')


// We check the ui and database token
const accessMiddleware = async (req,res,next) => {
    const headerToken = req.headers['authorization'].split(" ")[1]
    const adminDoc = await Admin.find({})
    if(verificationToken(headerToken) && adminDoc[0].adminAccessToken == headerToken){
        next()
    }
    else{
        res.json({
            status:false,
            errorType:'admin access token'
        })
    }

    
}

module.exports = {accessMiddleware}