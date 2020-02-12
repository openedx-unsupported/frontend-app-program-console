import { utils } from '../common';

const { AsyncActionType } = utils;

export const FETCH_REPORTS = new AsyncActionType('GET', 'FETCH_REPORTS');

export const fetchReports = programKey => ({
  type: FETCH_REPORTS.BASE,
  payload: {
    programKey,
  },
});

export const fetchReportsSuccess = (programKey, reportData) => ({
  type: FETCH_REPORTS.SUCCESS,
  payload: {
    programKey,
    reportData,
  },
});

export const fetchReportsFailure = error => ({
  type: FETCH_REPORTS.FAILURE,
  payload: { error },
});
