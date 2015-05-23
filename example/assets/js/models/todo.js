import Model from './model';

export default class Todo extends Model {

  get title() {
    return this.data.title;
  }

  set title(value) {
    return this.data.title = value;
  }

  get completed() {
    return !!this.data.completed;
  }

  set completed(value) {
    return this.data.completed = !!value;
  }

}
