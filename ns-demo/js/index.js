// Global variable for the language (default: English)
var globalVar={
  lang: "English",
  trainType: "trainType",
  platformNr: "platformNr",
  departTime: "departTime",
  waitTime: "waitTime",
  interStation: "interStation",
  endStation: "endStation",
  currentSentence: "Dear passengers, the trainType to endStation from departTime is not departing."
};

var interStationsArray = ["None", "Zwolle", "Groningen", "Deventer"]
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

var urlName = "json/json_sentences_" + globalVar.lang + ".json";

// Call startUp() once
startUp(globalVar.lang);


/**
 * Displays the variable boxes
 * @param {*} text 
 */
function displayVarBox(text){
  
  if(text.includes(globalVar.trainType)){
    trainTypeBox.style.display = "block";
  }

  if(text.includes(globalVar.platformNr)){
    platformBox.style.display = "block";
  }

  if(text.includes(globalVar.departTime)){
    departTimeBox.style.display = "block";
  }

  if(text.includes(globalVar.waitTime)){
    waitTimeBox.style.display = "block";
  }

  if(text.includes(globalVar.interStation)){
    interStationBox1.style.display = "block";
    interStationBox2.style.display = "block";
    interStationBox3.style.display = "block";
    interStationBox4.style.display = "block";
  }

  if(text.includes(globalVar.endStation)){
    endStationBox.style.display = "block";
  }

  document.getElementById('okBox').style.display = "block";
}


/**
 * Checks whether the input sentence contains a variable and needs additional input from the user
 * @param {*} text 
 * @param {*} trainTypeValue 
 * @param {*} platformInputValue 
 * @param {*} timeInputValue 
 * @param {*} waitOptionsValue 
 * @param {*} interStationOptions1Value 
 * @param {*} interStationOptions2Value 
 * @param {*} interStationOptions3Value 
 * @param {*} interStationOptions4Value 
 * @param {*} endStationOptionsValue 
 */
function replaceText(text,trainTypeValue=-1, platformInputValue=-1, timeInputValue=-1, waitOptionsValue=-1, interStationOptions1Value=-1,
  interStationOptions2Value=-1, interStationOptions3Value=-1, interStationOptions4Value=-1, endStationOptionsValue=-1){

  console.log("text: " + text);

  if(text.includes(globalVar.trainType)){
    text = text.replaceAll(globalVar.trainType,trainTypeValue);
  }

  if(text.includes(globalVar.platformNr)){
    text = text.replaceAll(globalVar.platformNr,platformInputValue);
    console.log("platform text", text);
  }

  if(text.includes(globalVar.departTime)){
    if(timeInputValue != -1){
      value = adaptTime(timeInputValue);
      text = text.replace(globalVar.departTime,timeInputValue);
    }
    
  }

  if(text.includes(globalVar.waitTime)){
    if(waitOptionsValue != -1){
      value = adaptTime(waitOptionsValue,"Nederlands");
      text = text.replaceAll(globalVar.waitTime,waitOptionsValue);
    }
  }

  if(text.includes(globalVar.interStation)){
    interStationOptions1Value == -1 ? console.log("no inter 1 station detected") : text = text.replace(globalVar.interStation,interStationOptions1Value);
    interStationOptions2Value == -1 ? console.log("no inter 2 station detected") : text = text.replace(globalVar.interStation,interStationOptions2Value);
    interStationOptions3Value == -1 ? console.log("no inter 3 station detected") : text = text.replace(globalVar.interStation,interStationOptions3Value);
    interStationOptions4Value == -1 ? console.log("no inter 4 station detected") : text = text.replace(globalVar.interStation,interStationOptions4Value);
    
    if(text.includes("None")){
      text = text.replaceAll("None, ", "");
      text = text.replaceAll("None", "");
    }
    
    // Remove 'and' if no intermediate stations are mentioned
    if(interStationOptions1Value=="None" && interStationOptions2Value=="None" && interStationOptions3Value=="None" && interStationOptions4Value=="None"){
      globalVar.lang =="Nederlands" ? text = text.replace(" en ", "") : text = text.replace(" and ", "");
    }
  }

  if(text.includes(globalVar.endStation)){
    text = text.replaceAll(globalVar.endStation,endStationOptionsValue);
  }

  console.log("completed sentence: " + text);
  document.getElementById('sentenceInput').innerHTML = text;
  document.getElementById("play").setAttribute("class", "btn btn-primary");
}

/**
 * Activated when language toggle is clicked, globalVar is changed and startUp() function is called again
 * @param {*} language 
 */
function changeLanguage(language){
  // Update global language
  globalVar.lang = language;

  if(globalVar.lang == "Nederlands"){
    globalVar.trainType = "treinType"
    globalVar.platformNr = "spoorNr"
    globalVar.departTime = "vertrekTijd"
    globalVar.waitTime = "wachtTijd"
    globalVar.interStation = "tussenStation"
    globalVar.endStation = "eindStation"
  } else{
    globalVar.trainType = "trainType"
    globalVar.platformNr = "platformNr"
    globalVar.departTime = "departTime"
    globalVar.waitTime = "waitTime"
    globalVar.interStation = "interStation"
    globalVar.endStation = "endStation"
  }
  startUp(language);
}

