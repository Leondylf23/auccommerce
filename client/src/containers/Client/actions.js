import { SET_LOGIN, SET_TOKEN, SET_USER_DATA } from '@containers/Client/constants';

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
  userData
});