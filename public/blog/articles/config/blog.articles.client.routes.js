angular.module('blogArticle').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/articles/:articleId', {
                templateUrl: '/blog/articles/views/article.client.view.html'
            })
    }
]);