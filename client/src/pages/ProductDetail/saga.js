import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { GET_PRODUCT_DATA } from './constants';
import { getProductDetailApi } from '@domain/api';
import { setProductData } from './actions';

function* doGetProductData({ formData, cbNotFound }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getProductDetailApi, formData);

    yield put(setProductData(res?.data));
  } catch (error) {
    if (error?.response?.status === 404) {
      cbNotFound();
      return;
    }
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* productDetailSaga() {
  yield takeLatest(GET_PRODUCT_DATA, doGetProductData);
}
