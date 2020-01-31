import { all } from 'redux-saga/effects';
import { saga as uploadSaga } from './upload';
import { saga as reportSaga } from './report';


export default function* rootSaga() {
  yield all([
    uploadSaga(),
    reportSaga(),
  ]);
}