/**
 * Changes the chosen sentence text
 * @param {*} text 
 */
 function changeSentence(currentSentence){
  globalVar.currentSentence = currentSentence;
  document.getElementById('sentenceInput').innerHTML = globalVar.currentSentence;
  refreshBoxes(currentSentence);
}

/**
 * Changes the colors of the variables in the chosen sentence text
 * @param {*} sent 
 */
function changeColors(sent){
  sent.includes(globalVar.trainType) ? sent = sent.replaceAll(globalVar.trainType, '<span style= "color: orange;">' + globalVar.trainType + '</span>') : console.log('no trainType');
  sent.includes(globalVar.platformNr) ? sent = sent.replaceAll(globalVar.platformNr, '<span style= "color: orange;">' + globalVar.platformNr + '</span>') : console.log('no platformNr');
  sent.includes(globalVar.departTime) ? sent = sent.replaceAll(globalVar.departTime, '<span style= "color: orange;">' + globalVar.departTime + '</span>') : console.log('no departTime');
  sent.includes(globalVar.waitTime) ? sent = sent.replaceAll(globalVar.waitTime, '<span style= "color: orange;">' + globalVar.waitTime + '</span>') : console.log('no waitTime');
  sent.includes(globalVar.interStation) ? sent = sent.replaceAll(globalVar.interStation, '<span style= "color: orange;">' + globalVar.interStation + '</span>') : console.log('no interStation');
  sent.includes(globalVar.endStation) ? sent = sent.replaceAll(globalVar.endStation, '<span style= "color: orange;">' + globalVar.endStation + '</span>') : console.log('no endStation');
 
  document.getElementById('sentenceInput').innerHTML = sent;
}


function refreshBoxes(currentSentence){
  makeVarBoxInvisible();
  displayVarBox(currentSentence);
  document.getElementById('sentenceInput').innerHTML = currentSentence;
  changeColors(currentSentence);
  document.querySelector('button[data-id="sentenceOptions"]').title = currentSentence;
  $('.selectpicker').selectpicker('refresh');
}

/**
 * Changes the varBox names and creates dropdown menu's, depending on the chosen language
 * @param {*} language 
 */
function startUp(language) {
  urlName = "json/json_sentences_" + language + ".json";
 
  
  $.getJSON(urlName, function(json) {
    createDropdown(Object.keys(json), 'sentenceOptions');
    globalVar.currentSentence = Object.keys(json)[0];
    refreshBoxes(globalVar.currentSentence);
  });


  if (language == "Nederlands"){
    console.log('lang', language)
    var waitElementsArray = ["enkele minuten", "ongeveer 5 minuten", "ongeveer 35 minuten", "ongeveer anderhalf uur", "een nog onbekende tijd"];

    document.getElementById('trainType').innerHTML = 'Treintype: ';
    document.getElementById('platform').innerHTML = 'Spoornummer: ';
    document.getElementById('time').innerHTML = 'Vertrektijd: ';
    document.getElementById('waitTime').innerHTML = 'Wachttijd: ';
    document.getElementById('speedLabel').innerHTML = 'Snelheid: ';
    document.getElementById('glossLabel').innerHTML = 'Huidig gebaar: ';
    document.getElementById('endStation').innerHTML = 'Eindstation: ';
    document.getElementById('interStation1').innerHTML = 'Tussenstation 1: ';
    document.getElementById('interStation2').innerHTML = 'Tussenstation 2: ';
    document.getElementById('interStation3').innerHTML = 'Tussenstation 3: ';
    document.getElementById('interStation4').innerHTML = 'Tussenstation 4: ';
    document.getElementById('sentenceText').innerHTML = 'Gekozen zin: ';
    
    document.getElementById('sentenceOptionsText').innerHTML = 'Verander zin: ';
    document.getElementById('selectExplain').textContent="Invoertaal: ";
  }
  else {
    console.log('lang', language)
    var waitElementsArray = ["a few minutes", "approximately 5 minutes", "approximately 35 minutes", "approximately 1.5 hours", "an unknown timeframe"];

    document.getElementById('trainType').innerHTML = 'Train type: ';
    document.getElementById('platform').innerHTML = 'Platform number: ';
    document.getElementById('time').innerHTML = 'Departure time: ';
    document.getElementById('waitTime').innerHTML = 'Waiting time: ';
    document.getElementById('speedLabel').innerHTML = 'Speed: ';
    document.getElementById('glossLabel').innerHTML = 'Current sign: ';
    document.getElementById('endStation').innerHTML = 'End station: ';
    document.getElementById('interStation1').innerHTML = 'Intermediate station 1: ';
    document.getElementById('interStation2').innerHTML = 'Intermediate station 2: ';
    document.getElementById('interStation3').innerHTML = 'Intermediate station 3: ';
    document.getElementById('interStation4').innerHTML = 'Intermediate station 4: ';
    document.getElementById('sentenceText').innerHTML = 'Chosen sentence: ';
    document.getElementById('sentenceOptionsText').innerHTML = 'Change sentence: ';
    document.getElementById('selectExplain').textContent="Input language: ";
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
