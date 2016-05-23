/*login.js*/
win.hideLoading();
$(function () {
    //获取商品的spuId
   var shopSpuId=getQueryString('spuId')||1;
   //用户userId
   var truemeUserId=$.cookie('cuserid')?$.cookie('cuserid'):''; 

    //折叠
    $(".color-hd").click(function () {
        $(this).toggleClass("active");
        if ($(this).hasClass("active")) {
            $(this).next(".color-bd").slideDown();
        } else {
            $(this).next(".color-bd").slideUp();
        }
    });
   
    //弹入弹出
    $(".too-btn").click(function () {
        $(".shopCart-box").addClass("on");
    });
    $("#close_box,.masked").click(function () {
        $(".shopCart-box").removeClass("on");
    });

    //banner
    var vm = new Vue({
        el: '#bannerlist',
        data: {
            banner: [],
        },
        ready: function(){
            $(window).on('scroll', function(){
                var scrollTop = document.body.scrollTop;
                var targetColor = 0.5 - scrollTop/(88*rem/100);
                var targetOpacity = (scrollTop/(88*rem/100) - 0.5)/0.5;
                if(scrollTop <= 44*rem/100){
                    $('.header-icon').css('backgroundImage','url("../../assets/trueme/images/ware/ware_detail_spirite.png")');
                    $('.header').css({
                        background: 'linear-gradient(rgba(0,0,0,'+ targetColor +'), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-webkit-linear-gradient(rgba(0,0,0,'+ targetColor +'), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-moz-linear-gradient(rgba(0,0,0,'+ targetColor +'), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-o-linear-gradient(rgba(0,0,0,'+ targetColor +'), rgba(0,0,0,0))'
                    });
                }else if(scrollTop <= 88*rem/100){
                    $('.header-icon').css('backgroundImage','url("../../assets/trueme/images/ware/ware_detail_spirite_black.png")');
                    $('.header').css({
                        background: 'linear-gradient(rgba(255,255,255,'+ targetOpacity +'), rgba(255,255,255,'+ targetOpacity +'))'
                    });
                    $('.header').css({
                        background: '-webkit-linear-gradient(rgba(255,255,255,'+ targetOpacity +'), rgba(255,255,255,' +targetOpacity+ '))'
                    });
                    $('.header').css({
                        background: '-moz-linear-gradient(rgba(0,0,0,'+ targetOpacity +'), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-o-linear-gradient(rgba(0,0,0,'+ targetOpacity +'), rgba(0,0,0,0))'
                    });
                }
            });

            //加载banner图片
            $.AJAX({
                type:'get',
                url:config.basePath+'product/svSpuImg/getSpuMain',
                data:{
                    spuId:shopSpuId,
                },
                success:function(data){
                    //渲染banner
                    vm.banner=data.data.spuMainImgList;
                    setTimeout(function(){
                        var bannerSwiper = new Swiper('.banner', {
                            loop: true,
                            direction: 'horizontal',
                            autoplay: 2000,
                            autoplayDisableOnInteraction : false,
                            pagination : '.swiper-pagination',
                        });
                    },0);
                },
            });
        },
    });
    
    //商品详情图
    var details = new Vue({
        el: '#detailsList',
        data: {
            spuDetail:[],
        },
        ready: function(){
            //加载商品详情图
            $.AJAX({
                type:'get',
                url:config.basePath+'product/svSpuImg/getSpuDetail',
                data:{
                    spuId:shopSpuId,
                },
                success:function(data){
                    details.spuDetail=data.data.spuDetailImgList;
                }
            });

        },
    });

    //获取SPU详情信息
    var spuDetails = new Vue({
        el: '#supMain',
        data: {
            spuDetailList:{}, //获取SPU详情信息
            spuTotalList:[], //
            specifin:[], //商品规格
            skuNum:0,  //购买的商品数量
            skuTitle:'',  //购买商品的标题
            skuId:'',  //商品的skuId
            type:1,   //1为手机加入购物车 ，2为立即购买
            shopingNum:1, //购买商品数量
            getSkuStockInf:0,  //可购买的库存量
        },
        ready: function(){

            //获取SPU详情信息
            $.AJAX({
                type:'get',
                url:config.basePath+'product/svProduct/getSpuDetailInfo',
                data:{
                    spuId:shopSpuId,
                },
                success:function(data){
                    console.log(data.data.spuDetailInfo.title)
                    spuDetails.spuDetailList=data.data.spuDetailInfo;
                }
            });

            //获取商品规格
            $.AJAX({
                type:'get',
                url:config.basePath+'product/svProduct/getSpuStandardList',
                data:{
                    spuId:shopSpuId,
                },
                success:function(data){
                    spuDetails.specifin=data.data.getSpuStandardList;
                     //选择
                    console.log(data.data.getSpuStandardList)   
                }
            });

        },
        methods: {
            //切换tab获得产品库存
            activeLi:function($event,skuId){
                $($event.target).addClass("checked").siblings().removeClass("checked");
                spuDetails.skuId=skuId;
                //获取规格数量
                 $.AJAX({
                    url:config.basePath+'product/svProduct/getSkuStockInfo',
                    data:{ 
                        skuId:skuId,
                    },
                    success:function(data){
                        spuDetails.getSkuStockInf=data.data.getSkuStockInfo.stockNum;
                    },
                });
            },

            //加入购物车
            joinShoppingCart:function(){
                spuDetails.type=1;
            },

            //设置为立即购买
            payOrderNow:function(){
                spuDetails.type=2;
            },

            //减少商品
            reduceShopNum:function(){
                if(spuDetails.shopingNum>1){
                    spuDetails.shopingNum--;
                }else{
                    Popup.miss({title:'亲,商品数量最少为1件额！'});
                }
            },

            //增加商品
            addShopNum:function(){
                spuDetails.shopingNum++;
            },

            //开始购买或者加入购物车
            submitShopNow:function(){
                if(spuDetails.type==1){
                    //加入购物车
                    $.AJAX({
                        type:'post',
                        url:config.basePath+'product/svProduct/addShopCart',
                        data:{
                            userId:truemeUserId,  
                            skuId:spuDetails.skuId||spuDetails.specifin[0].skuId, 
                            skuNum:spuDetails.shopingNum, 
                            skuTitle:spuDetails.spuDetailList.title,
                        },
                        success:function(data){
                            //取消弹出层
                            $(".shopCart-box").removeClass("on");
                            Popup.miss({title:'加入购物车成功！'}); 
                        },
                    });
                }else if(spuDetails.type==2){
                    //立即购买 结算订单
                    var price=spuDetails.spuDetailList.salePrice*spuDetails.shopingNum;
                    var json={
                        userId:truemeUserId,
                        totalPrice:price,
                        skuList:[{
                            skuId:spuDetails.skuId||spuDetails.specifin[0].skuId,
                            num:spuDetails.shopingNum,
                        }],
                    };
                    $.AJAX({
                        url:config.basePath+'product/svSettlement/settlement?param=' + JSON.stringify(json),
                        success: function(o){
                            console.log(o);
                            sessionStorage.setItem('data', JSON.stringify(o.data));
                            location.href = "../order/confirmOrder.html?userId=" + truemeUserId;
                        }
                    });
                }//end
            },

            //收藏商品
            collection:function(){
                wx.w.collection({
                   userId:truemeUserId,
                   spuId:shopSpuId, 
                });
            },

        }
    });
     
});



