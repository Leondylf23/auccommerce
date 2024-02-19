import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { createNewProduct, deleteProductApi, getMyProductDetailApi, updateProductApi } from '@domain/api';
import { CREATE_NEW_PRODUCT, DELETE_PRODUCT, GET_MY_PRODUCT_DETAIL, UPDATE_PRODUCT } from './constants';
import { setMyProductDetail } from './actions';

function* doCreateNewProduct({ formData, cb }) {
  yield put(setLoading(true));

  try {
    const res = yield call(createNewProduct, formData);

    cb(res?.data?.createdId);
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doGetMyProductDetail({ formData, cbError }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getMyProductDetailApi, formData);

    yield put(setMyProductDetail(res?.data));
  } catch (error) {
    cbError();
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doUpdateProduct({ formData, cb }) {
  yield put(setLoading(true));

  try {
    const res = yield call(updateProductApi, formData);
    yield put(setMyProductDetail(res?.data?.updatedData));

    cb();
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doDeleteProduct({ formData, cb }) {
  yield put(setLoading(true));

  try {
    yield call(deleteProductApi, formData);

    cb();
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* productCreationSaga() {
  yield takeLatest(CREATE_NEW_PRODUCT, doCreateNewProduct);
  yield takeLatest(GET_MY_PRODUCT_DETAIL, doGetMyProductDetail);
  yield takeLatest(UPDATE_PRODUCT, doUpdateProduct);
  yield takeLatest(DELETE_PRODUCT, doDeleteProduct);
}
