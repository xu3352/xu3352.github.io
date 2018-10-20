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
            changeToWideModel(this);    
        } else {
            changeToNarrowModel(this);
        }
    });

    function changeToWideModel(a) {
        $(".span10").attr("class", "span14");
        $(".span4").css("margin-left","40px");
        $(".tag_box a").addClass("widemode");
        $(a).text(titles[1]);
        $(a).attr("is-narrow", false);
        Cookies.set("isNarrowModel", 0);
    }

    function changeToNarrowModel(a) {
        $(".span14").attr("class", "span10");
        $(".tag_box a").removeClass("widemode");
        $(a).text(titles[0]);
        $(a).attr("is-narrow", true);
        Cookies.set("isNarrowModel", 1);
    }
   
    // 初始动作:默认宽屏
    var isNarrowModel = Cookies.get("isNarrowModel");
    if (typeof isNarrowModel == 'undefined' || isNarrowModel == "0") {
        changeToWideModel($(".sidebar-switch"));
    }
})

