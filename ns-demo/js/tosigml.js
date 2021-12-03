function startPose() {
  playText("<?xml version='1.0' encoding='UTF-8'?><sigml><hamgestural_sign gloss='STANDARD_POSE'><sign_manual both_hands='true' lr_symm='true'><handconfig extfidir='dl' /> <handconfig palmor='l' /><handconfig handshape='fist' thumbpos='across' /><location_bodyarm contact='touch' location='belowstomach' side='right_beside'><location_hand digits='1' /></location_bodyarm></sign_manual><sign_nonmanual></sign_nonmanual></hamgestural_sign></sigml>");
} 

var trainVar;
var platformVar;
var departVar;
var waitVar;
var inter1Var;
var inter2Var;
var inter3Var;
var inter4Var;
var endVar;
var json_sent_NL;
var json_sent_EN;
var json_var;

function splitSentence(sentencePart, variable, sentenceArray){
  var regex_platform = /(\d{1,2})([a-z])/;
  if(variable.match(regex_platform)){
    var number = platformVar.replace(regex_platform, '$1');
    var letter = platformVar.replace(regex_platform, '$2');
    sentenceArray.push(sentencePart.substring(1, sentencePart.indexOf(variable)-1));
    sentenceArray.push(number, letter);
    return sentenceArray, "";
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
  sentencePart = sentencePart.substring(sentencePart.indexOf(variable) + variable.length, sentencePart.length);
  
  return sentenceArray, sentencePart;
}

function getSigmlVariables(entry, variableArray){
  // VOLGORDE VAN TOEVEGEN AAN ARRAY IS VAN BELANG VOOR DE SPLIT FUNCTIE
  // GLOBALVARS WERKT NIET ivm vervanging vd waardes
  console.log('entry: ', entry);
  console.log('array: ', variableArray);

  if(entry.includes("trainType") || entry.includes("treinType")){
    trainVar = document.getElementById('trainTypeOptions').value;
    variableArray.push(trainVar);
  }
  if(entry.includes("interStation1,") || entry.includes("tussenStation1")){
    inter1Var = document.getElementById('interStation1Options').value;
    if(inter1Var !== "-"){
      variableArray.push(inter1Var);
    }
  }
  if(entry.includes("interStation2") || entry.includes("tussenStation2")){
    inter2Var = document.getElementById('interStation2Options').value;
    if(inter2Var !== "-"){
      variableArray.push(inter2Var);
    }
  }
  if(entry.includes("interStation3") || entry.includes("tussenStation3")){
    inter3Var = document.getElementById('interStation3Options').value;
    if(inter3Var !== "-"){
      variableArray.push(inter3Var);
    }
  }
  if(entry.includes("interStation4") || entry.includes("tussenStation4")){
    inter4Var = document.getElementById('interStation4Options').value;
    if(inter4Var !== "-"){
      variableArray.push(inter4Var);
    }
  }
  if(entry.includes("endStation") || entry.includes("eindStation")){
    endVar = document.getElementById('endStationOptions').value;
    variableArray.push(endVar);
  }
  if(entry.includes("departTime") || entry.includes("vertrekTijd")){
    departVar = document.getElementById('departTimeInput').value;
    variableArray.push(departVar);
  }
  if(entry.includes("waitTime") || entry.includes("wachtTijd")){
    waitVar = document.getElementById('waitTimeOptions').value;
    variableArray.push(waitVar);
  }
  if(entry.includes("platformNr") || entry.includes("spoorNr")){
    platformVar = document.getElementById('platformNrOptions').value;
    platformVar = platformVar.replaceAll(/\'/g, "");
    variableArray.push(platformVar);
    }
  return variableArray;
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

async function getSiGML(sentenceArray){
  var tijdArray = [];
  var tempString = '<?xml version="1.0" encoding="utf-8"?><sigml>';
  // Remove empty elements in array
  sentenceArray = sentenceArray.filter(e=>e);
  const [lastItem] = sentenceArray.slice(-1);
  
  for(const el of sentenceArray){
    if(json_sent_NL[el] !== undefined || json_sent_EN[el] !== undefined){
      if(globalVar.lang === "Nederlands"){
        console.log('json sent NL: ', json_sent_NL[el]);
        let data = await getSiGMLContent(json_sent_NL[el]);
        tempString += data;
      } else {
        console.log('json sent EN: ', json_sent_EN[el]);
        let data = await getSiGMLContent(json_sent_EN[el]);
        tempString += data;
      }
    } else if (json_var[el] !== undefined && !tijdArray.includes(el)){
        console.log('json var: ', json_var[el]);
        let data = await getSiGMLContent(json_var[el]);
        tempString += data;
    } else if(el == "tijd"){
      // Change gloss into hh:mm format
      el_index = sentenceArray.indexOf(el);
      tijdArray = [sentenceArray[el_index+1], sentenceArray[el_index+2], sentenceArray[el_index+3]];
      let tijd = sentenceArray[el_index+1] + sentenceArray[el_index+2] + sentenceArray[el_index+3];
      for(i=1; i<=3; i++){
        let data = await getSiGMLContent(json_var[sentenceArray[el_index+i]]);
        var regex_sigml = /\<hamgestural\_sign\sgloss\=\"(\w*)\"/;
        if(data.match(regex_sigml)){
          data = data.replace(regex_sigml, '<hamgestural_sign gloss="' + tijd + '"');
        }
        tempString += data;
      }
    } else {
      console.log('Both undefined or element skipped: ', el);
    }
    if (el == lastItem){
      tempString += '<hamgestural_sign gloss=""><sign_manual both_hands="true" lr_symm="true"><handconfig handshape="fist" thumbpos="across" /><handconfig extfidir="dl" /><handconfig palmor="l" /><location_bodyarm contact="touch" location="belowstomach" side="right_beside"><location_hand digits="1" /></location_bodyarm></sign_manual><sign_nonmanual><head_tier><head_movement movement="PB" /></head_tier><body_tier><body_movement movement="ST" /></body_tier><facialexpr_tier><eye_brows movement="RB" /><eye_lids movement="WB" /></facialexpr_tier></sign_nonmanual></hamgestural_sign>';
      tempString += '</sigml>';
    }
  }
  //console.log('tempString final: ', tempString);
  playText(tempString);
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

function makeReadableAndShow(fullSentence){
    fullSentence = fullSentence.replaceAll("-", "");
    fullSentence = fullSentence.replaceAll(/interStation\d{1}/g, "");
    fullSentence = fullSentence.replaceAll(/tussenStation\d{1}/g, "");
    fullSentence = fullSentence.replaceAll(/[\,\']/g, ""); // Comma check needed (interstations)
    fullSentence = fullSentence.replaceAll(new RegExp("(\\d{1})+" + getInterStationsArray() +"(\\d{1})?", "g"), " $2 ");
    if(fullSentence.match(/to\d*\s*and?/)){ // Remove weird to ... and construction (interstations)
      fullSentence = fullSentence.replace(/to\d*\s*and?/, 'to');
    }
    if(fullSentence.match(/naar\d*\s*en/)){
      fullSentence = fullSentence.replace(/naar\d*\s*en/, 'naar');
    }
    document.getElementById('currSentence').innerHTML = '<b>' + fullSentence + '</b>';
    // Remove interpunction for splitting purposes (later)
    fullSentence = fullSentence.replaceAll(/\./g, "");
    return fullSentence;
}

  /**
   * // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
   * @param {*} text 
   * @param {*} alert 
   */
  function getSentenceArray(fullSentence){
    var variableArray = [];
    var sentenceArray = [];

    // Initally, sentencePart includes the whole (polished) sentence
    var sentencePart = makeReadableAndShow(fullSentence);
    console.log("input: " + sentencePart);

    entry = document.querySelector('button[data-id="sentenceOptions"]').title;
    console.log('entry ', entry);

    if(!checkUndefined(entry)){    
      variableArray = getSigmlVariables(entry, variableArray);
      console.log('var array ', variableArray);
      // Split sentence around variables in array
      for(const vars of variableArray){
        sentenceArray, sentencePart = splitSentence(sentencePart, vars, sentenceArray);
      }
      // Push last element
      if(!sentencePart == ""){
        sentenceArray.push(sentencePart);
      }  
      console.log('sentence array final: ', sentenceArray);
      getSiGML(sentenceArray);
    }
  }
  
  

  