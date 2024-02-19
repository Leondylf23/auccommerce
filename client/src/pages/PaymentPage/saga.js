import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import { decryptDataAES } from '@utils/allUtils';
import { createOrderingApi, getAllCouponsByProductId } from '@domain/api';

import { GET_COUPONS_DATA, SEND_ORDERING_DATA } from './constants';
import { setCouponsData } from './actions';

function* doGetCouponDatas({ formData }) {
  yield put(setLoading(true));
  try {
    const res = yield call(getAllCouponsByProductId, formData);
    const decryptPrice = res?.data?.map((coupon) => ({
      ...coupon,
      priceCut: parseFloat(decryptDataAES(coupon?.priceCut)),
    }));

    yield put(setCouponsData(decryptPrice));
  } catch (error) {
    yield put(showPopup());
  }
  yield put(setLoading(false));
}

function* doSendOrderingData({ formData, cb }) {
  yield put(setLoading(true));
  try {
    yield call(createOrderingApi, formData);

    cb();
  } catch (error) {
    yield put(showPopup());
  }
  yield put(setLoading(false));
}

export default function* paymentPageSaga() {
  yield takeLatest(GET_COUPONS_DATA, doGetCouponDatas);
  yield takeLatest(SEND_ORDERING_DATA, doSendOrderingData);
}
