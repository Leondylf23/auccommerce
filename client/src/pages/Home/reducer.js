import { produce } from 'immer';
import { SET_BEST_SELLER, SET_PRODUCTS_DATA } from './constants';

export const initialState = {
  products: [],
  best: [],
};

export const storedKey = [];

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PRODUCTS_DATA:
        draft.products = action.data;
        break;
      case SET_BEST_SELLER:
        draft.best = action.best;
        break;
    }
  });

export default homeReducer;
