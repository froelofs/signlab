import sys
from ZonMwDict import ZonMw as dictionary

# Looks for a word in the dictionary in order to return the sign's sigml from the corresponding file
def getGSiGML(word,directory):
	# match = ""
	# for key in dictionary.keys():
	# 	if key == word:
	# 		match = key
	# 		break

	if word in dictionary.keys():
		entry = dictionary[word]
		if type(entry) == dict:
			# entry = context(entry)
			print("Entry" + word + "requires the context function")
			quit()
		elif entry == "":
			print("No entry could be found for " + word)
			quit()
		file = open(directory + "/" + entry, "r")
		sigml = ''.join(file.readlines()[1:])
		file.close()
		return sigml

if __name__ == '__main__':
	print(getGSiGML(sys.argv[1],sys.argv[2]))
