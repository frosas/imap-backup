'use strict';

module.exports = class {
  constructor(connectedAccount, name, nodeImapMailbox) {
    this._connectedAccount = connectedAccount;
    this.name = name;
    this._nodeImapMailbox = nodeImapMailbox;
  }
  
  getBackupPath() {
    return this.name; // TODO Sanitize it
  }
  
  use(callback) {
    return this._connectedAccount.useMailbox(this, callback);
  }
  
  getMessages(callback) {
    return this.use(() => {
      return this._connectedAccount.fetchCurrentMailboxMessages(callback);
    });
  }
  
  toString() {
    return this.name;
  }
}