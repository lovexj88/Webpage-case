var $=require('./libs/jquery-3.1.0.min.js');

var pzcfpage=require('./tmpls/pzcf.string');

var show=require('./commons/showpage.js');

var pzcfW=require('./diffs/pzcf.js');

var list=require('./modules/pzcfSet.js');

$(function(){
  show.renderHtml(pzcfpage);
  list();
	pzcfW.pzcfStart();
})


