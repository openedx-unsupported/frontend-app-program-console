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

export const UPLOAD_PROGRAM_ENROLLMENTS = new AsyncActionType('UPLOAD', 'UPlOAD_PROGRAM_ENROLLMENTS');

export const uploadProgramEnrollments = (programKey, file) => ({
  type: UPLOAD_PROGRAM_ENROLLMENTS.BASE,
  payload: {
    programKey,
    file,
  },
});

export const uploadProgramEnrollmentsSuccess = (programKey, bannerObj) => ({
  type: UPLOAD_PROGRAM_ENROLLMENTS.SUCCESS,
  payload: {
    programKey,
    bannerObj,
  },
});

export const uploadProgramEnrollmentsFailue = (programKey, bannerObj) => ({
  type: UPLOAD_PROGRAM_ENROLLMENTS.FAILURE,
  payload: {
    programKey,
    bannerObj,
  },
});

export const notAuthenticated = () => ({
  type: 'NOT_AUTHENTICATED',
});

export const removeBanner = (programKey, bannerId) => ({
  type: 'REMOVE_BANNER',
  payload: {
    programKey,
    bannerId,
  },
});

export const POLL_JOB = new AsyncActionType('GET', 'POLL_JOB');

export const pollJob = (programKey, jobData, bannerId) => ({
  type: POLL_JOB.BASE,
  payload: {
    programKey,
    jobData,
    bannerId,
  },
});

export const pollJobsBegin = () => ({
  type: POLL_JOB.BEGIN,
});

export const pollJobsSuccess = data => ({
  type: POLL_JOB.SUCCESS,
  payload: {
    data,
  },
});

export const pollJobsFailure = error => ({
  type: POLL_JOB.FAILURE,
  payload: { error },
});
