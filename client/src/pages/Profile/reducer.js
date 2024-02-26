import { produce } from 'immer';
import { SET_PROFILE_DATA, SET_USER_ADDRESS_DATA } from './constants';

export const initialState = {
  profileData: null,
  profileAddresses: [],
};

export const storedKey = [];

const profileReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PROFILE_DATA:
        draft.profileData = action.data;
        break;
      case SET_USER_ADDRESS_DATA:
        draft.profileAddresses = action.data;
        break;
    }
  });

export default profileReducer;
