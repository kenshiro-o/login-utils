var vows = require("vows"),
    mongoose = require("mongoose"),
    assert = require("assert"),
    util = require("util"),
    User = require("./../lib/model/User"),
    loginChecker = require("./../lib/loginChecker");

mongoose.connect("mongodb://127.0.0.1/loginCheckDB");
var firstName = "kenshiro";
var lastName = "hackuto";
var password = "Hackuto-Shinken is invincible";
var email = "kenshiro@hackuto-shinken-mail.com";

vows.describe("User checks").addBatch({
  "Cleanup hacks":{
    topic: function(){
      User.remove({email: email}, this.callback);
    },

    "User is deleted": function(status){
      //Always return true
      assert.ok(true);
    }
  }
}).addBatch({
  "When creating a user that does not yet exist":{
    topic: function(){
      loginChecker.createNewUser({
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email
      }, this.callback);
    },

    "A new user is returned": function(err, user){
      assert.ok(!err);
      assert.ok(user);
      assert.deepEqual(user.firstName, firstName);
      assert.deepEqual(user.lastName, lastName);
      assert.deepEqual(user.email, email);
      assert.ok(user.password);
      assert.ok(user.salt);
    }
  }
}).addBatch({
    "When creating a user that already exists":{
      topic: function(){
        loginChecker.createNewUser({
          firstName: firstName,
          lastName: lastName,
          password: password,
          email: email
        }, this.callback);
      },

      "An error is returned": function(err, user){
        assert.ok(err);
      }
    },

    "When searching for a user that does not exist":{
      topic: function(){
        loginChecker.findUserByEmail("kenshiro@email.com", this.callback);
      },

      "No user is returned": function(err, response){
        assert.ok(!err);
        assert.ok(!response);
      }
    },

    "When searching for a user that does exist":{
      topic: function(){
        loginChecker.findUserByEmail(email, this.callback);
      },

      "The expected user is returned": function(err, user){
        assert.ok(!err);
        assert.ok(user);
        assert.deepEqual(user.email, email);
        assert.deepEqual(user.firstName, firstName);
        assert.deepEqual(user.lastName, lastName);
      }
    },

    "When trying to login with an incorrect password":{
      topic: function(){
        loginChecker.loginCheck(email, "123", this.callback);
      },

      "An error is returned": function(err, response){
        assert.ok(!err);
        assert.ok(!response.user);
        assert.ok(response.message);
      },

      "When trying to login with a correct password":{
        topic: function(){
          loginChecker.loginCheck(email, password, this.callback);
        },

        "A user is returned": function(err, response){
          assert.ok(!err);
          assert.ok(response.user);
          assert.deepEqual(response.user.email, email);
          assert.deepEqual(response.user.firstName, firstName);
          assert.deepEqual(response.user.lastName, lastName);
        }
      }
    }
}).run();