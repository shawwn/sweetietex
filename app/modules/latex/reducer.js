// @flow
import type { Action } from 'redux';

import type { LatexState } from './types';

import * as constants from './constants';

export const name = 'latex';

const initialState: LatexState = {};

export function reducer(
  state: LatexState = initialState,
  action: Action = { type: '', payload: {} },
): SearchState {
  switch (action.type) {
    default:
      return state;
  }
}
