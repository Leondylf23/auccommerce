import { createSelector } from 'reselect';
import { initialState } from '@pages/ItemDetail/reducer';

const selectAuctionFormData = (state) => state.auctionForm || initialState;

export const selectAuctionDetailData = createSelector(selectAuctionFormData, (state) => state.auctionDetailData);
