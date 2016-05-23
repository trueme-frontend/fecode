/*login.js*/
win.hideLoading();

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
       
      
    },
    methods: {
        
        
      
    }
});



