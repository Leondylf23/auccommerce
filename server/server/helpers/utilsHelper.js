/* eslint-disable no-plusplus */
const AES = require('crypto-js/aes');
const encodeUtf8 = require('crypto-js/enc-utf8');

const encryptSecret = 'xS2atT7h810yD'

const decryptData = (data) => data ? AES.decrypt(data, encryptSecret).toString(encodeUtf8) : null;
const encryptData = (data) => AES.encrypt(data, encryptSecret).toString();
const generateRandomString = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
  
    return result;
};

module.exports = {
    decryptData,
    encryptData,
    generateRandomString
}