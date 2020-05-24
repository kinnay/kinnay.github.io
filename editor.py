
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
import json
import sys


def dec_plain(v): return v
def dec_hex(v): return "%016X" %v
def dec_version(v): return "v%i" %v
def dec_symbols(v): return ["No"][v]
def dec_bool(v): return ["No", "Yes"][v]
def dec_size(v): return "%i" %v
def dec_lib(v):
	if len(v) == 0:
		return ""
	else:
		s = ".".join([str(i) for i in v[0]])
		if len(v) == 2:
			s += "-%s" %v[1]
		return s

def enc_plain(v): return v
def enc_hex(v): return int(v, 16)
def enc_version(v):
	assert v[0] == "v"
	return int(v[1:])
def enc_symbols(v): return ["No"].index(v)
def enc_bool(v): return {"Yes": 1, "No": 0}[v]
def enc_size(v): return int(v)
def enc_lib(v):
	if v == "":
		return []
	else:
		if "-" in v:
			v, p = v.split("-")
			return [[int(s) for s in v.split(".")], p]
		return [[int(s) for s in v.split(".")]]

attribs = [
	("name", dec_plain, enc_plain, "Name"),
	("aid", dec_hex, enc_hex, "Title ID"),
	("av", dec_version, enc_version, "Version"),
	("syms", dec_symbols, enc_symbols, "Symbols"),
	("path", dec_plain, enc_plain, "Path"),
	("sdk", dec_lib, enc_lib, "SDK"),
	
	("nsosize", dec_size, enc_size, "NSO"),
	("textsize", dec_size, enc_size, ".text"),
	("rodatasize", dec_size, enc_size, ".rodata"),
	("datasize", dec_size, enc_size, ".data"),
	("bsssize", dec_size, enc_size, ".bss"),
	
	("nex", dec_lib, enc_lib, "NEX"),
	("nexrk", dec_lib, enc_lib, "NEX-RK"),
	("nexr2", dec_lib, enc_lib, "NEX-R2"),
	("nexds", dec_lib, enc_lib, "NEX-DS"),
	("nexmm", dec_lib, enc_lib, "NEX-MM"),
	("nexut", dec_lib, enc_lib, "NEX-UT"),
	("nexss", dec_lib, enc_lib, "NEX-SS"),
	("nexsc", dec_lib, enc_lib, "NEX-SC"),
	("nexco", dec_lib, enc_lib, "NEX-CO"),
		("piacommon", dec_lib, enc_lib, "PIA-Common"),
	("piatransport", dec_lib, enc_lib, "PIA-Transport"),
	("piasession", dec_lib, enc_lib, "PIA-Session"),
	("pialan", dec_lib, enc_lib, "PIA-LAN"),
	("pialocal", dec_lib, enc_lib, "PIA-Local"),
	("pianex", dec_lib, enc_lib, "PIA-NEX"),
	("piaclone", dec_lib, enc_lib, "PIA-Clone"),
	("piasync", dec_lib, enc_lib, "PIA-Sync"),
	
	("sead", dec_bool, enc_bool, "SEAD"),
	("agl", dec_bool, enc_bool, "AGL"),
	("aal", dec_bool, enc_bool, "AAL"),
	("xlink2", dec_bool, enc_bool, "XLINK2"),
	("lp2", dec_bool, enc_bool, "LP2"),
	("enl", dec_bool, enc_bool, "ENL"),

	("nwatk", dec_lib, enc_lib, "NW4F-ATK"),
	("nwg3d", dec_lib, enc_lib, "NW4F-G3D"),
	("nwui2d", dec_lib, enc_lib, "NW4F-UI2D"),
	("nwfont", dec_lib, enc_lib, "NW4F-FONT"),
	("nwvfx2", dec_lib, enc_lib, "NW4F-VFX2"),
	
	("libcurl", dec_lib, enc_lib, "libcurl"),
	("libz", dec_lib, enc_lib, "libz"),
	
	("iwnn", dec_lib, enc_lib, "iWnn"),
	("havokanim", dec_lib, enc_lib, "Havok-Animation"),
	("havokcloth", dec_lib, enc_lib, "Havok-Cloth")
]

