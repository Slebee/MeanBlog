S.domReady(function(){
    //get articles data from server
    function getArticleList(){
        S.ajax({
            url:'/api/blog/articles',
            sccuess:function(data){
                printArticle( JSON.parse(data) );
            }
        })
    }

//process articles data
    function printArticle(data){
        var htmlStr = '';
        for( var i = 0;i<data.length;i++ ){
            htmlStr += '<div class="row article-list-item animated sSlideInUp" style="animation-delay: '+ i*.1 +'s;">'+
            '<h3><a onclick="showArticle(\''+ data[i]._id +'\')">'+ data[i].title +'</a> <span class="comment-count pull-right"><span class = "cy_cmt_count" id = "sourceId::'+data[i]._id+'" ></span></span></h3>'+
            '<p class="content">' + data[i].summary + '</p>'+
            '<p class="parm"><small class="pull-left">Created By '+ data[i].creator.fullName +'</small><small class="pull-right" >'+ data[i].created +'</small></p>'+
            '</div>'
        }
        S.getEle('#listWrap').html(htmlStr);

        //number of comments
        var s = document.createElement('script');
        s.setAttribute('id','cy_cmt_num');
        s.setAttribute('src','http://changyan.sohu.com/upload/plugins/plugins.list.count.js?clientId=cyrTELar4');
        document.body.appendChild(s);
    }

//show iframe about article detail
    function showArticle(id){
        S.getEle('#iframeCon').eq(0).setAttribute('src','/articles/'+id);
        S.getEle('#iframeWrap').eq(0).setAttribute('style',"z-index:10;opacity:1");
        var stateObject = {};
        var title = "Wow Title";
        var newUrl = 'articles/' + id;
        history.pushState(stateObject,title,newUrl);
    }
    function initHistory(){

    }
    window.addEventListener('popstate', function(event) {
        history.readState(event.state);
    });
    function readState(data){
        alert(data.id);
    }
    getArticleList();
});