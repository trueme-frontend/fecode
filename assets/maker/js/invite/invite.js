
/*创客index.js*/
Vue.filter('makerDeji', function (value,num) {
    var text="";

    return value.charAt(num);
});

var vm = new Vue({
    el: '#container',
    data: {
        datas: {}, //首页数据
    },
    ready: function(){
        var This = this;
        $.AJAX({
            type:'get',
            url: config.basePath+"maker/svMaker/getMakerHomeInfo",
            success: function(data){
               This.datas=data.data;
            },
        });
    },
    methods: {
        
    }
});

    