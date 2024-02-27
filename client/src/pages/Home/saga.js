import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup } from '@containers/App/actions';
import { getAllAuctionsApi, getCategoriesApi, getFiveMinAuctionApi, getLatestAuctionApi } from '@domain/api';
import { resetSearchItems, setCategory, setFiveMoreMinBids, setLatestBidData, setSearchItems } from './actions';
import { GET_CATEGORY, GET_FIVE_MORE_MIN_BID, GET_ITEM_SEARCH, GET_LATEST_BID_DATA } from './constants';

function* doGetLatestBidData({ cbSuccess, cbError }) {
  try {
    const res = yield call(getLatestAuctionApi);

    yield put(setLatestBidData(res?.data));
    cbSuccess();
  } catch (error) {
    yield put(showPopup());
    cbError(error);
  }
}

function* doGetFiveMoreMinBids({ cbSuccess, cbError }) {
  try {
    const res = yield call(getFiveMinAuctionApi);

    yield put(setFiveMoreMinBids(res?.data));
    cbSuccess();
  } catch (error) {
    yield put(showPopup());
    cbError(error);
  }
}

function* doGetCategoryData({ cbSuccess, cbError }) {
  try {
    const res = yield call(getCategoriesApi);

    yield put(setCategory(res?.data));
    cbSuccess();
  } catch (error) {
    yield put(showPopup());
    cbError(error);
  }
}

function* doGetSearchItems({ formData, isReset, cbSuccess, cbError }) {
  try {
    const res = yield call(getAllAuctionsApi, formData);

    if (isReset) yield put(resetSearchItems());
    yield put(setSearchItems(res?.data?.datas));
    cbSuccess(res?.data?.nextId);
  } catch (error) {
    console.log(error);
    yield put(showPopup());
    cbError(error);
  }
}

export default function* homeSaga() {
  yield takeLatest(GET_LATEST_BID_DATA, doGetLatestBidData);
  yield takeLatest(GET_FIVE_MORE_MIN_BID, doGetFiveMoreMinBids);
  yield takeLatest(GET_CATEGORY, doGetCategoryData);
  yield takeLatest(GET_ITEM_SEARCH, doGetSearchItems);
}
