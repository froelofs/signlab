//changes the source of the embedded video
function changeVideo(url) {
    var frame=document.getElementById("videoHolder");
    var clone=frame.cloneNode(true);
    clone.setAttribute('src',url);
    frame.parentNode.replaceChild(clone,frame);
  }
  
  function startPose() {
    playText("<?xml version='1.0' encoding='UTF-8'?><sigml><hamgestural_sign gloss='STANDARD_POSE'><sign_manual both_hands='true' lr_symm='true'><handconfig extfidir='dl' /> <handconfig palmor='l' /><handconfig handshape='fist' thumbpos='across' /><location_bodyarm contact='touch' location='belowstomach' side='right_beside'><location_hand digits='1' /></location_bodyarm></sign_manual><sign_nonmanual></sign_nonmanual></hamgestural_sign></sigml>");
  }
 
  
  // Stores the default setting for autocomplete suggestions
  var options;
  //Stores the sigml translations corresponding to the suggestions
  var jsonSent;
  
  // Stores the necessities for autcomplete suggestions and the dict of sentences for the avatar
  function callbackSent(response) {
    jsonSent = response;
    options = Object.keys(jsonSent);
  }
  
  // Retrieves the dict of sentences with SiGML translations
  $.ajax({
   url: "json/NS_sentences_NL.json",
   success: function (data) {
    callbackSent(data);
   },
   error: function(xhr, error){
    console.log(error);
   }
  });
  
  //Stores the sigml translations corresponding to the completed variable sentences
  var jsonVariable;
  
  // Stores the dict of sentences with variables for the avatar
  function callbackVar(response) {
   jsonVariable = response;
   varOptions = Object.keys(jsonVariable);
  }
  
  // Retrieves the dict of sentences with variables for the avatar
  $.ajax({
   url: "json/variableDictNL.json",
   global: false,
   success: function(data) {
    callbackVar(data);
   },
   error: function(xhr, error){
    console.log(error);
   }
  });
  
  // Keeps track of whether the dict with sentences with variables needs to be called
  var variable = false;
  
  //Adapts the base video according to the time of day
  function checkToD() {
    var partofday = new Date().getHours();
    if (partofday < 12) {
        link = "https://www.youtube-nocookie.com/embed/gsFNU0RL8nI?rel=0&amp;showinfo=0&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=gsFNU0RL8nI";
      } else if (partofday < 18) {
        link = "https://www.youtube-nocookie.com/embed/XficFZU4PCY?rel=0&amp;showinfo=0&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=XficFZU4PCY";
      } else {
        link = "https://www.youtube-nocookie.com/embed/TYFSHlIdYxY?rel=0&amp;showinfo=0&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=TYFSHlIdYxY";
      }
    changeVideo(link);
  }
  
  $(window).on("load", function(){
    checkToD();
    // setTimeout(startPose, 1000);
  } );
  
  //Stores suggestions returned by autocomplete so user input can be checked against it
  var autocompSugg = [];
  
  // Defines the functions for autcomplete suggestions
  $( function() {
    // Defines the filter that searches the list of options for matches
    function customFilter(array, terms) {
      arrayOfTerms = terms.split(" ");
      punctuation = ["?",",",".",";",":","/"];
      arrayOfTerms.forEach(function (term) {
        if (punctuation.includes(term)) {
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
  function checkText(text,value=-1,alert="alertMainTran"){
    // Makes all the variable boxes invisible
    elements = [...document.getElementsByClassName('varBox')];
    elements.forEach(function(element){
      element.style.display = 'none';
    });
  
    // Removes "." for easier comparison
    text = text.replace(".","");
    text = text.split(" ");
    if (text.length > 2){
      text.push(".");
    }
    
    console.log(text);
    console.log("value: " + value);
    var treinType = "*treinType*"
    var spoorNr = "*spoorNr*"
    var vertrekTijd = "*vertrekTijd*"
    var tussenStation = "*tussenStation*"
    var eindStation = "*eindStation*"

    if (text.includes(treinType)){
      treinBox = document.getElementById('trainTypeBox');
      console.log("treintype detected");
      // If no value has been given for the variable the appropiate box is shown to ask for input
      if(value == -1){
        alertMessage("info", "Pick a train type to fill in the blank", alert);
        treinBox.style.display = "block";
        return false;
      }
      // Replaces the variable indicator with the value provided
      else{
        text = text.join(" ").replace(treinType,value);
        treinBox.style.display = "none";
      }
    }
    else if (text.includes(spoorNr)){
      platformBox = document.getElementById('platformBox');
      console.log("spoor detected");
      // If no value has been given for the variable the appropiate box is shown to ask for input
      if(value == -1){
        alertMessage("info", "Kies een spoor om in te vullen", alert);
        platformBox.style.display = "block";
        return false;
      }
      // Replaces the variable indicator with the value provided
      else{
        text = text.join(" ").replace(spoorNr,value);
        platformBox.style.display = "none";
      }
    }
    else if (text.includes(vertrekTijd)){
      departTimeBox = document.getElementById('departTimeBox')
      console.log("depart time detected");
      // If no value has been given for the variable the appropiate box is shown to ask for input
      if (value == -1){
        departTimeBox.style.display = "block";
        alertMessage("info", "Kies een tijdstip om in te vullen", alert);
        return false;
      }
      // Replaces the variable indicator with the value provided
      else{
        value = adaptTime(value,"NL");
        text = text.join(" ").replace(vertrekTijd,value);
        departTimeBox.style.display = "none";
      }
    }
    else if (text.includes(wachtTijd)){
      waitTimeBox = document.getElementById('waitTimeBox')
      console.log("wait time detected");
      // If no value has been given for the variable the appropiate box is shown to ask for input
      if (value == -1){
        waitTimeBox.style.display = "block";
        alertMessage("info", "Kies een wachttijd om in te vullen", alert);
        return false;
      }
      // Replaces the variable indicator with the value provided
      else{
        value = adaptTime(value,"NL");
        text = text.join(" ").replace(wachtTijd,value);
        waitTimeBox.style.display = "none";
      }
    }
    else if (text.includes(tussenStation)){
      interStationBox = document.getElementById('interStationBox')
      console.log("kies een station detected");
      // If no value has been given for the variable the appropiate box is shown to ask for input
      if(value == -1){
        alertMessage("info", "Kies een station om in te vullen", alert);
        interStationBox.style.display = "block";
        return false;
      }
      // Replaces the variable indicator with the value provided
      else{
        text = text.join(" ").replace(tussenStation,value);
        interStationBox.style.display = "none";
      }
    }
    
    else if (text.includes(eindStation)){
      endStationBox = document.getElementById('endStationBox')
      console.log("kies een station detected");
      // If no value has been given for the variable the appropiate box is shown to ask for input
      if(value == -1){
        alertMessage("info", "Pick an end station to fill in the blank", alert);
        endStationBox.style.display = "block";
        return false;
      }
      // Replaces the variable indicator with the value provided
      else{
        text = text.join(" ").replace(eindStation,value);
        endStationBox.style.display = "none";
      }
    }
    else{
      text = text.join(" ");
    }
    text = text.replace(" .",".");
    console.log("completed sentence: " + text);
    document.getElementById('mySiGML').value = text;
    document.getElementById("play").setAttribute("class", "btn btn-primary");
  }
  
  // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
  function toSiGML(text,alert="alertMainTran"){
    console.log("input: " + text);
    // Checks user input against the autcomplete suggestions and the variable sentences dict
    if(autocompSugg.includes(text) == false && varOptions.includes(text) == false){
      alertMessage("info", "Kies alstublieft een van de gegeven suggesties", alert);
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
          alertMessage("info", "Er is op het moment geen vertaling van deze zin.", alert);
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