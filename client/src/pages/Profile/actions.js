import { GET_PROFILE_DATA, SAVE_NEW_PASSWORD, SAVE_PROFILE_DATA, SET_PROFILE_DATA } from "./constants";

export const getProfileData = () => ({
    type: GET_PROFILE_DATA,
});

export const setProfileData = (data) => ({
    type: SET_PROFILE_DATA,
    data
});

export const saveProfileData = (formData, cb) => ({
    type: SAVE_PROFILE_DATA,
    formData,
    cb
});

export const saveNewPassword = (formData, cb, cbErr) => ({
    type: SAVE_NEW_PASSWORD,
    formData,
    cb,
    cbErr
});