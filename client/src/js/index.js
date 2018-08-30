import $ from "jquery";
class Floor{
	constructor( lc,tip ){
		this.lc = lc;
		this.tip = tip;
		this.tip.css("display","none");
		this.init();
	}
	init(){
		this.createArr();
		this.lc_click();
		this.top_click();
		//滚动的屏幕的函数
		this.window_scroll();
	}
	createArr(){
		//把每层楼的高度放在数组中
		this.arr = [];
		var that = this;
		this.arr = this.lc.map( function( ind,item ){
			return $(item).offset().top;
		} );
		//将最后一层的高度也写进去
		this.arr.push( this.lc.eq(this.arr.length-1).height()+this.arr[this.arr.length-1] );
	}
	window_scroll(){
		var that = this;
		$(window).scroll( function(e){
			var h = $(window).scrollTop();
			h += $(window).height()/2;
			var ind = -1;
			for( var i=0;i<that.arr.length;i++ ){
				var min = that.arr[i];
				var max = that.arr[i+1];
				if( h>min && h<max ){
					ind = i;
				}
			}
			that.tip.find("ul>li").removeClass();
			that.tip.find("ol>li").removeClass();
			if( ind==-1 ){
				
			}else{
				that.tip.find("ul>li").eq(ind).addClass("active");
			}
			if( h > that.arr[0] ){
				that.tip.stop().fadeIn(100);
			}else{
				that.tip.stop().fadeOut(100);
			}
			if( h > that.arr[that.arr.length-1] ){
				that.tip.find("ol>li").eq(0).addClass("active");
			}
		} );
	}
	lc_click(){
		var btns = this.tip.find("ul>li");
		var that = this;
		btns.click( function(){
			var ind = $(this).index();
			$("html").stop().animate( {
				"scrollTop":that.arr[ind]
			},500);
		} );
	}
	top_click(){
		var btns = this.tip.find("ol>li");
		var that = this;
		btns.click( function(){
			var ind = $(this).index();
			$("html").stop().animate( {
				"scrollTop":0
			},500);
		} );
	}
}


class Nav{
	constructor( li ){
		this.li = li;
		this.init();
	}
	init(){
		var that = this;
		this.li.hover( function(){
			var ind = $(this).index();
			if( ind!=0 ){
				that.createImg( $(this),ind );
			}

		},function(){
			var ind = $(this).index();
			if( ind!=0 ){
				that.removeImg( $(this),ind );
			}
		});
	}
	createImg(li,ind){
		this.img = $("<img src = './img/doudou.png'></img>");
		this.img.css({
			"position":"absolute",
			"width":22,
			"height":24
		});
		this.img.css({
			"left":(li.outerWidth()-this.img.width())/2,
			"top":0,
			"z-index":-1
		});
		this.img.animate( {
			"top":-14
		} );
		this.li.eq(ind).append(this.img);
	}
	removeImg(li,ind){
		if( this.img ){
			this.img.remove();
		}
	}
}



class Aside{
	constructor( btn_box,shops ){
		this.btn_box= btn_box;
		//划过的按钮
		this.btns = this.btn_box.children("li");
		//显示的弹窗
		this.shops = shops;
		this.init();
	}
	init(){
		this.btns_hover();
	}
	btns_hover(){
		var that = this;
		this.btns.mouseover( function(){
			var ind = $(this).index();
			that.shops.css("display","none");
			that.shops.eq(ind).stop().fadeIn().parent().show();
		} ).mouseout( function(){
			var ind = $(this).index();
			that.shops.eq(ind).stop().fadeOut().parent().hide();
		} );
		
		this.shops.mouseover( function(){
			var ind = $(this).index();
			that.shops.eq(ind).stop().fadeIn().parent().show();
			console.log( 123) ;
		} ).mouseout( function(){
			var ind = $(this).index();
			that.shops.eq(ind).stop().fadeOut().parent().hide();
		} );
	}
	
}


