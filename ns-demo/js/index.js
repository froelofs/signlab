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
  urlName: "sentences_English",
  sigmlText: ''
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

var oldStationInt;

// Inter en end array moeten verschillende stations bevatten anders krijg je fouten (kleine bug)
var interStationsArray = ["-", "Zwolle", "Arnhem", "Deventer", "Breda"]
var endStationsArray = ["Almelo", "Nijmegen", "Enschede", "Maastricht", "Schiedam", "Utrecht Centraal"]

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
  // Update global var in 1st iteration (because of the auto-fill)
  oldValue = updateGlobalVariables(name, oldValue);

  console.log('oldval: ', oldValue);
  console.log('newval: ', newValue);

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
    var stationInt;

    if (name === "interStation1"){
      oldStationInt = 1;
      stationInt = 1;
      globalVar.interStation1 = newValue;
    } else if (name === "interStation2"){
      oldStationInt = 2;
      stationInt = 2;
      globalVar.interStation2 = newValue;
    } else if (name === "interStation3"){
      oldStationInt = 3;
      stationInt = 3;
      globalVar.interStation3 = newValue;
    } else if (name === "interStation4"){
      oldStationInt = 4;
      stationInt = 4;
      globalVar.interStation4 = newValue;
    }
    if(oldValue.match(/interStation\d{1}/) || oldValue.match(/tussenStation\d{1}/)){
      globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace(oldValue, '<span style="color: ' + backgroundColor + ';">' + stationInt + '</span>' + newValue);
    } else {
      globalVar.currentSentenceColored = globalVar.currentSentenceColored.replace('<span style="color: ' + backgroundColor + ';">' + oldStationInt + '</span>' + oldValue, '<span style="color: ' + backgroundColor + ';">' + stationInt + '</span>' + newValue);
    }
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
  globalVar.urlName = "sentences_" + globalVar.lang;

  if(changeSent){
    document.getElementById('currSentence').innerHTML = currentSentence;
    resetBoxes(currentSentence);
    colorKeywords(currentSentence);
  } else {
    $.getJSON("json/" + globalVar.urlName + ".json", function(json) {
    createDropdown(Object.keys(json), 'sentenceOptions');
    globalVar.currentSentence = Object.keys(json)[0];
    
    createDropdown(waitElementsArray, 'waitTimeOptions');
    createDropdown(interStationsArray, 'interStation1Options');
    createDropdown(interStationsArray, 'interStation2Options');
    createDropdown(interStationsArray, 'interStation3Options');
    createDropdown(interStationsArray, 'interStation4Options');
    createDropdown(endStationsArray, 'endStationOptions');

    document.getElementById('currSentence').innerHTML = globalVar.currentSentence;
    resetBoxes(globalVar.currentSentence);
    colorKeywords(globalVar.currentSentence);

    document.querySelector('button[data-id="sentenceOptions"]').title = globalVar.currentSentence;
    document.querySelector('button[data-id="endStationOptions"]').title = endStationsArray[0];
    $('.selectpicker').selectpicker('refresh');
  }).fail(function() {
    console.log("Could not get JSON file");
  });
  }
  // Save initial dropdown menu values temporarily
    trainTemp =  document.getElementById('trainTypeOptions').value;
    platformTemp =  document.getElementById('platformNrOptions').value;
    departTemp =  document.getElementById('departTimeInput').value;
    waitTimeTemp =  document.getElementById('waitTimeOptions').value;
    endStationTemp =  document.getElementById('endStationOptions').value;
  
  if (globalVar.lang == "Nederlands"){
    console.log('lang', globalVar.lang)
    var waitElementsArray = ["enkele minuten", "ongeveer 5 minuten", "ongeveer 35 minuten", "ongeveer anderhalf uur", "een nog onbekende tijd"];

    document.getElementById('trainType').innerHTML = 'Treintype: ';
    document.getElementById('platform').innerHTML = 'Spoornummer: ';
    document.getElementById('time').innerHTML = 'Vertrektijd: ';
    document.getElementById('waitTime').innerHTML = 'Wachttijd: ';
    document.getElementById('speedLabel').innerHTML = 'Snelheid: ';
    document.getElementById('endStation').innerHTML = 'Eindstation: ';
    document.getElementById('interStation1').innerHTML = 'Tussenstation 1 (optioneel): ';
    document.getElementById('interStation2').innerHTML = 'Tussenstation 2 (optioneel): ';
    document.getElementById('interStation3').innerHTML = 'Tussenstation 3 (optioneel): ';
    document.getElementById('interStation4').innerHTML = 'Tussenstation 4 (optioneel): ';
    document.getElementById('selectExplain').innerHTML ='<b> 1. </b> Selecteer de invoertaal ';
    document.getElementById('sentenceOptionsLabel').innerHTML = '<b> 2. </b> Selecteer omroepbericht ';
    document.getElementById('currSentenceLabel').innerHTML = '<b><u>Huidig omroepbericht: </u></b>';
    document.getElementById('variablesLabel').innerHTML = '<b> 3. </b> Selecteer variabelen ';
  }
  else {
    console.log('lang', globalVar.lang)
    var waitElementsArray = ["a few minutes", "approximately 5 minutes", "approximately 35 minutes", "approximately 1.5 hours", "an unknown timeframe"];

    document.getElementById('trainType').innerHTML = 'Train type: ';
    document.getElementById('platform').innerHTML = 'Platform number: ';
    document.getElementById('time').innerHTML = 'Departure time: ';
    document.getElementById('waitTime').innerHTML = 'Waiting time: ';
    document.getElementById('speedLabel').innerHTML = 'Speed: ';
    document.getElementById('endStation').innerHTML = 'End station: ';
    document.getElementById('interStation1').innerHTML = 'Intermediate station 1 (optional): ';
    document.getElementById('interStation2').innerHTML = 'Intermediate station 2 (optional): ';
    document.getElementById('interStation3').innerHTML = 'Intermediate station 3 (optional): ';
    document.getElementById('interStation4').innerHTML = 'Intermediate station 4 (optional): ';
    document.getElementById('selectExplain').innerHTML = '<b> 1. </b> Select input language ';
    document.getElementById('sentenceOptionsLabel').innerHTML = '<b> 2. </b> Select sentence ';
    document.getElementById('currSentenceLabel').innerHTML = '<b><u>Current sentence: </u></b>';
    document.getElementById('variablesLabel').innerHTML = '<b> 3. </b> Set variable values ';
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
    currentSentence = currentSentence.replace(globalVar.platformNr, '<span style="color: orange;">' + document.getElementById('platformNrOptions').value + '</span>');
  } if (currentSentence.includes(globalVar.departTime)){
    currentSentence = currentSentence.replace(globalVar.departTime, '<span style="color: orange;">' + document.getElementById('departTimeInput').value + '</span>');
  } if (currentSentence.includes(globalVar.waitTime)){
    currentSentence = currentSentence.replace(globalVar.waitTime, '<span style="color: orange;">' + document.getElementById('waitTimeOptions').value + '</span>');
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

function compare(input){
  var check = null;
  $.ajax({
   'async': false,
   'global': false,
   'url': "json/check.json",
   'dataType': "json",
   'success': function(data) {
    check = data;
   }
  });

  for (key in check){
   if(input == check[key]){
    check = true;
    break;
   }
  }

  if (check == true){
   document.getElementById("checkPage").style.display = "none";
  }
  else{
   alertMessage("error","This password is incorrect","pwdAlert");
  }
}

/**
 * Enable play button when 'stop' is clicked
 */
function makePlayClickable(){
  document.getElementById("play").setAttribute("class", "btn btn-primary");
}

/**
 * Changes language when translator menu is clicked
 */
$(window).on("load", function(){
  if (document.getElementById('Translator')) {
    changeLanguage(globalVar.lang);
  }
  // Disable the play button when 'pause' or 'resume' is clicked
  document.getElementById('pause').addEventListener('click', function(){ 
    document.getElementById("play").setAttribute("class", "no-click-button btn btn-primary");
  });
  document.getElementById('resume').addEventListener('click', function(){ 
    document.getElementById("play").setAttribute("class", "no-click-button btn btn-primary");
  });
  
} );
