# login-utils

  login-utils is a very simple user authentication library. The library has a default User MangoDB model (using mongoose).
Moreover, the encryption of the password is performed using bcrypt.

## Installation

    $ npm install login-utils

## Usage

  The api is very straightforward to use.

### Finding a user by his email address:

```js
  var loginUtils = require("login-utils");
  var email = "kenshiro@some-email.com";

  loginUtils.findUserByEmail(email, function(err, user){
    if(err){
      console.log("An error occurred while trying to find user by email: %s", err);
    }else{
      console.log("User has been retrieved: [id=%s, first-name=%s, last-name=%s, user-name=%s" +
                  ", email=%s, hashed-password=%s, bcrypt-salt=%s]", user._id, user.firstName, user.lastName,
                  user.userName, user.email, user.password, user.salt);
    }
  });

```

### Finding a user by his/her user name:

```js
  var loginUtils = require("login-utils");
  var userName = "kenshiro.hackuto";

  loginUtils.findUserByUserName(userName, function(err, user){
    if(err){
      console.log("An error occurred while trying to find user by user name: %s", err);
    }else{
      console.log("User has been retrieved: [id=%s, first-name=%s, last-name=%s, user-name=%s" +
                  ", email=%s, hashed-password=%s, bcrypt-salt=%s]", user._id, user.firstName, user.lastName,
                  user.userName, user.email, user.password, user.salt);
    }
  });

```


### Finding a user by his/her first and last name:

```js
  var loginUtils = require("login-utils");
  var firstName = "kenshiro";
  var lastName = "hackuto";

  loginUtils.findUsersByFirstAndLastName(firstName, lastName, function(err, user){
    if(err){
      console.log("An error occurred while trying to find user by first and last name: %s", err);
    }else{
      console.log("User has been retrieved: [id=%s, first-name=%s, last-name=%s, user-name=%s" +
                  ", email=%s, hashed-password=%s, bcrypt-salt=%s]", user._id, user.firstName, user.lastName,
                  user.userName, user.email, user.password, user.salt);
    }
  });

```




### Checking user login details against what is stored

```js
   var loginUtils = require("login-utils");
   var password = "Hackuto-Shinken is invincible";
   var email = "kenshiro@hackuto-shinken-mail.com";

   loginUtils.loginCheck(email, password, function(err, response){
     if(err){
      console.log("An error occurred when authenticating user: %s", err);
     }else if(!response.user){
      console.log(response.message);
     }else{
      var user = response.user;
      console.log("Successfully authenticated user: [id=%s, first-name=%s, last-name=%s, user-name=%s" +
                        ", email=%s, hashed-password=%s, bcrypt-salt=%s]", user._id, user.firstName, user.lastName, user.userName,
                        user.email, user.password, user.salt);
     }
   });

```

### Creating a user

```js
  var loginUtils = require("login-utils");
  var firstName = "kenshiro";
  var lastName = "hackuto";
  var password = "Hackuto-Shinken is invincible";
  var email = "kenshiro@hackuto-shinken-mail.com";

  loginUtils.createNewUser({
      firstName: firstName,
      lastName: lastName,
      userName: firstName + "." + lastName,
      password: password,
      email: email
    }, function(err, user){
      if(err){
        console.log("An error occurred creating user: %s", err);
      }else{
        console.log("Successfully created user: [id=%s, first-name=%s, last-name=%s, user-name=%s" +
                    ", email=%s, hashed-password=%s, bcrypt-salt=%s]", user._id, user.firstName, user.lastName, user.userName
                    user.email, user.password, user.salt);
      }
    });
```

### Creating a social media user
Note that this will also create a user, if not user with a matching email address is found.

```js
    var loginUtils = require("login-utils");
    var firstName = "kenshiro";
    var lastName = "hackuto";
    var password = "Hackuto-Shinken is invincible";
    var email = "kenshiro@hackuto-shinken-mail.com";
    var providerName = "Facebook";
    var providerUserId = "1234Fbk07";
    var displayName = "kenshiro-o";

    var socialMediaUserData = {
      firstName: firstName,
      lastName: lastName,
      userName: kenshiro-o,
      email: email,
      providerName: providerName,
      providerUserId: providerUserId,
      displayName: displayName;
    };

    loginUtils.createSocialMediaUser(socialMediaUserData, function(err, socialMediaUser){
      if(err){
          console.log("An error occurred when trying to create social media user [error=%s]", err);
      }else{
        var user = socialMediaUser.user;
        console.log("Successfully created a social media user [social-media-user-id=%s, provider-name=%s, provider-user-id=%s, display-name=%s]",
                     socialMediaUser._id, socialMediaUser.providerName, socialMediaUser.providerUserId, socialMediaUser.displayName);

        console.log("User associated with social media user is the following: [user-id=%s, first-name=%s, last-name=%s," +
                    "email=%s, hashed-password=%s, bcrypt-salt=%s]", user._id, user.firstName, user.lastName, user.email,
                    user.password, user.salt);

      }
    });

```

### Create a password reset token

```js
   var loginUtils = require("login-utils");
   var email = "kenshiro@hackuto-shinken-mail.com";
   //Token expires in 5 hours
   var expiryInMillis = 1000 * 60 * 60 * 5;
   loginUtils.setPasswordResetTokenValidityInMillis(expiryInMillis);

   loginUtils.createPasswordResetToken(email, function(err, token){
     if(err){
      console.log("An error occurred when trying to create password reset token for user: %s", err);
     } else{
        console.log("Successfully created a password reset token [user-id=%s, token-string=%s, token-expiry=%s]",
                    token.user, token.token, token.expiry);
     }
   });

```

### Find a password reset token by token string

```js
   var loginUtils = require("login-utils");
   var tokenString = "GIBBERISH_)821832jkhhfdshdfhdls";

   loginUtils.findPasswordResetTokenByTokenString(tokenString, function(err, token){
     if(err){
      console.log("An error occurred when trying to find password reset token by token string: %s", err);
     }else if(!token){
      console.log("No such password reset token exists [token-string=%s]", tokenString);
     }else{
        console.log("Found password reset token [user-id=%s, token-string=%s, token-expiry=%s]",
                    token.user, token.token, token.expiry);
     }
   });

```







## Additional features
  - Retrieving user by id
  - customizing bcrypt encrypter (e.g. configuring the number of rounds)

## Licence

(The MIT License)

Copyright (c) 2013 Kenshiro &lt;kenshiro@kenshiro.me&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.