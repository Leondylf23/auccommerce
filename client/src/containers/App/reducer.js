import { produce } from 'immer';

import { SET_LOCAL, SET_THEME, SET_POPUP, SET_LOADING, SET_SOCKET } from '@containers/App/constants';

export const initialState = {
  locale: 'id',
  theme: 'light',
  popup: {
    open: false,
    title: '',
    message: '',
  },
  loading: false,
  socket: null,
};

export const storedKey = ['locale', 'theme'];

const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOCAL:
        draft.locale = action.locale;
        break;
      case SET_THEME:
        draft.theme = action.theme;
        break;
      case SET_POPUP:
        draft.popup = action.popup;
        break;
      case SET_LOADING:
        draft.loading = action.loading;
        break;
      case SET_SOCKET:
        draft.socket = action.socket;
        break;
    }
  });

export default appReducer;
