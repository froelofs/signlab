from browser import document, alert
from browser.widgets.dialog import InfoDialog
# from main import main
from functionsAux import searchDict

def click(ev):
    InfoDialog("Hello", f"Hello, {document['mySiGML'].value} !")
    alert(type(str({document['mySiGML'].value})))

# def translate(ev):
# 	result = main(document['mySiGML'].value)
# 	alert(result)

def matches(ev):
	input = document['mySiGML'].value
	results = searchDict(input)
	if len(results):
		alert("These are the results:")
		alert(results)
		# document["mySiGML"].value = results
	else:
		alert("No results were found")
	

# bind event 'click' on button to function echo
document["echo"].bind("click", matches)
document["mySiGML"].bind("keyup", matches)