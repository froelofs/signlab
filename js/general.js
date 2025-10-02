//Enables all tooltips in the document
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  if (document.getElementById('Translator')) {
    startPose();
  }
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

$(function () {
  var bar = '';
  var hoverTimeout;

  bar += '<nav class="navbar navbar-shrink navbar-expand-lg navbar-light fixed-top" id="mainNav">';
  bar += '<div class="container-fluid" style="width: 83%; margin-top: 0px;">';
  bar += '<a class="navbar-brand" href="index.html">';
  bar += '<img src="images/Xbreed_logo_tr.png" height="25">';
  bar += '</a>';
  bar += '<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">';
  bar += '<i class="fas fa-bars"></i>';
  bar += ' Menu';
  bar += '</button>';
  bar += '<div class="collapse text-right navbar-collapse" style="margin-right:1%" id="navbarResponsive">';
  bar += '<ul class="navbar-nav ml-auto" role="tablist">';
  bar += '<li class="nav-item"><a class="nav-link" href="index.html" id="AboutNav">Welcome</a></li>';
  // Research dropdown
  bar += '<li class="nav-item dropdown">';
  bar += '<a class="nav-link dropdown-toggle" href="#" id="ResearchNav" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Research</a>';
  bar += '<div class="dropdown-menu" aria-labelledby="ResearchNav">';
  bar += '<a class="dropdown-item" href="research-overview.html" id="OverviewNav">Overview</a>';
  bar += '<a class="dropdown-item" href="research-methods.html" id="MethodsNav">New Methods</a>';
  bar += '<a class="dropdown-item" href="research-datasets.html" id="DatasetsNav">Datasets</a>';
  bar += '<a class="dropdown-item" href="research-theory.html" id="TheoryNav">Theory</a>';
  bar += '<a class="dropdown-item" href="research-applications.html" id="ApplicationsNav">Applications</a>';
  bar += '<a class="dropdown-item" href="research-publications.html" id="PublicationsNav">Publications</a>';
  bar += '<a class="dropdown-item" href="research-projects.html" id="ProjectsNav">Projects</a>';
  bar += '</div>';
  bar += '</li>';
  // bar += '<li class="nav-item"><a class="nav-link" href="news.html" id="NewsNav">News</a></li>';
  // Outreach dropdown
  bar += '<li class="nav-item dropdown">';
  bar += '<a class="nav-link dropdown-toggle" href="#" id="OutreachNav" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Outreach</a>';
  bar += '<div class="dropdown-menu" aria-labelledby="OutreachNav">';
  bar += '<a class="dropdown-item" href="outreach-events.html" id="EventsNav">Outreach Events</a>';
  bar += '<a class="dropdown-item" href="outreach-media.html" id="MediaNav">Media</a>';
  bar += '<a class="dropdown-item" href="outreach-signopsis.html" id="SignopsisNav">Signopsis</a>';
  bar += '</div>';
  bar += '</li>';
  bar += '<li class="nav-item"><a class="nav-link" href="people.html" id="PeopleNav">People</a></li>';
    // Nederlands dropdown
  bar += '<li class="nav-item dropdown">';
  bar += "<a class='nav-link dropdown-toggle' href='#' id='NederlandsNav' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Voor NGT'ers</a>";
  bar += '<div class="dropdown-menu" aria-labelledby="NederlandsNav">';
  bar += '<a class="dropdown-item" href="voor-ngt-evenementen.html" id="EvenementenNav">Doe mee!</a>';
  bar += '<a class="dropdown-item" href="voor-ngt-onderzoek.html" id="OnderzoekNav">Samenvattingen in NGT</a>';
  bar += '</div>';
  bar += '</li>';
  bar += '</ul>';
  bar += '</div>';
  bar += '</div>';
  bar += '</nav>';

  $("#nav-placeholder").html(bar);

  // Add hover functionality for dropdowns
$(".nav-item.dropdown").hover(
  function () {
    clearTimeout(hoverTimeout);

    // Close other open dropdowns
    $(".nav-item.dropdown").not(this).removeClass("show").find(".dropdown-menu").removeClass("show");

    // Open current dropdown
    $(this).addClass("show");
    $(this).find(".dropdown-menu").addClass("show");
  },
  function () {
    var that = $(this);
    hoverTimeout = setTimeout(function () {
        that.removeClass("show");
        that.find(".dropdown-menu").removeClass("show");
    }, 200);  // 200ms delay before hiding
  }
);

  // Highlight active page
  var id = getPage();
  console.log("navbar id", id);
  $("#" + id).addClass("active");
});

// Function to determine the active page
function getPage() {
    const allTabs = ['AboutNav', 'ResearchNav', 'PeopleNav', 'OutreachNav', 'NederlandsNav'];
    const sections = [
        'About',
        ['Overview', 'Methods', 'Datasets', 'Theory', 'Applications', 'Publications', 'Projects'], // Research dropdown sections
        'People',
        ['Events', 'Media', 'Signopsis'],
        ['Onderzoek', 'Evenementen']
    ];

    for (let j = 0; j < sections.length; j++) {
        if (Array.isArray(sections[j])) {
            // Check dropdown sections
            for (let k = 0; k < sections[j].length; k++) {
                if (document.getElementById(sections[j][k])) {
                    $("#" + allTabs[j]).addClass("active");
                    $("#" + sections[j][k] + "Nav").addClass("active");
                    return allTabs[j];
                }
            }
        } else if (document.getElementById(sections[j])) {
            return allTabs[j];
        }
    }
}

// Function to get the NavBar height for the sticky text
function adjustStickyOffset() {
  var navbarHeight = $('#mainNav').outerHeight();
  
  // Set CSS variable on <body> or root element
  document.documentElement.style.setProperty('--navbar-height', navbarHeight + 'px');
  
  // Alternatively, update top style on sticky elements directly
  $('.sticky-top').css('top', navbarHeight + 'px');
}

// Run on page load
$(document).ready(function(){
  adjustStickyOffset();
});

// Run on window resize to adapt to height changes
$(window).resize(function(){
  adjustStickyOffset();
});