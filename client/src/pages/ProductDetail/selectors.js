import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectProductDetailState = (state) => state.productDetail || initialState;

export const selectProductDetail = createSelector(selectProductDetailState, (state) => state.productData);
