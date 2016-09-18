var $=require('../libs/jquery-3.1.0.min.js');

module.exports=function(){
	var dataJson;
	var arrAllGood=[];
	var type=0;
	var nowPage=1;

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
			error:function(data){
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
	}
}
