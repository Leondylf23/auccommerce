import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup } from '@containers/App/actions';
import { getMyBidsApi, sendCompleteStatusApi } from '@domain/api';
import { resetMyBids, setMyBids } from './actions';
import { GET_MY_BIDS, SEND_COMPLETE_ORDER } from './constants';

function* doGetMyBids({ formData, isReset, cb, cbErr }) {
  try {
    const res = yield call(getMyBidsApi, formData);

    if (isReset) yield put(resetMyBids());
    yield put(setMyBids(res?.data?.datas));
    cb(res?.data?.nextId);
  } catch (error) {
    yield put(showPopup());
    cbErr(error);
  }
}

function* doSendCompleteOrder({ formData, cb }) {
  try {
    yield call(sendCompleteStatusApi, formData);

    cb && cb(null);
  } catch (error) {
    yield put(showPopup());
    cb && cb(error);
  }
}

export default function* myBidsSaga() {
  yield takeLatest(GET_MY_BIDS, doGetMyBids);
  yield takeLatest(SEND_COMPLETE_ORDER, doSendCompleteOrder);
}
