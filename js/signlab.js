var flag = "";

//Adapts the page to the chosen option
function changeDisplay(myRadio) {
  console.log("value: " + myRadio);
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
      output = result.output.split(";");
      if (output[0].slice(0,5) == "HamNo" || output[0].trim() == text){
        if (flag == "explain"){
          parent = document.querySelector('#explText');
          console.log(output);
          //Ensures newlines and tabs in output are displayed in div
          var pre = document.createElement("pre");
          pre.appendChild(document.createTextNode(output));
          if (parent.childNodes.length != 0) {
            parent.removeChild(parent.childNodes[0]);
          }
          parent.append(pre);
        }
        else{
          console.log(output[1]);
          console.log(output[2]);
          playText(output[2].trim());
          document.getElementById("replayButtonTut").setAttribute("name", output[2].trim());
          document.getElementById("replayButtonTut").setAttribute("class", "btn btn-primary");
        }
      }
      else{
        console.log(output);
        alertMessage("error", output, alertID);
      }
      if (flags.length == 2){
      	flag = flags[1];
      	callPython(text, alertID);
      }
    showBusyState(false);
    }
  }
  function onError(xhr, error) {
    console.log ('Something went wrong. Error message: '+error);
    showBusyState(false);
    alertMessage("error", 'Oops, something went wrong', alertID);
  }
  function showBusyState(state) {
    $(document.body).toggleClass('busy', state===undefined?true:state);
  }
}

//Changes the javascript file loaded depending on the chosen language
function changeLanguage(onload=false) {
  // Creates a script element so that the ZonMw script can be loaded in the correct language
  var head = document.getElementsByTagName('head')[0];
  var js = document.createElement("script");

  //Defines a separate case for when the translate page is first loaded
  if (onload == true){
    flagClass = "flag-icon flag-icon-gb";
  }
  else{
    flagClass = document.getElementById('language').className;
  }

  js.type = "text/javascript";

  // Loads the correct file and sets the paths for the corresponding dicts and changes the flag
  if (flagClass == "flag-icon flag-icon-nl"){
    js.src = "covid19/zonmwNL.js";
    sentPath = "covid19/json/sentencesDictNL.json";
    vidPath = "covid19/json/videoDictNL.json";
    varPath = "covid19/json/variableDictNL.json";
    document.getElementById('language').setAttribute("class","flag-icon flag-icon-gb");
    document.getElementById('language').setAttribute('placeholder','Vul hier een zin of trefwoorden in');
  }
  else{
    js.src = "covid19/zonmwEN.js";
    sentPath = "covid19/json/sentencesDictEN.json";
    vidPath = "covid19/json/videoDictEN.json";
    varPath = "covid19/json/variableDictEN.json";
    document.getElementById('language').setAttribute("class","flag-icon flag-icon-nl");
    document.getElementById('language').setAttribute('placeholder','Enter a sentence or keywords here');
  }
  head.appendChild(js);
  console.log("language: " + document.getElementById('language').className);
}

$(window).on("load", function(){
  changeLanguage(true);
} );

function removeDisclaimer(){
  document.getElementById("avatarTranslator").setAttribute("class","container-fluid");
  document.getElementById("disclaimerAvatar").setAttribute("class","undisplayed");
}
