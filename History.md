0.0.7 / 2013-03-24
====================
* Enable setting of bcrypt number of rounds
* Strengthen hash comparison against timing attacks

0.0.6 / 2013-03-24
====================
* Added password reset token:
  - can create one from a given existing user's email address
  - can set the expiry of the token (in milliseconds)
  - can find one by token string

0.0.5 / 2013-03-24
====================
* Enable searching of users by first and last name
* Improved documentation

0.0.4 / 2013-03-24
====================
* Added userName to User model object. It is a unique field!
* Enabled searching by userName

0.0.3 / 2013-03-17
====================
* Added SocialMediaUser integration:
  - A user can now be associated with multiple social user personae
  - Moreover the social media user has a reference to the user
  - Increased test coverage


0.0.2 / 2013-03-06
====================
* Added git repo and keywords information to package.json

0.0.1 / 2013-03-05
====================

* Initial release
* Basic code for client authentication