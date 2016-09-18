var $=require('./libs/jquery-3.1.0.min.js');

var zbccpage=require('./tmpls/zbcc.string');

var show=require('./commons/showpage.js');

var zbccW=require('./diffs/zbcc.js');

var list=require('./modules/zbccSet.js');

$(function(){
  show.renderHtml(zbccpage);
  list();
	zbccW.zbccStart();
})

