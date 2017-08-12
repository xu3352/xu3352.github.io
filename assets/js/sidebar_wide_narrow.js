/**
 * content wide or narrow screen modle plugin
 * author xu3352@gmail.com
 * 依赖 zepto.min.js 等类jquery库
 * v1.0
 */
$(function(){
    var titles = ["☞ WideScreen Model", "☜ NarrowScreen Model"];
    
    // add a switch to sidebar
    var $sideBar = $("ul.tag_box").parent();
    var s = '<h4 class="sidebar-switch" is-narrow="true" style="color:#0069a0;cursor:pointer;" title="Click to Switch.">'+titles[0]+'</h4>';
    $sideBar.append( s );    
    
    // init setting
    $(".span4").css("position","fixed")
               .css("margin-top","-10px");

    // switch event for full or narrow model
    $(".content").on("click", ".sidebar-switch", function(){
        var $s = $(this);
        var isNarrowModel = ($s.attr("is-narrow") == "true");
        if (isNarrowModel) {
            $(".span10").attr("class", "span14");
            $(".span4").css("margin-left","40px");
            $(".tag_box a").css("background","#eef");
            $s.text(titles[1]);
        } else {
            $(".span14").attr("class", "span10");
            $(".tag_box a").css("background","#eee");
            $s.text(titles[0]);
        }
        $s.attr("is-narrow", !isNarrowModel);
    });
})

