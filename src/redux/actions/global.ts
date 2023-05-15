import * as types from '../ActionTypes';
import { store } from '../store';

export const globalTest = (test: boolean) => {
  store.dispatch({
    type: types.GLOBAL_TEST,
    payload: { test },
  });
};
