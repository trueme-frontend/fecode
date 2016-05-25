/*login.js*/
win.hideLoading();

var vm = new Vue({
    el: '#container',
    data: {
       phoneNo:'',  //手机号码
       codeNo:'', //短信验证码
       getMsgText:'发送验证码',
       disabled:false, //初始可点击状态
    },
    ready: function () {
       
    },
    methods: {
        //获得手机验证码
        getValiCode:function(){
            This=this;
            if(!regCombination('m').test(This.phoneNo)){
                Popup.alert({type:'msg',title:'请输入正确的手机号！'});return false;
            }
            This.disabled=true; //发送短信时按钮不可点击
            //短信定时器开始 
            trueme.w.getMsgTime(this,function(){
                This.disabled=false; //完成后按钮可点击 
            });
            //获取短信码
            $.AJAX({
                type:'post',
                url:config.basePath+'user/svSendPhoneCode',
                code:true,
                data:{
                    phone:This.phoneNo,
                },
                success:function(data){
                    Popup.miss({title:'短信验证码发送成功!'});
                    //This.codeNo=data.code;
                    This.disabled=false; //完成后按钮可点击 
                },
                error:function(){
                    This.getMsgText="发送验证码";
                    Popup.alert({type:'msg',title:data.desc});
                },
            });
        },
        //绑定手机
        sublitPhoneBinding:function(){
            This=this;
            if(!regCombination('m').test(This.phoneNo)){
                Popup.alert({type:'msg',title:'请输入正确的手机号！'});return false;
            }
            if(!regCombination('*').test(This.codeNo)){
                Popup.alert({type:'msg',title:'请输入短信验证码！'});return false;
            }
            //绑定手机
            $.AJAX({
                type:'post',
                code: true,
                url:config.basePath+'user/svBindPhone',
                data:{
                    uid:'1',
                    phone:This.phoneNo,
                    code:This.codeNo,
                },
                success:function(data){
                    window.location.href=config.prevUrl;
                },
                error: function(){
                    $('input[name="userTestCode"]').val('');
                    Popup.alert({'type':'msg', 'title':'验证失败！请重试'});
                }
            });



        },
    }
});






