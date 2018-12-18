/**
 *  Jekyll-Twitter-Theme 文章H1标题预览插件
 *  依赖 zepto.min.js 等类jquery库
 *  v1.0 仅支持展示H1
 *  v1.1 支持H1~H6，小标题自动往后缩进
 *  v1.2 默认只展示H1,H2; 其他的默认收起; 有子集的自动展开
 */
$(document).ready(function(){
    /** 获取 H1~H6 所有元素 */
    function getHeadlineTags() {
        var arrays = [];
        $("*[id]").each(function(){
            var tagName = $(this).prop("tagName");
            if ($.inArray(tagName, hs) >= 0) {
                // console.log(tagName)
                arrays.push($(this));
            }
        });
        return arrays;
    }

    /** 判断元素标题等级H1~H6，返回0~5，如果不是H1~H6，则返回-1 */
    function getHeadlineLevel(h) {
        var tagName = $(h).prop("tagName");
        return $.inArray(tagName, hs);
    }

    /** 生成目录列表 */
    function generateContentList(array) {
        if (array.length > 1) {
            var dom =  '<ul class="post_nav">'
            for (var i = 0; i < array.length; i++) {
                var $h1 = $(array[i]);
                var level = getHeadlineLevel( $h1 );
                var li_style = level <= 0 ? '': ' style="margin-left:'+(level*12)+'px"';
                    li_style = ' data-level="'+(level+1)+'" is-show="'+(level+1<=2?1:0)+'"' + li_style;
                dom += '<li'+li_style+'><a style="color:#999" href="#'+ $h1.attr("id") +'">'+ $h1.text() +'</a></li>';
            }
            dom += '</ul> ';

            // 边栏root [Published, Tags]
            var $sideBar = $("ul.tag_box").parent();

            // append dom
            $sideBar.append('<h4>Content List</h4>');
            $sideBar.append(dom);
        }
    }

    // h2 以下的子集全部隐藏
    function resetShow() {
        $(".post_nav li").each(function(){
            if ($(this).attr("data-level") > 2) $(this).attr("is-show", 0);
        });
    }

    // 子集展开
    $("div.row").on("click", ".post_nav li a", function(){
        var $a = $(this);
        // 点中的加下划线
        $(".post_nav a.active").removeClass("active");
        $a.addClass("active");

        // h1 不处理
        var curr_level = $a.parent().attr("data-level");
        resetShow();
        if (curr_level <= 1) return;

        $a.parent().attr("is-show", 1);

        // 往前遍历
        var $prev = $a.parent().prev("li");
        while (true) {
            if ($prev.length == 0) break;
            if ($prev.attr("is-show") == 1) break;
            var l = $prev.attr("data-level");
            if (l <= curr_level) $prev.attr("is-show", 1);
            $prev = $prev.prev("li");
        }

        // 往后遍历
        var $next = $a.parent().next("li");
        var sub_level = $next.length == 0 ? 0 : $next.attr("data-level");
        while (true) {
            if ($next.length == 0) break;
            if ($next.attr("is-show") == 1) break;
            var l = $next.attr("data-level");
            if (l <= sub_level || l == curr_level) $next.attr("is-show", 1);
            $next = $next.next("li");
        }
    })

    // H1~H6 标签名数组
    var hs = ["H1", "H2", "H3", "H4", "H5", "H6"];
    // 找到所有 H1~H6 
    var array = getHeadlineTags();
    // 生成 Content List
    generateContentList(array);
});

