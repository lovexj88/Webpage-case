var $=require('./libs/jquery-3.1.0.min.js');

var mflzpage=require('./tmpls/mflz.string');

var show=require('./commons/showpage.js');

var mflzW=require('./diffs/mflz.js');

var list=require('./modules/mflzSet.js');

$(function(){
  show.renderHtml(mflzpage);
  list();
	mflzW.mflzStart();
})

