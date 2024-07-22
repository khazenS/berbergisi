import CryptoJS from 'crypto-js'

export const encryptData = (data) => {
    const stringData = JSON.stringify(data); 
    return CryptoJS.AES.encrypt(stringData, process.env.ENCRYPTION_DECRYPTION_KEY).toString();
}


export const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData,process.env.ENCRYPTION_DECRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}