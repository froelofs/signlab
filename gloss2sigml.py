# import tempfile
import sys
import os
from copy import deepcopy
from newDict import newDict
import re


#Example: <st_ul></st_ul> = shoulder_tier -> shoulder_movement -> UL
nonmans = {
    "ST" : {
        "shoulder_movement movement": ["UL", "UR", "UB", "HL", "HR", "HB", "SL", "SR", "SB"]
    },
    "BT": {
        "body_movement movement": ["RL", "RR", "TL", "TR", "TF", "TB", "SI", "HE", "ST", "RD"]
    },
    "HT": {
        "head_movement movement": ["NO", "SH", "SR", "SL", "TR", "TL", "NF", "NB", "PF", "PB", "LI"]
    },
    "ET": {
        "eye_gaze direction": ["AD", "FR", "HD", "HI", "HC", "UP", "DN", "LE", "RI", "NO", "RO", "LU", "LD", "RU", "RD"]
    },
    "FT": {
        "eye_brows movement": ["RB", "RR", "RL", "FU"],
        "eye_lids movement": ["WB", "WR", "WL", "SB", "SR", "SL", "CB", "CR", "CL", "TB", "TR", "TL", "BB"],
        "nose movement": ["WR", "TW", "WI"]
    },
    "MT": {
        "mouth_gesture movement": ["D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "J01", "J02",
                        "J03", "J04", "L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08", "L09",
                        "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20",
                        "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31",
                        "L32", "L33", "L34", "L35", "C01", "C02", "C03", "C04", "C05", "C06", "C07",
                        "C08", "C09", "C10", "C11", "C12", "C13", "T01", "T02", "T03", "T04", "T05",
                        "T06", "T07", "T08", "T09", "T10", "T11", "T12", "T13", "T14", "T15", "T16", "T17"]
    }
}

def convert(inputtag):
    '''TODO: complex nonmans ook bij split, toevoegen aan dict'''
    [tier, tag] = inputtag.split("_")
    # Checks whether the given tier exists
    try:
        nonmans[tier]
    except:
        print("Tier '"+ tier + "' could not be found")
        # return None

    search =  nonmans[tier]
    # Checks whether the tag exists in the tier and if so returns the converted tag
    for key in search.keys():
        for val in search[key]:
            if val == tag:
                return key + "='" + val + "'" # e.g. "shoulder_movement movement='UL'"
    
    print("Tag '"+ tag + "' could not be found in combination with tier '"+ tier + "'")
    # return None

def tagsToSiGML(signsWithTags):
    signNonmans = {}
    for key in signsWithTags.keys():
        # for value in foundsigns[key]:
        tags = signsWithTags[key]
        
        faceTags = ['<' + tag + '>' for tag in tags if ("eye_brows" or "eye_lids" or "nose") in tag]
        mouthTags = ['<' + tag + '>' for tag in tags if "mouth" in tag]
        shoulderTags = ['<' + tag + '>' for tag in tags if "shoulder" in tag]
        headTags = ['<' + tag + '>' for tag in tags if "head" in tag]
        bodyTags = ['<' + tag + '>' for tag in tags if "body" in tag]
        eyeGazeTags = ['<' + tag + '>' for tag in tags if ("eye_gaze" or "eye_par") in tag]

        if(len(tags)):
            nonmanSiGML = '<sign_nonmanual>'
            if(len(shoulderTags)):
                nonmanSiGML += '<shoulder_tier>' + ''.join(shoulderTags) + '</shoulder_tier>'
            if(len(bodyTags)):
                nonmanSiGML += '<body_tier>' + ''.join(bodyTags) + '</body_tier>'
            if(len(headTags)):
                nonmanSiGML += '<head_tier>' + ''.join(headTags) + '</head_tier>'
            if(len(eyeGazeTags)):
                nonmanSiGML += '<eyegaze_tier>' + ''.join(eyeGazeTags) + '</eyegaze_tier>'
            # Nonmanuals in the facial expression tier are articulated simultaneously instead of sequentially
            if(len(faceTags)):
                nonmanSiGML += '<facialexpr_tier>' + '<facial_expr_par>' + ''.join(faceTags) 
                nonmanSiGML += '</facial_expr_par>' + '</facialexpr_tier>'
            if(len(mouthTags)):
                nonmanSiGML += '<mouthing_tier>' + ''.join(mouthTags) + '</mouthing_tier>'
            nonmanSiGML += '</sign_nonmanual>'
            signNonmans[key] = nonmanSiGML
        else:
            signNonmans[key] = ''
    
    return signNonmans


