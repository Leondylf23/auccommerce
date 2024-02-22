import { createSelector } from 'reselect';
import { initialState } from '@pages/ItemDetail/reducer';

const selectItemDetailData = (state) => state.itemDetail || initialState;

export const selectItemDetail = createSelector(selectItemDetailData, (state) => state.itemDetailData);
