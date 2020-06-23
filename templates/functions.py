import sys
import pickle
import re
from sign import Sign

infoSigns = pickle.load(open("dictFile.p", "rb"))

'''adds a new gloss to the dictionary, accepts complete input and returns the
(new) dict entry'''
def addSign(gloss, hamnosys, sampa, dictionary = infoSigns):
	for entry in dictionary:
		if gloss == entry:
			print("This word is already in the dictionary")
			return dictionary
	dictionary[gloss] = (hamnosys, sampa)
	print("Success!", gloss, dictionary[gloss])
	pickle.dump(dictionary, open("dictFile.p", "wb"))
	return dictionary

def indexing(context):
	indexes = ["INDEX_3A","INDEX_3B"]

	#Stores the verbs and their respective indexes as tuples
	subjObj = []

	#List of directional verbs
	directionals = ["gooien","lopen","kijken", "roepen","geven","antwoorden","gaan","halen"]

	#List of pronouns (not all are recognised by the parser)
	pronouns = ["ik","jij","hij","zij","index_1","index_2","index_3a","index_3b"]

	#Checks the sentence for verbs and everything that is treated as a noun
	verbCount = len(["yes" for word,tag,_ in context if ((tag == "VERB" and word in directionals) or word == "op_aux")])
	nounCount = len(["yes" for word,tag,_ in context if tag == "NOUN" or word in pronouns])

	zijnCheck = []

	#Checks for adjectives if the sentence does not only consist of verbs and nouns
	if len(context) != verbCount + nounCount:
		adjCheck = ["yes" for _,tag,dep in context if tag == "ADJ"]

		#Checks whether the verb "zijn" is in the sentence if adjectives have been found
		if adjCheck:
			zijnCheck = ["yes" for c in context if c[0] == "zijn" and c[2] == "cop"]

	#Will store the sign associated with the latest index for indexing adjectives
	indexSign = ""


	#Checks each word in the sentence and updates context accordingly with the necessary indexes
	for i, sign in enumerate(context):
		end = len(context) - 1
		word = sign[0]
		tag = sign[1]
		p = ""
		if word == "zijn" and sign[2] == "cop":
			del context[i]
			sign = context[i]
			word = sign[0]
			tag = sign[1]

		#Adds the correct index to the sentence
		if (tag == "NOUN" and word != "op_aux") or word in pronouns:
			#Chooses the correct index
			if word in ["ik","index_1"]:
				index = "1"
				if word == "index_1":
					sign = ("ik","")
			elif word in ["jij","index_2"]:
				index = "2"
				if word == "index_2":
					sign = ("jij","")
			elif word == "index_3a" or word == "index_3b":
				indexSign = word
				p = indexes.index(word.upper())
				p = indexes.pop(p)
				index = p[-2:]
				#Adds the used INDEX to the end of the list so it can be re-used
				indexes.append(p)
				tag = ""
			else:
				#Ensures that INDEX_3A and INDEX_3B alternate
				p = indexes.pop(0)
				index = p[-2:]
				#Adds the used INDEX to the end of the list so it can be re-used
				indexes.append(p)
				indexSign = p

			#adds the index to the last verb
			if subjObj and ((len(subjObj[-1]) < 3 and type(subjObj[-1][0] == int)) or len(subjObj[-1]) < 2):
				subjObj[-1].append((index,i))
			#creates a new tuple if the last directional verb already has two indexes assinged to it
			elif verbCount > 0 and nounCount > 1:
				subjObj.append([(index,i)])
			elif tag == "NOUN" and not zijnCheck:
				indexSign = ""
				continue

			nounCount = nounCount - 1
			#Modifies the word if it's a noun or index_3a or index_3b
			if p:
				#Replaces the word with its corresponding index
				sign = (p,"")
				if tag == "NOUN":
					if i != end and context[i+1][1] != "ADJ":
						#Inserts the noun before the index
						context.insert(i,sign)
					else:
						context[i] = sign

		#Modifies the word in the case that it's an index placed for reference in a later sentence
		elif word in ["i_3a","i_3b"]:
			word = "INDEX_" + word[-2:].upper()
			context[i] = (word,"")
			continue

		elif subjObj and ((tag == "VERB" and word in directionals) or word == "op_aux") and len(subjObj[-1]) != 3:
			#Stores the index of the verb so the INDEXES of the subject and object can be added to it later
			subjObj[-1].insert(0,i)
			verbCount = verbCount - 1

		elif tag == "ADJ" and (sign[2] == "ROOT" or (i != end and context[i+1][1] != "ADJ")) and indexSign:
			#Inserts the index of the most recent noun after the adjective
			context.insert(i+1,(indexSign,""))

		#Removes the dependencies from the words
		context[i] = sign[:2]

	end = len(context)

	if subjObj:
		for item in subjObj:
			#Adds the INDEXES of the corresponding subject and object to the verbs
			if type(item[0]) == int:
				i = item[0] - (end - len(context))
				verb = list(context[i])
				verb.append(item[1][0])
				if len(item) < 3:
					continue
				verb.append(item[2][0])
				#Deals with the special case of op_aux
				if verb[0] == "op_aux":
					verb[0] = "_".join(["op",verb[2],verb[3]])
					verb = [verb[0],""]
				context[i] = tuple(verb)
			#Removes INDEXES from context in the case that they are unnecessary
			else:
				i = item[0][1]
				if context[i][0] not in pronouns:
					del context[i+1]
				if len(item) == 2 and context[item[1][1]][0] not in pronouns:
					del context[item[1][1]]

	return context

