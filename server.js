process.env.NODE_ENV = process.env.NODE_ENV || 'development';//process.env.NODE_ENV ��Ĭ��ֵ��Ϊ development �� ��Ϊϵͳ�������� NODE_ENV �п���û������
var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport');
var db = mongoose();
var app = express(db);
var Passport = passport();
app.listen(3000);
module.exports = app;
console.log('Server running at http://localhost:3000/');