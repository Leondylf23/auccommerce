import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { deleteAuctionDataApi, getAuctionDetailApi, saveEditAuctionDataApi, saveNewAuctionDataApi } from '@domain/api';
import { setAuctionDetailData } from './actions';
import { DELETE_AUCTION_DATA, GET_AUCTION_DETAIL, SAVE_AUCTION_DATA } from './constants';

function* doGetAuctionDetailData({ formData }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getAuctionDetailApi, formData);

    yield put(setAuctionDetailData(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doSaveAuctionData({ formData, isEdit, cb }) {
  yield put(setLoading(true));

  try {
    if (isEdit) {
      const res = yield call(saveEditAuctionDataApi, formData);

      yield put(setAuctionDetailData(res?.data?.updatedData));
      cb(null, null);
    } else {
      const res = yield call(saveNewAuctionDataApi, formData);
      cb(null, res?.data?.createdId);
    }
  } catch (error) {
    yield put(showPopup());

    cb(error, null);
  }

  yield put(setLoading(false));
}

function* doDeleteAuctionData({ formData, cb }) {
  yield put(setLoading(true));

  try {
    yield call(deleteAuctionDataApi, formData);

    cb(null);
  } catch (error) {
    yield put(showPopup());

    cb(error);
  }

  yield put(setLoading(false));
}

export default function* auctionFormSaga() {
  yield takeLatest(GET_AUCTION_DETAIL, doGetAuctionDetailData);
  yield takeLatest(SAVE_AUCTION_DATA, doSaveAuctionData);
  yield takeLatest(DELETE_AUCTION_DATA, doDeleteAuctionData);
}
