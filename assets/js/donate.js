/**
 *  打赏:微信/支付宝二维码
 *  @see http://www.alonemonkey.com/2018/06/01/new-ios-reverse-book/
 */
$(function(){
    // 初始化DIV
	var dom = ''
   		 + '<div class="post-donate">'
   		 + '    <div id="donate_board" class="donate_bar center">'
   		 + '        <a id="btn_donate" class="btn_donate" href="javascript:;" title="打赏"></a>'
   		 + '        <span class="donate_txt">'
   		 + '           ↑<br/> 感谢你的支持，我会继续努力！'
   		 + '        </span>'
   		 + '        <br/>'
   		 + '    </div>'
         + '    <div id="donate_guide" class="donate_bar center hidden">'
         + '        <a href="/assets/images/alipay.png" class="fancybox" rel="group">'
         + '            <img src="/assets/images/alipay.png" alt="支付宝打赏">'
         + '        </a>'
         + '        <a href="/assets/images/wxpay.png" class="fancybox" rel="group">'
         + '            <img src="/assets/images/wxpay.png" alt="微信打赏">'
         + '        </a>'
   		 + '    </div>'
   		 + '</div>';

    // 追加到翻页后面
    var $content = $(".pagination");
    $content.after(dom);
    
    // 绑定事件
	$(".post-donate").on('click', '#btn_donate', function(){
    	$('#donate_board').hide();
    	$('#donate_guide').show();
	})
})

