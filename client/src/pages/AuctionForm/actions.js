import { GET_AUCTION_DETAIL, SAVE_AUCTION_DATA, SET_AUCTION_DETAIL } from './constants';

export const getAuctionData = (formData) => ({
  type: GET_AUCTION_DETAIL,
  formData,
});

export const setAuctionData = (data) => ({
  type: SET_AUCTION_DETAIL,
  data,
});

export const saveAuctionData = (formData, isEdit, cb) => ({
  type: SAVE_AUCTION_DATA,
  formData,
  isEdit,
  cb,
});
