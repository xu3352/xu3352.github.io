/**
 * top navigation bar auto hide and show
 * author xu3352@gmail.com
 * 依赖 zepto.min.js 等类jquery库
 * v1.0
 */
$(function(){
    window.onscroll = function() {
        var $t = $(".topbar");
        var e = document.body.scrollTop || document.documentElement.scrollTop;
        if (e < 40) {
            $t.fadeIn(800);
        } else {
            $t.fadeOut(800);
        }
    }
})

