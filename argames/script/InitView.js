var InitStatView = ()=>
{	
	var statdom = $new({
		$type: "span",
		style:{
			position: "absolute",
			top: 0,
			left: 0,
			backgroundColor: "#000",
			zIndex: 1
		}
	}, "body");	
			
	var statupdate = (time)=>
	{
		statdom.innerHTML = time + "";
	};
	
	$msgc.add("world animate", statupdate);
	
};
$msgc.add("init view", InitStatView);
		
//alert("initview");		