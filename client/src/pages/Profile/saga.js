import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import {
  changePasswordApi,
  deleteUserAddressApi,
  getUserAddressData,
  getUserProfileData,
  saveProfileDataApi,
} from '@domain/api';
import {
  DELETE_ADDRESS_DATA,
  GET_PROFILE_DATA,
  GET_USER_ADDRESS_DATA,
  SAVE_NEW_PASSWORD,
  SAVE_PROFILE_DATA,
} from './constants';
import { setProfileData, setUserAddresses } from './actions';

function* doGetProfileData() {
  yield put(setLoading(true));

  try {
    const res = yield call(getUserProfileData);

    yield put(setProfileData(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doGetProfileAddresses({ cb }) {
  try {
    const res = yield call(getUserAddressData);

    yield put(setUserAddresses(res?.data));
    cb(null);
  } catch (error) {
    yield put(showPopup());
    cb(error);
  }
}

function* doSaveProfileData({ formData, cb }) {
  yield put(setLoading(true));

  try {
    const res = yield call(saveProfileDataApi, formData);

    cb(res?.data?.imageUpdate);
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doChangePassword({ formData, cb, cbErr }) {
  yield put(setLoading(true));

  try {
    yield call(changePasswordApi, formData);

    cb();
  } catch (error) {
    if (error?.response?.status === 401) {
      cbErr();
    } else {
      yield put(showPopup());
    }
  }

  yield put(setLoading(false));
}

function* doDeleteAddress({ formData, cb }) {
  yield put(setLoading(true));

  try {
    yield call(deleteUserAddressApi, formData);

    cb(null);
  } catch (error) {
    yield put(showPopup());
    cb(error);
  }

  yield put(setLoading(false));
}

export default function* profileSaga() {
  yield takeLatest(GET_PROFILE_DATA, doGetProfileData);
  yield takeLatest(SAVE_PROFILE_DATA, doSaveProfileData);
  yield takeLatest(SAVE_NEW_PASSWORD, doChangePassword);
  yield takeLatest(GET_USER_ADDRESS_DATA, doGetProfileAddresses);
  yield takeLatest(DELETE_ADDRESS_DATA, doDeleteAddress);
}
