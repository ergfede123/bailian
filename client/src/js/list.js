//import $ from "jquery";
//import {setCookie,getCookie,getCookieAll,removeCookie,removeCookieAll} from "./cookie.js";
$(function(){
	//加载数据
	var now = 1; //当前页码
	var show_num = 10;
	var url = "data.json";
	var tiao_jian = "price";
	//加载cookie
	getShopData();
	function getShopData(){
		var box = $(".shop_box");
		box.html("");
		var totalNum = 0;
		var resArr = [];//注意排序数组置空
		getCookieAll(/^s{1,}/,function(key,value){
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
			var num = 1;
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
	
	$(".l_btns li").eq(1).click( function(){
		$(".l_btns li a").css({
			"border":"1px solid #999999",
			"background":"#f8f8f8",
			"color":"#999999",
			"height":"36px"
		});
		$(this).find("a").css({
			"border":"none",
			"background":"#c01133",
			"color":"#fff",
			"height":"38px"
		});
		tiao_jian = "xiaoliang";
		getSortData( url,tiao_jian );//按照销量排序
	} );
	$(".l_btns li").eq(2).click( function(){
		$(".l_btns li a").css({
			"border":"1px solid #999999",
			"background":"#f8f8f8",
			"color":"#999999",
			"height":"36px"
		});
		$(this).find("a").css({
			"border":"none",
			"background":"#c01133",
			"color":"#fff",
			"height":"38px"
		});
		tiao_jian = "price"; 
		getSortData( url,tiao_jian );//按照价格排序
	} );
	$(".l_btns li").eq(3).click( function(){
		$(".l_btns li a").css({
			"border":"1px solid #999999",
			"background":"#f8f8f8",
			"color":"#999999",
			"height":"36px"
		});
		$(this).find("a").css({
			"border":"none",
			"background":"#c01133",
			"color":"#fff",
			"height":"38px"
		});		
		tiao_jian = "pinglun"; 
		getSortData( url,tiao_jian );//按照评论排序
	} );
	getSortData( url,"price" );//1代表当前页  10代表一页显示多少条数据
	
	//查询功能,前端模拟
	var search_box = $(".search_box_top").children("input[type=text]");
	var search_btn = $(".search_box_top").children("input[type=button]");
	search_btn.click( function(){
		url = "data1.json";
		getSortData(url,"price");	
	} );
	$(document).keyup( function(e){
		var str = search_box.val();
	
		if( e.keyCode==13 ){
			url = "data1.json";
			getSortData(url,"price");
		}
	} );
	
	function  getSortData(url,t_j){
		var arr = [];
		$.get( url,function( obj ){
			var values = Object.values( obj );
	
			values.sort( function(a,b){
				return parseInt(b.list[0][t_j]) - parseInt(a.list[0][t_j]);
			} );
			var str = ``;
	
			getData(url,values,str);
		} );
	}
	
	function getData(url,values,str){
		var s_arr = [];//按照条件排序
	
			//求出有多少条数据
			var obj_keys = values;
			var total = obj_keys.length;
			//总页数
			var num = Math.ceil(total/show_num);
			//上一页 和 下一页的界限值
			if( now>=num ){
				now = num;
			}else if( now<=1 ){
				now = 1;
			}
			
			var obj_arr =  values;
			
			//前端控制页码 now是当前页码  show_num是一页显示多少条数据
	
			$(".shop_c").html("");
			for( var i=(now-1)*show_num;i<now*show_num;i++ ){//前端控制页码核心代码
				if( i>=total ){
					break;
				}
				var res = obj_arr[i].list;//数组[{}]
				var len = res[0].special.length;
				var s = ``;
				
				for( var j=0;j<len;j++ ){
					s += `
						<span>${res[0].special[j]}</span>
					`;
				}
				if( !res[0].shangou ){
					str += `
						<dl data-id="${res[0].id}">
							<div class = "text_flag">${s}</div>
							<dt>
								<a class = "go_text"><img src="list/${res[0].src}" alt="" /></a>
							</dt>
							<dd>
								<p><a>${res[0].price}元</a></p>
								<p><a>${res[0].des}</p>
								<p class = "go_text"><a>iphone8,现更以红色呈现</a></p>
								<p><a>在<span>手机</span>中<span>畅销</span></a></p>
								<p><a>百联自营</a></p>
								<div>
									<input type="button" value = "加入购物车" />
								</div> 
							</dd>
						</dl>				
					`;
				}else{
					str += `
						<dl data-id="${res[0].id}">
							<div class = "text_flag">${s}</div>
							<div class = "shangou"><img src = "list/${res[0].shangou}" /></div>
							<dt>
								<a class = "go_text"><img src="list/${res[0].src}" alt="" /></a>
							</dt>
							<dd>
								<p><a>${res[0].price}元</a></p>
								<p><a>${res[0].des}</p>
								<p class = "go_text"><a>iphone8,现更以红色呈现</a></p>
								<p><a>在<span>手机</span>中<span>畅销</span></a></p>
								<p><a>百联自营</a></p>
								<div>
									<input type="button" value = "加入购物车" />
								</div> 
							</dd>
						</dl>				
					`;				
				}
				
			}
			
			
			$(".shop_c").append( str );
			//为每件商品添加点击事件
			
			//添加鼠标划过商品的效果
			new ShopSlide( $(".shop_c").find("dl") );
			//创建页码
			createPageNum(total);
			
			//购物车，商品飞入效果
			//商品终点
			var target = $(".r_aside ul:eq(0)").children("li").eq(1);
			//商品起点集合
			var start = $(".shop_c dl");
			new ShopFly( start,target,obj_arr );
	}

	
	//事件委托完成页面跳转，跳转到详情页面
	$(".shop_c").on("click"," .go_text",function(){
		var dl = $(this).parent().parent();
		var ID = dl.get(0).dataset.id;
		localStorage.setItem("g",ID);
		console.log( ID );
		location.href = "show.html";
	});
	
	//加载数据结束
	function createPageNum(t){
		//t是总共多少条数据
		//p是一页显示多少条数据
		var len = Math.ceil(t/show_num);
		var str = ``;
		$(".page_num").html("");
		for( var i=1;i<=len;i++ ){
			str += `
				<a>${i}</a>
			`;
		}
		
		var pre = `
			<a>上一页</a>
		`;
		var next = `
			<a>下一页</a>
		`;
		$(".page_num").prepend( pre );
		$(".page_num").append( str );
		$(".page_num").append( next );
		//为对应的页面添加样式,不在此处添加会出问题，需注意
		$(".page_num a").eq(now).addClass("active");
	}
	
	//使用事件委托写页码跳转
	$(".page_num").on("click","a",function(){
	 	var ind = $(this).index();
	 	if( $(this).text()=="上一页" ){
	 		preFn();
	 	}else if( $(this).text()=="下一页"   ){
			nextFn();
	 	}else{
	 		now = $(this).text();
			getSortData( url,tiao_jian );
	
	 	}
		return false;
	});
	
	
	function preFn(){
		now--;
	 	getSortData( url,tiao_jian );	
	}
	
	
	function nextFn(){
		now++;
		getSortData( url,tiao_jian );		
	}
	
	$(".next_btn").click( function(){
		nextFn();	
	} );
//筛选项，品牌的显示与收起
class Pinpai{
	constructor( ele,nor ){
		this.ele = ele;
		this.btnsP = this.ele.find(".pin_btns li");
		this.btns = this.ele.find(".pin_btns a");
		//input按钮
		this.inputs = this.ele.find(".pinBtns input");
		this.contents1 = this.ele.find(".pin_imgs li");
		//多选按钮
		this.duo = this.ele.parent().find(".se_btn");
		//显示选择了几个选项的多选checkbox
		this.c_box = this.ele.find(".selected_box");
		//默认隐藏的dd
		this.pre = this.ele.prev(".pin_nor");
		
		//默认显示的第一筛选项
		this.nor = nor;

		this.init();
	}
	init(){
		//多选按钮点击展开/收缩
		$(document).mousemove( function(){
			return false;
		} );
		this.duoFn();
		//多选点开后的选项卡
		this.tab();
		//确认按钮效果
		this.btnsFn();
		//取消按钮
		this.calBtnFn();
		//默认第一筛选项的点击事件
		this.norClick();
	}
	norClick(){
		var that = this;
		//pin_nor_active

		this.nor.children("li").click( function(){
			that.nor.find("li").removeClass("pin_nor_active");
			$(this).addClass("pin_nor_active");
			//默认选项选中的内容改变后，切换到第二种状态也要改变
			var nor_text = $(this).find("i").text();
			//遍历第二状态的字段是否与之匹配
			var arr = Array.from( that.contents1.find("a") );
			for( var i=0;i<arr.length;i++ ){
				/*
				var t = $(arr[i]).find("i").text();
				if( t==nor_text ){
					$(arr[i]).addClass("a_active");
					//防止重复添加
					//判断checkbox中有没有此选项

					if( that.check_span(nor_text) ){
						break;
					}else{
						var label = $(`<label><input type="checkbox" checked /><span>${nor_text}</span></label>`);					
						that.c_box.append( label );	
						break;						
					}
				}
				*/
			}
			
			if( !that.c_box.find("input").eq(0).get(0) ){
				that.c_box.css("display","none");
			}else{
				that.c_box.css("display","block");
			}
			that.contents1.find("a").unbind("click");//坑，JQ的点击事件会叠加，需要在函数入口之前先解除事件的绑定
			that.img_btnFn();
		} );
	}
	check_span(str){
		var that = this;
		var span_arr = Array.from(that.c_box.find("span"));
		for( var j = 0;j<span_arr.length;j++ ){
			if( $(span_arr[j]).text()==str ){
				console.log($(span_arr[j]).text()+"--"+str)
				return true;
				break;
			}else{
				return false;
			}
		}		
	}
	calBtnFn(){
		var that = this;
		var b_tn = this.inputs.eq(1);
		b_tn.click( function(){
			if( that.pre.css("display")=="block" ){
				//变为多选
				that.pre.css("display","none");
				that.ele.css("display","block");
				//变为多选之后的的图片按钮
				that.contents1.find("a").off("click");//坑，JQ的点击事件会叠加，需要在函数入口之前先解除事件的绑定
				that.img_btnFn();
			}else if(that.pre.css("display")=="none"){
				//变为单选
				that.pre.css("display","block");
				that.ele.css("display","none");				
			}
		} );
	}
	btnsFn(){
		var that = this;
		if( !that.c_box.find("input").eq(0).get(0) ){
			 that.c_box.css("display","none");
			 that.inputs.eq(0).css({
				"background":"#eee",
				"color":"#999",
				"border":"1px solid #ccc"
			});
		}else{
			that.c_box.css("display","block");
			that.inputs.eq(0).css({
				"background":"rgb(152, 113, 68)",
				"border":"1px solid rgb(152, 113, 68)",
				"color":"rgb(255, 255, 255)"
			});

		}		
	}
	tab(){
		var that = this;
		this.btns.click( function(){
			var ind = $(this).parent().index();
			//隐藏全部的图片内容
			that.contents1.removeClass("active");
			that.contents1.eq(ind).addClass("active");
			that.btnsP.removeClass("active");
			$(this).parent().addClass("active");
		} );
	}
	duoFn(){
		var that = this;
		this.duo.click( function(){
			if( that.pre.css("display")=="block" ){
				//变为多选
				that.pre.css("display","none");
				that.ele.css("display","block");
				//变为多选之后的的图片按钮
				that.contents1.find("a").unbind("click");//坑，JQ的点击事件会叠加，需要在函数入口之前先解除事件的绑定
				that.img_btnFn();
			}else if(that.pre.css("display")=="none"){
				//变为单选
				that.pre.css("display","block");
				that.ele.css("display","none");				
			}
			
			return false;
		} );
	}
	img_btnFn(){

		//坑，JQ的点击事件会叠加，需要在函数入口之前先解除事件的绑定
		var that = this;
		var as = this.contents1.find("a");
		as.click( function(){
			if( $(this).hasClass("a_active") ){
				//获取到要删除的项目
				//获取当前点击的按钮的内容
				var btn_t = $(this).find("i").text();
				that.c_box.find("label span").each( function(ind,item){
					var t = $(item).text();
					if( btn_t==t ){
						$(item).parent().remove();
						//删除所有含有此字段的选项
						var delArr = Array.from( that.contents1.find(".a_active") );
						for( var i=0;i<delArr.length;i++ ){
							//delArr[i]是a标签
							var $a = $(delArr[i]);
							if( $a.find("i").text()==t ){
								$a.removeClass("a_active");
							}
						}
					}

				} );
			}else if( !$(this).hasClass("a_active") ){
//				that.c_box.html(`<label>已选品牌：</label>`)
				$(this).addClass("a_active");
				var tex = $(this).find("i").text();
				//已经选上了
				//防止重复添加
				var box_text = that.c_box.find("label span");
				if( that.c_box.find("span").length>0  ){
					var arr = Array.from(that.c_box.find("span"));
					for( var i=0;i<arr.length;i++ ){
						var arr_text = $(arr[i]).text();
						if( arr_text==tex ){
							break;
						}else if(i==arr.length-1){
							var label = $(`<label><input type="checkbox" checked /><span>${tex}</span></label>`);
							that.c_box.append( label );		
						}
					}

				}else{
					//什么也不存在直接添加
					var label = $(`<label><input type="checkbox" checked /><span>${tex}</span></label>`);
					that.c_box.append( label );
				}
				

				//找到已经选中的a标签
				that.contents1.find(".a_active").each( function( ind,item ){
					var t = $(item).text();
					
					var newArr = Array.from( that.contents1.find("a") );
					for( var i=0;i<newArr.length;i++ ){
						if( $(newArr[i]).find("i").text()==t ){
							$(newArr[i]).addClass("a_active");
						}
					}
				} );
				
			}//品牌筛选逻辑结束
			if( !that.c_box.find("input").eq(0).get(0) ){
				that.c_box.css("display","none");
			}else{
				that.c_box.css("display","block");
			}			
			
			that.btnsFn();
			
		} );
		
		//利用 事件委托，点击动态生成的input
		var that = this;
		this.c_box.on("click","input",function(){
			if( !$(this).is(":checked") ){
				//取消了 选中,获取到内容
				var t = $(this).next("span").text();
				var $that = $(this);
				var delArr = Array.from( that.contents1.find(".a_active") );
				for( var i=0;i<delArr.length;i++ ){
					//delArr[i]是a标签
					var $a = $(delArr[i]);
					if( $a.find("i").text()==t ){
						$a.removeClass("a_active");
						$that.parent().remove();
					}
					//input删光了 就把div删除掉

					that.btnsFn();
				}				
			}
		});
		//利用 事件委托结束

		
		
		
	}
}
//调用第一个复杂筛选项
new Pinpai( $(".s_content .pin"),$(".pin_nor ul") );


//页面跳转
$(".go_shop").click( function(){
	location.href = "shopping.html";
} );


//筛选项，除品牌外的筛选项 商品列表页面ES6
class Screening{
	constructor( ele ){
		this.ele = ele;
		this.btns = this.ele.find(".se_btn");
		this.contents1 = this.ele.find(".nor");
		this.contents2 = this.ele.find(".duo");
		//取消按钮
		this.cacelBtn = this.ele.find(".d_btns input:eq(1)");
		//确定按钮
		this.right_btns = this.ele.find(".d_btns input:eq(0)");
		//找到各个checkbox
		this.c_boxs = this.ele.find(".duo input[type=checkbox]")
		
		this.init();
	}
	init(){
		this.cacel();
		this.btnClick();
		this.cacleHover();
		this.c_boxFn();
	}
	c_boxFn(){
		var that = this;
		this.c_boxs.click( function(){
			var btn = $(this).parent().parent().parent().next(".d_btns").find("input").eq(0);
			var d_class = $(this).parent().parent().parent().find("input");
			if( $(this).is(":checked") ){
				//确定按钮变色
				btn.css({
					"border":"1px solid #987144",
					"background":"#987144",
					"color":"#FFF"
				});
				btn.mouseover( function(){
					$(this).css({
						"background":"#d5af82",
						"border":"1px solid #d5af82",
						"color":"#FFF"	
					});
				} ).mouseout( function(){
					$(this).css({
						"border":"1px solid #987144",
						"background":"#987144",
						"color":"#FFF"						
					});
				} );
			}else if( !d_class.is(":checked") ){
				btn.css({
					"border":"1px solid #ccc",
					"background":"#eee",
					"color":"#999"
				});				
				btn.mouseover( function(){
					$(this).css({
						"border":"1px solid #ccc",
						"background":"#eee",
						"color":"#999"
					});
				} ).mouseout( function(){
					$(this).css({
						"border":"1px solid #ccc",
						"background":"#eee",
						"color":"#999"					
					});
				} );
			}
		} );
	}
	btnClick(){
		var that = this;
		this.btns.click( function(){
			var ind = $(this).parent().index();
			if( that.contents1.eq(ind-1).css("display")=="block" ){
				that.contents1.eq(ind-1).hide();
				that.contents2.eq(ind-1).show();				
			}else{
				that.contents2.eq(ind-1).hide();
				that.contents1.eq(ind-1).show();				
			}
			return false;
		} );		
	}
	cacel(){
		var that = this;
		this.cacelBtn.click( function(){
			var ind = $(this).parent().parent().parent().index();
				that.contents2.eq(ind-1).hide();
				that.contents1.eq(ind-1).show();			
		} );
	}
	cacleHover(){
		this.cacelBtn.mouseover( function(){
			$(this).css({
				"color":"#000",
				"border":"1px solid #999"
			});
		} ).mouseout( function(){
			$(this).css({
				"color":"#333",
				"border":"1px solid #ccc"
			});			
		} );
	}
	
}
new Screening( $(".s_content dl").not(":eq(0)") );
//筛选项，除品牌外的筛选项

	




//ES6公共
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

})

