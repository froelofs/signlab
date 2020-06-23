'''
Creates a Sign object for the provided gloss
'''
from operator import itemgetter
import pickle
import sys
import re
# from dictFile import infoSigns
from HamNoSysDict import categoriesHamNoSys as cat
infoSigns = pickle.load(open("dictFile.p", "rb"))

#accepts a written HamNoSys notation and returns the category it belongs to
def findCategory(hamnosys, dictionary = cat):
	#loops over the categories in the dictionary and searches their corresponding
	#values for a match with the HamNoSys notation
	for key in dictionary.keys():
		for notation in dictionary[key]:
			if notation == hamnosys:
				return key
	#lets the user know if the HamNoSys notation can't be found
	print("The HamNoSys notation \""+ hamnosys+"\" does not exist in the dictionary")
	return None

'''shows what hamnosys categories belong to parts of a sign, and in what order'''
def explainSign(gloss, show = True, dictionary = infoSigns):
	# put all hamnosys-characters in a list
	characters = []
	if gloss in dictionary:
		characters = re.split(",", dictionary[gloss][0])

	sigml = ''
	spacing = ''
	sigmllist = []
	prev = None
	# go through all characters of the gloss
	for char in characters:
		# find current category
		current = findCategory(char)

		# assign 'between'-character to whatever class encountered previously
		if char == 'hambetween':
			current = prev

		# delete indentation whenever a closing parenthesis is encountered
		if 'end' in char and current == 'structure/grammar':
			spacing = ''

		# when the category changes
		if current != prev:
			# save previous category
			sigmllist.append(sigml)
			sigml = ''

			# add current category as a comment
			sigml += '\n{}<!-- {} -->\n'.format(spacing, current)
			prev = current

		# add character to sigml notation
		sigml += spacing + '<' + char + '/>\n'

		# add indentation when encountering a parenthesis of any type
		if 'begin' in char:
			spacing = '    '

	# append last category
	sigmllist.append(sigml)

	# show everyting
	if show:
		print('HamNoSys-notation of {} decomposed:\n'.format(gloss), ' '.join(map(str, sigmllist)))
	return sigmllist

'''Returns the new direction of HamNoSys notations based on the indexes'''
def direction(letters,hamtype,indexes,steps=0):
	axes = ["o","or","r","ir","i","il","l","ol"]
	if "hampalm" in hamtype:
		axes = ["u","ur","r","dr","d","dl","l","ul"]
		if hamtype == "hampalmu":
			axes.reverse()

	#Returns the letters unchanged if they are not in the selected list
	try:
		i = axes.index(letters)
	except:
		return letters

	#Calculates the index of the new direction based on the index of the
	#current direction and the indexes of the verb
	if steps > 0:
		i = i + steps
	elif indexes[0] == "3B":
		if indexes[1] == "1":
			i = i + 3
		elif indexes[1] == "2":
			i = i + 1
		elif indexes[1] == "3A":
			i = i + 2
	elif indexes[0] == "3A":
		if indexes[1] == "1":
			i = i + 5
		elif indexes[1] == "2":
			i = i + 7
		elif indexes[1] == "3B":
			i = i + 6
	elif indexes[0] == "2":
		if indexes[1] == "1":
			i = i + 4
		elif indexes[1] == "3A":
			i = i + 3
		elif indexes[1] == "3B":
			i = i + 5
	elif indexes[0] == "1":
		if indexes[1] == "2":
			i = i
		elif indexes[1] == "3A":
			i = i + 1
		elif indexes[1] == "3B":
			i = i + 7

	#Makes a correction in the case that the index is higher than the max index of the list
	if i > 7:
		i = i - 8

	return axes[i]

'''accepts a direction and returns its opposite'''
def opposite(direction):
	opposites = ["d","u","l","r","o","i"]
	m = len(opposites)
	o = ""

	for c in direction:
		p = opposites.index(c)
		#Checks whether the index of the character is an odd or even number and
		#gets the opposite character from opposites accordingly
		if (p % 2) == 0 and p != m:
			o += opposites[p + 1]
		else:
			o += opposites[p - 1]

	return o


