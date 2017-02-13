'use strict';

module.exports = class {
  constructor(mailbox, uid) {
    this.mailbox = mailbox;
    this.uid = uid;
  }
  
  get backupPath() {
    return `${this.mailbox.backupPath}/${this.uid}.eml`;
  }
  
  fetchBody() {
    return this.mailbox.fetchMessageBody(this);
  }
  
  toString() {
    return `message ${this.uid} in ${this.mailbox}`;
  }
}
