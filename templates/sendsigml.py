#IMPORTANT: Please note that this script only works if the SiGML Player is open and
#saved in the same directory as this script.

import socket
import sys

#Accepts a list of .sigml files as input and sends it to the SiGML Player using a socket
def sendsigml(filenames):
	#Checks that a list has been given as input
	if type(filenames) != list:
		if type(filenames) == str:
			filenames = list(filenames)
		else:
			print("You need to specify a list of filenames")
			exit()

	#checks the input for .sigml files and makes a list of them
	files = [file for file in filenames if len(file.split(".")) == 2 and file.split(".")[1] == "sigml"]

	#checks that at least one .sigml file was given
	if len(files) == 0:
		print("Please specify at least one .sigml document")
		exit()

	#initialise a socket object
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

	#connects to the SiGML PLayer which listens on port 8052
	s.connect(("localhost", 8052))

	print("connection established")

	#determines how many bites are sent per time step
	BUFFER_SIZE = 4096

	for file in files:
		try:
			#opens the specified file, reads from it and sends the content to the SiGML Player via the socket
			f = open(file,'rb')
			l = f.read(BUFFER_SIZE)
			print("sending file:", file)
			while (l):
				s.sendall(l)
				#prints the contents of the file
				#print('Sent ', repr(l))
				l = f.read(BUFFER_SIZE)
			f.close()
		except IOError:
			print("file: " + file + " not found")

	#Lets the user know the files have successfully been sent
	print("file(s) sent")

	#Closes the connection
	s.close()
	print("connection closed")


if __name__ == '__main__':
    if len(sys.argv) == 1:
        print("Please specify at least one sign to be sent to the avatar")
    else:
        main(sys.argv[1])
