import { store } from '../store';
import { Unsubscribe } from 'redux';
import * as types from '../ActionTypes';
import { useEffect, DependencyList } from 'react';

export enum EventType {
  NONE,
  TEST,
}

export const eventBus = {
  emit: (eventType: EventType, data: any) => {
    store.dispatch({
      type: types.EVENT_BUS,
      payload: {
        event: { type: eventType, data: data },
      },
    });
  },
  on: (eventType: EventType, callback: (value) => void): Unsubscribe => {
    let obj: any = undefined;
    const listener = (call: boolean) => {
      const event = store.getState().eventBus.event;
      if (event !== obj) {
        obj = event;
        if (call && eventType == event.type) {
          console.log('EventBus:receive=' + eventType);
          callback(event.data);
        }
      }
    };
    listener(false);
    return store.subscribe(() => {
      listener(true);
    });
  },
};

export function useEventBus<T>(eventType: EventType, callback: (value: T) => void, deps?: DependencyList) {
  useEffect(() => {
    const un = eventBus.on(eventType, callback);
    return () => {
      if (un) {
        un();
      }
    };
  }, deps);
}
