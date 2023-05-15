import global, { GlobalState } from './global';
import { EventBusState, eventBusProduce } from './eventBus';

export interface StoreState {
  global: GlobalState;
  eventBus: EventBusState;
}

export default {
  global,
  eventBus: eventBusProduce,
};
