win.hideLoading()
$(function () {
    $("#grade").click(function () {
        $(".grade-box").show();
    });
    $(".grade-box .grade-bg").click(function () {
        $(".grade-box").hide();
    })
});
/*创客index.js*/
Vue.filter('makerDeji', function (value,num) {
    var text="";
    switch(value){
        case 1:
            text='一星创客';
            break;
        case 2:
            text='二星创客';
            break;
        case 3:
            text='三星创客';
            break;
        case 4:
            text='四星创客';
            break; 
        case 5:
            text='大咖';
            break;                 
    }
    return text;
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

    