var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

//ʹ��ģʽ������������ UserSchema ����
var UserSchema = new Schema({
   firstName : String,
    lastName : String,
    email : {
        type:String,
        match:[/.+\@.+\..+/, "Please fill a valid e-mail address"] //���email��ʽ��֤
    },
    username : {
        type:String,
        trim:true,//ȥ���˿ո���
        unique:true,//����Ψһ������true
        /*ʹ��ʱ������������磬�����Ѿ������ݵļ��ϣ���
        ��Ψһ�����󣬿�������һЩ����Ӧ���޷����������ش������⣬Ӧ������ʱMongoose����
        ������������������������������Ļ������ܻ����һЩ�������⡣*/
        required:'Username is required' //����ǰ��֤�Ƿ�Ϊ��
    },
    password : {
        type:String,
        //�Զ�����֤��
        validate:[
            function(password){
                return password.length>=6;
            },
            'Password should be longer'
        ]
    },
    //salt:���ڶ�������й�ϣ
    salt: {
        type: String
    },
    created:{
        type:Date,
        default: Date.now
    },
    //provider:����ע���û�ʱ�����õ�Passport��������
    provider: {
        type: String,
        required: 'Provider is required'
    },
    //providerId:���������֤���Ե��û���־��
    providerId: String,
    // providerData ���ԣ����ڴ洢��OAuth�ṩ����ȡ���û���Ϣ
    providerData: {},
   /* role:{
        type:String,
        enum:['Admin','Owner','User']//�ֶ�ֵ���޶�
    },*/
    website:{
        type:String,
        //�Զ������η�������������������Ƿ����http://��https://������ֱ�ӷ��أ��������
        //������д���ʱ�����õ�
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
        //get:������ڶ�ȡ�ĵ���ʱ���ִ��
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

//����������� fullName ���������Բ��������洢�����ݿ���
UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

//Ԥ�洢�����м��������ִ�ж��û�����Ĺ�ϣ����
/*ʹ��α�������������һ���Σ���Σ�ʹ��ʵ������
hashPassword() ��ԭ����ִ�й�ϣ����*/
UserSchema.pre('save', function(next) {
    if (this.password) {
        this.salt = new
            Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

//ʵ������,ͨ��ʹ��Node.js�� crypto ģ����ִ���û�����Ĺ�ϣ
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000,
        64).toString('base64');
};

//ʵ������,�����յĲ����ַ����Ĺ�ϣ��������ݿ��д洢���û������ϣֵ���жԱ�
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

//��̬������Ϊ���û�ȷ��һ��Ψһ���õ��û�������������ں��洦��OAuth�����֤ʱ�����õ�
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
/*�������Գ����ڶ�ȡ�ĵ�ʱ�������ԣ�������ʹ�� setter ���η����ĵ����ض����ֶη�ʽ
���д洢������Ҫ���ж�����ֶ�������ӡ����磬������Ҫ�� fullName ���պ�����Ϊ������
�ε����洢������Զ��������Խ������µ��޸�*/
/*UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});*/
/*����������Mongoose����Ҫ��һ�����ܣ����ڲ�ͬ��Ӧ�ò㼶֮����ĵ�����ת��ʱ����
�ǿ����������ĵ�������Ӧ���еı�ʾ�����޸ģ������ý���Щ�޸ı��浽MongoDB�С�*/


/*�� res.json() �ȷ�
���У� �ĵ�ת��ΪJSONĬ�ϲ���ִ��getter���η��Ĳ����� ������������� UserSchema.set() ��
�Ա㱣֤�����������ǿ��ִ��getter���η���*/
//�������� virtual������������MongoDB��ת��json��ʱ����Ȼ����ʹ����������
UserSchema.set('toJSON', { getters: true, virtual:true });

//ʹ��ģʽʵ�������� User ģ��
mongoose.model('User',UserSchema);