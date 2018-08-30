import $ from "jquery";
import {setCookie,getCookie,getCookieAll,removeCookie,removeCookieAll} from "./cookie.js";


$( function(){
getShopData();
function getShopData(){
	var str = ``;
	$(".shop_box").html("正在加载中.....").css("font-size",20);
	getCookieAll(/^s\d/,function(res,values){
		var obj = values;//这里的图片路径在list中
		if( !values ){
			console.log(123);
			$(".shop_box").html("暂无数据");

		}
		if( obj.shangou ){
			str += `
				<li  data-id = "${obj.id}">
					<div  class="s_b_left1">
						<input checked type="checkbox" />
					</div>
					<div class="s_b_left2">
						<div>
							<img src="./list/${obj.src}" alt="" />
						</div>
						<div>
							<p>${obj.des}</p>
						</div>
					</div>
					<div class="s_b_left3">
						<p>${obj.y_price}</p>
						<p>${obj.price}</p>
						<p>闪购</p>
					</div>
					<div class="s_b_left4">
						<input type="button" value = "-" />
						<span>${obj.num}</span>
						<input type="button" value = "+" />
					</div>
					<div class="s_b_left5">
						${obj.price*obj.num}.00元
					</div>
					<div class="s_b_left6">
						<a>删除</a>
					</div>
				</li>		
			`;
		}else if( !obj.shangou ){
			str += `
				<li data-id = "${obj.id}">
					<div class="s_b_left1">
						<input checked type="checkbox" />
					</div>
					<div class="s_b_left2">
						<div>
							<img src="./list/${obj.src}" alt="" />
						</div>
						<div>
							<p>${obj.des}</p>
						</div>
					</div>
					<div class="s_b_left3">
						<p>${obj.y_price}</p>
						<p>${obj.price}</p>
					</div>
					<div class="s_b_left4">
						<input type="button" value = "-" />
						<span>${obj.num}</span>
						<input type="button" value = "+" />
					</div>
					<div class="s_b_left5">
						${obj.price*obj.num}.00元
					</div>
					<div class="s_b_left6">
						<a>删除</a>
					</div>
				</li>		
			`;			
		}
		
	});	
	var inputs = $(".shop_box li input[type=checkbox]");
	inputs.prop("checked",true); 
	$(".select_all").prop("checked",true); 
	setTimeout( function(){
		if( str ){
			$(".shop_box").html(str).css("font-size",14);
			//改变底部总金额
			totalDiv();
		}else{
			$(".shop_box").html("暂无数据").css("font-size",14);
			//改变底部总金额
			totalDiv(0);
		}
		//数据加载完后 才进行
		new winScroll( $(window),$(".shop_box_bottom"),$(".shop_box li:last-child") );
	},500);
}

//事件委托，删除按钮
$(".shop_box").on("click",".s_b_left6 a",function(){
	var ID = $(this).parent().parent().get(0).dataset.id;
	var item = $(this).parent().parent();
	if( confirm("您确认要删除吗?") ){
		removeCookie("s"+ID);
		item.remove();
	}
})

//事件委托，加的按钮
$(".shop_box ").bind("click",".s_b_left4 input",function(e){
	var it = e.target;
	var ele = $(it);
	var ID = ele.parent().parent().get(0).dataset.id;
	var li = ele.parent().parent();
	var tt = 0;
	if( ele.val()=="+" ){
		//加
		var span = ele.prev("span");
		var n = parseInt(span.text());
		span.text(n+1);
		//改变页面总价
		//单价
		var d = parseInt( li.find(".s_b_left3 p:eq(1)").text() );
		//数量
		var total = parseInt( li.find(".s_b_left4 span").text() );
		li.find(".s_b_left5").text(d*total+".00元");
		
		//保存cookie
		var good = getCookie("s"+ID);
		var num = 0;
		if( good ){
			num = good.num;
		}
		good.num = num+1;
		setCookie("s"+ID,good,1);
	}else if( ele.val()=="-"  ){
		//减
		var span = ele.next("span");
		var n = parseInt(span.text());
		span.text(n-1);
		//改变页面总价
		//单价
		var d = parseInt( li.find(".s_b_left3 p:eq(1)").text() );
		//数量
		var total = parseInt( li.find(".s_b_left4 span").text() );
		li.find(".s_b_left5").text(d*total+".00元");
		if( n<1 ){
			//删除元素
			li.remove()
			//删除cookie
			removeCookie("s"+ID);
		}else{
			//保存cookie
			var good = getCookie("s"+ID);
			var n = 0;	
			if( good ){
				n = good.num;
			}
			good.num = n-1;
			setCookie("s"+ID,good,1);
		}
	}
	//改变底部总金额
	totalDiv();
});

function totalDiv(num){
	//改变底部总金额
	var totalPrice = $(".total_price");
	totalPrice.text(0);
	if( num==0 ){
		$(".s_b_b_right").find("a").removeClass();
		$(".s_b_b_right").find("a").addClass("noMoney");
		return;
	}

	var ttt = 0;
	$(".shop_box").find(".s_b_left5").each( function(ind,item){
		var t_tal = parseInt(totalPrice.text());
		ttt+=parseInt($(item).text());
		totalPrice.text( ttt+".00元" );
	} );
	
	var s = 0
	//商品总数和已经选择的商品数量
	$(".s_b_left4 span").each( function( ind,item ){
		s += parseInt( $(item).text() );
	} );
	$(".p_total").text( s );
	
	//更新已经选择的商品
	var has_s = 0;
	$(".shop_box .s_b_left1 input").each( function( ind,item ){
		if( $(item).is(":checked") ){
			has_s ++;
		}
	} );
	$(".selected_text").text(has_s);
	
	if( ttt ){
		$(".s_b_b_right").find("a").removeClass();
		$(".s_b_b_right").find("a").addClass("hasMoney");		
	}else{
		$(".s_b_b_right").find("a").removeClass();
		$(".s_b_b_right").find("a").addClass("noMoney");
	}
}
//全选按钮，事件委托
$(".select_all").click( function(){
	//找到表格中所有的checkbox,JQ的坑,对于checkbox的全选和反选要用prop,不能用attr!!!
	if( $(this).is(":checked") ){
		var inputs = $(".shop_box li input[type=checkbox]");
		inputs.prop("checked",true); 
		$(".select_all").prop("checked",true); 
	}else{
		var inputs = $(".shop_box li input[type=checkbox]");
		inputs.prop("checked", false); 
		$(".select_all").prop("checked", false); 
	}
	totalDiv();
} );

$(".del_s").click( function(){
	//删除被input选中的元素
	var inputs = $(".shop_box li input[type=checkbox]");
	if( confirm("确定要删除吗?") ){
		inputs.each( function( ind,item ){
				if( $(item).is(":checked") ){
				var li = $(item).parent().parent();
				li.remove();
				//删除cookie
				var ID = li.get(0).dataset.id;
				removeCookie("s"+ID);	
			}
		} );
		//获取当前还有多少钱未结算
		totalDiv();
	}
} );













//结算页面的的ES6
class winScroll{
	constructor( html,ele,last ){
		this.html = html;
		this.ele = ele;
		this.last = last;
		this.init();
	}
	init(){
		//窗口滚动，底部滚动条变化
		this.h_scroll();
	}
	h_scroll(){
		var that = this;
		this.html.scroll( function(){
			var h = that.html.scrollTop();
			var w_h = $(window).outerHeight();

			var res = parseInt(h+w_h);
			console.log(  );
			if( that.last ){
				var res_r = that.last.offset().top+30+that.last.outerHeight();
				var center = ($("html").outerWidth()-that.ele.outerWidth())/2;
				if( res<=res_r ){
					that.ele.css({
						"position":"fixed",
						"bottom":"0",
						"left":center
					});
				}else{
					that.ele.css({
						"position":"absolute",
						"bottom":30,
						"left":0
					});				
				}				
			}

		} );
	}
}



//



















//页面通用ES6
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
	
	
	
} )
