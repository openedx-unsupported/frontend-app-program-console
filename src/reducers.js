import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import {
  reducer as consoleReducer,
  storeName as consoleStoreName,
} from './console';

import {
  reducer as reportReducer,
  storeName as reportStoreName,
} from './report';

const createRootReducer = history => combineReducers({
  [consoleStoreName]: consoleReducer,
  [reportStoreName]: reportReducer,
  router: connectRouter(history),
});

export default createRootReducer;