//轮播图
class Banner{
	constructor( ele,width,height,imgs,btnSize,time,colors){
		//最外层的div
		this.ele = ele;
		//外层的ul
		this.ul = this.ele.find("ul").eq(0);
		this.width = width;
		this.height = height;
		this.imgs = imgs;
		this.btnSize = btnSize;
		this.time = time;
		//banner总的box 的元素
		this.box = this.ele.parent().parent().parent();
		//box的颜色数组
		this.colors = colors;
		//按钮
		this.btn_ol = this.ele.find("ol");
		this.ind = 0;
		//轮播的方向
		this.direction = 1;
		
		//是否清除定时器的标志,true表示定时器在执行
		this.flag = true;
	
		
		//向前和向后的按钮
		this.pre_btn = this.ele.find(".pre").eq(0);
		this.next_btn = this.ele.find(".next").eq(0);
		this.init();
	}
	init(){
		this.createHtml();
		//按钮点击跳转
		this.btn_click();
		//自动播放
		this.autoPlay();
		//前进后退按钮
		this.btnPre_fn();
		this.btnNext_fn();
		//放上去停止
		this.over();
		this.out();
	}
	createHtml(){
		//创建图片节点
		this.len = this.imgs.length;
		for( var i=0;i<this.len;i++ ){
			var li = $("<li></li>").html(`<a href = "#"><img src = "../src/img/${this.imgs[i]}" /></a>`)
			var li_d = $("<li><a></a></li>");
			this.btn_ol.append( li_d );
			this.ul.append( li );	
		}
		//初始化第一个小点
		this.btn_ol.find("li").eq(0).find("a").eq(0).addClass("d_active");
		//实现无缝轮播
		this.ul.append( $("<li></li>").html(`<a href = "#"><img src = "../src/img/${this.imgs[0]}" /></a>`) );
		
	}
	btn_click(){
		var that = this;
		this.btn_ol.on( "click","li",function(e){
			var target = $(e.target);
			//将li下的所有a变为display:none
//			that.btn_ol.find("a").css("display","none");
			if( target.get(0).nodeName=="LI" ){
				target.find("a").css("display","block");
				console.log( target.find("a") );
				var index = $(target).index();//按钮的下标
				that.ind = index;
				that.tab();
			}
		} );
	}
	//向前向后按钮
	btnPre_fn(){
		var that = this;
		this.pre_btn.click( function(){
			that.ind--;
			that.direction = -1;
			that.tab();
		} );
	}
	btnNext_fn(){
		var that = this;
		this.next_btn.click( function(){
			that.ind++;
			that.direction = 1;
			that.tab();
		} );
	}
	
	tab(){
		var that = this;
		if( this.ind==this.len ){
			this.ul.stop().animate({"left":(this.ind)*(-784)},function(){
				that.ul.css("left",0);
			});
			that.ind = 0;
		}else if( this.ind==-1 ){
			this.ul.css("left",(this.len)*(-784));
			this.ind = this.len-1;
			this.ul.stop().animate({"left":(this.ind)*(-784)});
		}else{
			this.ul.stop().animate({"left":(this.ind)*(-784)});
		}		
		//按钮的样式d_active
		that.btn_ol.find("li a").removeClass();
		that.btn_ol.find("li").eq(this.ind).find("a").eq(0).addClass("d_active");
		//box背景色改变
		that.box.css({
			"opacity":0.6
		});
		that.box.css("background-color",that.colors[this.ind]).animate({
			"opacity":1
		});
	
	}
	
	next(){
		this.ind+=this.direction;
		this.tab();
	}
	autoPlay(){
		this.timer = setInterval( this.next.bind(this),this.time );
	}
	over(){
		var that = this;
		this.ele.mouseover( function(){
			if(that.flag){
				clearInterval( that.timer );
			}
			that.flag = false;
		} );
		
	}
	out(){
		var that = this;
		this.ele.mouseout( function(){
			if(!that.flag){
				that.timer = setInterval( that.next.bind(that),that.time );
			}
			that.flag = true;
		} );
		
	}
}



