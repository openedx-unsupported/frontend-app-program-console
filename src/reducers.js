import { combineReducers } from 'redux';
import {
  reducer as consoleReducer,
  storeName as consoleStoreName,
} from './console';

import {
  reducer as reportReducer,
  storeName as reportStoreName,
} from './report';

const createRootReducer = () => combineReducers({
  [consoleStoreName]: consoleReducer,
  [reportStoreName]: reportReducer,
});

export default createRootReducer;
