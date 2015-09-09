var config = require('./config'),
    cookieParser = require('cookie-parser'),
    passport = require('passport');
/*ʹ�����÷��� io.use() �ж������ֹ��̡�����
�ú����У�ʹ��Express�� cookie-parser ģ��������������cookie������ȡ��Ӧ��Express��
�� sessionId ��Ȼ���� connect-mongo ��ʵ����MongoDB�洢�м����Ự��Ϣ��һ����ȡ����
�����󣬱�ʹ�� passport.initialize() �� passport.session() �м�����ݻỰ��Ϣ����
��Ự�� user ��������û�ͨ���������֤�������м�����ִ�лص����� next() ������ִ
��socket�ĳ�ʼ�����̡�����������м�����ִ�� next() ֪ͨSocket.io��Ҫ����һ���ӡ���
��֮��ֻ��ͨ�������֤���û��ſ������������socketͨ�ţ��Է�ֹ�Ƿ��û���Socket.io����
���������ӡ�*/
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