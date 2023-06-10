const sha = require('sha256');

const encrypt = (pass) => {
  return sha(pass);
};

module.exports = encrypt;
