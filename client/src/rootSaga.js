import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import paymentPageSaga from '@pages/PaymentPage/saga';
import productDetailSaga from '@pages/ProductDetail/saga';
import orderingsSaga from '@pages/Orderings/saga';
import productCreationSaga from '@pages/ProductCreation/saga';
import homeSaga from '@pages/Home/saga';
import profileSaga from '@pages/Profile/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    paymentPageSaga(),
    productDetailSaga(),
    orderingsSaga(),
    productCreationSaga(),
    homeSaga(),
    profileSaga(),
  ]);
}
