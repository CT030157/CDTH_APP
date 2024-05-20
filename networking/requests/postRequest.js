import BaseRequest from './baseRequest';

class PostRequest extends BaseRequest {
  constructor(url, data) {
    super(url);
    this.data = data;
  }

  getData() {
    return this.data;
  }
}

export default PostRequest;
