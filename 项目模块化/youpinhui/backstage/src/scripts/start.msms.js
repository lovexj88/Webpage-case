var $=require('./libs/jquery-3.1.0.min.js');

var msmspage=require('./tmpls/msms.string');

var show=require('./commons/showpage.js');


var msmsW=require('./diffs/msms.js');

var list=require('./modules/msmsSet.js');

$(function(){
  show.renderHtml(msmspage);
  list();
	msmsW.msmsStart();
})
