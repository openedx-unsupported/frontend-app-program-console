import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_WRITABLE_PROGRAMS = new AsyncActionType('UPLOAD', 'FETCH_WRITABLE_PROGRAMS');

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

export const fetchWritableProgramsReset = () => ({
  type: FETCH_WRITABLE_PROGRAMS.RESET,
});
