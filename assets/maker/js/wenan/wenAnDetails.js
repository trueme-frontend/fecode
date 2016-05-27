/*wenAndetails.js*/
$(function () {
  $(".share").click(function () {
      $(this).hide();
  });
  //是否需要提示弹出分享层
  if(getQueryString('isShare')){
    $('#weixinShare').removeClass('hide').addClass('show');
  }
  $('#isShare').click(function(){
    $('#weixinShare').removeClass('hide').addClass('show');
  });
  //点击隐藏弹出层
  $('#weixinShare').click(function(){
    $(this).removeClass('show').addClass('hide');
  });
  //vue  
  var vm = new Vue({
      el: '#container',
      data: {
          contentId: getQueryString('contentId') || 1, //文字的contentId
          shareId: getQueryString('shareId') || 1, //分享页的ID
          datas: {},  //页面数据
          isDianZhan:true,
      },
      ready: function () {
        var This = this;

        //调用页面查看次数接口
        maker.addReadCountCallback({
            shareId: This.shareId,
        });

       //请求文案详情内容信息
       $.AJAX({
            type:'post', 
            url:config.basePath+'content/svMakerContent/getContentDetail',
            data:{
                contentId:This.contentId,
                contentUrl:encodeURIComponent(window.location.href.split('#')[0]),
            },
            success:function(data){
              This.datas=data.data;
              //显示content主题内容
              setTimeout(function(){
                $('#container').removeClass('hide');
                //执行swiper
                var swiper = new Swiper('.swiper-container', {
                  pagination: '.swiper-pagination',
                  slidesPerView: 'auto',
                  paginationClickable: true,
                  spaceBetween: 0,
                  freeMode: true
                });
              },config.containerShowTime);
              //调用微信相关操作
              WeiXinInFo(data.data); 
            },
       });

        /*------------------------------------微信jsdk相关------------------------------*/
        /*微信开始*/
        function WeiXinInFo(data) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function () {
               // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
               //分享给朋友
               wx.onMenuShareAppMessage({
                   title: data.title, // 分享标题
                   desc: data.title, // 分享描述
                   link: window.location.href,
                   imgUrl: data.mainUrl, // 分享图标
                   success: function () { 
                       // 用户确认分享后执行的回调函数
                      This.shareSuccess();
                   },
                   cancel: function () { 
                       // 用户取消分享后执行的回调函数
                   }
              });

              //分享给朋友圈
              wx.onMenuShareTimeline({
                  title: data.title, // 分享标题
                  link: window.location.href, // 分享链接
                  imgUrl: data.mainUrl, // 分享图标
                  success: function () {
                      // 用户确认分享后执行的回调函数
                      This.shareSuccess();
                  },
                  cancel: function () {
                      // 用户取消分享后执行的回调函数
                  }
              });

            });
        };
      },
      methods: {
        //加入购物车
        joinShoppingCart: function (skuId, skuTitle) {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'product/svProduct/addShopCart',
                data: {
                    skuId: skuId,
                    skuNum: 1,
                    skuTitle: skuTitle,
                },
                success: function (data) {
                    Popup.miss({title: '加入购物车成功！'});
                },
            });
        },

        //点赞
        likeElectricityWenAn: function ($event) {
          if(vm.isDianZhan){
            maker.likeElectricityWenAn({
                contentId: vm.contentId,
                success: function (data) {
                    Popup.miss({title:'点赞成功！'});
                    vm.isDianZhan=false;
                    $($event.target).parent('li').addClass('active');
                },
            });
          };
        },

        //收藏
        collectionWenAn: function () {
            maker.collectionWenAn({
                contentId: vm.contentId,
                success: function (data) {
                    console.log(data)
                },
            });
        },

        //用户分享成功后回调分享成功
        shareSuccess:function(){
           $.AJAX({
                type: 'post',
                url: config.basePath + 'content/svMakerContent/pushShare',
                data: {
                    shareId:vm.shareId,
                },
                success: function (data) {
                    Popup.miss({title: '分享成功！'});
                    $('#weixinShare').removeClass('hide').addClass('show');
                },
            });
        },


      }
  });
  
  

});








