import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { getMyAuctionsApi } from '@domain/api';
import { setMyAuctions } from './actions';
import { GET_MY_AUCTIONS } from './constants';

function* doGetMyAuctions({ formData, cb, cbErr }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getMyAuctionsApi, formData);

    yield put(setMyAuctions(res?.data?.datas));
    cb(res?.data?.nextId);
  } catch (error) {
    cbErr(error);
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* myAuctionsSaga() {
  yield takeLatest(GET_MY_AUCTIONS, doGetMyAuctions);
}
