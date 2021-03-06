import Taro from '@tarojs/taro';

const generateRequest = (method: 'GET' | 'POST') =>
  (url: string, data?: any, header?: any) => {
    const param: any = {};
    url && (param.url = url);
    data && (param.data = data);
    header && (param.header = url);
    return Taro.request({ method, ...param });
  };    

export const http = {
  get: generateRequest('GET'),
  post: generateRequest('POST'),
};

export const Q = <T>(promise: Promise<Taro.request.Promised<any>>): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    promise
    .then(response => response.statusCode === 200 ? resolve(response.data) : reject(response.data))
      .catch(error => {
        console.warn(`Q function error: ${error}`);
        reject(error);
      });
  });
};

export function throttle(fn: Function, threshold: number = 1500) {
  if (threshold === null) {
    threshold = 1500
  }
  let _lastExecTime: null | number = null;
  let context = this
  return function (...args: any[]): void {
    let _nowTime: number = new Date().getTime();
    if (_nowTime - Number(_lastExecTime) > threshold || !_lastExecTime) {
      fn.apply(context, args);
      _lastExecTime = _nowTime
    }
  }
}

export const getVideoTitle = (title: string, index: number): string => {
  // let result = title.replace(/\D/gi, '');
  // return result === '' ? title : result;
  return title;
};