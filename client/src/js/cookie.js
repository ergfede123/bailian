function setCookie(name, value, date, path){
	//将value设置为对象
	var json = {
		"val": value
	}
	//现将对象转换成json对象，再进行编码，进行编码防止中文乱码
	var jsonstr = JSON.stringify(json);
	var str = name+"="+encodeURIComponent(jsonstr);
	
	if( date ){
		var dt = new Date();
		dt.setDate(dt.getDate()+date); 
		str += ";expires="+dt.toGMTString();
	}
	if( path ){
		str += ";path="+path;
	}
	
	//将拼接完的字符串作为cookie设置
	document.cookie = str;
}

//根据名称获取cookie

function getCookie(name){
	//先将之前编码的cookie进行解码操作
	var str = decodeURIComponent(document.cookie);
	
	//cookie都是a=1; b=2; c=3;形式，即"; "的形式存储
	var arr = str.split("; ");	//以"; "为依据拆分cookie
	
	//对拆分好的字符串进行循环
	for( var i=0,len=arr.length; i<len; i++ ){
		var str2 = arr[i];
		var ind = str2.indexOf("="); //获取"="的 下标
		var _name = str2.substring(0, ind); //获取"="左边的值
		var _value = str2.substring(ind+1);//获取"="右边的值
		if( name == _name ){ //判断参数的name是否与当前name是否匹配

			return JSON.parse(_value).val; //之前只进行了解码，还需要转换为JSON 字符串，并获取对象中的值
		}
	}	
}


//获取与正则对象匹配的cookie
function getCookieAll(reg, cb, del){
	var num = 0;
	var arr = document.cookie.split("; ");
	for( var i=0,len=arr.length; i<len; i++ ){
		var str = arr[i];
		var ind = str.indexOf("=");
		var cookieName = str.substring(0, ind);
		var cookieValue = str.substring(ind+1);
		if(  reg.test(cookieName)  ){ //使用正则对象判断，是否匹配
			//回调函数
			if( cb ){
				//回调函数的参数就是与正则匹配的所有的cookie的名称和值
				cb( cookieName, JSON.parse(decodeURIComponent(cookieValue)).val );
			}
			if( del ){
				//删除与正则匹配的cookie
				document.cookie=cookieName+"=1;expires="+new Date(1970,0,1).toGMTString();
			}
			num++;
		}
	}	
	return num;
}


//删除对应名称的cookie
function removeCookie(_name){
	setCookie(_name, "", -1);
}

//删除与正则匹配的所有cookie
function removeCookieAll(reg){
	var num = 0;
	var arr = document.cookie.split("; ");
	for( var i=0,len=arr.length; i<len; i++ ){
		var str = arr[i];
		var ind = str.indexOf("=");
		var cookieName = str.substring(0, ind);
		var cookieValue = str.substring(ind+1);
		if(  reg.test(cookieName)  ){
			removeCookie(cookieName);
			num++;
		}
	}	
	return num;
}

export{setCookie,getCookie,getCookieAll,removeCookie,removeCookieAll};
