import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { PersistConfig, persistCombineReducers, PersistedState } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 默认使用localStorage
import { createLogger } from 'redux-logger';
import reducerObj, { StoreState } from './reducers/index';
import wlog from '@src/utils/WLog';

const migrate = (state: PersistedState, currentVersion: number) => {
  if (!state) {
    return Promise.resolve(undefined);
  }
  const inboundVersion = state._persist?.version !== undefined ? state._persist.version : -1;
  if (inboundVersion === currentVersion) {
    return Promise.resolve(state);
  }
  try {
    return Promise.resolve(state);
  } catch (err) {
    return Promise.reject(err);
  }
};

const persistConfig: PersistConfig<StoreState, any, any, any> = {
  key: 'file-explorer',
  storage: storage,
  whitelist: ['global'],
  version: 1,
  migrate: migrate,
  throttle: 100,
};

const pReducer = persistCombineReducers(persistConfig, reducerObj);

const middlewares = [thunk];

const logger = createLogger({
  logger: wlog,
});

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}

export const store = createStore(pReducer, applyMiddleware(...middlewares));
