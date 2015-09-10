angular.module('blog').factory('commonServices',function(){
    return{
        lightBoxShow:false,
        showLightBox : function(){
            this.lightBoxShow = true;
        },
        hideLightBox : function(){
            this.lightBoxShow = false;
        }
    }
});