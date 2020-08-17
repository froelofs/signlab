from browser import document, alert, html
from browser.widgets.dialog import InfoDialog
# from main import main
from functionsAux import searchDict

def click(ev):
    InfoDialog("Hello", f"Hello, {document['mySiGML'].value} !")
    alert(type(str({document['mySiGML'].value})))

# def translate(ev):
# 	result = main(document['mySiGML'].value)
# 	alert(result)

sel = ""
def matches(ev):
	input = document['mySiGML'].value
	results = searchDict(input)
	if len(results):
		# alert("These are the results:")
		# alert(results)
		# document["mySiGML"].value = results
		sel = html.SELECT(size=5, multiple=False)
		for item in results:
		    sel <= html.OPTION(item)
		document["suggestions"] <= sel
		sel.bind("change", update_input)
	else:
		alert("No results were found")

def update_input(ev):
	selected = [option.value for option in sel if option.selected]
	document['mySiGML'].value = selected[0].lower()

# def update_select(ev):
#     # selects / deselects options in the SELECT box
#     # ev.target is the checkbox we just clicked
#     rank = results.index(ev.target.value)
#     sel.options[rank].selected = ev.target.checked


	

# bind event 'click' on button to function echo
document["echo"].bind("click", matches)

#bind "keyup event to textarea"
# document["mySiGML"].bind("keyup", matches)