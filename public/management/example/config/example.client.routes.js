angular.module('example').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/management/example/views/example.client.view.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);