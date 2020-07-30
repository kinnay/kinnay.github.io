
MIN_SYMBOLS = 200000

var Cat = {
	Common: 0,
	Size: 1,
	NEX: 2,
	PIA: 3,
	Priv: 4,
	FirstParty: 5,
	NW: 6,
	Havok: 7,
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
	attrib(Cat.Common, "name", "Short Name", true, func_plain, sort_plain),
	attrib(Cat.Common, "longname", "Long Name", false, func_plain, sort_plain),
	attrib(Cat.Common, "publisher", "Publisher", false, func_plain, sort_plain),
	attrib(Cat.Common, "code", "Product Code", false, func_plain, sort_plain),
	
	attrib(Cat.Common, "aid", "Title ID", true, func_hex, sort_plain),
	attrib(Cat.Common, "av", "Version", true, func_version, sort_plain),
	attrib(Cat.Common, "rpx", "Filename", true, func_plain, sort_plain),
	attrib(Cat.Common, "sdk", "SDK", true, func_lib, sort_lib),
	attrib(Cat.Common, "syms", "Symbols", true, func_size, sort_plain),
	
	attrib(Cat.Size, "rpxsize", "RPX", false, func_size, sort_plain),
	attrib(Cat.Size, "textsize", ".text", false, func_size, sort_plain),
	attrib(Cat.Size, "rodatasize", ".rodata", false, func_size, sort_plain),
	attrib(Cat.Size, "datasize", ".data", false, func_size, sort_plain),
	attrib(Cat.Size, "bsssize", ".bss", false, func_size, sort_plain),
	
	attrib(Cat.NEX, "nex", "NEX", true, func_lib, sort_lib),
	attrib(Cat.NEX, "nexrk", "NEX-RK", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexds", "NEX-DS", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexmm", "NEX-MM", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexms", "NEX-MS", false, func_lib, sort_lib),
	attrib(Cat.NEX, "nexut", "NEX-UT", false, func_lib, sort_lib),
	
	attrib(Cat.PIA, "pia", "PIA", true, func_lib, sort_lib),
	attrib(Cat.PIA, "piacommon", "PIA-Common", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piatransport", "PIA-Transport", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piasession", "PIA-Session", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piainet", "PIA-Inet", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piaclone", "PIA-Clone", false, func_lib, sort_lib),
	attrib(Cat.PIA, "piachat", "PIA-Chat", false, func_lib, sort_lib),
	
	attrib(Cat.Priv, "sead", "SEAD", false, func_bool, sort_plain),
	attrib(Cat.Priv, "agl", "AGL", false, func_bool, sort_plain),
	attrib(Cat.Priv, "aal", "AAL", false, func_bool, sort_plain),
	attrib(Cat.Priv, "xlink", "XLINK", false, func_bool, sort_plain),
	attrib(Cat.Priv, "enl", "ENL", false, func_bool, sort_plain),
	attrib(Cat.Priv, "gsys", "GSYS", false, func_bool, sort_plain),
	
	attrib(Cat.FirstParty, "nwf", "NWF", false, func_lib, sort_lib),
	attrib(Cat.FirstParty, "ffl", "FFL", false, func_lib, sort_lib),
	attrib(Cat.FirstParty, "lms", "LMS", false, func_bool, sort_plain),
	attrib(Cat.FirstParty, "shamo", "ShaMo", false, func_lib, sort_lib),
	attrib(Cat.FirstParty, "swkbd", "SWKBD", false, func_lib, sort_lib),
	attrib(Cat.FirstParty, "error", "Error", false, func_lib, sort_lib),
	
	attrib(Cat.NW, "nwfnt", "NW-FNT", false, func_lib, sort_lib),
	attrib(Cat.NW, "nwlyt", "NW-LYT", false, func_lib, sort_lib),
	attrib(Cat.NW, "nwsnd", "NW-SND", false, func_lib, sort_lib),
	attrib(Cat.NW, "nwsfnt", "NW-SFNT", false, func_lib, sort_lib),
	attrib(Cat.NW, "nweft", "NW-EFT", false, func_lib, sort_lib),
	
	attrib(Cat.Havok, "hka", "Havok-Animation", false, func_lib, sort_lib),
	attrib(Cat.Havok, "hkp", "Havok-Physics", false, func_lib, sort_lib),
	attrib(Cat.Havok, "hcl", "Havok-Cloth", false, func_lib, sort_lib),
	
	attrib(Cat.Other, "jpeg", "JPEG", false, func_bool, sort_plain),
	attrib(Cat.Other, "unity", "Unity", false, func_lib, sort_lib),
	attrib(Cat.Other, "iwnn", "iWnn", false, func_lib, sort_lib),
	attrib(Cat.Other, "scaleform", "Scaleform", false, func_lib, sort_lib),
	attrib(Cat.Other, "mp4dmx", "MP4dmx", false, func_lib, sort_lib),
	attrib(Cat.Other, "heaacdec", "HEAACDEC", false, func_lib, sort_lib),
	attrib(Cat.Other, "pfidpfid", "PFID-PFID", false, func_lib, sort_lib),
	attrib(Cat.Other, "pfidsmile", "PFID-SMILE", false, func_lib, sort_lib)
];
