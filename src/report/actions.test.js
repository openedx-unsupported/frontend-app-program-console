import {
  fetchReports,
  fetchReportsSuccess,
  fetchReportsFailure,
} from './actions';

const programKey = 'test-program-key';

describe('fetchReports', () => {
  it('returns correct action', () => {
    expect(fetchReports(programKey)).toEqual({
      type: 'GET__FETCH_REPORTS',
      payload: {
        programKey,
      },
    });
  });
});

describe('fetchReportsSuccess', () => {
  it('returns correct action', () => {
    const reportData = 'data';
    expect(fetchReportsSuccess('test-program-key', reportData)).toEqual({
      type: 'GET__FETCH_REPORTS__SUCCESS',
      payload: {
        programKey,
        reportData,
      },
    });
  });
});

describe('fetchReportsFailure', () => {
  it('returns correct action', () => {
    const error = 'error';
    expect(fetchReportsFailure(error)).toEqual({
      type: 'GET__FETCH_REPORTS__FAILURE',
      payload: {
        error,
      },
    });
  });
});
