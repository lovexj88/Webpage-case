var $=require('../libs/jquery-3.1.0.min.js');

module.exports=function(){
	var nowPage=1;
	var arrJK=[];
	var arrBJ=[];
	var arrTC=[];
	var arrGH=[];
	var arrJS=[];
	var type=0;
	for(var i=0;i<=6;i++){
		$("#erji").children().each(function(index){
			$(this).click(function(){
				nowPage=1;
				$("#pageNow").html(nowPage);
				$("#erji").children().each(function(){
					$(this).attr("class","");
				});
				$(this).attr("class","liActive");
				type=index;
				showData(nowPage,type);
			})
		})
	}
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
	ajaxUtil();
	function ajaxUtil(){
		$.ajax({
			type: "GET",
			url:'/api/getIndexList',
			success: function(data){
				initArr(data);
			},
			error:function(){
				alert("获取数据失败!");
			}
		});
	}

	function initArr(data){
		for(var i=0;i<data.length;i++){
			var strData=JSON.parse(data[i].Data);
			if(data[i].Id.substring(0,2)=="21"){
				arrJK.push(strData);
			}else if(data[i].Id.substring(0,2)=="22"){
				arrBJ.push(strData);
			}else if(data[i].Id.substring(0,2)=="23"){
				arrTC.push(strData);
			}else if(data[i].Id.substring(0,2)=="24"){
				arrGH.push(strData);
			}else if(data[i].Id.substring(0,2)=="25"){
				arrJS.push(strData);
			}
		}
		showData(nowPage,type);
	}

	function showData(index,type){
		$("#content tbody").html("");
		if(type==0){
			if(5*(index-1)<=arrJK.length){
				for(var i=5*(index-1);i<5*index;i++){
					if(i<arrJK.length)
						appendData(arrJK[i]);
				}
			}
		}else if(type==1){
			if(5*(index-1)<=arrBJ.length){
				for(var i=5*(index-1);i<5*index;i++){
					if(i<arrBJ.length)
						appendData(arrBJ[i]);
				}
			}
		}else if(type==2){
			if(5*(index-1)<=arrTC.length){
				for(var i=5*(index-1);i<5*index;i++){
					if(i<arrTC.length)
						appendData(arrTC[i]);
				}
			}
		}else if(type==3){
			if(5*(index-1)<=arrGH.length){
				for(var i=5*(index-1);i<5*index;i++){
					if(i<arrGH.length)
						appendData(arrGH[i]);
				}
			}
		}
		else if(type==4){
			if(5*(index-1)<=arrJS.length){
				for(var i=5*(index-1);i<5*index;i++){
					if(i<arrJS.length)
						appendData(arrJS[i]);
				}
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
	}
}
