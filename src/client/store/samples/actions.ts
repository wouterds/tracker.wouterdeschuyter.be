import { createAction } from 'redux-actions';
import { Sample } from './types';

export const FETCH = 'samples.fetch';
export const FINISHED = 'samples.finished';
export const FETCH_SUCCESS = 'samples.fetchSuccess';
export const FETCH_ERROR = 'samples.fetchError';

export const fetch = createAction(FETCH);
export const finished = createAction(FINISHED);
export const fetchSuccess = createAction(
  FETCH_SUCCESS,
  (samples: Sample[]) => ({ samples }),
);
export const fetchError = createAction(FETCH_ERROR);
