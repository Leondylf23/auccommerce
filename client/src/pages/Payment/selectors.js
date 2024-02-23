import { createSelector } from 'reselect';
import { initialState } from '@pages/Payment/reducer';

const selectPaymentPageData = (state) => state.paymentPage || initialState;

export const selectBidDetailData = createSelector(selectPaymentPageData, (state) => state.bidDetailData);
export const selectPaymentData = createSelector(selectPaymentPageData, (state) => state.paymentData);
export const selectUserAddresses = createSelector(selectPaymentPageData, (state) => state.addressList);
export const selectShippingProviders = createSelector(selectPaymentPageData, (state) => state.shippingProviders);
export const selectProviderData = createSelector(selectPaymentPageData, (state) => state.providerData);
export const selectPaymentMethods = createSelector(selectPaymentPageData, (state) => state.paymentMethods);
