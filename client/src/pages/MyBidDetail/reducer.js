import { produce } from 'immer';
import { SET_BID_DETAIL } from './constants';

export const initialState = {
  bidDetailData: null,
};

export const storedKey = [];

const bidDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_BID_DETAIL:
        draft.bidDetailData = action.data;
    }
  });

export default bidDetailReducer;
