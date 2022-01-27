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
    // dataType: "json",
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
      // output = result.output.split(";");
      // if (output[0].slice(0,5) == "HamNo" || output[0].trim() == text){
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
