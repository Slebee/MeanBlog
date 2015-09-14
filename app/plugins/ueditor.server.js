module.exports = function( app,ueditor,path ){
    app.use("/ueditor/ue",ueditor(path.join('public'), function(req, res, next) {
        if (req.query.action === 'uploadimage') {
            var foo = req.ueditor;
            var imgname = req.ueditor.filename;
            var img_url = '/upload/images/';
            console.log(foo.filename); // exp.png
            console.log(foo.encoding); // 7bit
            console.log(foo.mimetype); // image/png
            res.ue_up(img_url);
        }
        else if (req.query.action === 'listimage') {
            var dir_url = '/upload/images/';
            res.ue_list(dir_url);
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/ueditor/nodejs/config.json');
        }
    }));
}