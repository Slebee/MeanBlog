var config = require('./config'),
    cookieParser = require('cookie-parser'),
    passport = require('passport');
/*使用配置方法 io.use() 中断了握手过程。在配
置函数中，使用Express的 cookie-parser 模块解析握手请求的cookie，并获取对应的Express中
的 sessionId ，然后用 connect-mongo 的实例从MongoDB存储中检索会话信息。一旦获取到会
话对象，便使用 passport.initialize() 和 passport.session() 中间件根据会话信息来填
充会话的 user 对象。如果用户通过了身份验证，握手中间件便会执行回调函数 next() ，继续执
行socket的初始化过程。否则该握手中间件便会执行 next() 通知Socket.io不要打开这一连接。换
言之，只有通过身份验证的用户才可以与服务器的socket通信，以防止非法用户与Socket.io服务
器建立连接。*/
module.exports = function(server, io, mongoStore) {
    io.use(function(socket, next) {
        cookieParser(config.sessionSecret)(socket.request, {}, function(err) {
            var sessionId = socket.request.signedCookies['connect.sid'];
            mongoStore.get(sessionId, function(err, session) {
                socket.request.session = session;
                passport.initialize()(socket.request, {}, function() {
                    passport.session()(socket.request, {}, function() {
                        if (socket.request.user) {
                            next(null, true);
                        } else {
                            next(new Error('User is not authenticated'), false);
                        }
                    })
                });
            });
        });
    });
    io.on('connection', function(socket) {
            require('../app/controllers/chat.server.controller')(io, socket);
    });
};