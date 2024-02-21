import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup } from '@containers/App/actions';
import { resetSearchItems, setCategory, setFiveMoreMinBids, setLatestBidData, setSearchItems } from './actions';
import { GET_CATEGORY, GET_FIVE_MORE_MIN_BID, GET_ITEM_SEARCH, GET_LATEST_BID_DATA } from './constants';

function* doGetLatestBidData({ cbSuccess, cbError }) {
  try {
    // yield call();

    const exampleData = [
      {
        id: 1,
        itemName: 'test item asdwwd adw asd wasd',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
    ];

    yield put(setLatestBidData(exampleData));
    cbSuccess();
  } catch (error) {
    yield put(showPopup());
    cbError(error);
  }
}

function* doGetFiveMoreMinBids({ cbSuccess, cbError }) {
  try {
    // yield call();

    const exampleData = [
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
    ];

    yield put(setFiveMoreMinBids(exampleData));
    cbSuccess();
  } catch (error) {
    yield put(showPopup());
    cbError(error);
  }
}

function* doGetCategoryData({ cbSuccess, cbError }) {
  try {
    // yield call();

    const exampleData = [
      {
        id: 1,
        pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        name: 'Electronics',
      },
      {
        id: 2,
        pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        name: 'Vehicles',
      },
      {
        id: 3,
        pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        name: 'Jewerly',
      },
      {
        id: 4,
        pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        name: 'Hobbies',
      },
      {
        id: 5,
        pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        name: 'Other',
      },
    ];

    yield put(setCategory(exampleData));
    cbSuccess();
  } catch (error) {
    yield put(showPopup());
    cbError(error);
  }
}

function* doGetSearchItems({ formData, isReset, cbSuccess, cbError }) {
  try {
    // yield call();

    const nextOffset = null;

    const exampleData = [
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
      {
        id: 1,
        itemName: 'test item',
        itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
        startingBid: 1000,
        endBid: '2024-02-29 00:00:00',
      },
    ];

    if (isReset) yield put(resetSearchItems());
    yield put(setSearchItems(exampleData));
    cbSuccess(nextOffset);
  } catch (error) {
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
