

globalThis.$copy = (a1, a2)=>
{
	if(typeof a1 === "object" )
	{
				
		for(var i in a1)
		{
			if(typeof a1[i] === "object")
			{
				a2[i] = {};
				$copy(a1[i], a2[i]);
			}
			else
			{
				a2[i] = a1[i];
			}
		}
	}
	else
	{
		a2 = a1;
	}
};

globalThis.$new = (t, appendto)=>
{
	var d = document.createElement(t.$type);
	for(var i in t)
	{
		if(i != "$type")
		{
			if(typeof t[i] === "object")
			{
				$copy(t[i], d[i]);
			}
			else
			{
				d[i] = t[i];
			}
		}
	}			
	$q(appendto).appendChild(d);
	return d;
	
};
		


globalThis.$msgc= (()=>
{
	var calls={};
	var o;
	o=(id, ...args)=>
	{
			if(calls[id])
			{
				var a = calls[id];
				var l= a.length;
				for(var i=0; i<l;i++)
				{
					a[i].apply(null, args)
				}
				
			}			
				
	};
	o.add=(id, func)=>
	{
		if(!calls[id]) calls[id]=[];
		calls[id].push(func);
	};
	o.remove=(id, func)=>
	{
		var a=calls[id];
		var l=a.length;
		for(var i=0; i< l;i++)
		{
			if(a[i]===func)
			{
				calls[id].splice(i,1);
				break;
			}
		}
				
	};
	o.run = (text)=>
		{
			var a = text.split("\n").filter(n => n.trim() !== "").map(t=> t.trim());
			var l = a.length;
			for(var i = 0; i < l; i++)
			{
				//alert("|"+a[i]+"|");
				eval(`$msgc(${a[i]});`);
			}
			
		};
			
	return o;
})();
		
globalThis.$q=(id, val)=>
{
	return document.querySelector(id);
}

globalThis.$qa=(id, val)=>
{
	return document.querySelectAll(id);
}

globalThis.$getLib = (path, isasync)=>
{
	if(isasync == undefined)isasync = true;
	$new({
		$type: "script",
		type: "module",
		src: path,
		async: isasync
	}, "head");		
}

globalThis.$getMap = (path, isasync)=>
{
	if(isasync == undefined)isasync = false;
	$new({
		$type: "script",
		type: "importmap",
		src: path,
		async: isasync
	}, "head");		
}