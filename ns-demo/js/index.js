// Global variable for the language (default: English)
var globalVar={
  lang: "English",
  trainType: "trainType",
  platformNr: "platformNr",
  departTime: "departTime",
  waitTime: "waitTime",
  //interStationAlle: "interStation",
  interStation1: "interStation1",
  interStation2: "interStation2",
  interStation3: "interStation3",
  interStation4: "interStation4",
  endStation: "endStation",
  currentSentence: "Dear passengers, the trainType to endStation from departTime is not departing.",
  currentSentenceColored: "Dear passengers, the trainType to endStation from departTime is not departing.",
  urlName: "json/json_sentences_English.json"
};

var interStationsArray = ["-", "Zwolle", "Groningen", "Deventer"]
var endStationsArray = ["Zwolle", "Groningen", "Deventer"]

trainTypeBox = document.getElementById('trainTypeBox');
platformBox = document.getElementById('platformBox');
departTimeBox = document.getElementById('departTimeBox');
waitTimeBox = document.getElementById('waitTimeBox');
interStationBox1 = document.getElementById('interStationBox1')
interStationBox2 = document.getElementById('interStationBox2')
interStationBox3 = document.getElementById('interStationBox3')
interStationBox4 = document.getElementById('interStationBox4')
endStationBox = document.getElementById('endStationBox')

// Call startUp() once
startUp();

/**
 * Returns the variable indexes of a specific sentence, for replacement purposes
 */
function getIndex(varName){
  return globalVar.currentSentenceColored.indexOf(varName) != -1 ? varIndex = globalVar.currentSentenceColored.indexOf(varName) : -1;
}

// function replaceDefaultVariables(){
//   replaceText(globalVar.currentSentence, document.querySelector('button[data-id="trainTypeInput"]').title.toLowerCase(), globalVar.trainType, "trainType");
//   replaceText(globalVar.currentSentence, document.querySelector('button[data-id="platformInput"]').title, globalVar.platformNr, "platformNr");
//   replaceText(globalVar.currentSentence, document.getElementById('timeInput').innerText, globalVar.departTime, "departTime");
//   replaceText(globalVar.currentSentence, document.querySelector('button[data-id="interStationOptions1"]').title, globalVar.interStation1, "interStation1");
//   replaceText(globalVar.currentSentence, document.querySelector('button[data-id="interStationOptions2"]').title, globalVar.interStation2, "interStation2");
//   replaceText(globalVar.currentSentence, document.querySelector('button[data-id="interStationOptions3"]').title, globalVar.interStation3, "interStation3");
//   replaceText(globalVar.currentSentence, document.querySelector('button[data-id="interStationOptions4"]').title, globalVar.interStation4, "interStation4");
//   replaceText(globalVar.currentSentence, document.querySelector('button[data-id="endStationOptions"]').title, globalVar.endStation, "endStation");
// }

/**
 * Replace characters in substring
 * @param {*} str 
 * @param {*} index 
 * @param {*} chr 
 * @returns 
 */
// function replaceAtIndex(str, colorStr, wordIndex, oldValue, newValue) {
//     currentSentence = str.substring(0, wordIndex) + newValue + str.substring(wordIndex+oldValue.length, str.length+1);
//     currentSentenceColored = colorStr.substring(0, wordIndex) + newValue + colorStr.substring(wordIndex+oldValue.length, colorStr.length+1);
//     console.log('curr colored ', currentSentenceColored);
//     return currentSentence, currentSentenceColored
// }

