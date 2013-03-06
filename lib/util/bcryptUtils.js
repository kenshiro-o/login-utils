/**
 * This file contains utilities to encrypt a plaintext string
 */
var bcrypt = require("bcrypt");
//TODO In future store salt factor in either constants file or config file
var SALT_FACTOR = 11;

function generateSaltAndHash(str, hashCallback) {
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) {
      console.log("An error occurred while trying to generate salt: " + err);
      process.nextTick(function () {
        return hashCallback(err, null);
      });
    } else {
      bcrypt.hash(str, salt, function (err, hash) {
        if (err) {
          console.log("An error occurred while trying to generate hash from salt: " + err);
          process.nextTick(function () {
            return hashCallback(err, null);
          });
        } else {
          process.nextTick(function () {
            return hashCallback(null, {salt: salt, hash: hash});
          });
        }
      });
    }
  });
}

function checkHash(plaintext, salt, expected, hashCheckCallback) {
  bcrypt.hash(plaintext, salt, function (err, hash) {
    if (err) {
      console.log("An error occurred while generating hash: " + err);
      process.nextTick(function () {
        return hashCheckCallback(err, null);
      })
    } else {
      process.nextTick(function () {
        return hashCheckCallback(null, hash === expected);
      });
    }
  });
}

module.exports.generateSaltAndHash = generateSaltAndHash;
module.exports.checkHash = checkHash;