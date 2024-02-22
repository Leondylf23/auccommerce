import { produce } from 'immer';
import { RESET_MY_BIDS, SET_MY_BIDS } from './constants';

export const initialState = {
  myBidsList: [],
};

export const storedKey = [];

const myBidsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MY_BIDS:
        draft.myBidsList = [...draft.myBidsList, ...action.data];
        break;
      case RESET_MY_BIDS:
        draft.myBidsList = [];
        break;
    }
  });

export default myBidsReducer;
