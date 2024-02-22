import { GET_BID_DETAIL, SET_BID_DETAIL } from './constants';

export const getBidDetail = (formData) => ({
  type: GET_BID_DETAIL,
  formData,
});

export const setBidDetail = (data) => ({
  type: SET_BID_DETAIL,
  data,
});
