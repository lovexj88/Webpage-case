var $=require('./libs/jquery-3.1.0.min.js');

var indexpage=require('./tmpls/index.string');

var show=require('./commons/showpage.js');

var list=require('./modules/indexSet.js');

var indexW=require('./diffs/index.js');

$(function(){
  show.renderHtml(indexpage);
  list();
	indexW.indexStart();
})

