import { DELETE_AUCTION_DATA, GET_AUCTION_DETAIL, SAVE_AUCTION_DATA, SET_AUCTION_DETAIL } from './constants';

export const getAuctionDetailData = (formData) => ({
  type: GET_AUCTION_DETAIL,
  formData,
});

export const setAuctionDetailData = (data) => ({
  type: SET_AUCTION_DETAIL,
  data,
});

export const saveAuctionData = (formData, isEdit, cb) => ({
  type: SAVE_AUCTION_DATA,
  formData,
  isEdit,
  cb,
});

export const deleteAuctionData = (formData, cb) => ({
  type: DELETE_AUCTION_DATA,
  formData,
  cb,
});
