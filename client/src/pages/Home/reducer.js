import { produce } from 'immer';
import {
  RESET_ITEM_SEARCH,
  SET_CATEGORY,
  SET_FIVE_MORE_MIN_BID,
  SET_ITEM_SEARCH,
  SET_LATEST_BID_DATA,
} from './constants';

export const initialState = {
  latestCreatedItem: [],
  fiveMinOngoingBid: [],
  categories: [],
  searchResults: [],
};

export const storedKey = [];

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LATEST_BID_DATA:
        draft.latestCreatedItem = action.data;
        break;
      case SET_FIVE_MORE_MIN_BID:
        draft.fiveMinOngoingBid = action.data;
        break;
      case SET_CATEGORY:
        draft.categories = action.data;
        break;
      case SET_ITEM_SEARCH:
        draft.searchResults = [...draft.searchResults, ...action.data];
        break;
      case RESET_ITEM_SEARCH:
        draft.searchResults = [];
        break;
    }
  });

export default homeReducer;
