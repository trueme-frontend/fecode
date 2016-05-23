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
       orderDetails:'',  //订单详情数据
       oderId:getQueryString('orderId'),
    },
    ready: function () {
      var This=this;
      //获取订单详情
      $.AJAX({
        type:'post',
        url:config.basePath+'order/svqueryorder/orderdetail',
        data:{
          "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
          "orderId": This.oderId,
        },
        success:function(data){
          This.orderDetails=data.data
        },
      }); 
      
    },
    methods: { }
});



