import { SET_LOCAL, SET_THEME, SET_POPUP, SET_LOADING, SEND_REGISTER_DATA, SEND_LOGIN_DATA, SEND_FORGOT_PASSWORD } from '@containers/App/constants';

export const setLocale = (locale) => ({
  type: SET_LOCAL,
  locale,
});

export const setTheme = (theme) => ({
  type: SET_THEME,
  theme,
});

export const showPopup = (title = '', message = '') => ({
  type: SET_POPUP,
  popup: {
    open: true,
    title,
    message,
  },
});

export const hidePopup = () => ({
  type: SET_POPUP,
  popup: {
    open: false,
    title: '',
    message: '',
  },
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});

export const sendRegisterData = (formData, cb, errCb) => ({
  type: SEND_REGISTER_DATA,
  formData,
  cb,
  errCb
});

export const sendLoginData = (formData, cb, errCb) => ({
  type: SEND_LOGIN_DATA,
  formData,
  cb,
  errCb
});

export const sendForgotPassword = (formData, cb, cbErr) => ({
  type: SEND_FORGOT_PASSWORD,
  formData,
  cb,
  cbErr
});