import { all } from 'redux-saga/effects';
import { saga as uploadSaga } from './upload';

export default function* rootSaga() {
  yield all([
    uploadSaga(),
  ]);
}
