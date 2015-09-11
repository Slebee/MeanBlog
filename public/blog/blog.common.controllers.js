angular.module('blog').controller('mainController',['$scope','commonServices',function($scope,commonServices){
    $scope.data = commonServices;
}]);