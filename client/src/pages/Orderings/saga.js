import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import {
  getOrderingDetailApi,
  getAllOrderingsApi,
  getAllBusinessOrderingsApi,
  getBusinessOrderingDetailApi,
  updateOrderingStatusApi,
} from '@domain/api';
import { GET_ORDERING_DATA, GET_ORDERING_DETAIL_DATA, UPDATE_ORDERING_STATUS } from './constants';
import { setOrderingDetailData, setOrderingsData } from './actions';

function* doGetOrderingData({ isBusiness }) {
  yield put(setLoading(true));

  try {
    const res = yield call(isBusiness ? getAllBusinessOrderingsApi : getAllOrderingsApi);

    yield put(setOrderingsData(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doGetOrderingDetailData({ formData, isBusiness }) {
  yield put(setLoading(true));

  try {
    const res = yield call(isBusiness ? getBusinessOrderingDetailApi : getOrderingDetailApi, formData);

    yield put(setOrderingDetailData(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doUpdateOrderingStatus({ formData, cb }) {
  yield put(setLoading(true));

  try {
    yield call(updateOrderingStatusApi, formData);

    cb();
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* orderingsSaga() {
  yield takeLatest(GET_ORDERING_DATA, doGetOrderingData);
  yield takeLatest(GET_ORDERING_DETAIL_DATA, doGetOrderingDetailData);
  yield takeLatest(UPDATE_ORDERING_STATUS, doUpdateOrderingStatus);
}
