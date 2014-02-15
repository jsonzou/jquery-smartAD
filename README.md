jquery-smartAD
==============

This is a  AD plugin  depended on jQuery.



Usage:
=================
 //调用参数
	   var option={
	   
		   position:"",//广告悬挂位置.默认右下角（br）。可选值[tl|tm|tr|mm|ml|mr|mlt|mlb|mrt|mrb|bl|bm|br]
		   .字母意义：t(top上),b(bottom下),l(left左),r(right右),m(middle中)
		   
		   style:{
		   
		        height:0,//高
		        
				width:0,//宽
				
				background:"",//背景，窗体头部背景色
				
				border:"",//边框
				
				top:0,//顶部位置
				
				left:0//左边位置
				
				},//广告窗体样式
				
		   close:true,//是否可关闭
		   
		   header:true,//是否显示广告窗体头部
		   
		   fixed:true,//是否固定位置浮动窗口显示
		   
		   content:"",//广告内容，一般是图片，或html代码
		   
		   link:"#",//广告链接
		   
		   delay:0,//广告窗体延迟消失时间
		   
		   delayFunc:contants.delayFunc,//广告窗体消失效果函数，为jQuery自带函数，默认淡出（fadeOut）。
		   可选值：[fadeOut,hide,slideUp]
		   
		   before:null,//广告加载前回调函数function(option,win,winHeader,winBody){}.
		   option:配置参数，win:广告窗体jQuery对象，winHeader:广告窗体头部jQuery对象        ，winBody:广告窗体body的jQuery对象
		   
		   after:null//广告加载后回调函数function(option,win,winHeader,winBody){}.
		   option:配置参数，win:广告窗体jQuery对象，winHeader:广告窗体头部jQuery对象        ，winBody:广告窗体body的jQuery对象
		   
	   };
	   
	   
	   //支持3种调用方式：
     //方式1：
     $smartAD(option);
	   //方式2：
	   $("div#ad1").smartAD(option);
	   //方式3：
	   $.smartAD(option);
	   



