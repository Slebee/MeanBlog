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
    flash = require('connect-flash'),
    ueditor = require('ueditor'),
    path = require('path');
module.exports = function(db){
    var app = express();
    var server = http.createServer(app);
    var io = socketio.listen(server);
    //
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
    require('../app/plugins/ueditor.server.js')(app,ueditor,path);
    require('./socketio')(server, io, mongoStore);

    app.use(express.static('./public'));

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            /*res.render('error', {
                message: err.message,
                error: err
            });*/
            res.render('404');
        });
    }

    return server;
};