import sys
from dictFile import infoSigns
from main import main
from write2file import write2file

def dict2files(destination,start):
	go = False
	for key in infoSigns.keys():
		print(key)
		if key == start:
			go = True
		if go == True:
			s,g = main(key)
			if "!" in key:
				write2file(s,g,"!")
			else:
				write2file(s,g)


if __name__ == '__main__':
	dict2files(sys.argv[1],sys.argv[2])