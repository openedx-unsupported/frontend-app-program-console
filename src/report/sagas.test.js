import LoggingService from '@edx/frontend-logging';
import { takeEvery } from 'redux-saga/effects';
import { runSaga } from 'redux-saga';
import * as ApiService from '../console/service';
import saga, { handleFetchReports } from './sagas';

jest.mock('@edx/frontend-logging');

beforeEach(() => {
  LoggingService.mockClear();
});

describe('handleFetchReports', () => {
  const programKey = 'test-program';
  let dispatched;
  let mock;

  beforeEach(() => {
    dispatched = [];
    mock = jest.fn();
  });

  it('correctly handles a non-empty API response', async () => {
    const mockReportData = [{
      programKey,
      downloadUrl: 'www.example.com/test-program',
    }];
    mock.mockReturnValue(mockReportData);
    ApiService.getReportsByProgram = mock;

    const payload = {
      payload: {
        programKey,
      },
    };

    await runSaga({
      dispatch: action => dispatched.push(action),
    }, handleFetchReports, payload);

    expect(mock).toHaveBeenCalledWith('test-program');
    expect(dispatched).toEqual([
      {
        type: 'GET__FETCH_REPORTS__SUCCESS',
        payload: {
          programKey,
          reportData: mockReportData,
        },
      },
    ]);
  });

  it('correctly handles an empty API response', async () => {
    const mockReportData = [];
    mock.mockReturnValue(mockReportData);
    ApiService.getReportsByProgram = mock;

    const payload = {
      payload: {
        programKey,
      },
    };

    await runSaga({
      dispatch: action => dispatched.push(action),
    }, handleFetchReports, payload);

    expect(mock).toHaveBeenCalledWith('test-program');
    expect(dispatched).toEqual([]);
  });

  it('correctly handles an error', async () => {
    mock.mockRejectedValue(new Error('Error!'));
    ApiService.getReportsByProgram = mock;

    const payload = {
      payload: {
        programKey,
      },
    };

    await runSaga({
      dispatch: action => dispatched.push(action),
    }, handleFetchReports, payload);

    expect(mock).toHaveBeenCalledWith('test-program');
    expect(dispatched).toEqual([
      {
        type: 'GET__FETCH_REPORTS__FAILURE',
        payload: {
          error: 'Error!',
        },
      },
    ]);
    expect(LoggingService.logAPIErrorResponse).toHaveBeenCalledWith(Error('Error!'));
  });

  describe('saga', () => {
    it('yields correct effect', () => {
      const gen = saga();
      expect(gen.next().value).toEqual(takeEvery('GET__FETCH_REPORTS', handleFetchReports));
    });
  });
});
