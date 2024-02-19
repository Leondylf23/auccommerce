import { produce } from 'immer';
import { SET_MY_PRODUCT_DETAIL } from './constants';

export const initialState = {
  productData: null,
};

export const storedKey = [];

const productCreationReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MY_PRODUCT_DETAIL:
        draft.productData = action.data;
        break;
    }
  });

export default productCreationReducer;
