import {
  CREATE_NEW_PRODUCT,
  DELETE_PRODUCT,
  GET_MY_PRODUCT_DETAIL,
  SET_MY_PRODUCT_DETAIL,
  UPDATE_PRODUCT,
} from './constants';

export const getMyProductDetail = (formData, cbError) => ({
  type: GET_MY_PRODUCT_DETAIL,
  formData,
  cbError,
});

export const setMyProductDetail = (data) => ({
  type: SET_MY_PRODUCT_DETAIL,
  data,
});

export const createNewProduct = (formData, cb) => ({
  type: CREATE_NEW_PRODUCT,
  formData,
  cb,
});

export const updateProduct = (formData, cb) => ({
  type: UPDATE_PRODUCT,
  formData,
  cb,
});

export const deleteProduct = (formData, cb) => ({
  type: DELETE_PRODUCT,
  formData,
  cb,
});
