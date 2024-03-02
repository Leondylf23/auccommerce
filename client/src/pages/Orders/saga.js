import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup } from '@containers/App/actions';
import { getOrderDetailApi, getOrdersApi } from '@domain/api';
import { resetOrders, setOrders } from './actions';
import { GET_ORDERS, GET_ORDER_DETAIL } from './constants';

function* doGetOrders({ formData, isReset, cb, cbErr }) {
  try {
    const res = yield call(getOrdersApi, formData);

    if (isReset) yield put(resetOrders());
    yield put(setOrders(res?.data?.datas));
    cb && cb(res?.data?.nextId);
  } catch (error) {
    yield put(showPopup());
    cbErr && cbErr(error);
  }
}

function* doGetOrderDetail({ formData, cb }) {
  try {
    const res = yield call(getOrderDetailApi, formData);

    cb && cb(res?.data, null);
  } catch (error) {
    yield put(showPopup());
    cb && cb(null, error);
  }
}

export default function* ordersSaga() {
  yield takeLatest(GET_ORDERS, doGetOrders);
  yield takeLatest(GET_ORDER_DETAIL, doGetOrderDetail);
}
