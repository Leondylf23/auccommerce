import { produce } from 'immer';
import { SET_BID_DETAIL_DATA, SET_PAYMENT_DATA, SET_USER_ADDRESSES } from './constants';

export const initialState = {
  bidDetailData: [],
  paymentData: null,
  addressList: [],
  addressProviders: [],
  paymentMethods: [],
};

export const storedKey = ['paymentData'];

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
    }
  });

export default paymentPageReducer;
