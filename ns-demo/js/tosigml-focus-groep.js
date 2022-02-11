
var trainVar;
var platformVar;
var departVar;
var waitVar;
var interVarArray = ["-", "-", "-", "-"];
var tempStrings = ["", "", ""];
var endVar;
var json_sent_NL;
var json_sent_EN;
var json_var;
var n_telhand;
var onbekendeTijd;

function splitSentence(sentencePart, variable, sentenceArray){
  var regex_platform = /(\d{1,2})([a-z])/;
  if(variable.match(regex_platform)){
    var number = platformVar.replace(regex_platform, '$1');
    var letter = platformVar.replace(regex_platform, '$2');
    sentenceArray.push(sentencePart.substring(1, sentencePart.indexOf(variable)-1));
    sentenceArray.push(number, letter);
    return sentenceArray, sentencePart;
  }
  var regex_departTime = /(\d{1,2})\:(\d{2})/;
  if(variable.match(regex_departTime)){
    var hour = departVar.replace(regex_departTime, '$1');
    var minutes = departVar.replace(regex_departTime, '$2');
    sentenceArray.push(sentencePart.substring(1, sentencePart.indexOf(variable)-1));
    sentenceArray.push("tijd", hour, ":", minutes);
    sentencePart = sentencePart.substring(sentencePart.indexOf(variable) + variable.length, sentencePart.length);
    return sentenceArray, sentencePart;
  }

  // First word has no space before
  if(sentenceArray.length === 0){
    sentenceArray.push(sentencePart.substring(0, sentencePart.indexOf(variable)-1));
  } else {
    // Skip space before non-first words/parts
    sentenceArray.push(sentencePart.substring(1, sentencePart.indexOf(variable)-1));
  }
  sentenceArray.push(variable);

  var regex_naar = /(naar)\_(\w+)/;
  var regex_single = /(sngl)\_(\w+)/;
  if (variable.match(regex_naar)){
    let tempVar = variable.replace(regex_naar, '$2');
    sentencePart = sentencePart.substring(sentencePart.indexOf(tempVar) + tempVar.length, sentencePart.length);
    return sentenceArray, sentencePart;
  } else if (variable.match(regex_single)){
    let tempVar = variable.replace(regex_single, '$2');
    sentencePart = sentencePart.substring(sentencePart.indexOf(tempVar) + tempVar.length, sentencePart.length);
    return sentenceArray, sentencePart;
  } else {
    sentencePart = sentencePart.substring(sentencePart.indexOf(variable) + variable.length, sentencePart.length);
    return sentenceArray, sentencePart;
  }
}

function pushInterVars(variableArray, stationsArray, first){
  for(i=0; i<interVarArray.length; i++){
    if(interVarArray[i] !== "-"){
      if(first){
        variableArray.push('naar_' + interVarArray[i]);
        stationsArray.push('naar_' + interVarArray[i]);
        first = false;
      } else {
        variableArray.push(interVarArray[i]);
        stationsArray.push(interVarArray[i]);
      } 
    }
  }
  return variableArray, stationsArray;
}

