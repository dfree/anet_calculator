(function ($) {
	window.onload = function(e) {
		var init, W, H;
		var W = 738;
		var H = 500;

		/*var printer = [
			{
				output:"Number of drivers trained: ",
				calc: function(n, _ranges, _data){return n}
			},
			{
				output:"Monthly subscription: ",
				calc: function(n, _ranges, _data){
					var r = getRange(n, _ranges);
					return "£"+(Math.round((_ranges[r][1]*_data[r]/12)*10)/10);
				}
			},
			{
				output:"Yearly subscription: ",
				calc: function(n, _ranges, _data){
					var r = getRange(n, _ranges);
					return "£"+(_ranges[r][1]*_data[r]);
				}
			},
			{
				output:"Savings over SUD: ",
				calc: function(n, _ranges, _data){
					var r = getRange(n, _ranges);
					return "£"+(150*_ranges[r][1]-_ranges[r][1]*_data[r]);
				}
			}

		];*/
		
		var ranges = [
			[1,10],
			[11,25],
			[26,50],
			[51,100],
			[101,200],
			[201,1000],
			[1001,5000]
		];

		var data = {
			basic:[	
				40,
				39.5,
				37,
				35,
				33,
				31,
				29
			],
			pro:[
				50,
				47,
				45.5,
				43,
				41,
				39.5,
				37
			]
		}
		var gap = 10;
		var passive_y = 80;
		var element_height = 60;
		var details_height = 300;
		var details_top = 80;
		var elements = [
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
			parser(1)
			//loadNew(0);
			//$.id("wrapper").innerHTML = "Hello";
		}();

		function handleSlider(e){
			parser($.id("calc_slider").value);
		}
		function reset() {
			$.id("calc_slider").addEventListener("input", handleSlider);
		};

		function loadNew(i){
		
			
			if(i == 0){
				$.tween("calc_title", 0.4, {autoAlpha:1, ease:Power2.easeOut});
			}else{
				$.tween("calc_title", 0.4, {autoAlpha:0, ease:Power2.easeOut});
			}
		};
		function parser(val){
			var max = 1000;
			var s_val = getSectionValue(val, ranges, max);
			var r = getRange(s_val, ranges);
			$.id("calc_drivers_num").innerHTML = ranges[r][1]+"<br/>DRIVERS";
			//$.id("calc_drivers_num").innerHTML = (val == max ? "5000+" : s_val)+"<br/>DRIVER"+(val != 1 ? "S" : "");

			

			for(key in data){
				var cost = data[key][r];
				$.id("saving_"+key).innerHTML = ranges[r][1]*50+70 - (cost*ranges[r][1]);
				$.id("time_"+key).innerHTML = 4*ranges[r][1];
				$.id("cost_"+key).innerHTML = '£'+cost;
				$.id("salary_"+key).innerHTML = 70*ranges[r][1];
			}

			/*for(var i = 0; i < printer.length; i++){
				html += "<div>"+printer[i].output +"<span>"+printer[i].calc(val, ranges, _data)+"</span></div>";
			}*/
			//$.id("calc_cover_output").innerHTML = html;
			//$.tween("calc_cover", 0.8, {autoAlpha:1, ease:Power1.easeInOut});
			//console.log(html);
		}
		function closeParser(){
			$.tween("calc_cover", 0.6, {autoAlpha:0, ease:Power1.easeInOut});
		}

		function getRange(n, _ranges){
			var r = -1;
			var c = 0;
			while(r < 0 && c < _ranges.length){
				if(n >= _ranges[c][0] && n <= _ranges[c][1]){
					r = c;
				}
				c++;
			}
			return r;
		}
		function getSelection(n, _ranges, max){
			var slice = Math.ceil(max/_ranges.length);
			return Math.floor(n/slice);
		}
		function getSectionValue(n, _ranges, max){
			var slice = Math.ceil(max/_ranges.length);
			var r = getSelection(n, _ranges, max);
			var perc = (n-r*slice)/slice
			return Math.round((_ranges[r][1] - _ranges[r][0])*perc+_ranges[r][0]);
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