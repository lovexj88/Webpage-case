var $=require('./libs/jquery-3.1.0.min.js');

var mlcdpage=require('./tmpls/mlcd.string');

var show=require('./commons/showpage.js');

var mlcdW=require('./diffs/mlcd.js');

var list=require('./modules/mlcdSet.js');

$(function(){
  show.renderHtml(mlcdpage);
  list();
	mlcdW.mlcdStart();
})

