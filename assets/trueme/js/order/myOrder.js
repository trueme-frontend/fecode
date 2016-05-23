/*** Created by HZH on 2016/5/19.*/
win.hideLoading();
//查询的订单状态  1.待付款 2.待发货3.已发货【配送中】4.已完成【已收货】5.退款中6.已取消7.已关闭8.退货中9. 已退款
var stateOrder=0;  
//用户userId
var truemeUserId=$.cookie('cuserid'); 
//当前的订单状态tab
var orderstatestab=location.hash.substr(1)+''?parseInt(location.hash.substr(1)):0;

//改变tab样式
$(".order-nav li").eq(orderstatestab).addClass("on").siblings().removeClass("on");

//vue begin
var vm = new Vue({
    el: '#container',
    data: {
      index:orderstatestab,   //初始table索引
      datas:{}, //当前的列表数据
      datasList:{
        data0:{data:{},startNum:1},
        data1:{data:{},startNum:1},
        data2:{data:{},startNum:1},
        data3:{data:{},startNum:1},
      },  //数据列表
    },
    ready: function () {
        var This=this;
        //tab切换
        $(".order-nav li").click(function () {
           $(this).addClass("on").siblings().removeClass("on");
           var $aid = $(this).children("a").attr("data");
           if ($(this).hasClass("on")){
               $($aid).addClass("active").siblings().removeClass("active");
           }

           //缓存数据
           config.scrollbegin=true;
           location.hash=$(this).index(); 
           This.index=$(this).index();
           //切换table数据
           This.datas=This.datasList['data'+This.index]['data']; 
           //数据为空时加载数据
           if(jQuery.isEmptyObject(This.datasList['data'+This.index]['data'])){
            win.showLoading();
            //加载数据
            This.queryMyOrderList(This.index);
           }
           //判断json是否为空 jQuery.isEmptyObject({})
           
        });

        //获取数据列表
        This.queryMyOrderList(This.index); 
    },
    methods: {
      //查询我的订单列表
      queryMyOrderList:function(orderStatus){
        var This=this;
        //请求我的订单数据列表
        $.AJAX({
              type:'post', 
              //url:config.basePath+'order/svqueryorder/orderlist',
              url:config.basePath+'order/svqueryorder/orderlist',
              data:{
                  "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                  "orderStatus":orderStatus,
                  "startNum":1,
                  "userId":truemeUserId
              },
              success:function(data){
                This.datas=data.data;
                This.datasList['data'+This.index]['data']=data.data||'{"name":"wangwei",startNum:2}';
                This.datasList['data'+This.index]['startNum']=data.data.startNum||1;
                console.log(JSON.stringify(This.datasList));
                //滚动拉去更多数据
                This.scollGetMoreData();
              }
        });
      },

      //滚动获得更多数据
     scollGetMoreData:function(){
      var This=this;
      //滚动时执行
      wx.w.scrollGetData({  
          lastObj:$('#bottomscolltop'),
          bottomTop:700,
          callback:function(){
            $.AJAX({
                type:'post',
                url:config.basePath+'order/svqueryorder/orderlist',
                data:{
                  "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                  "orderStatus":This.index,
                  "startNum":This.datasList['data'+This.index]['startNum'],
                  "userId":truemeUserId
                },
                success:function(data){
                  //判断是否还需要滚动获取数据 向数组里push数据
                  if(data.data.orderList.length>0){
                    config.scrollbegin=true; //可以再次滚动
                    This.datasList['data'+This.index]['data'].orderList=(This.datasList['data'+This.index]['data'].orderList).concat(data.data.orderList);
                    This.datas=This.datasList['data'+This.index]['data'];
                    //This.datas.orderList = This.datas.orderList.concat(data.data.orderList);
                  }
                  This.datasList['data'+This.index]['startNum']=data.data.startNum;
                  //This[startNumStr]=data.data.startNum;
                  
                },
           });  
          },
      });
     }, //end

      //取消订单
      cancelOrder:function(orderNo){
        wx.w.cancelOrder({
          url:config.basePath+'order/svorder/cancleorderpayno',
          orderId:orderNo,  //'P160519201459101012'
          success:function(data){

            console.log(data)
          }
        });
      },

      //删除订单
      deteleOrder:function(orderNo){
        wx.w.deteleOrder({
          url:config.basePath+'order/svorder/delorder',
          orderId:orderNo,  //'P160519201459101012'
          success:function(data){
            console.log(data)
          }
        });
      },

      
       
    }
});
