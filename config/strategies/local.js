var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

/*ʹ��passport.use() ����ע���˲��ԣ��÷����д���Ĳ����Ǳ��ز��Ե�ʵ����ע�⣬���ﴴ��ʵ
���Ĳ����ǻص�����������Ҫ���û���Ȩʱ�����ִ�иûص�����
 �ص����������������� username �� passport �ͼ�Ȩ���ʱ��Ҫ���õĻص����� done ����
 ��ص�����֮�ڣ�������Mongooseģ�� User ���ݴ�����û������û����в��ң���ִ�м�Ȩ��
 �ڴ������Ĺ����У��Ὣ����Ĵ��󴫸��ص����� done ����Ȩ�ɹ�֮����ὫMongoose��
 �� users �����ص����� done ��*/
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