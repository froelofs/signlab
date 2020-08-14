from flask import request

def pyfoo() : 
	try:
		data = json.loads(request.data)
		print(data)
		return "Success"
	except ValueError:
		error('Unable to parse JSON data from request.')
		return "Error"

if __name__ == '__main__':
  pyfoo()