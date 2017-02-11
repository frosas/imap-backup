'use strict';

module.exports = class {
  constructor(mailbox, uid, body) {
    this.mailbox = mailbox;
    this.uid = uid;
    this.body = body;
  }
  
  getBackupPath() {
    return `${this.mailbox.getBackupPath()}/${this.uid}.eml`;
  }
}
