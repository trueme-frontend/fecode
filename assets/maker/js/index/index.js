win.hideLoading()
$(function () {
    $("#grade").click(function () {
        $(".grade-box").show();
    });
    $(".grade-box .grade-bg").click(function () {
        $(".grade-box").hide();
    })
});

var vm = new Vue({
    el: '#container',
    data: {
        datas: {}, //首页数据
    },
    ready: function(){
        var This = this;
        $.AJAX({
            type:'post',
            url: config.basePath+"maker/svMaker/getMakerHomeInfo",
            success: function(data){
               This.datas=data.data;
               setTimeout(function(){
                    $('#container').removeClass('hide');
               },50);
            },
        });
    },
    methods: {
        
    }
});

    