var User = require('mongoose').model('User'),
    Passport= require('passport');

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
};

exports.renderSignin = function(req, res, next) {
    if (!req.user) {
        res.render('signin', {
            title: 'Sign-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderSignup = function(req, res, next) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign-up Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};

exports.signup = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                //使用 req.flash() 方法将错误信息写入flash中
                req.flash('error', message);
                return res.redirect('/signup');
            }
            req.login(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.create = function(req,res,next){
    var user = new User(req.body);

    user.save(function(err){
        if(err){
            return next(err);
        }else{
            res.json(user);
        }
    });
};
//文档所有
exports.list = function(req,res,next){
    User.find({},function(err,users){
        if(err){
            return next(err);
        }else{
            res.json(users);
        }
    });
};

exports.read = function(req,res){
    res.json(req.user);
};

//中间件，通过id搜索文档，搜索结果放进request.user中
exports.userByID = function( req ,res,next,id ){
    User.findOne({
        _id:id
    },function(err,user){
        if(err){
            return next(err);
        }else if(user){
            req.user = user;
            next();
        }else {
            next(new Error('failed to load users'));
        }
    })
};

exports.update = function(req,res,next){
    User.findByIdAndUpdate(req.user.id,req.body,function(err,user){
        if (err){
            return next(err);
        }else{
            res.json(user);
        }
    })
};

exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    })
};

exports.saveOAuthUserProfile = function(req, profile, done) {
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function(err, user) {
        if (err) {
            return done(err);
        } else {
            if (!user) {
                var possibleUsername = profile.username ||
                    ((profile.email) ? profile.email.split('@')[0] : '');
                User.findUniqueUsername(possibleUsername, null,
                    function(availableUsername) {
                        profile.username = availableUsername;
                        user = new User(profile);
                        user.save(function(err) {
                            if (err) {
                                var message = _this.getErrorMessage(err);
                                req.flash('error', message);
                                return res.redirect('/signup');
                            }
                            return done(err, user);
                        });
                    });
            } else {
                return done(err, user);
            }
        }
    });
};
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }
    next();
};