class ScrollRight{
	constructor( btn,next,box ){
		this.btn = btn;
		this.box = box;
		this.next = next;
		this.ul = this.box.find("ul").eq(0);
		this.init();
	}
	init(){
		//计算ul的宽度
		this.fixWidth();
		this.boxScroll();
		
	}
	fixWidth(){
		//求出li的数量以及宽度
		var lis = this.ul.find("li");
		var len = lis.length;
		var li_width = lis.eq(0).outerWidth();
		this.total = len*li_width;
		this.ul.css( "width", this.total);
	}
	boxScroll(){
		var that = this;
		this.flag = true;
		this.btn.mouseover( function(){
			that.flag = true;
			that.over();
		} );
		this.btn.mouseout( function(){
			that.up();
		} );
		this.next.mouseover( function(){
			that.flag = false;
			that.over();
		} );
		this.next.mouseout( function(){
			that.up();
		} );
	}
	over(){
		var that = this;
		this.timer = setInterval( function(){
			if( that.flag ){
				that.box.get(0).scrollLeft++;
			}else{
				that.box.get(0).scrollLeft--;
			}
		},10);
	}
	up(){
		var that = this;
		if( that.flag ){
			clearInterval( this.timer );
		}else{
			clearInterval( this.timer );
		}
	}
}


//放大图片
class scaleImg{
	constructor( box ){
		this.box = box;
		this.a = this.box.find("a").eq(0);
		//求出图片的宽度 高度
		this.w = this.a.outerWidth();
		this.h = this.a.outerHeight();
		this.init();
	}
	init(){
		this.over();
		this.out();
		this.box.css("position","relative");
		this.a.css("position","absolute");
	}
	over(){
		var that = this;
		this.box.mouseover( function(){
			that.scale_big();
		} );
	}
	out(){
		var that = this;
		this.box.mouseout( function(){
			that.scale_small();
		} );
	}
	scale_big(){
		var ww = parseInt(this.w*(1.08));
		var hh = parseInt(this.h*(1.08));
		this.a.stop().animate({
			"width":ww,
			"height":hh,
			"left":-(ww-this.w)/2,
			"top":-(hh-this.h)/2
		});
	}
	scale_small(){
		this.a.stop().animate({
			"width":this.w,
			"height":this.h,
			"left":0,
			"top":0
		});		
	}
}


//楼层中的轮播图
class LcBanner{
	constructor( box,width,height,imgs,time,spanWidth ){
		this.box = box;
		this.width = width;
		this.time = time;//进度条速度
		this.height = height;
		this.imgs = imgs;
		//按钮的灰条的宽度
		this.w = 0;
		//灰色进度条的上限值
		this.maxWidth = spanWidth;
		//ul
		this.ul = this.box.find("ul").eq(0);
		//按钮的ol
		this.ol = this.box.find("ol").eq(0);
		this.len = this.imgs.length;
		this.now = 0;
		this.init();
	}
	init(){
		this.createHtml();
		
		this.getSpan();
		//点击切换
		this.btnClick();
		//自动播放
//		this.autoPlay();
		//灰色按钮进度条
		this.btnAutoPlay();
		this.over();
		this.out();
	}
	getSpan(){
		//获取按钮处的span
		this.span = this.ol.find("li span");
	}
	createHtml(){
		for( var i=0;i<this.len;i++ ){
			//创建li以及img
			var ele = $(`<li><a href = "#"><img src = "../src/img/${this.imgs[i]}"  alt = ""/></a></li>`);
			this.ul.append( ele );
			//创建按钮
			var btn = $(`<li><span></span></li>`);
			this.ol.append( btn );
		}

		//无缝轮播多添加最后一个图片
		var last_ele = $(`<li><a href = "#"><img src = "../src/img/${this.imgs[0]}"  alt = ""/></a></li>`);
		this.ul.append( last_ele );
	}
	btnClick(){
		//点击切换
		var that = this;
		this.ol.on( "click","li",function(){
			var ind = $(this).index();
			that.now = ind;
			that.num = 0;
			that.tab();
		} );
	}
	tab(){
		var len = this.len;
		var that = this;
		if( this.now==len ){
			this.ul.animate( {"left":len*(-this.width)},function(){
				that.ul.css("left",0);
			});
			this.now = 0;
		}else{
			this.ul.animate( {"left":this.now*(-this.width)} );
		}
		

	}
	next(){
		this.now++;
		this.tab();
	}
	over(){
		var that = this;
		this.box.mouseover( function(){
			clearInterval( that.btn_timer );
		} );
	}
	out(){
		var that = this;
		this.box.mouseout( function(){
			that.btn_timer = setInterval( that.btn_next.bind(that),100);	
		} );
	}
	btnAutoPlay(){
		//灰色进度条,清除所有进度条width * (x/time)
		this.num = 0;
		var that = this;
		this.btn_timer = setInterval( this.btn_next.bind(this),that.time);		
	}
	btn_next(){
		this.num++;
		if( this.num>=this.maxWidth ){
			this.num = 0;
			this.next();
		}
		this.span.width(0);
		this.span.eq( this.now ).width( this.num );		
	}
}



