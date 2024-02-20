import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectItemDetailData = (state) => state.itemDetail || initialState;

export const selectItemDetail = createSelector(selectItemDetailData, (state) => state.itemDetailData);
