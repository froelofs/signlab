//Enables all tooltips in the document
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});


//Stores suggestions
function addSuggestion(text, alertID){
  showBusyState();
  $.ajax({
    url : '../suggestions.php',
    type : 'POST',
    data: {"input": text},
    dataType: "json",
    success: onSuccess,
    error: onError,
  });
  function onSuccess(result) {
    if (result.errorcode) {
      console.log('Error '+result.errorcode+' occured on the server. Error message: '+result.error);
      alertMessage("error", 'Oops, something went wrong', alertID);
    }
    else if (result.output == ""){
      console.log("This ouput is empty: " + result.error);
      alertMessage("error", 'Oops, something went wrong', alertID);
    }
    else{
     console.log(result.output);
     alertMessage("success", 'Thank you, your suggestion has been sent', alertID);
    }
    showBusyState(false);
  }
  function onError(xhr, error) {
    console.log ('Something went wrong. Error message: '+error + ", " + xhr.responseText);
    showBusyState(false);
    alertMessage("error", 'Oops, something went wrong', alertID);
  }
  function showBusyState(state) {
    $(document.body).toggleClass('busy', state===undefined?true:state);
  }
}

function startPose() {
  playText("<?xml version='1.0' encoding='UTF-8'?><sigml><hamgestural_sign gloss='STANDARD_POSE'><sign_manual both_hands='true' lr_symm='true'><handconfig extfidir='dl' /> <handconfig palmor='l' /><handconfig handshape='fist' thumbpos='across' /><location_bodyarm contact='touch' location='belowstomach' side='right_beside'><location_hand digits='1' /></location_bodyarm></sign_manual><sign_nonmanual></sign_nonmanual></hamgestural_sign></sigml>");
}

//Creates alerts
function alertMessage (type, text, parent){
  console.log(text);
  var msgClass = "";
  if (type == "success"){
    msgClass = "alert alert-success alert-dismissible";
  }
  else if (type == "info"){
    msgClass = "alert alert-info alert-dismissible";
  }
  else if (type == "error"){
    msgClass = "alert alert-danger alert-dismissible";
  }

  var alert = document.createElement("div");
  var a = document.createElement("a");
  a.setAttribute("href", "#");
  a.setAttribute("data-dismiss","alert");
  a.setAttribute("aria-label","close");
  a.setAttribute("class","close");
  a.innerHTML = '&times;';
  alert.appendChild(a);

  var textNode = document.createTextNode(text);
  alert.append(textNode);
  alert.setAttribute("class",msgClass);

  $("#" + parent).empty();
  var element = document.getElementById(parent);
  element.appendChild(alert);
}

$('.timepicker').timepicker({
    'default': 'now',
    showInputs: false,
    showMeridian: false,
    fromnow: 0,
    minuteStep: 5,
    autoclose: true,
  });


  function adaptTime(time,language="EN"){
    console.log("input time: " + time);

    time = time.split(":");
    hour = parseInt(time[0]);
    minutes = time[1];

    var partOfDay = new Date().getHours();

    // Rounds the minutes to the nearest option
    if (minutes.charAt(1) == "1" || minutes.charAt(1) == "2"){
     minutes = minutes.charAt(0) + "0";
    }
    else if (minutes.charAt(1) == "3" || minutes.charAt(1) == "4"){
     minutes = minutes.charAt(0) + "5";
    }

    var dayPart = "";

    //Translates the time according to the language the page is set to
    if (language == "EN"){
      if (minutes == "00"){
        return hour + " o'clock";
      }
      // Converts numbers to their written counterparts
      convert = {"05":"5 past","10":"10 past","15":"a quarter past","20":"20 past","25":"25 past","30":"half past","35":"25 to",
      "40":"20 to","45":"a quarter to","50":"10 to","55":"5 to"};

      if (parseInt(minutes) > 30){
       hour = hour + 1;
      }

      console.log(partOfDay - hour);
      console.log(hour - partOfDay);
      // Only adds the part of day if the difference between now and then is larger than 12 hours
      if ((partOfDay < 12 && (hour - partOfDay) > 12) || (partOfDay > 11 && (partOfDay - hour) > 0)){
        console.log("part of day necessary");
        // Adds the part of the day
        if(hour < 12){
          dayPart = " in the morning";
        }
        else if (hour > 17){
          dayPart = " in the evening";
        }
        else{
          dayPart = " in the afternoon";
        }
      }

      minutes = convert[minutes];
    }
    else if (language == "NL"){
      if (minutes == "00"){
        return hour + " uur";
      }
      // Converts numbers to their written counterparts
      convert = {"05":"5 over","10":"10 over","15":"kwart over","20":"10 voor half","25":"5 voor half","30":"half","35":"5 over half",
      "40":"10 over half","45":"kwart voor","50":"10 voor","55":"5 voor"};

      if (parseInt(minutes) > 25){
       hour = hour + 1;
      }

      // Only adds the part of day if the difference between now and then is larger than 12 hours
      if ((partOfDay - hour) > 12 || (hour - partOfDay) > 12){
        // Adds the part of the day
        if(hour < 12){
          dayPart = " 's ochtends";
        }
        else if (hour > 17){
          dayPart = " 's avonds";
        }
        else{
          dayPart = " 's middags";
        }
      }

      minutes = convert[minutes];
    }
   // Converts digital time to analog
   if (hour > 12){
    hour = hour - 12;
   }

   time = minutes + " " + hour.toString() + dayPart;
   console.log("output time: " + time);
   return time;
  }

  //navbar test
  $(function(){
    if (document.getElementById("About")) {
      $("#nav-placeholder").load("html/nav.html");
    } else {
      $("#nav-placeholder").load("nav.html");
    }
  });

  function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // if (tabName == 'Translate') {
    //   startPose();
    // }

    // Get current tab and hide it
    tabcontent = document.getElementsByClassName("fadeIn");
    for (i = 0; i < tabcontent.length; i++) {
      if (tabcontent[i].className.includes("undisplayed") == false){
       tabcontent[i].className += " undisplayed";
      }
    }

    // Get all elements with class="nav-link" and remove the class "active"
    tablinks = document.getElementsByClassName("nav-link");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    newTab = document.getElementById(tabName);
    newTab.className = newTab.className.replace(" undisplayed", "");
    evt.currentTarget.className += " active";
  }
