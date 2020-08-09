from flask import Flask, render_template, request
from main import main
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
		print("item", value, type(value))
		# loop over every row
		#result += str(data[item]) + '\n'
		result = main(value.rstrip("\n"))
		print("result:", result)

	return result

if __name__ == '__main__':
  app.run(debug=True)
