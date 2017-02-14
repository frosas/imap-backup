'use strict';

const nodePath = require('path');

const Mailbox = module.exports = class {
  /**
   * @param {ConnectedAccount} connectedAccount
   * @param {string} name
   * @param {Mailbox} parent
   */
  constructor(connectedAccount, name, parent) {
    this._connectedAccount = connectedAccount;
    this._name = name;
    this._parent = parent;
  }

  /**
   * @return {string}
   */
  get fullName() {
    let fullName = this._name;
    // TODO Get delimiter from NodeImap#delimiter
    if (this._parent) fullName = `${this._parent.fullName}/${fullName}`;
    return fullName;
  }

  /**
   * @return {string}
   */
  get backupPath() {
    let path = this._name; // TODO Sanitize it
    if (this._parent) path = `${this._parent.backupPath}${nodePath.sep}${path}`;
    return path;
  }

  /**
   * @param {function} callback
   * @return {Promise}
   */
  use(callback) {
    return this._connectedAccount.useMailbox(this, callback);
  }

  /**
   * @param {function} callback
   * @return {Promise}
   *
   * TODO Would this be more responsive by returning the messages in a stream or
   * an Observable?
   */
  getMessages(callback) {
    return this.use(() => {
      return this._connectedAccount.fetchCurrentMailboxMessages(callback);
    });
  }

  /**
   * @param {Message} message
   * @return {Promise<stream.Readable>}
   */
  fetchMessageBody(message) {
    return this.use(() => {
      return this._connectedAccount.fetchCurrentMailboxMessageBody(message);
    });
  }

  /**
   * @return {string}
   */
  toString() {
    return `mailbox "${this.fullName}"`;
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  equals(value) {
    return value instanceof Mailbox && value.fullName === this.fullName;
  }
};
