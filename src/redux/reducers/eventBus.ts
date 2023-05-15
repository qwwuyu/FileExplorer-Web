import produce from 'immer';
import * as types from '../ActionTypes';

export interface EventBusState {
  key: 'eventbus';
  event: {
    type: number;
    data: any;
  };
}

const initialState: EventBusState = {
  key: 'eventbus',
  event: { type: 0, data: undefined },
};

export const eventBusProduce = produce((draft, action) => {
  const { type, payload } = action;
  if (types.EVENT_BUS == type) {
    draft.event = payload.event;
  }
}, initialState);
