import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import { configureApiService, getWritablePrograms, getJob, getJobs, uploadEnrollments, downloadEnrollments, get } from './service';
import apiClient from './apiClient';
import { configuration } from '../environment';

const mockStore = configureMockStore([thunk]);
const axiosMock = new MockAdapter(apiClient);

function assertUrlRequested(expectedMethod, expectedUrl) {
  expect(axiosMock.history[expectedMethod].length).toBe(1);
  expect(axiosMock.history[expectedMethod][0].url).toBe(expectedUrl);
}

describe('api service', () => {
  configureApiService(configuration, apiClient);
  it('raises an error if missing configuration options', () => {
    expect(() => { configureApiService({}, apiClient); }).toThrowError('Service configuration error');
  });
  describe('calls the correct url when', () => {
    afterEach(() => {
      axiosMock.onAny().reply(200, { data: 'data' });
      axiosMock.resetHistory();
    });
    it('gets writable programs', () => {
      getWritablePrograms().then(() => {
        assertUrlRequested('get', 'http://localhost:18734/api/v1/programs/?user_has_perm=write');
      });
    });
    it("gets user's in-progress jobs", () => {
      getJobs().then(() => {
        assertUrlRequested('get', 'http://localhost:18734/api/v1/jobs/');
      });
    });
    it('gets a job status', () => {
      getJob('jobid').then(() => {
        assertUrlRequested('get', 'http://localhost:18734/api/v1/jobs/jobid');
      });
    });
    it('uploads program enrollments', () => {
      uploadEnrollments('program', false, null).then(() => {
        assertUrlRequested('post', 'http://localhost:18734/api/v1/programs/program/enrollments/upload/');
      });
    });
    it('uploads course enrollments', () => {
      uploadEnrollments('program', true, null).then(() => {
        assertUrlRequested('post', 'http://localhost:18734/api/v1/programs/program/course_enrollments/upload/');
      });
    });
    it('downloads program enrollments', () => {
      downloadEnrollments('program', true, null).then(() => {
        assertUrlRequested('get', 'http://localhost:18734/api/v1/programs/program/enrollments/?fmt=csv');
      });
    });
    it('downloads course enrollments', () => {
      downloadEnrollments('program', true, null).then(() => {
        assertUrlRequested('get', 'http://localhost:18734/api/v1/programs/program/course_enrollments/?fmt=csv');
      });
    });
    it('gets any other url', () => {
      get('whatever_who_cares').then(() => {
        assertUrlRequested('get', 'whatever_who_cares');
      });
    });
  });

  describe('behaves correctly on error', () => {
    async function downloadUploadErrorTest(curriedFunction, statusCode, expectedActions) {
      it('test', () => {
        const store = mockStore();
        axiosMock.onAny().reply(statusCode, { data: 'some issue' });
        // expect.assertions(2);
        console.log('early?');
        uploadEnrollments('program', false, null).then((data) => {
          console.log('succeeded');
          expect(data).toBe({ pots: 3 });
        }).catch((e) => {
          console.log('in here');
          expect(e).toMatch('some issue');
          expect(store.getActions()).toEqual(expectedActions);
        });
        console.log('returnrd');
      });
    }

    const uploadProgram = () => uploadEnrollments('program', false);
    const uploadCourse = () => uploadEnrollments('program', true);
    const downloadProgram = () => downloadEnrollments('program', false, null);
    const downloadCourse = () => downloadEnrollments('program', true, null);

    const notAuthenticatedAction = [{ type: 'NOT_AUTHENTICATED' }];

    downloadUploadErrorTest(uploadProgram, 401, notAuthenticatedAction);
    it('test2', () => {
      const store = mockStore();
      axiosMock.onAny().reply(401, { data: 'some issue' });
      // expect.assertions(2);
      console.log('early?');
      uploadEnrollments('program', false, null).then((data) => {
        console.log('succeeded');
        expect(data).toBe({ pots: 3 });
      }).catch((e) => {
        console.log('in here');
        expect(e).toMatch('some issue');
        expect(store.getActions()).toEqual([]);
      });
      console.log('returnrd');
    });
    // it('upload program enrollments 403', () => { downloadUploadErrorTest(uploadProgram, 403, notAuthenticatedAction); });
    // it('upload program enrollments 404', () => { downloadUploadErrorTest(uploadProgram, 404, []); });
    // it('upload course enrollments 401', () => { downloadUploadErrorTest(uploadCourse, 401, notAuthenticatedAction); });
    // it('upload course enrollments 403', () => { downloadUploadErrorTest(uploadCourse, 403, notAuthenticatedAction); });
    // it('upload course enrollments 404', () => { downloadUploadErrorTest(uploadCourse, 404, []); });
    // it('download program enrollments 401', () => { downloadUploadErrorTest(downloadProgram, 401, notAuthenticatedAction); });
    // it('download program enrollments 403', () => { downloadUploadErrorTest(downloadProgram, 403, notAuthenticatedAction); });
    // it('download program enrollments 404', () => { downloadUploadErrorTest(downloadProgram, 404, []); });
    // it('download course enrollments 401', () => { downloadUploadErrorTest(downloadCourse, 401, notAuthenticatedAction); });
    // it('download course enrollments 403', () => { downloadUploadErrorTest(downloadCourse, 403, notAuthenticatedAction); });
    // it('download course enrollments 404', () => { downloadUploadErrorTest(downloadCourse, 404, []); });
  });
});
