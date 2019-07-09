import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_WRITABLE_PROGRAMS = new AsyncActionType('GET', 'FETCH_WRITABLE_PROGRAMS');

export const fetchWritablePrograms = () => ({
  type: FETCH_WRITABLE_PROGRAMS.BASE,
});

export const fetchWritableProgramsBegin = () => ({
  type: FETCH_WRITABLE_PROGRAMS.BEGIN,
});

export const fetchWritableProgramsSuccess = data => ({
  type: FETCH_WRITABLE_PROGRAMS.SUCCESS,
  payload: {
    data,
  },
});

export const fetchWritableProgramsFailure = error => ({
  type: FETCH_WRITABLE_PROGRAMS.FAILURE,
  payload: { error },
});

export const UPLOAD_ENROLLMENTS = new AsyncActionType('UPLOAD', 'UPlOAD_PROGRAM_ENROLLMENTS');


export const uploadEnrollments = (programKey, isCourses, file) => ({
  type: UPLOAD_ENROLLMENTS.BASE,
  payload: {
    programKey,
    isCourses,
    file,
  },
});

export const uploadEnrollmentsSuccess = (programKey, bannerObj) => ({
  type: UPLOAD_ENROLLMENTS.SUCCESS,
  payload: {
    programKey,
    bannerObj,
  },
});

export const uploadEnrollmentsFailue = (programKey, bannerObj) => ({
  type: UPLOAD_ENROLLMENTS.FAILURE,
  payload: {
    programKey,
    bannerObj,
  },
});

export const DOWNLOAD_ENROLLMENTS = new AsyncActionType('DOWNLOAD', 'DOWNLOAD_PROGRAM_ENROLLMENTS');

export const downloadEnrollments = (programKey, isCourses) => ({
  type: DOWNLOAD_ENROLLMENTS.BASE,
  payload: {
    programKey,
    isCourses,
  },
});

export const downloadEnrollmentsSuccess = (programKey, bannerObj) => ({
  type: DOWNLOAD_ENROLLMENTS.SUCCESS,
  payload: {
    programKey,
    bannerObj,
  },
});

export const downloadEnrollmentsFailue = (programKey, bannerObj) => ({
  type: DOWNLOAD_ENROLLMENTS.FAILURE,
  payload: {
    programKey,
    bannerObj,
  },
});


export const notAuthenticated = () => ({
  type: 'NOT_AUTHENTICATED',
});

export const addBanner = (programKey, bannerObj) => ({
  type: 'ADD_BANNER',
  payload: {
    programKey,
    bannerObj,
  },
});

export const removeBanner = (programKey, bannerId) => ({
  type: 'REMOVE_BANNER',
  payload: {
    programKey,
    bannerId,
  },
});

export const FETCH_JOBS = new AsyncActionType('GET', 'FETCH_JOBS');

export const fetchJobs = () => ({
  type: FETCH_JOBS.BASE,
});

export const fetchJobsBegin = () => ({
  type: FETCH_JOBS.BEGIN,
});

export const fetchJobsSuccess = () => ({
  type: FETCH_JOBS.SUCCESS,
});

export const fetchJobsFailure = error => ({
  type: FETCH_JOBS.FAILURE,
  payload: { error },
});

export const POLL_JOB = new AsyncActionType('GET', 'POLL_JOB');

export const pollJob = (programKey, jobId, bannerId) => ({
  type: POLL_JOB.BASE,
  payload: {
    programKey,
    jobId,
    bannerId,
  },
});

export const pollJobBegin = () => ({
  type: POLL_JOB.BEGIN,
});

export const pollJobSuccess = (programKey, bannerObj) => ({
  type: POLL_JOB.SUCCESS,
  payload: {
    programKey,
    bannerObj,
  },
});

export const pollJobFailure = error => ({
  type: POLL_JOB.FAILURE,
  payload: { error },
});
