// variable so flags can be set an passed on to the php call
var flag = "";

//Adapts the page to the chosen option
function changeDisplay(myRadio) {
  console.log("display: " + myRadio);
  if (myRadio.value == "fingerspell") {
  	document.getElementById("replayButton").setAttribute("class", "btn btn-primary undisplayed");
    flag = "spell";
  }
  else if (myRadio.value == "freestyle") {
  	document.getElementById("replayButton").setAttribute("class", "btn btn-primary undisplayed");
    flag = "";
  }
  else if (myRadio.value == "explain") {
    document.getElementById("avatarTut").setAttribute("class", "undisplayed");
    document.getElementById("speedAdjTut").setAttribute("class", "undisplayed");
    document.getElementById("outputGlossTut").setAttribute("class", "undisplayed");
    document.getElementById("glossLabelTut").style.display = 'none';
    document.getElementById("speedLabelTut").style.display = 'none';
    document.getElementById("stopButtonTut").setAttribute("class", "btn btn-primary undisplayed");
    document.getElementById("replayButtonTut").setAttribute("class", "btn btn-primary undisplayed");
    flag = "explain";
  }
  else if (myRadio.value == "explAva") {
    document.getElementById("avatarTut").setAttribute("class", "CWASAAvatar av1");
    document.getElementById("speedAdjTut").setAttribute("class", "CWASASpeed av1");
    document.getElementById("outputGlossTut").setAttribute("class", "txtGloss av1");
    document.getElementById("glossLabelTut").style.display = 'inline-block';
    document.getElementById("speedLabelTut").style.display = 'inline-block';
    document.getElementById("stopButtonTut").setAttribute("class", "btn btn-primary displayed av1");
    document.getElementById("replayButtonTut").setAttribute("class", "btn btn-primary undisplayed av1");
    flag = "explain,";
  }
}

