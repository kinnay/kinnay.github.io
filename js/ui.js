
// Static content

var sortIndex = 0;
var sortReverse = false;

var checkboxes = [];

function createCheckbox(attrib) {
	var box = document.createElement("input");
	box.checked = attrib.checked;
	box.type = "checkbox";
	box.onchange = updateUI;
	
	var label = document.createElement("label");
	label.appendChild(box);
	label.insertAdjacentHTML("beforeend", " " + attrib.label);
	
	var outer = document.getElementById("cats").children[attrib.cat + 1];
	
	var div = document.createElement("div");
	div.className = "checkbox";
	outer.appendChild(div);
	
	div.appendChild(label);
	
	checkboxes.push(box);
	
	return box;
}

function prepareFilters() {
	var name = document.getElementById("filter_name");
	name.oninput = updateUI;
	
	var syms = document.getElementById("filter_syms");
	syms.onchange = updateUI;
}

function prepareUI() {
	for (var i = 0; i < attribs.length; i++) {
		createCheckbox(attribs[i]);
	}
	prepareFilters();
}


// Dynamic content

function filterFunc(game) {
	var name = document.getElementById("filter_name");
	if (!game.name.toLowerCase().includes(name.value.toLowerCase())) {
		return false;
	}
	
	var syms = document.getElementById("filter_syms");
	if (syms.checked && game.syms < 1000000) {
		return false;
	}
	
	return true;
}

function generateHeaders() {
	var headers = [];
	for (var i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			headers.push([i, attribs[i].label]);
		}
	}
	return headers;
}

function generateGame(game) {
	var elems = [];
	
	for (var i = 0; i < attribs.length; i++) {
		if (checkboxes[i].checked) {
			var v = game[attribs[i].name];
			if (v == undefined) {
				elems.push("?");
			}
			else {
				elems.push(attribs[i].fmt(game[attribs[i].name]));
			}
		}
	}
	
	return elems;
}

function sortFunc(a, b) {
	if (sortReverse) {
		var t = a;
		a = b;
		b = t;
	}
	
	var v1 = a[attribs[sortIndex].name];
	var v2 = b[attribs[sortIndex].name];
	
	if (v1 == undefined) return -1;
	if (v2 == undefined) return 1;
	
	return attribs[sortIndex].sort(v1, v2);
}

function generateGames() {
	var rows = [];
	var games = getGameList(sortFunc);
	for (var i = 0; i < games.length; i++) {
		var game = games[i];
		if (filterFunc(game)) {
			rows.push(generateGame(game));
		}
	}
	return rows;
}

function updateUI() {
	var headers = generateHeaders();
	var games = generateGames();
	
	var table = document.getElementById("main");
	table.innerHTML = "";
	
	var head = table.insertRow(0);
	for (var i = 0; i < headers.length; i++) {
		var th = document.createElement("th");
		var a = document.createElement("a");
		a.index = headers[i][0];
		a.innerHTML = headers[i][1];
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
	
	for (var i = 0; i < games.length; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < games[i].length; j++) {
			var td = document.createElement("td");
			td.innerHTML = games[i][j];
			row.appendChild(td);
		}
	}
}
