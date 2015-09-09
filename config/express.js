var config = require('./config'),
    http = require('http'),
    express=require('express'),
    morgan = require('morgan'), //提供日志中间件
    compress = require('compression'), //响应内容压缩功能
    bodyParser = require('body-parser'), //包含几个处理请求数据的中间件
    methodOverride = require('method-override'), //HTTP  DELETE 和 PUT 两个遗留方法的支持
    socketio = require('socket.io'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    passport =require('passport'),
    flash = require('connect-flash');
module.exports = function(db){
    var app = express();
    var server = http.createServer(app);
    var io = socketio.listen(server);
    //开发环境--》使用日志中间件 ：生产环境--》使用响应内容压缩中间件
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
    app.use(passport.initialize());//启动passport
    app.use(passport.session());//追踪用户会话的中间件

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/admin.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/articles.server.routes.js')(app);

    /*express.static() 中间件函数需要一个参数，用于指定静态文件所在的文件夹路径。注意
    中间件启动的位置，它位于路由中间件之下，即先执行路由逻辑。路由逻辑没有响应请求的话，
    再由静态文件服务进行处理。 这样做的原因是， 静态文件服务在文件系统中进行路径和文件检索，
    需要消耗时间在I/O操作上，这便会增加一般的路由中间件的响应时间。*/
    app.use(express.static('./public'));
    require('./socketio')(server, io, mongoStore);
    return server;
};