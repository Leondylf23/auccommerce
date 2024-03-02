import { produce } from 'immer';
import { RESET_ORDERS, SET_ORDERS } from './constants';

export const initialState = {
  orderList: [],
};

export const storedKey = [];

const ordersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDERS:
        draft.orderList = [...draft.orderList, ...action.data];
        break;
      case RESET_ORDERS:
        draft.orderList = [];
        break;
    }
  });

export default ordersReducer;
