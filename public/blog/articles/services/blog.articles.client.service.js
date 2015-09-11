angular.module('blogArticle').factory('Articles',['$resource',function($resource){
    return $resource('api/blog/articles/:articleId',{
        articleId:'@_id'
    },{
        update:{
            method:'PUT'
        }
    })
}]);

angular.module('blogArticle').factory('ArticlesUrl',function(){
    return {
        url: window.location.href.substring(location.href.indexOf("/articles")+1)
    }
});