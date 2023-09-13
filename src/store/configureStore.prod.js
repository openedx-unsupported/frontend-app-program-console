import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';

import createRootReducer from '../reducers';
import rootSaga from '../sagas';

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createRootReducer(),
    compose(applyMiddleware(thunkMiddleware, sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return { store };
}
