angular.module('articles').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/articles', {
                templateUrl: '/management/articles/views/list-article.client.view.html'
            }).
            when('/articles/create', {
                templateUrl: '/management/articles/views/create-article.client.view.html'
            }).
            when('/articles/:articleId', {
                templateUrl: '/management/articles/views/view-article.client.view.html'
            }).
            when('/articles/:articleId/edit', {
                templateUrl: '/management/articles/views/edit-article.client.view.html'
            });
    }
]);