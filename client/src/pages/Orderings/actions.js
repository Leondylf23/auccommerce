import {
  GET_ORDERING_DATA,
  GET_ORDERING_DETAIL_DATA,
  SET_ORDERING_DATA,
  SET_ORDERING_DETAIL_DATA,
  UPDATE_ORDERING_STATUS,
} from './constants';

export const getOrderingsData = (isBusiness) => ({
  type: GET_ORDERING_DATA,
  isBusiness,
});

export const setOrderingsData = (data) => ({
  type: SET_ORDERING_DATA,
  data,
});

export const getOrderingDetailData = (formData, isBusiness) => ({
  type: GET_ORDERING_DETAIL_DATA,
  formData,
  isBusiness,
});

export const setOrderingDetailData = (data) => ({
  type: SET_ORDERING_DETAIL_DATA,
  data,
});

export const updateOrderingStatus = (formData, cb) => ({
  type: UPDATE_ORDERING_STATUS,
  formData,
  cb,
});
