var config = require('./config'),
    http = require('http'),
    express=require('express'),
    morgan = require('morgan'), //�ṩ��־�м��
    compress = require('compression'), //��Ӧ����ѹ������
    bodyParser = require('body-parser'), //�������������������ݵ��м��
    methodOverride = require('method-override'), //HTTP  DELETE �� PUT ��������������֧��
    socketio = require('socket.io'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    passport =require('passport'),
    flash = require('connect-flash');
module.exports = function(db){
    var app = express();
    var server = http.createServer(app);
    var io = socketio.listen(server);
    //��������--��ʹ����־�м�� ����������--��ʹ����Ӧ����ѹ���м��
    if (process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    }else if (process.env.NODE_ENV === 'production'){
        app.use(compress());
    }

    app.use( bodyParser.urlencoded({
        extended:true
    }) );
    app.use( bodyParser.json() );
    app.use( methodOverride() );
    //console.log(db.connection.db)
    var mongoStore = new MongoStore({
        db: db.connection.db.s.databaseName
    });

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: mongoStore
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());//����passport
    app.use(passport.session());//׷���û��Ự���м��

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/admin.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/articles.server.routes.js')(app);

    /*express.static() �м��������Ҫһ������������ָ����̬�ļ����ڵ��ļ���·����ע��
    �м��������λ�ã���λ��·���м��֮�£�����ִ��·���߼���·���߼�û����Ӧ����Ļ���
    ���ɾ�̬�ļ�������д��� ��������ԭ���ǣ� ��̬�ļ��������ļ�ϵͳ�н���·�����ļ�������
    ��Ҫ����ʱ����I/O�����ϣ���������һ���·���м������Ӧʱ�䡣*/
    app.use(express.static('./public'));
    require('./socketio')(server, io, mongoStore);
    return server;
};