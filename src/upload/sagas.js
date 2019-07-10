
import { all, call, delay, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import LoggingService from '@edx/frontend-logging';
import parseRegistrarJobName from './utils';

// Actions
import {
  FETCH_WRITABLE_PROGRAMS,
  fetchWritableProgramsBegin,
  fetchWritableProgramsSuccess,
  fetchWritableProgramsFailure,
  FETCH_JOBS,
  fetchJobs,
  fetchJobsBegin,
  fetchJobsSuccess,
  fetchJobsFailure,
  UPLOAD_ENROLLMENTS,
  uploadEnrollmentsSuccess,
  uploadEnrollmentsFailure,
  DOWNLOAD_ENROLLMENTS,
  downloadEnrollmentsSuccess,
  downloadEnrollmentsFailue,
  POLL_JOB,
  pollJob,
  pollJobSuccess,
  addBanner,
  removeBanner,

} from './actions';

// Services
import * as ApiService from './service';

export function* handleFetchWritablePrograms() {
  try {
    yield put(fetchWritableProgramsBegin());

    const data = yield call(ApiService.getWritablePrograms);
    yield put(fetchWritableProgramsSuccess(data
      .map(({ program_key, program_title, program_url }) => // eslint-disable-line camelcase
        (
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
  yield put(fetchJobs());
}

export function* handleFetchJobs() {
  try {
    yield put(fetchJobsBegin());
    const data = yield call(ApiService.getJobs);
    for (let i = 0; i < data.length; i += 1) {
      const job = data[i];
      const jobNameInfo = parseRegistrarJobName(job.name);
      if (jobNameInfo !== null) {
        const bannerObj = {
          id: jobNameInfo.programKey + Date.now(),
          bannerType: 'info',
          message: `An existing in-progress ${jobNameInfo.jobName} job has been found for this program`,
        };
        yield all([
          put(addBanner(jobNameInfo.programKey, bannerObj)),
          put(pollJob(jobNameInfo.programKey, job.job_id, bannerObj.id)),
        ]);
      }
    }
    yield put(fetchJobsSuccess());
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    yield put(fetchJobsFailure(e.message));
    yield put(push('/error'));
  }
}

export function* handleUploadEnrollments({ payload: { programKey, isCourses, file } }) {
  try {
    if (typeof file === 'undefined') {
      return;
    }
    const data = yield call(ApiService.uploadEnrollments, programKey, isCourses, file);
    const bannerObj = {
      id: programKey + Date.now(),
      bannerType: 'info',
      message: 'Your enrollment file has been accepted and is being processed. Please wait.',
    };
    yield all([
      put(uploadEnrollmentsSuccess(programKey, bannerObj)),
      put(pollJob(programKey, data.job_id, bannerObj.id)),
    ]);
  } catch (e) {
    const { response: { status } } = e;
    LoggingService.logAPIErrorResponse(e);
    if (status === 500) {
      yield put(uploadEnrollmentsFailure(
        programKey,
        {
          id: programKey + Date.now(),
          bannerType: 'danger',
          message: 'Sorry something went wrong',
        },
      ));
    } else if (status === 400) {
      yield put(uploadEnrollmentsFailure(
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

export function* handleDownloadEnrollments({ payload: { programKey, isCourses } }) {
  try {
    const data = yield call(ApiService.downloadEnrollments, programKey, isCourses);
    const bannerObj = {
      id: programKey + Date.now(),
      bannerType: 'info',
      message: 'Your enrollment csv is being built. Please wait.',
    };
    yield all([
      put(downloadEnrollmentsSuccess(programKey, bannerObj)),
      put(pollJob(programKey, data.job_id, bannerObj.id)),
    ]);
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    yield put(downloadEnrollmentsFailue(
      programKey,
      {
        id: programKey + Date.now(),
        bannerType: 'danger',
        message: 'Sorry something went wrong',
      },
    ));
  }
}

export function* handlePollJobs({ payload: { programKey, jobId, bannerId } }) {
  try {
    const responseData = yield call(ApiService.getJob, jobId);
    if (responseData.state === 'Succeeded') {
      const jobNameInfo = parseRegistrarJobName(responseData.name);
      yield all([
        put(removeBanner(programKey, bannerId)),
        put(pollJobSuccess(
          programKey,
          {
            id: programKey + Date.now(),
            bannerType: 'success',
            message: `Your ${jobNameInfo.jobName} job has has successfully completed.`,
            linkMessage: 'Click here for result',
            linkHref: responseData.result,
          },
        )),
      ]);
    } else if (responseData.state === 'Pending' || responseData.state === 'In Progress' || responseData.state === 'Retrying') {
      yield delay(4000);
      yield put(pollJob(programKey, jobId, bannerId));
    } else if (responseData.state === 'Failed' || responseData.state === 'Cancelled') {
      const jobNameInfo = parseRegistrarJobName(responseData.name);
      yield all([
        put(removeBanner(programKey, bannerId)),
        put(pollJobSuccess(
          programKey,
          {
            id: programKey + Date.now(),
            bannerType: 'danger',
            message: `Your ${jobNameInfo.jobName} job has failed.`,
          },
        )),
      ]);
    }
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
  }
}

export default function* saga() {
  yield takeEvery(FETCH_WRITABLE_PROGRAMS.BASE, handleFetchWritablePrograms);
  yield takeEvery(FETCH_JOBS.BASE, handleFetchJobs);
  yield takeEvery(UPLOAD_ENROLLMENTS.BASE, handleUploadEnrollments);
  yield takeEvery(DOWNLOAD_ENROLLMENTS.BASE, handleDownloadEnrollments);
  yield takeEvery(POLL_JOB.BASE, handlePollJobs);
}
