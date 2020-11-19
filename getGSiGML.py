import sys

def getGSiGML(file):
	f = open(file,"r")
	sigml =  f.read()
	f.close()

	return sigml


if __name__ == '__main__':
	print(getGSiGML(sys.argv[1]))