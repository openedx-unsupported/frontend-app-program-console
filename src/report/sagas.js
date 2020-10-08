import { call, put, takeEvery } from 'redux-saga/effects';
import { logError } from '@edx/frontend-platform/logging';

// Actions
import {
  FETCH_REPORTS,
  fetchReportsFailure,
  fetchReportsSuccess,
} from './actions';

// Services
import * as ApiService from './service';

export function* handleFetchReports({ payload: { programKey } }) {
  try {
    const data = yield call(ApiService.getReportsByProgram, programKey);
    if (data.length > 0) {
      yield put(fetchReportsSuccess(programKey, data));
    }
  } catch (e) {
    logError(e);
    yield put(fetchReportsFailure(e.message));
  }
}

export default function* saga() {
  yield takeEvery(FETCH_REPORTS.BASE, handleFetchReports);
}
