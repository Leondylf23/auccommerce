import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectOrderingState = (state) => state.orderings || initialState;

export const selectOrderingData = createSelector(selectOrderingState, (state) => state.orderingsData);
export const selectOrderingDetailData = createSelector(selectOrderingState, (state) => state.orderingDetailData);
