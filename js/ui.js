
// Static content

var sortIndex = 0;
var sortReverse = false;

var checkboxes = [];

function createCheckbox(cat, name, checked) {
	var box = document.createElement("input");
	box.checked = checked;
	box.type = "checkbox";
	box.onchange = updateUI;
	
	var label = document.createElement("label");
	label.appendChild(box);
	label.insertAdjacentHTML("beforeend", " " + name);
	
	var outer = document.getElementById("cats").children[cat + 1];
	
	var div = document.createElement("div");
	div.className = "checkbox";
	outer.appendChild(div);
	
	div.appendChild(label);
	
	checkboxes.push(box);
	
	return box;
}

function prepareUI() {
	for (var i = 0; i < attribnames.length; i++) {
		createCheckbox(categories[i], labels[i], checked[i]);
	}
}


// Dynamic content

function generateHeaders() {
	var headers = [];
	for (var i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			headers.push([i, labels[i]]);
		}
	}
	return headers;
}

function generateGame(game) {
	var elems = [];
	
	for (var i = 0; i < attribnames.length; i++) {
		if (checkboxes[i].checked) {
			var v = game[attribnames[i]];
			if (v == undefined) {
				elems.push("?");
			}
			else {
				elems.push(attribfuncs[i](game[attribnames[i]]));
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
	
	var v1 = a[attribnames[sortIndex]];
	var v2 = b[attribnames[sortIndex]];
	
	if (v1 == undefined) return -1;
	if (v2 == undefined) return 1;
	
	return sortfuncs[sortIndex](v1, v2);
}

function generateGames() {
	var rows = [];
	var games = getGameList(sortFunc);
	for (var i = 0; i < games.length; i++) {
		var game = games[i];
		rows.push(generateGame(game));
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
