import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_PROGRAMS = new AsyncActionType('GET', 'FETCH_PROGRAMS');
export const FILTER_PROGRAMS = new AsyncActionType('GET', 'FILTER_PROGRAMS');

export const fetchPrograms = () => ({
  type: FETCH_PROGRAMS.BASE,
});

export const fetchProgramsBegin = () => ({
  type: FETCH_PROGRAMS.BEGIN,
});

export const fetchProgramsSuccess = data => ({
  type: FETCH_PROGRAMS.SUCCESS,
  payload: {
    data,
  },
});

export const fetchProgramsFailure = error => ({
  type: FETCH_PROGRAMS.FAILURE,
  payload: { error },
});

export const filterPrograms = (programTitle = '') => ({
  type: FILTER_PROGRAMS.BASE,
  payload: { programTitle },
});

export const filterProgramsBegin = () => ({
  type: FILTER_PROGRAMS.BEGIN,
});

export const filterProgramsSuccess = data => ({
  type: FILTER_PROGRAMS.SUCCESS,
  payload: {
    data,
  },
});

export const filterProgramsFailure = error => ({
  type: FILTER_PROGRAMS.FAILURE,
  payload: { error },
});

export const filterProgramsInvalid = () => ({
  type: 'INVALID_FILTER',
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

export const DOWNLOAD_ENROLLMENTS = new AsyncActionType('DOWNLOAD', 'DOWNLOAD_PROGRAM_ENROLLMENTS');

export const downloadEnrollments = (programKey, isCourses) => ({
  type: DOWNLOAD_ENROLLMENTS.BASE,
  payload: {
    programKey,
    isCourses,
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

export const pollJobFailure = error => ({
  type: POLL_JOB.FAILURE,
  payload: { error },
});

export const switchPage = page => ({
  type: 'SWITCH_PAGE',
  payload: { page },
});
