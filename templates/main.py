# from dictFile import infoSigns
from sendsigml import sendsigml
from sign import Sign
import tempfile
import pickle
import sys
import re
import spacy
from spacy.symbols import ORTH, POS, ADJ, VERB, ADV
import nl_core_news_sm
from functions import indexing, negating, affirming, whDetect, altDetect, neg_verbs_concat, find_matches, fingerspell, leftsideOr, rightsideOr, removeIndicators, indicatorCheck, replaceIndicators, sign_number
infoSigns = pickle.load(open("dictFile.p", "rb"))
nlp = spacy.load('nl_core_news_sm')
# nlp.tokenizer.add_special_case('index_3a', [{ORTH: 'aaaaaaa', POS: 'VERB'}])
# nlp.tokenizer.add_special_case('index_3b', [{ORTH: 'bbbbbbb', POS: 'VERB'}])
# special_case =

# generate avatar movement from glossed NGT sentence
# input(str): Glossed NGT sentence, separated by spaces
# output(if sigml open): avatar movement
def main(sentence):


    # general info to make a sigml text work
    xml_version = '1.0'
    encoding = 'utf-8'
    preamble = '<?xml version="{}" encoding="{}"?>\n<sigml>\n\n'.format(xml_version, encoding)
    postamble = '\n</sigml>'
    abc = ['A', 'AA', 'B', 'BB', 'C', 'CC', 'D', 'DD', 'E', 'EE', 'F', 'FF',
           'G', 'GG', 'H', 'I', 'II', 'J', 'K', 'KK', 'L', 'LL', 'M', 'MM', 'N',
           'NN', 'O', 'OO', 'P', 'PP', 'Q', 'QQ', 'R', 'RR', 'S', 'SS', 'T',
           'TT', 'U', 'UU', 'V', 'W', 'WW', 'X', 'Y', 'YY', 'Z', 'ZZ']

# 1-------------------------- zou allemaal in een functie kunnen (lijkt me?)
    indicator = indicatorCheck(sentence)
    sentence, begin, end = removeIndicators(sentence, indicator)

    # generate POS-tags of input sentence
    doc = nlp(sentence.lower())

    # organise context
    # context = [(str(token), token.pos_) for sent in doc.sents for token in sent]
    context = []
    size = 0
    already = False
    for sent in doc.sents:
        for token in sent:
            if begin == 0 and size == 0:
            # append word with context
                context, already, size = replaceIndicators(context, token, indicator, begin, end, already, size)
                context.append((str(token.text), token.pos_, token.dep_))
            # replace negation/affirmation indicators from before
            else:
                context.append((str(token.text), token.pos_, token.dep_))
                context, already, size = replaceIndicators(context, token, indicator, begin, end, already, size)

    # concatenate special verb cases with 'niet'
    context = neg_verbs_concat(context)
    # add negation indicators and indexes
    context = indexing(context)
    context = negating(context, context[-1][1]=='PUNCT')
    context = affirming(context, context[-1][1]=='PUNCT')
# 1---------------------------

    print("context:", context)

