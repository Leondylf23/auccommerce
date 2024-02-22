import { createSelector } from 'reselect';
import { initialState } from '@pages/MyBids/reducer';

const selectMyBidsData = (state) => state.myBids || initialState;

export const selectMyBidsList = createSelector(selectMyBidsData, (state) => state.myBidsList);
