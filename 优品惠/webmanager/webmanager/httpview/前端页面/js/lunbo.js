			var div=document.getElementById("banner");
			var ulImg=document.getElementById("ulImg");
			var ulA=document.getElementById("ulA");
			var timer;
			var pageIndex=1;
			var flag=true;
			
			aListBgColor(0);
			timer=setInterval(function(){
				if(flag){
					move(pageIndex);
				}
			},4000);
			div.onmouseover=function(){
				flag=false;
			}
			div.onmouseout=function(){
				flag=true;
			}
			for(var i=0;i<ulA.children.length;i++){
				ulA.children[i].index=i;
				ulA.children[i].onmouseover=function(){
					pageIndex=this.index;
					move();
					flag=false;
				}
				ulA.children[i].onmouseout=function(){
					flag=true;
				}
			}
			
			function move(){
				if(pageIndex>4){
					pageIndex=1;
					ulImg.style.left="-320px";
				}
				if(pageIndex<1){
					pageIndex=4;
					ulImg.style.left="-4160px";
				}
				var target={
					"left":-1920*pageIndex-320,
				}
				moveStart(ulImg,target);
				if(pageIndex==4){
					aListBgColor(0);
				}
				else{
					aListBgColor(pageIndex);
				}
				pageIndex++;
			}
			
			function aListBgColor(index){
				for(var i=0;i<ulA.children.length;i++){
					ulA.children[i].style.background="url(img/scroll.png) -190px -26px";
				}
				ulA.children[index].style.background="url(img/scroll.png) -190px 0";
			}
			
			$("#left").click(function(){
				pageIndex-=2;
				move();
				return false;
			})
			
			$("#right").click(function(){
				move();
				return false;
			})
			
			

