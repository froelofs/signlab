# import tempfile
import sys
import os
from newDict import newDict

def main(sentence):
    print("input:", sentence)

    # a_file = open("newDict.", "r")
    # output = a_file.read()

    for sign in sentence:
        if newDict[sign]:
            print("SiGML found:", newDict[sign])
        else:
            print("Could not find entry for", sign)



if __name__ == '__main__':
    # lines = sys.stdin.readlines()
    # if len(lines) == 0:
    #     userInput = sys.argv[1:]
    # else:
    #     userInput = lines[0].strip("\n").split(" ")
    main(sys.argv[1:])