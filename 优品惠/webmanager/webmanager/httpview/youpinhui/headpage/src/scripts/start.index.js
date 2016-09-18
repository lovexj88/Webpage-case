var $=require('./libs/jquery-3.1.0.min.js');

var indexpage=require('./tmpls/index.string');

var moveObj=require('./utils/moveUtil.js');

var cookObj=require('./commons/cookieBox.js');

var show=require('./commons/showpage.js');

var userCh=require('./commons/userCheck.js');

var time=require('./diffs/index.js');

var lb=require('./utils/lunbo.js');

$(function(){
  	show.renderHtml(indexpage);
  	moveObj();
  	var cookieObj=cookObj.cookieStart();
  	userCh.userCheck(cookieObj);
  	time.timeStart();
  	lb.lunbo();
})