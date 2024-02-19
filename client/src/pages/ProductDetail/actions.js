import { GET_PRODUCT_DATA, SET_PRODUCT_DATA } from "./constants";

export const getProductData = (formData, cbNotFound) => ({
    type: GET_PRODUCT_DATA,
    formData,
    cbNotFound
});

export const setProductData = (data) => ({
    type: SET_PRODUCT_DATA,
    data
});

