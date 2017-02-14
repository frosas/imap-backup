'use strict';

const NodeImap = require('imap');
const Bluebird = require('bluebird');
const ConnectedAccount = require('./connected-account');

module.exports = class {
  /**
   * @param {Object} config
   */
  constructor(config) {
    this._config = config;
  }

  /**
   * @param {function} callback
   */
  connect(callback) {
    const nodeImap = Bluebird.promisifyAll(new NodeImap(this._config));
    console.log(`Connecting and authenticating...`);
    nodeImap.connect();
    nodeImap.once('ready', () => {
      Bluebird.try(() => callback(new ConnectedAccount(nodeImap)))
        .finally(() => {
          console.log(`Disconnecting...`);
          nodeImap.end();
        });
    });
  }
};
