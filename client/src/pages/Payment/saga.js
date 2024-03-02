import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { decryptDataAES } from '@utils/allUtils';
import {
  appendFormDataApi,
  completeFormDataApi,
  getCheckFormApi,
  getFormDataInfoApi,
  getFormSummaryApi,
  getPaymentMethodsApi,
  getShipProvidersApi,
  getUserAddressData,
} from '@domain/api';
import { setPaymentMethods, setShippingProviders, setStepData, setTokenData, setUserAddresses } from './actions';
import {
  APPEND_PAYMENT_FORM,
  COMPLETE_PAYMENT_FORM,
  GET_CHECK_FROM_PAYMENT,
  GET_FORM_DATA,
  GET_FORM_SUMMARY,
  GET_PAYMENT_METHODS,
  GET_SHIPPING_PROVIDERS,
  GET_USER_ADDRESSES,
} from './constants';

function* doGetUserAddresses({ cb }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getUserAddressData);
    yield put(setUserAddresses(res?.data));
    cb && cb();
  } catch (error) {
    yield put(showPopup());
    cb && cb(error);
  }

  yield put(setLoading(false));
}

function* doGetShippingProviders({ formData, cb }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getShipProvidersApi, formData);
    const decryptedData = decryptDataAES(res?.data?.providers);
    const parsedData = JSON.parse(decryptedData);

    yield put(setShippingProviders(parsedData));
    cb && cb();
  } catch (error) {
    yield put(showPopup());
    cb && cb(error);
  }

  yield put(setLoading(false));
}

function* doGetPaymentMethods({ formData }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getPaymentMethodsApi, formData);

    yield put(setPaymentMethods(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

function* doCheckFormData({ formData, cb }) {
  yield put(setLoading(true));
  try {
    const res = yield call(getCheckFormApi, formData);

    const nextStep = res?.data?.nextStep;
    yield put(setStepData(res?.data?.nextStep));

    cb && cb(nextStep, null);
  } catch (error) {
    if (error?.response?.status === 400) {
      yield put(setTokenData(null));
      yield put(setStepData(0));

      cb && cb(0, error);
    } else {
      yield put(showPopup());
      cb && cb(null, error);
    }
  }
  yield put(setLoading(false));
}

function* doGetFormSummary({ formData, cb }) {
  yield put(setLoading(true));
  try {
    const res = yield call(getFormSummaryApi, formData);

    if (!res?.data?.formData) throw new Error('Form data is null!');

    const decryptedData = decryptDataAES(res?.data?.formData);
    const parsedData = JSON.parse(decryptedData);
    cb && cb(parsedData, null);
  } catch (error) {
    yield put(showPopup());
    cb && cb(null, error);
  }
  yield put(setLoading(false));
}

function* doGetFormInfoData({ formData, cb }) {
  yield put(setLoading(true));
  try {
    const res = yield call(getFormDataInfoApi, formData);

    if (!res?.data?.formData) throw new Error('Form data is null!');

    const decryptedData = decryptDataAES(res?.data?.formData);
    const parsedData = JSON.parse(decryptedData);
    cb && cb(parsedData, null);
  } catch (error) {
    yield put(showPopup());
    cb && cb(null, error);
  }
  yield put(setLoading(false));
}

function* doAppendFormData({ formData, cb }) {
  yield put(setLoading(true));

  try {
    const res = yield call(appendFormDataApi, formData);

    const nextStep = res?.data?.nextStep;
    const token = res?.data?.newToken;

    if (token) yield put(setTokenData(token));
    yield put(setStepData(nextStep));

    cb && cb(null);
  } catch (error) {
    yield put(showPopup());
    cb && cb(error);
  }

  yield put(setLoading(false));
}

function* doCompleteFormData({ formData, cb }) {
  yield put(setLoading(true));
  try {
    const res = yield call(completeFormDataApi, formData);

    yield put(setTokenData(null));
    yield put(setStepData(0));
    cb && cb(res?.data?.redirectUrl, null);
  } catch (error) {
    yield put(showPopup());
    cb && cb(null, error);
  }
  yield put(setLoading(false));
}

export default function* paymentPageSaga() {
  yield takeLatest(GET_USER_ADDRESSES, doGetUserAddresses);
  yield takeLatest(GET_SHIPPING_PROVIDERS, doGetShippingProviders);

  yield takeLatest(GET_PAYMENT_METHODS, doGetPaymentMethods);

  yield takeLatest(GET_CHECK_FROM_PAYMENT, doCheckFormData);
  yield takeLatest(GET_FORM_DATA, doGetFormInfoData);
  yield takeLatest(GET_FORM_SUMMARY, doGetFormSummary);

  yield takeLatest(APPEND_PAYMENT_FORM, doAppendFormData);
  yield takeLatest(COMPLETE_PAYMENT_FORM, doCompleteFormData);
}
