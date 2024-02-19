import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectProductCreationState = (state) => state.productCreation || initialState;

export const selectMyProductData = createSelector(selectProductCreationState, (state) => state.productData);
