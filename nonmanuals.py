#Contains all the simple nonmanuals
#Example: <st_ul></st_ul> = shoulder_tier -> shoulder_movement -> UL
simpleNonmanuals = {
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

#Contains all the complex nonmanuals
complexNonmanuals = {
    "emotions": {
        "sadness": ["head_movement movement='NF' amount='0.5'", "head_movement movement='TR'",
                    "mouth_gesture movement='L31' speed='0.6'", "eye_brows movement='FU'", "eye_lids movement='SB'" ], # default, alleen aanroepen wanneer sadness op 1 enkel gebaar staat
        "sadnessi": ["head_movement movement='NF' amount='0.5'", "head_movement movement='TR'",
                    "avatar_morph name='llpc' amount='1.00' timing='s l s s t'", "morph name='mbp' amount='0.81' timing='s l s s t'", "eye_brows movement='FU'", "eye_lids movement='SB'" ], # initial
        "sadnessm": ["head_movement movement='NF' amount='0.5'", "head_movement movement='TR'",
                    "mouth_gesture movement='L31' speed='0.6'", "eye_brows movement='FU'", "eye_lids movement='SB'" ], # middle
        "sadnessf": ["head_movement movement='NF' amount='0.5'", "head_movement movement='TR'",
                    "mouth_gesture movement='L31' speed='0.6'", "eye_brows movement='FU'", "eye_lids movement='SB'" ], # final
        "fear": ['mouth_gesture movement="L31"', 'head_movement movement="TR" speed="0.7"', 'head_movement movement="NF" amount="0.6"',
                 'body_movement movement="TB"', 'body_movement movement="TR" amount="0.6"', 'shoulder_movement movement="HB"',
                 'eye_brows movement="FU" speed="0.7" amount="0.4"', 'eye_lids movement="WB" speed="0.7"', 'eye_gaze direction="AD" speed="0.7"'], # geen par bij mouth
        "disgust": ["mouth_gesture movement='D01' speed='0.5'", "mouth_gesture movement='L29' speed='0.5'",
                    'head_movement movement="TR" speed="0.7"', 'head_movement movement="PB" speed="0.7"',
                    'body_movement movement="TB"', 'eye_brows movement="FU" speed="0.7"', 'eye_lids movement="SB" speed="0.7"',
                    'eye_gaze direction="AD" speed="0.7"'],
        "anger": ['mouth_gesture movement="L30"', 'head_movement movement="TR" speed="0.7"', 'head_movement movement="NF" amount="0.6"',
                  'body_movement movement="TR" amount="0.6"', 'eye_brows movement="FU"', 'eye_lids movement="SB"', 'eye_gaze direction="AD" speed="0.7"'],
        "surprise": ['mouth_gesture movement="T02" speed="0.5" amount="1.2"', 'head_movement movement="TR" speed="0.7"',
                      'head_movement movement="PB" speed="0.7', 'body_movement movement="TB"', 'eye_brows movement="RB" speed="0.7" amount="1.3"',
                      'eye_lids movement="WB" speed="0.7"', 'eye_gaze direction="AD" speed="0.7"'],
        "happiness_1": ['avatar_morph name="smlc" amount="1.0" timing="x s l - m l x"', 'avatar_morph name="eee" amount="0.3" timing="x m t - m t"',
                  "eye_lids movement='SB'", "nose movement='WR'", 'head_movement movement="TR" amount="0.7"'], # glimlach met beetje tanden, geen andere mond movement
        "happiness_2": ['avatar_morph name="smlc" amount="1.0" timing="x 0.2 t - 0.2 t x"', 'eye_brows movement="RB"', 'head_movement movement="NF"'] # lach vanaf begin gaat over in mouth picture
    },
    "epistemicState": {
        "ignorant": ['mouth_gesture movement="L31" speed="0.8"', 'eye_brows movement="RB" speed="0.6"', 'eye_lids movement="WB" speed="0.6"',
                     'shoulder_movement movement="UB"'],
        "doubtful": [],
        "knowledgable": [],
        "sceptical": []
    },
    "grammaticalMarkers": {
        "questionmarkEyebrowsRaised": ["extra_movement movement='OAQ'"],
        "questionmarkEyebrowsFurrowed": ["extra_movement movement='CAQ'"],
        "promiseMarker": ["extra_movement movement='PRM'"],
        "topicMarker": [],
        "focusMarker": [],
        "confirmation": ["head_movement movement'NO'"],
        "negation": ["head_movement movement'SH'"]
    }
}
