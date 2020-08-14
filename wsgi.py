def index(req):
	postData = req.form
	json = str(postData['param'].value)
	print(json)