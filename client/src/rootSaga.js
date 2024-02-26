import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import homeSaga from '@pages/Home/saga';
import profileSaga from '@pages/Profile/saga';
import itemDetailSaga from '@pages/ItemDetail/saga';
import myBidsSaga from '@pages/MyBids/saga';
import bidDetailSaga from '@pages/MyBidDetail/saga';
import paymentPageSaga from '@pages/Payment/saga';
import myAuctionsSaga from '@pages/MyAuctions/saga';
import clientSaga from '@containers/Client/saga';
import auctionFormSaga from '@pages/AuctionForm/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    homeSaga(),
    clientSaga(),
    profileSaga(),
    itemDetailSaga(),
    myBidsSaga(),
    bidDetailSaga(),
    paymentPageSaga(),
    myAuctionsSaga(),
    auctionFormSaga(),
  ]);
}
