import { combineReducers } from 'redux';

import appReducer, { storedKey as storedAppState } from '@containers/App/reducer';
import clientReducer, { storedKey as storedClientState } from '@containers/Client/reducer';
import paymentPageReducer from '@pages/PaymentPage/reducer';
import productDetailReducer from '@pages/ProductDetail/reducer';
import orderingsReducer from '@pages/Orderings/reducer';
import productCreationReducer from '@pages/ProductCreation/reducer';
import languageReducer from '@containers/Language/reducer';

import homeReducer from '@pages/Home/reducer';
import profileReducer from '@pages/Profile/reducer';
import { mapWithPersistor } from './persistence';

const storedReducers = {
  app: { reducer: appReducer, whitelist: storedAppState },
  client: { reducer: clientReducer, whitelist: storedClientState },
};

const temporaryReducers = {
  language: languageReducer,
  paymentPage: paymentPageReducer,
  productDetail: productDetailReducer,
  orderings: orderingsReducer,
  productCreation: productCreationReducer,
  home: homeReducer,
  profile: profileReducer,
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
