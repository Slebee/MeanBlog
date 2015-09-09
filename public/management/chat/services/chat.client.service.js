/*��������ʹ�� Authentication
���������û��Ƿ��ǵ�¼���ģ����û����ʹ�� $location ������ת����ҳ������AngularJS
�������ӳټ��صģ� ���Socket����ֻ��������ʱ�ż��أ� �������Է�ֹδ��֤���û�ʹ��Socket
�� ����û�ͨ���������֤�� Socket������ͨ������Socket.io�� io() ������������ socket
���ԡ�
������Ϊ�����װ�� emit() �� on() �� removeListener() ���������� on() ����Ҫע�⣬��
����ʹ����AngularJS�е�һ��С���ɡ��� $timeout ����������Ҫ�����һ����Ҫ�����ǣ�
AngularJS��˫�����ݰ�ֻ֧���ڿ����ִ�еķ�������ˣ����ǽ����������¼�֪ͨ��
AngularJS������������AngularJS�������޷���֪��Щ�¼�������ģ���д����ı仯���������
�����У� ���ɵ������socket�ͻ�����һ���������⣬ ����κ�����socket�ͻ��˵��¼������ᴥ
��AngularJS�İ󶨲�����Ϊ�˽����һ���⣬���Խ��� $apply ������ $digest �����������ֳ�
�ᵼ������һ�����󣬼���һ�� $digest ��ûִ���꣬��һ���ֿ�ʼִ���ˡ�һ���ȽϺõĽ��
������ʹ�� $timeout() �� $timeout() ������ window.setTimeout() ������AngularJS��װ��
���ֱ�ӵ��� $timeout() ����������Ҫ���� timeout ��������ɽ�������⣬ͬʱҲ��Ӱ��
�û����顣*/
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