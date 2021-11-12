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

function getSigmlVariables(entry){
  if(entry.includes('trainType')){
    trainVar = document.getElementById('trainTypeOptions').value;
  }
  if(entry.includes('platformNr')){
    platformVar = document.getElementById('platformNrOptions').value;
  }
  if(entry.includes('departTime')){
    departVar = document.getElementById('departTimeInput').value;
  }
  if(entry.includes('waitTime')){
    waitVar = document.getElementById('waitTimeOptions').value;
  }
  if(entry.includes('interStation1')){
    inter1Var = document.getElementById('interStation1Options').value;
  }
  if(entry.includes('interStation2')){
    inter2Var = document.getElementById('interStation2Options').value;
  }
  if(entry.includes('interStation3')){
    inter3Var = document.getElementById('interStation3Options').value;
  }
  if(entry.includes('interStation4')){
    inter4Var = document.getElementById('interStation4Options').value;
  }
  if(entry.includes('endStation')){
    endVar = document.getElementById('endStationOptions').value;
  }
} 
            
  /**
   * // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
   * @param {*} text 
   * @param {*} alert 
   */
  function toSiGML(text, alert="alertMainTran"){
    console.log('text ', text);
    text = text.replaceAll("-", "");
    text = text.replaceAll(/interStation\d{1}/g, "");
    text = text.replaceAll(/\d{1}[A-Za-z]/g, " ");
    text = text.replaceAll(/\,/g, " ");
    text = text.replaceAll(/\'/g, "");
    
    if ((globalVar.interStation1 === "-" || globalVar.interStation1 === "interStation1") && (globalVar.interStation2 === "-" || globalVar.interStation2 === "interStation2") && (globalVar.interStation3 === "-" || globalVar.interStation3 === "interStation3") && (globalVar.interStation4 === "-" || globalVar.interStation4 === "interStation4")){
      text = text.replace(/and/, "");
    }

    document.getElementById('currSentence').innerHTML = '<b>' + text + '</b>';
    
    console.log("input: " + text);
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
            // AANZETTEN
            //getSigmlVariables(entry);

            // USE OLD INDEX FUNCTION TO CUT SENTENCE IN PARTS
            // - of maak apart json bestand met opgeknipte zinnen + bijbehorende sigml delen, want is toch altijd dezelfde knip
            // - voeg daar tussen dan de juiste vars? => hoe herken je dan welke vars er in moeten

            // Send sigml to avatar
            playURL(sigmlTemplate);
            document.getElementById("replayButton").setAttribute("name", sigmlTemplate);
            document.getElementById("replayButton").style.display = 'inline-block';
            document.getElementById("play").setAttribute("class", "btn btn-primary no-click-button");
          }).fail(function() {
              console.log("Could not get JSON file");
          });
        }
    }
  
// OLD INDEX FUNCTION:
// function replaceAtIndex(str, colorStr, wordIndex, oldValue, newValue) {
//     currentSentence = str.substring(0, wordIndex) + newValue + str.substring(wordIndex+oldValue.length, str.length+1);
//     currentSentenceColored = colorStr.substring(0, wordIndex) + newValue + colorStr.substring(wordIndex+oldValue.length, colorStr.length+1);
//     console.log('curr colored ', currentSentenceColored);
//     return currentSentence, currentSentenceColored

// function getIndex(varName){
//   return globalVar.currentSentenceColored.indexOf(varName) != -1 ? varIndex = globalVar.currentSentenceColored.indexOf(varName) : -1;
// }
  