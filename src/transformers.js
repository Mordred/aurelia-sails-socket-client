import core from 'core-js';

export function CSRFTransformerFactory(uri) {
  return function CSRFTransformer(client, processor, message) {
    // Skip GET requests
    if (message.method === 'get' || message.uri === uri) {
      return;
    }

    let setCsrfToken = (message, token) => message.headers.add('X-Csrf-Token', token);

    if (client.CSRFToken) {
      setCsrfToken(message, client.CSRFToken);
    } else {
      return new Promise((resolve, reject) => {
        let request = client.createRequest(uri).asGet();

        request.send().then(response => {
          client.CSRFToken = response.content._csrf;
          setCsrfToken(message, client.CSRFToken);
          resolve();
        }).catch(reject);
      })
    }
  }
}
