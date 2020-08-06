import cgi, cgitb 
from StringIO import StringIO
import json
from io import BytesIO
import pycurl
from main import main

cgitb.enable()
#Create instance of FieldStorage 
form = cgi.FieldStorage() 

#Get data from fields
url = form.getvalue('param')

print("Content-type: text/html\r\n\r\n\n")


print(url)