class NetworkError extends Error {
  constructor(code, data) {
    super();
    this.name = 'NetworkError';
    this.code = code;
    this.data = data;
  }

  getCode() {
    return this.code;
  }

  getData() {
    return this.data;
  }
}

export default NetworkError;
