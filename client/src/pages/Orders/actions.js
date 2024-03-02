import { GET_ORDERS, GET_ORDER_DETAIL, RESET_ORDERS, SEND_PROCESS_STATUS, SET_ORDERS } from './constants';

export const getOrders = (formData, isReset, cb, cbErr) => ({
  type: GET_ORDERS,
  formData,
  isReset,
  cb,
  cbErr,
});

export const setOrders = (data) => ({
  type: SET_ORDERS,
  data,
});

export const resetOrders = () => ({
  type: RESET_ORDERS,
});

export const getOrderDetail = (formData, cb) => ({
  type: GET_ORDER_DETAIL,
  formData,
  cb,
});

export const sendProcessStatus = (formData) => ({
  type: SEND_PROCESS_STATUS,
  formData,
});
