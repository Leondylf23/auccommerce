import { produce } from 'immer';
import { SET_ORDERING_DATA, SET_ORDERING_DETAIL_DATA } from './constants';

export const initialState = {
  orderingsData: [],
  orderingDetailData: null,
};

export const storedKey = [];

const orderingsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDERING_DATA:
        draft.orderingsData = action.data;
        break;
      case SET_ORDERING_DETAIL_DATA:
        draft.orderingDetailData = action.data;
        break;
    }
  });

export default orderingsReducer;
