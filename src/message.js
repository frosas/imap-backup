'use strict';

module.exports = class {
  constructor(mailbox, uid) {
    this.mailbox = mailbox;
    this.uid = uid;
  }
  
  fetchBody() {
    return this.mailbox.fetchMessageBody(this);
  }
  
  getBackupPath() {
    return `${this.mailbox.getBackupPath()}/${this.uid}.eml`;
  }
  
  toString() {
    return `message ${this.uid} in ${this.mailbox}`;
  }
}
