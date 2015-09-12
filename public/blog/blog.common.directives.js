angular.module('blog').directive('lightBox',function(){
   return {
       restrict:'EA',
       replace:true,
       template:'<section class="light-box" ng-show="commonServices.lightBoxShow"  ng-class="{true:\'animated sFadeIn\',false:\'animated sFadeOut\'}[commonServices.lightBoxShow]" ></section>',
       controller:['$scope','commonServices',function($scope,commonServices){
            $scope.commonServices = commonServices;
       }]
   }
});

angular.module('blog').directive('close',function(){
    return {
        restrict:'EA',
        replace:true,
        template:'<a class="close" ng-href="/#!/"></a>',
        controller:['$scope','commonServices','$timeout',function($scope,commonServices,$timeout){
            $scope.commonServices = commonServices;
        }],
        link:function(scope,element,attrs){
            /*$(window).off().on('hashchange',function(){
                var urlReg = /articles/g;
                console.log( urlReg.test(window.location.href) )
                if( !urlReg.test(window.location.href) ){
                   // scope.commonServices.hideLightBox();
                }
            })*/
        }
    }
});