//图片向左的类
class MoveLeft{
	constructor( box,w,h){
		this.box = box;
		this.w = w;
		this.h = h;
		this.a = this.box.find("a").eq(0);
		this.img = this.a.find("img").eq(0);
		this.init();
	}
	init(){
		this.setCss();
	}
	setCss(){
		this.box.css("overflow","hidden");
		this.a.css("position","relative");
		//图片宽 高
		var imgW = this.img.outerWidth();
		var imgH = this.img.outerHeight();
		var that = this;
		var img = this.img.find("img").eq(0);
		this.img.css({
			"position":"absolute"
		});		
		this.over();
		this.out();
	}
	over(){
		var that = this;
		this.a.mouseover( function(){
			var img = $(this).find("img").eq(0);
			that.img.stop().animate({
				"left":-10
			});
		} );
	}
	out(){
		var that = this;
		this.a.mouseout( function(){
			var img = $(this).find("img").eq(0);
			that.img.stop().animate( {
				"left":0
			} );
		} );
	}
}

class WindowTop{
	constructor( ele,target ){
		this.ele = ele;
		this.target = target;
		this.init();
	}
	init(){
		//求出屏幕滚动的距离
		this.windowScroll();
	}
	windowScroll(){
		var that = this;
		//界限值高度
		var h = this.target.offset().top;
		$(window).scroll( function(){
			that.win_h = $(window).scrollTop();
			if( that.win_h>=h ){
				that.ele.stop().animate({
					"top":0
				},50);
			}else{
				that.ele.stop().animate({
					"top":-70
				},50);				
			}
		} );
	}
}


class Right_aside{
	constructor( box ){
		this.box = box;
		this.lis = this.box.children("li");
		this.init();
	}
	init(){
		var that = this;
		//设置各个li的right
		this.setRight();
		
		this.lis.mouseover( function(){
			$(this).removeClass();
			$(this).addClass("active");
			$(this).find("strong").css("display","none");

			//显示对应的span
			that.showSpan( $(this) );
		} );
		this.lis.mouseout( function(){
			$(this).removeClass();
			$(this).addClass("normal");
			$(this).find("strong").stop().fadeIn	();

			
			//隐藏对应的span
			that.hideSpan( $(this) );
		} );
	}
	setRight(){
		this.lis.each( function(ind,item){
			var w = $(this).find("span").eq(0).outerWidth();
			var res = -(w+38);
			$(this).find("span").css("right",res);
		} );
	}
	showSpan( li ){
		li.find("span").stop().animate({
			"right":38
		});
	}
	hideSpan( li ){
		var w = li.find("span").eq(0).outerWidth();
		var res = -(w+38);
		li.find("span").stop().animate({
			"right":res
		});
	}
}

