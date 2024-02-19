import { produce } from 'immer';
import { SET_COUPONS_DATA } from './constants';

export const initialState = {
    couponsData: []
};

export const storedKey = [];

const couponsReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SET_COUPONS_DATA:
                draft.couponsData = action.data;
                break;
        }
    });

export default couponsReducer;