function getSigmlVariables(entry, variableArray, stationsArray, av){
  // VOLGORDE VAN TOEVEGEN AAN ARRAY IS VAN BELANG VOOR DE SPLIT FUNCTIE
  // GLOBALVARS GEBRUIKEN WERKT NIET ivm vervanging vd waardes
  var andersomZin = "De treinType naar tussenStation1, tussenStation2, tussenStation3, tussenStation4 en eindStation van vertrekTijd vertrekt over wachtTijd van spoor spoorNr.";

  if(entry.includes("IA0")){
    variableArray.push("IA0");
  }

  if(entry.includes("IA1")){
    variableArray.push("IA1");
  }

  if(entry.includes("IA2")){
    variableArray.push("IA2");
  }

  if(entry.includes("trainType") || entry.includes("treinType")){
    trainVar = document.getElementById('trainTypeOptions_av' + av).value;
    variableArray.push(trainVar);
  }

  if(entry.includes("IA2")){
    variableArray.push("IA2");
  }

  if(entry !== andersomZin){
    if(entry.includes("endStation") || entry.includes("eindStation")){
      endVar = document.getElementById('endStationOptions_av' + av).value;
      variableArray.push(endVar);
      stationsArray.push(endVar);
    }
  }
  if(entry.includes("interStation1,") || entry.includes("tussenStation1")){
    interVarArray[0] = document.getElementById('interStation1Options_av' + av).value;
  }
  if(entry.includes("interStation2") || entry.includes("tussenStation2")){
    interVarArray[1] = document.getElementById('interStation2Options_av' + av).value;
  }
  if(entry.includes("interStation3") || entry.includes("tussenStation3")){
    interVarArray[2] = document.getElementById('interStation3Options_av' + av).value;
  }
  if(entry.includes("interStation4") || entry.includes("tussenStation4")){
    interVarArray[3] = document.getElementById('interStation4Options_av' + av).value;
    
  }
  if(entry === andersomZin){
    console.log('andersom');
    if(entry.includes("endStation") || entry.includes("eindStation")){
      endVar = document.getElementById('endStationOptions_av' + av).value;
      if(interVarArray[0] === "-" && interVarArray[1]==="-" && interVarArray[2]==="-" && interVarArray[3]==="-"){
        variableArray.push(endVar);
        stationsArray.push(endVar);
      } else {
        variableArray, stationsArray = pushInterVars(variableArray, stationsArray, true)
        endVar = "sngl_" + endVar;
        variableArray.push(endVar);
        stationsArray.push(endVar);
      }
    }
  } else {
    variableArray, stationsArray = pushInterVars(variableArray, stationsArray, false)
  }

  if(entry.includes("IA0")){
    variableArray.push("IA0");
  }

  if(entry.includes("IA1")){
    variableArray.push("IA1");
  }

  if(entry.includes("IA2")){
    variableArray.push("IA2");
  }

  if(entry.includes("departTime") || entry.includes("vertrekTijd")){
    departVar = document.getElementById('departTimeInput_av' + av).value;
    variableArray.push(departVar);
  }
  if(entry.includes("waitTime") || entry.includes("wachtTijd")){
    waitVar = document.getElementById('waitTimeOptions_av' + av).value;
    if(waitVar === "een nog onbekende tijd"){
      console.log('waitTime: ', waitVar);
    } else {
      variableArray.push(waitVar);
    }
  }

  if(entry.includes("IB0")){
    variableArray.push("IB0");
  }

  if(entry.includes("IB1")){
    variableArray.push("IB1");
  }

  if(entry.includes("IB2")){
    variableArray.push("IB2");
  }

  if(entry.includes("niet_Arnhem")){
    variableArray.push("niet_Arnhem");
  }

  if(entry.includes("niet_Breda")){
    variableArray.push("niet_Breda");
  }

  if(entry.includes("niet_Deventer")){
    variableArray.push("niet_Deventer");
  }

  if(entry.includes("niet_Zwolle")){
    variableArray.push("niet_Zwolle");
  }

  if(entry.includes("platformNr") || entry.includes("spoorNr")){
    platformVar = document.getElementById('platformNrOptions_av' + av).value;
    platformVar = platformVar.replaceAll(/\'/g, "");
    if(waitVar === "een nog onbekende tijd"){
      onbekendeTijd = true;
      variableArray.push(platformVar);
      variableArray.push("over " + waitVar);
    } else {
      variableArray.push(platformVar);
    }
  }

  if(entry.includes("IB2_")){
    variableArray.push("IB2_");
  }

  return variableArray, stationsArray;
}

function callbackTijd(data_var){
  json_var_tijd = data_var;
}

function callbackVar(data_var){
  json_var = data_var;
}

function callbackSent_NL(data_sent){
  json_sent_NL = data_sent;
}

function callbackSent_EN(data_sent){
  json_sent_EN = data_sent;
}

$.getJSON("json/hele_uren.json", function(data_var){
  callbackTijd(data_var);
}).fail(function() {
  console.log("Could not get SiGML tijd JSON file");
});

$.getJSON("json/variables.json", function(data_var){
  callbackVar(data_var);
}).fail(function() {
  console.log("Could not get SiGML variable JSON file");
});

$.getJSON("json/split_sentences_Nederlands.json", function(data_sent_NL){
  callbackSent_NL(data_sent_NL);
}).fail(function() {
  console.log("Could not get split SiGML sentence NL JSON file");
});

$.getJSON("json/split_sentences_English.json", function(data_sent_EN){
  callbackSent_EN(data_sent_EN);
}).fail(function() {
  console.log("Could not get split SiGML sentence EN JSON file");
});

async function getSiGMLContent(el){
  let response = await fetch(el);
  let data = await response.text();
  return data;
}

async function getSiGML(sentenceArray, av){
  var tijdArray = [];
  tempStrings[av] = '<?xml version="1.0" encoding="utf-8"?><sigml>\n';
  // Remove empty elements in array
  sentenceArray = sentenceArray.filter(e=>e);
  if(onbekendeTijd){
    console.log('true');
    for(i=0; i<sentenceArray.length; i++){
      if(sentenceArray[i] === 'vertrekt over een nog onbekende tijd van spoor'){
        console.log('if true');
        sentenceArray[i] = sentenceArray[i].replace(sentenceArray[i], 'vertrekt van spoor');
        onbekendeTijd = false;
      }
    }
    
  }
  console.log('Sentence array final: ', sentenceArray);
  const [lastItem] = sentenceArray.slice(-1);
  console.log('last ', lastItem);
  if(sentenceArray[0].match(/(Herhaling)/)){
        console.log('Match herhaling');
        document.getElementById('repetitionBar_av' + av).style.display = "inline-block";
      }
  for(const el of sentenceArray){
    if(json_sent_NL[el] !== undefined || json_sent_EN[el] !== undefined){
      var data;
      if(globalVar.lang === "Nederlands"){
        console.log('json sent NL: ', json_sent_NL[el]);
        data = await getSiGMLContent(json_sent_NL[el]);
        tempStrings[av] += data;
      } else {
        console.log('json sent EN: ', json_sent_EN[el]);
        data = await getSiGMLContent(json_sent_EN[el]);
        tempString += data; 
      }
    } else if (json_var[el] !== undefined && !tijdArray.includes(el)){
        console.log('json var: ', json_var[el]);
        let data = await getSiGMLContent(json_var[el]);
        tempStrings[av] += data;
    } else if(el == "tijd"){
      // Change gloss into hh:mm format
      el_index = sentenceArray.indexOf(el);
      tijdArray = [sentenceArray[el_index+1], sentenceArray[el_index+2], sentenceArray[el_index+3]];
      var tijd = sentenceArray[el_index+1] + sentenceArray[el_index+2] + sentenceArray[el_index+3];
      for(i=1; i<=3; i++){
        if(sentenceArray[el_index+3]==="00"){
          data = await getSiGMLContent(json_var_tijd[sentenceArray[el_index+1]]);
          i+=2;
        } else {
          data = await getSiGMLContent(json_var[sentenceArray[el_index+i]]);
        }
        var regex_sigml = /\<hamgestural\_sign\sgloss\=\"(\w*)\"/;
        if(data.match(regex_sigml)){
          data = data.replace(regex_sigml, '<hamgestural_sign gloss="' + tijd + '"');
        }
        tempStrings[av] += data;
      }
    } else {
      if(el===" "){
        console.log('Undefined or element skipped: ', "/\s"); // Puur informatief dat je ziet dat het een spatie is
      } else {
        console.log('Undefined or element skipped: ', el);
      }
    }
    if (el == lastItem){
      // Extra pauze en eindpose toevoegen
      tempStrings[av] += '<hamgestural_sign gloss=""><sign_nonmanual><head_tier><head_movement movement="SL" amount="1.5"/></head_tier><facialexpr_tier><eye_brows movement="RB" amount="0.7" speed="0.8"/><eye_lids movement="BB" speed="0.8"/><eye_gaze movement="LE" amount="0.6"/></facialexpr_tier></sign_nonmanual><sign_manual holdover="true"></sign_manual></hamgestural_sign>';
      tempStrings[av] += '<hamgestural_sign gloss="" timescale=".8" duration="1.2"><sign_manual both_hands="true" lr_symm="true"><handconfig handshape="flat" thumbpos="across" /><split_handconfig><handconfig extfidir="ddl" palmor="l"/><handconfig extfidir="dr" palmor="r"/></split_handconfig><handconstellation contact="close"><location_hand location="palm" side="back"/><location_hand location="palm" side="palmar"/><location_bodyarm contact="close" location="belowstomach" second_location="belowstomach" side="right_at" second_side="front"/></handconstellation></sign_manual><sign_nonmanual><body_tier><body_movement movement="ST" /></body_tier><head_tier><head_par><head_movement movement="NU" amount="0.4"/><head_movement movement="SL" amount="1.5"/></head_par></head_tier><facialexpr_tier><facial_expr_par><eye_brows movement="RB" amount="0.6" /><eye_gaze movement="LE" amount="0.6"/><eye_lids movement="BB" /></facial_expr_par></facialexpr_tier></sign_nonmanual></hamgestural_sign>';
      tempStrings[av] += '</sigml>';
    }
  }
  console.log('sigml ', tempStrings[av]);
  globalVar.playing[av] = true;
  globalVar.playFinished[av] = false;
  globalVar.sigmlText[av] = tempStrings[av];
  playText(tempStrings[av], av);
}

function checkUndefined(definition, alert="alertMainTran"){
  if (definition == undefined) {
    if(globalVar.lang=="Nederlands"){
      alertMessage("info", "Er is momenteel geen vertaling beschikbaar voor deze zin.", alert);
    } else {
      alertMessage("info", "There is currently no translation available for this sentence.", alert);
    }
    return true;
  } else {
    return false;
  }
}

function getInterStationsArray(){
    regex_string = "(";
    // interStationsArray bevat alle mogelijke tussenstationsnamen
    const [lastItem] = interStationsArray.slice(-1);
    for (const el of interStationsArray){
      if(el !== "-"){
        regex_string = regex_string + el;
        if(el !== lastItem){
          regex_string = regex_string + "\|";
        }
      }
    }
    regex_string = regex_string + ")";
    return regex_string;
}

function makeReadableAndShow(fullSentence, av){
    fullSentence = fullSentence.replaceAll("-", "");
    fullSentence = fullSentence.replaceAll(/\s\./g, ".");
    fullSentence = fullSentence.replaceAll(/interStation\d{1}/g, "");
    fullSentence = fullSentence.replaceAll(/tussenStation\d{1}/g, "");
    fullSentence = fullSentence.replaceAll(/[\,\']/g, ""); // Comma check needed (interstations)
    fullSentence = fullSentence.replaceAll(new RegExp("(\\d{1})+" + getInterStationsArray() +"(\\d{1})?", "g"), " $2 ");
    if(globalVar.lang==="English" && fullSentence.match(/to\d*\s*(and)?/)){ // Remove weird to ... construction (interstations)
      fullSentence = fullSentence.replace(/to\d*\s*(and)?/, 'to ');
    }
    if(globalVar.lang==="Nederlands" && fullSentence.match(/naar\d*\s*(en)?/)){
      fullSentence = fullSentence.replace(/naar\d*\s*(en)?/, 'naar ');
    }
    document.getElementById('currSentence_av' + av).innerHTML = '<b>' + fullSentence + '</b>';
    // Remove interpunction for splitting purposes (later)
    fullSentence = fullSentence.replaceAll(/\./g, "");
    return fullSentence;
}

  /**
   * // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
   * @param {*} text 
   * @param {*} alert 
   */
  function getSentenceArray(fullSentence, av){
    var variableArray = [];
    var sentenceArray = [];
    var stationsArray = [];
    n_telhand = 1;

    // Initally, sentencePart includes the whole (polished) sentence
    var sentencePart = makeReadableAndShow(fullSentence, av);
    console.log("input: " + sentencePart);
    // document.getElementById('outputSentence').value = sentencePart;

    entry = document.querySelector('button[data-id="sentenceOptions_av'+ av + '"]').title;
    console.log('entry ', entry);

    if(!checkUndefined(entry)){    
      variableArray, stationsArray = getSigmlVariables(entry, variableArray, stationsArray, av);
      console.log('var array ', variableArray);
      console.log('stations array ', stationsArray);
      // Split sentence around variables in array
      for(const vars of variableArray){
        sentenceArray, sentencePart = splitSentence(sentencePart, vars, sentenceArray, stationsArray);
      }
      n_telhand = 1;
      // Push last element
      if(!sentencePart == ""){
        sentenceArray.push(sentencePart);
      }
      getSiGML(sentenceArray, av);
    }
  }
  
  

  