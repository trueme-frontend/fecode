/*login.js*/
 $(function () {
    $("#password").on("focus",function () {
        $(this).next("span").addClass("focus");
    });
    $("#password").blur(function () {
        $(this).next("span").removeClass("focus");
    });
});
var vm = new Vue({
    el: '#container',
    data: {
       payOrderNo:'',  //预支付订单号
       needPay:'', //需要支付的金额
       createTime:'', //生成订单的倒计时时间
       openId:'',  //用户的openId
       isSubmitPay:false, //是否可支付状态
    },
    ready: function () {
        var This=this;
       //根据订单号 获取支付信息
       $.AJAX({
            type:'post', 
            url:config.basePath+'order/svorder/querypay', 
            data:{
                "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                "payNo":getQueryString('payOrderNo'), // 'P160519201459101012'
            },
            success:function(data){
                This.payOrderNo=data.data.payOrderNo; //预支付订单号
                This.openId=data.data.openId;  //openId
                This.needPay=data.data.needPay;
                //生成订单时间
                var timer=setInterval(function(){
                    var timespe=data.data.expireTime-time(); //时间差
                    This.createTime=formatSeconds(timespe/1000);
                    if(timespe<=0){
                        clearInterval(timer);
                        This.createTime='00:00';
                        This.isSubmitPay=true;
                        //调起关闭订单
                        This.closeOrder();
                    }
                }, 1000);

            }
       });
    },
    methods: {
        //H5掉起立即支付
        payOrderNow:function(){ 
            var This=this; 
            //支付签名
            $.AJAX({
                type:'post',
                url:config.basePath+"order/svorder/ordersign", 
                data:{
                    "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                    "payWay":2,
                    "payOrderNo":This.payOrderNo,
                    "needPay":This.needPay,
                    "openId":This.openId,
                },
                success:function(data){
                    //h5调起微信支付
                    function onBridgeReady(){
                       WeixinJSBridge.invoke(
                           'getBrandWCPayRequest', {
                               "appId": data.data.appId,    
                               "timeStamp":data.data.timeStamp,    
                               "nonceStr": data.data.nonceStr, 
                               "package": data.data.prepayId,   
                               "signType": "MD5",   
                               "paySign":data.data.sign
                           },
                           function(res){     
                                //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                                     //支付成功后执行
                                     window.location.href="orderPaymentSuccess.html?payOrderNo=" + getQueryString('payOrderNo');
                                }else{
                                    //支付失败后执行
                                    Popup.alert({type:'msg',title:'支付失败!'});
                                    setTimeout(function(){
                                        window.location.href=config.prevUrl;
                                    }, 2000)
                                }  
                           }
                       ); 
                    }
                    if (typeof WeixinJSBridge == "undefined"){
                       if( document.addEventListener ){
                           document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                       }else if (document.attachEvent){
                           document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                           document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                       }
                    }else{
                       onBridgeReady();
                    }//支付end
                }
            });
        },
        
        //取消订单
        cancelOrder:function(){
          $.AJAX({
            type:'post',
            url:config.basePath+'order/svorder/cancleorderpayno',
            data:{
                "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                "payNo":getQueryString('payOrderNo'), //'P160519201459101012',//getQueryString('payOrderNo')
            },
            success:function(data){
               //跳转到订单列表
               window.location.href="myOrder.html";
            },
          });
        },

        //关闭订单
        closeOrder:function(){
           $.AJAX({
            type:'post',
            url:config.basePath+'order/svorder/closeorder',
            data:{
                "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                "payNo":getQueryString('payOrderNo'),//getQueryString('payOrderNo')
            },
            success:function(data){
              //跳转到订单列表
              window.location.href="myOrder.html";
            },
          });
        }
    }
});



