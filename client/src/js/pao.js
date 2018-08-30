function pao(elem, targetX, targetY,cb){
	// 起点
	var originX = elem.offsetLeft;
	var originY = elem.offsetTop;
	
	// 终点就是参数targetX  targetY
	
	// 公式
	//y = a*x*x + b*x + c;
	//公式中a自己设置，x是目标与起点的X轴差值，y是目标与起点的Y轴差值
	//x,y,a已知,c=0,求b
	var x = targetX-originX;
	var y = targetY-originY;
	var a = 0.002;
	var c = 0;
	var b = (y - a*x*x - c) / x;
	
	// 更新
	//y = axx + bx + c;
	x = 0;  //此处的变量不适用x也可以，比如说var m = 0;但是定时器中的x也要使用
	var timer2 = setInterval(function(){
		var step = (targetX-elem.offsetLeft)/12;//缓冲运动
		/*原来的写法
		step = step>0 ? Math.ceil(step) : Math.floor(step);
		x+=step;
		*/
		/*为增加回调函数，添加的*/
		x+=step;
		if( step>0 ){
			step = Math.ceil(step);
			x = Math.ceil(x);
		}else{
			step = Math.floor(step);
			x = Math.floor(x);
		}
		
		
		y = a*x*x + b*x + c;//如果外面的变量是其他变量，这里的x也要变成那个变量
		elem.style.left = originX+x+"px";//如果外面的变量是其他变量，这里的x也要变成那个变量
		elem.style.top = originY+y+"px";
		if( originX+x==targetX ){//如果外面的变量是其他变量，这里的x也要变成那个变量
			clearInterval(timer2);
			/*添加的回调函数，当抛物线运动执行完，再执行*/
			if( cb ){
				cb();
			}
		}
	}, 10);
}

export{pao};
