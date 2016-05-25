/*hotwenan.html*/
/*spacial.js*/
var vm = new Vue({
    el: '#container',
    data: {
       startNum:0, //分页起始页
       datas:{}, //页面数据 
    },
    ready: function () {
        var This=this;
       //请求后台接口获取下单时间
       $.AJAX({
            type:'post', 
            url:config.basePath+'content/svMakerContent/getUserShareList',
            data:{
                startNum:This.startNum,
            },
            success:function(data){
              
            }
       });
    },
    methods: {
       

      

    }
});