/**
 * Checks whether the input sentence contains a variable and needs additional input from the user
 * @param {*} currentSentence 
 * @param {*} newValue 
 * @param {*} oldValue 
 * @param {*} name 
 */
 function replaceText(currentSentence, currentSentenceColored, newValue, oldValue, name){
   // Krijgt globale vars mee vanuit index.html
  console.log('name ', name);
  console.log('oldval ', oldValue);
  console.log('newval ', newValue);
  
  globalVar.currentSentence = currentSentence.replace(oldValue, newValue);
  
  boxBackground = document.getElementById('currSentenceBox');
  backgroundColor = window.getComputedStyle(boxBackground).backgroundColor;

  if(name === "waitTime"){
    newValue = adaptTime(waitOptionsValue,"Nederlands");
    globalVar.waitTime = newValue;
  } else if (name === "departTime"){
    newValue = adaptTime(waitOptionsValue,"Nederlands");
    globalVar.departTime = newValue;
  // Add invisible numbers to the intermediate station names such that their position is recognized
  } else if (name === "interStation1"){
    newValueInter = '<span style="color:' + backgroundColor + ';">1</span>' + newValue;
    globalVar.interStation1 = newValue;
  } else if (name === "interStation2"){
    newValueInter = '<span style="color:' + backgroundColor + ';">2</span>' + newValue;
    globalVar.interStation2 = newValue;
  } else if (name === "interStation3"){
    newValueInter = '<span style="color:' + backgroundColor + ';">3</span>' + newValue;
    globalVar.interStation3 = newValue;
  } else if (name === "interStation4"){
    newValueInter = '<span style="color:' + backgroundColor + ';">4</span>' + newValue;
    globalVar.interStation4 = newValue;
  }
  
  try{
    globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(oldValue, newValueInter);
  } catch{
    globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(oldValue, newValue);
  }
  
  
  // Replace other global vars so default values are overridden (provided to this function through HTML onchange() )
  name === "trainType" ? globalVar.trainType = newValue : -1;
  name === "platformNr" ? globalVar.platformNr = newValue : -1;
  name === "endStation" ? globalVar.endStation = newValue : -1;

  // Remove space before invisible numbers
  globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(/\s(\<[^\>]*\>\<[^\>]*\>\d{1})/, "$1");

  console.log("completed sentence: " + globalVar.currentSentence); // => gaat naar toSiGML
  document.getElementById('currSentence').innerHTML = globalVar.currentSentenceColored; // => alleen voor de show
  console.log("colored sentence: " + globalVar.currentSentenceColored);
  document.getElementById("play").setAttribute("class", "btn btn-primary");
}

