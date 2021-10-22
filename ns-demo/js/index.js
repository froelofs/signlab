// Global variable for the language (default: EN)

var globalVar={
  lang: "English",
  
};

var interStationsArray = ["None", "Zwolle", "Groningen", "Deventer"]
var endStationsArray = ["Zwolle", "Groningen", "Deventer"]

if(globalVar.lang == "Nederlands"){
  trainType = "treinType"
  platformNr = "spoorNr"
  departTime = "vertrekTijd"
  waitTime = "wachtTijd"
  interStation = "tussenStation"
  endStation = "eindStation"
} else{
  trainType = "trainType"
  platformNr = "platformNr"
  departTime = "departTime"
  waitTime = "waitTime"
  interStation = "interStation"
  endStation = "endStation"
}

trainTypeBox = document.getElementById('trainTypeBox');
platformBox = document.getElementById('platformBox');
departTimeBox = document.getElementById('departTimeBox');
waitTimeBox = document.getElementById('waitTimeBox');
interStationBox1 = document.getElementById('interStationBox1')
interStationBox2 = document.getElementById('interStationBox2')
interStationBox3 = document.getElementById('interStationBox3')
interStationBox4 = document.getElementById('interStationBox4')
endStationBox = document.getElementById('endStationBox')

var urlName = "json/json_sentences_English.json";
startUp(globalVar.lang);


function changeSentence(text){
  document.getElementById('sentenceInput').innerHTML = text;
  makeVarBoxInvisible();
  displayVarBox(text);
}

function displayVarBox(text){
  if(text.includes(trainType)){
    trainTypeBox.style.display = "block";
  }

  if(text.includes(platformNr)){
    platformBox.style.display = "block";
  }

  if(text.includes(departTime)){
    departTimeBox.style.display = "block";
  }

  if(text.includes(waitTime)){
    waitTimeBox.style.display = "block";
  }

  if(text.includes(interStation)){
    interStationBox1.style.display = "block";
    interStationBox2.style.display = "block";
    interStationBox3.style.display = "block";
    interStationBox4.style.display = "block";
  }

  if(text.includes(endStation)){
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

  if(text.includes(trainType)){
    text = text.replaceAll(trainType,trainTypeValue);
  }

  if(text.includes(platformNr)){
    text = text.replaceAll(platformNr,platformInputValue);
    console.log("platform text", text);
  }

  if(text.includes(departTime)){
    if(timeInputValue != -1){
      value = adaptTime(timeInputValue);
      text = text.replace(departTime,timeInputValue);
    }
    
  }

  if(text.includes(waitTime)){
    if(waitOptionsValue != -1){
      value = adaptTime(waitOptionsValue,"Nederlands");
      text = text.replaceAll(waitTime,waitOptionsValue);
    }
  }

  if(text.includes(interStation)){
    interStationOptions1Value == -1 ? console.log("no inter 1 station detected") : text = text.replace(interStation,interStationOptions1Value);
    interStationOptions2Value == -1 ? console.log("no inter 2 station detected") : text = text.replace(interStation,interStationOptions2Value);
    interStationOptions3Value == -1 ? console.log("no inter 3 station detected") : text = text.replace(interStation,interStationOptions3Value);
    interStationOptions4Value == -1 ? console.log("no inter 4 station detected") : text = text.replace(interStation,interStationOptions4Value);
    
    if(text.includes("None")){
      text = text.replaceAll("None, ", "");
      text = text.replaceAll("None", "");
    }
    
    // Remove 'and' if no intermediate stations are mentioned
    if(interStationOptions1Value=="None" && interStationOptions2Value=="None" && interStationOptions3Value=="None" && interStationOptions4Value=="None"){
      globalVar.lang =="Nederlands" ? text = text.replace(" en ", "") : text = text.replace(" and ", "");
    }
  }

  if(text.includes(endStation)){
    text = text.replaceAll(endStation,endStationOptionsValue);
  }

  console.log("completed sentence: " + text);
  document.getElementById('sentenceInput').innerHTML = text;
  document.getElementById("play").setAttribute("class", "btn btn-primary");
}

function changeLanguage(language){
  startUp(language);
}
/**
 * Changes the javascript file loaded depending on the chosen language
 * @param {*} language 
 * @param {*} onload 
 */
function startUp(language) {
  urlName = "json/json_sentences_" + language + ".json";
  $.getJSON(urlName, function(json) {
    createDropdown(Object.keys(json), '#sentenceOptions');
    document.getElementById('sentenceInput').innerHTML = document.getElementById('sentenceOptions').value;
  });
  displayVarBox(document.getElementById('sentenceOptions').value);  
  
  // Loads the correct file and sets the paths for the corresponding dicts
  if (language == "Nederlands"){
    console.log('lang', language)
    
    //makeVarBoxInvisible();
    
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
  else{
    console.log('lang', language)
    //makeVarBoxInvisible();
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
  
  createDropdown(waitElementsArray, '#waitOptions');
  createDropdown(interStationsArray, '#interStationOptions1');
  createDropdown(interStationsArray, '#interStationOptions2');
  createDropdown(interStationsArray, '#interStationOptions3');
  createDropdown(interStationsArray, '#interStationOptions4');
  createDropdown(endStationsArray, '#endStationOptions');
  
}

/**
 * Create dropdown menus for wait time and inter/end stations
 * @param {*} elements 
 * @param {*} selectType 
 */
function createDropdown(elements, id){
  $(id + ' option').remove();

  for(i=0; i < elements.length; i++){
    $(id).append('<option value="' + elements[i] + '" id="' + elements[i] + '">' + elements[i] + '</option>');
  }
  
  // Set default value and refresh
  $('.selectpicker').selectpicker('refresh');
 
}

/**
 * Creates a dropdown menu from the SiGML JSON sentences
 */
  
 $.getJSON(urlName, function(json) {
  //createDropdown(Object.keys(json), document.getElementById('sentenceOptions'), "#sentenceOptions options");
  console.log(json);
});



/**
 * Changes language when translator menu is clicked
 */
$(window).on("load", function(){
  if (document.getElementById('Translator')) {
    changeLanguage(true);
  }

} );
