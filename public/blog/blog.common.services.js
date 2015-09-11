angular.module('blog').factory('commonServices',function(){
    var urlReg = /articles/g;
    //这里采用了简单的hack，判断url地址上有没有带有articles字符串，有的话就让lightbox显示
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