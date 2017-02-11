'use strict';

const Mailbox = require('./mailbox');
const Message = require('./message');
const util = require('./util');
const Bluebird = require('bluebird');

module.exports = class {
  constructor(nodeImap) {
    this._nodeImap = nodeImap;
    this._currentMailbox = null;
    this._currentMailboxUses = 0;
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
    if (this._currentMailboxUses && this._currentMailbox !== mailbox) {
      throw new Error(`Another mailbox (${this._currentMailbox}) is already in use`);
    }
    this._currentMailboxUses++;
    return Bluebird.resolve()
      .then(() => {
        if (this._currentMailbox !== mailbox) {
          console.log(`Opening ${mailbox}...`);
          return this._nodeImap.openBoxAsync(mailbox.name, /* read-only */ true)
            .then(() => this._currentMailbox = mailbox);
        }
      })
      .then(callback)
      .finally(() => this._currentMailboxUses--);
  }
  
  fetchCurrentMailboxMessages() {
    return new Promise((resolve, reject) => {
      console.log(`Retrieving messages in current mailbox...`);
      const messages = [];
      this._nodeImap.fetch('1:*')
        .on('message', message => {
          message.on('attributes', attributes => {
            messages.push(new Message(this._currentMailbox, attributes.uid));
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