import { produce } from 'immer';
import { RESET_MY_AUCTIONS, SET_MY_AUCTIONS } from './constants';

export const initialState = {
  myAuctionsData: [],
};

export const storedKey = [];

const myAuctionsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MY_AUCTIONS:
        draft.myAuctionsData = [...draft.myAuctionsData, ...action.data];
        break;
      case RESET_MY_AUCTIONS:
        draft.myAuctionsData = [];
        break;
    }
  });

export default myAuctionsReducer;
