	var pageHref=location.href;
	var goodId=pageHref.split("=")[1];
	
	var arrPic = ["pictures/"+goodId+"_1.jpg","pictures/"+goodId+"_2.jpg","pictures/"+goodId+"_3.jpg","pictures/"+goodId+"_4.jpg","pictures/"+goodId+"_5.jpg"];
	var oarr = ["pictures/"+goodId+"_1.jpg","pictures/"+goodId+"_2.jpg","pictures/"+goodId+"_3.jpg","pictures/"+goodId+"_4.jpg","pictures/"+goodId+"_5.jpg"];
	
	$(".imgBox img").each(function(index){
		$(this).attr("src",oarr[index]);
	})
	$("#one img").attr("src",arrPic[0]);
	$("#the img").attr("src",arrPic[0]);
	$("#two img").each(function(index){
		$(this).attr("src",oarr[index]);
	});
	$("#huohao").text("商品货号"+goodId);
	var ione = $("#one"),
		ithe = $("#the"),
		itwo = $("#two img");
		tthe = $("#the img");
	itwo.each(function(i){
		$(this).click(function(){
			$("#one img").attr("src",arrPic[i])
			tthe.attr("src",oarr[i])
			itwo.removeClass("active")
			$(this).addClass("active")
		})
		ione.mousemove(function(a){
			var evt = a || window.event
			ithe.css('display','block')
			var ot = evt.clientY-($("#one").offset().top- $(document).scrollTop())-87;
			var ol = evt.clientX-($("#one").offset().left- $(document).scrollLeft())-87;
			if(ol<=0){
				ol = 0;
			}
			if(ot<=0){
				ot = 0;
			}
			if(ol>=175){
				ol=175
			}
			if(ot>=175){
				ot=175
			}
			$("#one span").css({'left':ol,'top':ot})
			var ott = ot/350*600
			var oll = ol/350*600
			tthe.css({'left':-oll,'top':-ott})
		})
		ione.mouseout(function(){
			ithe.css('display','none')
		})
	})
