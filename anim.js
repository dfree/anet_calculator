(function ($) {
	window.onload = function(e) {
		var init;
		
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
		


		init = function() {
			TweenPlugin.activate([CSSPlugin]);
			$.id("wrapper").style.display = "block";
			reset();
			parser(1);
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


			for(key in data){
				var cost = data[key][r];
				$.id("saving_"+key).innerHTML = '£'+(ranges[r][1]*50+70 - (cost*ranges[r][1]));
				$.id("time_"+key).innerHTML = 4*ranges[r][1]+' HRS';
				$.id("cost_"+key).innerHTML = '£'+cost;
				$.id("salary_"+key).innerHTML = '£'+70*ranges[r][1];
			}

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