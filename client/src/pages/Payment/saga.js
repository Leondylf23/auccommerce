import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { getUserAddressData } from '@domain/api';
import {
  setBidDetailData,
  setPaymentMethods,
  setShippingProviderData,
  setShippingProviders,
  setUserAddresses,
} from './actions';
import {
  GET_BID_DETAIL_DATA,
  GET_PAYMENT_METHODS,
  GET_SHIPPING_PROVIDERS,
  GET_SHIPPING_PROVIDER_DATA,
  GET_USER_ADDRESSES,
} from './constants';

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
    const res = yield call(getUserAddressData);
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
    yield put(setUserAddresses(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doGetShippingProviders() {
  yield put(setLoading(true));

  try {
    // yield call();
    const exampleData = [
      {
        id: 1,
        name: 'JNE',
      },
      {
        id: 2,
        name: 'JNT',
      },
      {
        id: 3,
        name: 'Ninja Express',
      },
    ];
    yield put(setShippingProviders(exampleData));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doGetProviderData({ formData }) {
  yield put(setLoading(true));

  try {
    // yield call();
    const exampleData = {
      price: 31230,
    };
    yield put(setShippingProviderData(exampleData));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doGetPaymentMethods({ formData }) {
  yield put(setLoading(true));

  try {
    // yield call();
    const exampleData = [
      { id: 1, name: 'OVO', logo: 'https://d3fkkqa7lc3d5k.cloudfront.net/PRF-1-file_datas-IMG_2204.jpeg' },
      { id: 2, name: 'Gopay', logo: 'https://d3fkkqa7lc3d5k.cloudfront.net/PRF-1-file_datas-IMG_2204.jpeg' },
      { id: 3, name: 'Dana', logo: 'https://d3fkkqa7lc3d5k.cloudfront.net/PRF-1-file_datas-IMG_2204.jpeg' },
      { id: 4, name: 'ShopeePay', logo: 'https://d3fkkqa7lc3d5k.cloudfront.net/PRF-1-file_datas-IMG_2204.jpeg' },
    ];
    yield put(setPaymentMethods(exampleData));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* paymentPageSaga() {
  yield takeLatest(GET_BID_DETAIL_DATA, doGetBidDetailData);
  yield takeLatest(GET_USER_ADDRESSES, doGetUserAddresses);
  yield takeLatest(GET_SHIPPING_PROVIDERS, doGetShippingProviders);
  yield takeLatest(GET_SHIPPING_PROVIDER_DATA, doGetProviderData);
  yield takeLatest(GET_PAYMENT_METHODS, doGetPaymentMethods);
}
