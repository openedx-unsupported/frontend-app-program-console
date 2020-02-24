import { combineReducers } from 'redux';
import { userAccount } from '@edx/frontend-auth';
import { connectRouter } from 'connected-react-router';
import {
  reducer as consoleReducer,
  storeName as consoleStoreName,
} from './console';

import {
  reducer as reportReducer,
  storeName as reportStoreName,
} from './report';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

const createRootReducer = history =>
  combineReducers({
    // The authentication state is added as initialState when
    // creating the store in data/store.js.
    authentication: identityReducer,
    configuration: identityReducer,
    userAccount,
    [consoleStoreName]: consoleReducer,
    [reportStoreName]: reportReducer,
    router: connectRouter(history),
  });

export default createRootReducer;
