// variable so flags can be set an passed on to the php call
var flag = "";
var globalVar={
  signlabUrl: "json/NS_sentences_EN.json"
};

/**
 * Makes an ajax call to the python script (by way of a php wrapper)
 */
function callPython(text, alertID) {
  showBusyState();
  //Adds a flag to the input if applicable
  flags = flag.split(",");
  flag = flags[0];
  console.log("flag: " + flag);
  if (flag != ""){
    inputPython = flag + " " + text;
  }
  else{
    inputPython = text;
  }
  $.ajax({
    url : 'pythonCall.php',
    type : 'POST',
    data: {"input": inputPython},
    dataType: "json",
    success : onSuccess,
    error : onError,
  });

  function onSuccess(result) {
    if (result.errorcode) {
      console.log('Error '+result.errorcode+' occured on the server. Error message: '+result.error);
      alertMessage("error", 'Oops, something went wrong', alertID);
    }
    else {
      console.log("Request was a success! Output: ", result);
      output = result.output;
      if(output.slice(0,5) == "<?xml"){
        if (flag == "explain"){
          parent = document.querySelector('#explText');
          console.log("explain:", output);
          //Ensures newlines and tabs in output are displayed in div
          var pre = document.createElement("pre");
          pre.appendChild(document.createTextNode(output));
          if (parent.childNodes.length != 0) {
            parent.removeChild(parent.childNodes[0]);
          }
          parent.append(pre);
        }
        else{
          playText(output.trim());
          document.getElementById('output').value =  output.trim();
          document.getElementById("replayButtonTut").setAttribute("name", output.trim());
          document.getElementById("replayButtonTut").setAttribute("class", "btn btn-primary");
        }
      }
      else{
        console.log("Output has an unexpected format: ", output);
        alertMessage("error", output, alertID);
      }
      if (flags.length == 2){
      	flag = flags[1];
      	callPython(text, alertID);
      }
    showBusyState(false);
    }
  }

  function onError(_xhr, error) {
    console.log ('Something went wrong. Error message: '+error);
    showBusyState(false);
    alertMessage("error", 'Oops, something went wrong', alertID);
  }

  function showBusyState(state) {
    $(document.body).toggleClass('busy', state===undefined?true:state);
  }
}


//Changes the javascript file loaded depending on the chosen language
function changeLanguage(language, onload=false) {
  var head = document.getElementsByTagName('head')[0];
  var js = document.createElement("script");

  // Creates a script element so that the ZonMw script can be loaded in the correct language
  var interStationsArray = ["None", "Zwolle", "Groningen", "Deventer"]
  var endStationsArray = ["Zwolle", "Groningen", "Deventer"]

  // Loads the correct file and sets the paths for the corresponding dicts
  if (language == "Nederlands"){
    globalVar.signlabUrl ="json/NS_sentences_NL.json";
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
    document.getElementById('mySiGML').placeholder = 'Vul hier een zin of trefwoorden in';
    document.getElementById('selectExplain').textContent="Invoertaal: ";
  }
  else{
    var waitElementsArray = ["a few minutes", "approximately 5 minutes", "approximately 35 minutes", "approximately 1.5 hours", "an unknown timeframe"];
    globalVar.signlabUrl ="json/NS_sentences_EN.json";
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
    document.getElementById('mySiGML').placeholder = 'Enter a sentence or keywords here';
    document.getElementById('selectExplain').textContent="Input language: ";
  }
  js.type = "text/javascript";
  js.src = "js/NS_sentences.js";
  head.appendChild(js);

  console.log("language: " + language);
  
  var waitSelect = document.getElementById('waitOptions');
  var interSelect1 = document.getElementById('interStationOptions1');
  var interSelect2 = document.getElementById('interStationOptions2');
  var interSelect3 = document.getElementById('interStationOptions3');
  var interSelect4 = document.getElementById('interStationOptions4');
  var endSelect = document.getElementById('endStationOptions');
  createDropdown(interStationsArray, interSelect1, "#interStationOptions1 option");
  createDropdown(interStationsArray, interSelect2, "#interStationOptions2 option");
  createDropdown(interStationsArray, interSelect3, "#interStationOptions3 option");
  createDropdown(interStationsArray, interSelect4, "#interStationOptions4 option");
  createDropdown(endStationsArray, endSelect, "#endStationOptions option");
  createDropdown(waitElementsArray, waitSelect, "#waitOptions option");
}

/**
 * Create dropdown menus for wait time and inter/end stations
 * @param {*} elements 
 * @param {*} selectType 
 */
function createDropdown(elements, selectType, removeOptions){
  // Remove old dropdowns if they exist
  $(removeOptions).remove();

  for (var i = 0; i < elements.length; i++) {
    option = elements[i];
    var el = document.createElement("option");
    el.textContent = option;
    el.value = option;
    selectType.appendChild(el);
  }
}

$(window).on("load", function(){
  if (document.getElementById('Translator')) {
    changeLanguage(true);
  }

} );

function removeDisclaimer(){
  document.getElementById("avatarTranslator").setAttribute("class","container-fluid");
  document.getElementById("disclaimerAvatar").setAttribute("class","undisplayed");
  console.log(document.getElementById("TranslateNav").className);
  document.getElementById("TranslateNav").setAttribute("class","nav-link active");
  console.log(document.getElementById("TranslateNav").className);
}