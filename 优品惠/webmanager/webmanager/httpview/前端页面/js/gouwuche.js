
var strCookie=cookieObj.getCookie("userInfo");
if(strCookie){
	$.ajax({
		type: "GET",
		url: "http://localhost:8080/product/GetProductById_get?id=00001",
		success: function(data){
			var goodSum=0;
			var userJson=JSON.parse(JSON.parse(data).Data);
			for(var i=0;i<userJson.length;i++){
				if(arr[0]==userJson[i].username){
					if(userJson[i].shoppingInfo.length>0){
						var info=userJson[i].shoppingInfo;
						var totalNum=0;
						var totalPrice=0;
						ajaxShopCar(info,0,0,0);
						$("#shopCarFooter").css("display","block");
					}else{
						var str="<div class=\"noGood\"><img src=\"img/noGood.jpg\" />";
							str+="<p><a href=\"index.html\">去挑选物品→</a></p></div>";
						$(".goodShow").append(str);
					}
				}
			}
		}
	});
}else{
	var shoppingCookie=cookieObj.getCookie("shoppingCar");
	if(shoppingCookie){
		var info=JSON.parse(shoppingCookie);
		ajaxShopCar(info,0,0,0);
	}else{
		var str="<div class=\"noGood\"><img src=\"img/noGood.jpg\" />";
			str+="<p><a href=\"index.html\">去挑选物品→</a></p></div>";
		$(".goodShow").append(str);
	}
}

function ajaxShopCar(arr,i,totalNum,totalPrice){
	if(i==arr.length){
		$("#totalNum").html(totalNum);
		$("#totalPrice").html(totalPrice);
		$("#shopCarFooter").css("display","block");
		return;
	}
	else{
		$.ajax({
			type: "GET",
			url: "http://localhost:8080/product/GetProductById_get?id="+arr[i].goodId,
			success: function(data){
				var goodJson=JSON.parse(JSON.parse(data).Data);
				var str="<tr id=\""+goodJson.id+"\"><td class=\"tab1\"><input type=\"checkbox\"></td>";
					str+="<td class=\"tab2\"><img src=\"pictures/"+goodJson.imgsrc+"\"/>";
					str+="<a href=\"detail.html?id="+goodJson.id+"\">"+goodJson.name+"</a>";
					str+="</td><td class=\"tab3\">￥"+goodJson.price+"</td><td class=\"tab4\">";
					str+="<p><a class=\"sub\" href=\"#\">-</a><span id=\"shuliang\">"+arr[i].num+"</span>";
					str+="<a href=\"#\" class=\"add\">+</a></p></td><td class=\"tab5\">"+(goodJson.price*arr[i].num)+"</td>";
					str+="<td class=\"tab6\"><a href=\"#\"><img src=\"img/shanchu.jpg\" class=\"shanchu\" /></a></td></tr>";
				$("#gouwuInfo").append(str);
				totalNum+=arr[i].num;
				totalPrice+=goodJson.price*arr[i].num;
				ajaxShopCar(arr,i+1,totalNum,totalPrice);
			}
		});	
	}
}


$("#gouwuInfo").on("click",".sub",function(){
	$(".shoppingNum").html(parseInt($(".shoppingNum").html()-1));
	if($(".shoppingNum").html()=="0"){
		$("#shopCarFooter").css("display","none");
		var str="<div class=\"noGood\"><img src=\"img/noGood.jpg\" />";
				str+="<p><a href=\"index.html\">去挑选物品→</a></p></div>";
			$(".goodShow").append(str);
	}
	var nowSum=$(this).next().eq(0);
	var dom=$(this).parent().parent().parent();
	shoppingInfo(dom.attr("id"),0);
	var totalPrice=$(this).parent().parent().next();
	var price=parseInt(totalPrice.html()/nowSum.html());
	nowSum.html(parseInt(nowSum.html())-1);
	//totalPrice.html(parseInt(totalPrice.html())-price);
	if($(this).next().eq(0).html()==0){
		dom.detach();
	}else{
		totalPrice.html(parseInt(totalPrice.html())-price);
	}
	var priceAll=0;
	$("tbody .tab5").each(function(){
		priceAll+=parseInt($(this).html());
	});
	$("#totalPrice").html(priceAll);
	$("#totalNum").html($(".shoppingNum").html());
	return false;
})

