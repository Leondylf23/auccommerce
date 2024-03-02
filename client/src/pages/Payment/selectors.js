import { createSelector } from 'reselect';
import { initialState } from '@pages/Payment/reducer';

const selectPaymentPageData = (state) => state.paymentPage || initialState;

export const selectPaymentData = createSelector(selectPaymentPageData, (state) => state.paymentData);
export const selectUserAddresses = createSelector(selectPaymentPageData, (state) => state.addressList);
export const selectShippingProviders = createSelector(selectPaymentPageData, (state) => state.shippingProviders);
export const selectProviderData = createSelector(selectPaymentPageData, (state) => state.providerData);
export const selectPaymentMethods = createSelector(selectPaymentPageData, (state) => state.paymentMethods);

export const selectPaymentToken = createSelector(selectPaymentPageData, (state) => state.paymentToken);
export const selectStepData = createSelector(selectPaymentPageData, (state) => state.nextStep);
export const selectIsAnyChanges = createSelector(selectPaymentPageData, (state) => state.isAnyChanges);
