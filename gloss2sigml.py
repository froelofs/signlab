# import tempfile
import sys
import os
from newDict import newDict

def main(sentence):
    print("input:", sentence)

    # a_file = open("newDict.", "r")
    # output = a_file.read()
    # U HN(BR(ETEN GENOEG)) AVG
    # U <HT_HO> <FT_BR> ETEN GENOEG </FT_BR></HT_HO> HEBBEN
    # sentence = ["U", "<HT_HO>", "<FT_BR>", "ETEN", "GENOEG", "</FT_BR>", "</HT_HO>", "HEBBEN"]

    foundSigns = {}
    sentence.replace("><","> <")
    sentence = sentence.split(" ")
    tags = []

    for sign in sentence:
        if sign contains "<" and does not contain "/":
            opentag = sign.strip("<", ">")
            opentag = convert(opentag) # tag = "shoulder_movement movement='UL'"
            tags.append(opentag)
            continue
        if sign contains "/":
            closetag = sign.strip("</", ">")
            closetag = convert(closetag) # tag = "shoulder_movement movement='UL'"
            tags.remove(closetag)
            continue
        if newDict[sign]:
            print("SiGML found:", newDict[sign])
            foundSigns[sign] = [newDict[sign], tags]
        else:
            print("Could not find entry for", sign)

    sigml = make_sigml(foundsigns)
    playsigml(sigml)

    def make_sigml(foundsigns):
        sigml = '<?xml version="1.0" encoding="UTF-8"?><sigml>'
        for key, value in foundsigns.items():
            for line in lees(value[0]):
                negeer eerste twee regels en laatste
                if value[1]:
                    for elke tags:
                        if check of er al iets in de tier zit:
                            if not mouthing_tier or facialexpr_tier:
                                overwrite
                            else:
                                bijvoegen aan tier (met par)
                sigml += line
        sigml += '</sigml>'
        return sigml


    def convert(inputtag):
        [tier, tag] = inputtag.split("_")
        check = nonmans[tier]
        for key, value in check:
            if value == tag:
                return key + "='" + value + "'" # "shoulder_movement movement='UL'"
        return None

        


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
        }
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




if __name__ == '__main__':
    # lines = sys.stdin.readlines()
    # if len(lines) == 0:
    #     userInput = sys.argv[1:]
    # else:
    #     userInput = lines[0].strip("\n").split(" ")
    main(sys.argv[1:])
