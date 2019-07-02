
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
    yield put(fetchWritableProgramsSuccess(data.map(({ program_key, program_title, program_url }) => (
      {
        programKey: program_key,
        programTitle: program_title,
        programUrl: program_url,
      }
    ))));
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    yield put(fetchWritableProgramsFailure(e.message));
    yield put(push('/error'));
  }
}

export function* handleUploadProgramEnrollments({ payload: { programKey, file } }) {
  // try {
  const data = yield call(ApiService.uploadProgramEnrollments, programKey, file);
  yield put(uploadProgramEnrollmentsSuccess(
    programKey,
    data,
    {
      id: programKey + Date.now(),
      bannerType: 'info',
      message: 'Your enrollment file has been accepted and is being processed. Please wait.',
    },
  ));
  console.log('?');
  // } catch (e) {
  //   console.log(e);
  //   const { response: { status } } = e;
  //   LoggingService.logAPIErrorResponse(e);
  //   if (status == 500) {
  //     yield put(uploadProgramEnrollmentsFailue(
  //       programKey,
  //       {
  //         id: programKey + Date.now(),
  //         bannerType: 'danger',
  //         message: 'Sorry something went wrong',
  //       },
  //     ));
  //   } else if (status == 400) {
  //     yield put(uploadProgramEnrollmentsFailue(
  //       programKey,
  //       {
  //         id: programKey + Date.now(),
  //         bannerType: 'warning',
  //         message: 'Invalid CSV',
  //       },
  //     ));
  //   }
  // }
}

export default function* saga() {
  yield takeEvery(FETCH_WRITABLE_PROGRAMS.BASE, handleFetchWritablePrograms);
  yield takeEvery(UPLOAD_PROGRAM_ENROLLMENTS.BASE, handleUploadProgramEnrollments);
}
