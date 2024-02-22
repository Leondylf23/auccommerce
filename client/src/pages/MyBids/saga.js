import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup } from '@containers/App/actions';
import { resetMyBids, setMyBids } from './actions';
import { GET_MY_BIDS } from './constants';

function* doGetMyBids({ formData, isReset, cb, cbErr }) {
  try {
    // yield call();
    const exampleData = [
      {
        id: 1,
        itemName: 'Item aja',
        itemImage: 'https://d2kwwar9pcd0an.cloudfront.net/6b9a7820fd8161e906f76e45aa152f00.jpeg',
        status: 'WAITING',
        price: 123133,
      },
      {
        id: 2,
        itemName: 'Item aja aaa',
        itemImage: 'https://d2kwwar9pcd0an.cloudfront.net/6b9a7820fd8161e906f76e45aa152f00.jpeg',
        status: 'SUCCESS',
        price: 123133,
      },
      {
        id: 3,
        itemName: 'Item aja aa1',
        itemImage: 'https://d2kwwar9pcd0an.cloudfront.net/6b9a7820fd8161e906f76e45aa152f00.jpeg',
        status: 'FAILED',
        price: 123133,
      },
    ];

    if (isReset) yield put(resetMyBids());
    yield put(setMyBids(exampleData));
    cb();
  } catch (error) {
    yield put(showPopup());
    cbErr(error);
  }
}

export default function* myBidsSaga() {
  yield takeLatest(GET_MY_BIDS, doGetMyBids);
}
