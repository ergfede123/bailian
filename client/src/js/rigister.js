import $ from "jquery";
$( function(){
	//用户名
	var u = $("#username");
	//密码
	var p1 = $("#pass1");
	//确认密码
	var p2 = $("#pass2");
	//手机号
	var phone = $("#phone");
	//验证码
	var check_text = $("#check_input");
	//短信验证码
	var msg_text = $("#msg_input");
	//电子邮箱
	var email = $("#email");
	//提交按钮
	var btn = $("#sub_btn");
	//同意选项
	var agr = $(".agree input").eq(0);
	
	//用户名验证
	u.blur( function(){
		var str = u.val();
		//找到对应的span
		var s = u.parent().find("b");
		var e = u.parent().find("em");
		var reg = /^\w{6,12}$/;
		if( reg.test(str) ){
			$(this).removeClass();
			s.removeClass();
			s.addClass("span_success");
			s.text("√");
			e.text("正确");
			$.post( "http://127.0.0.1:8888/myProject/server/php/r_check.php",{"username":str},function(res){
				var obj = JSON.parse( res );
				console.log( obj );
				if( obj.status==200 ){
					e.text("可以使用");
				}else if(obj.status==0){
					$(this).removeClass();
					s.removeClass();
					$(this).addClass("error");
					s.addClass("span_error");
					s.text("×");
					e.text("用户名已存在");
				}
			} );			
			
		}else{
			e.text("用户名长度只能由字母或者字母和数字组合");
			if( str.length<6 || str.length>20 ){
				e.text("用户名长度只能在6-20位字符之间");
			}
			$(this).removeClass();
			s.removeClass();
			$(this).addClass("error");
			s.addClass("span_error");
			s.text("×");
		}
	} );
	
	u.focus( function(){
		var str = u.val();
		//找到对应的span
		var s = u.parent().find("b");
		var e = u.parent().find("em");
		if( str=="" ){
			$(this).removeClass();
			s.removeClass();
			$(this).addClass("input_empty");
			s.addClass("span_empty");
			s.text("i");
			e.text("请输入用户名");
		}
	} );
	
	
	
	//用户名验证结束
	
	
	
	//密码验证
	p1.focus( function(){
		var str = p1.val();
		var s = p1.parent().find("b");
		var e = p1.parent().find("em");
		if( str=="" ){
			$(this).removeClass();
			s.removeClass();
			$(this).addClass("input_empty");
			s.addClass("span_empty");
			s.text("i");
			e.text("请输入密码");
			$(".main form div strong i").css("display","none");	
		}
	} );
	p1.blur( function(){
		var str = p1.val();
		var s = p1.parent().find("b");
		var e = p1.parent().find("em");
		var reg = /^\w{8,12}$/;
		if( str=="" ){
			$(this).removeClass();
			s.removeClass();
			$(this).addClass("error");
			s.addClass("span_error");
			s.text("×");
			e.text("请输入密码");	
			$(".main form div strong i").css("background","gray");	
		}else if( reg.test(str) ){
			$(this).removeClass();
			s.removeClass();
			s.addClass("span_success");
			s.text("√");
			e.text("正确");	
		}else{
			$(this).removeClass();
			s.removeClass();
			$(this).addClass("error");
			s.addClass("span_error");
			s.text("×");
			e.text("请输入正确的密码");	
		}
	} );
	
	p1.keyup( function(e){
		var str = p1.val();
		var s = p1.parent().find("b");
		var e = p1.parent().find("em");
		$(".main form div strong i").css("display","block");	
		var arr = [false,false,false];
		var reg = /^\w{8,12}$/;
		var keyCode = event.which;//求出keyCode
		var arr = [false,false,false,false];	
		var len = str.length;
		for(var  i=0;i<len;i++ ){
			if( str.charCodeAt(i)>=97 && str.charCodeAt(i) <=122 ){
				arr[0] = true;
			}else if( str.charCodeAt(i)>=65 && str.charCodeAt(i) <=90 ){
				arr[1] = true;
			}else if( str.charCodeAt(i)>=48 && str.charCodeAt(i) <=57 ){
				arr[2] = true;
			}else{
				arr[3] = true;
			}
		}
		var newArr = arr.filter( function( item ){
			return item;
		} );
		
		changeColor( newArr );
		
	} );
	
	function changeColor(arr){
		var color = ["red","orange","green"];
		var len = arr.length;
		if( len==1 ){
			$(".main form div strong i").css("background","gray");
			$(".main form div strong i").eq(0).css("background",color[0]);
		}else if( len==2 ){
			$(".main form div strong i").css("background","gray");
			$(".main form div strong i").eq(1).css("background",color[1]);
		}else if( len==3 ){
			$(".main form div strong i").css("background","gray");
			$(".main form div strong i").eq(2).css("background",color[2]);
		}
	}
	
	//确认密码验证
	p2.focus( function(){
		var str = p2.val();
		var s = p2.parent().find("b");
		var e = p2.parent().find("em");
		if( str=="" ){
			$(this).removeClass();
			s.removeClass();
			$(this).addClass("input_empty");
			s.addClass("span_empty");
			s.text("i");
			e.text("请再次输入密码");
		}
	} );
	
	p2.blur( function(){
		var str1 = p1.val();
		var str = p2.val();
		var s = p2.parent().find("b");
		var e = p2.parent().find("em");
		if( str == str1 ){
			$(this).removeClass();
			s.removeClass();
			s.addClass("span_success");
			s.text("√");
			e.text("正确");
		}else{
			$(this).removeClass();
			s.removeClass();
			$(this).addClass("error");
			s.addClass("span_error");
			s.text("×");
			e.text("请输入正确的密码");			
		}
	} );
	
	
	
	
	//验证手机号
	phone.focus( function(){
		var str = phone.val();
		var s = phone.parent().find("b");
		var e = phone.parent().find("em");
		if( str=="" ){
			$(this).removeClass();
			s.removeClass();
			$(this).addClass("input_empty");
			s.addClass("span_empty");
			s.text("i");
			e.text("请输入手机号码");
		}	
	} );
	phone.blur( function(){
		var str = phone.val();
		var s = phone.parent().find("b");
		var e = phone.parent().find("em");
		var reg = /^1\d{10}$/;
		if( reg.test(str) ){
			$(this).removeClass();
			s.removeClass();
			s.addClass("span_success");
			s.text("√");
			e.text("正确");
		}else{
			$(this).removeClass();
			s.removeClass();	
			$(this).addClass("error");
			s.addClass("span_error");
			s.text("×");
			e.text("请输入正确的手机号码");
		}
	} );
	
	
	//邮箱验证
	email.blur( function(){
		var str = email.val();
		var s = email.parent().find("b");
		var e = email.parent().find("em");
		var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(com)$/;
		if( reg.test(str) ){
			$(this).removeClass();
			s.removeClass();
			s.addClass("span_success");
			s.text("√");
			e.text("正确");		
		}else if( str=="" ){
			$(this).removeClass();
			s.removeClass();
			s.text("");
			e.text("");						
		}else{
			$(this).removeClass();
			s.removeClass();	
			$(this).addClass("error");
			s.addClass("span_error");
			s.text("×");
			e.text("请输入正确的邮箱");		
		}
	} );
	
	
	//注册按钮
	btn.click( function(){
		//用户名
		var u = $("#username");
		var s_u = u.parent().find("b");
		//密码
		var p1 = $("#pass1");
		var s_p1 = p1.parent().find("b");
		//确认密码
		var p2 = $("#pass2");
		var s_p2 = p2.parent().find("b");
		//手机号
		var phone = $("#phone");
		var s_phone = phone.parent().find("b");
		//电子邮箱
		var email = $("#email");
		var s_email = email.parent().find("b");
		if( s_u.text()=="√" && s_p1.text()=="√" && s_p2.text()=="√" && s_phone.text()=="√" && s_email.text()=="√" && agr.is(":checked") && p1.val()==p2.val() ){
			//可以发送请求
			
			$.post("http://127.0.0.1:8888/myProject/server/php/rigister.php",{"username":u.val(),"password":p1.val(),"phone":phone.val(),"email":email.val()},function( res ){
				var obj = JSON.parse( res );
				if( obj.status== 200 ){
					alert(obj.msg);
				}else{
					alert(obj.msg);
				}
			});
			
		}else{
			//不可以发送请求
			alert("格式有误不允许提交");
			
		}
	} );
	

} );
