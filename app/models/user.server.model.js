var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

//使用模式构造器定义了 UserSchema 对象
var UserSchema = new Schema({
   firstName : String,
    lastName : String,
    email : {
        type:String,
        match:[/.+\@.+\..+/, "Please fill a valid e-mail address"] //针对email格式验证
    },
    username : {
        type:String,
        trim:true,//去两端空格：是
        unique:true,//建立唯一索引：true
        /*使用时还需谨慎。比如，对于已经有数据的集合，定
        义唯一索引后，可能引发一些导致应用无法启动的严重错误。另外，应用启动时Mongoose会自
        动创建大量索引，如果是生产环境的话，可能会产生一些性能问题。*/
        required:'Username is required' //保存前验证是否为空
    },
    password : {
        type:String,
        //自定义验证器
        validate:[
            function(password){
                return password.length>=6;
            },
            'Password should be longer'
        ]
    },
    //salt:用于对密码进行哈希
    salt: {
        type: String
    },
    created:{
        type:Date,
        default: Date.now
    },
    //provider:标明注册用户时所采用的Passport策略类型
    provider: {
        type: String,
        required: 'Provider is required'
    },
    //providerId:标明身份验证策略的用户标志符
    providerId: String,
    // providerData 属性，用于存储从OAuth提供方获取的用户信息
    providerData: {},
   /* role:{
        type:String,
        enum:['Admin','Owner','User']//字段值域限定
    },*/
    website:{
        type:String,
        //自定义修饰符，输入的内容中搜索是否包含http://或https://，有则直接返回，无则添加
        //这是在写入的时候设置的
        /*set:function(url){
            if (!url){
                return url;
            }else{
                if(url.indexOf('http://') !==0 && url.indexOf('https://') !==0){
                    url = 'http://' + url;
                }
                return url;
            }
        },*/
        //get:输出，在读取文档的时候会执行
        get: function(url) {
            if (!url) {
                return url;
            } else {
                if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                    url = 'http://' + url;
                }
                return url;
            }
        }
    }
});

//添加虚拟属性 fullName ，虚拟属性不会真正存储到数据库中
UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

//预存储处理中间件，用以执行对用户密码的哈希操作
/*使用伪随机方法生成了一个盐；其次，使用实例方法
hashPassword() 对原密码执行哈希操作*/
UserSchema.pre('save', function(next) {
    if (this.password) {
        this.salt = new
            Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

//实例方法,通过使用Node.js的 crypto 模块来执行用户密码的哈希
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000,
        64).toString('base64');
};

//实例方法,将接收的参数字符串的哈希结果与数据库中存储的用户密码哈希值进行对比
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

//静态方法，为新用户确定一个唯一可用的用户名，这个方法在后面处理OAuth身份验证时将会用到
UserSchema.statics.findUniqueUsername = function(username, suffix,callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');
    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};
/*虚拟属性除了在读取文档时增加属性，还可以使用 setter 修饰符对文档以特定的字段方式
进行存储而不需要进行额外的字段属性添加。比如，我们需要把 fullName 的姓和名分为两个字
段单独存储，则可以对虚拟属性进行如下的修改*/
/*UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});*/
/*虚拟属性是Mongoose很重要的一个功能，当在不同的应用层级之间对文档进行转移时，我
们可以用它对文档在整个应用中的表示进行修改，而不用将这些修改保存到MongoDB中。*/


/*在 res.json() 等方
法中， 文档转换为JSON默认不会执行getter修饰符的操作， 所以这里调用了 UserSchema.set() ，
以便保证在这种情况下强制执行getter修饰符。*/
//虚拟属性 virtual，这里设置了MongoDB在转换json的时候仍然可以使用虚拟属性
UserSchema.set('toJSON', { getters: true, virtual:true });

//使用模式实例定义了 User 模型
mongoose.model('User',UserSchema);