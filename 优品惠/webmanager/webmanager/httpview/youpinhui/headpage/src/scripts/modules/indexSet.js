var $=require('../libs/jquery-3.1.0.min.js');

module.exports=function(){
	ajaxUtil(1);
	function ajaxUtil(index){
	  $.ajax({
	    type: "GET",
	    url: "api/getIndexList",
	    success: function(data){
	      var dataJson=data;
	      if(dataJson.length==0){
	        return;
	      }
	      else{
	        for(var i=0;i<dataJson.length;i++){
	          if(dataJson[i].Id.substring(0,1)!=0){
	            var strData=JSON.parse(dataJson[i].Data);
	            var str="<dl><dt><a href=\"detail.html?id="+strData.id+"\"><img src=\"pictures/"+strData.imgsrc+"\" /></dt>";
	            str+="<dd><p class=\"goodTip\"><a href=\"detail.html?id="+strData.id+"\">"+strData.name+"</a></p>";
	            str+="<p class=\"goodIntro\"><a href=\"detail.html?id="+strData.id+"\">"+strData.intro+"</a></p>";
	            str+="<p class=\"money\"><a href=\"detail.html?id="+strData.id+"\" class=\"price\">￥"+strData.price+"</a><a href=\"#\" class=\"kucun\"><span>569人</span>已购买</a></p>";
	            str+="</dd><p class=\"goodLast\">品牌，国内发货</p></dl>";
	          $(".globalBottom").append(str);
	          }
	
	        }
	      }
	    },
	    error:function(){
	      alert("获取数据失败!");
	    }
	  });
	}
}
