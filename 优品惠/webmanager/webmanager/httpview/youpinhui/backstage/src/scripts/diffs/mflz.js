var $=require('../libs/jquery-3.1.0.min.js');

var mflzWork={
	mflzStart:function(){

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
	}
}

		module.exports=mflzWork;
