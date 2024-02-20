import { produce } from 'immer';
import {} from './constants';

export const initialState = {
  itemDetail: null,
};

export const storedKey = [];

const itemDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
    }
  });

export default itemDetailReducer;
