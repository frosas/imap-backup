module.exports = {
  imap: {
    // See https://github.com/mscdex/node-imap#connection-instance-methods for 
    // rest of options
    user: '<user>',
    password: '<password>',
    host: '<host>',
    port: 993,
    tls: true,
    authTimeout: 60000
  }
}