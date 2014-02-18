/*!
 * AD plugin smartAD V1.0
 * Depended jQuery. url http://jquery.com/
 * Author JsonZou
 * Copyright 2013
 *
 * Date: 2013-2-14 21:00
 */
;(function($){

	//浮窗样式定义
  var smartADClass={
      "smart-ad-fixed":{"position":"fixed","z-index":99},//浮动
	  "smart-ad-nofixed":{"position":"absolute","z-index":99},//不浮动
      "smart-ad-win":function(style){//广告窗体
		      return {"background":style.background?style.background:"#ddd",
				      "border":style.border?style.border:"1px solid #eee",
				      "width":style.width,
				      "left":style.left,
				      "top":style.top,
				      "padding":0,"cursor":"pointer"};          
	  },
	  "smart-ad-win-header":function(style){//广告窗体头部
		     return {"background":style.background?style.background:"#aaa",
				     "border-bottom":style.border?style.border:"1px solid #ddd",
				     "width":"100%","height":"12px","font-size":"10px","display":"none","padding":0};
		     
	  },
	  "smart-ad-win-body":function(style){//广告body
		     return {//"background":style.background?style.background:"#aaa",
                     "height":"100%",
				     "width":"100%","padding":0,"word-wrap":"break-word","word-break":"normal"};
	  },
	  "smart-ad-win-close":{"position":"absolute","right":"-3px","top":"-2px","padding":0,//广告窗体关闭按钮
		                    "background":"url(img/close.png)","width":"14px","height":"14px"},

	  "smart-ad-position-tl":function(style){//广告窗体位置topleft(顶部左边)
		     return {
				     'height':style.height?style.height:90,
					 'width':style.width?style.width:120,
				     'top':0,'left':0};
	  },
	  "smart-ad-position-tm":function(style){//广告窗体位置topmiddle(顶部中间)
		     return {
				     'height':style.height?style.height:90,
					 'width':style.width?style.width:960,
					 "margin-left":style.width?-style.width/2:-480,
					 'top':0,'left':'50%'};
	 },
	  "smart-ad-position-tr":function(style){//广告窗体位置topright(顶部右边)
		     return {
				     'height':style.height?style.height:90,
					 'width':style.width?style.width:120,
					 'top':0,'right':0,left:'auto'};
	},
	 "smart-ad-position-mm":function(style){//广告窗体位置middlemiddle(中部中间)
		     return {
				     'height':style.height?style.height:400,
					 'width':style.width?style.width:600,
					 "margin-top":style.height?-style.height/2:-200,
					 "margin-left":style.width?-style.width/2:-300,
					 'top':'50%','left':"50%"};
	},
   "smart-ad-position-ml":function(style){//广告窗体位置middleleft(中部左边)
		     return {
				     'height':style.height?style.height:300,
					 'width':style.width?style.width:120,
					 "margin-top":style.height?-style.height/2:-150,
					 'top':'50%','left':"10px"};
	},
	 
	  "smart-ad-position-mlt":function(style){//广告窗体位置middlelefttop(中部左边上方)
		     return {
				     'height':style.height?style.height:150,
					 'width':style.width?style.width:120,
					 "margin-top":style.height?-(style.height+10):-160,
					 'top':'50%','left':"10px"};
	},
	  "smart-ad-position-mlb":function(style){//广告窗体位置middleleftbottoom(中部左边下方)
		     return {
				     'height':style.height?style.height:150,
					 'width':style.width?style.width:120,
					 "margin-top":10,
					 'top':'50%','left':"10px"};
	},
	  "smart-ad-position-mr":function(style){//广告窗体位置middleright(中部右边)
		     return {
				     'height':style.height?style.height:300,
					 'width':style.width?style.width:120,
					 "margin-top":style.height?-style.height/2:-150,
				     'top':'50%','right':"10px",left:'auto'};
	},
	  "smart-ad-position-mrt":function(style){//广告窗体位置middlerighttop(中部右边上方)
		     return {
				     'height':style.height?style.height:150,
					 'width':style.width?style.width:120,
					 "margin-top":style.height?-(style.height+10):-160,
				     'top':'50%','right':"10px",left:'auto'};
	},
	  "smart-ad-position-mrb":function(style){//广告窗体位置middlerightbottom(中部右边下方)
		     return {
				     'height':style.height?style.height:150,
					 'width':style.width?style.width:120,
					 "margin-top":10,
					 'top':'50%','right':"10px",left:'auto'};
    },
	  
	  "smart-ad-position-bl":function(style){//广告窗体位置bottomleft(底部左边)
		     return {
				     'height':style.height?style.height:230,
					 'width':style.width?style.width:270,
					 'bottom':0,'left':0,'top':'atuo'};
	},
	  "smart-ad-position-bm":function(style){//广告窗体位置bottommiddle(底部中间)
		     return {
				     'height':style.height?style.height:90,
					 'width':style.width?style.width:960,
					 "margin-left":style.height?-style.height/2:-480,
				     'bottom':0,'left':"50%","top":'auto'};
	},
	  "smart-ad-position-br":function(style){//广告窗体位置bottomright(底部右边)
		     return {
				     'height':style.height?style.height:230,
					 'width':style.width?style.width:270,
					 'bottom':0,'right':0,left:'auto',top:'auto'};
   }
    };
 
  //参数常量
  var contants={
      delayFuncs:["fadeOut","hide","slideUp"],//支持的效果
	  delayFunc:'fadeOut',//默认效果

	  positions:['tl','tm','tr','mm','ml','mr','mlt','mlb','mrt','mrb','bl','bm','br'],//支持的方位
	  position:"br",//默认方位

	  style:{height:0,width:0,background:"",border:"",top:0,left:0}//窗体样式
   };
  //调用参数
  var $option={
       position:"",//广告悬挂位置，t(top上),b(bottom下),l(left左),r(right右),m(middle中).可选值（tl|tm|tr ml|mr|mlt|mlb|mrt|mrb bl|bm|br）
	   style:contants.style,//广告窗体样式
       close:true,//是否可关闭
	   header:true,//是否显示广告窗体头部
	   fixed:true,//是否固定位置浮动窗口显示
	   content:"",//广告内容，一般是图片，或html代码
	   link:"#",//广告链接
	   delay:0,//广告窗体延迟消失时间
	   delayFunc:contants.delayFunc,//广告窗体消失效果函数，为jQuery自带函数，可选值：[fadeOut,hide,slideUp]
       before:null,//广告加载前回调函数function(option,win,winHeader,winBody){}.option:配置参数，win:广告窗体jQuery对象，winHeader:广告窗体头部jQuery对象，winBody:广告窗体body的jQuery对象
	   after:null//广告加载后回调函数function(option,win,winHeader,winBody){}.option:配置参数，win:广告窗体jQuery对象，winHeader:广告窗体头部jQuery对象，winBody:广告窗体body的jQuery对象
    }; 
	
	  
	  //浮窗控件
	  var _floatWin=$("<div class='smart-ad-win'></div>");
	  var _floatWinHeader=$("<div class='smart-ad-win-header'></div>");
	  var _floatWinBody=$("<div class='smart-ad-win-body'></div>");
	  var _floatWinCloseBtn=$("<div class='smart-ad-win-close'></div>");
      
    
  //smartAD定义
      var $_smartAD=function(_option){
	 
      //整理参数
	  var option=$.extend({},$option,_option);
      option.style=$.extend({},contants.style,option.style);
      option.style.height=parseInt(option.style.height); 
	  option.style.width=parseInt(option.style.width);
	  option.style.top=parseInt(option.style.top);
	  option.style.left=parseInt(option.style.left);
 
	  //验证
	  //if(!option.link||!option.content){return;}
	  //浮窗控件生成
	  var floatWin=_floatWin.clone();
	  var floatWinHeader=_floatWinHeader.clone();
	  var floatWinBody=_floatWinBody.clone();
	  var floatWinCloseBtn=_floatWinCloseBtn.clone();
	 
      floatWin.append(floatWinHeader).append(floatWinBody);
	  floatWinHeader.append(floatWinCloseBtn);
	  
	  $("body").append(floatWin);
     //广告加载之前回调
	  if(option.before){option.before(option,floatWin,floatWinHeader,floatWinBody);}
     //浮窗样式渲染
	   floatWin.css(smartADClass["smart-ad-win"](option.style));
       floatWinHeader.css(smartADClass["smart-ad-win-header"](option.style));
       floatWinBody.css(smartADClass["smart-ad-win-body"](option.style));
 
	   if(option.position){ 
		   if($.inArray(option["position"],contants.positions)==-1){alert("Error!\nThe position is not exits.Supports:\n"+contants.positions);return;}
		   floatWin.css(smartADClass["smart-ad-position-"+option["position"]](option.style))
		};
	
       floatWinCloseBtn.css(smartADClass["smart-ad-win-close"]);
       floatWinHeader.width(floatWinBody.width());

       floatWin.css(smartADClass["smart-ad-fixed"]);
 
	   if(!option.fixed){floatWin.css(smartADClass["smart-ad-nofixed"]);}
     //广告内容渲染
       floatWinBody.html(option.content);
     //事件绑定
        //关闭按钮事件
       if(option.close){floatWinHeader.show();floatWinCloseBtn.click(function(){floatWin.hide();});}
        //广告点击事件
	   floatWinBody.attr("link",option.link);
	   if(option.link&&option.link!='#'){
		   floatWinBody.click(function(){smartADClickEvent(option.link);});
		}
		//窗体消失效果事件
	   if(option.delay>0){
		 if($.inArray(option.delayFunc,contants.delayFuncs)==-1){option.delayFunc=contants.delayFunc;}
	    setTimeout(function(){floatWin[option.delayFunc](800);},option.delay);
	   }
	 //广告加载之后回调
	  if(option.after){option.after(option,floatWin,floatWinHeader,floatWinBody);}
 
   };

 //smartAD广告点击事件
     var smartADClickEvent=function(link){
 
	     var adform=$("#smart-ad-form");
				  if(adform.length==0){
				    adform=$("<form id='smart-ad-form' name='smart-ad-form' target='_blank' method='get'></form>");
					$('body').append(adform)
				  }
			      adform.attr('action',link);
				  adform.submit();
	 };

  //window 扩展支持
   window.$smartAD=function(option_){
	   if(!option_["position"]){option_.position=contants.position;}
	   $_smartAD(option_);
   };;
   //jquery扩展函数
   $.smartAD=$smartAD;
   //jquery对象支持函数
   $.fn.extend({
     "smartAD":function(_option_){
	     var wrap=$("<div></div>");
		 var temp=$(this).clone();
		 temp.attr("id","smart-ad-id-"+$(this).attr("id"));
		 wrap.append(temp);

		 var fixed=_option_['fixed'];
		 _option_=$.extend({},$option,_option_);
		 _option_.style=$.extend({},contants.style,_option_.style);
		  if(!_option_.position){//没有方位默认是dom对象所在位置
		     if(!fixed){_option_.fixed=false;}  
             _option_["style"]={top:_option_["style"].top?_option_["style"].top:$(this).offset().top,
				                left:_option_["style"].left?_option_["style"].left:$(this).offset().left,
				                height:_option_["style"].height?_option_["style"].height:$(this).height(),
				 				width:_option_["style"].width?_option_["style"].width:$(this).width(),
                                background:_option_["style"].background,
				                border:_option_["style"].border
				                };

			 
			                       
		   }else{
		       _option_["style"]["top"]=0;
			   _option_["style"]["left"]=0;
			   //_option_["style"]["height"]=$(this).height();
			  // _option_["style"]["width"]=$(this).width();
		   }
	      if(!_option_.content){//没有内容默认是dom的内容
			  
			  $(this).hide();
			   _option_.content=wrap.html();
		  }
		  
		  $_smartAD(_option_);
		  
		 
	 }
   
   });
 

})(jQuery);