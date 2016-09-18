var $=require('./libs/jquery-3.1.0.min.js');

var jkshpage=require('./tmpls/jksh.string');

var show=require('./commons/showpage.js');

var jkshW=require('./diffs/jksh.js');

var list=require('./modules/jkshSet.js');

$(function(){
  show.renderHtml(jkshpage);
  list();
	jkshW.jkshStart();
})