# return which indicators are present in sentence, else return false
def indicatorCheck(sentence):
	# negation indicators
	if 'n(' in sentence and ')n' in sentence:
		return ('n(', ')n')
	# affirmation indicators
	elif 'a(' in sentence and ')a' in sentence:
		return ('a(', ')a')
	# neither
	else:
		return False

# remove indicators and save their place in the sentence
def removeIndicators(sentence, indicator):
	# copysent = sentence
	if indicator:
		indBegin, indClose = indicator
		# save where indicators were found
		begin = sentence.find(indBegin)
		end = sentence.find(indClose)
		# remove them temporarily from sentence
		sentence = sentence.replace(indBegin, '')
		sentence = sentence.replace(indClose, '')
		# remember"if removed, for future
		return sentence, begin, end
	return sentence, '', ''

# replace indicators in context
def replaceIndicators(context, token, indicator, begin, end, already, size):
	if indicator:
		indBegin, indClose = indicator
		size += len(token) + 1 # account for space
		# add 'n(' or 'a(' when arrived at the right index, and you haven't added it before
		if size >= begin and already == False:
			context.append((indBegin, ''))
			already = True
			size += 1 # account for size of "n(" (would be +=2, but since there is already a space it's +=1)
			return context, already, size

		# add ')n' or ')a' when arrived at the right index, and you have encountered a 'n(' before
		if size >= end and already:
			context.append((indClose, ''))
			already = None
			size += 1
			return context, already, size

	return context, already, size

# detect WH-questions
def whDetect(context):
	WHwords = ['HOE', 'WAAROM', 'WANNEER', 'WIE', 'WAT', 'WAAR', 'WAARVOOR']
	for item in context:
		if item[0].upper() in WHwords:
			return True
	return False

def altDetect(context):
	if context[-1][0] == ',':
		return True
	else:
		return None

# def negCheck(word, neg):
# 	# negation cases
# 	# start negating
# 	if word == 'N(':
# 	    return True
# 	# stop negating
# 	if word == ')N':
# 	    return None
# 	# affirmation cases
# 	# start affirming
# 	if word == 'A(':
# 	    return False
# 	if word == ')A':
# 	    return None
# 	# leave previous neg if none of these cases
# 	return neg

