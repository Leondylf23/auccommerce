import { GET_MY_AUCTIONS, RESET_MY_AUCTIONS, SET_MY_AUCTIONS } from './constants';

export const getMyAuctions = (formData, cb, cbErr) => ({
  type: GET_MY_AUCTIONS,
  formData,
  cb,
  cbErr,
});

export const setMyAuctions = (data) => ({
  type: SET_MY_AUCTIONS,
  data,
});

export const resetMyAuctions = () => ({
  type: RESET_MY_AUCTIONS,
});
