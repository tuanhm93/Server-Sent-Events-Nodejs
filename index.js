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

    this.listClient.push({
      id,
      client
    });

    client.disconnect(() => {
      const length = this.listClient.length;
      for(let i=0; i<length; i++) {
        if(this.listClient[i].id === id) {
          this.listClient.slice(i, 1);
          break;
        }
      }
    });
  }

  broadcast(eventName, data) {
    this.listClient.forEach((inf) => {
      inf.client.sendEvent(eventName, data);
    });
  }
}

module.exports = new SSEManager;