# concatenate certain verbs with 'niet'
def neg_verbs_concat(context):
	newcontext = []
	newentry = ''
	end = len(context)
	skipone= False
	# loop over context
	for i, item in enumerate(context):
		# verbs with integrated negation
		verbs = ['willen', 'wil', 'kunnen', 'kan', 'mogen', 'mag', 'hoeven', \
									'hoeft', 'lukken', 'lukt', 'doen', 'doe']
		# once you encounter 'niet'
		if item[0] == 'niet':
			if i-1 != -1: # check if not out of bounds
				# when the previous entry is in verb list
				preventry = context[i-1][0]
				if preventry in verbs:
					# turn 'willen' into 'wil', 'kunnen' into 'kan', etc
					index = verbs.index(preventry)
					if index % 2 == 0:
						index += 1
					# concatenate the 2 entries
					newentry += verbs[index] + '_niet'
					newcontext = newcontext[:-1]
					# add to new context
					newcontext.append((newentry, 'VERB'))
					continue
			if i+1 != end: # check if not out of bounds
				# when the next entry is in verb list
				nextentry = context[i+1][0]
				if nextentry in verbs:
					# turn 'willen' into 'wil', 'kunnen' into 'kan', etc
					index = verbs.index(nextentry)
					if index % 2 == 0:
						index += 1
					# concatenate the 2 entries
					newentry += verbs[index] + '_niet'
					newcontext.append((newentry, 'VERB'))
					# make sure to not add the verb to the context twice
					skipone = True
					continue
		# skip one context item if necessary
		if not skipone:
			# add item to context
			newcontext.append(item)
		else:
			skipone = False

	# print('newcontext: ', newcontext)
	return newcontext

# add negation to context when dealing with negation words
def negating(context, question = False):
	newcontext = []
	negationwords = ['geen', 'niemand', 'nergens', 'niets', 'nooit', 'nog_niet', \
	'wil_niet', 'mag_niet', 'kan_niet', 'lukt_niet', 'hoeft_niet','doe_niet']
	last = len(context)
	# ignore questionmark at the end of the sentence
	buffer = 0
	if question:
		buffer += 1
	# reject sentences where negation is already satisfied
	insertion = False
	for i, tuple in enumerate(context):
		newcontext.append(tuple)
		word = tuple[0]
		# ignore if already manually negated or affirmed
		if word == 'n(' or word == 'a(':
			return context
		# add start of negation
		if word in negationwords:
			newcontext.insert(i, ('n(', ''))
			insertion = True
		# add end of negation
		if i + 1 + buffer == last and insertion:
			newcontext.append((')n', ''))

	return newcontext

def find_matches(word, context):
	partly = False
	matches = {}
	for key in infoSigns.keys():
		if word in key:
			partly = True
			matches[key] = 1
			if word == key:
				matches[key] = 4
				break # will stop looking for other words if it finds the full key. maybe different with SPRINGEN vs SPRINGEN_PAARD?

			for con in context:
				contextword = str(con[0]).upper()
				word1 = contextword + '_'
				word2 = '_' + contextword
				word3 = '(' + contextword + ')'

				if re.search(r"\b" + re.escape(word), key): #word1 in key:
					if key not in matches:
						matches[key] = 1
				if re.search(r"\b" + re.escape(word1), key): #word1 in key:
					if key in matches:
						matches[key] = matches[key]+1
					else:
						matches[key] = 1
				if re.search(re.escape(word2) + r"\b", key):
					if key in matches:
						matches[key] = matches[key]+0.75
					else:
						matches[key] = 0.75
				if re.search(re.escape(word3) + r"\b", key):
					if key in matches:
						matches[key] = matches[key]+0.75
					else:
						matches[key] = 0.75
	print(matches)
	return partly, matches

def fingerspell(word, neg, WH, sigml):
	letters = []
	num = 1
	for i in range(0, len(word)-1, 1):
		currletter = word[i]
		if currletter == word[i+1]:
			num+=1
		else:
			while num > 2:
				letters.append("".join([currletter,]*2))
				num = num - 2
			letters.append("".join([currletter,]*num))
			num = 1
	letters.append(word[-1])
	# fingerspell each letter
	for letter in letters:
		if letter == '_':
			continue
		letter += '_VINGERSPELLEN'
		sigml, neg = get_sigml_neg(letter, '', neg, WH, [], {}, sigml)
	return sigml, neg

def get_sigml_neg(word, pos, neg, WH, context, matches, sigml):
	currentSign = Sign(word, pos, neg, WH, context, matches)
	currentSigml = Sign.get_full_sigml(currentSign)
	sigml += currentSigml + '\n'
	neg = currentSign.neg
	return sigml, neg

