// Stores the autocomplete suggestions
var options;
//Stores the sigml translations corresponding to the suggestions
var jsonSent;

// Stores the the global language json file name
var urlName = globalVar.signlabUrl;

function startPose() {
  playText("<?xml version='1.0' encoding='UTF-8'?><sigml><hamgestural_sign gloss='STANDARD_POSE'><sign_manual both_hands='true' lr_symm='true'><handconfig extfidir='dl' /> <handconfig palmor='l' /><handconfig handshape='fist' thumbpos='across' /><location_bodyarm contact='touch' location='belowstomach' side='right_beside'><location_hand digits='1' /></location_bodyarm></sign_manual><sign_nonmanual></sign_nonmanual></hamgestural_sign></sigml>");
}

// Stores the necessities for autcomplete suggestions and the dict of sentences for the avatar
function callbackSent(response) {
  jsonSent = response;
  options = Object.keys(jsonSent);
}
  
  // Retrieves the dict of sentences with SiGML translations
  $.ajax({
    url: urlName,
    success: function (data) {
    callbackSent(data);
    },
    error: function(xhr, error){
    console.log(error);
    }
  });
  
  
  // DICTS VERWIJDERD DUS WERKT NIET
  // //Stores the sigml translations corresponding to the completed variable sentences
  // var jsonVariable;
  
  // // Stores the dict of sentences with variables for the avatar
  // function callbackVar(response) {
  //  jsonVariable = response;
  //  varOptions = Object.keys(jsonVariable);
  // }
  
  // // Retrieves the dict of sentences with variables for the avatar
  // $.ajax({
  //  url: "json/variableDictEN.json",
  //  global: false,
  //  success: function(data) {
  //   callbackVar(data);
  //  },
  //  error: function(xhr, error){
  //   console.log(error);
  //  }
  // });
  
  // Keeps track of whether the dict with sentences with variables needs to be called
  var variable = false;
  
  //Stores suggestions returned by autocomplete so user input can be checked against it
  var autocompSugg = [];
  
  // Defines the functions for autcomplete suggestions
  $( function() {
    // Defines the filter that searches the list of options for matches
    function customFilter(array, terms) {
      arrayOfTerms = terms.split(" ");
      punctuation = ["?",",",".",";",":","/"];
      arrayOfTerms.forEach(function (term) {
        if(punctuation.includes(term)) {
          var matcher = new RegExp("\\" + term, "i");
        }
        else{
          var matcher = new RegExp(term, "i");
        }
        array = $.grep(array, function (value) {
         return matcher.test(value.label || value.value || value);
        });
      });
      return array;
    }
  
    // Activates the jquery autocomplete function when the user gives input
    $("#mySiGML").autocomplete({
      appendTo: "#autocomp",
      multiple: true,
      mustMatch: false,
      source: function (request, response){
        autocompSugg = customFilter(options, request.term);
        response(autocompSugg);
      },
      select: function( event, ui ){
        if (ui.item != null){
          //Resets the replay button
          document.getElementById("replayButton").style.display = 'none';
          document.getElementById("replayButton").setAttribute("name", "");
          // document.getElementById('mySiGML').value = text;
          console.log("selected: " + ui.item.value);
          var text = checkText(ui.item.value);
          if (text == false){
           console.log("variable detected");
           variable = true;
          }
          else{
            document.getElementById("play").setAttribute("class", "btn btn-primary");
          }
        }
      }
    });
  
    //Forces the width of the autcomplete menu to fit the input field's width
    jQuery.ui.autocomplete.prototype._resizeMenu = function () {
      var ul = this.menu.element;
      ul.outerWidth(this.element.outerWidth());
    }
  });
  
  //Checks whether the input sentence contains a variable and needs additional input from the user
  function checkText(text,trainTypeValue=-1, platformInputValue=-1, timeInputValue=-1, waitOptionsValue=-1, interStationOptions1Value=-1,
    interStationOptions2Value=-1, interStationOptions3Value=-1, interStationOptions4Value=-1, endStationOptionsValue=-1,alert="alertMainTran"){
    
      // Makes all the variable boxes invisible
    elements = [...document.getElementsByClassName('varBox')];
    elements.forEach(function(element){
      element.style.display = 'none';
    });

    console.log('signlab lang= ', globalVar.lang);
    
    console.log("text: " + text);
    text = text.toString();
    var trainType = "*trainType*"
    var platformNr = "*platformNr*"
    var departTime = "*departTime*"
    var waitTime = "*waitTime*"
    var interStation = "*interStation*"
    var endStation = "*endStation*"

    trainTypeBox = document.getElementById('trainTypeBox');
    platformBox = document.getElementById('platformBox');
    departTimeBox = document.getElementById('departTimeBox');
    waitTimeBox = document.getElementById('waitTimeBox');
    interStationBox1 = document.getElementById('interStationBox1')
    interStationBox2 = document.getElementById('interStationBox2')
    interStationBox3 = document.getElementById('interStationBox3')
    interStationBox4 = document.getElementById('interStationBox4')
    endStationBox = document.getElementById('endStationBox')

    // If no value has been given for the variable: the appropiate box is shown to ask for input, else: replace the value within the text
    if(text.includes(trainType)){
      trainTypeBox.style.display = "block";
      trainTypeValue == -1 ? alertMessage("info", "Pick a train type to fill in the blank", alert) : text = text.replaceAll(trainType,trainTypeValue);
    }

    if(text.includes(platformNr)){
      platformBox.style.display = "block";
      if(platformInputValue == -1){
        alertMessage("info", "Pick a platform number to fill in the blank", alert);
      } else{
        text = text.replaceAll(platformNr,platformInputValue);
        console.log("platform text", text);
      }
    }

    if(text.includes(departTime)){
      departTimeBox.style.display = "block";
      if (timeInputValue == -1){
        alertMessage("info", "Pick a depart time to fill in the blank", alert);
      } else{
        value = adaptTime(timeInputValue);
        text = text.replace(departTime,timeInputValue);
      }
    }

    if(text.includes(waitTime)){
        waitTimeBox.style.display = "block";
      if (waitOptionsValue == -1){
        alertMessage("info", "Pick a wait time to fill in the blank", alert);
      } else{
        value = adaptTime(waitOptionsValue,"NL");
        text = text.replaceAll(waitTime,waitOptionsValue);
      }
    }

    if(text.includes(interStation)){
      interStationBox1.style.display = "block";
      interStationBox2.style.display = "block";
      interStationBox3.style.display = "block";
      interStationBox4.style.display = "block";
      
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
        text = text.replace(" and ", "");
      }
    }

    if(text.includes(endStation)){
      endStationBox.style.display = "block";
      endStationOptionsValue == -1 ? alertMessage("info", "Pick an end station to fill in the blank", alert) : text = text.replaceAll(endStation,endStationOptionsValue);
    }

    console.log("completed sentence: " + text);
    document.getElementById('mySiGML').value = text;
    document.getElementById("play").setAttribute("class", "btn btn-primary");

    // WERKT NOG NIET
    // if(!text.includes(trainType) && !text.includes(platformNr) && !text.includes(departTime) && !text.includes(waitTime) && !text.includes(interStation) && !text.includes(endStation)){
    //   console.log('in if');
    //   document.getElementById('mySiGML').value = "";
    // }
  }
  
  // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
  function toSiGML(text,alert="alertMainTran"){
    console.log("input: " + text);
    // Checks user input against the autcomplete suggestions and the variable sentences dict
    if (autocompSugg.includes(text) == false && varOptions.includes(text) == false){
      alertMessage("error", "Please choose an option from the autocomplete suggestions", alert);
    }
    else {
        // Checks the variable sentences dict for translation
        if (variable == true){
          entry = jsonVariable[text];
          variable = false;
        }
        // Checks regular sentences dict for translation
        else{
          entry = jsonSent[text];
        }
        // Alerts user if sentence has no corresponding translation
        if (entry == undefined) {
          alertMessage("info", "There is currently no translation available for this sentence.",alert);
        }
        // Sends sigml to avatar
        else{
          // entry = "zonmw/" + entry;
          playURL(entry);
          document.getElementById("replayButton").setAttribute("name", entry);
          document.getElementById("replayButton").style.display = 'inline-block';
          document.getElementById("play").setAttribute("class", "btn btn-primary no-click-button");
        }
    }
  }
  
  
  // Checks the input of the text field and removes variable boxes when it's empty
  document.getElementById('mySiGML').addEventListener('input', function() {
    if (document.getElementById('mySiGML').value.length < 1) {
      console.log("input field is empty");
      // Makes all the variable boxes invisible
      elements = [...document.getElementsByClassName('varBox')];
      elements.forEach(function(element) {
        console.log(element);
        element.style.display = 'none';
      })
      document.getElementById("play").setAttribute("class", "btn btn-primary no-click-button");
      document.getElementById("replayButton").style.display = 'none';
    }
  });