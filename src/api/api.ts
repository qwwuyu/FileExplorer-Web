import axios from 'axios';

export const BASE_HOST = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : '';
export const BASE_URL = BASE_HOST + '/i/';

const defaultAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  method: 'post',
  // withCredentials: true,
  // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  // transformRequest: [
  //   (data) => {
  //     let formData = new FormData();
  //     for (let key in data) {
  //       formData.append(key, data[key]);
  //     }
  //     return formData;
  //   },
  // ],
});
defaultAxios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
defaultAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      if (error.response.data && error.response.data.info) {
        error.msg = error.response.data.info;
      } else if (404 == error.response.status) {
        error.msg = '请求的地址不存在';
      } else if (504 == error.response.status) {
        error.msg = '服务器连接超时';
      } else if (401 == error.response.status) {
        error.msg = '认证失败';
      } else {
        error.msg = '请求数据失败';
      }
    } else {
      if ('Network Error' == error.message) {
        error.msg = '网络连接失败';
      } else {
        error.msg = '请求失败';
      }
    }
    return Promise.reject(error);
  }
);

//请求数据成功
const HTTP_SUC: number = 1;
//请求数据的基本结构
type ResponseBean<T> = {
  state: number;
  info?: string;
  data?: T;
};

export async function simpleRequest<T>(api: string, params?: any): Promise<T> {
  const response = await defaultAxios({
    url: api,
    params: params,
  });
  try {
    const bean: ResponseBean<T> = response.data;
    if (HTTP_SUC === bean.state) {
      if (bean.data) {
        return bean.data;
      } else {
        return new Object() as T;
      }
    } else {
      return Promise.reject({ msg: bean.info ? bean.info : '请求失败' });
    }
  } catch (error: any) {
    error.msg = '数据解析失败';
    return Promise.reject(error);
  }
}
