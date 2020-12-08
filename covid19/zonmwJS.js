//changes the source of the embedded video
function changeVideo(url) {
  var frame=document.getElementById("videoHolder");
  var clone=frame.cloneNode(true);
  clone.setAttribute('src',url);
  frame.parentNode.replaceChild(clone,frame);
}

var jsonSent;
var sentOptions;

// Stores the necessities for autcomplete suggestions and the dict of sentences for the avatar
function callbackSent(response) {
  jsonSent = response;
  sentOptions = Object.keys(jsonSent);
}

// Retrieves the dict of sentences with SiGML translations
$.ajax({
 url: "sentencesDictEN.json",
 success: function (data) {
  callbackSent(data);
 },
 error: function(xhr, error){
  console.log(error);
 }
});

// Stores the default setting for autocomplete suggestions
var options;

var jsonVideo;
var videoOptions;

// Stores the necessities for autcomplete suggestions and the dict of sentences for video
function callbackVideo(response) {
 jsonVideo = response;
 videoOptions = Object.keys(jsonVideo);
 options = videoOptions;
}

// Retrieves the dict of sentences with video links
$.ajax({
 url: "videoDictEN.json",
 global: false,
 success: function(data) {
  callbackVideo(data);
 },
 error: function(xhr, error){
  console.log(error);
 }
});

var jsonVariable;

// Stores the dict of sentences with variables for the avatar
function callbackVar(response) {
 jsonVariable = response;
}

