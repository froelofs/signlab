from copy import deepcopy
from newDict import newDict
#import sys
from nonmanuals import simpleNonmanuals
from nonmanuals import complexNonmanuals
import xml.etree.ElementTree as ET


# Converts the user input nonmanual to the correct SiGML naming conventions
def convert(inputtag):
    '''TODO: complex simpleNonmanuals ook bij split, toevoegen aan dict'''
    search = {}
    [tier, tag] = inputtag.split("_")
    # Checks whether the given tier exists in the simple nonmanuals
    try:
        simpleNonmanuals[tier]
    # Searches for the tier in the complex nonmanuals when an exception occurs
    except Exception:
        #print("Searching in complex nonmanuals")
        # Loops over the complex nonmanuals to search for a matching tier
        for category in complexNonmanuals.keys():
            # Checks whether the tier matches the first two letters of a category
            if category[:2] == tier.lower():
                search = complexNonmanuals[category]
        try:
            search[tag.lower()]
        # Prints an error message if the tag (emotion) cannot be found
        except Exception:
            print("Tag " + tag + " could not be found in the complex nonmanuals")
        # Returns the converted tag if found in the complex nonmanuals
        else:
            return search[tag.lower()]
    # Searches for the tier in the simple nonmanuals when no exception occurs
    else:
        #print("Searching in simple nonmanuals")
        search = simpleNonmanuals[tier]
        # Checks whether the tag exists in the tier and if so returns the converted tag
        for key in search.keys():
            for val in search[key]:
                if val == tag:
                    return key + "='" + val + "'" # e.g. "shoulder_movement movement='UL'"
        print("Tag '"+ tag + "' could not be found in the simple nonmanuals")

    print("Tag '"+ tag + "' could not be found in combination with tier '"+ tier + "'")


# Inserts the necessary syntax to execute the user input nonmanuals
def tagsToSiGML(signsWithTags, parFace = True, parMouth = False):
    additionalSiGML = {}
    print("signs with tags: ", signsWithTags)
    # keys = []
    # for key in signsWithTags.keys():
    #     if type(key) == str:
    #         keys.append(key)
    #     # Adds the complex nonmanuals list items as separate elements
    #     elif type(key) == list:
    #         keys.extend(key)

    #Loops over each sign and formats the corresponding nonmanuals in SiGML
    for sign in signsWithTags.keys():
        tags = []
        values = signsWithTags[sign]

        #Loops over the nonmanuals to put simple and complex nonmanuals in one list
        for tag in values:
            if type(tag) == str:
                tags.append(tag)
            # Individually adds the elements of the complex nonmanuals list
            elif type(tag) == list:
                tags.extend(tag)

        # Inserts the necessary xml tags and groups the user input nonmanuals by tier
        faceTags = ['<' + tag + '/>' for tag in tags if ("eye_brows" or "eye_lids" or "nose") in tag]
        mouthTags = ['<' + tag + '/>' for tag in tags if "mouth" in tag]
        shoulderTags = ['<' + tag + '/>' for tag in tags if "shoulder" in tag]
        headTags = ['<' + tag + '/>' for tag in tags if "head" in tag]
        bodyTags = ['<' + tag + '/>' for tag in tags if "body" in tag]
        eyeGazeTags = ['<' + tag + '/>' for tag in tags if ("eye_gaze" or "eye_par") in tag]
        avatarMorphTags = ['<' + tag + '/>' for tag in tags if "avatar_morph" in tag]


        # Adds tier syntax to the user input nonmanuals per tier and gathers the tiers in one string
        if(len(tags)):
            nonmanualsSiGML = '<sign_nonmanual>'
            if(len(shoulderTags)):
                nonmanualsSiGML += '<shoulder_tier>' + ''.join(shoulderTags) + '</shoulder_tier>'
            if(len(bodyTags)):
                nonmanualsSiGML += '<body_tier>' + ''.join(bodyTags) + '</body_tier>'
            if(len(headTags)):
                nonmanualsSiGML += '<head_tier>' + ''.join(headTags) + '</head_tier>'
            if(len(eyeGazeTags)):
                nonmanualsSiGML += '<eyegaze_tier>' + ''.join(eyeGazeTags) + '</eyegaze_tier>'
            if(len(faceTags)):
                nonmanualsSiGML += '<facialexpr_tier>' + '<facial_expr_par>' + ''.join(faceTags)
                nonmanualsSiGML += '</facial_expr_par>' + '</facialexpr_tier>'
                # Facial nonmanuals are executed simultaneously by default, but can be executed sequentially
                if not parFace:
                    nonmanualsSiGML = nonmanualsSiGML.replace('<facial_expr_par>','')
                    nonmanualsSiGML = nonmanualsSiGML.replace('</facial_expr_par>','')
            if(len(mouthTags)):
                # Mouthing nonmanuals are executed sequentially by default, but can be executed simultaneously
                if parMouth:
                    nonmanualsSiGML += '<mouthing_tier>' + '<mouthing_par>' + ''.join(mouthTags)
                    nonmanualsSiGML += '</mouthing_par>' +  '</mouthing_tier>'
                else:
                    nonmanualsSiGML += '<mouthing_tier>' + ''.join(mouthTags) + '</mouthing_tier>'
            if(len(avatarMorphTags)):
                nonmanualsSiGML += '<extra_tier>' + ''.join(avatarMorphTags) + '</extra_tier>'
            nonmanualsSiGML += '</sign_nonmanual>'
            additionalSiGML[sign] = nonmanualsSiGML
        else:
            additionalSiGML[sign] = ''

    return additionalSiGML

