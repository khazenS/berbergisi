import jwt from 'jsonwebtoken'

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
