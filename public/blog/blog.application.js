var mainApplicationModuleName = 'blog';
var mainApplicationModule = angular.module(mainApplicationModuleName,['ngRoute','ngAnimate','ngResource','blogArticle']);
mainApplicationModule.config(['$locationProvider',function($locationProvider){
    $locationProvider.hashPrefix('!');
}]);

if (window.location.hash === '#_=_') window.location.hash = '#!';

angular.element(document).ready(function(){

    angular.bootstrap(document,[mainApplicationModuleName]);

    //评论数导入
    $('body').append('<script id="cy_cmt_num" src="http://changyan.sohu.com/upload/plugins/plugins.list.count.js?clientId=cyrTELar4"></script>')

});
