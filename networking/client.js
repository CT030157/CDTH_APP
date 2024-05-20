import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

const RNFetchBlobTimeout = 60 * 60 * 1000; // Milliseconds
class Client {
  constructor(baseURL, timeout = 3000) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        Accept: 'application/json',
      },
      validateStatus: status => status >= 200 && status < 300,
    });
  }

  addRequestInterceptor(onFulfilled, onRejected) {
    this.instance.interceptors.request.use(onFulfilled, onRejected);
  }

  addResponseInterceptor(onFulfilled, onRejected) {
    this.instance.interceptors.response.use(onFulfilled, onRejected);
  }

  async request(config) {
    return await this.instance.request(config);
  }

  async get(url, params = {}) {
    try {
      const opt = {
        params,
      };
      const response = await this.instance.get(url, opt);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async post(url, data) {
    try {
      const response = await this.instance.post(url, data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async postData(url, data) {
    try {
      const response = await this.instance.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async postFormData(url, data, headers, onUploadProgress: () => {}) {
    try {
      const response = await RNFetchBlob.config({
        timeout: RNFetchBlobTimeout,
      })
        .fetch('POST', url, headers, data)
        .uploadProgress(onUploadProgress);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async delete(url) {
    try {
      const response = await this.instance.delete(url);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async put(url, data) {
    try {
      const response = await this.instance.put(url, data);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default Client;
