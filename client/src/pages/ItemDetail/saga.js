import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { getAuctionItemDetailApi } from '@domain/api';
import { setItemDetail } from './actions';
import { GET_ITEM_DETAIL } from './constants';

function* doGetItemData({ formData }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getAuctionItemDetailApi, formData);

    yield put(setItemDetail(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* itemDetailSaga() {
  yield takeLatest(GET_ITEM_DETAIL, doGetItemData);
}
