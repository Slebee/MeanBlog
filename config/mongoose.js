var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function(){
    //ʹ��mongoose�������ݿ�
    //config�ļ��и���NODE_ENV���������ļ������ݿ�����
    var db = mongoose.connect( config.db );

    //����mongooseģ���ļ�
    require('../app/models/user.server.model.js');
    require('../app/models/article.server.model');
    console.log('connect mongodb sccuess');

    return db;
};