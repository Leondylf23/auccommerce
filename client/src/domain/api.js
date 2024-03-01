import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  ping: 'ping.json',
  login: 'auth/login',
  register: 'auth/register',
  profile: 'auth/profile',
  initProfile: 'auth/init-profile',
  resetpassword: 'auth/reset-password',
  changepassword: 'auth/change-password',
  auction: 'auction/auctions',
  myBids: 'my-bids',
  paymentForm: 'payment-form',
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

// User
export const getInitUserData = () => callAPI(`${urls.initProfile}`, 'get');
export const getUserProfileData = () => callAPI(urls.profile, 'get');
export const getUserAddressData = () => callAPI(`${urls.profile}/addresses`, 'get');
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
export const saveUserAddressNewApi = (formData) => callAPI(`${urls.profile}/addresses/new`, 'post', {}, {}, formData);
export const saveUserAddressEditApi = (formData) =>
  callAPI(`${urls.profile}/addresses/edit`, 'patch', {}, {}, formData);
export const deleteUserAddressApi = (formData) =>
  callAPI(`${urls.profile}/addresses/delete`, 'delete', {}, {}, formData);

// Auctions
export const getMyAuctionsApi = (formData) => callAPI(`${urls.auction}/my-auctions`, 'get', {}, formData);
export const getAuctionDetailApi = (formData) => callAPI(`${urls.auction}/my-auctions/detail`, 'get', {}, formData);
export const getCategoriesApi = () => callAPI(`${urls.auction}/categories`, 'get');
export const getLatestAuctionApi = (formData) => callAPI(`${urls.auction}/latest`, 'get', {}, formData);
export const getFiveMinAuctionApi = (formData) => callAPI(`${urls.auction}/fivemin`, 'get', {}, formData);
export const getAllAuctionsApi = (formData) => callAPI(`${urls.auction}`, 'get', {}, formData);
export const getAuctionItemDetailApi = (formData) => callAPI(`${urls.auction}/detail`, 'get', {}, formData);

export const saveNewAuctionDataApi = (formData) =>
  callAPI(
    `${urls.auction}/new`,
    'put',
    { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    {},
    formData
  );

export const saveEditAuctionDataApi = (formData) =>
  callAPI(
    `${urls.auction}/edit`,
    'patch',
    { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    {},
    formData
  );

export const deleteAuctionDataApi = (formData) => callAPI(`${urls.auction}/delete`, 'delete', {}, {}, formData);

// MyBids
export const getMyBidsApi = (formData) => callAPI(`${urls.myBids}`, 'get', {}, formData);
export const getMyBidDetailApi = (formData) => callAPI(`${urls.myBids}/detail`, 'get', {}, formData);

// PaymentForm
export const getCheckFormApi = (formData) => callAPI(`${urls.paymentForm}/check-data`, 'get', {}, formData);
export const getFormDataInfoApi = (formData) => callAPI(`${urls.paymentForm}/get-form-data`, 'get', {}, formData);

export const appendNewFormDataApi = (formData) =>
  callAPI(`${urls.paymentForm}/create-new-form`, 'post', {}, {}, formData);
export const appendFormDataApi = (formData) => callAPI(`${urls.paymentForm}/append-form`, 'post', {}, {}, formData);
export const completeFormDataApi = (formData) => callAPI(`${urls.paymentForm}/complete-form`, 'post', {}, {}, formData);
