
var strCookie=cookieObj.getCookie("userInfo");
if(strCookie){
	var arr=strCookie.split("&");
	$(".loginBox dd").html("你好！&nbsp;"+arr[0]+"<br /><a href=\"#\" id=\"tuichu\">退出</a>");
	$("#tuichu").css({"position":"relative","top":"-10px"});
	$("#tuichu").on("click",function(){
		cookieObj.removeCookie("userInfo");
		cookieObj.removeCookie("shoppingCar");
		window.location.href="login.html";
	});
	$.ajax({
		type: "GET",
		url: "http://localhost:8080/product/GetProductById_get?id=00001",
		success: function(data){
			arr=strCookie.split("&");
			var goodSum=0;
			var userJson=JSON.parse(JSON.parse(data).Data);
			var flag=false;
			for(var i=0;i<userJson.length;i++){
				if(arr[0]==userJson[i].username){
					if(userJson[i].shoppingInfo.length>0){
						flag=true;
						var info=userJson[i].shoppingInfo;
						var totalNum=0;
						var totalPrice=0;
						ajaxUtil(info,info.length-1,totalNum,totalPrice);
					}
				}
			}
			if(flag){
				$(".gouwuche").on("mouseover",function(){
					$(".showCarHas").css("display","block");
				});
				$(".gouwuche").on("mouseout",function(){
					$(".showCarHas").css("display","none");
				});
			}else{
				$(".gouwuche").on("mouseover",function(){
					$(".showCarNo").css("display","block");
				});
				$(".gouwuche").on("mouseout",function(){
					$(".showCarNo").css("display","none");
				});
			}
		}
	});
}else{
	var shoppingCookie=cookieObj.getCookie("shoppingCar");
	if(shoppingCookie){
		var info=JSON.parse(shoppingCookie);
		var totalNum=0;
		var totalPrice=0;
		ajaxUtil(info,info.length-1,totalNum,totalPrice);
		$(".gouwuche").on("mouseover",function(){
			$(".showCarHas").css("display","block");
		});
		$(".gouwuche").on("mouseout",function(){
			$(".showCarHas").css("display","none");
		});
	}else{
		$(".gouwuche").on("mouseover",function(){
			$(".showCarNo").css("display","block");
		});
		$(".gouwuche").on("mouseout",function(){
			$(".showCarNo").css("display","none");
		});
	}
}

function ajaxUtil(arr,i,totalNum,totalPrice){
	if(i<0){
		var str2="<i><em>"+totalNum+"</em>件商品</i><span>￥"+totalPrice+"</span><a href=\"gouwuche.html\">去购物车结算</a>";
		$(".showBottom").append(str2);
		$(".shoppingNum").each(function(){
			$(this).html(totalNum);
		});
		return;
	}else{
		$.ajax({
			type: "GET",
			url: "http://localhost:8080/product/GetProductById_get?id="+arr[i].goodId,
			success: function(data){
				var goodJson=JSON.parse(JSON.parse(data).Data);
				var str="<li><img src=\"pictures/"+goodJson.imgsrc+"\" width=\"50\" height=\"50\" />";
					str+="<a href=\"detail.html?id="+goodJson.id+"\" class=\"intro\">"+goodJson.name+"</a>";
					str+="<em><i class=\"carPrice\">￥"+goodJson.price+"</i><b class=\"sum\">x&nbsp;"+arr[i].num+"</b></em></li>";
				$("#showInfo").append(str);
				totalNum+=arr[i].num;
				totalPrice+=goodJson.price*arr[i].num;
				ajaxUtil(arr,i-1,totalNum,totalPrice);
			}
		});
	}
}
