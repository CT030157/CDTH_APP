class BaseRequest {
  constructor(url) {
    this.url = url;
  }

  getUrl() {
    return this.url;
  }
}

export default BaseRequest;
