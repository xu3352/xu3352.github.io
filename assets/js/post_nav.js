/**
 *  Jekyll-Twitter-Theme 文章H1标题预览插件
 *  依赖 zepto.min.js 等类jquery库
 */

// 边栏root [Published, Tags]
var $sideBar = $("ul.tag_box").parent();

var array = $("h1");
if (array.length > 1) {
    var dom =  '<ul class="post_nav">'
    for (var i = 0; i < array.length; i++) {
        var $h1 = $(array[i]);
        if ($h1.attr("id") != null) {
            console.log( $h1.text() )
            dom += '    <li><a style="color:#999" href="#'+ $h1.attr("id") +'">'+ $h1.text() +'</a></li>';
        }
    }
    dom += '</ul> ';

    // append dom
    $sideBar.append('<h4>Content List</h4>');
    $sideBar.append(dom);
}
