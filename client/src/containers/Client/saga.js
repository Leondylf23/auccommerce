import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { saveUserAddressEditApi, saveUserAddressNewApi } from '@domain/api';
import { SAVE_USER_ADDRESS } from './constants';

function* doSaveAddress({ isEdit, formData, cb }) {
  yield put(setLoading(true));

  try {
    if (isEdit) {
      yield call(saveUserAddressEditApi, formData);
    } else {
      yield call(saveUserAddressNewApi, formData);
    }

    cb(null);
  } catch (error) {
    yield put(showPopup());
    cb(error);
  }

  yield put(setLoading(false));
}

export default function* clientSaga() {
  yield takeLatest(SAVE_USER_ADDRESS, doSaveAddress);
}
