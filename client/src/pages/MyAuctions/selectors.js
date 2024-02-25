import { createSelector } from 'reselect';
import { initialState } from '@pages/ItemDetail/reducer';

const selectMyAuctionData = (state) => state.myAuctions || initialState;

export const selectMyAuctions = createSelector(selectMyAuctionData, (state) => state.myAuctionsData);
