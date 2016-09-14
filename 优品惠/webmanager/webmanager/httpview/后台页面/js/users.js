$(function(){
	var nowPage=1;
	var arrAllUser=[];
	var type=0;
	
	$("#queding").click(function(){
		var jsonData={
			"username":$("#userName").val(),
			"pwd":$("#userPwd").val(),
			"shoppingInfo":[]
		};
		arrAllUser.push(jsonData);
		var dataStr=JSON.stringify(arrAllUser);
		$.ajax({
			type: "GET",
			url: "http://localhost:8080/product/CreateUpdateProduct_get?id=00001&datajson="+dataStr,
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
			url: "http://localhost:8080/product/GetProductById_get?id=00001",
			success: function(data){
				dataJson=JSON.parse(data);
				arrAllUser=JSON.parse(dataJson.Data);
				showData(nowPage,type);
			},
			error:function(){
				alert("获取数据失败!");
			}	 
		});
	}
	
	function showData(index,type){
		$("#content tbody").html("");
		if(5*(index-1)<=arrAllUser.length){
			for(var i=5*(index-1);i<5*index;i++){
				if(i<arrAllUser.length)
					appendData(arrAllUser[i]);
			}
		}
	}
	
	function appendData(strData){
		var str="<tr><td><input type=\"checkbox\" /></td>";
			str+="<td>"+strData.username+"</td>";
			str+="<td>"+strData.pwd+"</td>"
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
						var dataName=$(this).parent().parent().children().eq(1).html();
						var dataPwd=$(this).parent().parent().children().eq(2).html();
						var str="<td><input type=\"checkbox\" /></td>";
							str+="<td>"+dataName+"</td>";
							str+="<td><input type=\"text\" value=\""+dataPwd+"\" /></td>";
							str+="<td><a href=\"#\" class=\"bjqd\">确定</a></td>";
							str+="<td><a href=\"#\" class=\"glyphicon glyphicon-trash shanchu\"></a></td>";
						dom.html(str);
						$(".bjqd").click(function(){
							var newpwd=$(this).parent().parent().children().eq(2).children().val();
								for(var i=0;i<arrAllUser.length;i++){
									if(arrAllUser[i].username==dataName){
										arrAllUser[i].pwd=newpwd;
									}
								}
								var dataStr=JSON.stringify(arrAllUser);
								$.ajax({
								    type: "GET",
								    url: "http://localhost:8080/product/CreateUpdateProduct_get?id=00001&datajson="+dataStr,
								    success: function(data){
								    	var newStr="<td><input type=\"checkbox\" /></td>";
											newStr+="<td>"+dataName+"</td>";
											newStr+="<td>"+newpwd+"</td>"
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
					var dataName=$(this).parent().parent().children().eq(1).html();
					for(var i=0;i<arrAllUser.length;i++){
						if(arrAllUser[i].username==dataName){
							arrAllUser.splice(i,1);
						}
					}
					var dataStr=JSON.stringify(arrAllUser);
					$.ajax({
						type: "GET",
						url: "http://localhost:8080/product/CreateUpdateProduct_get?id=00001&datajson="+dataStr,
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