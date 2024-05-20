import BaseRequest from './baseRequest';

class PutRequest extends BaseRequest {
  constructor(url, data) {
    super(url);
    this.data = data;
  }

  getData() {
    return this.data;
  }
}

export default PutRequest;
