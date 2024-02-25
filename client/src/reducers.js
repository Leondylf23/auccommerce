import { combineReducers } from 'redux';

import appReducer, { storedKey as storedAppState } from '@containers/App/reducer';
import clientReducer, { storedKey as storedClientState } from '@containers/Client/reducer';
import paymentPageReducer, { storedKey as storedPaymentState } from '@pages/Payment/reducer';
import languageReducer from '@containers/Language/reducer';

import homeReducer from '@pages/Home/reducer';
import profileReducer from '@pages/Profile/reducer';
import itemDetailReducer from '@pages/ItemDetail/reducer';
import myBidsReducer from '@pages/MyBids/reducer';
import bidDetailReducer from '@pages/MyBidDetail/reducer';
import myAuctionsReducer from '@pages/MyAuctions/reducer';
import { mapWithPersistor } from './persistence';

const storedReducers = {
  app: { reducer: appReducer, whitelist: storedAppState },
  client: { reducer: clientReducer, whitelist: storedClientState },
  paymentPage: { reducer: paymentPageReducer, whitelist: storedPaymentState },
};

const temporaryReducers = {
  language: languageReducer,
  home: homeReducer,
  profile: profileReducer,
  itemDetail: itemDetailReducer,
  myBids: myBidsReducer,
  bidDetail: bidDetailReducer,
  myAuctions: myAuctionsReducer,
};

const createReducer = () => {
  const coreReducer = combineReducers({
    ...mapWithPersistor(storedReducers),
    ...temporaryReducers,
  });
  const rootReducer = (state, action) => coreReducer(state, action);
  return rootReducer;
};

export default createReducer;
