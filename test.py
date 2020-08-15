from browser import document, alert
from browser.widgets.dialog import InfoDialog
# from main import main
from functionsAux import searchDict

def click(ev):
    InfoDialog("Hello", f"Hello, {document['mySiGML'].value} !")

# def translate(ev):
# 	result = main({document['mySiGML'].value})
# 	alert(result)

def matches(ev):
	InfoDialog("This is working fine!")
	results = searchDict({document['mySiGML'].value})
	InfoDialog("Hello there")
	InfoDialog("Results:",results)

# bind event 'click' on button to function echo
document["echo"].bind("click", click)