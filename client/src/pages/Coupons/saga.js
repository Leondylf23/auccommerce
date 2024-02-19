import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { CREATE_NEW_COUPON, DELETE_COUPON, GET_COUPONS_DATA } from './constants';
import { createNewCoupon, deleteCoupon, getAllCoupons } from '@domain/api';
import { setCouponsData } from './actions';

function* doGetCouponsData({ }) {
    yield put(setLoading(true));

    try {
        const res = yield call(getAllCoupons);

        yield put(setCouponsData(res?.data));
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doCreateCoupon({ formData, cb }) {
    yield put(setLoading(true));

    try {
        yield call(createNewCoupon, formData);

        cb();
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doDeleteCoupon({ formData, cb }) {
    yield put(setLoading(true));

    try {
        yield call(deleteCoupon, formData);

        cb();
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

export default function* couponsSaga() {
    yield takeLatest(GET_COUPONS_DATA, doGetCouponsData);
    yield takeLatest(CREATE_NEW_COUPON, doCreateCoupon);
    yield takeLatest(DELETE_COUPON, doDeleteCoupon);
}
