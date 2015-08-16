import { computedFrom } from 'aurelia-framework';

import Model from './model';

export default class Todo extends Model {

  @computedFrom('data')
  get title() {
    return this.data.title;
  }

  set title(value) {
    return this.data.title = value;
  }

  @computedFrom('data')
  get completed() {
    return !!this.data.completed;
  }

  set completed(value) {
    return this.data.completed = !!value;
  }

}
