import cgi, cgitb
    def index():
        data = cgi.FieldStorage()
        mydata = data['param'].value
        return "Hello"