/**
 * Alle stappen NADAT er op play wordt gedrukt, dus herkennen variabelen, splitten van de zin op basis van deze vars, sigml json data opvragen en koppelen aan zinsdelen/vars, etc.
 */

var trainVar;
var platformVar;
var departVar;
var waitVar;
var endVar;
var json_sent_NL;
var json_sent_EN;
var json_var;
var onbekendeTijd;
var n_telhand;

/**
 * Verwijder extra spaties voor en na zinsdelen weg zodat ze beter matchen met de split_sentence zinsdelen. Voor het laatste zinsdeel werkt dit echter niet altijd goed, soms staat er nog steeds een extra spatie voor.
 * In split_sentences_English.json en split_sentences_Nederlands.json staat daarom bij de laatste zinsdelen ook een optie met extra spatie. Waarschijnlijk gaat dit mis bij het pushen van het laatste element in getSentenceArray(), maar ik heb de fout nog niet gevonden
 * @param {*} sentencePart 
 * @returns 
 */
function removeExtraSpaces(sentencePart) {

  regex_space = new RegExp(/\W\s+(\w+\s*\w*\s*\w*\s*\w*)\s*/);
  if (sentencePart.match(regex_space)) {
    sentencePart = sentencePart.replace(regex_space, '$1');
  }
  return sentencePart;
}

/**
 * Push sentence part to sentence array
 * @param {*} sentencePart 
 * @param {*} sentenceArray 
 * @param {*} value 
 * @param {*} variable 
 */
function pushSentencePart(sentencePart, sentenceArray, value, variable) {
  console.log('sentence part bij push: ', sentencePart);
  var sentencePartSubstring = sentencePart.substring(value, sentencePart.indexOf(variable) - 1);
  sentencePartSubstring = removeExtraSpaces(sentencePartSubstring);
  console.log('sentence part substring: ', sentencePartSubstring);
  sentenceArray.push(sentencePartSubstring);
}

/**
 *  De voorvoegsels 'naar', 'sngl' en 'niet' zijn nodig voor het koppelen van de juiste .sigml files. Echter, na deze koppeling maken deze voorvoegsels herkenning van de variabelen in de zin lastiger
    Deze functie vervangt 'naar_stationsnaam', 'single_stationsnaam' en 'niet_stationsnaam' met alleen de stationsnaam, zodat deze gematcht kan worden aan de stationsnaam uit de zin
 */
function replaceStationName(regex, variable, sentencePart, sentenceArray){
  let tempVar = variable.replace(regex, '$2');
  sentencePart = sentencePart.substring(sentencePart.indexOf(tempVar) + tempVar.length, sentencePart.length);
  return sentenceArray, sentencePart;
}

/**
 * Cut sentence in parts according to the detected variables
 * @param {*} sentencePart 
 * @param {*} variable 
 * @param {*} sentenceArray 
 * @param {*} stationsArray 
 * @returns 
 */
