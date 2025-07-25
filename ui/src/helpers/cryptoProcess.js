import CryptoJS from 'crypto-js'

export const encryptData = (data) => {
    const stringData = JSON.stringify(data); 
    return CryptoJS.AES.encrypt(stringData, process.env.REACT_APP_ENCRYPTION_DECRYPTION_KEY).toString();
}


export const decryptData = (encryptedData) => {
    if(!encryptedData){
        console.error('There is no data for encrption.')
        return null
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData,process.env.REACT_APP_ENCRYPTION_DECRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}
