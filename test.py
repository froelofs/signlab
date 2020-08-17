from browser import document, alert
from browser.widgets.dialog import InfoDialog
# from main import main
from functionsAux import searchDict

def click(ev):
    InfoDialog("Hello", f"Hello, {document['mySiGML'].value} !")
    alert(type(str({document['mySiGML'].value})))

# def translate(ev):
# 	result = main(str({document['mySiGML'].value}))
# 	alert(result)

def matches(ev):
	alert("This is working fine!")
	results = searchDict(str({document['mySiGML'].value}))
	InfoDialog("Hello there")
	InfoDialog("Results:",results)

# bind event 'click' on button to function echo
document["echo"].bind("click", matches)