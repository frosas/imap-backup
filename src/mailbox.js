'use strict';

const nodePath = require('path');

module.exports = class {
  constructor(connectedAccount, name, nodeImapMailbox, parent) {
    this._connectedAccount = connectedAccount;
    this._name = name;
    this._nodeImapMailbox = nodeImapMailbox;
    this._parent = parent;
  }
  
  get name() {
    return this._name;
  }
  
  get fullName() {
    let fullName = this._name;
    // TODO Get delimiter from NodeImap#delimiter
    if (this._parent) fullName = `${this._parent.fullName}/${fullName}`;
    return fullName;
  }
  
  get backupPath() {
    let path = this._name; // TODO Sanitize it
    if (this._parent) path = `${this._parent.backupPath}${nodePath.sep}${path}`;
    return path;
  }
  
  use(callback) {
    return this._connectedAccount.useMailbox(this, callback);
  }
  
  getMessages(callback) {
    return this.use(() => {
      return this._connectedAccount.fetchCurrentMailboxMessages(callback);
    });
  }
  
  fetchMessageBody(message) {
    return this.use(() => {
      return this._connectedAccount.fetchCurrentMailboxMessageBody(message);
    });
  }
  
  toString() {
    return `mailbox "${this.fullName}"`;
  }
}