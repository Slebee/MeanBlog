var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

/*使用passport.use() 方法注册了策略，该方法中传入的参数是本地策略的实例。注意，这里创建实
例的参数是回调函数，当需要对用户鉴权时，便会执行该回调函数
 回调函数有三个参数： username 、 passport 和鉴权完成时需要调用的回调函数 done 。外
 层回调函数之内，先是用Mongoose模型 User 根据传入的用户名对用户进行查找，并执行鉴权。
 在处理错误的过程中，会将具体的错误传给回调函数 done 。鉴权成功之后，则会将Mongoose对
 象 users 传给回调函数 done 。*/
module.exports = function(){
    passport.use(new LocalStrategy(function(username,password,done){
        User.findOne({
            username:username
        },function(err,user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, {
                    message:"Unknow users"
                });
            }

            if(!user.authenticate(password)){
                return done(null,false,{
                    message:'Invalid password'
                })
            }
            return done(null,user)
        })
    }))
};