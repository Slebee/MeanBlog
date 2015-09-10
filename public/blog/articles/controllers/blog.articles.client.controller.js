angular.module('blogArticle').controller('ArticlesController', ['$scope',
    '$routeParams', '$location', 'Articles','ArticlesUrl','commonServices',
    function($scope, $routeParams, $location, Articles,ArticlesUrl,commonServices)
    {
        $scope.setUrl = function(id){
            ArticlesUrl.url = '/articles/'+id;
        };

        $scope.find = function() {
            $scope.articles = Articles.query();
        };
        $scope.findOne = function() {
            $scope.article = Articles.get({
                articleId: $routeParams.articleId
            });
        };

        $scope.commonServices = commonServices;
    }
]);

angular.module('blogArticle').controller('ArticlesDetailController',['$scope','ArticlesUrl',function($scope,ArticlesUrl){
    $scope.data = ArticlesUrl;
}]);