import { store } from '@redux/store';
import { StoreState } from '@redux/reducers';
import { useSelector } from 'react-redux';

export function getState(): StoreState {
  return store.getState();
}

export function useRedux<T>(selector: (state: StoreState) => T): T {
  return useSelector(selector);
}