/**
 * Changes the varBox names and creates dropdown menu's, depending on the chosen language
 * @param {*} language 
 */
 function startUp() {
  globalVar.urlName = "json/json_sentences_" + globalVar.lang + ".json";
 
  
  $.getJSON(globalVar.urlName, function(json) {
    createDropdown(Object.keys(json), 'sentenceOptions');
    globalVar.currentSentence = Object.keys(json)[0];
    document.querySelector('button[data-id="sentenceOptions"]');
    document.getElementById('currSentence').innerHTML = globalVar.currentSentence;
    refreshBoxes(globalVar.currentSentence);
  });


  if (globalVar.lang == "Nederlands"){
    console.log('lang', globalVar.lang)
    var waitElementsArray = ["enkele minuten", "ongeveer 5 minuten", "ongeveer 35 minuten", "ongeveer anderhalf uur", "een nog onbekende tijd"];

    document.getElementById('trainType').innerHTML = 'Treintype: ';
    document.getElementById('platform').innerHTML = 'Spoornummer: ';
    document.getElementById('time').innerHTML = 'Vertrektijd: ';
    document.getElementById('waitTime').innerHTML = 'Wachttijd: ';
    document.getElementById('speedLabel').innerHTML = 'Snelheid: ';
    document.getElementById('glossLabel').innerHTML = 'Huidig gebaar: ';
    document.getElementById('endStation').innerHTML = 'Eindstation: ';
    document.getElementById('interStation1').innerHTML = 'Tussenstation 1 (optioneel): ';
    document.getElementById('interStation2').innerHTML = 'Tussenstation 2 (optioneel): ';
    document.getElementById('interStation3').innerHTML = 'Tussenstation 3 (optioneel): ';
    document.getElementById('interStation4').innerHTML = 'Tussenstation 4 (optioneel): ';
    document.getElementById('selectExplain').innerHTML ='<b> 1. </b> Selecteer de invoertaal ';
    document.getElementById('sentenceOptionsLabel').innerHTML = '<b> 2. </b> Verander huidige keuze ';
    document.getElementById('currSentenceLabel').innerHTML = '<u>Huidige keuze: </u>';
    document.getElementById('variablesLabel').innerHTML = '<b> 3. </b> Selecteer variabelen en speel af ';
  }
  else {
    console.log('lang', globalVar.lang)
    var waitElementsArray = ["a few minutes", "approximately 5 minutes", "approximately 35 minutes", "approximately 1.5 hours", "an unknown timeframe"];

    document.getElementById('trainType').innerHTML = 'Train type: ';
    document.getElementById('platform').innerHTML = 'Platform number: ';
    document.getElementById('time').innerHTML = 'Departure time: ';
    document.getElementById('waitTime').innerHTML = 'Waiting time: ';
    document.getElementById('speedLabel').innerHTML = 'Speed: ';
    document.getElementById('glossLabel').innerHTML = 'Current sign: ';
    document.getElementById('endStation').innerHTML = 'End station: ';
    document.getElementById('interStation1').innerHTML = 'Intermediate station 1 (optional): ';
    document.getElementById('interStation2').innerHTML = 'Intermediate station 2 (optional): ';
    document.getElementById('interStation3').innerHTML = 'Intermediate station 3 (optional): ';
    document.getElementById('interStation4').innerHTML = 'Intermediate station 4 (optional): ';
    document.getElementById('selectExplain').innerHTML = '<b> 1. </b> Select input language ';
    document.getElementById('sentenceOptionsLabel').innerHTML = '<b> 2. </b> Change sentence ';
    document.getElementById('currSentenceLabel').innerHTML = '<u>Current sentence: </u>';
    document.getElementById('variablesLabel').innerHTML = '<b> 3. </b> Set variable values and play ';
  }
  
  createDropdown(waitElementsArray, 'waitOptions');
  createDropdown(interStationsArray, 'interStationOptions1');
  createDropdown(interStationsArray, 'interStationOptions2');
  createDropdown(interStationsArray, 'interStationOptions3');
  createDropdown(interStationsArray, 'interStationOptions4');
  createDropdown(endStationsArray, 'endStationOptions');
  document.querySelector('button[data-id="endStationOptions"]').title = endStationsArray[0];
  $('.selectpicker').selectpicker('refresh');
}

/**
 * Displays the variable boxes
 * @param {*} text 
 */
function displayVarBox(text){
  
  text.includes(globalVar.trainType) ? trainTypeBox.style.display = "block" : -1;
  text.includes(globalVar.platformNr) ? platformBox.style.display = "block" : -1;
  text.includes(globalVar.departTime) ? departTimeBox.style.display = "block" : -1;
  text.includes(globalVar.waitTime) ? waitTimeBox.style.display = "block" : -1;
  text.includes(globalVar.interStation1) ? interStationBox1.style.display = "block" : -1;
  text.includes(globalVar.interStation2) ? interStationBox2.style.display = "block" : -1;
  text.includes(globalVar.interStation3) ? interStationBox3.style.display = "block" : -1;
  text.includes(globalVar.interStation4) ? interStationBox4.style.display = "block" : -1;
  text.includes(globalVar.endStation) ? endStationBox.style.display = "block" : -1;
}



/**
 * 
 * @param {*} language 
 */
function resetGlobalVariables(){
  if(globalVar.lang == "Nederlands"){
    globalVar.trainType = "treinType"
    globalVar.platformNr = "spoorNr"
    globalVar.departTime = "vertrekTijd"
    globalVar.waitTime = "wachtTijd"
    globalVar.interStation1 = "interStation1",
    globalVar.interStation2 = "interStation2",
    globalVar.interStation3 = "interStation3",
    globalVar.interStation4 = "interStation4",
    globalVar.endStation = "eindStation"
  } else{
    globalVar.trainType = "trainType"
    globalVar.platformNr = "platformNr"
    globalVar.departTime = "departTime"
    globalVar.waitTime = "waitTime"
    globalVar.interStation1 = "interStation1",
    globalVar.interStation2 = "interStation2",
    globalVar.interStation3 = "interStation3",
    globalVar.interStation4 = "interStation4",
    globalVar.endStation = "endStation"
  }
}

