import axios from "axios";


const createInstance = (baseURL, timeout = 3000) => {
  return axios.create({
    baseURL,
    timeout,
    headers: {
      Accept: 'application/json',
    },
    validateStatus: status => status >= 200 && status < 300,
  });
};

const addRequestInterceptor = (instance, onFulfilled, onRejected) => {
  instance.interceptors.request.use(onFulfilled, onRejected);
};

const addResponseInterceptor = (instance, onFulfilled, onRejected) => {
  instance.interceptors.response.use(onFulfilled, onRejected);
};

const createAppClient = (url, timeout, token) => {
    const client = createInstance(url, timeout);
  
    addRequestInterceptor(
      client,
      config => {
        const headers = { ...config.headers };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
  
        config.headers = headers;
        return config;
      },
      error => Promise.reject(error),
    );
  
    addResponseInterceptor(
      client,
      response => response.data,
      error => Promise.reject(error),
    );
  
    return client;
};

export { createAppClient };
