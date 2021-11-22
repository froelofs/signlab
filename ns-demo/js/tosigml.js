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

function splitSentence(sentencePart, variable, sentenceArray){
  

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
  if(entry.includes(globalVar.trainType)){
    trainVar = document.getElementById('trainTypeOptions').value;
    variableArray.push(trainVar);
  }
  if(entry.includes(globalVar.interStation1)){
    inter1Var = document.getElementById('interStation1Options').value;
    if(!inter1Var === "-"){
      variableArray.push(inter1Var);
    }
  }
  if(entry.includes(globalVar.interStation2)){
    inter2Var = document.getElementById('interStation2Options').value;
    if(!inter2Var === "-"){
      variableArray.push(inter2Var);
    }
  }
  if(entry.includes(globalVar.interStation3)){
    inter3Var = document.getElementById('interStation3Options').value;
    if(!inter3Var === "-"){
      variableArray.push(inter3Var);
    }
  }
  if(entry.includes(globalVar.interStation4)){
    inter4Var = document.getElementById('interStation4Options').value;
    if(!inter4Var === "-"){
      variableArray.push(inter4Var);
    }
  }
  if(entry.includes(globalVar.endStation)){
    endVar = document.getElementById('endStationOptions').value;
    variableArray.push(endVar);
  }
  if(entry.includes(globalVar.departTime)){
    departVar = document.getElementById('departTimeInput').value;
    variableArray.push(departVar);
  }
  if(entry.includes(globalVar.waitTime)){
    waitVar = document.getElementById('waitTimeOptions').value;
    variableArray.push(waitVar);
  }
  if(entry.includes(globalVar.platformNr)){
    platformVar = document.getElementById('platformNrOptions').value;
    platformVar = platformVar.replaceAll(/\'/g, "");
    variableArray.push(platformVar);
  }
  return variableArray;
}

async function getInnerSiGML(el){
  let response = await fetch(el);
  let data = await response.text();
  return data;
}

async function getJSONPhrases(sentenceArray){
  var tempString = '<?xml version="1.0" encoding="utf-8"?><sigml>';
  // Remove empty elements in array
  sentenceArray = sentenceArray.filter(e=>e);
  const [lastItem] = sentenceArray.slice(-1);
  
  $.getJSON("json/split_" + globalVar.urlName + ".json", async function(json_sentence) {
    for(const el of sentenceArray){
      console.log('el: ', json_sentence[el]);
      if(typeof json_sentence[el] !== "undefined"){
        //$.getJSON("json/variables.json", async function(json_variable) {
          // REMOVE WHEN NUMBERS WORK
          if(!el.match(/\d+/) == null){
            console.log('platformNr, time or space');
          } else {
            try{
              let data = await getInnerSiGML(json_sentence[el]);
              tempString += data;
              if(el == lastItem){
                tempString += '</sigml>';
              }
            } catch {
              console.log('no var');
            }
          }
    // Undefined AND last element ends the sequence
    } else if (el == lastItem){
      tempString += '</sigml>';
    }
  }
  //console.log('tempString final: ', tempString);
  playText(tempString);
}).fail(function() {
  console.log("Could not get split SiGML sent JSON file");
});
}

  /**
   * // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
   * @param {*} text 
   * @param {*} alert 
   */
  function toSiGML(fullSentence, alert="alertMainTran"){
    var variableArray = [];
    var sentenceArray = [];

    // Alleen voor de show
    fullSentence = fullSentence.replaceAll("-", "");
    fullSentence = fullSentence.replaceAll(/interStation\d{1}/g, "");
    fullSentence = fullSentence.replaceAll(/tussenStation\d{1}/g, "");
    fullSentence = fullSentence.replaceAll(/(\d{1})([A-Za-z])/g, " $2");
    // Komma is nodig omdat die overblijven na interstations
    fullSentence = fullSentence.replaceAll(/[\,\']/g, "");
    // Remove weird to .... and construction when no intermediate stations are found
    if(fullSentence.match(/to\s\s+and/)){
      fullSentence = fullSentence.replace(/to\s\s+and/, 'to');
    }
    if(fullSentence.match(/naar\s\s+en/)){
      fullSentence = fullSentence.replace(/naar\s\s+en/, 'naar');
    }

    // Show final sentence in bold
    document.getElementById('currSentence').innerHTML = '<b>' + fullSentence + '</b>';
    
    // Remove interpunction + start with the whole sentence (and split later)
    fullSentence = fullSentence.replaceAll(/\./g, "");
    var sentencePart = fullSentence;
    
    console.log("input: " + sentencePart);
        entry = document.querySelector('button[data-id="sentenceOptions"]').title;
        console.log('entry ', entry);
        if (entry == undefined) {
          if(globalVar.lang=="Nederlands"){
            alertMessage("info", "Er is momenteel geen vertaling beschikbaar voor deze zin.", alert);
          } else {
            alertMessage("info", "There is currently no translation available for this sentence.", alert);
          }
        } else {
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

          getJSONPhrases(sentenceArray);
        }
    }
  

  