import { takeLatest, call, put } from 'redux-saga/effects';
import { getInitUserData, login, register, resetPasswordApi } from '@domain/api';
import { showPopup, setLoading } from '@containers/App/actions';
import {
  GET_USER_DATA_INIT,
  SEND_FORGOT_PASSWORD,
  SEND_LOGIN_DATA,
  SEND_REGISTER_DATA,
} from '@containers/App/constants';
import { setLogin, setToken, setUserData } from '@containers/Client/actions';

function* doGetUserData({ cbBanPopup }) {
  try {
    const res = yield call(getInitUserData);

    yield put(setUserData(res?.data?.updateData));

    const banTimer = res?.data?.banTimer;
    if (banTimer) {
      cbBanPopup(banTimer);
    }
  } catch (error) {
    yield put(showPopup());
  }
}

function* doRegister({ formData, cb, errCb }) {
  yield put(setLoading(true));

  try {
    yield call(register, formData);

    cb();
  } catch (error) {
    if (error?.response?.status === 500) {
      yield put(showPopup());
    } else {
      errCb(error);
    }
  }

  yield put(setLoading(false));
}

function* doLogin({ formData, cb, errCb }) {
  yield put(setLoading(true));

  try {
    const resData = yield call(login, formData);

    const token = resData?.data?.token;
    const userData = resData?.data?.userData;

    yield put(setLogin(true));
    yield put(setToken(token));
    yield put(setUserData(userData));

    cb();
  } catch (error) {
    if (error?.response?.status === 500) {
      yield put(showPopup());
    } else {
      errCb(error);
    }
  }

  yield put(setLoading(false));
}

function* doSendForgotPassword({ formData, cb, cbErr }) {
  yield put(setLoading(true));

  try {
    const resData = yield call(resetPasswordApi, formData);

    cb(resData?.data?.newPassword);
  } catch (error) {
    if (error?.response?.status === 422) {
      cbErr(error);
    } else {
      yield put(showPopup());
    }
  }

  yield put(setLoading(false));
}

export default function* appSaga() {
  yield takeLatest(SEND_REGISTER_DATA, doRegister);
  yield takeLatest(SEND_LOGIN_DATA, doLogin);
  yield takeLatest(SEND_FORGOT_PASSWORD, doSendForgotPassword);
  yield takeLatest(GET_USER_DATA_INIT, doGetUserData);
}
