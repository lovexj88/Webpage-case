$(function(){
	var nowPage=1;
	var dataJson;
	var arrAllGood=[];
	var type=0;
	
	$("#queding").click(function(){
		var dataId=$("#goodId").val();
		if(dataId==""){
			alert("商品编号不能为空!");
			return;
		}
		var jsonData={
			"id":dataId,
			"name":$("#goodName").val(),
			"imgsrc":$("#goodPic").val(),
			"intro":$("#goodIntro").val(),
			"num":$("#goodNum").val(),
			"price":$("#goodPrice").val()
		};
		var dataStr=JSON.stringify(jsonData);
		$.ajax({
			type: "GET",
			url: "http://localhost:8080/product/CreateUpdateProduct_get?id="+dataId+"&datajson="+dataStr,
			success: function(data){
			    alert("添加成功!");
			    location.reload();
			},
			 error:function(){
			   	alert("添加失败!");
			}
		});
	});
	
	$("#lastPage").click(function(){
		nowPage--;
		if(nowPage<=0){
			nowPage=1;
		}else{
			$("#pageNow").html(nowPage);
			showData(nowPage,type);
		}
		return false;
	});
	
	$("#nextPage").click(function(){
		nowPage++;
		$("#pageNow").html(nowPage);
		showData(nowPage,type);
		return false;
	});
	
	$("#submit").click(function(){
		nowPage=$("#toPageIndex").val();
		if(nowPage>=1){
			$("#pageNow").html(nowPage);
			showData(nowPage,type);
		}
		return false;
	});
	
	$("#content thead th input").click(function(){
		if($(this).prop("checked")==true){
			$("#content tbody td input").each(function(){
				$(this).prop("checked",true);
			});
		}
		else{
			$("#content tbody td input").each(function(){
				$(this).prop("checked",false);
			});
		}
	});

	ajaxUtil();
	function ajaxUtil(){
		$.ajax({
			type: "GET",
			url: "http://localhost:8080/product/GetProductsByPage_get?pagesize=200&pageindex=1",
			success: function(data){
				dataJson=JSON.parse(data);
				initArr(dataJson);
			},
			error:function(){
				alert("获取数据失败!");
			}	 
		});
	}
	
	function initArr(data){
		for(var i=0;i<data.length;i++){
			var strData=JSON.parse(data[i].Data);
			if(data[i].Id.substring(0,1)!="0"){
				arrAllGood.push(strData);
			}
		}
		showData(nowPage,type);
	}
	
	function showData(index,type){
		$("#content tbody").html("");
		if(5*(index-1)<=arrAllGood.length){
			for(var i=5*(index-1);i<5*index;i++){
				if(i<arrAllGood.length)
					appendData(arrAllGood[i]);
			}
		}
	}
	
	function appendData(strData){
		var str="<tr><td><input type=\"checkbox\" /></td>";
			str+="<td>"+strData.id+"</td><td>"+strData.name+"</td>";
			str+="<td>"+strData.imgsrc+"</td>"
			str+="<td>"+strData.intro+"</td>";
			str+="<td>"+strData.num+"</td>";
			str+="<td>"+strData.price+"</td>";
			str+="<td><a href=\"#\" class=\"glyphicon glyphicon-list-alt bianji\"></a></td>";
			str+="<td><a href=\"#\" class=\"glyphicon glyphicon-trash shanchu\"></a></td></tr>";
		$("tbody").append(str);
		del();
		bianji();
	}
	
	function bianji(){
		$(".bianji").each(function(){
					$(this).click(function(){
						var dom=$(this).parent().parent();
						var dataId=$(this).parent().parent().children().eq(1).html();
						var dataName=$(this).parent().parent().children().eq(2).html();
						var dataPic=$(this).parent().parent().children().eq(3).html();
						var dataIntro=$(this).parent().parent().children().eq(4).html();
						var dataNum=$(this).parent().parent().children().eq(5).html();
						var dataPrice=$(this).parent().parent().children().eq(6).html();
						var str="<td><input type=\"checkbox\" /></td>";
							str+="<td>"+dataId+"</td>";
							str+="<td><input type=\"text\" value=\""+dataName+"\" /></td>";
							str+="<td><input type=\"text\" value=\""+dataPic+"\" /></td>";
							str+="<td><input type=\"text\" value=\""+dataIntro+"\" /></td>";
							str+="<td><input type=\"text\" value=\""+dataNum+"\" /></td>";
							str+="<td><input type=\"text\" value=\""+dataPrice+"\" /></td>";
							str+="<td><a href=\"#\" class=\"bjqd\">确定</a></td>";
							str+="<td><a href=\"#\" class=\"glyphicon glyphicon-trash shanchu\"></a></td>";
						dom.html(str);
						$(".bjqd").click(function(){
								var jsonData={
									"id":dataId,
									"name":$(this).parent().parent().children().eq(2).children().val(),
									"imgsrc":$(this).parent().parent().children().eq(3).children().val(),
									"intro":$(this).parent().parent().children().eq(4).children().val(),
									"num":$(this).parent().parent().children().eq(5).children().val(),
									"price":$(this).parent().parent().children().eq(6).children().val()
								};
								var dataStr=JSON.stringify(jsonData);
								$.ajax({
								    type: "GET",
								    url: "http://localhost:8080/product/CreateUpdateProduct_get?id="+dataId+"&datajson="+dataStr,
								    success: function(data){
								    	var newStr="<td><input type=\"checkbox\" /></td>";
											newStr+="<td>"+jsonData.id+"</td><td>"+jsonData.name+"</td>";
											newStr+="<td>"+jsonData.imgsrc+"</td>"
											newStr+="<td>"+jsonData.intro+"</td>";
											newStr+="<td>"+jsonData.num+"</td>";
											newStr+="<td>"+jsonData.price+"</td>";
											newStr+="<td><a href=\"#\" class=\"glyphicon glyphicon-list-alt bianji\"></a></td>";
											newStr+="<td><a href=\"#\" class=\"glyphicon glyphicon-trash shanchu\"></a></td>";
								    	dom.html(newStr);
								    	bianji();
								    },
								    error:function(){
								   		alert("修改失败!");
								    }
								});
							
						})
					})
				});
	}
	
	function del(){
		$(".shanchu").each(function(){
			$(this).click(function(){
				var result=confirm("是否确定删除？");
				if(result){
					var dataId=$(this).parent().parent().children().eq(1).html();
					$.ajax({
						type: "GET",
						url: "http://localhost:8080/product/DeleteProductById_get?id="+dataId,
						success: function(data){
							alert("删除成功!");
						},
						error:function(){
							alert("删除失败!");
						}
					});
					location.reload();
				}
			})
		});
	}
})