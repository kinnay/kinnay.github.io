
function getGameList(sortFunc) {
	var list = games.slice();
	list.sort(sortFunc);
	return list;
}

function prepareGames(callback) {
	var req = new XMLHttpRequest();
	req.overrideMimeType("application/json");
	req.onload = function() {
		games = JSON.parse(req.responseText);
		callback();
	};
	req.open("GET", "data/games.json");
	req.send();
}
