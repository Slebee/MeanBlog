module.exports = function(app){
    var admin = require('../controllers/admin.server.controller.js');
    app.get('/admin',admin.render);
};