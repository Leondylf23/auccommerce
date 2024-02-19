import { CREATE_NEW_COUPON, DELETE_COUPON, GET_COUPONS_DATA, SET_COUPONS_DATA } from "./constants";

export const getCouponsData = () => ({
    type: GET_COUPONS_DATA,
});

export const setCouponsData = (data) => ({
    type: SET_COUPONS_DATA,
    data
});

export const createNewCoupon = (formData, cb) => ({
    type: CREATE_NEW_COUPON,
    formData,
    cb
});

export const deleteCoupon = (formData, cb) => ({
    type: DELETE_COUPON,
    formData,
    cb
});