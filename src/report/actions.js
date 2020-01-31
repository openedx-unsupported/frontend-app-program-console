import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_REPORTS = new AsyncActionType('GET', 'FETCH_REPORTS');

export const fetchReports = (programKey) => ({
  type: FETCH_REPORTS.BASE,
  payload: {
    programKey,
  },
});

export const fetchReportsBegin = () => ({
  type: FETCH_REPORTS.BEGIN,

});

export const fetchReportsSuccess = (programKey, data) => ({
  type: FETCH_REPORTS.SUCCESS,
  payload: {
    programKey,
    data,
  },
});

export const fetchReportsFailure = error => ({
  type: FETCH_REPORTS.FAILURE,
  payload: { error },
});
