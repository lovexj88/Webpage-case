var $=require('../libs/jquery-3.1.0.min.js');

var common={
  renderHtml:function(str){
    $('body').prepend(str);
  }
}

module.exports=common;
