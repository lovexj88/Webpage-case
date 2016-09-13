		
			var bigImg=document.getElementById("imgBig");
			var smallImg=document.getElementById("jingxuanSmall");
			var imgList=smallImg.getElementsByTagName("img");
			var index=1;
			
			timer=setInterval(function(){
				bigImg.src="img/jingxuanBig"+index+".jpg";
				index++;
				if(index>6){
					index=1;
				}
			},2000);
			
			for(var i=0;i<imgList.length;i++){
				imgList[i].index=i;
				imgList[i].onmouseover=function(){
					var imgSrc=this.src.replace("Small","Big");
					bigImg.src=imgSrc;
					index=this.index+1;
					if(index>6){
						index=1;
					}
				};
			}
			
			$("#jingxuanBig a").on("click",function(){
				switch(index){
					case 1:
						$(this).attr("href","detail.html?id=11009");
						break;
					case 2:
						$(this).attr("href","detail.html?id=52003");
						break;
					case 3:
						$(this).attr("href","detail.html?id=12002");
						break;
					case 4:
						$(this).attr("href","detail.html?id=23002");
						break;
					case 5:
						$(this).attr("href","detail.html?id=23003");
						break;
					case 6:
						$(this).attr("href","detail.html?id=42008");
						break;
				}
			})
			
