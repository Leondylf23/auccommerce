import { GET_MY_BIDS, RESET_MY_BIDS, SET_MY_BIDS } from './constants';

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
