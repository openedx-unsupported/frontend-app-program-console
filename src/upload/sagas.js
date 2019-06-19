
import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import LoggingService from '@edx/frontend-logging';

// Actions
import {
  FETCH_WRITABLE_PROGRAMS,
  fetchWritableProgramsBegin,
  fetchWritableProgramsSuccess,
  fetchWritableProgramsFailure,
} from './actions';

// Services
import * as ApiService from './service';

export function* handleFetchWritablePrograms() {
  try {
    yield put(fetchWritableProgramsBegin());

    const data = yield call(ApiService.getWritablePrograms);
    yield put(fetchWritableProgramsSuccess(data));
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    yield put(fetchWritableProgramsFailure(e.message));
    yield put(push('/error'));
  }
}

export default function* saga() {
  yield takeEvery(FETCH_WRITABLE_PROGRAMS.BASE, handleFetchWritablePrograms);
}
