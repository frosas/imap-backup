module.exports = {
  // Connection and authentication options as passed to node-imap (see available
  // options at https://github.com/mscdex/node-imap#connection-instance-methods).
  imap: {
    user: '<user>',
    password: '<password>',
    host: '<host>',
    port: 993,
    tls: true,
    authTimeout: 60000
  },
  mailboxes: ['INBOX']
}