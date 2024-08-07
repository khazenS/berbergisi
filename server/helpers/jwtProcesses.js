import jwt from 'jsonwebtoken'

// Admin token processes
export function getTokenforAdmin(){
    const token = jwt.sign({
        type:'admin',
        expiresTime:'1w'
    },process.env.JWT_SECRET,{expiresIn: '1w'})

    return token
}

export function verificationToken(firstToken){
    let response = ""
    jwt.verify(firstToken,process.env.JWT_SECRET, (err,decode) => {
        if (err) {
            response = false
        }
        else{
            response = decode
        }
    })

    return response
}

// Que token processes
export function getTokenforQue(userBookingID,dayBookingID){
    const token = jwt.sign({
        type:'Queue',
        userBookingID,
        dayBookingID
    },process.env.JWT_SECRET_QUE,{expiresIn: '1d'})

    return token
}

export function verificationQueToken(firstToken){
    let response = ""
    jwt.verify(firstToken,process.env.JWT_SECRET_QUE, (err,decode) => {
        if (err) {
            response = false
        }
        else{
            response = decode
        }
    })

    return response 
}
