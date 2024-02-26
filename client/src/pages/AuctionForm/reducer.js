import { produce } from 'immer';
import { SET_AUCTION_DETAIL } from './constants';

export const initialState = {
  auctionDetailData: null,
};

export const storedKey = [];

const auctionFormReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_AUCTION_DETAIL:
        draft.auctionDetailData = action.data;
    }
  });

export default auctionFormReducer;
