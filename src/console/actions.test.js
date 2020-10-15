import {
  addBanner,
  downloadEnrollments,
  fetchJobs,
  fetchJobsBegin,
  fetchJobsFailure,
  fetchJobsSuccess,
  fetchPrograms,
  fetchProgramsBegin,
  fetchProgramsFailure,
  fetchProgramsSuccess,
  filterPrograms,
  filterProgramsBegin,
  filterProgramsSuccess,
  filterProgramsFailure,
  filterProgramsInvalid,
  notAuthenticated,
  pollJob,
  pollJobFailure,
  removeBanner,
  uploadEnrollments,
} from './actions';

describe('Adding and removing banners', () => {
  describe('ADD_BANNER', () => {
    const testBannerObj = {
      id: `123${Date.now()}`,
      bannerType: 'danger',
      message: 'Sorry something went wrong',
    };

    it('is an action creator', () => {
      expect(addBanner).toBeInstanceOf(Function);
      expect(addBanner('123', testBannerObj)).toEqual({
        type: 'ADD_BANNER',
        payload: {
          programKey: '123',
          bannerObj: testBannerObj,
        },
      });
    });
  });

  describe('REMOVE_BANNER', () => {
    const testBannerId = `123${Date.now()}`;
    it('is an action creator', () => {
      expect(removeBanner).toBeInstanceOf(Function);
      expect(removeBanner('123', testBannerId)).toEqual({
        type: 'REMOVE_BANNER',
        payload: {
          programKey: '123',
          bannerId: testBannerId,
        },
      });
    });
  });
});

describe('DOWNLOAD_ENROLLMENTS', () => {
  it('has a base action creator', () => {
    expect(downloadEnrollments).toBeInstanceOf(Function);
    expect(downloadEnrollments('123', true)).toEqual({
      type: 'DOWNLOAD__DOWNLOAD_PROGRAM_ENROLLMENTS',
      payload: {
        programKey: '123',
        isCourses: true,
      },
    });
  });
});

describe('FETCH_PROGRAMS', () => {
  it('has a base action creator', () => {
    expect(fetchPrograms).toBeInstanceOf(Function);
    expect(fetchPrograms()).toEqual({
      type: 'GET__FETCH_PROGRAMS',
    });
  });

  it('has a begin action creator', () => {
    expect(fetchProgramsBegin).toBeInstanceOf(Function);
    expect(fetchProgramsBegin()).toEqual({
      type: 'GET__FETCH_PROGRAMS__BEGIN',
    });
  });

  it('has a success action creator', () => {
    expect(fetchProgramsSuccess).toBeInstanceOf(Function);
    expect(fetchProgramsSuccess({ foo: 'bar' })).toEqual({
      type: 'GET__FETCH_PROGRAMS__SUCCESS',
      payload: {
        data: { foo: 'bar' },
      },
    });
  });

  it('has a failure action creator', () => {
    expect(fetchProgramsFailure).toBeInstanceOf(Function);
    expect(fetchProgramsFailure({ foo: 'bar' })).toEqual({
      type: 'GET__FETCH_PROGRAMS__FAILURE',
      payload: {
        error: { foo: 'bar' },
      },
    });
  });
});

describe('FILTER_PROGRAMS', () => {
  it('has a base action creator', () => {
    expect(filterPrograms).toBeInstanceOf(Function);
    expect(filterPrograms('filter')).toEqual({
      type: 'GET__FILTER_PROGRAMS',
      payload: {
        programTitle: 'filter',
      },
    });
  });

  it('has a begin action creator', () => {
    expect(filterProgramsBegin).toBeInstanceOf(Function);
    expect(filterProgramsBegin()).toEqual({
      type: 'GET__FILTER_PROGRAMS__BEGIN',
    });
  });

  it('has a success action creator', () => {
    expect(filterProgramsSuccess).toBeInstanceOf(Function);
    expect(filterProgramsSuccess({ foo: 'bar' })).toEqual({
      type: 'GET__FILTER_PROGRAMS__SUCCESS',
      payload: {
        data: { foo: 'bar' },
      },
    });
  });

  it('has a failure action creator', () => {
    expect(filterProgramsFailure).toBeInstanceOf(Function);
    expect(filterProgramsFailure({ foo: 'bar' })).toEqual({
      type: 'GET__FILTER_PROGRAMS__FAILURE',
      payload: {
        error: { foo: 'bar' },
      },
    });
  });
});

describe('INVALID_FILTER', () => {
  it('is an action creator', () => {
    expect(filterProgramsInvalid).toBeInstanceOf(Function);
    expect(filterProgramsInvalid()).toEqual({ type: 'INVALID_FILTER' });
  });
});

describe('#FETCH_JOBS', () => {
  it('has a base action creator', () => {
    expect(fetchJobs).toBeInstanceOf(Function);
    expect(fetchJobs()).toEqual({ type: 'GET__FETCH_JOBS' });
  });

  it('has a begin action creator', () => {
    expect(fetchJobsBegin).toBeInstanceOf(Function);
    expect(fetchJobsBegin()).toEqual({ type: 'GET__FETCH_JOBS__BEGIN' });
  });

  it('has a success action creator', () => {
    expect(fetchJobsSuccess).toBeInstanceOf(Function);
    expect(fetchJobsSuccess()).toEqual({ type: 'GET__FETCH_JOBS__SUCCESS' });
  });

  it('has a failure action creator', () => {
    const testErrorObj = new Error('It failed!');
    expect(fetchJobsFailure).toBeInstanceOf(Function);
    expect(fetchJobsFailure(testErrorObj)).toEqual({
      type: 'GET__FETCH_JOBS__FAILURE',
      payload: { error: testErrorObj },
    });
  });
});

describe('NOT_AUTHENTICATED', () => {
  it('is an action creator', () => {
    expect(notAuthenticated).toBeInstanceOf(Function);
    expect(notAuthenticated()).toEqual({ type: 'NOT_AUTHENTICATED' });
  });
});

describe('POLL_JOB', () => {
  it('has a base action creator', () => {
    const testBannerId = `123${Date.now()}`;
    expect(pollJob).toBeInstanceOf(Function);
    expect(pollJob('123', 'abc', testBannerId)).toEqual({
      type: 'GET__POLL_JOB',
      payload: {
        programKey: '123',
        jobId: 'abc',
        bannerId: testBannerId,
      },
    });
  });

  it('has a failure action creator', () => {
    const testErrorObj = new Error('It failed!');
    expect(pollJobFailure).toBeInstanceOf(Function);
    expect(pollJobFailure(testErrorObj)).toEqual({
      type: 'GET__POLL_JOB__FAILURE',
      payload: {
        error: testErrorObj,
      },
    });
  });
});

describe('UPLOAD_ENROLLMENTS', () => {
  it('has a base action creator', () => {
    const testFile = new File([], 'test');
    expect(uploadEnrollments).toBeInstanceOf(Function);
    expect(uploadEnrollments('123', true, testFile)).toEqual({
      type: 'UPLOAD__UPlOAD_PROGRAM_ENROLLMENTS',
      payload: {
        programKey: '123',
        isCourses: true,
        file: testFile,
      },
    });
  });
});
