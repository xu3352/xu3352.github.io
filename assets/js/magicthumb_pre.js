/**
 *  magicthumb_pre.js 对站内的图片预处理
 *  依赖 zepto.min.js 等类jquery库
 *  v1.0 加入 magicthumb.js 可对图片进行缩放
 */
$(function(){
    var index = 0;
    $("img").each(function(){
        var $img = $(this);
        var thumb = (index++ == 0) ? 'id="thumb1"' : 'data-thumb-id="thumb1"';
        $img.before('<a class="MagicThumb" '+ thumb +' href="'+$img.attr("src")+'"></a>');
        $img.prev('.MagicThumb').append( $img );
        
        // reload all Magic Thumb images
        setTimeout(function(){
            if (MagicThumb) MagicThumb.refresh();
        }, 1500);
    });
})

