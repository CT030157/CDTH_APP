import BaseRequest from './baseRequest';

class GetRequest extends BaseRequest {
  constructor(url, params) {
    super(url);
    this.params = params;
  }

  getParams() {
    return this.params;
  }
}

export default GetRequest;
