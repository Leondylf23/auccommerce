import { SAVE_USER_ADDRESS, SET_LOGIN, SET_TOKEN, SET_USER_DATA } from '@containers/Client/constants';

export const setLogin = (login) => ({
  type: SET_LOGIN,
  login,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  token,
});

export const setUserData = (userData) => ({
  type: SET_USER_DATA,
  userData,
});

export const saveUserAddress = (isEdit, formData, cb) => ({
  type: SAVE_USER_ADDRESS,
  isEdit,
  formData,
  cb,
});
