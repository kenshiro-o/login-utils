var bcryptUtils = require("./util/bcryptUtils"),
    User = require("./model/User");

/**
 * This method assumes the email and password have already been validated AND sanitized
 * @param email the user's email
 * @param password the user's password
 * @param callback
 */
module.exports.loginCheck = function(email, password, callback){
  User.findOne({email: email}, function(err, user){
    if(err){
      process.nextTick(function(){callback(err);});
    }else if(!user){
      process.nextTick(function(){callback(null, {user: null, message: "User with email '" + email + "' does not exist in store"});});
    }else{
      bcryptUtils.checkHash(password, user.salt, user.password, function(err, match){
        if(err){
          process.nextTick(function(){callback(err);});
        }else{
          if(!match){
            process.nextTick(function(){callback(null, {user: null, message: "Incorrect user/password combination. Please try again."})});
          }else{
            process.nextTick(function(){callback(null, {user: user});});
          }
        }
      });
    }
  });
};

module.exports.findUserByEmail = function(userEmail, callback){
  User.findOne({email: userEmail}, function(err, user){
      process.nextTick(function(){callback(err, user);});
  });
};


/**
 * This function assumes all input has been validated beforehand
 * @param userData an object containing all the values to create the user
 * @param callback
 */
module.exports.createNewUser = function(userData, callback){
  var password = userData.password;
  bcryptUtils.generateSaltAndHash(password, function(err, saltAndHash){
    if(err){
      process.nextTick(function () {callback(err);});

    }else{
      var salt = saltAndHash.salt;
      var hash = saltAndHash.hash;

      var user = new User({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        salt: salt,
        password: hash,
        creationDate: new Date()
      });
      user.save(function(err){
        if(err){
          process.nextTick(function(){callback(err);});
        }else{
          process.nextTick(function(){callback(null, user)});
        }
      });
    }
  });
};