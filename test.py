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

def matches(ev):
	input = document['mySiGML'].value
	results = searchDict(input)
	if len(results):
		alert("These are the results:")
		alert(results)
		# document["mySiGML"].value = results
		for r in results:
			# r = r + "\n"
			document["suggestions"] = r
			# alert(r)

		sel = html.SELECT(size=5, multiple=True)
		for item in results:
		    sel = html.OPTION(item)
		document["suggestions"] <= sel
	else:
		alert("No results were found")

# def update_select(ev):
#     # selects / deselects options in the SELECT box
#     # ev.target is the checkbox we just clicked
#     rank = results.index(ev.target.value)
#     sel.options[rank].selected = ev.target.checked


	

# bind event 'click' on button to function echo
document["echo"].bind("click", matches)

#bind "keyup event to textarea"
# document["mySiGML"].bind("keyup", matches)