var SSE = require('./libs/sse');
var uuid = require('uuid/v4');

class SSEManager {
  constructor(options) {
    this.options = options || {};
    this.listClient = [];
    this.listMap = {};

    this.heartBeatManager();
  }

  add(res, id) {
    id = id || uuid();
    const client = new SSE(res, this.options);

    this.listClient.push({
      id,
      client
    });

    this.listMap[id] = client;

    client.disconnect(() => {
      const length = this.listClient.length;
      for(let i=0; i<length; i++) {
        if(this.listClient[i].id === id) {
          this.listClient.splice(i, 1);
          delete this.listMap[id];
          break;
        }
      }
    });
  }

  isHas(id) {
    return !!this.listMap[id];
  }

  sentEvent(id, eventName, data) {
    if(this.listMap[id]) {
      this.listMap[id].sendEvent(eventName, data);
    }
  }

  broadcast(eventName, data) {
    this.listClient.forEach((inf) => {
      inf.client.sendEvent(eventName, data);
    });
  }

  heartBeatManager() {
    setInterval(() => {
      this.listClient.forEach((inf) => {
        inf.client.send('');
      });
    }, 60000)
  }
}

module.exports = SSEManager