# 2--------------------------zou allemaal in een functie kunnen (lijkt me?)
    # detect WH-questions
    wh = whDetect(context)
    # detect alternative questions
    alt = altDetect(context)

    sigml = ''
    neg = None
    left = False
    end = len(context)
    # generate markup for the signs in the sentence
    for i,item in enumerate(context):
        word = item[0]
        pos = item[1]
        word = word.upper()
        partly = False
        # print(word)

        # single letters are automatically spelled
        if word in abc:
            word += '_VINGERSPELLEN'

        # handle questionmark
        if word == '?':
            # add palm up movement when handling WHquestions
            if wh:
                word = 'PALM_OMHOOG'
            # don't do anything with yes/no questions
            else:
                continue

        # or alternative questiones
        if word == ',':
            word = 'Q_PART_ALT'

        # start negation
        if word == 'N(':
            neg = True
            continue

        # start affirmation
        if word == 'A(':
            neg = False
            continue

        # stop negation or affirmation
        if word == ')N' or word == ')A':
            neg = None
            continue

        # Stores the index
        if "3B" in word:
            left = True

        if word.isnumeric():
            sigml, neg = sign_number(word, neg, wh, sigml, context)
        else:
            # checks if word is partly in dict, adds to matches
            partly, matches = find_matches(word, context)

        # print(matches)
        if not partly and not word.isnumeric():
            sigml, neg = fingerspell(word, neg, wh, sigml)
        # if a word is partly in the dict, find the sign
        elif partly:
            currentSign = Sign(word, pos, neg, wh, context, matches)
            # alternative questions: turn body right
            if alt == True:
                checkL, altNew = leftsideOr(alt, i, word, pos, context)
                # either append the right nonmanual
                if checkL:
                    currentSign.nonmanual.append('<hnm_body tag = "RL"/>')
                    # currentSign.nonmanual.append('<hnm_head tag = "TL"/>')
                    # currentSign.nonmanual.append('<hnm_head tag = "TL"/>')
                    # currentSign.nonmanual.append('<hnm_head tag = "TL"/>')
                # or update alternative question status
                else:
                    alt = altNew
            # alternative questions: turn body left
            elif alt == False:
                checkR, altNew = rightsideOr(alt, i, word, pos, context)
                # either append the right nonmanual
                if checkR:
                    currentSign.nonmanual.append('<hnm_body tag = "RR"/>')
                    # currentSign.nonmanual.append('<hnm_head tag = "TR"/>')
                    # currentSign.nonmanual.append('<hnm_head tag = "TR"/>')
                    # currentSign.nonmanual.append('<hnm_head tag = "TR"/>')
                # or update alternative question status
                else:
                    alt = altNew

            #Performs the sign on the left side with the left hand if the index is 3B
            elif left and (pos == "NOUN" or pos == "ADJ"):
                currentSign = currentSign.mirror()
                left = False
            elif pos == "VERB" and len(item) > 2:
                currentSign.directional(item[2:])
            #Turns the body and head towards INDEX_3A and INDEX_3B
            elif pos != "ADJ":
                if (pos == "NOUN" and i+1 != end) and (i != 0 and end != 1):
                    if context[i+1][0] == "INDEX_3A":
                        currentSign.nonmanual.append('<hnm_body tag = "RR"/>')
                        # currentSign.nonmanual.append('<hnm_head tag="SR"/>')
                    elif context[i+1][0] == "INDEX_3B":
                        currentSign.nonmanual.append('<hnm_body tag = "RL"/>')
                        # currentSign.nonmanual.append('<hnm_head tag="SL"/>')
                elif word == "INDEX_3A":
                    currentSign.nonmanual.append('<hnm_body tag = "RR"/>')
                    # currentSign.nonmanual.append('<hnm_head tag="SR"/>')
                elif word == "INDEX_3B":
                    currentSign.nonmanual.append('<hnm_body tag = "RL"/>')
                    # currentSign.nonmanual.append('<hnm_head tag="SL"/>')

            currentSigml = Sign.get_full_sigml(currentSign)
            #print(currentSigml)
            sigml += currentSigml + '\n'
            # neg = currentSign.neg
# 2--------------------------

    sigmlsentence = preamble + sigml + postamble
    print(sigmlsentence)
    return sigmlsentence

    # create temporary file
    # tempSigmlFile = tempfile.NamedTemporaryFile(suffix = '.sigml')
    # tempSigmlFile.write(sigmlsentence.encode())
    # tempSigmlFile.read()
    #
    # # feed it to sigml-player
    # sendsigml([tempSigmlFile.name])
    #
    # # delete temporary file
    # tempSigmlFile.close()

if __name__ == '__main__':
    if len(sys.argv) == 1:
        print("Please specify a glossed sentence to be signed")
    else:
        main(sys.argv[1])
