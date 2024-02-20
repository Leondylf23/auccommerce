import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import homeSaga from '@pages/Home/saga';
import profileSaga from '@pages/Profile/saga';
import itemDetailSaga from '@pages/ItemDetail/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    homeSaga(),
    profileSaga(),
    itemDetailSaga()
  ]);
}
