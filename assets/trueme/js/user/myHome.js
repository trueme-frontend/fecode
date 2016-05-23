/*login.js*/
win.hideLoading();

$(function () {
});
var vm = new Vue({
    el: '#container',
    data: {
        userInfo: {}
    },
    ready: function () {
        var that = this;
        $('.fixed-bar li').removeClass('active');
        $('.fixed-bar li').last().addClass('active');
        // $.cookie('userId', 1);
        if($.cookie('cuserid')){
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
            $('#container').show();
        }
    },
    methods: {
        login: function(){
            location.href = "/trueme/user/login.html"
        },
        logout: function(){
            $.AJAX({
                type: "POST",
                url: config.basePath + 'user/svloginout?userId=' + $.cookie('cuserid'),
                success: function(){
                    $.removeCookie('cuserid');
                    location.href = location.href;
                }
            });
        }
    }
});





