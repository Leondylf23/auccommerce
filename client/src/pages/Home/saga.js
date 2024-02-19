import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { getAllProducts, getBestSeller, getMyAllProducts } from '@domain/api';
import { GET_BEST_SELLER, GET_MY_PRODUCTS_DATA, GET_PRODUCTS_DATA } from './constants';
import { setBestSeller, setProductsData } from './actions';

function* doGetProductData({ formData }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getAllProducts, formData);
    yield put(setProductsData(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doGetMyProductData({ formData }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getMyAllProducts, formData);
    yield put(setProductsData(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doGetBestSeller() {
  yield put(setLoading(true));

  try {
    const res = yield call(getBestSeller);
    yield put(setBestSeller(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* homeSaga() {
  yield takeLatest(GET_PRODUCTS_DATA, doGetProductData);
  yield takeLatest(GET_MY_PRODUCTS_DATA, doGetMyProductData);
  yield takeLatest(GET_BEST_SELLER, doGetBestSeller);
}