nonmansOrder = ["</shoulder_tier>", "</body_tier>", "</head_tier>","</eyegaze_tier>","</facialexpr_tier>","</mouthing_tier>","</extra_tier>"]

# Converts the signs and any user input nonmanuals into SiGML
def makeSiGML(nonmanualsToAdd):
    sigml = '<?xml version="1.0" encoding="UTF-8"?><sigml>'
    print("nonmanuals to add:", nonmanualsToAdd)

    # Loops over each sign in the input sentence and any nonmanuals the user added to them
    for sign, nonmanuals in nonmanualsToAdd.items():

        filename = "sigml/all/" + sign
        #print("file: ", filename)
        sigmlFile = open(filename, "r")

        # Loops over each line in the file and adapts the nonmanual section as necessary
        for line in sigmlFile:
            cleanline = line.strip()
            # Executes if the line does not contain formatting information
            if not ('<?xml' in cleanline or '<sigml>' in cleanline or '</sigml>' in cleanline):
                # print('nonmanuals: ', nonmanuals, cleanline)

                # If the sign already contains nonmanuals the opening and closing tags of the nonmanual
                # section are removed from the SiGML of the nonmnanuals to be added
                if cleanline == '<sign_nonmanual>':
                    nonmanuals = nonmanuals.replace('<sign_nonmanual>','')
                    nonmanuals = nonmanuals.replace('</sign_nonmanual>','')
                    sigml += cleanline
                # Executes if there are nonmanuals to add and a nonmanual tier is identified
                elif nonmanuals and ('_tier' in cleanline):
                    # Executes if the file line is the closing tag of a nonmanual tier
                    if '/' in cleanline:
                        end = nonmanuals.find(cleanline)
                        #print(cleanline)
                        # Performs additional checks and formatting if the nonmanual tier is found in
                        # the user input nonmanuals
                        if end != -1:
                            # Inserts all the remaining user input nonmanuals before the closing tag of
                            # the mouthing tier as that comes last in the nonmanual section
                            if 'mouth' in cleanline:
                                sigml += nonmanuals
                                nonmanuals = ''
                            # Inserts all of the user input nonmanuals of the current tier
                            else:
                                insertion = nonmanuals[:end+len(cleanline)]
                                nonmanuals = nonmanuals.replace(insertion, '')
                                sigml += insertion
                        # Simply adds the line if the tier is not found in the user input nonmanuals
                        else:
                            sigml += cleanline
                        # Replaces the processed line with an empty string in the user input nonmanuals
                        # to avoid duplicate processing without disrupting the for-loop
                        nonmanuals = nonmanuals.replace(cleanline,'')
                    # Executes if the file line is the opening tag of a nonmanual tier
                    else:
                        end = nonmanuals.find(cleanline)
                        # Executes if the opening tag is found in the user input nonmanuals
                        if end != -1:
                            # Inserts the user input nonmanuals of the previous tiers that were not found
                            # in the SiGML of the sign
                            insertion = nonmanuals[:end]
                            nonmanuals = nonmanuals.replace(insertion, '')
                            sigml += insertion
                        # Executes if the opening tag is not found in the user input nonmanuals
                        else:
                            # Retrieves the closing tag of the previous nonmanual tier
                            #print(cleanline[0] + "/" + cleanline[1:])
                            prevTierIndex = nonmansOrder.index(cleanline[0] + "/" + cleanline[1:]) - 1
                            previousTier = nonmansOrder[prevTierIndex]
                            end = nonmanuals.find(previousTier)
                            count = prevTierIndex - 1
                            while(end == -1):
                                previousTier = nonmansOrder[count]
                                end = nonmanuals.find(previousTier)
                                count -= 1
                                if count < 0:
                                    break
                            #print("stuff: ", nonmanuals[:end])
                            if end > -1:
                                # Inserts the user input nonmanuals of the previous tiers that were not found
                                # in the SiGML of the sign
                                insertion = nonmanuals[:end + len(previousTier)]
                                #print("insertion: ", insertion)
                                nonmanuals = nonmanuals.replace(insertion, '')
                                sigml += insertion
                        sigml += cleanline
                        nonmanuals = nonmanuals.replace(cleanline,'')
                # Inserts the remaining user input nonmanuals before the start of the manual part of the sign
                elif cleanline == '<sign_manual>':
                    sigml += nonmanuals
                    sigml += cleanline
                else:
                    # Removes duplicate nonmanuals from user input nonmanuals
                    if cleanline in nonmanuals:
                        nonmanuals.replace(cleanline,'')
                    sigml += cleanline

    sigml += '</sigml>' + '\n'

    #                     if tag in cleanline:
    #                         if not mouthing_tier or facialexpr_tier:
    #                             overwrite
    #                         else:
    #                             mouthing tier niet met par
    #                             if facial:
    #                                 if tag al in facial:
    #                                     overwrite
    #                                 if tag not in facial:
    #                                     toevoegen (met par)
    #             sigmlFile.write(line)
    # sigml += '</sigml>'
    return sigml


