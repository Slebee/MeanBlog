exports.render = function (req,res) {
    if ( req.user ){
        res.render('admin',{
            title:'hello',
            user: JSON.stringify(req.user)
        });
    } else{
        res.redirect('/signin');
    }
};