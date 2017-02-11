'use strict';

const Mailbox = require('./mailbox');
const Message = require('./message');
const util = require('./util');

module.exports = class {
  constructor(nodeImap) {
    this._nodeImap = nodeImap;
  }
  
  /**
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
    console.log(`Opening ${mailbox}...`);
    if (this._selectedMailbox) {
      throw new Error(`Another mailbox (${this._selectedMailbox}) is already in use`);
    }
    this._selectedMailbox = mailbox;
    return this._nodeImap.openBoxAsync(mailbox.name, /* read-only */ true)
      .then(callback)
      .finally(() => this._selectedMailbox = null);
  }
  
  fetchCurrentMailboxMessages() {
    return new Promise((resolve, reject) => {
      console.log(`Retrieving messages in current mailbox...`);
      const messages = [];
      this._nodeImap.fetch('1:*')
        .on('message', message => {
          message.on('attributes', attributes => {
            messages.push(new Message(this._selectedMailbox, attributes.uid));
          });
        })
        .on('error', reject)
        .on('end', () => resolve(messages));
    });
  }
  
  fetchCurrentMailboxMessageBody(message) {
    return new Promise((resolve, reject) => {
      console.log(`Fetching ${message}...`);
      return this._nodeImap.fetch(message.uid, {bodies: ''})
        .on('message', message => {
          // TODO Do we have to convert it to a string if all we do is to save
          // it to a file?
          message.on('body', stream => util.streamToString(stream).then(resolve));
        })
        .on('error', reject);
    });
  }
}