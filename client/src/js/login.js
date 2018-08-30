import $ from "jquery";
$(function(){
	$(".user").blur( function(){
	$(this).removeClass("active");
	if( $(this).val()=="" ){
		$(this).addClass("error");
	}

	} );
	$(".user").focus( function(){
		$(this).removeClass("error");
		$(this).addClass("active");
	} );
	
	$("#login_btn").click( function(){
		var u = $("#username").eq(0).val();
		var p = $("#password").eq(0).val();
		$.post( "http://127.0.0.1:8888/myProject/server/php/login.php",{"username":u,"password":p} ,function(res){
			var obj = JSON.parse( res );
			if( obj.status==200 ){
				alert(obj.msg);
			}else{
				alert(obj.msg);
			}
		});
	} );
})
