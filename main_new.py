#!/var/www/illc/projects/signlanguage/venv/bin/python

'''
Signs NGT sentence using the JASigning avatar

input(str): glossed NGT sentence, separated by spaces
output(sigml-player open): avatar movement
'''

import sys
from gloss2sigml import main as createSigml
# from newDict import newDict as infoSigns


def main(sentence, flag = False):
    print(createSigml(sentence))
    

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

    #Fingerspells input
    if userInput[0] == 'spell':
        #User did not specify input to be fingerspelled
        if len(userInput) == 1:
            print("Please specify input to be fingerspelled")
        #Input is specified by user
        else:
            main(userInput[1], str(userInput[0]))
    #Processes sentence
    else:
        main(" ".join(userInput))
        
