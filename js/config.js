
function func_plain(v) { return v; }
function func_hex(v) { return v.toString(16).toUpperCase(); }
function func_version(v) { return "v" + v; }
function func_symbols(v) { return ["No"][v]; }
function func_bool(v) { return ["No", "Yes"][v]; }
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

var categories = [
	0, 0, 0, 0, 0, 0,
	1, 1, 1, 1, 1,
	2, 2, 2, 2, 2, 2, 2, 2, 2,
	3, 3, 3, 3, 3, 3, 3, 3,
	4, 4, 4, 4, 4, 4,
	5, 5, 5, 5, 5,
	6, 6,
	7, 7, 7
];

var attribnames = [
	"name", "aid", "av", "syms", "path", "sdk",
	
	"nsosize", "textsize", "rodatasize", "datasize", "bsssize",
	
	"nex", "nexrk", "nexr2", "nexds", "nexmm", "nexut",
	"nexss", "nexsc", "nexco",
	
	"piacommon", "piatransport", "piasession", "pialan",
	"pialocal", "pianex", "piaclone", "piasync",
	
	"sead", "agl", "aal", "xlink2", "lp2", "enl",
	
	"nwatk", "nwg3d", "nwui2d", "nwfont", "nwvfx2",
	
	"libcurl", "libz",
	
	"iwnn", "havokanim", "havokcloth"
];

var labels = [
	"Name", "Title ID", "Version", "Symbols", "Path", "SDK",
	
	"NSO", ".text", ".rodata", ".data", ".bss",
	
	"NEX", "NEX-RK", "NEX-R2", "NEX-DS", "NEX-MM", "NEX-UT",
	"NEX-SS", "NEX-SC", "NEX-CO",
	
	"PIA-Common", "PIA-Transport", "PIA-Session",
	"PIA-LAN", "PIA-Local", "PIA-NEX", "PIA-Clone",
	"PIA-Sync",
	
	"SEAD", "AGL", "AAL", "XLINK2", "LP2", "ENL",
	
	"NW4F-ATK", "NW4F-G3D", "NW4F-UI2D", "NW4F-FONT", "NW4F-VFX2",
	
	"libcurl", "libz",
	
	"iWnn", "Havok-Animation", "Havok-Cloth"
];

var checked = [
	true, true, true, true, false, true,
	
	false, false, false, false, false,
	
	true, false, false, false, false, false,
	false, false, false,
	
	true, false, false, false, false, false, false, false,
	
	false, false, false, false, false, false,
	
	false, false, false, false, false,
	
	false, false,
	
	false, false, false
];

var attribfuncs = [
	func_plain, func_hex, func_version, func_symbols, func_plain, func_lib,
	
	func_size, func_size, func_size, func_size, func_size,
	
	func_lib, func_lib, func_lib, func_lib, func_lib, func_lib,
	func_lib, func_lib, func_lib,
	
	func_lib, func_lib, func_lib, func_lib,
	func_lib, func_lib, func_lib, func_lib,
	
	func_bool, func_bool, func_bool, func_bool, func_bool, func_bool,
	
	func_lib, func_lib, func_lib, func_lib, func_lib, func_lib,
	
	func_lib, func_lib,
	
	func_lib, func_lib, func_lib
]

var sortfuncs = [
	sort_plain, sort_plain, sort_plain, sort_plain, sort_plain, sort_lib,
	
	sort_plain, sort_plain, sort_plain, sort_plain, sort_plain,
	
	sort_lib, sort_lib, sort_lib, sort_lib, sort_lib, sort_lib,
	sort_lib, sort_lib, sort_lib,
	
	sort_lib, sort_lib, sort_lib, sort_lib, 
	sort_lib, sort_lib, sort_lib, sort_lib,
	
	sort_plain, sort_plain, sort_plain, sort_plain, sort_plain, sort_plain,
	
	sort_lib, sort_lib, sort_lib, sort_lib, sort_lib,
	
	sort_lib, sort_lib,
	
	sort_lib, sort_lib, sort_lib
];