with open("data/games.json") as f:
	games = json.load(f)


class Editor(QDialog):
	def __init__(self, game):
		super().__init__()
		
		self.scroll = QScrollArea()
		
		lyt = QVBoxLayout(self)
		lyt.addWidget(self.scroll)
		
		self.widget = QWidget(self)
		self.scroll.setWidgetResizable(True)
		self.scroll.setWidget(self.widget)
		
		self.values = []
		for attrib in attribs:
			value = game.get(attrib[0])
			if value is None:
				text = "?"
			else:
				text = attrib[1](value)
			self.values.append(text)
		
		layout = QFormLayout(self.widget)
		for i, attrib in enumerate(attribs):
			widget = QLineEdit(self.values[i])
			widget.textChanged.connect(lambda s, i=i: self.updateText(s, i))
			layout.addRow(attrib[3], widget)
		
		ok = QPushButton("OK")
		ok.clicked.connect(self.accept)
		cancel = QPushButton("Cancel")
		cancel.clicked.connect(self.reject)
		layout.addRow(ok, cancel)
		
		self.resize(600, 600)
		
	def updateText(self, text, i):
		self.values[i] = text


class Table(QTableWidget):
	def __init__(self):
		super().__init__()
		
		self.itemActivated.connect(self.showEditor)
		
		self.regenerate()
		
	def regenerate(self):
		self.clear()
		
		self.setColumnCount(len(attribs))
		self.setRowCount(len(games))
		self.setHorizontalHeaderLabels([x[3] for x in attribs])
		
		self.horizontalHeader().resizeSection(0, 200)
		self.horizontalHeader().resizeSection(1, 150)
		self.horizontalHeader().resizeSection(2, 80)
		self.horizontalHeader().resizeSection(3, 80)
		
		for i, game in enumerate(games):
			for j, attrib in enumerate(attribs):
				value = game.get(attrib[0])
				if value is None:
					text = "?"
				else:
					text = attrib[1](value)
				item = QTableWidgetItem(text)
				item.setFlags(item.flags() & ~Qt.ItemIsEditable)
				item.game = game
				self.setItem(i, j, item)
				
		self.sortItems(0)
		
	def showEditor(self, item):
		editor = Editor(item.game)
		while True:
			result = editor.exec()
			if result == QDialog.Accepted:
				data = []
				values = editor.values
				for i, attrib in enumerate(attribs):
					try:
						p = attrib[2](values[i]) if values[i] != "?" else None
						data.append(p)
					except:
						QMessageBox.warning(self, "Invalid", "Invalid: %s" %attrib[3])
						break
				else:
					for i, attrib in enumerate(attribs):
						item.game[attrib[0]] = data[i]
					self.saveFile()
					self.regenerate()
					break
			else:
				break
				
	def saveFile(self):
		e = "[\n"
		for game in games:
			e += "\t" + json.dumps(game) + ",\n"
		e = e[:-2] + "\n]"
		with open("data/games.json", "w") as f:
			f.write(e)
		QMessageBox.information(self, "OK", "OK")


class MainWindow(QMainWindow):
	def __init__(self):
		super().__init__()
		
		self.new = QAction("New")
		self.new.setShortcut("Ctrl+N")
		self.new.triggered.connect(self.createNew)
		
		self.push = QAction("Push")
		self.push.setShortcut("Ctrl+P")
		self.push.triggered.connect(self.pushFile)
		
		self.file = QMenu("File")
		self.file.addAction(self.new)
		self.file.addAction(self.push)
		
		self.menu = QMenuBar()
		self.menu.addMenu(self.file)
		self.setMenuBar(self.menu)
		
		self.table = Table()
		self.setCentralWidget(self.table)
		
		self.resize(1024, 720)

	def createNew(self):
		games.append({})
		self.table.regenerate()

	def pushFile(self):
		import subprocess
		try:
			output = subprocess.check_output("./push.sh", shell=True, stderr=subprocess.STDOUT)
			QMessageBox.information(self, "Done", output.decode())
		except subprocess.CalledProcessError as e:
			QMessageBox.warning(self, "Error", e.output.decode())


app = QApplication(sys.argv)
window = MainWindow()
window.show()
app.exec()
