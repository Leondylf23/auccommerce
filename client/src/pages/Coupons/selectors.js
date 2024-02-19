import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectCouponsState = (state) => state.coupons || initialState;

export const selectCouponsPageData = createSelector(selectCouponsState, (state) => state.couponsData);