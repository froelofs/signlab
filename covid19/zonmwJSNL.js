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
 url: "sentencesDictNL.json",
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
 url: "videoDictNL.json",
 global: false,
 success: function(data) {
  callbackVideo(data);
 },
 error: function(xhr, error){
  console.log(error);
 }
});

//Stores suggestions returned by autocomplete so user input can be checked against it
var autocompSugg = [];


// Defines the functions for autcomplete suggestions
$( function() {
  // Defines autocomplete suggestions when display by video is chosen
  // var videoOptions = ["Pijnschaal","Goedemorgen.","Goedemiddag.","Goedenavond.","Tot ziens.","Tot morgen.","Heeft u goed geslapen?","Welterusten.","Eet smakelijk.","Ik kom op een later moment terug.","Ik moet even weg.","Sorry, ik heb geen tijd.","Ik moet naar de WC.", "Moet U naar de WC?", "Kan ik U helpen?", "Ik ga u wassen.", "Ik ga u helpen met douchen.","U moet in de douche op de stoel zitten.", "Wilt U videobellen?", "Zal ik u helpen videobellen?", "Dit is de alarmknop, als u hier op drukt komt er iemand naar u toe.", "Wilt u een TV met teletekst zodat u de ondertiteling aan kunt zetten?", "Wat wilt u eten?", "Wat wilt u eten, kunt u het aanwijzen op de kaart?", "Wat wilt u drinken?", "Wat wilt u drinken, kunt u het aanwijzen op de kaart?", "Heeft u het koud?", "Heeft u het warm?", "Het bed gaat nu omhoog", "Het bed gaat nu omlaag", "Wie komt u ophalen?", "Ik help u", "Wij helpen u", "Bent u ergens allergisch voor?", "Waar bent u allergisch voor?", "Gebruikt u medicijnen?", "Welke medicijnen gebruikt u?", "Kunt u iemand (thuis) een foto laten maken van de medicijnen die u gebruikt?", "Rookt u?", "Bent u wel eens eerder in het ziekenhuis geweest?", "In welk ziekenhuis bent u geweest en met welke reden?", "Wanneer bent u naar het ziekenhuis geweest?", "Zijn er mensen in uw omgeving ziek?", "Welke apotheek komt u?", "Wat is uw geboortedatum?", "Wie is uw huisarts?", "Heeft u nog speciale dieetwensen? Zoals vegetarisch of veganistisch?", "Heeft u gehoorapparaten of een CI?", "Communicatie zonder tolk?", "Electrisch dossier", "Hoe gaat het met u?", "Hoe voelt u zich?", "Bent u verdrietig?", "Bent u boos?", "Ik vind het naar dat u boos bent", "Kunt u vertellen waarom u verdrietig bent?", "Kan ik iets voor u doen?", "Bent u ergens ongerust over? Zo ja, wat?", "Waar bent u ongerust over?", "Waar maakt u zich zorgen over?", "Bent u ergens bang voor?", "Ik en mijn collega's gaan zo goed mogelijk voor u zorgen.", "U mag alles vragen.", "Nog even volhouden, het wordt beter.", "Het komt goed.", "Het gaat langzaam, maar komt goed.", "Bent u duizelig?", "Bent u misselijk?", "Bent u moe?", "Afgelopen 24 uur klachten", "Huisgenoot klachten koorts/benauwdheid", "Afgelopen 7 dagen coronatest", "Huisgenoot klachten coronavirus", "Quarantaine", "Heeft u begrepen wat ik vertel?", "Heeft u begrepen wat er gaat gebeuren?", "Kunt u in eigen woorden vertellen wat we net besproken hebben?", "Kunt u vertellen waarom u dit wel wilt?", "Kunt u vertellen waarom u dit niet wilt?", "Wilt u meer informatie?", "Wilt u met iemand, een vriend of familie, videobellen om samen te overleggen?", "Is er iemand, een vriend of familie, waarvan u graag wilt dat ik die bel? Wat er aan de hand is", "Is er iemand, een vriend of familie, waarvan u graag wilt dat ik die bel? Om te vertellen hoe het gaat?", "Is er iemand, een vriend of familie, waarvan u graag wilt dat ik die bel? Om uit te leggen wat er gaat gebeuren?", "Heeft u een voorkeur tolk?", "Mag ik uw huisarts bellen? Zodat hij/zij meer medische informatie over u kunt vertellen", "Ik ga u een infuus geven.", "De arts gaat u een nieuw infuus geven.", "De verpleegkundige gaat u een nieuw infuus geven", "Een laborant komt bloedprikken", "Een co-assisent komt bloedprikken", "Een collega komt bloedprikken", "Sorry, het lukt mij niet het infuus te prikken.", "De bloeduitslagen zijn goed.", "De bloeduitslagen zijn niet helemaal goed", "De bloeduitslagen zijn niet goed.", "De uitslag van de CT scan is goed.", "De uitslag van de CT scan is niet helemaal goed.", "De rontgenfoto is verbeterd.", "De rontgenfoto is hetzelfde gebleven.", "De rontgenfoto is verslechterd.", "De COVID-19 test is negatief, dit betekent dat u waarschijnlijk geen Corona heeft.", "Soms heeft de test het fout dus we gaan nog meer onderzoek doen.", "De COVID-19 test is positief, dit betekent dat u wel Corona heeft.", "We gaan in het bloed testen of u antistoffen tegen Corona heeft, als u antistoffen heeft betekent dit dat u nu Corona heeft of dat u dit heeft gehad in het verleden.", "De Coronatest in het bloef is negatief, u heeft geen antistoffen tegen Corona.", "De Coronatest in het bloed is positief: u heeft wel antistoffen tegen Corona.", "Met dit recept kunt u medicijnen ophalen bij de apotheek.", "Met dit recept kan iemand anders medicijnen voor u ophalen bij de apotheek."];

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
    // source: options,
    appendTo: "#autocomp",
    multiple: true,
    mustMatch: false,
    source: function (request, response) {
      autocompSugg = customFilter(options, request.term);
      response(autocompSugg);
    },
  });

  //Forces the width of the autcomplete menu to fit the input field's width
  jQuery.ui.autocomplete.prototype._resizeMenu = function () {
  var ul = this.menu.element;
  ul.outerWidth(this.element.outerWidth());
  }
});

