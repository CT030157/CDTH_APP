import Client from './client';
import Config from '../../config';
import NetworkError from './networkError';
import PostRequest from './requests/postRequest';
import GetRequest from './requests/getRequest';
import DeleteRequest from './requests/deleteRequest';
import PutRequest from './requests/putRequest';

import {showToast} from '../redux/action/toastAction';
import {toLoginScreen} from '../redux/action/navigateAction';
import TOAST_TYPE from '../common/constants/toastType';

import {RESET} from '../redux/action/actionTypes';

import {receiveToken} from '../redux/action/authAction';

const {DEFAULT, WARNING, DANGER} = TOAST_TYPE;

const Unauthorized = 401;
const Unprocessable_Entity = 422;

const AccessTokenExpired = 190;
const LoginErrorCode = 191;
const RefreshTokenExpired = 192;
const RefreshTokenRevoked = 193;

class AppClient {
  constructor(url, timeout) {
    this.client = new Client(url, timeout);
    this.client.addRequestInterceptor(
      config => {
        const {auth} = this.store.getState().entities;
        const headers = {...config.headers};
        const {accessToken} = auth;
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        config.headers = headers;
        return config;
      },
      error => Promise.reject(error),
    );
    this.client.addResponseInterceptor(
      response => response.data,
      error => {
        let networkError = new NetworkError(0, 'Error');
        if (error.code === 'ECONNABORTED') {
          networkError = new NetworkError(error.code, {message: 'Timeout'});
        }
        if (error.response) {
          const {status, data} = error.response;

          if (status === Unauthorized) {
            const {code} = data;

            if (code === LoginErrorCode) {
              // login error
              networkError = new NetworkError(status, data);
            } else if (code === AccessTokenExpired) {
              const {auth} = this.store.getState().entities;
              const {refreshToken, accessToken} = auth;

              const originalRequest = error.config;

              if (originalRequest._retry) {
                return Promise.reject(error);
              }

              return this.client
                .post('auth/refresh-token', {
                  refresh_token: refreshToken,
                  access_token: accessToken,
                })
                .then(res => {
                  const {access_token, refresh_token, expires_in} = res;
                  this.store.dispatch(
                    receiveToken({
                      accessToken: access_token,
                      refreshToken: refresh_token,
                      expiresIn: expires_in,
                    }),
                  );

                  originalRequest._retry = true;
                  return this.client.request(originalRequest);
                })
                .catch(err => {
                  const errCode = err.response?.data?.code;
                  if (errCode === RefreshTokenExpired) {
                    networkError = new NetworkError(status, data);
                    return Promise.reject(networkError);
                  } else if (errCode === RefreshTokenRevoked) {
                    // If other simultaneous refresh token request success
                    // server return this code
                    // retry with new token get from other refresh token request
                    originalRequest._retry = true;
                    return this.client
                      .request(originalRequest)
                      .then(res => {
                        return res;
                      })
                      .catch(err2 => {
                        if (err2.response?.status === Unauthorized) {
                          networkError = new NetworkError(status, data);
                          return Promise.reject(networkError);
                        }

                        return Promise.reject(err2);
                      });
                  }

                  return Promise.reject(err);
                });
            } else if (code === RefreshTokenExpired) {
              return Promise.reject(error);
            } else if (code === RefreshTokenRevoked) {
              return Promise.reject(error);
            } else {
              // unknow error
              networkError = new NetworkError(status, data);
            }
          }

          networkError = new NetworkError(status, data);
        }

        return Promise.reject(networkError);
      },
    );
  }

  setStore(store) {
    this.store = store;
  }

  showError(error) {
    let text = 'Error';
    let type = DEFAULT;
    if (error instanceof NetworkError) {
      const code = error.getCode();
      const data = error.getData();
      if (data && data.message) {
        text = data.message;
      } else {
        text = `Error code ${code}`;
      }
      if (code === Unprocessable_Entity) {
        type = WARNING;
      } else if (code === Unauthorized) {
        type = DANGER;
      }
    }

    this.store.dispatch(showToast(text, type));
  }

  async handleUnauthorized() {
    this.store.dispatch({
      type: RESET,
    });
    await this.store.dispatch(toLoginScreen());
  }

  handleError(error, isShowError) {
    if (error instanceof NetworkError) {
      const code = error.getCode();

      if (code === Unauthorized) {
        this.handleUnauthorized();
      }
    }

    if (isShowError) {
      this.showError(error);
    }
  }

  async get(request: GetRequest, isShowError = true) {
    const url = request.getUrl();
    const params = request.getParams();

    try {
      return await this.client.get(url, params);
    } catch (error) {
      this.handleError(error, isShowError);
      throw error;
    }
  }

  async post(request: PostRequest, isShowError = true) {
    const url = request.getUrl();
    const data = request.getData();

    try {
      return await this.client.post(url, data);
    } catch (error) {
      this.handleError(error, isShowError);
      throw error;
    }
  }

  async postData(formDataRequest, isShowError = true) {
    const url = formDataRequest.getUrl();
    const data = formDataRequest.getData();

    try {
      return await this.client.postData(url, data);
    } catch (error) {
      this.handleError(error, isShowError);
      throw error;
    }
  }

  async postFormData(url, data, onUploadProgress: () => {}) {
    const header = () => {
      const {auth} = this.store.getState().entities;
      const headers = {};
      const {accessToken} = auth;
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      headers['Content-Type'] = 'multipart/form-data';
      headers.Accept = 'application/json';
      return headers;
    };
    try {
      const finalUrl = Config.API_BASE_URL + url;
      const response = await this.client.postFormData(
        finalUrl,
        data,
        header(),
        onUploadProgress,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  async delete(request: DeleteRequest, isShowError = true) {
    const url = request.getUrl();

    try {
      return await this.client.delete(url);
    } catch (error) {
      this.handleError(error, isShowError);
      throw error;
    }
  }

  async put(request: PutRequest, isShowError = true) {
    const url = request.getUrl();
    const data = request.getData();

    try {
      return await this.client.put(url, data);
    } catch (error) {
      this.handleError(error, isShowError);
      throw error;
    }
  }
}

const appClient = new AppClient(Config.API_BASE_URL, Config.NETWORK_TIMEOUT);

export default appClient;