def sign_number(word, neg, WH, sigml, context):
	numbers = list(word)
	length = len(numbers)
	switch = {4:'DUIZEND', 5:'DUIZEND', 6:'DUIZEND', 7:'MILJOEN', 8:'MILJOEN',
			  9:'MILJOEN', 10:'MILJARD', 11:'MILJARD', 12:'MILJARD'}
	while length > 0:
		mod = length%3
		if mod == 2:
			number = numbers[0] + numbers[1]
			_, matches = find_matches(number, context)
			sigml, neg = get_sigml_neg(number, '', neg, WH, [], matches, sigml)
			numbers = numbers[2:]
		if mod == 1:
			num = written_num(numbers[0])
			_, matches = find_matches(num, context)
			sigml, neg = get_sigml_neg(num, '', neg, WH, [], matches, sigml)
			numbers = numbers[1:]
		if mod == 0:
			number = numbers[1] + numbers[2]
			if numbers[0] != '1':
				num = written_num(numbers[0])
				_, matches = find_matches(num, context)
				sigml, neg = get_sigml_neg(num, '', neg, WH, [], matches, sigml)
			sigml, neg = get_sigml_neg('HONDERD', '', neg, WH, [], {}, sigml)
			_, matches = find_matches(number, context)
			sigml, neg = get_sigml_neg(number, '', neg, WH, [], matches, sigml)
			numbers = numbers[3:]
		if length in switch.keys():
			sigml, neg = get_sigml_neg(switch[length], '', neg, WH, [], {}, sigml)
		length = len(numbers)
	return sigml, neg

def written_num(num):
	num = int(num)
	if num == 1:
		return 'EEN_1'
	elif num == 2:
		return 'TWEE_2'
	elif num == 3:
		return 'DRIE_3'
	elif num == 4:
		return 'VIER_4'
	elif num == 5:
		return 'VIJF_5'
	elif num == 6:
		return 'ZES_6'
	elif num == 7:
		return 'ZEVEN_7'
	elif num == 8:
		return 'ACHT_8'
	elif num == 9:
		return 'NEGEN_9'
	return str(num)


# add affirmation to context when dealing with negation words
def affirming(context, question = False):
	newcontext = []
	affirmationwords = ['wel',	'kunnen', 'lukken', 'kunnen_01']
	last = len(context)
	# ignore questionmark at the end of the sentence
	buffer = 0
	if question:
		buffer += 1
	# reject sentences where negation is already satisfied
	insertion = False
	for i, tuple in enumerate(context):
		newcontext.append(tuple)
		word = tuple[0]
		# ignore if already manually negated or affirmed
		if word == 'a(' or word == 'n(':
			return context
		# add start of affirmation
		if word in affirmationwords:
			newcontext.insert(i, ('a(', ''))
			insertion = True
		# add end of affirmation
		if i + 1 + buffer == last and insertion:
			newcontext.append((')a', ''))

	return newcontext

# alt = True: means left side of OR
# alt = False: means right side of OR
# alt = None: means it isn't an alternative question at all
# only put out true when at the left side of the OR
def leftsideOr(alt, i, word, pos, context):
	# ignore queries that aren't alternative questions
	if alt == True:
		# sign OR in the middle
		if word == 'OF':
			alt = False
			return (False, alt)

		# sign the first word, as well as the optional index in the middle
		next = context[i+1][0]
		nextnext = context[i+2][0]
		if ((i == 0 and pos == 'NOUN' and next != 'of') or # first noun without index
		(i == 0 and pos == 'NOUN' and next == 'INDEX_A' and nextnext != 'of') or # first noun with index
		(i == 1 and word == 'INDEX_3A' and next != 'OF')): # index from first noun
			return (False, alt)

		# otherwise sign on the left side
		else:
			return (True, alt)

	return (False, alt)

# only put out true when at the right side of the OR
def rightsideOr(alt, i, word, pos, context):
	# ignore queries that aren't alternative questions
	if alt == False and word != 'Q_PART_ALT':
		# sign the verb at the end in the middle
		next = context[i+1][0]
		prev = context[i-1][0]
		if pos == 'VERB' and next == ',' and prev != 'of':
			return (None, None)
		# otherwise sign on the right side
		else:
			return (True, alt)
	return (False, alt)

if __name__ == '__main__':
	if len(sys.argv) == 1:
		print("Please specify some input")
	elif type(sys.argv[1]) == str:
		# Calls the function if input is gloss and hamnosys
		if sys.argv[1].isupper() and sys.argv[2][0:3] == "ham":
			if len(sys.argv) == 3:
				 addSign(sys.argv[1], sys.argv[2], '')
			if len(sys.argv) == 4:
				addSign(sys.argv[1], sys.argv[2], sys.argv[3])
		else:
			print("This input is invalid")
