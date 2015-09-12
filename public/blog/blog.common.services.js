angular.module('blog').factory('commonServices',function(){
    var reg = /articles/g;
    return{
        articleDetailisShow:reg.test(window.location.href)
    }
});