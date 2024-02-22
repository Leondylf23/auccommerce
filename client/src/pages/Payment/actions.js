import {
  GET_BID_DETAIL_DATA,
  GET_USER_ADDRESSES,
  SET_BID_DETAIL_DATA,
  SET_PAYMENT_DATA,
  SET_USER_ADDRESSES,
} from './constants';

export const getBidDetailData = (formData) => ({
  type: GET_BID_DETAIL_DATA,
  formData,
});

export const setBidDetailData = (data) => ({
  type: SET_BID_DETAIL_DATA,
  data,
});

export const setPaymentDetail = (data) => ({
  type: SET_PAYMENT_DATA,
  data,
});

export const getUserAddresses = () => ({
  type: GET_USER_ADDRESSES,
});

export const setUserAddresses = (data) => ({
  type: SET_USER_ADDRESSES,
  data,
});
