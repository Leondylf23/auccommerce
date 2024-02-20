import { GET_ITEM_DETAIL, SET_ITEM_DETAIL } from './constants';

export const getItemDetail = (formData) => ({
  type: GET_ITEM_DETAIL,
  formData,
});

export const setItemDetail = (data) => ({
  type: SET_ITEM_DETAIL,
  data,
});
