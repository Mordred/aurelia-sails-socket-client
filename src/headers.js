export class Headers {

  constructor(headers = {}) {
    this.headers = headers;
  }

  add(key, value) {
    this.headers[key] = value;
  }

  get(key) {
    return this.headers[key];
  }

  clear() {
    this.headers = {};
  }

}
