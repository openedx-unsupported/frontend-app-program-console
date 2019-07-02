
import { all, call, put, takeEvery } from 'redux-saga/effects';
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
  POLL_JOB,
  pollJob,
  pollJobSuccess,
  removeBanner,
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
  try {
    const data = yield call(ApiService.uploadProgramEnrollments, programKey, file);
    const bannerObj = {
      id: programKey + Date.now(),
      bannerType: 'info',
      message: 'Your enrollment file has been accepted and is being processed. Please wait.',
    };
    yield all([
      put(uploadProgramEnrollmentsSuccess(programKey, bannerObj)),
      put(pollJob(programKey, data, bannerObj.id)),
    ]);
  } catch (e) {
    const { response: { status } } = e;
    LoggingService.logAPIErrorResponse(e);
    if (status == 500) {
      yield put(uploadProgramEnrollmentsFailue(
        programKey,
        {
          id: programKey + Date.now(),
          bannerType: 'danger',
          message: 'Sorry something went wrong',
        },
      ));
    } else if (status == 400) {
      yield put(uploadProgramEnrollmentsFailue(
        programKey,
        {
          id: programKey + Date.now(),
          bannerType: 'warning',
          message: 'Invalid CSV',
        },
      ));
    }
  }
}

async function wait(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}

export function* handlePollJobs({ payload: { programKey, jobData, bannerId } }) {
  try {
    const responseData = yield call(ApiService.get, jobData.job_url);
    if (responseData.state === 'Succeeded') {
      yield all([
        put(removeBanner(programKey, bannerId)),
        put(pollJobSuccess(
          programKey,
          {
            id: programKey + Date.now(),
            bannerType: 'success',
            message: 'Your program enrollment has succeeded.',
            linkMessage: 'Click Here',
            linkHref: responseData.result,
          },
        )),
      ]);
    } else if (responseData.state === 'Pending' || responseData.state === 'In Progress' || responseData.state === 'Retrying') {
      yield call(wait, 1000);
      yield put(pollJob(programKey, jobData, bannerId));
    }
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
  }
}

export default function* saga() {
  yield takeEvery(FETCH_WRITABLE_PROGRAMS.BASE, handleFetchWritablePrograms);
  yield takeEvery(UPLOAD_PROGRAM_ENROLLMENTS.BASE, handleUploadProgramEnrollments);
  yield takeEvery(POLL_JOB.BASE, handlePollJobs);
}
