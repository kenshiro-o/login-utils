var vows = require("vows"),
  mongoose = require("mongoose"),
  assert = require("assert"),
  util = require("util"),
  User = require("./../lib/model/User"),
  SocialMediaUser = require("./../lib/model/SocialMediaUser"),
  loginChecker = require("./../lib/loginChecker"),
  expect = require("expect.js");

mongoose.connect("mongodb://127.0.0.1/login-utils-test");
var firstName = "kenshiro";
var lastName = "hackuto";
var userName = "kenshiro.hokuto";
var password = "Hackuto-Shinken is invincible";
var email = "kenshiro@hackuto-shinken-mail.com";

var providerName = "Facebook";
var providerUserId = "FacebookUserId-Kenshiro";

vows.describe("User checks").addBatch({
  "Delete Users": {
    topic: function () {
      User.remove({}, this.callback);
    },

    "User is deleted": function (status) {
      //Always return true
      assert.ok(true);
    }
  },

  "Delete Social Media Users": {
    topic: function () {
      SocialMediaUser.remove({}, this.callback);
    },

    "Social Media User is deleted": function (status) {
      //Always return true
      assert.ok(true);
    }
  }


}).addBatch({
    "When creating a user that does not yet exist": {
      topic: function () {
        loginChecker.createNewUser({
          firstName: firstName,
          lastName: lastName,
          userName: userName,
          password: password,
          email: email
        }, this.callback);
      },

      "A new user is returned": function (err, user) {
        assert.ok(!err);
        assert.ok(user);
        assert.deepEqual(user.firstName, firstName);
        assert.deepEqual(user.lastName, lastName);
        assert.deepEqual(user.userName, userName);
        assert.deepEqual(user.email, email);
        assert.ok(user.password);
        assert.ok(user.salt);
      }
    }
  }).addBatch({
    "When creating a user that already exists": {
      topic: function () {
        loginChecker.createNewUser({
          firstName: firstName,
          lastName: lastName,
          userName: userName,
          password: password,
          email: email
        }, this.callback);
      },

      "An error is returned": function (err, user) {
        assert.ok(err);
      }
    },

    "When searching for a user that does not exist": {
      topic: function () {
        loginChecker.findUserByEmail("kenshiro@email.com", this.callback);
      },

      "No user is returned": function (err, response) {
        assert.ok(!err);
        assert.ok(!response);
      }
    },

    "When searching for a user that does exist": {
      topic: function () {
        loginChecker.findUserByEmail(email, this.callback);
      },

      "The expected user is returned": function (err, user) {
        assert.ok(!err);
        assert.ok(user);
        assert.deepEqual(user.email, email);
        assert.deepEqual(user.firstName, firstName);
        assert.deepEqual(user.lastName, lastName);
        assert.deepEqual(user.userName, userName);
      }
    },

    "When searching for a user name that does not exist": {
      topic: function () {
        loginChecker.findUserByUserName("kenshiro.notExists", this.callback);
      },

      "No user is returned": function (err, response) {
        assert.ok(!err);
        assert.ok(!response);
      }
    },

    "When searching for a user name that does exist": {
      topic: function () {
        loginChecker.findUserByUserName(userName, this.callback);
      },

      "The expected user is returned": function (err, user) {
        assert.ok(!err);
        assert.ok(user);
        assert.deepEqual(user.email, email);
        assert.deepEqual(user.firstName, firstName);
        assert.deepEqual(user.lastName, lastName);
        assert.deepEqual(user.userName, userName);
      }
    },


    "When trying to login with an incorrect password": {
      topic: function () {
        loginChecker.loginCheck(email, "123", this.callback);
      },

      "An error is returned": function (err, response) {
        assert.ok(!err);
        assert.ok(!response.user);
        assert.ok(response.message);
      },

      "When trying to login with a correct password": {
        topic: function () {
          loginChecker.loginCheck(email, password, this.callback);
        },

        "A user is returned": function (err, response) {
          assert.ok(!err);
          assert.ok(response.user);
          assert.deepEqual(response.user.email, email);
          assert.deepEqual(response.user.firstName, firstName);
          assert.deepEqual(response.user.lastName, lastName);
        }
      }
    },

    "When creating a social media persona for an already existing user":{
      topic: function(){
        var socialMediaUserData = {
          firstName: firstName,
          lastName: lastName,
          userName: userName,
          email: email,
          providerName: providerName,
          providerUserId: providerUserId,
          displayName: firstName
        };
        loginChecker.createSocialMediaUser(socialMediaUserData, this.callback);
      },

      "A social media user is returned": function(err, socialMediaUser){
        expect(err).to.be(null);
        expect(socialMediaUser.user.email).to.be(email);
        expect(socialMediaUser.providerUserId).to.be(providerUserId);
        expect(socialMediaUser.providerName).to.be(providerName);
        expect(socialMediaUser.displayName).to.be(firstName);
      }
    },

    "When creating a social media persona for a user that does not exist":{
      topic: function(){
        var socialMediaUserData = {
          firstName: firstName,
          lastName: lastName,
          userName: userName + "2",
          email: "kenshiro-test2@mail.com",
          providerName: providerName,
          providerUserId: "12345",
          displayName: "Ken123"
        };
        loginChecker.createSocialMediaUser(socialMediaUserData, this.callback);
      },

      "A social media user is returned": function(err, socialMediaUser){
        expect(err).to.be(null);
        expect(socialMediaUser.user.email).to.be("kenshiro-test2@mail.com");
        expect(socialMediaUser.providerUserId).to.be("12345");
        expect(socialMediaUser.providerName).to.be(providerName);
        expect(socialMediaUser.displayName).to.be("Ken123");
      }
    }

  }).addBatch({
    "When looking for a social media user that has not been created yet": {
      topic: function () {
        loginChecker.findSocialMediaUser("Facebook", "1234fbk", this.callback);
      },

      "A null entry is returned": function (err, socialMediaUser) {
        expect(err).to.be(null);
        expect(socialMediaUser).to.be(null);

      }
    }
  }).addBatch({
    "Cleanup": {
      topic: function () {
        return true;
      },

      "Exist gracefully": function (topic) {
        mongoose.connection.close();
        setTimeout(function () {
          process.exit(0);
        }, 2000);

      }
    }
  }).run();