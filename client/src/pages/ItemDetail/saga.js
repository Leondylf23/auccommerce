import { takeLatest, call, put } from 'redux-saga/effects';
import { setItemDetail } from './actions';
import { setLoading, showPopup } from '@containers/App/actions';

function* doGetItemData({ formData }) {
  yield put(setLoading(true));

  try {
    // yield call();
    yield put(setItemDetail({}));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(true));
}

export default function* itemDetailSaga() {
    
}
