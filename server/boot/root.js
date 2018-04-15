// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
var loopback = require('loopback');

module.exports = function(app) {
  var router = app.loopback.Router();

  // app.use(loopback.token({
  //   model: app.models.customerAccessToken
  // }));

  router.get('/', function(req, res) {
    res.render('index', {
      loginFailed: false
    });
  });

  router.get('/projects', function(req, res) {
    res.render('projects');
  });

  router.post('/projects', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    app.models.Customer.login({
      email: email,
      password: password
    }, 'user', function(err, token) {
      if (err)
        return res.render('index', {
          email: email,
          password: password,
          loginFailed: true
        });

      token = token.toJSON();
      console.log("token" + JSON.stringify(token))

      res.render('projects', {
        username: token.user.username,
        accessToken: token.id
      });
    });
  });

  router.get('/logout', function(req, res) {
    var AccessToken = app.models.AccessToken;
    var token = new AccessToken({id: req.query['access_token']});
    token.destroy();

    res.redirect('/');
  });

  app.use(router);
};