class Sign(object):
	"""Class object for a Sign."""

	def __init__(self, gloss, pos = '', neg = None, WH = False, context = [], matches = {}, dict = infoSigns):
		"""Create a gloss class."""

		self.gloss = gloss.upper()
		self.neg = neg
		self.context = context
		self.matches = matches
		self.WH = WH

		'''er moet nog bij dat hij een hogere score krijgt als het het eerste woord is voor streepjes oid'''
		try:
			# dit is alleen zo bij vingerspellen
			if self.matches == {} and self.gloss.isnumeric() is False:
				if self.gloss in dict:
					self.matches[self.gloss] = 4
			self.sigml = dict[max(self.matches.items(), key=itemgetter(1))[0]][0]
			self.gloss = max(self.matches.items(), key=itemgetter(1))[0]
		except Exception as e:
			print('gloss: ', gloss)
			print(e) # moet nog even mooier
			quit()


		#Checks if a match for the gloss was found in the dictionary
		try:
			self.sigml
		except AttributeError:
			print("Please add \"" + gloss + "\" to the dictionary first")
			quit()

		#Adds the non-manual aspects to the sign
		self.nonmanual = list()
		# add mouthing
		if dict[self.gloss][1]:
			self.mouthpicture = "<hnm_mouthpicture picture='" + dict[self.gloss][1] + "'/>"
			self.nonmanual.append(self.mouthpicture)

		# add headshake for negation
		if self.neg:
			self.nonmanual.append('<hnm_head tag="SH"/>')
			self.nonmanual.append('<hnm_head tag="SH"/>')
			self.neg = True
		# add nodding for affirmation
		elif self.neg == False:
			self.nonmanual.append('<hnm_head tag="NO"/>')
			self.nonmanual.append('<hnm_head tag="NO"/>')
			self.neg = False

		# check for question markers
		if self.context:
			if self.context[-1][0] == '?' or self.context[-1][0] == ',':
				# add content question nonmanuals
				if self.WH:
					self.nonmanual.append('<hnm_eyebrows tag="FU"/>')
					self.nonmanual.append('<hnm_eyebrows tag="FU"/>')
					self.nonmanual.append('<hnm_head tag="NB"/>')
					self.nonmanual.append('<hnm_eyelids tag="SB"/>')
				# add polar question nonmanuals
				else:
					self.nonmanual.append('<hnm_eyebrows tag="RB"/>')
					self.nonmanual.append('<hnm_eyebrows tag="RB"/>')
					self.nonmanual.append('<hnm_eyelids tag="WB"/>')
					# self.nonmanual.append('<hnm_head tag="PF"/>') # alleen als het op dezelfde plaats zou blijven

				# manipulate the previous sign and 'palm_omhoog sign flow into eachother
				if self.gloss == 'PALM_OMHOOG':
					# collect previous sign
					previousSign = context[-2][0].upper()
					# hardcode 'WIE', since the code below doesn't work on it
					if previousSign == 'WIE':
						gloss = 'PALM_OMHOOG_WIE'
						self.gloss = gloss
						self.sigml = dict[gloss][0]
					else:
						# make sure its the previous sign, not previous indicator
						if previousSign == ')N' or previousSign == ')C':
							previousSign = context[-3][0].upper()
						# gather sign documentation
						PREVsigml = explainSign(previousSign, False) # previous sign
						PUsigml = explainSign('PALM_OMHOOG', False) # PALM_OMHOOG

						# do some data collection
						PREVhs, PREVor, PREVloc = [''], [''], ['']
						for category in PREVsigml:
							# make a list of all handshapes in previously used sign
							if 'handshape' in category:
								PREVhs.append(category)
							# and a list of all orientations
							if 'orientation' in category:
								PREVor.append(category)
							# and a list of all locations
							if 'location' in category:
								PREVloc.append(category)

						# rearrange categories to make the movement 'correct'
						switchHS, switchOR, switchLOC, switchMOV= False, False, False, False
						for i, category in enumerate(PUsigml):
							# switch handshape
							if 'handshape' in category and not switchHS:
								# save current PU handshape for later
								PUhs = category
								# remove current PU handshape
								PUsigml.remove(category)
								# add handshape last used in previous sign
								PUsigml.insert(i, PREVhs[-1])
								# make sure to only switch it once
								switchHS= True

							# switch current orientation for previous orientation
							if 'orientation' in category and not switchOR:
								PUsigml.remove(category)
								PUsigml.insert(i, PREVor[-1])
								switchOR = True
							# switch current location for previous location
							if 'location' in category and not switchLOC:
								PUsigml.remove(category)
								PUsigml.insert(i, PREVloc[-1])
								switchLOC = True
							# (hardcoded) when encountering the movement
							if 'movement' in category and not switchMOV:
								# add saved PU handshape after it
								PUsigml.insert(i+1, PUhs)
								switchMOV = True

						# save full sigml notation as comma separated sigml notation
						sigml = ''
						for category in PUsigml:
							for sigmlCommand in category.split('<'):
								if '!' not in sigmlCommand :
									# delete angle brackets
									sigmlCommand = re.sub('<', '', sigmlCommand)
									sigmlCommand = re.sub('/>', '', sigmlCommand)
									# delete white spaces
									sigmlCommand = re.sub('\n', '', sigmlCommand)
									sigmlCommand = re.sub('\t', '', sigmlCommand)
									sigmlCommand = re.sub(' ', '', sigmlCommand)

									# add commands to sigml string, comma-separatedly
									if sigmlCommand:
										sigml += sigmlCommand + ','
						# change sigml of PALM_OMHOOG to the newly constructed one
						self.sigml = sigml[:-1]
						# only use one hand if previous sign only uses one.
						if 'hamsymmlr' not in PREVsigml[1]:
							self.sigml = sigml[10:-1]


	def get_gloss(self):
		"""Return the gloss of the sign."""
		return self.gloss

	def get_mouthpicture(self):
		"""Returns the mouthpicture of the sign if it has one."""
		return self.mouthpicture

	def get_sigml(self):
		"""Return sigml out of the dictionary."""
		return self.sigml


	def dbgloss_to_sigml(self):
		"""Go from dict-notation to sigml-notation."""
		gloss = self.sigml
		gloss_new = gloss.replace(',', '/>\n\t\t<')
		return '<' + gloss_new + '/>'

	def get_full_sigml(self):
		"""Return the sigml representation of the sign."""
		preamble = '<hns_sign gloss="{}">\n'.format(self.gloss)
		nonmanuals = '\t<hamnosys_nonmanual>'
		for n in self.nonmanual:
			nonmanuals = nonmanuals + '\n\t\t' + n
		nonmanuals = nonmanuals + '\n\t</hamnosys_nonmanual>\n'
		manuals = '\t<hamnosys_manual>\n\t\t{}\n\t</hamnosys_manual>'.format(self.dbgloss_to_sigml())
		postamble = '\n</hns_sign>\n'
		return preamble + nonmanuals + manuals + postamble


	def signCategories(self):
		"""accepts the gloss of a sign and returns a list of the individual HamNoSys representations
			and their corresponding categories as tuples"""

		#retrieves the HamNoSys notation of the sign
		HamNoSys = self.get_sigml()
		#separates the individual HamNoSys representations
		notations = HamNoSys.split(",")
		#finds and lists all the categories of the individual HamNoSys representations
		categories = [(n,findCategory(n)) for n in notations]
		return categories

	def mirror(self):
		"""Mirror Sign to left-handed version."""

		# use non-dominant hand
		newsigml = 'hamnondominant,'

		characters = re.split(",", (self.sigml))
		# ignore 2-handed signs
		if ('hamnondominant' in characters) or \
		   ('hamsymmlr' in characters) or \
		   ('hamsymmpar' in characters):
			return self

		# go through sign per hamnosys-character
		already = False
		last = len(characters) - 1
		exceptions = ['hamrepeatcontinueseveral', 'hamrepeatfromstartseveral', 'hamclockfull']
		for i, character in enumerate(characters):

			# mirror orientation and movement
			if findCategory(character) == 'orientation' or findCategory(character) == 'movement':
				# switch left to right, or right to left
				if character[-1] == 'l':
					if character not in exceptions:
						character = character[:-1] + 'r'
				elif character[-1] == 'r':
					character = character[:-1] + 'l'

			# mirror location
			if findCategory(character) == 'location':
				# check if already switched previous iteration
				if already == True:
					already = False
					continue
				# switch from right to left
				elif character == 'hamlrbeside' or character == 'hamlrat':
					character = characters[i+1] + ',' + character
					already = True
				# switch from left to right
				elif not i == last:
					if characters[i+1] == 'hamlrbeside' or characters[i+1] == 'hamlrat':
						character = characters[i+1] + ',' + character
						already = True

			newsigml += character + ','
		self.sigml = newsigml[:-1]
		return self


	def directional(self,indexes):
		"""changes the orientation and direction of movements of directional verbs
			according to the indexes assigned to the verb"""

		sigml = self.sigml

		#Removes locations that indicate a side of the body
		if "hamlrbeside" in sigml:
			sigml = re.sub("hamlrbeside","8",sigml)
		elif "hamlrat" in sigml:
			sigml = re.sub("hamlrat","8",sigml)
		if "8" in sigml:
			sigml = re.split("8",sigml)
			sigml = ("").join(sigml)

		notations = re.split(",",sigml)

		#Removes the notations replaced with empty strings
		notations = [n for n in notations if n]

		#Ignores cases where the subject is "I" and the object is "you" and removes sequences
		#when the subject is not "I"
		if indexes[0] == "1" and indexes[1] == "2":
			return self
		elif "hamseqbegin" in notations and indexes[0] != "1":
			i = notations.index("hamseqbegin")
			i2 = notations.index("hamseqend")
			notations = notations[:i] + notations[i2+1:]

		#Sets up some necessary variables
		end = len(notations)
		upDown = 0
		forwards = [("1","2"),("1","3A"),("1","3B"),("3A","2"),("3B","2")]
		backwards = [("2","1"),("2","3A"),("2","3B"),("3A","1"),("3B","1")]
		move = re.search("hammove(.)*",sigml).group()[-1]


		#Loops through the HamNoSys notation of a sign and changes the necessary parts
		for i, n in enumerate(notations):
			switch = ""
			#Changes the direction of the movement
			if "hammove" in n:
				switch = n[:7]
				switch += direction(n[7:],switch,indexes)
			#Changes the orientation of the fingers
			elif "hamextfinger" in n:
				upDown = 0
				switch = n[:12]
				#Checks whether the fingers are orientated up or down
				if n[12] == "u" or n[12] == "d":
					upDown = upDown + 1
					#Ignores cases where the fingers are pointing straight up or down
					if len(n) == 14:
						switch += n[12]
						#Accounts for cases where the fingers are pointing up or down and backwards or forwards
						if n[13] in ["i","o"]:
							upDown = upDown + 1
							if indexes in forwards:
								continue
							elif indexes[0] == "3A" and indexes[1] == "3B":
								switch += direction(n[13],switch,indexes,6)
							elif indexes[0] == "3B" and indexes[1] == "3A":
								switch += direction(n[13],switch,indexes,2)
							else:
								switch += opposite(n[13])
						#Accounts for cases where the fingers are pointing up or down and to the left or right
						elif n[13] in ["l","r"]:
							upDown = upDown + 2
							#Changes the orientation for the left hand in special cases
							if indexes[1] == "3A" or indexes[0] == "3B":
								switch += opposite(n[13])
							else:
								switch += n[13]
						else:
							continue
						notations[i] = switch
					continue
				switch += direction(n[12:],switch,indexes)
			#Changes the orientation of the palm
			elif "hampalm" in n:
				#Ingores palms facing up or down if the fingers are not also facing up or down
				if ("u" in n or "d" in n) and upDown == 0:
					continue
				switch = n[:7]
				#Deals with the case that the fingers are pointing straight up or down
				if upDown == 1:
					switch += direction(n[7:],switch,indexes)
					#Deals with the case that the palm is facing in the opposite direction of the movement
					if len(switch) == 9 and (("o" in move and n[7] == "u") or ("i" in move and n[7] == "d")):
						temp = switch[:8]
						temp += opposite(switch[8])
						switch = temp
				#Changes the palm orientation in the cases where the fingers are pointing up or down and forwards or backwards
				elif upDown == 2:
					#Changes the palm orientation if the palm is facing up or down
					if n[7] in ["u","d"]:
						#Ignores the cases where the subject and object are 3A and 3B or 3B and 3A
						if indexes not in forwards and indexes not in backwards:
							continue
						switch += n[7]
						if indexes[0] == "3A" or indexes[1] == "3B":
							switch += "l"
						elif indexes[0] == "3B" or indexes[1] == "3A":
							switch += "r"
					#Changes the palm orientation if the palm is facing left or right
					else:
						if indexes in [("3A","1"),("1","3A"),("2","1"),("2","3B"),("3B","2"),("3B","3A")]:
							switch += opposite(n[7])
						else:
							switch += n[7]
				#Changes the palm orientation in cases where the fingers are pointing up or down and to the right or left
				elif upDown == 3:
					#Deals with the cases where the axis for the palm orientation needs to be reversed
					if notations[i-1][12] == "u":
						switch += "u"
					#Changes the palm orientation in cases where the subject and object are 3A and 3B
					if indexes[0] == "3A" and indexes[1] == "3B":
						switch += direction(n[7:],switch,indexes,6)
					#Changes the palm orientation in cases where the subject and object are 3B and 3A
					elif indexes[0] == "3B" and indexes[1] == "3A":
						switch += direction(n[7:],switch,indexes,2)
					#Changes the palm orientation in other cases
					else:
						temp = n[:7]
						temp += direction(n[7:],switch,indexes)
						switch = temp
					#Adapts the palm orientation for the left hand in the necessary cases
					if 'hamsymmlr' not in notations and ((indexes[1] == "3A" and indexes[0] != "3B" ) or indexes[0] == "3B"):
						temp = switch[:7]
						temp += opposite(switch[7:])
						switch = temp
			#Removes everything in the HamNoSys notation after the ending of the movement
			elif n == "hamparend":
				notations = notations[:i+1]
				break
			#Adapts the location of a sign according to the subject of the sentence
			elif findCategory(n) == "location":
				if n in ["hamclose","hamarmextended"] and indexes[0] != "1":
					notations[i] = ""
				#Adds the starting position if the sign starts at index 3A
				elif indexes[0] == "3A" and (i == end or notations[i+1] != "hambetween"):
					notations[i]  = "hamshoulders,hamlrbeside"
					if i != end and notations[i+1] == "hambetween":
						notations[i+1] = ""
						notations[i+2] = ""
				#Adds the starting position if the sign starts at index 3B
				elif indexes[0] == "3B" and ((i == end and notations[i-1] != "hambetween") or i != end):
					notations[i] = "hamlrbeside,hamshoulders"
					if i != end and notations[i+1] == "hambetween":
						notations[i+1] = ""
						notations[i+2] = ""
				#Adds the starting position if the sign starts at index 2
				elif indexes[0] == "2" and (i == end or notations[i+1] != "hambetween"):
					notations[i] = n + ",hamarmextended"
				continue
			#Ignores the parts of the notation that do not need changing
			else:
				continue
			notations[i] = switch

		#Adds the end location of the gesture in specific cases to make the movement clearer
		if not "hamrepeatfromstartseveral" in notations and not "hamrepeatcontinueseveral" in notations:
			#Adds an arm extension to the end of the sign to make sure the movement isn't too short in the
			#case that the gesture starts at index 1 and doesn't end at index 2
			if indexes[0] != "2" and indexes[1] == "1":
				if notations[-1] != "hamparend":
					notations.insert(-1,"hamarmextended")
				else:
					i = notations.index("hamparbegin")
					notations.insert(i,"hamarmextended")
			#Adds a fixed location in the cases that the sign starts at index 3A or index 3B and ends at index 2
			elif indexes[1] == "2":
				notations.append("hamshoulders,hamarmextended")
			#Adds a fixed location in the case that the sign starts at 3A and ends at 3B to ensure the movement goes far enough
			elif indexes[0] == "3A" and indexes[1] == "3B":
				notations.append("hamlrat,hamshoulders")
			#Adds a fixed location in the case that the sign starts at 3B and ends at 3A to ensure the movement goes far enough
			elif indexes[0] == "3B" and indexes[1] == "3A":
				notations.append("hamshoulders,hamlrat")

		#Performs the sign with the left hand in special cases
		if 'hamsymmlr' not in notations and ((indexes[1] == "3A" and indexes[0] != "3B" ) or indexes[0] == "3B"):
			notations.insert(0,'hamnondominant')

		#Removes the notations replaced with empty strings
		notations = [n for n in notations if n]

		newsigml = ",".join(notations)
		self.sigml = newsigml



if __name__ == '__main__':
	if len(sys.argv) == 1:
		print("Please specify the gloss of a word")
	elif str(sys.argv[1]) == "explain":
		explainSign(Sign(sys.argv[2]).get_gloss())
	else:
		Sign(sys.argv[1])
