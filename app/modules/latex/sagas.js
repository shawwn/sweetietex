import { call, put, take, fork } from 'redux-saga/effects';

import * as constants from './constants';
import * as actions from './actions';

export function* watch() {
  while (true) {
    const { type, payload = {} } = yield take([
      constants.SEARCH_REQUEST,
    ]);

    switch (type) {
      default:
        yield null;
        break;
    }
  }
}

export default function* rootSaga() {
  yield watch();
}
