// Global variable for the language (default: English)
var globalVar={
  lang: "English",
  trainType: "trainType",
  platformNr: "platformNr",
  departTime: "departTime",
  waitTime: "waitTime",
  interStation1: "interStation1",
  interStation2: "interStation2",
  interStation3: "interStation3",
  interStation4: "interStation4",
  endStation: "endStation",
  currentSentence: "Dear passengers, the trainType to endStation from departTime is not departing.",
  currentSentenceColored: "Dear passengers, the trainType to endStation from departTime is not departing.",
  urlName: "json/json_sentences_English.json"
};

var train_n = 1;
var wait_n = 1;
var depart_n = 1;
var platform_n = 1;
var end_n = 1;

var changeSent = false;
var trainTemp;
var platformTemp;
var departTemp;
var waitTimeTemp;
var endStationTemp;

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

var departTimeInput = document.getElementById('departTimeInput');
// departTimeInput = departTimeInput.value;
var departTimeInputChange;

// Call startUp() once
startUp(globalVar.currentSentence, false);



/**
 * Returns the variable indexes of a specific sentence, for replacement purposes
 */
// function getIndex(varName){
//   return globalVar.currentSentenceColored.indexOf(varName) != -1 ? varIndex = globalVar.currentSentenceColored.indexOf(varName) : -1;
// }


$(departTimeInput).on("change", function(){
  departTimeInputChange = departTimeInput.value;
  replaceText(globalVar.currentSentence, departTimeInputChange, /\d{1,2}\:\d{2}/, globalVar.departTime);
})

function updateGlobalVariables(name, oldValue){
    if(name === "trainType" && train_n===1){
      globalVar.trainType = trainTemp;
      train_n+=1;
      return globalVar.trainType;
    }
    if(name === "platformNr" && platform_n===1){
      globalVar.platformNr = platformTemp;
      platform_n+=1;
      return globalVar.platformNr;
    }
    if(name === "waitTime" && wait_n===1){
      globalVar.waitTime = waitTimeTemp;
      wait_n+=1;
      return globalVar.waitTime;
    }
    if(name === "departTime" && depart_n===1){
      globalVar.departTime = departTemp;
      depart_n+=1;
      return globalVar.departTime;
    }
    if(name === "endStation" && end_n===1){
      globalVar.endStation = endStationTemp;
      end_n+=1;
      return globalVar.endStation;
    }
    return oldValue;
}

