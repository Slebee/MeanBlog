var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function(){
    //使用mongoose连接数据库
    //config文件中根据NODE_ENV环境加载文件的数据库设置
    var db = mongoose.connect( config.db );

    //加载mongoose模型文件
    require('../app/models/user.server.model.js');
    require('../app/models/article.server.model');
    console.log('connect mongodb sccuess');

    return db;
};