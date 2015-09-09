
angular.module('articles').directive('createArticle',function(){
    return {
        restrict:'EA',
        controller:'ArticlesController',
        link: function(scope, element, attrs){
            $('body').append('<script src="/ueditor/ueditor.customer.js"></script>')
        }
    }
});