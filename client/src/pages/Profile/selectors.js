import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectProfileState = (state) => state.profile || initialState;

export const selectProfileData = createSelector(selectProfileState, (state) => state.profileData);
