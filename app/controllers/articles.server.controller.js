var mongoose = require('mongoose'),
    Article = mongoose.model('Article');

var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message)return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

exports.create = function(req,res){
    var article = new Article(req.body);
    var reg = new RegExp("<[^<]*>", "gi");
    article.creator = req.user;
    article.summary = req.body.content.replace(reg,'').substring(0,500) + '...';
    article.save(function(err){
        if (err){
            return res.stateus(400).send({
                message:getErrorMessage(err)
            })
        } else{
            res.json(article);
        }
    })
};

/*获取了article集合的所有文档。 在查询过程中使用了
排序， 获取的文档按照 created 进行排序。 还使用了 pupulate() 方法将 user 对象的 fristName 、
lastName 和 fullName 属性填充到了 articles 对象的 creator 属性中。*/
exports.list = function(req, res) {
    Article.find().sort('-created').populate('creator', 'firstName lastName fullName').
        exec(function(err, articles) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.json( articles );
            }
        });
};
exports.listSummary = function(req, res) {
    Article.find({},'title summary creator created').sort('-created').populate('creator', 'firstName lastName fullName').
        exec(function(err, articles) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.json( articles );
            }
        });
};

exports.articleByID = function(req, res, next, id) {
    Article.findById(id).populate('creator', 'firstName lastName fullName').exec
    (function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

exports.read = function(req, res) {
    res.json(req.article);
};

exports.render = function( req,res ){
    console.log(req.article);
    res.render('article',req.article);
};

exports.update = function(req, res) {
    var article = req.article;
    article.title = req.body.title;
    article.content = req.body.content;
    article.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

exports.delete = function(req, res) {
    var article = req.article;
    article.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};
exports.hasAuthorization = function(req, res, next) {
    if (req.article.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};