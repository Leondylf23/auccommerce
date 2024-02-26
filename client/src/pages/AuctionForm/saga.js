import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { getAuctionDetailApi, saveEditAuctionDataApi, saveNewAuctionDataApi } from '@domain/api';
import { setAuctionData } from './actions';
import { GET_AUCTION_DETAIL, SAVE_AUCTION_DATA } from './constants';

function* doGetAuctionDetailData({ formData }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getAuctionDetailApi, formData);

    yield put(setAuctionData(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doSaveAuctionData({ formData, isEdit, cb }) {
  yield put(setLoading(true));

  try {
    if (isEdit) {
      yield call(saveEditAuctionDataApi, formData);
      cb(null, null);
    } else {
      const res = yield call(saveNewAuctionDataApi, formData);
      cb(null, res?.createdId);
    }
  } catch (error) {
    yield put(showPopup());

    cb(error, null);
  }

  yield put(setLoading(false));
}

export default function* auctionFormSaga() {
  yield takeLatest(GET_AUCTION_DETAIL, doGetAuctionDetailData);
  yield takeLatest(SAVE_AUCTION_DATA, doSaveAuctionData);
}
