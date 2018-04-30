/**
 *  abigimage.init.js 对站内的图片预处理
 *  依赖 jquery
 */
$(function(){
    // 预处理
    $("img").each(function(){
        var $img = $(this);
        $img.before('<a class="abigimage" href="'+$img.attr("src")+'"></a>');
        $img.prev('.abigimage').append( $img );
    });
    
    // 初始化插件
    $('a.abigimage').abigimage({
        bottomCSS: {
            fontSize: '2em',
            textAlign: 'center'
        },
        onopen: function (target) {
            this.bottom.html(
                $('img', target).attr('alt')
            );
        }
    });
})

