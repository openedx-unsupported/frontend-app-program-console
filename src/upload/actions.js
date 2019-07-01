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

export const uploadProgramEnrollmentsSuccess = data => ({
  type: UPLOAD_PROGRAM_ENROLLMENTS.SUCCESS,
  payload: {
    data,
  },
});

export const uploadProgramEnrollmentsFailue = error => ({
  type: UPLOAD_PROGRAM_ENROLLMENTS.FAILURE,
  payload: {
    error,
  },
});

export const notAuthenticated = () => ({
  type: 'NOT_AUTHENTICATED',
});

export const broken = () => ({
  type: 'BROKEN',
});
