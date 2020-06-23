import spacy
import sys
import nl_core_news_sm

# train nlp
nlp = spacy.load('nl_core_news_sm')

# leest de zinnen  naar grammatica zinnen
doc = nlp(sys.argv[1])

# ga door zin heen en print
def parse(sentence):
    print(sentence)
    for token in sentence:
        # print('noun/verb/etc', 'subject/adjective/etc')
        print(token.pos_, token.dep_)

parser = [parse(sent) for sent in doc.sents]
