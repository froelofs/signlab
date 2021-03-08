import sys
import os
import json

if __name__ == '__main__':
	directory = sys.argv[1]

	files2check = []
	fileCount = 0
	directory = os.fsencode(directory)
	newDict = {}
	files2skip = []
	if len(sys.argv) > 2:
		files2skip = sys.argv[2]

	for file in os.listdir(directory):
		filename = os.fsdecode(file)
		if filename not in files2skip:
			d = os.fsdecode(directory)
			print(filename)
			dictEntry = filename.replace("-g.sigml","")
			if "_" not in dictEntry:
				newDict[dictEntry] = d + "/" + filename
			else:
				files2check.append(filename)
			fileCount += 1


	f = open("skip.txt","a")
	for file in files2check:
		f.write(file + "\n")
	f.close()
	print(fileCount)

	dictFile = open('dict.json','w')
	json.dump(newDict, dictFile, indent=1)
	dictFile.close
