
import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import LoggingService from '@edx/frontend-logging';

// Actions
import {
  FETCH_WRITABLE_PROGRAMS,
  fetchWritableProgramsBegin,
  fetchWritableProgramsSuccess,
  fetchWritableProgramsFailure,
  UPLOAD_PROGRAM_ENROLLMENTS,
  uploadProgramEnrollmentsSuccess,
  uploadProgramEnrollmentsFailue,
  broken,
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

export function* handleUploadProgramEnrollments({ payload: { programKey, file } }) {
  try {
    const data = yield call(ApiService.uploadProgramEnrollments, programKey, file);
    yield put(uploadProgramEnrollmentsSuccess(data));
  } catch (e) {
    console.log(e);
    const { response: { status } } = e;
    LoggingService.logAPIErrorResponse(e);
    if (status == 500) {
      yield put(uploadProgramEnrollmentsFailue(programKey, 'danger'));
    } else if (status == 400) {
      yield put(uploadProgramEnrollmentsFailue(programKey, 'warning'));
    }
  }
}

export default function* saga() {
  yield takeEvery(FETCH_WRITABLE_PROGRAMS.BASE, handleFetchWritablePrograms);
  yield takeEvery(UPLOAD_PROGRAM_ENROLLMENTS.BASE, handleUploadProgramEnrollments);
}
