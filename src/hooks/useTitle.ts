import { isFunction } from '@src/utils/CommUtil';
import { useEffect } from 'react';

export function useTitle(title, ...deps) {
  useEffect(() => {
    document.title = isFunction(title) ? title() : title;
  }, [...deps]);
}
