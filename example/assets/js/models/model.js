import { computedFrom } from 'aurelia-framework';

export default class Model {

  constructor(data) {
    this.data = data;
  }

  @computedFrom('data')
  get id() {
    return this.data.id;
  }

  @computedFrom('data')
  get createdAt() {
    return new Date(this.data.createdAt);
  }

  @computedFrom('data')
  get updatedAt() {
    return new Date(this.data.updatedAt);
  }

  toJSON() {
    return this.data;
  }

}
