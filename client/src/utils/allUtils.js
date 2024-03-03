import AES from 'crypto-js/aes';
import encodeUtf8 from 'crypto-js/enc-utf8';
import { useIntl as reactUseIntl } from 'react-intl';

const encryptSecret = 'xS2atT7h810yD';
const timeZoneOffset = new Date().getTimezoneOffset() * 60000;

export const encryptDataAES = (data) => AES.encrypt(data, encryptSecret).toString();
export const decryptDataAES = (data) => (data ? AES.decrypt(data, encryptSecret).toString(encodeUtf8) : null);
export const getUserDataDecrypt = (data) => {
  try {
    return JSON.parse(decryptDataAES(data));
  } catch (error) {
    console.error(`Error parsing user data: ${error.message}`);
    return null;
  }
};
export const numberWithPeriods = (value) => (value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0');
/**
 * @param {String} value Value can be from date
 */
export const formatDateOnly = (value) =>
  value
    ? new Date(new Date(value) - timeZoneOffset).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;
/**
 * @param {String} value Value can be from date
 * @param {Number} isShowSeconds Whether to show seconds or not. Default value is false.
 */
export const formatTimeOnly = (value, isShowSeconds = false) =>
  value ? new Date(new Date(value) - timeZoneOffset).toISOString().slice(11, isShowSeconds ? 19 : 16) : null;
/**
 * @param {Number} value Value must be number in ms
 */
export const timerDisplay = (value) => {
  const intl = reactUseIntl();
  const display = {
    days: String(Math.floor(value / (24 * 60 * 60))).padStart(2, '0'),
    hours: String(Math.floor((value / 3600) % 24)).padStart(2, '0'),
    minutes: String(Math.floor((value % 3600) / 60)).padStart(2, '0'),
    seconds: String(Math.floor(value % 60)).padStart(2, '0'),
  };

  return `${display?.days} ${intl.formatMessage({ id: 'days' })} ${display?.hours}:${display?.minutes}:${
    display?.seconds
  }`;
};
/**
 * @param {Number} value Value must valid date
 */
export const formatDateTimeSlashes = (value) => {
  if (!value) return '';

  const date = new Date(new Date(value) - timeZoneOffset);
  const isoString = date.toISOString();
  const formatted = isoString.replace('-', '/').replace('-', '/').replace('T', ' ').slice(0, 16);

  return formatted;
};
