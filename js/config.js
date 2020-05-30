
var Cat = {
	Common: 0,
	Size: 1,
	NEX: 2,
	PIA: 3,
	Priv: 4,
	NW4F: 5,
	SDK: 6,
	Lib: 7,
	Other: 8
};

function func_plain(v) { return v; }
function func_hex(v) { return v.toString(16).toUpperCase().padStart(16, '0'); }
function func_version(v) { return "v" + v; }
function func_symbols(v) { return ["No"][v]; }
function func_bool(v) { return v ? "Yes" : "No"; }
function func_size(v) {
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
}
function func_lib(v) {
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

function sort_plain(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

function sort_lib(a, b) {
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

function attrib(cat, name, lbl, checked, fmt, sort) {
	return {
		cat: cat,
		name: name,
		label: lbl,
		checked: checked,
		fmt: fmt,
		sort: sort
	}
}

var attribs = [
	attrib(Cat.Common, "name", "Name", true, func_plain, sort_plain),
	attrib(Cat.Common, "aid", "Title ID", true, func_hex, sort_plain),
	attrib(Cat.Common, "av", "Version", true, func_version, sort_plain),
	attrib(Cat.Common, "syms", "Symbols", true, func_size, sort_plain),
	attrib(Cat.Common, "path", "Path", false, func_plain, sort_plain),
	attrib(Cat.Common, "sdk", "SDK", true, func_lib, sort_lib),
	attrib(Cat.Size, "nsosize", "NSO", false, func_size, sort_plain),
	attrib(Cat.Size, "textsize", ".text", false, func_size, sort_plain),
	attrib(Cat.Size, "rodatasize", ".rodata", false, func_size, sort_plain),
	attrib(Cat.Size, "datasize", ".data", false, func_size, sort_plain),
	attrib(Cat.Size, "bsssize", ".bss", false, func_size, sort_plain),
	attrib(Cat.NEX, "nex", "NEX", true, func_lib, sort_lib),
	attrib(Cat.NEX, "nexrk", "NEX-RK", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexr2", "NEX-R2", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexds", "NEX-DS", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexmm", "NEX-MM", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexut", "NEX-UT", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexss", "NEX-SS", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexsc", "NEX-SC", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexco", "NEX-CO", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexvs", "NEX-VS", false, func_lib, sort_lib),
	attrib(Cat.PIA, "pia", "PIA", true, func_lib, sort_lib),
	attrib(Cat.PIA, "piacommon", "PIA-Common", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piatransport", "PIA-Transport", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piasession", "PIA-Session", false, func_lib, sort_lib),
	attrib(Cat.PIA, "pialan", "PIA-Lan", false, func_lib, sort_lib),
	attrib(Cat.PIA, "pialocal", "PIA-Local", false, func_lib, sort_lib),
	attrib(Cat.PIA, "pianex", "PIA-Nex", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piainet", "PIA-Inet", false, func_lib, sort_lib),
	attrib(Cat.PIA, "pianat", "PIA-Nat", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piaclone", "PIA-Clone", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piasync", "PIA-Sync", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piachat", "PIA-Chat", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piaframework", "PIA-Framework", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piareckoning", "PIA-Reckoning", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piatune", "PIA-Tune", false, func_lib, sort_lib),
	attrib(Cat.Priv, "sead", "SEAD", false, func_bool, sort_plain),
	attrib(Cat.Priv, "agl", "AGL", false, func_bool, sort_plain),
	attrib(Cat.Priv, "aal", "AAL", false, func_bool, sort_plain),
	attrib(Cat.Priv, "xlink2", "XLINK2", false, func_bool, sort_plain),
	attrib(Cat.Priv, "lp2", "LP2", false, func_bool, sort_plain),
	attrib(Cat.Priv, "enl", "ENL", false, func_bool, sort_plain),
	attrib(Cat.NW4F, "nwatk", "NW4F-ATK", false, func_lib, sort_lib),
	attrib(Cat.NW4F, "nwg3d", "NW4F-G3D", false, func_lib, sort_lib),
	attrib(Cat.NW4F, "nwui2d", "NW4F-UI2D", false, func_lib, sort_lib),
	attrib(Cat.NW4F, "nwfont", "NW4F-FONT", false, func_lib, sort_lib),
	attrib(Cat.NW4F, "nwvfx", "NW4F-VFX", false, func_lib, sort_lib),
	attrib(Cat.NW4F, "nwvfx2", "NW4F-VFX2", false, func_lib, sort_lib),
	attrib(Cat.SDK, "libcurl", "libcurl", false, func_lib, sort_lib),
	attrib(Cat.SDK, "libz", "libz", false, func_lib, sort_lib),
	attrib(Cat.SDK, "gfx", "gfx", false, func_lib, sort_lib),
	attrib(Cat.Lib, "glew", "glew", false, func_lib, sort_lib),
	attrib(Cat.Lib, "lz4", "lz4", false, func_lib, sort_lib),
	attrib(Cat.Other, "unity", "Unity", false, func_lib, sort_lib),
	attrib(Cat.Other, "unreal", "Unreal", false, func_lib, sort_lib),
	attrib(Cat.Other, "gamemaker2", "Game Maker 2", false, func_lib, sort_lib),
	attrib(Cat.Other, "physx", "PhysX", false, func_lib, sort_lib),
	attrib(Cat.Other, "iwnn", "iWnn", false, func_lib, sort_lib),
	attrib(Cat.Other, "havokanim", "Havok-Animation", false, func_lib, sort_lib),
	attrib(Cat.Other, "havokcloth", "Havok-Cloth", false, func_lib, sort_lib),
];
