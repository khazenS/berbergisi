const checkingInfos = (req,res,next) => {
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber.replace(/\s+/g, '').trim(); // Remove spaces and trim
    const ip = req.ip
    const fingerprint = req.headers['fingerprint']        
    const reCAPTCHAToken = req.body.reCAPTCHAToken    

    if(!reCAPTCHAToken) return res.json({ status : false , message: 'reCAPTCHA token bulunamadı.' }); 

    if(!ip  || !fingerprint ) {
        return res.json({
            status: false,
            message: "Eksik cihaz bilgisi. Lütfen tarayıcınızın izinlerini kontrol edin."
        });
    }

    if(!name || !phoneNumber) {
        return res.json({
            status: false,
            message: "Lütfen tüm alanları doldurun."
        })
    }

    if(name.trim().length < 4 || name.trim().length > 20) {
        return res.json({
            status: false,
            message: "İsim 4 ile 20 karakter arasında olmalıdır."
        });
    }

    if(phoneNumber.length !== 10 ) {
        return res.json({
            status: false,
            message: "Lütfen geçerli bir telefon numarası girin."
        });
    }
    // Check if the phone number contains only digits
    if(!/^\d+$/.test(phoneNumber)) {
        return res.json({
            status: false,
            message: "Telefon numarası sadece rakamlardan oluşmalıdır."
        });
    }
    next();
}

const generateCode = (length) => {
    return Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)).toString();
}
module.exports = {
    checkingInfos,
    generateCode
}