def makeSiGML(signNonmans):
    sigml = '<?xml version="1.0" encoding="UTF-8"?><sigml>'
    print(signNonmans)
    for sign, nonmanuals in signNonmans.items():

        filename = "sigml/all/" + sign
        print("file: ", filename)
        sigmlFile = open(filename, "r")

        # nonman = False

        for line in sigmlFile:
            cleanline = line.strip()
            if not (cleanline.startswith('<?xml') or cleanline.startswith('<sigml>') or cleanline.startswith('</sigml>')):
                if cleanline == '<sign_nonmanual>':
                    nonmanuals = nonmanuals.replace('<sign_nonmanual>','')
                    nonmanuals = nonmanuals.replace('</sign_nonmanual>','')
                elif nonmanuals and ('_tier' in cleanline):
                    if not '/' in cleanline:
                        print(nonmanuals)                       
                        if 'facial' in cleanline:
                            print('face:', cleanline)
                            end = nonmanuals.find('</facial_expr_par>')
                            insertion = nonmanuals[:end]
                        else:
                            end = nonmanuals.find(cleanline.replace('<', '</'))
                            if end > -1:
                                if 'mouth' in cleanline:
                                    print('mouth:', cleanline)
                                    insertion = nonmanuals[:end]
                                else:
                                    print('other:', cleanline)
                                    insertion = nonmanuals[:end+len(cleanline)+1]
                        sigml += insertion
                        nonmanuals = nonmanuals.replace(insertion, '')
                    else:
                        if 'facial' in cleanline and cleanline in nonmanuals:
                            nonmanuals = nonmanuals.replace(cleanline, '')
                        elif 'mouth' in cleanline:
                            nonmanuals = nonmanuals.replace(cleanline, '')
                        sigml += cleanline
                else:
                    sigml += cleanline
                print('nonmanuals: ', nonmanuals)
        sigml +='\n'             
    
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

    # a_file = open("newDict.", "r")
    # output = a_file.read()
    # U HN(BR(ETEN GENOEG)) AVG
    # U <HT_HO> <FT_BR> ETEN GENOEG </FT_BR></HT_HO> <CQ> HEBBEN </CQ>
    # sentence = ["U", "<HT_HO>", "<FT_BR>", "ETEN", "GENOEG", "</FT_BR>", "</HT_HO>", "HEBBEN"]
    # ? toevoegen

    foundSigns = {}
    
    sentence = sentence.replace(">","> ")
    sentence = sentence.replace("<"," <")
    sentence = sentence.split()
    tags = []

    for sign in sentence:
        if "<" in sign and "/" not in sign:
            opentag = sign.strip("<")
            opentag = opentag.strip(">")
            opentag = convert(opentag) # tag = "shoulder_movement movement='UL'"
            tags.append(opentag)
            # print("This sign contains '<' and not '/': ", sign)
            continue
        elif "/" in sign:
            closetag = sign.strip("</")
            closetag = closetag.strip(">")
            closetag = convert(closetag) # tag = "shoulder_movement movement='UL'"
            tags.remove(closetag)
            # print("This sign contains '/': ", sign)
            continue
        else:
            try: 
                newDict[sign]
            except:
                print("Could not find entry for", sign)
                continue
            currenttags = deepcopy(tags)
            foundSigns[newDict[sign]] = currenttags
    print("found files and converted tags: ", foundSigns)
    
    nonmans = tagsToSiGML(foundSigns)
    sigml = makeSiGML(nonmans)
    
    # print()
    print(sigml)
    # playsigml(sigml)

if __name__ == '__main__':
    # lines = sys.stdin.readlines()
    # if len(lines) == 0:
    #     userInput = sys.argv[1:]
    # else:
    #     userInput = lines[0].strip("\n").split(" ")
    # main(sys.argv[1:])
    # main('U <HT_NO><FT_RB> ETEN KLAAR </FT_RB>HEBBEN</HT_NO>')
    main('U <HT_NO><FT_RB><MT_L01> ETEN </FT_RB></HT_NO></MT_L01>')
