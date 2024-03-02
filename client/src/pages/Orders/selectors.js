import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectOrdersData = (state) => state.orders || initialState;

export const selectOrderList = createSelector(selectOrdersData, (state) => state.orderList);
