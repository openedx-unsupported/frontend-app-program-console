import report, { defaultState } from './reducers';
import { FETCH_REPORTS } from './actions';

describe('report reducer', () => {
  it('handles the GET__FETCH_REPORTS__SUCCESS action with report data', () => {
    const action = {
      type: FETCH_REPORTS.SUCCESS,
      payload: {
        programKey: 'test-program',
        reportData: [
          {
            name: 'first-report',
            download_url: 'example.com/first-report',
          },
          {
            name: 'second-report',
            download_url: 'example.com/second-report',
          },
        ],
      },
    };

    expect(report(defaultState, action)).toEqual({
      loadingError: null,
      reportData: {
        'test-program': [
          {
            name: 'first-report',
            downloadUrl: 'example.com/first-report',
          },
          {
            name: 'second-report',
            downloadUrl: 'example.com/second-report',
          },
        ],
      },
    });
  });

  it('handles the GET__FETCH_REPORTS__SUCCESS action without report data', () => {
    const action = {
      type: FETCH_REPORTS.SUCCESS,
      payload: {
        programKey: 'test-program',
        reportData: [],
      },
    };

    expect(report(defaultState, action)).toEqual({
      loadingError: null,
      reportData: {
        'test-program': [],
      },
    });
  });

  it('handles the GET__FETCH_REPORTS__FAILURE action', () => {
    const action = {
      type: FETCH_REPORTS.FAILURE,
      payload: {
        error: 'error',
      },
    };

    expect(report(defaultState, action)).toEqual({
      loadingError: action.payload.error,
      reportData: {},
    });
  });

  it('handles the default case', () => {
    expect(report(undefined, {})).toEqual({
      loadingError: null,
      reportData: {},
    });
  });
});
