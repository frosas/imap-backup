'use strict';

const Mailbox = require('./mailbox');
const Message = require('./message');
const util = require('./util');

module.exports = class {
  constructor(nodeImap) {
    this._nodeImap = nodeImap;
  }
  
  /**
   * Opens every mailbox waiting for callback to finish before moving to the 
   * next one.
   * 
   * TODO Iterate them recursively
   */
  getMailboxes(callback) {
    console.log(`Obtaining mailboxes...`);
    return this._nodeImap.getBoxesAsync().then(nodeImapMailboxes => {
      return Object.entries(nodeImapMailboxes).map(([name, nodeImapMailbox]) => {
        return new Mailbox(this, name, nodeImapMailbox);
      });
    });
  };
  
  useMailbox(mailbox, callback) {
    if (this._selectedMailbox) {
      throw new Error(`Another mailbox (${this._selectedMailbox}) is already in use`);
    }
    this._selectedMailbox = mailbox;
    return this._nodeImap.openBoxAsync(mailbox.name, /* read-only */ true)
      .then(callback)
      .finally(() => this._selectedMailbox = null);
  }
  
  fetchCurrentMailboxMessages(callback) {
    return new Promise((resolve, reject) => {
      console.log(`Retrieving messages...`);
      const messages = [];
      this._nodeImap.fetch('1:*', {bodies: ''})
        .on('message', message => {
          let whenBody, uid;
          message
            // TODO Do we have to convert it to a string if all we do is to save
            // it to a file?
            .on('body', stream => whenBody = util.streamToString(stream))
            .on('attributes', attributes => uid = attributes.uid)
            .on('end', () => {
              return whenBody.then(body => {
                callback(new Message(this._selectedMailbox, uid, body))
              });
            });
        })
        .on('error', reject)
        .on('end', () => resolve(messages));
    });
  }
}