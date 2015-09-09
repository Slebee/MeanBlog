/*上述代码使用 Authentication
服务检查了用户是否是登录过的，如果没有则使用 $location 服务跳转到主页。由于AngularJS
服务是延迟加载的， 因此Socket服务只有在请求时才加载， 这样可以防止未验证的用户使用Socket
务。 如果用户通过了身份验证， Socket服务便可通过调用Socket.io的 io() 方法来设置其 socket
属性。
接下来为服务封装了 emit() 、 on() 和 removeListener() 方法。其中 on() 最需要注意，该
方法使用了AngularJS中的一个小技巧—— $timeout 服务。这里需要解决的一个重要问题是，
AngularJS的双向数据绑定只支持在框架内执行的方法。因此，除非将第三方的事件通知给
AngularJS编译器，否则AngularJS编译器无法获知这些事件在数据模型中带来的变化。在这个聊
天室中， 集成到服务的socket客户端是一个第三方库， 因此任何来自socket客户端的事件都不会触
发AngularJS的绑定操作。为了解决这一问题，可以借助 $apply 方法和 $digest 方法。但这又常
会导致另外一个错误，即上一个 $digest 还没执行完，下一个又开始执行了。一个比较好的解决
方案是使用 $timeout() 。 $timeout() 服务是 window.setTimeout() 方法的AngularJS封装，
因此直接调用 $timeout() 方法，不需要传入 timeout 参数，便可解决绑定问题，同时也不影响
用户体验。*/
angular.module('chat').service('Socket', ['Authentication', '$location', '$timeout',
    function(Authentication, $location, $timeout) {
        if (Authentication.user) {
            this.socket = io();
        } else {
            $location.path('/');
        }
        this.on = function(eventName, callback) {
            if (this.socket) {
                this.socket.on(eventName, function(data) {
                    $timeout(function() {
                        callback(data);
                    });
                });
            }
        };
        this.emit = function(eventName, data) {
            if (this.socket) {
                this.socket.emit(eventName, data);
            }
        };
        this.removeListener = function(eventName) {
            if (this.socket) {
                this.socket.removeListener(eventName);
            }
        };
    }
]);