import AES from 'crypto-js/aes';
import encodeUtf8 from 'crypto-js/enc-utf8';

const encryptSecret = 'xS2atT7h810yD';

export const encryptDataAES = (data) => AES.encrypt(data, encryptSecret).toString();
export const decryptDataAES = (data) => data ? AES.decrypt(data, encryptSecret).toString(encodeUtf8) : null;
export const getUserDataDecrypt = (data) => {
    try {
        return JSON.parse(decryptDataAES(data));
    } catch (error) {
        console.error(`Error parsing user data: ${error.message}`);
        return null;
    }
};
export const numberWithPeriods = (value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '0';