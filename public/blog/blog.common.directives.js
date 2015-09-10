angular.module('blog').directive('lightBox',function(){
   return {
       restrict:'EA',
       replace:true,
       template:'<section class="light-box" ng-show="commonServices.lightBoxShow"></section>',
       controller:['$scope','commonServices',function($scope,commonServices){
            $scope.commonServices = commonServices;
       }]
   }
});

angular.module('blog').directive('close',function(){
    return {
        restrict:'EA',
        replace:true,
        template:'<a class="close" ng-href="/#!/" ng-click="commonServices.hideLightBox();"></a>',
        controller:['$scope','commonServices',function($scope,commonServices){
            $scope.commonServices = commonServices;
        }],
        link:function(scope,element,attrs){
            $(element).on('click',function(){
                $('body').css('overflow','visible');
            })
        }

    }
});