
sortIndex = 0;
sortReverse = false;

formatters = [
	function(v) { return v; },
	function(v) {
		return v.toString(16).toUpperCase().padStart(16, '0');
	},
	function(v) {
		return v.toString(16).toUpperCase().padStart(16, '0');
	},
	function(v) { return v ? "Yes" : "No"; },
	function(v) { return "v" + v; },
	function(v) {
		var steps = 0;
		var frac = 0;
		while (v >= 1000) {
			frac = v % 1000;
			v = Math.floor(v / 1000);
			steps++;
		}
		
		if (steps == 0) return v + " B";
		else {
			return v + "." + Math.floor(frac / 100) + " " + ["KB", "MB", "GB"][steps - 1];
		}
	},
	function(v) {
		if (v.length == 0) return "";
		
		var s = "";
		for (var i = 0; i < v[0].length; i++) {
			if (i != 0) {
				s += ".";
			}
			s += v[0][i];
		}
		
		if (v.length == 2) {
			s += "-" + v[1];
		}
		
		return s;
	}
]

function formatField(game, field) {
	var value = game[field.key];
	return formatters[field.type](value);
}

function sortPlain(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

function sortTitleId(a, b) {
	var tida = (a >> 7) & 0x1FFFFFF;
	var tidb = (b >> 7) & 0x1FFFFFF;
	return sortPlain(tida, tidb);
}

function sortLib(a, b) {
	if (a.length == 0) return -1;
	if (b.length == 0) return 1;
	
	for (var i = 0; i < a[0].length; i++) {
		if (a[0][i] < b[0][i]) return -1;
		if (a[0][i] > b[0][i]) return 1;
	}
	
	if (a.length != 2) return -1;
	if (b.length != 2) return 1;
	
	if (a[1] < b[1]) return -1;
	if (a[1] > b[1]) return 1;
	return 0;
}

sorters = [
	sortPlain, sortPlain, sortTitleId, sortPlain, sortPlain, sortPlain, sortLib
]

function sortFunc(a, b) {
	if (sortReverse) {
		var t = a;
		a = b;
		b = t;
	}
	
	var v1 = a[info.fields[sortIndex].key];
	var v2 = b[info.fields[sortIndex].key];
	
	return sorters[info.fields[sortIndex].type](v1, v2);
}

function filterCheck(game) {
	for (var i = 0; i < filters.length; i++) {
		var input = filters[i];
		var filter = info.filters[i];
		if (filter.type == "checkbox" && !input.checked) {
			continue;
		}
		if (!eval(filter.filter)) {
			return false;
		}
	}
	return true;
}

function filterGames(games) {
	var filtered = [];
	for (var i = 0; i < games.length; i++) {
		var game = games[i];
		if (filterCheck(game)) {
			filtered.push(game);
		}
	}
	filtered.sort(sortFunc);
	return filtered;
}

function updateUI() {
	var table = document.getElementById("main");
	table.innerHTML = "";
	
	var head = table.insertRow(0);
	for (var i = 0; i < info.fields.length; i++) {
		if (checkboxes[i].checked) {
			var field = info.fields[i];
			var th = document.createElement("th");
			var a = document.createElement("a");
			a.index = i;
			a.innerHTML = field.name;
			if (sortIndex == a.index) {
				if (sortReverse) {
					a.innerHTML += " \\/";
				}
				else {
					a.innerHTML += " /\\";
				}
			}
			a.onclick = function() {
				if (this.index == sortIndex) {
					sortReverse = !sortReverse;
				}
				else {
					sortIndex = this.index;
					sortReverse = false;
				}
				updateUI();
			}.bind(a);
			th.appendChild(a);
			head.appendChild(th);
		}
	}
	
	var games = filterGames(info.games);
	for (var i = 0; i < games.length; i++) {
		var game = games[i];
		var row = table.insertRow(-1);
		for (var j = 0; j < info.fields.length; j++) {
			if (checkboxes[j].checked) {
				var field = info.fields[j];
				var td = document.createElement("td");
				td.innerHTML = formatField(game, field);
				row.appendChild(td);
			}
		}
	}
}

var checkboxes = [];
var categories = [];
var filters = [];

function prepareField(field) {
	var box = document.createElement("input");
	box.setAttribute("type", "checkbox");
	box.checked = field.state;
	box.onchange = updateUI;
	checkboxes.push(box);
	
	var label = document.createElement("label");
	label.appendChild(box);
	label.insertAdjacentHTML("beforeend", " " + field.name);
	
	var div = document.createElement("div");
	div.className = "checkbox";
	div.appendChild(label);
	categories[field.category].appendChild(div);
}

function prepareCategory(elem, cat) {
	var fs = document.createElement("fieldset");
	fs.setAttribute("class", "checkboxes");
	
	var legend = document.createElement("legend");
	legend.innerHTML = cat + ":";
	fs.appendChild(legend);
	
	categories.push(fs);
	
	elem.appendChild(fs);
}

function prepareFilter(elem, filter) {
	var div = document.createElement("filter");
	div.setAttribute("class", "filter");
	div.innerHTML = filter.name + ": ";
	
	var input = document.createElement("input");
	input.setAttribute("type", filter.type);
	if (filter.type == "text") {
		input.oninput = updateUI;
	}
	else {
		input.onchange = updateUI;
	}
	div.appendChild(input);
	
	filters.push(input);
	
	elem.appendChild(div);
}

function prepareCategories() {
	var elem = document.getElementById("cats");
	for (var i = 0; i < info.categories.length; i++) {
		var cat = info.categories[i];
		prepareCategory(elem, cat);
	}
	for (var i = 0; i < info.fields.length; i++) {
		prepareField(info.fields[i]);
	}
}

function prepareFilters() {
	var elem = document.getElementById("filters");
	for (var i = 0; i < info.filters.length; i++) {
		var filter = info.filters[i];
		prepareFilter(elem, filter);
	}
}

function prepareUI() {
	prepareCategories();
	prepareFilters();
	updateUI();
}


function download(path, callback) {
	var req = new XMLHttpRequest();
	req.overrideMimeType("application/json");
	req.onload = function() {
		callback(JSON.parse(req.responseText));
	};
	req.open("GET", path);
	req.send();
}

pages = ["wiiu", "switch"];

url = new URL(window.location.href);
page = url.searchParams.get("page")

if (pages.includes(page)) {
	download("data/" + page + ".json", function(data) {
		info = data;
		prepareUI();
	});
}
else {
	document.documentElement.innerHTML = "<h1>Page not found</h1>";
}
