from flask import Flask, render_template, request
from main import main
from functionsAux import searchDict
app = Flask(__name__)

@app.route('/')
def index():
  return render_template('interface.html')

@app.route('/my-link/')
def my_link():
  print ('I got clicked!')

  return 'Click.'

@app.route('/receiver', methods = ['POST','GET'])
def worker():

	data = request.get_json()
	result = ''

	for value in data.values():
		result = main(value.rstrip("\n"))

	return result

@app.route('/suggestions', methods = ['POST','GET'])
def suggestions():

	data = request.get_json()
	result = ''
	for value in data.values():
		word = value.rstrip("\n").split(" ")[-1]		
		result = searchDict(word)

	return ','.join(result)

if __name__ == '__main__':
  app.run(debug=True)
