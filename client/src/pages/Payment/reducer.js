import { produce } from 'immer';
import {
  SET_BID_DETAIL_DATA,
  SET_IS_ANY_CHANGES,
  SET_PAYMENT_DATA,
  SET_PAYMENT_METHODS,
  SET_SHIPPING_PROVIDERS,
  SET_SHIPPING_PROVIDER_DATA,
  SET_STEP_DATA,
  SET_TOKEN_DATA,
  SET_USER_ADDRESSES,
} from './constants';

export const initialState = {
  bidDetailData: [],
  paymentData: null,
  addressList: [],
  shippingProviders: [],
  paymentMethods: [],
  providerData: null,

  paymentToken: null,
  isAnyChanges: false,
  nextStep: 0,
};

export const storedKey = ['paymentToken'];

const paymentPageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_BID_DETAIL_DATA:
        draft.bidDetailData = action.data;
        break;
      case SET_PAYMENT_DATA:
        draft.paymentData = action.data;
        break;
      case SET_USER_ADDRESSES:
        draft.addressList = action.data;
        break;
      case SET_SHIPPING_PROVIDERS:
        draft.shippingProviders = action.data;
        break;
      case SET_SHIPPING_PROVIDER_DATA:
        draft.providerData = action.data;
        break;
      case SET_PAYMENT_METHODS:
        draft.paymentMethods = action.data;
        break;

      case SET_IS_ANY_CHANGES:
        draft.isAnyChanges = action.data;
        break;

      case SET_TOKEN_DATA:
        draft.paymentToken = action.data;
        break;
      case SET_STEP_DATA:
        draft.nextStep = action.data;
        break;
    }
  });

export default paymentPageReducer;