function splitSentence(sentencePart, variable, sentenceArray, stationsArray) {
  var regex_platform = /(\d{1,2})([a-z])/;
  if (variable.match(regex_platform)) {
    console.log('match platform');
    var number = platformVar.replace(regex_platform, '$1');
    var letter = platformVar.replace(regex_platform, '$2');
    pushSentencePart(sentencePart, sentenceArray, 1, variable);
    sentenceArray.push(number, letter);
    return sentenceArray, "";
  }
  var regex_departTime = /(\d{1,2})\:(\d{2})/;
  if (variable.match(regex_departTime)) {
    var hour = departVar.replace(regex_departTime, '$1');
    var minutes = departVar.replace(regex_departTime, '$2');
    pushSentencePart(sentencePart, sentenceArray, 1, variable);
    sentenceArray.push("tijd", hour, ":", minutes);
    sentencePart = sentencePart.substring(sentencePart.indexOf(variable) + variable.length, sentencePart.length);
    return sentenceArray, sentencePart;
  }

  // First word has no space before
  if (sentenceArray.length === 0) {
    pushSentencePart(sentencePart, sentenceArray, 0, variable);
  } else {
    pushSentencePart(sentencePart, sentenceArray, 1, variable);
  }

  // Voeg telhanden toe voor de 'tussengelegen stations' zin
  if (document.getElementById('currSentence').innerText.includes('intermediate stations') || document.getElementById('currSentence').innerText.includes('tussengelegen stations')) {
    if (stationsArray.includes(variable) && n_telhand <= 4) {
      // Minimaal één tussenstation vereist
      if (stationsArray.length > 1) {
        // Eerste station hoeft nog geen index hand
        if (n_telhand > 0) {
          sentenceArray.push("telhand" + n_telhand + "");
          n_telhand += 1;
        } else {
          n_telhand += 1;
        }
      } else {
        (globalVar.lang === "English") ? alert("Kies alstublieft minimaal één tussenstation.") : alert("Please specify at least one intermediate station.")
        return stationsArray = [];
      }
    }
  }
  sentenceArray.push(variable);

  // Tijdelijke vervanging van de stationsnaam in de zin door de stationsnaam met extra voorvoegsel, nodig voor herkenning van de naam
  var regex_naar = /(naar)\_(\w+)/; // for signs such as NAAR ALMELO
  var regex_single = /(sngl)\_(\w+)/; // for signs such as ALMELO
  var regex_niet = /(niet)\_(\w+)/; // for signs such as NIET_BREDA
  if (variable.match(regex_naar)) {
    return replaceStationName(regex_naar, variable, sentencePart, sentenceArray);
  } else if (variable.match(regex_single)) {
    return replaceStationName(regex_single, variable, sentencePart, sentenceArray);
  } else if (variable.match(regex_niet)) {
    return replaceStationName(regex_niet, variable, sentencePart, sentenceArray);
  } else {
    sentencePart = sentencePart.substring(sentencePart.indexOf(variable) + variable.length, sentencePart.length);
    return sentenceArray, sentencePart;
  }
}

/**
 * Push interstation vars naar station en var arrays
 * @param {*} variableArray 
 * @param {*} stationsArray 
 * @param {*} first 
 * @param {*} interVarArray 
 * @param {*} stopzinniet 
 * @returns 
 */
function pushInterVars(variableArray, stationsArray, first, interVarArray, stopzinniet) {
  for (i = 0; i < interVarArray.length; i++) {
    if (interVarArray[i] !== "-") {
      if (first) {
        variableArray.push('naar_' + interVarArray[i]);
        stationsArray.push('naar_' + interVarArray[i]);
        first = false;
      } else if(stopzinniet){
        variableArray.push('niet_' + interVarArray[i]);
        stationsArray.push('niet_' + interVarArray[i]);
      } else {
        variableArray.push(interVarArray[i]);
        stationsArray.push(interVarArray[i]);
      }
    }
  }
  return variableArray, stationsArray;
}

/**
 * Herkennen van de pauze vars (e.g. _m3_)
 * @param {*} pauzeValue 
 * @returns 
 */
function enterPauzeVar(pauzeValue) {
  var pauzeVar = entry.match(pauzeValue)[0];
  return pauzeVar;
}

/**
 * Check of een variabele voorkomt in de zin, zo ja, push naar variable array
 * @param {*} entry 
 * @param {*} varArray 
 * @param {*} stationsArray 
 * @returns 
 */