/**
 * Activated when language toggle is clicked, globalVar is changed and startUp() function is called again
 * @param {*} language 
 */
function changeLanguage(language){
  // Update global language
  globalVar.lang = language;
  resetGlobalVariables();
  
  startUp();
}

/**
 * Changes the chosen sentence text
 * @param {*} text 
 */
 function changeSentence(currentSentence){
  globalVar.currentSentence = currentSentence;
  document.getElementById('currSentence').innerHTML = globalVar.currentSentence;
  resetGlobalVariables();
  refreshBoxes(currentSentence);
  //replaceDefaultVariables();
}


function refreshBoxes(currentSentence){
  makeVarBoxInvisible();
  displayVarBox(currentSentence);
  
  currentSentence.includes(globalVar.trainType) ? currentSentence = currentSentence.replace(globalVar.trainType, '<span style="color: orange;">' + globalVar.trainType + '</span>') : console.log('No variable detected to be colored');
  currentSentence.includes(globalVar.platformNr) ? currentSentence = currentSentence.replace(globalVar.platformNr, '<span style="color: orange;">' + globalVar.platformNr + '</span>') : console.log('No variable detected to be colored');
  currentSentence.includes(globalVar.departTime) ? currentSentence = currentSentence.replace(globalVar.departTime, '<span style="color: orange;">' + globalVar.departTime + '</span>') : console.log('No variable detected to be colored');
  currentSentence.includes(globalVar.waitTime) ? currentSentence = currentSentence.replace(globalVar.waitTime, '<span style="color: orange;">' + globalVar.waitTime + '</span>') : console.log('No variable detected to be colored');
  currentSentence.includes(globalVar.interStation1) ? currentSentence = currentSentence.replaceAll(globalVar.interStation1, '<span style="color: orange;">' + globalVar.interStation1 + '</span>') : console.log('No variable detected to be colored');
  currentSentence.includes(globalVar.interStation2) ? currentSentence = currentSentence.replaceAll(globalVar.interStation2, '<span style="color: orange;">' + globalVar.interStation2 + '</span>') : console.log('No variable detected to be colored');
  currentSentence.includes(globalVar.interStation3) ? currentSentence = currentSentence.replaceAll(globalVar.interStation3, '<span style="color: orange;">' + globalVar.interStation3 + '</span>') : console.log('No variable detected to be colored');
  currentSentence.includes(globalVar.interStation4) ? currentSentence = currentSentence.replaceAll(globalVar.interStation4, '<span style="color: orange;">' + globalVar.interStation4 + '</span>') : console.log('No variable detected to be colored');
  currentSentence.includes(globalVar.endStation) ? currentSentence = currentSentence.replace(globalVar.endStation, '<span style="color: orange;">' + globalVar.endStation + '</span>') : console.log('No variable detected to be colored');

  globalVar.currentSentenceColored = currentSentence;
  document.getElementById('currSentence').innerHTML = globalVar.currentSentenceColored;
  document.querySelector('button[data-id="sentenceOptions"]').title = currentSentence;
  $('.selectpicker').selectpicker('refresh');
}

/**
 * Creates dropdown menus
 * @param {*} elements 
 * @param {*} selectType 
 */
function createDropdown(elements, id){
  $("#"+ id + ' option').remove();

  for(i=0; i < elements.length; i++){
    $("#" + id).append('<option value="' + elements[i] + '" id="' + id + i + '">' + elements[i] + '</option>');
  }
  
  // Set default value and refresh
  $('.selectpicker').selectpicker('refresh');
 
}


/**
 * Changes language when translator menu is clicked
 */
$(window).on("load", function(){
  if (document.getElementById('Translator')) {
    changeLanguage(true);
  }

} );
