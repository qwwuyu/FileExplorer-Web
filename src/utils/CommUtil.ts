/**
 * 判断对象是不是方法
 */
export function isFunction(obj: any) {
  return typeof obj === 'function';
}

export const noop = (a?: any): void => {};

export interface PromiseObj<T = any> {
  promise: Promise<T>;
  resolve: (T?) => any;
  reject: (any?: any) => any;
}

export function genPromise<T = any>(): PromiseObj<T> {
  let resolve;
  let reject;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return { promise, resolve, reject };
}

export function format(d: Date, format: string) {
  var date = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S+': d.getMilliseconds(),
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length)
      );
    }
  }
  return format;
};