function getSigmlVariables(entry, varArray, stationsArray) {
  let interVarArray = ["-", "-", "-", "-"];
  var wachtZinBool, wachtZinENBool, stopZinBool, stopZinENBool = false;

  // VOLGORDE VAN TOEVEGEN AAN ARRAY IS VAN BELANG VOOR DE SPLIT FUNCTIE (zin wordt opgesplitst na herkenning van de variabele, en als dat te vroeg of te laat gebeurt mis je dus zinsdelen of komen bepaalde delen dubbel voor)
  // entry.includes(globalvar.x) WERKT NIET ivm vervanging vd waardes

  let regex_pauze_0 = new RegExp(/\_(\w{1,2})0\_/);
  let regex_pauze_1 = new RegExp(/\_(\w{1,2})1\_/);
  let regex_pauze_2 = new RegExp(/\_(\w{1,2})2\_/);
  let regex_pauze_3 = new RegExp(/\_(\w{1,2})3\_/);
  let regex_pauze_4 = new RegExp(/\_(\w{1,2})4\_/);
  let regex_pauze_5 = new RegExp(/\_(\w{1,2})5\_/);

  // HARD CODE dat de structuur van bepaalde zinnen verandert zoals besproken in focus groepen en co design
  var wachtZin = "De treinType _s1_ naar tussenStation1, tussenStation2, tussenStation3, tussenStation4 en eindStation _s2_ van vertrekTijd _l3_ vertrekt _m4_ wachtTijd _m5_ van spoor spoorNr.";
  var wachtZinEN = "The trainType _s1_ to interStation1, interStation2, interStation3, interStation4 and endStation _s2_ of departTime _l3_ departs _m4_ waitTime _m5_ from platform platformNr.";

  var stopZin = "Hallo _xl0_ de treinType _s1_ naar tussenStation1, tussenStation2, tussenStation3, tussenStation4 en eindStation _s2_ stopt niet _m3_ op tussengelegen stations.";
  var stopZinEN = "Hello _xl0_ the trainType _s1_ to interStation1, interStation2, interStation3, interStation4 and endStation _s2_ does not stop _m3_ at intermediate stations.";

  console.log('entry sigml ', entry);
  if (entry === wachtZin) {
    entry = "De treinType _s1_ naar tussenStation1, tussenStation2, tussenStation3, tussenStation4 en eindStation _s2_ van vertrekTijd _l3_ vertrekt _m4_ van spoor spoorNr _m5_ wachtTijd.";
    wachtZinBool = true;
  } else if (entry === wachtZinEN) {
    entry = "The trainType _s1_ to interStation1, interStation2, interStation3, interStation4 and endStation _s2_ of departTime _l3_ departs _m4_ from platform platformNr _m5_ waitTime.";
    wachtZinENBool = true;
  } else if (entry === stopZin) {
    entry = "Hallo _xl0_ de treinType _s1_ naar eindStation _s2_ stopt niet _m3_ op tussengelegen stations tussenStation1, tussenStation2, tussenStation3, tussenStation4.";
    stopZinBool = true;
  } else if (entry === stopZinEN) {
    entry = "Hello _xl0_ the trainType _s1_ to endStation _s2_ does not stop _m3_ at intermediate stations interStation1, interStation2, interStation3, interStation4.";
    stopZinENBool = true;
  }

  if (entry.match(regex_pauze_0)) {
    let pauzeVar = enterPauzeVar(regex_pauze_0);
    varArray.push(pauzeVar);
  }

  if (entry.includes("trainType") || entry.includes("treinType")) {
    trainVar = document.getElementById('trainTypeOptions').value;
    varArray.push(trainVar);
  }

  if (entry.match(regex_pauze_1)) {
    let pauzeVar = enterPauzeVar(regex_pauze_1);
    varArray.push(pauzeVar);
  }

  if (stopZinBool || stopZinENBool) {
    if (entry.includes("endStation") || entry.includes("eindStation")) {
      endVar = document.getElementById('endStationOptions').value;
      varArray.push(endVar);
      stationsArray.push(endVar);
    }

    if (entry.match(regex_pauze_2)) {
      let pauzeVar = enterPauzeVar(regex_pauze_2);
      varArray.push(pauzeVar);
    }

    if (entry.match(regex_pauze_3)) {
      let pauzeVar = enterPauzeVar(regex_pauze_3);
      varArray.push(pauzeVar);
    }
  }

  if (entry.includes("interStation1,") || entry.includes("tussenStation1")) {
    interVarArray[0] = document.getElementById('interStation1Options').value;
  }
  if (entry.includes("interStation2") || entry.includes("tussenStation2")) {
    interVarArray[1] = document.getElementById('interStation2Options').value;
  }
  if (entry.includes("interStation3") || entry.includes("tussenStation3")) {
    interVarArray[2] = document.getElementById('interStation3Options').value;
  }
  if (entry.includes("interStation4") || entry.includes("tussenStation4")) {
    interVarArray[3] = document.getElementById('interStation4Options').value;
  }

  if (!stopZinBool && !stopZinENBool) {
    if (entry.includes("endStation") || entry.includes("eindStation")) {
      endVar = document.getElementById('endStationOptions').value;
      if (interVarArray[0] === "-" && interVarArray[1] === "-" && interVarArray[2] === "-" && interVarArray[3] === "-") {
        varArray.push(endVar);
        stationsArray.push(endVar);
      } else {
        varArray, stationsArray = pushInterVars(varArray, stationsArray, true, interVarArray, false)
        // sngl betekent een single gebaar voor het station, dus niet al gekoppeld aan de NAAR beweging
        endVar = "sngl_" + endVar;
        varArray.push(endVar);
        stationsArray.push(endVar);
      }
    }
    if (entry.match(regex_pauze_2)) {
      let pauzeVar = enterPauzeVar(regex_pauze_2);
      varArray.push(pauzeVar);
    }
  } else {
    varArray, stationsArray = pushInterVars(varArray, stationsArray, false, interVarArray, true)
  }

  if (entry.includes("departTime") || entry.includes("vertrekTijd")) {
    departVar = document.getElementById('departTimeInput').value;
    varArray.push(departVar);
  }

  if (!stopZinBool && !stopZinENBool) {
    if (entry.match(regex_pauze_3)) {
      let pauzeVar = enterPauzeVar(regex_pauze_3);
      varArray.push(pauzeVar);
    }
  }

  if (entry.match(regex_pauze_4)) {
    let pauzeVar = enterPauzeVar(regex_pauze_4);
    varArray.push(pauzeVar);
  }

  if (!wachtZinBool && !wachtZinENBool) {
    if (entry.includes("waitTime") || entry.includes("wachtTijd")) {
      waitVar = document.getElementById('waitTimeOptions').value;
      varArray.push(waitVar);
    }
    if (entry.match(regex_pauze_5)) {
      let pauzeVar = enterPauzeVar(regex_pauze_5);
      varArray.push(pauzeVar);
    }
  }
  if (entry.includes("platformNr") || entry.includes("spoorNr")) {
    platformVar = document.getElementById('platformNrOptions').value;
    platformVar = platformVar.replaceAll(/\'/g, "");
    varArray.push(platformVar);
  }
  if (entry.match(regex_pauze_5)) {
    let pauzeVar = enterPauzeVar(regex_pauze_5);
    varArray.push(pauzeVar);
  }
  if (wachtZinBool || wachtZinENBool) {
    if (entry.includes("waitTime") || entry.includes("wachtTijd")) {
      waitVar = document.getElementById('waitTimeOptions').value;
      varArray.push(waitVar);
    }
  }
  return varArray, stationsArray, entry;
}

function callbackTijd(data_var) {
  json_var_tijd = data_var;
}

function callbackVar(data_var) {
  json_var = data_var;
}

function callbackSent_NL(data_sent) {
  json_sent_NL = data_sent;
}

function callbackSent_EN(data_sent) {
  json_sent_EN = data_sent;
}

/**
 * Get data
 */
$.getJSON("json/hele_uren.json", function (data_var) {
  callbackTijd(data_var);
}).fail(function () {
  console.log("Could not get SiGML tijd JSON file");
});

$.getJSON("json/variables.json", function (data_var) {
  callbackVar(data_var);
}).fail(function () {
  console.log("Could not get SiGML variable JSON file");
});

$.getJSON("json/split_sentences_Nederlands.json", function (data_sent_NL) {
  callbackSent_NL(data_sent_NL);
}).fail(function () {
  console.log("Could not get split SiGML sentence NL JSON file");
});

$.getJSON("json/split_sentences_English.json", function (data_sent_EN) {
  callbackSent_EN(data_sent_EN);
}).fail(function () {
  console.log("Could not get split SiGML sentence EN JSON file");
});

async function getSiGMLContent(el) {
  let response = await fetch(el);
  let data = await response.text();
  return data;
}

/**
 * Match de sentence parts en variables met de sigml files, plak alle sigml achter elkaar en stuur deze naar avatar engine
 * @param {*} sentenceArray 
 */
async function getSiGML(sentenceArray) {
  var regex_sigml = new RegExp(/\<hamgestural\_sign\sgloss\=\"(\w*\s?\:?\w*\s?\w*\s?)(\>)?\"/, "g");
  var tijdArray = [];
  var glossArray = [];
  var tempString = '<?xml version="1.0" encoding="utf-8"?><sigml>\n';
  // Automatically add smile to the start of every sentence
  tempString += '<hamgestural_sign gloss="" timescale="0.6" duration="1.1"><sign_manual holdover="true"></sign_manual><sign_nonmanual><mouthing_tier><mouthing_par><avatar_morph name="smlc" amount="0.7" speed="0.4" timing="x s l - m l x"/><avatar_morph name="eee" amount="0.3" speed="0.4" timing="x m t - m t"/></mouthing_par></mouthing_tier><body_tier><body_movement movement="ST"/></body_tier><head_tier><head_movement movement="SL" amount="1.5"/></head_tier><facialexpr_tier><facial_expr_par><eye_gaze movement="LE" amount="0.6"/><eye_brows movement="RB"/></facial_expr_par></facialexpr_tier></sign_nonmanual></hamgestural_sign>\n';

  // Remove empty elements in array
  sentenceArray = sentenceArray.filter(e => String(e).trim());
  console.log('Sentence array final: ', sentenceArray);

  // NL zin als ondertiteling
  glossArray = document.getElementById('currSentenceBox').innerText;
  glossArray = glossArray.replace('Current sentence:', '').toUpperCase();
  glossArray = glossArray.replace('Huidig omroepbericht:', '').toUpperCase();
  glossArray = glossArray.replaceAll(/(\_\w{1,2}\d{1}\_)/g, "");
  document.getElementById('outputLong').innerHTML = glossArray;

  const [lastItem] = sentenceArray.slice(-1);
  // Display repetition bar when word is recognized
  if (sentenceArray[0].match(/(Herhaling)/) || sentenceArray[0].match(/(Repetition)/)) {
    console.log('Match herhaling');
    document.getElementById('repetitionBar').style.display = "inline-block";
  }
  for (const el of sentenceArray) {
    if (json_sent_NL[el] !== undefined || json_sent_EN[el] !== undefined) {
      var data;
      if (globalVar.lang === "Nederlands") {
        console.log('json sent NL: ', json_sent_NL[el]);
        data = await getSiGMLContent(json_sent_NL[el]);
        tempString += data;
      } else {
        console.log('json sent EN: ', json_sent_EN[el]);
        data = await getSiGMLContent(json_sent_EN[el]);
        tempString += data;
      }
    } else if (json_var[el] !== undefined && !tijdArray.includes(el)) {
      console.log('json var: ', json_var[el]);
      let data = await getSiGMLContent(json_var[el]);
      tempString += data;
    } else if (el == "tijd") {
      // Change gloss into hh:mm format
      el_index = sentenceArray.indexOf(el);
      tijdArray = [sentenceArray[el_index + 1], sentenceArray[el_index + 2], sentenceArray[el_index + 3]];
      var tijd = sentenceArray[el_index + 1] + sentenceArray[el_index + 2] + sentenceArray[el_index + 3];
      for (i = 1; i <= 3; i++) {
        if (sentenceArray[el_index + 3] === "00") {
          data = await getSiGMLContent(json_var_tijd[sentenceArray[el_index + 1]]);
          i += 2;
        } else {
          data = await getSiGMLContent(json_var[sentenceArray[el_index + i]]);
        }
        var regex_sigml = /\<hamgestural\_sign\sgloss\=\"(\w*)\"/;
        if (data.match(regex_sigml)) {
          data = data.replace(regex_sigml, '<hamgestural_sign gloss="' + tijd + '"');
        }
        tempString += data;
      }
    } else {
      if (el === " ") {
        console.log('Undefined, skipped or time notation merged: ', "/\s"); // Puur informatief dat je ziet dat het een spatie is (dus geskipt)
      } else {
        console.log('Undefined, skipped or time notation merged: ', el);
      }
    }
    if (el == lastItem) {
      // Extra pauze en eindpose toevoegen
      tempString += '<hamgestural_sign gloss=""><sign_nonmanual><head_tier><head_movement movement="SL" amount="1.5"/></head_tier><facialexpr_tier><eye_brows movement="RB" amount="0.7" speed="0.8"/><eye_lids movement="BB" speed="0.8"/><eye_gaze movement="LE" amount="0.6"/></facialexpr_tier></sign_nonmanual><sign_manual holdover="true"></sign_manual></hamgestural_sign>';
      tempString += '<hamgestural_sign gloss="" timescale=".7" duration="1.2"><sign_manual both_hands="true" lr_symm="true"><handconfig handshape="flat" thumbpos="across" /><split_handconfig><handconfig extfidir="dl" palmor="l"/><handconfig extfidir="dr" palmor="r"/></split_handconfig><handconstellation contact="close"><location_hand location="palm" side="back"/><location_hand location="palm" side="palmar"/><location_bodyarm contact="close" location="belowstomach" second_location="stomach" side="front" second_side="front"/></handconstellation></sign_manual><sign_nonmanual><body_tier><body_movement movement="ST" /></body_tier><head_tier><head_par><head_movement movement="NU" amount="0.4"/><head_movement movement="SL" amount="1.5"/></head_par></head_tier><facialexpr_tier><facial_expr_par><eye_brows movement="RB" amount="0.6" /><eye_gaze movement="LE" amount="0.6"/><eye_lids movement="BB" /></facial_expr_par></facialexpr_tier></sign_nonmanual></hamgestural_sign>';
      tempString += '</sigml>';
    }
  }
  globalVar.playing = true;
  globalVar.playFinished = false;
  globalVar.sigmlText = tempString;
  playText(tempString);

}

function checkUndefined(definition, alert = "alertMainTran") {
  if (definition == undefined) {
    if (globalVar.lang == "Nederlands") {
      alertMessage("info", "Er is momenteel geen vertaling beschikbaar voor deze zin.", alert);
    } else {
      alertMessage("info", "There is currently no translation available for this sentence.", alert);
    }
    return true;
  } else {
    return false;
  }
}

function getInterStationsArray() {
  regex_string = "(";
  // interStationsArray bevat alle mogelijke tussenstationsnamen
  const [lastItem] = interStationsArray.slice(-1);
  for (const el of interStationsArray) {
    if (el !== "-") {
      regex_string = regex_string + el;
      if (el !== lastItem) {
        regex_string = regex_string + "\|";
      }
    }
  }
  regex_string = regex_string + ")";
  return regex_string;
}

/**
 * Vooral relevant voor het current sentence blok, haal niet-ingevulde interstation vars weg, haal vreemde interpunctie en spaties weg etc.
 * @param {*} fullSentence 
 * @returns 
 */
function makeReadable(fullSentence) {
  fullSentence = fullSentence.replaceAll("-", "");
  //fullSentence = fullSentence.replaceAll(/(\_\w{1,2}\_)/g, "");
  fullSentence = fullSentence.replaceAll(/\s\./g, ".");
  fullSentence = fullSentence.replaceAll(/(interStation)\d{1}/g, "");
  fullSentence = fullSentence.replaceAll(/(tussenStation)\d{1}/g, "");
  fullSentence = fullSentence.replaceAll(/[\,\']/g, ""); // Comma check needed (interstations)
  fullSentence = fullSentence.replaceAll(new RegExp("(\\d{1})+" + getInterStationsArray() + "(\\d{1})?", "g"), " $2 ");
  if (globalVar.lang === "English" && fullSentence.match(/to\d*\s*(and)?/)) { // Remove weird to ... construction (interstations)
    fullSentence = fullSentence.replace(/to\d*\s*(and)?/, 'to ');
  }
  if (globalVar.lang === "Nederlands" && fullSentence.match(/naar\d*\s*(en)?/)) {
    fullSentence = fullSentence.replace(/naar\d*\s*(en)?/, 'naar ');
  }

  // Remove interpunction for splitting purposes (later)
  fullSentence = fullSentence.replaceAll(/\./g, "");
  return fullSentence;
}

/**
 * Get the current sentence (entry), show it in the UI, get the variableArray (getSigmlVariables()) and split the current sentence based on this array (splitSentence())
 * This function is activated once after clicking 'play'
 * @param {*} fullSentence 
 */
function getSentenceArray(fullSentence) {
  let variableArray = []; // Only makes a copy, so length = 0 is necessary to really empty the contents
  let sentenceArray = [];
  let stationsArray = [];
  variableArray.length = 0;
  sentenceArray.length = 0;
  stationsArray.length = 0;
  n_telhand = 0;

  // entry: de zin met de lege variabelen (e.g. trainType), nodig voor herkenning vd variabelen
  entry = document.querySelector('button[data-id="sentenceOptions"]').title;
  console.log('entry ', entry);

  // entryWithValues: de zin met ingevulde variabelen, nodig voor koppelen van de juiste .sigml
  var entryWithValues = makeReadable(fullSentence);
  console.log("input: " + entryWithValues);

  // Show sentence in UI without pause tags
  fullSentence = entryWithValues.replaceAll(/(\_\w{1,2}\d{1}\_)/g, "");
  document.getElementById('currSentence').innerHTML = '<b>' + fullSentence + '</b>';

  if (!checkUndefined(entry)) {
    // In getSigmlVariables wordt de zinsstructuur van entry ook aangepast waar nodig
    variableArray, stationsArray, entry = getSigmlVariables(entry, variableArray, stationsArray);
    console.log('array after: ', variableArray);
    console.log('entry andersom ', entry);
    // HARD CODE, omdat entryWithValues niet gebruikt kan worden ivm afwijkende structuur worden hier de variabelen handmatig in entry ingevoegd zodat deze variabelen wel herkend worden in de split functie
    try {
      entry = entry.replace('trainType', document.getElementById('trainTypeOptions').value);
      entry = entry.replace('treinType', document.getElementById('trainTypeOptions').value);
      console.log('entry train ', entry);
    } catch { }
    try {
      entry = entry.replace('platformNr', document.getElementById('platformNrOptions').value);
      entry = entry.replace('spoorNr', document.getElementById('platformNrOptions').value);
      console.log('entry spoor ', entry);
    } catch { }
    try {
      entry = entry.replace('endStation', document.getElementById('endStationOptions').value);
      entry = entry.replace('eindStation', document.getElementById('endStationOptions').value);
      console.log('entry end ', entry);
    } catch { }
    try {
      entry = entry.replace('departTime', document.getElementById('departTimeInput').value);
      entry = entry.replace('vertrekTijd', document.getElementById('departTimeInput').value);
      console.log('entry depart ', entry);
    } catch { }
    try {
      entry = entry.replace('waitTime', document.getElementById('waitTimeOptions').value);
      entry = entry.replace('wachtTijd', document.getElementById('waitTimeOptions').value);
      console.log('entry wait ', entry);
    } catch { }
    try {
      entry = entry.replace('interStation1', document.getElementById('interStation1Options').value);
      entry = entry.replace('tussenStation1', document.getElementById('interStation1Options').value);
      console.log('entry inter1 ', entry);
    } catch { }
    try {
      entry = entry.replace('interStation2', document.getElementById('interStation2Options').value);
      entry = entry.replace('tussenStation2', document.getElementById('interStation2Options').value);
      console.log('entry inter2 ', entry);
    } catch { }
    try {
      entry = entry.replace('interStation3', document.getElementById('interStation3Options').value);
      entry = entry.replace('tussenStation3', document.getElementById('interStation3Options').value);
      console.log('entry inter3 ', entry);
    } catch { }
    try {
      entry = entry.replace('interStation4', document.getElementById('interStation4Options').value);
      entry = entry.replace('tussenStation4', document.getElementById('interStation4Options').value);
      console.log('entry inter4 ', entry);
    } catch { }
    entry = makeReadable(entry);
    console.log('entry na repl getsentarray ', entry);
    console.log('var array ', variableArray);
    console.log('stations array ', stationsArray);
    // Split sentence around variables in array
    for (const vars of variableArray) {
      sentenceArray, entry = splitSentence(entry, vars, sentenceArray, stationsArray);
    }
    // Reset telhand nr
    n_telhand = 0;

    // Push last element
    if (!entry == "") {
      entry = removeExtraSpaces(entry);
      sentenceArray.push(entry);
    }
    getSiGML(sentenceArray);
  }
}



