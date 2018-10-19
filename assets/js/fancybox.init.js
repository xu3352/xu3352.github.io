/**
 *  fancybox.init.js 对站内的图片预处理
 *  依赖 jquery
 */
$(function(){
    // 预处理
    $("img").each(function(){
        var $img = $(this);
        $img.before('<a class="fancybox" rel="group1" href="'+$img.attr("src")+'" title="'+$img.attr("alt")+'"></a>');
        $img.prev('.fancybox').append( $img );
    });
    
    // 初始化插件
	$(document).ready(function() {
        $(".fancybox").fancybox();
    });
})

