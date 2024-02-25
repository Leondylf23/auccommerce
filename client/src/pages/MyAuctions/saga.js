import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { setMyAuctions } from './actions';
import { GET_MY_AUCTIONS } from './constants';

function* doGetMyAuctions({ formData, cb, cbErr }) {
  yield put(setLoading(true));

  try {
    // yield call();
    const exampleData = [
      {
        id: 1,
        itemName: 'test data',
        itemImage: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        endsOn: '2024-03-01 01:02:01',
        price: 123123,
        status: 'LIVE',
        createdAt: '2024-03-01 01:02:01',
      },
      {
        id: 1,
        itemName: 'test data',
        itemImage: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        endsOn: '2024-03-01 01:02:01',
        price: 123123,
        status: 'LIVE',
        createdAt: '2024-03-01 01:02:01',
      },
      {
        id: 1,
        itemName: 'test data',
        itemImage: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        endsOn: '2024-03-01 01:02:01',
        price: 123123,
        status: 'LIVE',
        createdAt: '2024-03-01 01:02:01',
      },
      {
        id: 1,
        itemName: 'test data',
        itemImage: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        endsOn: '2024-03-01 01:02:01',
        price: 123123,
        status: 'LIVE',
        createdAt: '2024-03-01 01:02:01',
      },
      {
        id: 1,
        itemName: 'test data',
        itemImage: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        endsOn: '2024-03-01 01:02:01',
        price: 123123,
        status: 'LIVE',
        createdAt: '2024-03-01 01:02:01',
      },
      {
        id: 1,
        itemName: 'test data',
        itemImage: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        endsOn: '2024-03-01 01:02:01',
        price: 123123,
        status: 'LIVE',
        createdAt: '2024-03-01 01:02:01',
      },
    ];

    yield put(setMyAuctions(exampleData));
    cb();
  } catch (error) {
    cbErr(error);
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* myAuctionsSaga() {
  yield takeLatest(GET_MY_AUCTIONS, doGetMyAuctions);
}
