import { createSelector } from 'reselect';
import { initialState } from '@pages/ItemDetail/reducer';

const selectBidDetailData = (state) => state.bidDetail || initialState;

export const selectBidDetail = createSelector(selectBidDetailData, (state) => state.bidDetailData);
