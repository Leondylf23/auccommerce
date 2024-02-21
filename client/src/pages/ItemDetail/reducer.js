import { produce } from 'immer';
import { SET_ITEM_DETAIL } from './constants';

export const initialState = {
  itemDetailData: null,
};

export const storedKey = [];

const itemDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ITEM_DETAIL:
        draft.itemDetailData = action.data;
    }
  });

export default itemDetailReducer;
