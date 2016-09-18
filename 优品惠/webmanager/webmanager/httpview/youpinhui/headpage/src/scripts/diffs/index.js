var $=require('../libs/jquery-3.1.0.min.js');

var common={
		timeStart:function(){
			var date=new Date();
		  var nowHour=date.getHours();
		  var nowMin=date.getMinutes();
		  var nowSec=date.getSeconds();
		  var timeArr=[22-nowHour,59-nowMin,59-nowSec];
		  timeArr[2]=timeArr[2]<10?("0"+parseInt(timeArr[2])):timeArr[2];
		  timeArr[1]=timeArr[1]<10?("0"+parseInt(timeArr[1])):timeArr[1];
		  timeArr[0]=timeArr[0]<10?("0"+parseInt(timeArr[0])):timeArr[0];
		  $("#timesub").html(timeArr[0]+":"+timeArr[1]+":"+timeArr[2]);
	
		var timer=setInterval(function(){
			  var date=new Date();
			  var nowHour=date.getHours();
			  var nowMin=date.getMinutes();
			  var nowSec=date.getSeconds();
			  var timeArr=[22-nowHour,59-nowMin,59-nowSec];
			  if(timeArr[2]<0){
			    timeArr[2]+=60;
			    timeArr[1]--;
			    if(timeArr[1]<0){
			      timeArr[1]+=59;
			      timeArr[0]--;
			      if(timeArr[0]<0){
			        timeArr=[22-nowHour,59-nowMin,59-nowSec];
			      }
			    }
			  }
			  timeArr[2]=timeArr[2]<10?("0"+parseInt(timeArr[2])):timeArr[2];
		  timeArr[1]=timeArr[1]<10?("0"+parseInt(timeArr[1])):timeArr[1];
		  timeArr[0]=timeArr[0]<10?("0"+parseInt(timeArr[0])):timeArr[0];
		  $("#timesub").html(timeArr[0]+":"+timeArr[1]+":"+timeArr[2]);
		},1000);
	}
}
module.exports=common;
