import $ from "jquery";
import {setCookie,getCookie,getCookieAll,removeCookie,removeCookieAll} from "./cookie.js";
import {pao} from "./pao.js";

$(function(){
//show页面获取数据的函数

function getPingData(){
	$.get("../pingjia.json",function(res){
		var obj = res;
		new PingContent( $(".pingjia .p_content"),obj,$(".p_j_page") ); 
		new ShowTop( $(".s_c_r_btn") );
	});
}

function getOtherData(){
	//o_box ul
	var str = ``;
	$.get("../show.json",function( res ){
		var arr = res;
		var len = arr.length;
		var p = Math.ceil(len/5); //一共多少页
		var now = 1; //当前页
		arr.forEach( ( obj )=>{
			str += `
				<li>
					<div><a><img src="./list/${obj.imgs}" alt="" /></a></div>
					<p>【官方授权】Apple iPhone8 Plus 64GB 金色 移动联通电信4G手机</p>
					<p>4199.00</p>
				</li>			
			`;			
		} );
		$(".o_box ul").html(str);
		//创建按钮
		$(".o_btn_text em").text( p );//一共多少页
		$(".o_btn_text i").text( now );//当前页
		//其他顾客也会购买
		new OtherShop( $(".o_btn") );
	});
}


function getShowPage(){
	var str = ``;
	var ID = localStorage.getItem("g");
	$(".g_left").html("加载中...");
	$.get("../data.json",function( res ){
		var obj = null;
		//获取值的全部内容
		var values = Object.values( res );
		for( var i=0;i<values.length;i++ ){
			if( values[i].list[0].id==ID ){
				obj = values[i].list[0];
				break;
			}
		}
		
		//查找数据中有多少小图片
		var img_str = ``;
		obj.imgs.forEach( ( item )=>{
			img_str += `<li><a><img src="./list/${item}" alt = ""/></a></li>`;
		} );
		
		str = `
			<div class = "g_l_top">
				<img src="./list/${obj.src}" alt = ""/>
				<div class = "glass"></div>
			</div>
			<div class="g_l_bottom">
				<div class = "g_l_left_btn">&lt;</div>
				<div class = "s_img_box">
					<ul>
						${img_str}
					</ul>
				</div>
				<div class = "g_l_right_btn">&gt;</div>
			</div>			
		`;
		
		//加载右侧数据
		var r_data = ``;
		r_data = `
			<h3><span>自营</span><u>${obj.des}</u></h3>
			<p>6.3英寸双曲面玻璃全面屏、2400万高清四摄、麒麟970旗舰芯片、GPU Turbo6+128GB内存、全天候人脸解锁、AI实力派！</p>
			<div class="go_time">
				<h4>
					<div>闪购</div>
					<p class = "time_box"></p>
					<a href="#">更多活动 &gt;</a>
				</h4>
				<div class="t_content">
					<span>活动价</span>
					<p><i>${obj.price}</i><em>${Math.round(obj.price/obj.y_price*10)}折</em><b>参考价 ${obj.y_price}</b></p>
				</div>
			</div>
			<div class = "xuan">
				<div class="item">
					<div class = "i_left">
						配送
					</div>
					<div class = "i_right">
						<select>
							<option>石家庄</option>
							<option>北京</option>
							<option>上海</option>
						</select>
						<label>99元免运费(5kg内)</label>
					</div>
				</div>
				<div class="item">
					<div class = "i_left">
						服务
					</div>
					<div class = "i_right">
						<p>本产品由百联云商提供发货和售后服务；预计2018-08-17送达</p>
						<ul>
							<li><a href="#">不支持到店自提</a></li>
							<li><a href="#">不支持7天无理由退货</a></li>
							<li><a href="#">支持货到付款</a></li>
						</ul>
					</div>
				</div>
				<div class="item">
					<div class = "i_left">
						购买数量
					</div>
					<div class = "i_right">
						<div class = "clearfix">
							<div class = "tt">
								<span id="sub" class = "active">-</span>
								<input class = "tt_num" type="text" value = "1" />
								<span id = "add">+</span>
							</div>
							<p>每单限购3件,库存15件</p>
						</div>
						<div class = "buy_btns clearfix" data-id=${obj.id}>
							<input type="button" value = "立即购买" />
							<input type="button" class = "addShop" value = "加入购物车" />
							<input type="button" value = "收藏" />
						</div>
						<div class = "ping">
							<a href="#"><i>100%</i>好评</a>
							<span>|</span>
							<a href="#"><em>13</em>评价</a>
							<span>|</span>
							<a href="#">评价返积分</a>
						</div>
					</div>
				</div>
			</div>			
		`;
		
		//加载吸顶的数据
		var t_str = ``;
		t_str = `
			<div class="s_t_left">
				<img src="list/${obj.src}" alt="" />
			</div>
			<div class="s_t_right">
				<p>${obj.des}</p>
				<p>${obj.price}</p>
			</div>		
		`;
		$(".s_top").html(t_str);
		
		$(".g_r_content").html( r_data );
		$(".big_img").find("img").attr("src","./list/"+obj.src);
		$(".g_left").html(str);
		showLoad( obj );//加载完数据后的操作
	});
	
}

//加载完数据后的操作
function showLoad(obj){
	getShopData();
	
	new TabImg( $(".s_img_box>ul"),$(".g_l_top img"),$(".big_img img") );
	new GlassImg( $(".glass_area") );
	new Glass( $(".glass_area") );
	//开始倒计时
	new FixTime( $(".time_box"),"2018/8/30 15:30:45" );
	//加入购物车
	new ShopBtn( $(".addShop"),obj );
//	new ShopBtn( $(".s_top_btn"),obj );
}



//ES6公共


//页面跳转
$(".go_shop").click( function(){
	location.href = "shopping.html";
} );
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
			$(this).find("strong").stop().fadeIn();
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


//商品列表页，商品划过特效
class ShopSlide{
	constructor( dls ){
		//dl集合
		this.dls = dls;
		//找到span
		this.spans = this.dls.children(".text_flag");
		//找到购物车按钮
		this.btns = this.dls.find("input");
		this.init();
	}
	init(){
		var that = this;
		this.ind = 0;
		this.dls.mouseover( function(){
			$(this).css("border","1px solid #e6133c");
			//改变对应span的状态
			that.ind = $(this).index();
			that.showSpan( that.ind );
		} ).mouseout( function(){
			$(this).css("border","1px solid #eee");
			that.hideSpan( that.ind );
		} );
	
		//改变购物车按钮的状态
		this.changeBtn();
		
	}
	changeBtn(){
		this.btns.mouseover( function(){
			$(this).css({
				"background":"#e6133c",
				"color":"#fff"
			});
		} ).mouseout( function(){
			$(this).css({
				"background":"#fff",
				"color":"#e6133c"
			});			
		} );
	}
	showSpan(ind){
		var that = this;
		this.spans.eq(ind).stop().animate({
			"z-index":0
		},2,function(){
			that.spans.eq(that.ind).animate({
				"top":"200",
				"opacity":1,
			},100);
		})
	}
	hideSpan(ind){
		this.spans.eq(ind).stop().animate({
			"top":"216",
			"opacity":0,
			"z-index":-1
		});
	}
}


class ShopFly{
	constructor( dls,end ,obj){
		//存储的数据
		this.obj = obj;
		//起点集合
		this.dls = dls;
		//按钮
		this.btns = this.dls.find("input[type=button]");
		//终点
		this.end = end;
		this.init();
	}
	init(){
		var that = this;
		this.btns.click( function(){
			//飞入效果
			var right_index = $(this).parent().parent().parent().index()+1;
			that.fly( $(this),right_index );
		} );
	}
	fly( btn,r_index ){
		var that = this;
		//终点坐标
		var end_x = this.end.offset().left;
		var end_y = this.end.offset().top;
		var dl = btn.parent().parent().parent();
		var img = dl.find("dt img");
		//起点坐标
		var x = img.offset().left;
		var y = img.offset().top;
		var w = img.outerWidth();
		var h = img.outerHeight();
		
		var a = img.parent();
		var newImg = img.clone(true);
		newImg.css({
			"position":"absolute",
			"left":x,
			"top":y,
			"width":w,
			"height":h
		}).animate({
			"left":end_x,
			"top":end_y+60,
			"width":12,
			"height":12
		},500,function(){
			newImg.remove();
			//设置cookie 参数name value data
			var my_index = dl.get(0).dataset.id;
			//获取到数组中的下标

			//设置购买数量的cookie
			var good = getCookie("s"+my_index);
			var num = 1;
			if( good ){
				num = good.num;
				num++;
			}
			
			that.obj.forEach( function( item,index ){
				if( item.list[0].id==my_index ){
					item.list[0].num = num;
					setCookie( "s"+my_index, item.list[0],2);
					//将购买的商品显示在右侧边栏
					getShopData();
				}
			} );
			
			
		});
		$("body").append(newImg);
	}
}

class Rigth_aside_css{
	constructor( ele,btn ){
		this.ele = ele.find(".shop_box");
		this.btn = btn;
		this.init();
	}
	init(){
		var btn_h = this.btn.outerHeight();
		var h5_h = this.ele.find("h5").eq(0).outerHeight();
		var h = $(window).outerHeight();
		this.ele.css({
			"height":h,
			"background":"#fff"
		});
		this.ele.css({
			"max-height":h-btn_h-h5_h-40,
			"overflow-y":"auto"
		});
	}
}



//右侧栏的JS代码
function getShopData(){
	var box = $(".shop_box");
	box.html("");
	var totalNum = 0;
	var resArr = [];//注意排序数组置空
	getCookieAll(/^s\d/,function(key,value){
		if( value ){
			var obj = value;
			//将数据放大数组中进行排序
			resArr.push( obj );
			
			var r_arr = resArr.sort( function( a,b ){
				return 	a.id-b.id;
			} );
			

			//获取购买的数量 通过cookie设置的
			totalNum += value.num;//购买商品的总数
			if( totalNum!=0 ){
				$(".r_aside em").eq(0).css("display","block");
			}
			$(".r_aside em").eq(0).text(totalNum);
			$(".n_t_r_text span").text( totalNum );
		}

	});
	setShopList( resArr);
}

function setShopList( resArr ){
	var str = ``;
	var t = 0;
	var t_price = 0;
	resArr.forEach( function( json,index ){
		str += `
			<div class = "shop_list">
				<div class="car_l">
					<img src="list/${json.src}" alt="" />
				</div>
				<div class="car_c">
					<p>${json.name}</p>
					<p>${json.size}</p>
					<p class = "p_and_num"><span>${json.price}元</span>×<b>${json.num}</b></p>
					<div class = "sub_btn" data-id="${json.id}">
						<div><i class = "add"></i><span>${json.num}</span><i class = "sub"></i></div>
						<div class = "del_btn"></div>
					</div>
				</div>
				<div class="car_r">
					<p>${json.price*json.num}元</p>
				</div>
			</div>			
		`;	
		t += json.num;
		t_price += json.price*json.num;
});
	$(".shop_btn").find("i").text( t );
	$(".shop_btn").find("span").text( t_price+" 元" );
	var box = $(".shop_box");
	box.html(str);
	
	//在右侧弹出窗口改变商品数量 +
	$(".add").click( function(){
		//祖级
		var box = $(this).parent().parent();
		var ind = box.get(0).dataset.id;
		//获取cookie中的商品数量var good = getCookie("s"+my_index);
		var good = getCookie("s"+ind);
		var num = 0;
		if( good ){
			num = good.num;
			num++;
		}
		
		//过滤出右侧点击的是哪个商品
		var item = resArr.filter( function( a ){
			return a.id==ind;
		} );
		item[0].num = num;
		setCookie("s"+ind,item[0],1);
		getShopData();
	} );
	//在右侧弹出窗口改变商品数量 -
	$(".sub").click( function(){
		//祖级
		var box = $(this).parent().parent();
		var ind = box.get(0).dataset.id;

		//获取cookie中的商品数量var good = getCookie("s"+my_index);
		var good = getCookie("s"+ind);
		var num = 0;
		if( good ){
			if( good.num<1 ){
				$(this).parent().parent().parent().parent().remove();
				//cookie中删除
				removeCookie("s"+ind);
				return;
			}else{
				num = good.num;
				num--;	
			}
			
		}
		
		//过滤出右侧点击的是哪个商品
		var item = resArr.filter( function( a ){
			return a.id==ind;
		} );
		
		item[0].num = num;
		console.log( item[0] );
		setCookie("s"+ind,item[0],1);
		getShopData();
	} );	
	
	//删除右侧商品的按钮
	$(".del_btn").click( function(){
		//祖级
		var box = $(this).parent();
		var div = box.parent().parent();
		var ind = box.get(0).dataset.id;
		console.log( "s"+ind );
		//删除
		div.remove();
		removeCookie("s"+ind);
		
	} );
}







//调用
new Aside( $(".nav_li .aside"),$(".nav_li .aside_shop>li") );//f_h_left
new Aside( $(".f_h_left .btn_ul"),$(".f_h_left .aside_shop>li") );	

//右侧菜单黑色条
new Right_aside( $(".r_aside>ul") );
new Rigth_aside_css( $(".r_aside>ol"),$(".shop_btn") );

//右侧菜单点击收回 true是显示  false是隐藏
new Right_hide( $(".r_aside ol li").eq(0).find("h5"),$(".r_aside").eq(0),false);
new Right_hide( $(".r_aside ol li").eq(1).find("h5 i"),$(".r_aside").eq(0),false );
new Right_hide( $(".header").eq(0),$(".r_aside").eq(0),false);
new Right_hide( $(".header"),$(".r_aside").eq(0),false );
new Right_hide( $(".ad"),$(".r_aside").eq(0),false );
new Right_hide( $(".screening"),$(".r_aside").eq(0),false );
new Right_hide( $(".footer"),$(".r_aside").eq(0),false );
new Right_hide( $(".you_like").eq(0),$(".r_aside").eq(0),false );
//	new Right_hide( $(".r_aside ul li").eq(0),$(".r_aside").eq(0),true );
$(".r_aside ul li").each( function(ind,item){
	new Right_hide( $(item),$(".r_aside"),true);
} );

//右侧菜单的切换
new Right_toggle( $(".r_aside").children("ul"),$(".r_aside").children("ol") );





//商品详情页放大镜
class Glass{
	constructor( ele ){
		this.ele = ele;
		//小镜子盒子
		this.s_box = this.ele.find(".g_l_top");
		//小镜子
		this.s_glass= this.ele.find(".glass");
		//大镜子盒子
		this.b_box = this.ele.find(".big_img");
		//大镜子
		this.b_glass = this.ele.find(".big_img>div");
		
		this.init();
	}
	init(){
		this.move();
		this.out();
	}
	move(){
		this.s_box.mousemove( (e)=>{
			this.s_glass.stop().fadeIn(200);
			this.b_box.css("display","block");
			this.x = e.clientX;
			this.y = e.clientY;
			var resX = this.x-this.s_glass.outerWidth()/2-this.s_box.offset().left;
			var resY = this.y-this.s_glass.outerHeight()/2+$(window).scrollTop()-this.s_box.offset().top;
			var minX = 0;
			var minY = 0;
			var maxX = this.s_box.outerWidth()-this.s_glass.outerWidth();
			var maxY = this.s_box.outerHeight()-this.s_glass.outerHeight();
			if( resX<minX ) resX = minX;
			if( resY<minY ) resY = minY;
			if( resX>maxX ) resX = maxX;
			if( resY>maxY ) resY = maxY;
			this.s_glass.css({
				"left":resX,
				"top":resY
			});
			this.b_glass.css({
				"left":-resX*2,
				"top":-resY*2
			});
		} );
	}
	out(){
		this.s_box.mouseout( (e)=>{
			this.s_glass.stop().fadeOut(200);
			this.b_box.css("display","none");
			this.s_box.off( "mousemove" );
		} ).mouseover( ()=>{
			this.move();
		} );
	}
}



//放大镜下部图片区域
class GlassImg{
	constructor( ele ){
		this.ele = ele;
		//下部图片box
		this.box = this.ele.find(".s_img_box");
		//下部图片的真正容器
		this.r_box = this.ele.find(".s_img_box>ul");
		//ul中li
		this.lis = this.ele.find(".s_img_box>ul li");
		//左滚动按钮
		this.pre = this.ele.find(".g_l_left_btn");
		//右滚动按钮
		this.next = this.ele.find(".g_l_right_btn");
		this.l = 0;
		this.init();
	}
	init(){
		$(document).mousemove( ()=> false );
		//重新设置ul的宽度
		this.w = this.lis.outerWidth()+10;
		var len = this.lis.length;
		this.res = this.w*len;
		this.r_box.css("width",this.res);
		this.moveLeft();
		this.moveRight();
	}
	moveLeft(){
		this.next.click( ()=>{
			this.l += this.w;
			//当box向左
			//长宽度-短宽度
			var res = this.r_box.outerWidth()-this.box.outerWidth()+8;
			if( Math.abs(this.r_box.position().left) >=  Math.abs(res) ){
				this.l = res;//offset().left是相对视窗的偏移，与原生不同
				this.r_box.css("left",-(this.l));
			}else{
				this.r_box.stop().animate({
					"left":-this.l
				},150);	
			}
		} );
	}
	moveRight(){
		this.pre.click( ()=>{
			this.l -= this.w;
			//当box向左
			//长宽度-短宽度
			var res = this.r_box.outerWidth()-this.box.outerWidth()+8;
			if( this.r_box.position().left >=  0 ){
				this.l = 0;//offset().left是相对视窗的偏移，与原生不同
				this.r_box.css("left",0);
			}else{
				this.r_box.stop().animate({
					"left":-this.l
				},150);				
			}
		} );		
	}
}



//点击小图片，对应的大图片也切换
class TabImg{
	constructor( ele,big,b_big ){
		this.ele = ele;
		this.big = big;
		this.b_big = b_big;
		//小图片
		this.imgs = this.ele.find("li a img");
		this.init();
	}
	init(){
		this.imgClick();
	}
	imgClick(){
		var that = this;
		this.imgs.click( function(){
			//将大图片的src替换
			var s_src = $(this).attr("src");
			that.big.attr("src",s_src);
			//将放大镜的图片也替换
			that.b_big.attr("src",s_src);
		} );
	}
}


//商品详情页面，加入购物车
class ShopBtn{
	constructor( btn,obj ){
		this.btn = btn;
		this.obj = obj;
		this.init();
	}
	init(){
		this.btnClick();
		this.addFn();
		this.subFn();
	}
	btnClick(){
		var that = this;
		this.btn.click( function(){
			//创建一个小球 
			//小球的x,y
			var btn_this = $(this);
			var x = $(this).offset().left+64;
			var y = $(this).offset().top+4;
			//目标坐标
			var target = $("#shop_car");
			var targetX = target.offset().left;
			var targetY = target.offset().top+150;
			var c = $(`<div></div>`);
			c.css({
				"position":"absolute",
				"width":40,
				"height":40,
				"background":"#ec595c",
				"border-radius":"50%",
				"left":x,
				"top":y
			});
			$("html").append(c);
			pao( c.get(0),targetX,targetY,function(){
				
			} );
			c.animate({
				"width":20,
				"height":20
			},function(){
				c.remove();
				//数量添加后需要调用getShopData();
				var ID = btn_this.parent().get(0).dataset.id;
				that.changeNum(ID);
			});
		} );
	}
	changeNum(ID){
		//找到购买数量的input
		var inp = this.btn.parent().prev().find(".tt_num").val();
		console.log( inp );
		//数量添加后需要调用getShopData();
		var good = getCookie("s"+ID);
		var num = 1;
		if( good ){
			num = good.num;
			num += parseInt(inp);
			good.num = num;
		}
		this.obj.num = num;
		
		setCookie("s"+ID,this.obj,1);
		getShopData();
	}
	addFn(){
		//找到购买数量的input
		var add = this.btn.parent().prev().find("#add");
		var sub = this.btn.parent().prev().find("#sub");
		var inp = this.btn.parent().prev().find(".tt_num");
		add.click( function(){
			$(this).removeClass();
			sub.addClass("active");
			var t = parseInt(inp.val());
			inp.val(t+1);
		} );
	}
	subFn(){
		//找到购买数量的input
		var add = this.btn.parent().prev().find("#add");
		var sub = this.btn.parent().prev().find("#sub");
		var inp = this.btn.parent().prev().find(".tt_num");
		sub.click( function(){
			$(this).removeClass();
			add.addClass("active");
			var t = parseInt(inp.val());
			if( t<=0 ){
				t = 1;
			}
			inp.val(t-1);
		} );		
	}
}

//倒计时
class FixTime{
	constructor( ele,startTime ){
		this.ele = ele;
		this.startTime = startTime;
		this.init();
	}
	init(){
		this.start();
	}
	start(){
		var that = this;
		var s = new Date( this.startTime );//开始时间
		this.timer = setInterval( ()=>{
			var d = new Date();
			var time = s-d;
			var day = parseInt( time / 1000 / 60 / 60 / 24);
			var hour = parseInt(time / 1000 / 60 / 60 % 24);
			var minute = parseInt(time / 1000 / 60 % 60);
			var seconds = parseInt(time / 1000 % 60);
			//距离活动结束还有：<i>11</i>天<i>14</i>小时<i>49</i>分<i>42</i>秒
			that.ele.html(`距离活动结束还有：<i>${day}</i>天<i>${hour}</i>小时<i>${minute}</i>分<i>${seconds}</i>秒`);
			if( day<=0 && minute<=0 && hour<=0 && seconds<=0 ){
				clearInterval( that.timer );
				that.ele.html(`活动已结束!`);
			}
		},200);
	}
}

//顾客也会购买
class OtherShop{
	constructor( o_btn ){
		//按钮外部的div
		this.o_btn = o_btn;
		//向前
		this.pre = this.o_btn.find(".o_btn_pre");
		//向后
		this.next = this.o_btn.find(".o_btn_next");
		//内容区域
		this.box = this.o_btn.next(".o_box");
		//内容区域
		this.ul = this.o_btn.next(".o_box").find("ul");
		this.lis = this.ul.find("li");
		//总页数
		this.page = this.o_btn.find(".o_btn_text em");
		//当前页码
		this.now = this.o_btn.find(".o_btn_text i");
		//box的跨度
		this.w = this.box.outerWidth();
		this.init();
	}
	init(){
		//重置ul的宽度
		var w = $(this.lis[0]).outerWidth()*this.lis.length+14*this.lis.length;
		this.ul.css("width",w);
		this.preFn();
		this.nextFn();
	}
	preFn(){
		this.pre.click( ()=>{
			//改变当前页码
			var t = parseInt(this.now.text());
			t= t-1;
			if( t<=1 ){
				t = 1;
			}
			this.now.text(t);	
			this.move( "pre",t-1 );		
		} );		
	}
	nextFn(){
		this.next.click(()=>{
			//改变当前页码
			var t = parseInt(this.now.text());
			t= t+1;
			var p = parseInt(this.page.text());
			if( t>=p ){
				t = p;
			}
			this.now.text(t);
			this.move( "next",t-1 );
		});
	}
	move(str,t){
		if( str=="next" ){
			//ul向左移动
			var w = this.w+14;
			this.ul.stop().animate({
				"left":-w*t+6
			});
		}else if( str == "pre" ){
			//ul向右移动
			var w = this.w+14;
			this.ul.stop().animate({
				"left":-w*t
			});			
		}
	}
}


//下部商品介绍、参数与包装、售后服务等分页
class DesBtn{
	constructor( ele,content ){
		this.ele = ele;
		this.content = content;
		this.c_lis = this.content.find("li");
		//按钮li
		this.lis = this.ele.find("li");
		this.init();
	}
	init(){
		this.btnClick();
	}
	btnClick(){
		var that = this;
		this.lis.click( function(){
			that.lis.removeClass("active");
			$(this).addClass("active");
			var ind = $(this).index();
			//显示对应的内容
			that.c_lis.removeClass("active");
			that.c_lis.eq(ind).addClass("active");
		} );
	}
}

new DesBtn( $(".s_c_r_btn"),$(".s_c_r_content") );









//评价内容的加载
class PingContent{
	constructor( ele,arr){
		this.ele = ele;
		this.arr = arr;//数据数组
		//页码容器
		this.page_box = this.ele.parent().find(".p_j_num");
		//上一页按钮
		this.pre_btn = this.ele.parent().find(".pre");
		//下一页按钮
		this.next_btn = this.ele.parent().find(".next");
		//内容容器
		this.content_box = this.ele.find(".p_c_box");
		this.page = 4;//一页展示4条数据
		this.now = 1;//当前页面
		this.init();
	}
	init(){
		this.show();
		//生成页码
		this.setPage();	
	}
	show(){
		var that = this;
		var str = ``;
		this.len = this.arr.length;
		$(".x_q").text( this.len );
		//一共多少页面
		this.p_num = Math.ceil(this.len/this.page);
		this.page_str = ``;
		this.num = 0;
		for( var e=(this.now-1)*this.page;e<(this.now*this.page);e++ ){
			var obj = this.arr[e];
			if( obj ){
				var b_str = ``;
				var zanNum = ``;
				for( var i=0;i<obj.start;i++ ){
					b_str += `<b></b>`;
				}
				str += `
					<div class = "clearfix">
						<div class="p_c_b_left">
							<div><img src="./img/v4-face.png" alt = ""/></div>
							<p>${obj.name}</p>
						</div>
						<div class="p_c_b_right">
							<div>
								${b_str}
							</div>
							<p>${obj.content}</p>
						</div>
						<div class = "finger"><i></i>${obj.zan}</div>
						<div class = "f_time">${obj.time}</div>
					</div>			
				`;
				that.content_box.html(str);
							
			}
		}
	}
	setPage(){
		//this.page_box页码容器
		//一页显示多少条数据 this.page
		//当前页码 this.now
		var that = this;
		for( var i=0;i<this.p_num;i++){
			this.num++;
			this.page_str += `<a>${this.num}</a>`;
			this.page_box.html( this.page_str );
		}
		//默认第一个页码亮
		that.page_box.find("a:eq(0)").addClass("active");
		//点击页码进行跳转
		//利用事件委托
		this.page_box.on("click","a",function(e){
			var ele = e.target;
			that.now = parseInt($(ele).text());
			that.show();
			//通过父级来设置
			var p = $(ele).parent();
			p.find("a").removeClass("active");
			p.find("a").eq(that.now-1).addClass("active");
		});
		//下一页
		this.next_btn.click( function(){
			that.now++;
			if( that.now>=that.p_num ){
				that.now = that.p_num;
			}
			var pageBox = $(this).parent().children(".p_j_num").find("a");
			pageBox.removeClass("active");
			pageBox.eq(that.now-1).addClass("active");
			that.show();
		} );
		this.pre_btn.click( function(){
			that.now--;
			if( that.now<=1 ){
				that.now = 1;
			}
			var pageBox = $(this).parent().children(".p_j_num").find("a");
			pageBox.removeClass("active");
			pageBox.eq(that.now-1).addClass("active");
			that.show();
		} );
	}
}



//详情页面的吸顶效果
class ShowTop{
	constructor( ele ){
		this.ele = ele;
		//二维码按钮
		this.er = this.ele.find(".phone_buy");
		this.btn_w = 0;
		this.init();
	}
	init(){
		this.fix();
	}
	fix(){
		//计算何时进行吸顶
		//元素正常的left 和 top
		var l = this.ele.offset().left;
		var t = this.ele.offset().top;
		var that = this;
		$(window).scroll( function(){
			//计算屏幕滚动的距离
			var win_scroll = $(document).scrollTop();
			if( win_scroll>t ){
				that.ele.css({
					"left":l,
					"top":0,
					"position":"fixed",
					"z-index":12
				});
				//创建左侧商品价格、购物车按钮
				that.showShop(l);
				//调整二维码按钮的位置
				that.er.css("right",150);
			}else{
				that.ele.css({
					"position":"relative",
					"left":0,
					"top":0
				});	
				
				//隐藏左侧商品价格、购物车按钮
				that.hideShop(0);
				//调整二维码按钮的位置
				that.er.css("right",0);
			}
		} );
	}
	showShop(x){
		//显示左侧商品价格按钮
		var w = x-$(".s_top").outerWidth();
		$(".s_top").css("left",w).show();
		//显示左侧购物车按钮
		this.btn_w = x+this.ele.outerWidth()-130;
		console.log( $(".addShop").outerWidth() );
		$(".addShop").css({
			"position":"fixed",
			"left":this.btn_w,
			"width":120,
			"height":36,
			"top":10
		});
		$(".addShop").addClass("s_top_btn");
	}
	hideShop(x){
		$(".s_top").hide();
		$(".addShop").removeClass("s_top_btn").css({
			"position":"relative",
			"left":0,
			"width":168,
			"height":50,
			"top":0
		})
	}
}


getShowPage();
getOtherData();//加载其他顾客喜欢  的数据
getPingData();//加载评价数据
})
