import { produce } from 'immer';
import { SET_PROFILE_DATA } from './constants';

export const initialState = {
    profileData: null
};

export const storedKey = [];

const profileReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SET_PROFILE_DATA:
                draft.profileData = action.data;
                break;
        }
    });

export default profileReducer;