// Retrieves the dict of sentences with variables for the avatar
$.ajax({
 url: "variableDictEN.json",
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


function startPose() {
  playText("<?xml version='1.0' encoding='UTF-8'?><sigml><hamgestural_sign gloss='STANDARD_POSE'><sign_manual both_hands='true' lr_symm='true'><handconfig extfidir='dl' /> <handconfig palmor='l' /><handconfig handshape='fist' thumbpos='across' /><location_bodyarm contact='touch' location='belowstomach' side='right_beside'><location_hand digits='1' /></location_bodyarm></sign_manual><sign_nonmanual><head_tier><head_movement movement='PB' size='small'/></head_tier></sign_nonmanual></hamgestural_sign></sigml>");
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
  $( "#mySiGML" ).autocomplete({
    appendTo: "#autocomp",
    multiple: true,
    mustMatch: false,
    source: function (request, response) {
      autocompSugg = customFilter(options, request.term);
      response(autocompSugg);
    },
    change: function( event, ui ) {
      console.log("You selected: " + ui.item.value);
      var text = checkText(ui.item.value);
      if (text == false){
       variable = true;
      }
      else{
        document.getElementById('mySiGML').value = text;
      }
    }
  });

  // $('#tags').on('autocompleteselect', function (e, ui) {

  //       $('#tagsname').html('You selected: ' + ui.item.value);
  //   });

  // $('#mySiGML').on('autocompletechange change', function () {
  //   $('#tagsname').html('You selected: ' + this.value);
  // }).change();

  //Forces the width of the autcomplete menu to fit the input field's width
  jQuery.ui.autocomplete.prototype._resizeMenu = function () {
  var ul = this.menu.element;
  ul.outerWidth(this.element.outerWidth());
  }
});

function checkText(text,value=-1){
  text = text.replace(".","");
  text = text.split(" ");
  if (text.length > 1){
    text.push(".");
  }
  console.log(text);
  console.log("value: " + value);
  if (text.includes("*amount*") == true){
    console.log("amount detected");
    if (text.includes("minutes") == true){
      console.log("minutes detected");
      if (value == -1){
        document.getElementById('minutesBox').style.display = "block";
        alertMessage("info", "Please choose a number between 1 and 60 to fill in the blank", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("minutes","minute");
          text = text.replace("*amount*",value);
        }
        else{
         text = text.join(" ").replace("*amount*",value);
        }
      document.getElementById('minutesBox').style.display = "none";
      }
    }
    else if (text.includes("hours") == true){
      console.log("hours detected");
      if (value == -1){
        document.getElementById('hoursBox').style.display = "block";
        alertMessage("info", "Please choose a number between 0 and 73 to fill in the blank", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("hours","hour");
          text = text.replace("*amount*",value);
        }
        else{
         text = text.join(" ").replace("*amount*",value);
        }
        if (text.split(" ").includes("*amount*") == true){
          alertMessage("info", "Please choose another number between 0 and 73 to fill in the second blank", "alertZonMwTran");
          return false;
        }
        else{
        document.getElementById('hoursBox').style.display = "none";
        }
      }
    }
    else if (text.includes("days") == true){
      console.log("days detected");
      if (value == -1){
        document.getElementById('daysBox').style.display = "block";
        alertMessage("info", "Please choose a number between 0 and 15 to fill in the blank", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("days","day");
          text = text.replace("*amount*",value);
        }
        else{
         text = text.join(" ").replace("*amount*",value);
        }
        document.getElementById('daysBox').style.display = "none";
      }
    }
    else if (text.includes("weeks") == true){
      console.log("weeks detected");
      if (value == -1){
        document.getElementById('weeksBox').style.display = "block";
        alertMessage("info", "Please choose a number between 0 and 11 to fill in the blank", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("weeks","week");
          text = text.replace("*amount*",value);
        }
        else{
         text = text.join(" ").replace("*amount*",value);
        }
        document.getElementById('weeksBox').style.display = "none";
      }
    }
    else if (text.includes("months") == true){
      console.log("months detected");
      if (value == -1){
        document.getElementById('monthsBox').style.display = "block";
        alertMessage("info", "Please choose a number between 0 and 19 to fill in the blank", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("months","month");
          text = text.replace("*amount*",value);
        }
        else{
         text = text.join(" ").replace("*amount*",value);
        }
        document.getElementById('monthsBox').style.display = "none";
      }
    }
    else if (text.includes("a week")){
      console.log("a week detected");
      if (value == -1){
        document.getElementById('aWeekBox').style.display = "block";
        alertMessage("info", "Please choose a number between 0 and 8 to fill in the blank", "alertZonMwTran");
        return false;
      }
      else{
        convert = {"1":"once","2":"twice","3": "three times","4":"four times","5":"fives times","6":"six times","7":"seven times"};
        text.join(" ").replace("*amount*",convert[value]);
      }
    }
  }
  else if (text.includes("*time*") == true){
    console.log("time detected");
    if (value == -1){
      document.getElementById('timeBox').style.display = "block";
      alertMessage("info", "Please choose a time to fill in the blank", "alertZonMwTran");
      return false;
    }
    else{
      value = adaptTime(value);
      text = text.join(" ").replace("*time*",value);
      document.getElementById('timeBox').style.display = "none";
    }
  }
  else if (text.includes("*day*")){
    console.log("pick a day detected");
    if(value == -1){
      alertMessage("info", "Please choose a day of the week to fill in the blank", "alertZonMwTran");
      document.getElementById('dayOfTheWeekBox').style.display = "block";
      return false;
    }
    else{
      text = text.join(" ").replace("*day*",value);
      document.getElementById('dayOfTheWeekBox').style.display = "none";
    } 
  }
  else{
    text = text.join(" ");
  }
  text = text.replace(" .",".");
  console.log("reached this return: " + text);
  toSiGML(text);
}

// Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
function toSiGML(text,value=-1){
  // Checks user input against autcomplete suggestions
  if(autocompSugg.includes(text) == false){
    alertMessage("error", "Please choose an option from the autocomplete suggestions", "alertZonMwTran");
  }
  else {
    // text = checkText(text,value);
    // console.log("outcome: " + text);
    // if (text == false){
    //   variable = true;
    //   return text;
    // }
    // else{
     // if avatar is checked, SiGML is sent
     if (document.getElementById("avatarDisplay").checked) {
      document.getElementById('mySiGML').value = text;
      if (variable == true){
        entry = jsonVariable[text];
      }
      else{
        variable = false;
        entry = jsonSent[text];
      }
      if (entry == undefined) {
        alertMessage("info", "There is currently no translation available for this sentence, but you can send it to us via the suggestions box on this page", "alertZonMwTran");
      }
      else{
        playURL(entry);
        document.getElementById("replayButton").setAttribute("name", entry);
        document.getElementById("replayButton").style.display = 'inline-block';
      }
     }
     // if video is checked, source of embedded video changes
     else if (document.getElementById("videoDisplay").checked) {
      entry = jsonVideo[text];
      if (entry == undefined) {
        alertMessage("info", "There is currently no translation available for this sentence, but you can send it to us via the suggestions box on this page", "alertZonMwTran");
      }
      else{
      changeVideo(entry);
      }
    }
   // }
  }
}


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


//Adapts the page to the chosen option
function changeFunc(myRadio) {
  if (myRadio.value == "avatar") {
    // document.getElementById("avatar").setAttribute("class", "CWASAAvatar av0");
    document.getElementById("avatar").style.display = 'inline-block';
    document.getElementById("videos").setAttribute("class", "undisplayed");
    document.getElementById("play").setAttribute("class", "btn btn-primary displayed");
    document.getElementById("speedAdj").setAttribute("class", "CWASASpeed av0");
    document.getElementById("outputGloss").setAttribute("class", "txtGloss av0");
    document.getElementById("glossLabel").style.display = 'inline-block';
    document.getElementById("speedLabel").style.display = 'inline-block';
    document.getElementById("replayButton").style.display = 'none';
    options = sentOptions;
  }
  else if (myRadio.value == "video") {
    // document.getElementById("avatar").setAttribute("class", "undisplayed");
    document.getElementById("avatar").style.display = 'none';
    document.getElementById("videos").setAttribute("class", "prerecorded");
    document.getElementById("play").setAttribute("class", "btn btn-primary displayed");
    document.getElementById("speedAdj").setAttribute("class", "undisplayed");
    document.getElementById("outputGloss").setAttribute("class", "undisplayed");
    document.getElementById("glossLabel").style.display = 'none';
    document.getElementById("speedLabel").style.display = 'none';
    document.getElementById("replayButton").style.display = 'none';
    options = videoOptions;
  }
}

function compare(input){
  var check = null;
  $.ajax({
   'async': false,
   'global': false,
   'url': "check.json",
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