//点击按钮收回右侧菜单
class Right_hide{
	constructor( btn,ele ,bool){
		this.btn = btn;
		this.ele = ele;
		this.bool = bool;
		this.init();
	}
	init(){
		var that = this;
		this.btn.click( function(){
			var r = that.ele.css("right");
			if( !that.bool ){
				that.ele.stop().animate( {
					"right":-300
				});	
			}else{
				that.ele.stop().animate( {
					"right":0
				});		
			}
			
			
		});
	}
}
//右侧菜单的切换
class Right_toggle{
	constructor( ul,ol ){
		this.ul = ul;
		this.ol = ol;
		//菜单按钮
		this.btns = this.ul.children("li");
		//切换的内容
		this.contents = this.ol.children("li");
		this.init();
	}
	init(){
		var that = this;
		//屏幕高度
		var h = $(window).outerHeight();
		this.btns.click( function(){
			//将所有元素放在屏幕外
			that.contents.css("top",h);
			
			var ind = $(this).index();
			that.contents.hide();
			that.contents.eq( ind ).show().animate({
				"top":0
			});
		} );
	}
}






	$(function(){
		new Floor( $(".lc"),$(".tip .container") );
		new Nav( $(".nav .nav_li") );
		new Aside( $(".nav_li .aside"),$(".nav_li .aside_shop>li") );//f_h_left
		new Aside( $(".f_h_left .btn_ul"),$(".f_h_left .aside_shop>li") );
		//轮播图
		new Banner( $(".banner_box"),784,430,["1444930128.jpg","1585671013.jpg","186715001.jpg","2057815962.jpg"],8 ,10000,["rgb(252, 227, 191)","rgb(254, 206, 183)","rgb(213, 210, 202)","rgb(184, 206, 234)"]);
		
		//商品向右滚动
		new ScrollRight( $(".next_btn"),$(".pre_btn"),$(".s_a_t_rightBox") );
		
		//图片放大
		new scaleImg( $(".s_a_t_left") );
		new scaleImg( $(".s_a_b_top") );
		var lis = $(".s_a_bottom").find("ul").eq(0).find("li");
		lis.each( function(ind,item){
			new scaleImg( $(item) );
		} );
		
		
		//楼层中的轮播图
		$(".lc_left").each( function(ind,item){
			if( ind%2 ){
				new LcBanner( $(item),306,465,["568360692.jpg","1047979940.jpg","678465710.jpg"],200,30);
			}else{
				new LcBanner( $(item),306,465,["568360692.jpg","1047979940.jpg","678465710.jpg"],100,30);
			}
		} );
		
		//图片向左的动画
		//获取到li  lc_right_three
		var lc_li = $(".lc_right_one ul li");
		var lc_two = $(".lc_right_two ul li");
		var lc_three = $(".lc_right_three ul li");
		var lc_forth = $(".lc_right_forth ul li");
		lc_li.each( function(ind,item){
			new MoveLeft( $(item),$(item).outerWidth(),$(item).outerHeight());
		} );
		lc_two.each( function(ind,item){
			new MoveLeft( $(item),$(item).outerWidth(),$(item).outerHeight());
		} );
		lc_three.each( function(ind,item){
			new MoveLeft( $(item),$(item).outerWidth(),$(item).outerHeight());
		} );
		lc_forth.each( function(ind,item){
			new MoveLeft( $(item),$(item).outerWidth(),$(item).outerHeight());
		} );
		
		//吸顶效果
		new WindowTop( $(".file_header"),$(".banner") );
		
		//右侧菜单黑色条
		new Right_aside( $(".r_aside>ul") );
		
		//右侧菜单点击收回 true是显示  false是隐藏
		new Right_hide( $(".r_aside ol li").eq(0).find("h5"),$(".r_aside").eq(0),false);
		new Right_hide( $(".r_aside ol li").eq(1).find("h5 i"),$(".r_aside").eq(0),false );
		new Right_hide( $(".header").eq(0),$(".r_aside").eq(0),false);
		new Right_hide( $(".lc"),$(".r_aside").eq(0),false );
		new Right_hide( $(".you_like").eq(0),$(".r_aside").eq(0),false );
	//	new Right_hide( $(".r_aside ul li").eq(0),$(".r_aside").eq(0),true );
		$(".r_aside ul li").each( function(ind,item){
			new Right_hide( $(item),$(".r_aside"),true);
		} );
		
		//右侧菜单的切换
		new Right_toggle( $(".r_aside").children("ul"),$(".r_aside").children("ol") );
	})
	