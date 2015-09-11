angular.module('blog').factory('commonServices',function(){
    var urlReg = /articles/g;
    //��������˼򵥵�hack���ж�url��ַ����û�д���articles�ַ������еĻ�����lightbox��ʾ
    return{
        lightBoxShow:urlReg.test(window.location.href),
        showLightBox : function(){
            this.lightBoxShow = true;
        },
        hideLightBox : function(){
            this.lightBoxShow = false;
        }
    }
});