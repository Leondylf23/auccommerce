import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  ping: 'ping.json',
  login: 'auth/login',
  register: 'auth/register',
  product: 'orderin-aja/product',
  coupons: 'orderin-aja/coupon',
  ordering: 'orderin-aja/order',
  profile: 'auth/profile',
  resetpassword: 'auth/reset-password',
  changepassword: 'auth/change-password',
};

export const callAPI = async (endpoint, method, header = {}, params = {}, data = {}) => {
  const defaultHeader = {
    'Content-Type': 'application/json; charset=UTF-8',
  };

  const headers = merge(defaultHeader, header);
  const options = {
    url: config.api.host + endpoint,
    method,
    headers,
    data,
    params,
  };

  return request(options).then((response) => {
    const responseAPI = response.data;
    return responseAPI;
  });
};

export const ping = () => callAPI(urls.ping, 'get');

// Auth
export const login = (formData) => callAPI(urls.login, 'post', {}, {}, formData);
export const register = (formData) => callAPI(urls.register, 'post', {}, {}, formData);

// Products
export const getAllProducts = (formData) => callAPI(urls.product, 'get', {}, formData);
export const getProductDetailApi = (formData) => callAPI(`${urls.product}/detail`, 'get', {}, formData);
export const getMyAllProducts = (formData) => callAPI(`${urls.product}/my-products`, 'get', {}, formData);
export const getMyProductDetailApi = (formData) => callAPI(`${urls.product}/my-products/detail`, 'get', {}, formData);
export const getBestSeller = () => callAPI(`${urls.product}/best-seller`, 'get');
export const createNewProduct = (formData) =>
  callAPI(
    `${urls.product}/create`,
    'put',
    { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    {},
    formData
  );
export const updateProductApi = (formData) =>
  callAPI(
    `${urls.product}/edit`,
    'patch',
    { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    {},
    formData
  );
export const deleteProductApi = (formData) => callAPI(`${urls.product}/delete`, 'delete', {}, {}, formData);

// Coupons
export const getAllCoupons = () => callAPI(urls.coupons, 'get');
export const getAllCouponsByProductId = (formData) => callAPI(`${urls.coupons}/by-product`, 'get', {}, formData);
export const createNewCoupon = (formData) => callAPI(`${urls.coupons}/create`, 'post', {}, {}, formData);
export const deleteCoupon = (formData) => callAPI(`${urls.coupons}/delete`, 'delete', {}, {}, formData);

// Orderings
export const getAllOrderingsApi = () => callAPI(urls.ordering, 'get');
export const getOrderingDetailApi = (formData) => callAPI(`${urls.ordering}/detail`, 'get', {}, formData);
export const getAllBusinessOrderingsApi = () => callAPI(`${urls.ordering}/business`, 'get');
export const getBusinessOrderingDetailApi = (formData) =>
  callAPI(`${urls.ordering}/business/detail`, 'get', {}, formData);
export const createOrderingApi = (formData) => callAPI(`${urls.ordering}/create`, 'post', {}, {}, formData);
export const updateOrderingStatusApi = (formData) =>
  callAPI(`${urls.ordering}/status/update`, 'patch', {}, {}, formData);

// User
export const getUserProfileData = () => callAPI(urls.profile, 'get');
export const saveProfileDataApi = (formData) =>
  callAPI(
    `${urls.profile}/update`,
    'patch',
    { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    {},
    formData
  );
export const changePasswordApi = (formData) => callAPI(`${urls.changepassword}`, 'patch', {}, {}, formData);
export const resetPasswordApi = (formData) => callAPI(`${urls.resetpassword}`, 'post', {}, {}, formData);
