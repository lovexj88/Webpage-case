var $=require('../libs/jquery-3.1.0.min.js');

var indexWork={
	indexStart:function(){
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

module.exports=indexWork;
