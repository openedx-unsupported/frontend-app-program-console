import { all } from 'redux-saga/effects';
import { saga as consoleSaga } from './console';
import { saga as reportSaga } from './report';

export default function* rootSaga() {
  yield all([
    consoleSaga(),
    reportSaga(),
  ]);
}
