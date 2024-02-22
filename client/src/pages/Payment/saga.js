import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { setBidDetailData, setUserAddresses } from './actions';
import { GET_BID_DETAIL_DATA, GET_USER_ADDRESSES } from './constants';

function* doGetBidDetailData({ formData, cb, cbErr }) {
  try {
    // yield call();
    const exampleData = {
      bidPrice: 123123,
    };

    yield put(setBidDetailData(exampleData));
    cb();
  } catch (error) {
    yield put(showPopup());
    cbErr(error);
  }
}

function* doGetUserAddresses() {
  yield put(setLoading(true));

  try {
    // yield call();
    const exampleData = [
      {
        id: 1,
        label: 'rumah aja',
        address: 'jln. jalan jalna aja',
      },
      {
        id: 2,
        label: 'rumah aja 2',
        address: 'jln. jalan jalna aja',
      },
      {
        id: 3,
        label: 'rumah aja 3',
        address: 'jln. jalan jalna aja',
      },
    ];
    yield put(setUserAddresses(exampleData));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* paymentPageSaga() {
  yield takeLatest(GET_BID_DETAIL_DATA, doGetBidDetailData);
  yield takeLatest(GET_USER_ADDRESSES, doGetUserAddresses);
}
