/*login.js*/
win.hideLoading();


var vm = new Vue({
    el: '#container',
    data: {
        isLogin: false,
        userInfo: {}
    },
    ready: function () {
        var that = this;
        $('.jumpCheck').on('click', function(){
            if($.cookie('cuserid') && ($.cookie('cuserid') != "")){
                location.href = $(this).data('link');
            }
        });
        // $.cookie('userId', 1);
        if($.cookie('cuserid') && ($.cookie('cuserid') != "")){
            that.isLogin = true;
            $('.user-box').removeClass('logout');
            $.AJAX({
                type: "POST",
                url: config.basePath + 'user/svuser/getusercenterinfo?userId=' + $.cookie('cuserid'),
                success: function(o){
                    // debugger;
                    that.userInfo = o.data.userCenterInfo;
                    $('#container').show();
            	}
            });
        }else{
            that.isLogin = false;
            $('#container').show();
        }
    },
    methods: {
        login: function(){
            wx.w.getWeiXinCode();
        },
        logout: function(){
            win.showLoading();
            $.AJAX({
                type: "POST",
                url: config.basePath + 'user/svloginout?userId=' + $.cookie('cuserid'),
                success: function(){
                    location.reload();
                }
            });
        }
        // jumpPage: function(e){
        //     var jumpLink = $(e.target).data('link');
        //     if($.cookie('cuserid') && ($.cookie('cuserid') != "")){
        //         location.href = jumpLink;
        //     }else{
        //         wx.w.getWeiXinCode();
        //     }
        // }
    }
});





