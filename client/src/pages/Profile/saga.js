import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { GET_PROFILE_DATA, SAVE_NEW_PASSWORD, SAVE_PROFILE_DATA } from './constants';
import { changePasswordApi, getUserProfileData, saveProfileDataApi } from '@domain/api';
import { setProfileData } from './actions';

function* doGetProfileData({  }) {
    yield put(setLoading(true));

    try {
        const res = yield call(getUserProfileData);

        yield put(setProfileData(res?.data));
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doSaveProfileData({ formData, cb }) {
    yield put(setLoading(true));

    try {
        const res = yield call(saveProfileDataApi, formData);

        cb(res?.data?.imageUpdate);
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doChangePassword({ formData, cb, cbErr }) {
    yield put(setLoading(true));

    try {
        yield call(changePasswordApi, formData);

        cb();
    } catch (error) {
        if(error?.response?.status === 401) {
            cbErr();
        } else {
            yield put(showPopup());
        }
    }

    yield put(setLoading(false));
}

export default function* profileSaga() {
    yield takeLatest(GET_PROFILE_DATA, doGetProfileData);
    yield takeLatest(SAVE_PROFILE_DATA, doSaveProfileData);
    yield takeLatest(SAVE_NEW_PASSWORD, doChangePassword);
}
