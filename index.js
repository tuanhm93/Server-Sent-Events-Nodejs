var SSE = require('./libs/sse');
var uuid = require('uuid/v4');

class SSEManager {
  constructor(options) {
    this.options = options || {};
    this.listClient = [];
  }

  add(res) {
    const id = uuid();
    const client = new SSE(res, this.options);

    listClient.push({
      id,
      client
    });

    client.disconnect(() => {
      const length = listClient.length;
      for(let i=0; i<length; i++) {
        if(listClient[i].id === id) {
          listClient.slice(i, 1);
          break;
        }
      }
    });
  }

  broadcast(eventName, data) {
    listClient.forEach((inf) => {
      inf.client.sendEvent(eventName, data);
    });
  }
}

module.exports = new SSEManager;
