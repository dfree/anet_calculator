(function ($) {
	window.onload = function(e) {
		var init, W, H;
		var W = 738;
		var H = 500;

		var printer = [
			{
				output:"Number of drivers trained: ",
				calc: function(n, _ranges, _data){return n}
			},
			{
				output:"Monthly subscription: ",
				calc: function(n, _ranges, _data){
					var r = -1;
					var c = 0;
					while(r < 0 && c < _ranges.length){
						if(n >= _ranges[c][0] && n <= _ranges[c][1]){
							r = c;
						}
						c++;
					}
					return "£"+(Math.round((_ranges[r][1]*_data[r]/12)*10)/10);
				}
			},
			{
				output:"Yearly subscription: ",
				calc: function(n, _ranges, _data){
					var r = -1;
					var c = 0;
					while(r < 0 && c < _ranges.length){
						if(n >= _ranges[c][0] && n <= _ranges[c][1]){
							r = c;
						}
						c++;
					}
					return "£"+(_ranges[r][1]*_data[r]);
				}
			},
			{
				output:"Savings over SUD: ",
				calc: function(n, _ranges, _data){
					var r = -1;
					var c = 0;
					while(r < 0 && c < _ranges.length){
						if(n >= _ranges[c][0] && n <= _ranges[c][1]){
							r = c;
						}
						c++;
					}
					return "£"+(150*_ranges[r][1]-_ranges[r][1]*_data[r]);
				}
			}

		];
		var ranges = [
			[6,10],
			[11,25],
			[26,50],
			[51,100],
			[101,200],
			[201,1000],
			[1001,5000]
		];

		var data = {
			workshop:{
				basic:[	
					45.5,
					43,
					41,
					39.5,
					37,
					35,
					33
				],
				pro:[
					57.5,
					57,
					55,
					52.5,
					47.5,
					42.5,
					41.5
				]
			},
			licence:{
				basic:[	
					30,
					30,
					27.5,
					25,
					22.5,
					20,
					17.5
				],
				pro:[
					37.5,
					35,
					32.5,
					30,
					27.5,
					25,
					22.5
				]
			}

		}
		var gap = 10;
		var passive_y = 80;
		var element_height = 60;
		var details_height = 300;
		var details_top = 80;
		var elements = [
			"calc_main_buttons",
			"calc_sub_buttons",
			"calc_fors",
			"calc_input"
		];
		var elements_data = {};
		var state = 0;

		var small_setup = {
			width: (W-5*gap)/3,
			height: 36,
		}
		init = function() {
			TweenPlugin.activate([CSSPlugin]);
			$.id("wrapper").style.display = "block";
			reset();
			loadNew(0);
			//$.id("wrapper").innerHTML = "Hello";
		}();

		function handleSlider(e){
			var val = $.id("calc_slider").value;
			$.id("calc_drivers_num").innerHTML = val + (val == 1001 ? "+" : "");
		}
		function reset() {
			$.set("calc_slider", {x:gap, y:320, width:W-4*gap});
			$.id("calc_slider").addEventListener("input", handleSlider);
			$.set("calc_drivers_num", {y:40, color:"#777777"});
			$.set("calc_cover", {autoAlpha:0});
			$.id("calc_close").addEventListener("click", closeParser);
			$.set("calc_input_submit", {
				x:gap+small_setup.width+gap,
				y:345,
				width:small_setup.width,
				height:small_setup.height,
				borderRadius:"25px 25px 25px 25px"
			})
			$.id("calc_input_submit").addEventListener("click", parser);

			for(var i = 0; i < elements.length; i++){
				var full_width = W-2*gap;
				$.set(elements[i], {
					width:full_width,
					height:0,
					x:gap,
					y:passive_y,
					autoAlpha: 0
				});
				if(elements[i] != "calc_input"){
					$.id(elements[i]+"_0").classList.add("button");
					$.id(elements[i]+"_0").addEventListener("click", clicked);
					$.set(elements[i]+"_0", {
						x:0,
						y:0,
						width:full_width/2,
						height:element_height,
						borderRadius:"25px 0px 0px 25px"
					});
					$.id(elements[i]+"_1").classList.add("button");
					$.id(elements[i]+"_1").addEventListener("click", clicked);
					$.set(elements[i]+"_1", {
						x:full_width/2,
						y:0,
						width:full_width/2,
						height:element_height,
						borderRadius:"0px 25px 25px 0px"
					});
					if($.id(elements[i]+"_0_details")){
						$.id(elements[i]+"_0_details").classList.add("details");
						$.set(elements[i]+"_0_details", {
							x:0,
							y:details_top,
							width:full_width/2,
							height:details_height,
							borderRadius:"25px 0px 0px 25px"
						});
					}
					if($.id(elements[i]+"_1_details")){
						$.id(elements[i]+"_1_details").classList.add("details");
						$.set(elements[i]+"_1_details", {
							x:full_width/2,
							y:details_top,
							width:full_width/2,
							height:details_height,
							borderRadius:"0px 25px 25px 0px"
						});
					}
				}
			}
		};

		function clicked(e){
			console.log(e.currentTarget.id);
			var group = e.currentTarget.id.slice(0,-2);
			var side = parseInt(e.currentTarget.id.slice(-1));
			var pair = side ? 0 : 1;

			if(elements_data[group] == side){
				console.log("back");
				loadNew(elements.indexOf(group));
			}else{
				e.currentTarget.classList.add("active");
				elements_data[group] = side;
				var indx = elements.indexOf(group);
				$.tween(e.currentTarget, 0.6, {
					x:gap+(indx*small_setup.width)+(indx*gap),
					y:gap,
					width:small_setup.width,
					height:small_setup.height,
					borderRadius:"25px 25px 25px 25px",
					ease:Power2.easeOut
				});
				$.tween(group, 0.6, {
					x:0,
					y:0,
					width:small_setup.width,
					ease:Power2.easeInOut
				});
				$.tween(group+"_"+pair, 0.4, {autoAlpha:0, ease:Power2.easeOut});
				
				if($.id(group+"_0_details")){
					$.tween(group+"_0_details", 0.4, {autoAlpha:0, ease:Power2.easeOut});
				}
				if($.id(group+"_1_details")){
					$.tween(group+"_1_details", 0.4, {autoAlpha:0, ease:Power2.easeOut});
				}
				loadNew(indx+1);
			}
		}
		function loadNew(i){
			var full_width = W-2*gap;
			$.tween(elements[i], 0.8, {
				autoAlpha:1,
				x:gap,
				y:passive_y,
				width:full_width,
				ease:Power1.easeInOut
			});
			if(elements[i] != "calc_input"){
				$.id(elements[i]+"_0").classList.remove("active");
				$.tween(elements[i]+"_0", 0.8, {
					autoAlpha:1,
					x:0,
					y:0,
					width:full_width/2,
					height:element_height,
					borderRadius:"25px 0px 0px 25px",
					ease:Power2.easeInOut

				});
				if($.id(elements[i]+"_0_details")){
					$.tween(elements[i]+"_0_details", 0.8, {autoAlpha:1, ease:Power2.easeInOut});
				}
				$.id(elements[i]+"_1").classList.remove("active");
				$.tween(elements[i]+"_1", 0.8, {
					autoAlpha:1,
					x:full_width/2,
					y:0,
					width:full_width/2,
					height:element_height,
					borderRadius:"0px 25px 25px 0px",
					ease:Power2.easeInOut
				});
				if($.id(elements[i]+"_1_details")){
					$.tween(elements[i]+"_1_details", 0.8, {autoAlpha:1, ease:Power2.easeInOut});
				}
			}
			for(var r = i; r < elements.length; r++){
				elements_data[elements[r]] = null;
				if(r != i){
					$.tween(elements[r], 0.4, {autoAlpha:0});
				}
			}
			if(i == 0){
				$.tween("calc_title", 0.4, {autoAlpha:1, ease:Power2.easeOut});
			}else{
				$.tween("calc_title", 0.4, {autoAlpha:0, ease:Power2.easeOut});
			}
		};
		function parser(){
			var html = "";
			var driver_num = parseInt($.id("calc_drivers_num").innerHTML);
			var _data = data[elements_data["calc_main_buttons"] == 0 ? "workshop" : "licence"][elements_data["calc_sub_buttons"] == 0 ? "basic" : "pro"];
			for(var i = 0; i < printer.length; i++){
				html += "<div>"+printer[i].output +"<span>"+printer[i].calc(driver_num, ranges, _data)+"</span></div>";
			}
			$.id("calc_cover_output").innerHTML = html;
			$.tween("calc_cover", 0.8, {autoAlpha:1, ease:Power1.easeInOut});
			console.log(html);
		}
		function closeParser(){
			$.tween("calc_cover", 0.6, {autoAlpha:0, ease:Power1.easeInOut});
		}
	}
})({
	id: function(name){
		return document.getElementById(name);
	},
	delay: function(time, func, props){
		var prp = props || [];
		TweenLite.delayedCall(time, func, prp);
	},
	from: function(name, time, props){
		return TweenLite.from(typeof name === 'string' ? this.id(name) : name, time, props);
	},
	tween: function(name, time, props){
		return TweenLite.to(typeof name === 'string' ? this.id(name) : name, time, props);
	},
	set: function(name, props){
		return TweenLite.set(typeof name === 'string' ? this.id(name) : name, props);
	},
	create: function(name, parent, props, src){
		var elem = document.createElement(src ? 'img' : 'div');
		if(src){
			elem.src = src;
		}
		elem.id = name;
		this.id(parent).appendChild(elem);
		props = props || {};
		this.set(elem, props);
		return elem;
	},
	kill: function(name){
		return TweenLite.killTweensOf(typeof name === 'string' ? this.id(name) : name);
	}
});