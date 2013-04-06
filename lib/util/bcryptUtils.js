/**
 * This file contains utilities to encrypt a plaintext string
 */
var bcrypt = require("bcrypt");
//TODO In future store salt factor in either constants file or config file
var NUMBER_OF_ROUNDS = 11;

function generateSaltAndHash(str, hashCallback) {
  bcrypt.genSalt(NUMBER_OF_ROUNDS, function (err, salt) {
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
        var ret = true;
        //This is specifically to avoid timing attacks
        for(var i = 0; i < hash.length; ++i){
          if(hash.charAt(i) !== expected.charAt(i)){
            ret = false;
          }
        }

        return hashCheckCallback(null, ret);
      });
    }
  });
}

module.exports.getBcryptNumberOfRounds = function(){
  return NUMBER_OF_ROUNDS;
};

module.exports.setBcryptNumberOfRounds = function(numberOfRounds){
  if(numberOfRounds && typeof numberOfRounds === "number" && !isNaN(numberOfRounds)){
    console.log("Setting bcrypt number of rounds to new value [current-nb-of-rounds=%d" +
                ", new-nb-of-rounds=%d]", NUMBER_OF_ROUNDS, numberOfRounds);
    NUMBER_OF_ROUNDS = numberOfRounds;
  }else{
    console.log("Trying to set the bcrypt bcrypt number of rounds to an incorrect value. Will keep current number of rounds" +
                "[input-nb-of-rounds=%s, current-nb-of-rounds=%d]", numberOfRounds, NUMBER_OF_ROUNDS);
  }
};

module.exports.generateSaltAndHash = generateSaltAndHash;
module.exports.checkHash = checkHash;