$("#gouwuInfo").on("click",".add",function(){
	$(".shoppingNum").html(parseInt($(".shoppingNum").html())+1);
	var nowSum=$(this).prev().eq(0);
	var dom=$(this).parent().parent().parent();
	shoppingInfo(dom.attr("id"),1);
	var totalPrice=$(this).parent().parent().next();
	var price=parseInt(totalPrice.html()/nowSum.html());
	nowSum.html(parseInt(nowSum.html())+1);
	totalPrice.html(parseInt(totalPrice.html())+price);
	var priceAll=0;
	$("tbody .tab5").each(function(){
		priceAll+=parseInt($(this).html());
	});
	$("#totalPrice").html(priceAll);
	$("#totalNum").html($(".shoppingNum").html());
	return false;
})

$("#gouwuInfo").on("click",".shanchu",function(){
	var opDom=$(this);
	swal({   
		title: "你确定要删除该商品吗?",   
		text: "删除商品后不可恢复!",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		/*confirmButtonText: "Yes, delete it!",   
		cancelButtonText: "No, cancel plx!",   */
		closeOnConfirm: false,   
		closeOnCancel: false 
	}, function(isConfirm){   
		if(isConfirm){
			var dom=opDom.parent().parent().parent();
			shoppingInfo(dom.attr("id"),2);
			dom.detach();
			var domSum=opDom.parent().parent().parent().find("td").eq(3).find("span");
			var sumAll=parseInt(domSum.html());
			$(".shoppingNum").html(parseInt($(".shoppingNum").html())-sumAll);
			$("#totalNum").html($(".shoppingNum").html());
			var priceAll=0;
			$("tbody .tab5").each(function(){
				priceAll+=parseInt($(this).html());
			});
			$("#totalPrice").html(priceAll);
			$("#totalNum").html($(".shoppingNum").html());
			if($(".shoppingNum").html()=="0"){
				$("#shopCarFooter").css("display","none");
				var str="<div class=\"noGood\"><img src=\"img/noGood.jpg\" />";
					str+="<p><a href=\"index.html\">去挑选物品→</a></p></div>";
				$(".goodShow").append(str);
			}
			swal("成功删除!", "该商品已从购物车删除！", "success");   
		}else{     
			swal("取消删除", "该商品依旧在购物车中！", "error");   
		} 
	});
})

function shoppingInfo(id,type){
	if(strCookie){
		$.ajax({
			type: "GET",
			url: "http://localhost:8080/product/GetProductById_get?id=00001",
			success:function(data){
				var userJson=JSON.parse(JSON.parse(data).Data);
				var arr=strCookie.split("&");
				for(var i=0;i<userJson.length;i++){
					if(arr[0]==userJson[i].username){
						var info=userJson[i].shoppingInfo;
						for(var j=0;j<info.length;j++){
							if(info[j].goodId==id){
								if(type==0){
									info[j].num--;
									if(info[j].num==0){
										info.splice(j,1);
									}
								}else if(type==1){
									info[j].num++;
								}else if(type==2){
									info.splice(j,1);
								}
							}
						}
					}
				}
				var dataStr=JSON.stringify(userJson);
				$.ajax({
					type: "GET",
					url: "http://localhost:8080/product/CreateUpdateProduct_get?id=00001&datajson="+dataStr,
					success: function(data){},
					error:function(){
						alert("数据上传失败!");
					}
				});
			}
		});
	}else{
		var shoppingCookie=cookieObj.getCookie("shoppingCar");
		var shoppingArr=JSON.parse(shoppingCookie);
		for(var i=0;i<shoppingArr.length;i++){
			if(shoppingArr[i].goodId==id){
				if(type==0){
					shoppingArr[i].num--;
					if(shoppingArr[i].num==0){
						shoppingArr.splice(i,1);
					}
				}else if(type==1){
					shoppingArr[i].num++;
				}else if(type==2){
					shoppingArr.splice(i,1);
				}
			}
		}
		var dataCookie=JSON.stringify(shoppingArr);
		cookieObj.setCookie("shoppingCar",dataCookie,30);
	}
}
