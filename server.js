/* globals require, __dirname */
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var soundConfig = require('./soundConfig.js');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;

var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

app.use(morgan({format: 'dev', immediate: true}));
app.use(bodyParser());

app.use(cookieParser());
app.use(session({ secret: 'kaleandchipsanddips', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/soundcloud', passport.authenticate('soundcloud'));
app.get('/auth/soundcloud/callback',
  passport.authenticate('soundcloud', {
    failureRedirect: '/',
    successRedirect: '/player'
  }));

passport.use(new SoundCloudStrategy({
  clientID: soundConfig.CLIENTID,
  clientSecret: soundConfig.CLIENTSECRET,
  callbackURL: soundConfig.REDIRECT
},
function (accessToken, refreshToken, profile, done) {
  done(null, profile);
}));

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

app.get('/player', ensureAuthenticated, function (req, res) {
  res.sendfile('./public/player.html');
});

app.listen(3000);
console.log('On 3k');
