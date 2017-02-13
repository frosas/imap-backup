'use strict';

const Mailbox = require('./mailbox');
const Message = require('./message');
const Bluebird = require('bluebird');

module.exports = class {
  constructor(nodeImap) {
    this._nodeImap = nodeImap;
    this._currentMailbox = null;
    this._currentMailboxUses = 0;
  }
  
  getMailboxes(callback) {
    console.log(`Obtaining mailboxes...`);
    return this._nodeImap.getBoxesAsync().then(nodeImapMailboxes => {
      return this._nodeImapMailboxesToFlattenedMailboxes(nodeImapMailboxes);
    });
  };
  
  useMailbox(mailbox, callback) {
    if (this._currentMailboxUses && !mailbox.equals(this._currentMailbox)) {
      throw new Error(`Another mailbox (${this._currentMailbox}) is already in use`);
    }
    this._currentMailboxUses++;
    return Bluebird.resolve()
      .then(() => {
        if (this._currentMailbox !== mailbox) {
          console.log(`Opening ${mailbox}...`);
          return this._nodeImap.openBoxAsync(mailbox.fullName, /* read-only */ true)
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
        .on('message', message => message.on('body', resolve))
        .on('error', reject);
    });
  }
  
  /**
   * See getMailboxes()
   * 
   * @param {object} nodeImapMailboxes As returned by NodeImap#getBoxes()
   * @return {array}
   */
  _nodeImapMailboxesToFlattenedMailboxes(nodeImapMailboxes, parent) {
    return Object.entries(nodeImapMailboxes).reduce((mailboxes, [name, nodeImapMailbox]) => {
      const mailbox = new Mailbox(this, name, nodeImapMailbox, parent);
      return mailboxes.concat(
        mailbox,
        this._nodeImapMailboxesToFlattenedMailboxes(
          nodeImapMailbox.children || {},
          mailbox
        )
      );
    }, []);
  }
}