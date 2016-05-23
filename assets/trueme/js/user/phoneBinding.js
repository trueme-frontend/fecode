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
       phoneNo:'',  //手机号码
       code:'', //短信验证码
       getMsgText:'发送验证码',
    },
    ready: function () {
       
    },
    methods: {
        //获得手机验证码
        getValiCode:function(){
            if(!regCombination('m').test(this.phoneNo)){
                Popup.alert({type:'msg',style:'width:80%',title:'请输入正确的手机号！'});return false;
            }

            //短信定时器开始 ajax成功后执行
            wx.w.getMsgTime(this,function(){
                alert('00')
            });

            //获取短信码
            $.AJAX({
                url:config.basePath+'',
                data:{
                    phoneNo:this.phoneNo,
                },
                success:function(data){

                }
            });

        },
        //绑定手机
        sublitPhoneBinding:function(){
            if(!regCombination('m').test(this.phoneNo)){
                Popup.alert({type:'msg',style:'width:80%',title:'请输入正确的手机号！'});return false;
            }
            if(!regCombination('*').test(this.code)){
                Popup.alert({type:'msg',style:'width:80%',title:'请输入短信验证码！'});return false;
            }

            //绑定手机
            $.AJAX({
                url:config.basePath+'',
                data:{
                    phoneNo:this.phoneNo,
                    code:this.code,
                },
                success:function(data){
                    
                }
            });



        },
    }
});






