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
  // Remove weird to .... and construction when no intermediate stations are found
  if(sentencePart.match(/to\s\s+and/)){
    sentencePart = sentencePart.replace(/to\s\s+and/, 'to');
  }
  if(sentenceArray.length === 0){
    sentenceArray.push(sentencePart.substring(0, sentencePart.indexOf(variable)-1));
  } else { // Remove space before word
    sentenceArray.push(sentencePart.substring(1, sentencePart.indexOf(variable)-1));
  }
  sentenceArray.push(variable);
  sentencePart = sentencePart.substring(sentencePart.indexOf(variable) + variable.length, sentencePart.length);
  
  return sentenceArray, sentencePart;
}

function getSigmlVariables(entry, variableArray){
  // VOLGORDE VAN TOEVEGEN AAN ARRAY IS VAN BELANG VOOR DE SPLIT FUNCTIE
  if(entry.includes('trainType')){
    trainVar = document.getElementById('trainTypeOptions').value;
    variableArray.push(trainVar);
  }
  if(entry.includes('interStation1')){
    inter1Var = document.getElementById('interStation1Options').value;
    variableArray.push(inter1Var);
  }
  if(entry.includes('interStation2')){
    inter2Var = document.getElementById('interStation2Options').value;
    variableArray.push(inter2Var);
  }
  if(entry.includes('interStation3')){
    inter3Var = document.getElementById('interStation3Options').value;
    variableArray.push(inter3Var);
  }
  if(entry.includes('interStation4')){
    inter4Var = document.getElementById('interStation4Options').value;
    variableArray.push(inter4Var);
  }
  if(entry.includes('endStation')){
    endVar = document.getElementById('endStationOptions').value;
    variableArray.push(endVar);
  }
  if(entry.includes('departTime')){
    departVar = document.getElementById('departTimeInput').value;
    variableArray.push(departVar);
  }
  if(entry.includes('waitTime')){
    waitVar = document.getElementById('waitTimeOptions').value;
    variableArray.push(waitVar);
  }
  if(entry.includes('platformNr')){
    platformVar = document.getElementById('platformNrOptions').value;
    platformVar = platformVar.replaceAll(/\'/g, "");
    variableArray.push(platformVar);
  }
  return variableArray;
} 
            
  /**
   * // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
   * @param {*} text 
   * @param {*} alert 
   */
  function toSiGML(fullSentence, alert="alertMainTran"){
    fullSentence = fullSentence.replaceAll("-", "");
    fullSentence = fullSentence.replaceAll(/interStation\d{1}/g, "");
    fullSentence = fullSentence.replaceAll(/(\d{1})([A-Za-z])/g, " $2");
    fullSentence = fullSentence.replaceAll(/\,/g, "");
    fullSentence = fullSentence.replaceAll(/\'/g, "");
    var variableArray = [];
    var sentenceArray = [];
    var sentencePart = fullSentence;

    if ((globalVar.interStation1 === "-" || globalVar.interStation1 === "interStation1") && (globalVar.interStation2 === "-" || globalVar.interStation2 === "interStation2") && (globalVar.interStation3 === "-" || globalVar.interStation3 === "interStation3") && (globalVar.interStation4 === "-" || globalVar.interStation4 === "interStation4")){
      fullSentence = fullSentence.replace(/and/, "");
    }

    document.getElementById('currSentence').innerHTML = '<b>' + fullSentence + '</b>';
    
    console.log("input: " + fullSentence);
    // Checks regular sentences dict for translation
        entry = document.querySelector('button[data-id="sentenceOptions"]').title;
        console.log('entry ', entry);
        if (entry == undefined) {
          if(globalVar.lang=="Nederlands"){
            alertMessage("info", "Er is momenteel geen vertaling beschikbaar voor deze zin.", alert);
          } else {
            alertMessage("info", "There is currently no translation available for this sentence.", alert);
          }
        } else {
          //globalVar.urlName;
          $.getJSON(globalVar.urlName, function(json) {
            sigmlTemplate = json[entry];
            console.log('sigml ', sigmlTemplate);
            variableArray = getSigmlVariables(entry, variableArray);
            console.log('var array ', variableArray);
            for(const vars of variableArray){
              sentenceArray, sentencePart = splitSentence(sentencePart, vars, sentenceArray);
            }
            sentenceArray.push(sentencePart);
            console.log('sentence array final: ', sentenceArray);

            // Maak apart json bestand met opgeknipte zinnen + bijbehorende sigml delen
            // Haal deze op voor de sentenceArray
            
            // TRY sigml delen ophalen uit json, anders skip (for interpunctie etc)

            // Send sigml to avatar
            playURL(sigmlTemplate);
            document.getElementById("replayButton").setAttribute("name", sigmlTemplate);
            document.getElementById("replayButton").style.display = 'inline-block';
            //document.getElementById("play").setAttribute("class", "btn btn-primary no-click-button");
          }).fail(function() {
              console.log("Could not get JSON file");
          });
        }
    }
  

  