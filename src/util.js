'use strict';

exports.streamToString = stream => {
  return new Promise((resolve, reject) => {
    let string = '';
    stream
      .on('data', data => string += data.toString('utf8'))
      .on('error', reject)
      .on('end', () => resolve(string));
  });
};