/**
 * Checks whether the input sentence contains a variable and needs additional input from the user
 * @param {*} currentSentence 
 * @param {*} newValue 
 * @param {*} oldValue 
 * @param {*} name 
 */
 function replaceText(currentSentence, newValue, oldValue, name){
  // Krijgt globale vars mee vanuit index.html
  console.log('oldValue voor ', oldValue);
  // Update global var in 1st iteration (because of the auto-fill)
  oldValue = updateGlobalVariables(name, oldValue);

  console.log('oldValue: ', oldValue);
  console.log('newValue: ', newValue);
  

  globalVar.currentSentence = currentSentence.replace(oldValue, newValue);

  boxBackground = document.getElementById('currSentenceBox');
  backgroundColor = window.getComputedStyle(boxBackground).backgroundColor;
  if(name === "departTime"){
    if (currentSentence.includes(globalVar.departTime)){
      globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(globalVar.departTime, departTimeInputChange);
    } else {
      globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(/\d{2}\:\d{2}/, departTimeInputChange);
    }
  }
  // Add invisible numbers to the intermediate station names such that their position is recognized
  else if(name.match(/interStation\d{1}/)){
    if (name === "interStation1"){
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
    globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(oldValue, newValueInter);
  } else {
    globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(oldValue, newValue);
  }
  
  // Replace other global vars so default values are overridden
  name === "trainType" ? globalVar.trainType = newValue : -1;
  name === "platformNr" ? globalVar.platformNr = newValue : -1;
  name === "waitTime" ? globalVar.waitTime = newValue : -1;
  name === "departTime" ? globalVar.departTime = newValue : -1;
  name === "endStation" ? globalVar.endStation = newValue : -1;

  // Remove space before invisible numbers
  globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(/\s(\<[^\>]*\>\<[^\>]*\>\d{1})/, "$1");

  console.log("completed sentence: " + globalVar.currentSentence); // => gaat naar toSiGML
  document.getElementById('currSentence').innerHTML = globalVar.currentSentenceColored; // => alleen voor de show
  document.getElementById("play").setAttribute("class", "btn btn-primary");
}

/**
 * Changes the varBox names and creates dropdown menu's, depending on the chosen language
 * @param {*} language 
 */
 function startUp(currentSentence, changeSent) {
  train_n=1;
  platform_n=1;
  depart_n=1;
  wait_n=1;
  end_n=1;
  globalVar.urlName = "json/json_sentences_" + globalVar.lang + ".json";
 
  if(changeSent){
    document.getElementById('currSentence').innerHTML = currentSentence;
    resetBoxes(currentSentence);
    colorKeywords(currentSentence);
  } else {
    $.getJSON(globalVar.urlName, function(json) {
    createDropdown(Object.keys(json), 'sentenceOptions');
    globalVar.currentSentence = Object.keys(json)[0];
    
    createDropdown(waitElementsArray, 'waitOptions');
    createDropdown(interStationsArray, 'interStationOptions1');
    createDropdown(interStationsArray, 'interStationOptions2');
    createDropdown(interStationsArray, 'interStationOptions3');
    createDropdown(interStationsArray, 'interStationOptions4');
    createDropdown(endStationsArray, 'endStationOptions');

    document.getElementById('currSentence').innerHTML = globalVar.currentSentence;
    resetBoxes(globalVar.currentSentence);
    colorKeywords(globalVar.currentSentence);

    document.querySelector('button[data-id="sentenceOptions"]').title = globalVar.currentSentence;
    document.querySelector('button[data-id="endStationOptions"]').title = endStationsArray[0];
    $('.selectpicker').selectpicker('refresh');
    
  });
  }
  // Save initial dropdown menu values temporarily
    trainTemp =  document.getElementById('trainTypeOptions').value;
    platformTemp =  document.getElementById('platformOptions').value;
    departTemp =  document.getElementById('departTimeInput').value;
    waitTimeTemp =  document.getElementById('waitOptions').value;
    endStationTemp =  document.getElementById('endStationOptions').value;
  
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
    globalVar.interStation1 = "tussenStation1",
    globalVar.interStation2 = "tussenStation2",
    globalVar.interStation3 = "tussenStation3",
    globalVar.interStation4 = "tussenStation4",
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
  startUp(globalVar.currentSentence, false);
}

/**
 * Changes the chosen sentence text
 * @param {*} text 
 */
 function changeSentence(currentSentence){
   resetGlobalVariables();
   startUp(currentSentence, true);
}
  
function resetBoxes(currentSentence){
  makeVarBoxInvisible();
  displayVarBox(currentSentence);
}

function colorKeywords(currentSentence){
  // Color keywords
  if(currentSentence.includes(globalVar.trainType)){
    currentSentence = currentSentence.replace(globalVar.trainType, '<span style="color: orange;">' + document.getElementById('trainTypeOptions').value + '</span>');
  } if (currentSentence.includes(globalVar.platformNr)){
    currentSentence = currentSentence.replace(globalVar.platformNr, '<span style="color: orange;">' + document.getElementById('platformOptions').value + '</span>');
  } if (currentSentence.includes(globalVar.departTime)){
    currentSentence = currentSentence.replace(globalVar.departTime, '<span style="color: orange;">' + document.getElementById('departTimeInput').value + '</span>');
  } if (currentSentence.includes(globalVar.waitTime)){
    currentSentence = currentSentence.replace(globalVar.waitTime, '<span style="color: orange;">' + document.getElementById('waitOptions').value + '</span>');
  } if (currentSentence.includes(globalVar.endStation)){
    currentSentence = currentSentence.replace(globalVar.endStation, '<span style="color: orange;">' + document.getElementById('endStationOptions').value + '</span>');
  }
  currentSentence.includes(globalVar.interStation1) ? currentSentence = currentSentence.replaceAll(globalVar.interStation1, '<span style="color: orange;">' + globalVar.interStation1 + '</span>') : -1;
  currentSentence.includes(globalVar.interStation2) ? currentSentence = currentSentence.replaceAll(globalVar.interStation2, '<span style="color: orange;">' + globalVar.interStation2 + '</span>') : -1;
  currentSentence.includes(globalVar.interStation3) ? currentSentence = currentSentence.replaceAll(globalVar.interStation3, '<span style="color: orange;">' + globalVar.interStation3 + '</span>') : -1;
  currentSentence.includes(globalVar.interStation4) ? currentSentence = currentSentence.replaceAll(globalVar.interStation4, '<span style="color: orange;">' + globalVar.interStation4 + '</span>') : -1;
  
  globalVar.currentSentenceColored = currentSentence;
  document.getElementById('currSentence').innerHTML = globalVar.currentSentenceColored;
 
  // Reset default box values
  $("select[name=interStation1]").val("-");
  $("select[name=interStation1]").selectpicker("refresh");
  $("select[name=interStation2]").val("-");
  $("select[name=interStation2]").selectpicker("refresh");
  $("select[name=interStation3]").val("-");
  $("select[name=interStation3]").selectpicker("refresh");
  $("select[name=interStation4]").val("-");
  $("select[name=interStation4]").selectpicker("refresh");

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
