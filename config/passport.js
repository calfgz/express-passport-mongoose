/**
 * Created by pc on 2015/11/30.
 */
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(app, passport) {

    passport.serializeUser(function(user, done) {
        //console.log('serializing user:',user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            //console.log('deserializing user:',user);
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, username, password, done) {
        User.findOne({'username' : username}, function(err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, req.flash('signupMessage', '用户名已存在.'));
            } else {
                var newUser = new User();
                newUser.username = username;
                newUser.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, username, password, done) {
        User.findOne({'username' : username}, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash('loginMessage', '用户不存在.'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', '密码错误.'));
            }

            user.loginDate = Date.now();
            user.save(function(err, user) {
               if (err) {
                   return done(err);
               }
                return done(null, user);
            });
        });
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    //登录提交
    app.post('/login', function(req, res, next){
        //console.log(req.body.rememberme);
        if(req.body.remeberme) {
            req.session.cookie.maxAge = 30*24*60*60*1000;
        } else {
            req.session.cookie.expires = false;
        }
        next();
    }, passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));
    //注册提交
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));
}