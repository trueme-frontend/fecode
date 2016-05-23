/*login.js*/
win.hideLoading();
setTimeout(function(){
    Popup.loading({"title":"支付中，请稍后"}); 
},500)

var vm = new Vue({
    el: '#container',
    data: {
        done: false,
        totalFee: ''
    },
    ready: function () {
        var that=this;
        //请求后台接口获取下单时间
        var time = 0;
        var doingAjax = false;
        var timer = setInterval(function(){
            time += 1;
            if(time >= 5){
                clearInterval(timer);
                return false;
            }
            if(!doingAjax){
                getResult();
            }
        },2000);
        function getResult(){
            doingAjax = true;
            $.AJAX({
                type:'POST', 
                url:config.basePath+'order/svpay/queryorderpay?payOrderNo=' + getQueryString('payOrderNo'),
                code : true,
                // data:{
                //     "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                //     "token": "1bad975d941264d64a054e18beae15057003a8866adf25df9805c0339d700af1",
                //     "payOrderNo": getQueryString('payOrderNo')
                // },
                success:function(o){
                    clearInterval(timer);
                    that.done = true;
                    that.totalFee = o.data.totalFee/100;
                    Popup.closeLoading();
                },
                error: function(o){
                    if(time >= 4){
                        Popup.closeLoading();
                        Popup.alert({type:'msg',title:'请求超时，请刷新重试!'});
                    }
                },
                complete: function(){
                    doingAjax = false;
                }
            });
        }
    },
    methods: {
        
    }
});






