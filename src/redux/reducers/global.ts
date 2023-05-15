import produce from 'immer';
import * as types from '../ActionTypes';

export interface GlobalState {
  key: 'global';
  test: boolean;
}

const initialState: GlobalState = {
  key: 'global',
  test: false,
};

export default produce((draft, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GLOBAL_TEST:
      draft.test = payload.test;
      break;
  }
}, initialState);
