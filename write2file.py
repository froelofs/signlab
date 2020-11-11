def write2file(sigml,glosses):
	f = open(glosses[0] + ".sigml","x")
	f.write(sigml)
	f.close()
