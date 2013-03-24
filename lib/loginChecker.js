var bcryptUtils = require("./util/bcryptUtils"),
  User = require("./model/User"),
  SocialMediaUser = require("./model/SocialMediaUser");

/**
 * This method assumes the email and password have already been validated AND sanitized
 * @param email the user's email
 * @param password the user's password
 * @param callback
 */
module.exports.loginCheck = function (email, password, callback) {
  User.findOne({email: email}, function (err, user) {
    if (err) {
      process.nextTick(function () {
        callback(err);
      });
    } else if (!user) {
      process.nextTick(function () {
        callback(null, {user: null, message: "User with email '" + email + "' does not exist in store"});
      });
    } else {
      bcryptUtils.checkHash(password, user.salt, user.password, function (err, match) {
        if (err) {
          process.nextTick(function () {
            callback(err);
          });
        } else {
          if (!match) {
            process.nextTick(function () {
              callback(null, {user: null, message: "Incorrect user/password combination. Please try again."})
            });
          } else {
            process.nextTick(function () {
              callback(null, {user: user});
            });
          }
        }
      });
    }
  });
};

function findUserByUserName(userName, callback){
  User.findOne({userName: userName}, callback);
}


function findUserByEmail(userEmail, callback) {
  User.findOne({email: userEmail}, callback);
}

function findUsersByFirstAndLastName(firstName, lastName, callback){
  User.find({firstName: firstName, lastName: lastName}, callback);
}

module.exports.findUserByUserName = findUserByUserName;
module.exports.findUserByEmail = findUserByEmail;
module.exports.findUsersByFirstAndLastName = findUsersByFirstAndLastName;


function findSocialMediaUser (providerName, providerUserId, callback) {
  SocialMediaUser.findOne({providerName: providerName, providerUserId: providerUserId})
    .populate("user")
    .exec(function (err, socialMediaUser) {
      if (err) {
        process.nextTick(function () {
          callback(err);
        });
      } else {
        process.nextTick(function () {
          callback(null, socialMediaUser);
        });
      }
    });
};

module.exports.findSocialMediaUser = findSocialMediaUser;


module.exports.createSocialMediaUser = function(socialMediaUserData, callback){

  var cb3 = function(dontCare,user){
    var socialMediaUser = new SocialMediaUser({
      providerName: socialMediaUserData.providerName,
      providerUserId: socialMediaUserData.providerUserId,
      displayName: socialMediaUserData.displayName,
      user: user._id
    });

    socialMediaUser.save(function(err){
      if(err){
        process.nextTick(function(){
           callback(err);
        });
      }else{
        user.socialMediaPersonae.push(socialMediaUser._id);
        user.save(function(err){
          if(err){
            SocialMediaUser.remove({_id: socialMediaUser._id}, function(dontCare){});
            process.nextTick(function(){
              callback(err);
            });
          }else{
            process.nextTick(function(){
              findSocialMediaUser(socialMediaUser.providerName, socialMediaUser.providerUserId, callback);
            });
          }
        });
      }
    });
  };

  var cb2 = function(){
      var userObj = {
        firstName: socialMediaUserData.firstName,
        lastName: socialMediaUserData.lastName,
        userName: socialMediaUserData.userName,
        email: socialMediaUserData.email,
        password: "Random-Date-pwd_" + Math.floor(Math.random()*1000)
      };
      createNewUser(userObj, cb3);
  };

  var cb1 = function(err, user){
    if(err){
      process.nextTick(function(){
        callback(err);
      });
    }else if(!user){
      process.nextTick(function(){
        cb2();
      })
    }else{
      process.nextTick(function(){
        cb3(null, user);
      })
    }
  };

  findUserByEmail(socialMediaUserData.email, cb1);

};



/**
 * This function assumes all input has been validated beforehand
 * @param userData an object containing all the values to create the user
 * @param callback
 */
function createNewUser(userData, callback) {
  var password = userData.password;
  bcryptUtils.generateSaltAndHash(password, function (err, saltAndHash) {
    if (err) {
      process.nextTick(function () {
        callback(err);
      });

    } else {
      var salt = saltAndHash.salt;
      var hash = saltAndHash.hash;

      var user = new User({
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        salt: salt,
        password: hash,
        creationDate: new Date(),
        socialMediaPersonae: []
      });
      user.save(function (err) {
        if (err) {
          process.nextTick(function () {
            callback(err);
          });
        } else {
          process.nextTick(function () {
            callback(null, user)
          });
        }
      });
    }
  });
};

module.exports.createNewUser = createNewUser;