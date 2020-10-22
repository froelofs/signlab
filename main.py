#!/var/www/illc/projects/signlanguage/venv/bin/python

'''
Signs NGT sentence using the JASigning avatar

input(str): glossed NGT sentence, separated by spaces
output(sigml-player open): avatar movement
'''
import tempfile
import sys
import functionsGrammar as fg
import functionsMain as fm
import functionsAux as fa
# import sendsigml as ss
import sign
import pickle
# infoSigns = pickle.load(open("dictFile.p", "rb")) #signdict
from dictFile import infoSigns

def main(sentence, flag = False):

    #General info to make a sigml text work
    xml_version = '1.0'
    encoding = 'utf-8'
    preamble = '<?xml version="{}" encoding="{}"?>\n<sigml>\n\n'.format(xml_version, encoding)
    postamble = '\n</sigml>'

    #Approximates and adds indeces, negation scope and affirmation scope (preferably replaced by a grammar in the future)
    context = fg.preprocess(sentence)

    #Creates the SiGML of the signs
    sigml, glosses = fm.processSentence(context, flag)
    
    #Creates the contents of the SiGML file
    sigmlsentence = preamble + sigml + postamble
    print(sentence, ";", " ".join(glosses), ";", sigmlsentence)

if __name__ == '__main__':
    lines = sys.stdin.readlines()
    #User did not specify glossed sentence
    if len(lines) == 0:
        if len(sys.argv) == 1:
            print("Please specify a glossed sentence to be signed")
            quit()
        else:
            userInput = sys.argv[1:]
    elif lines[0] == "\n":
        print("Please specify a glossed sentence to be signed")
        quit()
    else:
        userInput = lines[0].strip("\n").split(" ")

    #Explains sign
    if userInput[0] == 'explain':
        #User did not specify sign to be explained
        if len(userInput) == 1:
            print("Please specify a sign to be explained")
        #Sign is specified by user
        else:
            #Sign is not in the database
            if not userInput[1].upper() in infoSigns:
                print("Please specify a sign that is in the database ()")
            #Sign is in the database
            else:
                fa.explainSign(sign.Sign(str(userInput[1])).get_gloss())

    #Fingerspells input
    elif userInput[0] == 'spell':
        #User did not specify input to be fingerspelled
        if len(userInput) == 1:
            print("Please specify input to be fingerspelled")
        #Input is specified by user
        else:
            main(userInput[1], str(userInput[0]))

    #Adds a sign to dictionary
    elif userInput[0] == 'add':
        #User did not specify all values
        if len(userInput) < 5:
            print("Please specify gloss, HamNoSys-SiGML, and SAMPA, in that order")
        #All values are specified
        else:
            #Gloss is already present in dictionary
            if userInput[1] in infoSigns:
                #Ask if user is reaaally sure about their decision
                var = input("Gloss already in dictionary\nAre you sure you want to overwrite it?\n(Y/N) ")
                print()
                #Only changes dict entry when answer is Y, y or yes
                if var == 'Y' or var == 'y' or var == 'yes':
                    fa.addSign(userInput[1], userInput[2], userInput[3])
                #Reassures user nothing has been changed in the dictionary.
                else:
                    print("Nothing added to or changed in the dictionary")
            #Gloss not present in dictionary
            else:
                fa.addSign(userInput[1], userInput[2], userInput[3])

    #Processes sentence
    else:
        main(" ".join(userInput))
        
