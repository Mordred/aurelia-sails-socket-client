import 'todomvc-common/base.css!'
import 'todomvc-app-css/index.css!'

import { inject, computedFrom } from 'aurelia-framework';
import { SailsSocketClient } from 'aurelia-sails-socket-client';

import Todo from './models/todo';

@inject(SailsSocketClient)
export class App {

  todos = [];
  todo = new Todo({
    title: '',
    completed: false
  });

  constructor(sails) {
    this.sails = sails;
  }

  activate() {
    this.sails.get('todos').then((response) => {
      this.todos = response.body.map((t) => new Todo(t));

      this.subscribe();
    });
  }

  deactivate() {
    this.unsubscribe();
  }

  get hasCompleted() {
    for (let todo of this.todos) {
      if (todo.completed) {
        return true;
      }
    }

    return false;
  }

  get allCompleted() {
    for (let todo of this.todos) {
      if (!todo.completed) {
        return false;
      }
    }

    return true;
  }

  addTodo(todo) {
    this.sails.post('todos', todo).then((response) => {
      this.todos.push(new Todo(response.body));
      this.todo = new Todo({
        title: '',
        completed: false
      });
    });
  }

  editTodo(todo) {
    todo.editing = true;
  }

  saveTodo(todo) {
    this.sails.put(`todos/${todo.id}`, todo).then((response) => {
      // We just replace data in current instance
      todo.data = response.body;
      // Remove editing flag
      todo.editing = false;
    });
    // Must return true, because event will no bubble and the checkbox will not change its state
    return true;
  }

  toggleTodo(todo) {
    todo.completed = !todo.completed;
    this.saveTodo(todo);
  }

  toggleAll(todos) {
    let todo ;
    let allCompleted = true;
    for (todo of todos) {
      if (!todo.completed) {
        allCompleted = false;
        break;
      }
    }

    for (todo of todos) {
      if (todo.completed === allCompleted) {
        todo.completed = !todo.completed;
        this.saveTodo(todo);
      }
    }
  }

  removeTodo(todo) {
    this.sails.delete(`todos/${todo.id}`).then((response) => {
      let index = this.todos.indexOf(todo);
      if (index > -1) {
        this.todos.splice(index, 1);
      }
    });
  }

  clearCompleted(todos) {
    for (let todo of todos) {
      if (todo.completed) {
        this.removeTodo(todo);
      }
    }
  }

  subscribe() {
    this.sails.on('todo', this.serverUpdate.bind(this));
  }

  unsubscribe() {
    this.sails.off('todo');
  }

  serverUpdate(message) {
    if (message.verb === 'created') {
      this.todos.push(new Todo(message.data));
    } else if (message.verb === 'updated') {
      let i;
      for (i = 0; i < this.todos.length; i++) {
        let todo = this.todos[i];
        if (todo.id === message.id) {
          todo.data = message.data;
          break;
        }
      }
    } else if (message.verb === 'destroyed') {
      let i;
      for (i = 0; i < this.todos.length; i++) {
        let todo = this.todos[i];
        if (todo.id === message.id) {
          this.todos.splice(i, 1);
          break;
        }
      }
    }
  }

}