///Makes an ajax call to the python script (by way of a php wrapper)
function callPython(text, alertID) {
  showBusyState();
  console.log("text: " + text);
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
    // url : 'pythonCall.php',
    url:  'https://fa1638352700.azurewebsites.net/api/sigmlTrigger?textValue="'+ inputPython + '"' ,
    type : 'POST',
    // data: {"input": inputPython},
    //dataType: "json",
    //dataType: "jsonp",
    crossDomain: true,
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
      console.log("value inputPython: " + inputPython);
      // output = result.output.split(";");
      // if (output[0].slice(0,5) == "HamNo" || output[0].trim() == text){
      //output = result.output;
      output = result.indexOf("<?xml");
      if(output >-1){
        if (output >-1){
          parent = document.querySelector('#output');
          console.log("explain:", output);
          //Ensures newlines and tabs in output are displayed in div
          var pre = document.createElement("pre");
          pre.appendChild(document.createTextNode(result.slice(output)));
          if (parent.childNodes.length != 0) {
            parent.removeChild(parent.childNodes[0]);
          }
          parent.append(pre);
        }
        else{
          // console.log("0:", output[0]);
          // console.log("1:" , output[1]);
          // console.log("SiGML: ", output[2]);
          // playText(output[2].trim(),1);
          playText(output.trim());
          // document.getElementById('output').value =  output[2].trim();
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
  // Creates a script element so that the ZonMw script can be loaded in the correct language
  var head = document.getElementsByTagName('head')[0];
  var js = document.createElement("script");

  js.type = "text/javascript";
  // Loads the correct file and sets the paths for the corresponding dicts
  if (language == "Nederlands"){
    js.src = "js/zonmwDemoNL.js";
    document.getElementById('mySiGML').placeholder = 'Vul hier een zin of trefwoorden in';
    document.getElementById('selectExplain').textContent="Invoertaal: ";
  }
  else{
    js.src = "js/zonmwDemoEN.js";
    document.getElementById('mySiGML').placeholder = 'Enter a sentence or keywords here';
    document.getElementById('selectExplain').textContent="Input language: ";
  }
  head.appendChild(js);
  console.log("language: " + language);
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

function addNonmanuals(elementID){
  // Retrieves the text enterd into the input field
  textElement = document.getElementById("mySiGML");
  text = textElement.value;

  if(text ==""){
    alertMessage("error", 'You can only add nonmanuals once you have entered at least one gloss', 'alertPlayground');
    return;
  }

  // Retrieves the indices of the start and end of the selected text
  startSelect = textElement.selectionStart;
  endSelect = textElement.selectionEnd;
  console.log(startSelect + " " + endSelect);

  // Checks that a selection was made
  selectedGlosses = textElement.value.substr(startSelect, endSelect - startSelect);
  if(selectedGlosses.length ==0){
    alertMessage("error", 'Please use your mouse to select at least one gloss', 'alertPlayground');
    return;
  }

  // Retrieves the opening tag of the selected nonmanual and creates the corresponding closing tag
  openTag = document.getElementById(elementID).value;
  closeTag = openTag.slice(0,1) + "/" + openTag.slice(1);
  
  // Adds the nonmanual tags to the selected glosses
  insertion =  openTag + selectedGlosses + closeTag;
  

  textElement.value = text.slice(0,startSelect) + insertion + text.slice(endSelect); 
 }

function showNonmans(category){
   
  hiddenCategory = document.getElementById(category.value);
  elements = document.getElementsByClassName("nonmanSelect");

  for (let item of elements) {
    item.style.display = "none";
  }

  hiddenCategory.style.display = "block";
 }

// Stores the autocomplete suggestions
var signOptions;

//Stores the sigml translations corresponding to the completed variable sentences
var jsonAvailableSigns;
  
// Stores the dict of sentences with variables for the avatar
function callbackSigns(response) {
  jsonAvailableSigns = response;
  signOptions = Object.keys(jsonAvailableSigns);
  console.log(signOptions);
}

// Retrieves the dict of sentences with variables for the avatar
$.ajax({
 url: "newDict.json",
 global: false,
 success: function(data) {
   console.log("hello");
  callbackSigns(data);
 },
 error: function(xhr, error){
  console.log("something is wrong: " + error);
 }
});

 //Stores suggestions returned by autocomplete so user input can be checked against it
 var autocompSugg = [];

 // Defines the functions for autcomplete suggestions
 $( function() {
  // Defines the filter that searches the list of options for matches
  function customFilter(array, terms) {
    arrayOfTerms = terms.split(" ");
    term = arrayOfTerms[arrayOfTerms.length - 1];
    //Only selects the words that start with the term
    var matcher = new RegExp("^" + term, "i");
    array = $.grep(array, function (value) {
      return matcher.test(value.label || value.value || value);
    });
    return array;
  }

  // Activates the jquery autocomplete function when the user gives input
  $("#mySiGML").autocomplete({
    appendTo: "#output",
    multiple: true,
    mustMatch: false,
    //Sets the autocomplete suggestions
    source: function (request, response){
      textElement = document.getElementById("mySiGML");
      autocompSugg = customFilter(signOptions, request.term);
      response(autocompSugg);
      console.log("response: " + response);
    },
    select: function( event, ui ){
      if (ui.item != null){
        console.log("selected: " + ui.item.value);
      }
    }
  });

  //Forces the width of the autcomplete menu to fit the input field's width
  jQuery.ui.autocomplete.prototype._resizeMenu = function () {
    var ul = this.menu.element;
    ul.outerWidth(this.element.outerWidth());
  }
});

function makeClickable(elementID){
  globalVar.playButtonClicked = false;
  document.getElementById(elementID).setAttribute("class", "btn btn-primary");
}

function makeNonClickable(elementID){
  globalVar.playButtonClicked = true;
  document.getElementById(elementID).setAttribute("class", "no-click-button btn btn-primary");
}

function playSiGML(av=1){
  makeClickable("pause");
  makeClickable("resume");
  makeNonClickable("play");
  playText(document.getElementById("output").value,av);
}

function pause(){
  makeNonClickable("play");
  makeNonClickable("pause");
  makeClickable("resume");
}

function resume(){
  makeNonClickable("resume");
  makeClickable("pause");
}

function stop(av=1){
  makeNonClickable("resume");
  makeNonClickable("pause");
  makeClickable("play");
  CWASA.stopSiGML(av);
}