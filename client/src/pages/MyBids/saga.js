import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup } from '@containers/App/actions';
import { getMyBidsApi } from '@domain/api';
import { resetMyBids, setMyBids } from './actions';
import { GET_MY_BIDS } from './constants';

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

export default function* myBidsSaga() {
  yield takeLatest(GET_MY_BIDS, doGetMyBids);
}
