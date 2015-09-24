(function(){
    var root = this;

    var S = function(obj) {
        if (obj instanceof S) return obj;
        if (!(this instanceof S)) return new S(obj);
    };
    S.elmArr = [];
    S.ajax = function ajax(conf){
        var xhr = null;
        var settings = {
            method:'get',
            url:'',
            data:'',
            sccuess:function(){},
            error:function(){}
        };
        for(var attr in conf){
            settings[attr] = conf[attr];
        }
        try{
            xhr = new XMLHttpRequest();
        }catch(e){
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        if(settings.method == 'get'){
            settings.url += '?' + settings.data + '&' + new Date().getTime();
        }
        xhr.open(settings.method,settings.url,true);
        if(settings.method == 'get'){
            xhr.send();
        }else{
            xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
            xhr.send(settings.data);
        }
        xhr.onreadystatechange = function(){
            if(xhr.readyState ==4){
                if(xhr.status ==200){
                    settings.sccuess && settings.sccuess(xhr.responseText);
                }else{
                    settings.error && settings.error();
                }

            }
        }
    };

    S.addClass = function(name){
        this.each(function(i,elm){
            console.log(elm)
        });
        return this;
    };
    S.getEle = function(name){
        var elmName = trim(name);
        if( /^#/.test( elmName ) ){
            this.elmArr = [];
            this.elmArr.push( root.document.getElementById(name.replace(/^#/,'')) ) ;
        }
        return this;
    };
    S.html = function(str){
        this.each(function(i,elm){
            elm.innerHTML = str;
        });
    };
    S.eq = function(index){
        return this.elmArr[index];
    }
    function trim(str){
        return str.replace(/(^\s*)|(\s*$)/g,'');
    }
    S.each = function(fn){
        for(var i = 0;i<this.elmArr.length;i++){
            fn(i,this.elmArr[i]);
        }
    };
    S.domReady = function(fn){
        if(document.addEventListener){
            document.addEventListener('DOMContentLoaded',function(){
                document.removeEventListener('DOMContentLoaded',arguments.callee,false);
                fn();
            },false);
        }else if(document.attachEvent){
            document.attachEvent('onreadystatechange',function(){
                if(document.readyState=='complete'){
                    document.detachEvent('onreadystatechange',arguments.callee);
                    fn();
                }
            });
        }
    };
    root.S = S;
}.call(this));