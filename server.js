process.env.NODE_ENV = process.env.NODE_ENV || 'development';//process.env.NODE_ENV 的默认值设为 development ， 因为系统环境变量 NODE_ENV 有可能没有设置
var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport');
var db = mongoose();
var app = express(db);
var Passport = passport();
app.listen(3000);
module.exports = app;
console.log('Server running at http://localhost:3000/');