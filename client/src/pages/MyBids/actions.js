import { GET_MY_BIDS, RESET_MY_BIDS, SEND_COMPLETE_ORDER, SET_MY_BIDS } from './constants';

export const getMyBids = (formData, isReset, cb, cbErr) => ({
  type: GET_MY_BIDS,
  formData,
  isReset,
  cb,
  cbErr,
});

export const setMyBids = (data) => ({
  type: SET_MY_BIDS,
  data,
});

export const resetMyBids = () => ({
  type: RESET_MY_BIDS,
});

export const sendCompleteOrder = (formData, cb) => ({
  type: SEND_COMPLETE_ORDER,
  formData,
  cb,
});
