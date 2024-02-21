import {
  GET_CATEGORY,
  GET_FIVE_MORE_MIN_BID,
  GET_ITEM_SEARCH,
  GET_LATEST_BID_DATA,
  RESET_ITEM_SEARCH,
  SET_CATEGORY,
  SET_FIVE_MORE_MIN_BID,
  SET_ITEM_SEARCH,
  SET_LATEST_BID_DATA,
} from './constants';

export const getLatestBidData = (cbSuccess, cbError) => ({
  type: GET_LATEST_BID_DATA,
  cbSuccess,
  cbError,
});

export const setLatestBidData = (data) => ({
  type: SET_LATEST_BID_DATA,
  data,
});

export const getFiveMoreMinBids = (cbSuccess, cbError) => ({
  type: GET_FIVE_MORE_MIN_BID,
  cbSuccess,
  cbError,
});

export const setFiveMoreMinBids = (data) => ({
  type: SET_FIVE_MORE_MIN_BID,
  data,
});

export const getCategory = (cbSuccess, cbError) => ({
  type: GET_CATEGORY,
  cbSuccess,
  cbError,
});

export const setCategory = (data) => ({
  type: SET_CATEGORY,
  data,
});

export const getSearchItems = (formData, isReset, cbSuccess, cbError) => ({
  type: GET_ITEM_SEARCH,
  formData,
  isReset,
  cbSuccess,
  cbError,
});

export const setSearchItems = (data) => ({
  type: SET_ITEM_SEARCH,
  data,
});

export const resetSearchItems = () => ({
  type: RESET_ITEM_SEARCH,
});
