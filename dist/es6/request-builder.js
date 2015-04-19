import { join } from 'aurelia-path';
import { SocketRequestMessage } from './socket-request-message';

export class RequestBuilder {

  constructor(client) {
    this.client = client;
    this.transformers = [];
  }

  static addHelper(name, fn) {
    RequestBuilder.prototype[name] = function() {
      this.transformers.push(fn.apply(this, arguments));
      return this;
    };
  }

  send() {
    let message = new SocketRequestMessage();
    return this.client.send(message,
      [].concat(this.client.beforeRequestTransformers, this.transformers, this.client.afterRequestTransformers)
    );
  }

}

RequestBuilder.addHelper('asDelete', function(){
  return function(client, processor, message){
    message.method = 'delete';
  };
});

RequestBuilder.addHelper('asGet', function(){
  return function(client, processor, message){
    message.method = 'get';
  };
});

RequestBuilder.addHelper('asHead', function(){
  return function(client, processor, message){
    message.method = 'head';
  };
});

RequestBuilder.addHelper('asOptions', function(){
  return function(client, processor, message){
    message.method = 'options';
  };
});

RequestBuilder.addHelper('asPatch', function(){
  return function(client, processor, message){
    message.method = 'patch';
  };
});

RequestBuilder.addHelper('asPost', function(){
  return function(client, processor, message){
    message.method = 'post';
  };
});

RequestBuilder.addHelper('asPut', function(){
  return function(client, processor, message){
    message.method = 'put';
  };
});

RequestBuilder.addHelper('withUri', function(uri){
  return function(client, processor, message){
    message.uri = uri;
  };
});

RequestBuilder.addHelper('withContent', function(content){
  return function(client, processor, message){
    message.content = content;
  };
});

RequestBuilder.addHelper('withBaseUri', function(baseUri){
  return function(client, processor, message){
    message.baseUri = baseUri;
  };
});

RequestBuilder.addHelper('withParams', function(params){
  return function(client, processor, message){
    message.params = params;
  };
});

RequestBuilder.addHelper('withHeader', function(key, value){
  return function(client, processor, message){
    message.headers.add(key, value);
  };
});

RequestBuilder.addHelper('withCredentials', function(value){
  return function(client, processor, message){
    message.withCredentials = value;
  };
});
