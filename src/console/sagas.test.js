/* Note that not all Sagas are tested.
 * This is due to time constraints that existed when
 * Program Manager was first developed.
 *
 * New Sagas will be tested here,
 * and a good tech-debt item would be to
 * add tests for existing Sagas.
 */
import { put } from 'redux-saga/effects';

import {
  fetchProgramsBegin,
  fetchProgramsSuccess,
  fetchJobs,
  filterProgramsBegin,
  filterProgramsSuccess,
  filterProgramsInvalid,
  notAuthenticated,
} from './actions';
import { handleFetchPrograms, handleFilterPrograms } from './sagas';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: () => {},
}));

describe('handleFetchPrograms', () => {
  function expectSagaBegin() {
    const saga = handleFetchPrograms();
    expect(saga.next().value).toEqual(put(fetchProgramsBegin()));
    expect(saga.next().value.type).toEqual('CALL');
    return saga;
  }
  function expectSagaEnd(saga) {
    expect(saga.next().value).toEqual(put(fetchJobs()));
    expect(saga.next().done).toBeTruthy();
  }

  it('correctly fetches multiple programs.', () => {
    const fakeApiResponse = [
      {
        program_key: 'a',
        program_url: 'http://example.edu/a',
        program_title: 'Program A',
        permissions: ['read_metadata', 'write_enrollments', 'read_enrollments'],
      },
      {
        program_key: 'b',
        program_url: 'http://example.edu/b',
        program_title: 'Program B',
        permissions: ['read_metadata', 'read_reports'],
      },
    ];
    const expectedResult = [
      {
        programKey: 'a',
        programUrl: 'http://example.edu/a',
        programTitle: 'Program A',
        areEnrollmentsReadable: true,
        areEnrollmentsWritable: true,
        areReportsReadable: false,
      },
      {
        programKey: 'b',
        programUrl: 'http://example.edu/b',
        programTitle: 'Program B',
        areEnrollmentsReadable: false,
        areEnrollmentsWritable: false,
        areReportsReadable: true,
      },
    ];

    const saga = expectSagaBegin();
    expect(saga.next(fakeApiResponse).value)
      .toEqual(put(fetchProgramsSuccess(expectedResult)));
    expectSagaEnd(saga);
  });

  it('correctly handles empty API response.', () => {
    const saga = expectSagaBegin();
    expect(saga.next([]).value)
      .toEqual(put(notAuthenticated()));
    expectSagaEnd(saga);
  });

  it('correctly handles an unprocessable API response.', () => {
    const saga = expectSagaBegin();
    const fakeApiResponse = 'this API response will cause an exception';
    expect(saga.next(fakeApiResponse).value.payload.action.type)
      .toEqual('GET__FETCH_PROGRAMS__FAILURE');
    expectSagaEnd(saga);
  });
});

describe('handleFilterPrograms', () => {
  function expectSagaBegin() {
    const saga = handleFilterPrograms({ payload: { programTitle: 'program' } });
    expect(saga.next().value).toEqual(put(filterProgramsBegin()));
    expect(saga.next().value.type).toEqual('CALL');
    return saga;
  }
  function expectSagaEnd(saga) {
    expect(saga.next().value).toEqual(put(fetchJobs()));
    expect(saga.next().done).toBeTruthy();
  }

  it('correctly fetches multiple programs.', () => {
    const fakeApiResponse = [
      {
        program_key: 'a',
        program_url: 'http://example.edu/a',
        program_title: 'Program A',
        permissions: ['read_metadata', 'write_enrollments', 'read_enrollments'],
      },
      {
        program_key: 'b',
        program_url: 'http://example.edu/b',
        program_title: 'Program B',
        permissions: ['read_metadata', 'read_reports'],
      },
    ];
    const expectedResult = [
      {
        programKey: 'a',
        programUrl: 'http://example.edu/a',
        programTitle: 'Program A',
        areEnrollmentsReadable: true,
        areEnrollmentsWritable: true,
        areReportsReadable: false,
      },
      {
        programKey: 'b',
        programUrl: 'http://example.edu/b',
        programTitle: 'Program B',
        areEnrollmentsReadable: false,
        areEnrollmentsWritable: false,
        areReportsReadable: true,
      },
    ];

    const saga = expectSagaBegin();
    expect(saga.next(fakeApiResponse).value)
      .toEqual(put(filterProgramsSuccess(expectedResult)));
    expectSagaEnd(saga);
  });

  it('correctly handles empty API response.', () => {
    const saga = expectSagaBegin();
    expect(saga.next([]).value)
      .toEqual(put(filterProgramsInvalid()));
    expectSagaEnd(saga);
  });

  it('correctly handles an unprocessable API response.', () => {
    const saga = expectSagaBegin();
    const fakeApiResponse = 'this API response will cause an exception';
    expect(saga.next(fakeApiResponse).value.payload.action.type)
      .toEqual('GET__FILTER_PROGRAMS__FAILURE');
    expectSagaEnd(saga);
  });
});
