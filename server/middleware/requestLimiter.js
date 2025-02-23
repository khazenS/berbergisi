const { RequestCounter } = require("../database/schemas/requestCounterSchema")

const requestLimiter = async (req,res,next) => {
    const ip = req.ip
    const user_agent = req.headers['user-agent']
    const key = ip + user_agent

    const currentTime  = new Date()
    const localCurrentTime = currentTime.setHours(currentTime.getHours() + 3)

    let requestCounter = await RequestCounter.findOne({userKey : key })

    if(!requestCounter) {
        try{
          requestCounter = await RequestCounter.create({ userKey: key })  
        }catch{
            requestCounter = await RequestCounter.findOne({userKey : key })
        }
    }else{
        if((requestCounter.existDate.getTime()) + ( process.env.REQUEST_LIMIT_RESET_TIME * 60 * 60 * 1000) < localCurrentTime){
            requestCounter.existDate = new Date(Date.now() + 3 * 60 * 60 * 1000);
            requestCounter.requestCount.registerRequest = 0;
            requestCounter.requestCount.totalRequest = 0;
        }
        if(requestCounter.requestCount.totalRequest >= process.env.TOTAL_REQUEST_LIMIT){
            return res.json({
                request_error:true,
                reqErrorType:'total',
                message:'You tried a lot of request.'
            })
        }
    }
    requestCounter.requestCount.totalRequest += 1
    await requestCounter.save()
    next()
}

const registerRequestLimiter = async (req,res,next) => {
    const ip = req.ip
    const user_agent = req.headers['user-agent']
    const key = ip + user_agent

    const currentTime  = new Date()
    const localCurrentTime = currentTime.setHours(currentTime.getHours() + 3)

    let requestDoc = await RequestCounter.findOne({userKey : key})
    if(!requestDoc) requestDoc = await RequestCounter.create({userKey : key})
    else{
        if((requestDoc.existDate.getTime()) + ( process.env.REQUEST_LIMIT_RESET_TIME * 60 * 60 * 1000) < localCurrentTime){
            requestDoc.existDate = new Date(Date.now() + 3 * 60 * 60 * 1000);
            requestDoc.requestCount.registerRequest = 0;
            requestDoc.requestCount.totalRequest = 0;
        }
        if(requestDoc.requestCount.registerRequest >= process.env.REGISTER_REQUEST_LIMIT){
            return res.json({
                status:false,
                req_error:'register',
                message:'You have tried a lot of register.'
            })
        }
    }
    requestDoc.requestCount.registerRequest += 1
    requestDoc.requestCount.totalRequest += 1
    await requestDoc.save()
    next()
}

module.exports = {
    requestLimiter,
    registerRequestLimiter
}