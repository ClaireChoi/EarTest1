/*! 
 * PLAYRTC. PLAYRTC is WebRTC SDK.
 * Copyright 2013, 2014 Heo Youngnam
 * 
 * project: PLAYRTC LOG VIEW
 * version: 1.0.0
 * contact: cryingnavi@gmail.com
 * homepage: http://www.playrtc.com
 */
(function(){
	var templates = "{0}{1}",
		COLORS = {
			trace: "#3767b8",
			warn: "#000000",
			error: "#dd4b39"
		},
		styles = [
	      	".log-container{position:absolute;left:0px;bottom:0px;width:100%;height:400px;display:none;background-color:#eee;overflow:hidden;z-index:99999;}",
	      	".log-header{height:40px;}",
	      	".log-header-filter{float:left;padding:5px;}",
	      	".log-header-control{float:right;padding:5px;}",
	      	".log-wrap{margin-top:15px;height:335px;overflow-y:auto;padding:10px;}"
	      ];

	var LogView = PlayRTC.utils.Extend(PlayRTC.utils.Event, {
		initialize: function(){
			this.logs = [];
			this.level = "all";
			this.container = document.createElement("div");
			this.container.className = "log-container";

			this.style = document.createElement("style");
			this.style.innerHTML = styles.join(" ");

			this.setUI();
		},
		setUI: function(){
			var el = PlayRTC.utils.strFormat(templates, function(){
				var btnWrap = '<div class="log-header">'
					+ '<div class="log-header-filter">{0}</div>'
					+ '<div class="log-header-control">{1}</div>'
					+ '</div>';

				return PlayRTC.utils.strFormat(btnWrap, function(){
					return '<button class="log-filter-btn" data-type="all" style="color:red;">All</button>'
						+ '<button class="log-filter-btn" data-type="trace">Trace</button>'
						+ '<button class="log-filter-btn" data-type="warn">Warn</button>'
						+ '<button class="log-filter-btn" data-type="error">Error</button>';
				}, function(){
					return '<button data-type="downloadAll">Download(10 Day)</button>'
						+ '<button data-type="download">Donwload</button>'
						+ '<button data-type="close">Close</button>';
				});
			}, function(){
				return '<div class="log-wrap"></div>';
			});
			
			this.container.innerHTML = el;
			this.logWrap = this.container.querySelector(".log-wrap");

			window.addEventListener("load", PlayRTC.utils.bind(function(){
				document.head.appendChild(this.style);
				document.body.appendChild(this.container);

				var btn = this.container.addEventListener("click", PlayRTC.utils.bind(function(e){
					var el = e.target;
					if(el.tagName !== "BUTTON"){
						if(el.tagName === "P"){
							var btns = this.container.querySelectorAll("p");
							for(var i=0; i<btns.length; i++){
								if(btns[i] === el){
									btns[i].style.backgroundColor = "yellow";
								}else{
									btns[i].style.backgroundColor = "transparent";
								}
							}
						}
						return false;
					}
					
					var type = el.dataset.type;
					if(type === "all"){
						this.filter("all");
					}
					else if(type === "trace"){
						this.filter("trace");
					}
					else if(type === "warn"){
						this.filter("warn");
					}					
					else if(type === "error"){
						this.filter("error");
					}
					else if(type === "downloadAll"){
						this.exportLogAll();
					}	
					else if(type === "download"){
						this.exportLog();
					}				
					else if(type === "close"){
						this.hide();
					}
					
					if(el.className === "log-filter-btn"){
						var btns = this.container.querySelectorAll(".log-filter-btn");
						for(var i=0; i<btns.length; i++){
							if(btns[i] === el){
								btns[i].style.color = "red";
							}else{
								btns[i].style.color = "#000";
							}
						}
					}

					return false;
				}, this), false);
			}, this), false);
		},
		filter: function(level){
			var i = 0,
				logs = this.logs,
				len = logs.length,
				html = "",
				color = "";

			for(; i<len; i++){
				switch(logs[i].level){
					case "trace":
						color = COLORS["trace"];
						break;
					case "error":
						color = COLORS["error"];
						break;
					default:
						color = COLORS["warn"];
						break;
				}
				if(level === "all"){
					html = html + '<p style="color:' + color + ';">' + logs[i].log + '</p>';
				}
				else{
					if(logs[i].level === level){
						html = html + '<p style="color:' + color + ';">' + logs[i].log + '</p>';
					}
				}
			}
			this.logWrap.innerHTML = html;
			this.level = level;
		},
		exportLog: function(){
			var i = 0,
				logs = this.logs,
				len = logs.length,
				logsData = [];

			if(this.level === "all"){
				for(var i=0; i<len; i++) {
					logsData.push(logs[i].log);
				}
			}
			else{
				for(var i=0; i<len; i++) {
					if(this.level === logs[i].level){
						logsData.push(logs[i].log);
					}
				}
			}
			
			var blob = new Blob(logsData, {
				type : "text/plain"
			});

			PlayRTC.utils.fileDownload(blob, "PlayRTC_log.txt");
		},
		exportLogAll: function(){
			PlayRTC.utils.exportLog();
		},
		show: function(){
			this.container.style.display = "block";
		},
		hide: function(){
			this.container.style.display = "none";
		},
		createEl: function(log){
			var p = document.createElement("p");
			p.innerHTML = log;
			return p;
		},
		trace: function(log){
			var el = this.createEl(log);
			el.style.color = COLORS["trace"];
			
			this.logs.push({ level: "trace", log: log});
			if(this.level === "all" || this.level === "trace"){
				this.logWrap.appendChild(el);
			}
		},
		warn: function(log){
			var el = this.createEl(log);
			el.style.color = COLORS["warn"];
			
			this.logs.push({ level: "warn", log: log});
			if(this.level === "all" || this.level === "warn"){
				this.logWrap.appendChild(el);
			}
		},
		error: function(log){
			var el = this.createEl(log);
			el.style.color = COLORS["error"];
			
			this.logs.push({ level: "error", log: log});
			if(this.level === "all" || this.level === "error"){
				this.logWrap.appendChild(el);
			}
		}
	});
	
	PlayRTC.loggers.monitor.view = new LogView();
})();

