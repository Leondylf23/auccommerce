import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectHomeData = (state) => state.home || initialState;

export const selectLatestCratedBid = createSelector(selectHomeData, (state) => state.latestCreatedItem);
export const selectFiveMinOngoingBid = createSelector(selectHomeData, (state) => state.fiveMinOngoingBid);
export const selectCategory = createSelector(selectHomeData, (state) => state.categories);
export const selectSearchResult = createSelector(selectHomeData, (state) => state.searchResults);