def main(sentence):
    print("input:", sentence)

    #Removes spaces from around input nonmanuals
    sentence = sentence.replace(">","> ")
    sentence = sentence.replace("<"," <")

    #Seperates the signs and nonmanuals from the input string into separate items in a list
    sentence = sentence.split()

    #Creates the necessary variables for storing converted signs and tags
    foundSigns = {}
    tags = []

    for sign in sentence:
        # Converts opening tags of input nonmanuals to the correct format
        if "<" in sign and "/" not in sign:
            opentag = sign.strip("<")
            opentag = opentag.strip(">")
            opentag = convert(opentag) # tag = "shoulder_movement movement='UL'"
            #Adds the nonmanual to the list to be added to the sign
            tags.append(opentag)
            continue
        # Converts closing tags of input nonmanuals to the correct format
        elif "/" in sign:
            closetag = sign.strip("</")
            closetag = closetag.strip(">")
            closetag = convert(closetag) # tag = "shoulder_movement movement='UL'"
            # Finds the nonmanual in the list to be added to the sign and removes it
            tags.remove(closetag)
            continue
        # Checks the dictionary for an entry matching the input sign
        else:
            try:
                newDict[sign]
            except:
                print("Could not find entry for:", sign)
                continue
            currenttags = deepcopy(tags)
            # Stores the sigml file of the sign and the converted nonmanuals together
            foundSigns[newDict[sign]] = currenttags
    # print("found files and converted tags: ", foundSigns)

    simpleNonmanuals = tagsToSiGML(foundSigns)
    sigml = makeSiGML(simpleNonmanuals)

    #print(sigml)
    return sigml

if __name__ == '__main__':
    #print("output sigml: ", main('U <EM_SADNESSI> ETEN KLAAR </EM_SADNESSI> <FT_RB> HEBBEN </FT_RB>'))
    # print("output sigml: ", main('U <EM_FEAR> ETEN </EM_FEAR> KLAAR <FT_RB> HEBBEN </FT_RB>'))
    # print("output sigml: ", main('U <FT_RB> ETEN KLAAR </FT_RB> HEBBEN'))
    # print("output sigml: ", main('<FT_RR> ETEN </FT_RR>'))
    #print("output sigml: ", main(sys.argv[1]))
    inputString = "U <ST_UL> ETEN KLAAR </ST_UL> HEBBEN"
    #inputString = 'U <ET_HD> ETEN KLAAR </ET_HD> HEBBEN'
    #inputString = 'U ETEN KLAAR HEBBEN'
    output = ET.fromstring(main(inputString))
    ET.indent(output)
    print("output sigml: \n" , ET.tostring(output, encoding='unicode'))
