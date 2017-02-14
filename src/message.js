'use strict';

module.exports = class {
  /**
   * @param {Mailbox} mailbox
   * @param {string} uid
   */
  constructor(mailbox, uid) {
    this.mailbox = mailbox;
    this.uid = uid;
  }

  /**
   * @return {string}
   */
  get backupPath() {
    return `${this.mailbox.backupPath}/${this.uid}.eml`;
  }

  /**
   * @return {Promise<stream.Readable>}
   */
  fetchBody() {
    return this.mailbox.fetchMessageBody(this);
  }

  /**
   * @return {string}
   */
  toString() {
    return `message ${this.uid} in ${this.mailbox}`;
  }
};