function checkText(text,value=-1){
  text = text.split(" ");
  if (text.includes("*aantal*") == true){
    // alertMessage("success","Minuten recognised!","alertZonMwTran");
    if (text.includes("minuten") == true){
      if (value == -1){
        document.getElementById('minutesBox').style.display = "block";
        alertMessage("info", "Kies een getal tussen 1 en 60 om het aantal minuten in te vullen", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("minuten","minuut");
          text = text.replace("*aantal*",value);
        }
        else{
         text = text.join(" ").replace("*aantal*",value);
        }
        document.getElementById('minutesBox').setAttribute("class","undisplayed");
      }
    }
    else if (text.includes("uur" == true)){
      if (value == -1){
        document.getElementById('hoursBox').style.display = "block";
        alertMessage("info", "Kies een getal tussen 0 en 73 om het aantal uren in te vullen", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("uren","uur");
          text = text.replace("*aantal*",value);
        }
        else{
         text = text.join(" ").replace("*aantal*",value);
        }
        document.getElementById('hoursBox').setAttribute("class","undisplayed");
      }
    }
    else if (text.includes("dagen" == true)){
      if (value == -1){
        document.getElementById('daysBox').style.display = "block";
        alertMessage("info", "Kies een getal tussen 0 en 21 om het aantal uren in te vullen", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("dagen","dag");
          text = text.replace("*aantal*",value);
        }
        else{
         text = text.join(" ").replace("*aantal*",value);
        }
        document.getElementById('daysBox').setAttribute("class","undisplayed");
      }
    }
    else if (text.includes("weken" == true)){
      if (value == -1){
        document.getElementById('weeksBox').style.display = "block";
        alertMessage("info", "Kies een getal tussen 0 en 12 om het aantal weken in te vullen", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("weken","week");
          text = text.replace("*aantal*",value);
        }
        else{
         text = text.join(" ").replace("*aantal*",value);
        }
        document.getElementById('weeksBox').setAttribute("class","undisplayed");
      }
    }
    else if (text.includes("maanden" == true)){
      if (value == -1){
        document.getElementById('monthsBox').style.display = "block";
        alertMessage("info", "Kies een getal tussen 0 en 12 om het aantal maanden in te vullen", "alertZonMwTran");
        return false;
      }
      else{
        if (value == 1){
          text = text.join(" ");
          text = text.replace("maanden","maand");
          text = text.replace("*aantal*",value);
        }
        else{
         text = text.join(" ").replace("*aantal*",value);
        }
        document.getElementById('monthsBox').setAttribute("class","undisplayed");
      }
    }
  }
  else if (text.includes("*tijdstip*")){
    alertMessage("success","Tijdstip recognised!","alertZonMwTran");
  }
  else{
    text = text.join(" ");
  }
  return text;
}

function startPose() {
  playText("<?xml version='1.0' encoding='UTF-8'?><sigml><hamgestural_sign gloss='STANDARD_POSE'><sign_manual both_hands='true' lr_symm='true'><handconfig extfidir='dl' /> <handconfig palmor='l' /><handconfig handshape='fist' thumbpos='across' /><location_bodyarm contact='touch' location='belowstomach' side='right_beside'><location_hand digits='1' /></location_bodyarm></sign_manual><sign_nonmanual><head_tier><head_movement movement='PB' size='small'/></head_tier></sign_nonmanual></hamgestural_sign></sigml>");
}

$(window).on("load", function(){
  checkToD();
  // setTimeout(startPose, 1000);
} );

// Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
function toSiGML(text,value=-1){
  if(autocompSugg.includes(text) == false){
    alertMessage("info", "Kies astublieft een optie van de gegeven suggesties", "alertZonMwTran");
  }
  else {
    text = checkText(text,value);
    if (text == false){
      return text;
    }
    else{
     // if avatar is checked, sigml is sent
     if (document.getElementById("avatarDisplay").checked) {
      console.log("text: " + text);
      entry = jsonSent[text];
      if (entry == undefined) {
        alertMessage("info", "Er is op het moment geen vertaling van deze zin, u kunt deze via de suggesties pagina aanvragen.", "alertZonMwTran");
      }
      else{
        playURL(entry);
      }
     }
     // if video is checked, source of embedded video changes
     else if (document.getElementById("videoDisplay").checked) {
      entry = jsonvideo[text];
      if (entry == undefined) {
        alertMessage("info", "Er is op het moment geen vertaling van deze zin, u kunt deze via de suggesties pagina aanvragen.", "alertZonMwTran");
      }
      else{
      changeVideo(entry);
      }
    }
   }
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
    options = videoOptions;
  }
}

function compare(input){
  var check = null;
  $.ajax({
   'global': false,
   'url': "check.json",
   'dataType': "json",
   'success': function(data) {
    check = data;

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
     alertMessage("error","Dit wachtwoord is fout","pwdAlert");
    }
   }
  });
}
