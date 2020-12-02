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
    success : onSuccess,
    error : onError,
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
    console.log ('Something went wrong. Error message: '+error);
    showBusyState(false);
    alertMessage("error", 'Oops, something went wrong', alertID); 
  }
  function showBusyState(state) {
    $(document.body).toggleClass('busy', state===undefined?true:state);
  }
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
    use24hours: true,
    format: 'HH:mm',
    showMeridian: false,
    fromnow: 0,
    minuteStep: 5,
    autoclose: true
  });

  function adaptTime(time,language="NL"){
    time = time.split(":");
    hour = parseInt(time[0]);
    minutes = time[1];

    if (hour > 12){
     hour = hour - 12;
     if (hour == 0){
      hour = 12;
     }
    }

    hour = hour.toString();
      
    // Rounds the minutes to the nearest option
    if (minutes.charAt(1) == "1" || minutes.charAt(1) == "2"){
     minutes = minutes.charAt(0) + "0";
    }
    else if (minutes.charAt(1) == "3" || minutes.charAt(1) == "4"){
     minutes = minutes.charAt(0) + "5";
    }

    //Translates the time according to the language the page is set to
    if (language == "EN"){
      convert = {"05":"5 past","10":"10 past","15":"quarter past","20":"20 past","25":"25 past","30":"half past","35":"25 to",
      "40":"20 to","45":"quarter to","50":"10 to","55":"5 to"};

      if (parseInt(minutes) > 30){
       hour = parseInt(hour) + 1;
      }
      
      minutes = convert[minutes];
    } 
    else if (language == "NL"){
      convert = {"05":"5 over","10":"10 over","15":"kwart over","20":"10 voor half","25":"5 voor half","30":"half","35":"5 over half",
      "40":"10 over half","45":"kwart voor","50":"10 voor","55":"5 voor"};

      if (parseInt(minutes) > 25){
       hour = parseInt(hour) + 1;
      }
      
      minutes = convert[minutes];
    }
   time = minutes + " " + hour; 
   return time;
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
  console.log("data: ", check);
  
  for (key in check){
   if(input == check[key]){
    check = true;
    break;
   }
  }
  console.log("check: ", check);
  console.log("input: ", input);

  if (check == true){
   document.getElementById("checkPage").style.display = "none";
  }
  else{
   alertMessage("error","The password you have entered is incorrect","pwdAlert");
  }
}

// $(function(){

//  var a = document.createElement("div");
//  a.setAttribute("id","pwdAlert");
//  a.style.textAlign = "center";
//  a.style.zIndex = "50";
//  a.style.position = "fixed";

//  var filler = document.createElement("div");
//  filler.setAttribute("id","checkPage");
//  filler.style.width = "100%";
//  filler.style.height = "100%"; 
//  filler.style.position = "fixed";
//  filler.style.zIndex = "40";
//  filler.style.backgroundColor = "#006666";
//  filler.style.textAlign = "center";
//  filler.style.display = "block";

//  var s = document.createElement("span");
//  s.style.textAlign = "center";

//  var l = document.createElement("label");
//  l.setAttribute("for","pwd");
//  l.style.display = "inline-block";
//  l.innerHTML = "password: ";

//  var field = document.createElement("input");
//  field.setAttribute("type","password");
//  field.setAttribute("id","pwd");
//  field.style.display = "inline-block";

//  var button = document.createElement("input");
//  button.setAttribute("type","submit");
//  button.setAttribute("onclick","compare(field.value);");
//  button.style.display = "inline-block";

//  s.append(l);
//  s.append(field);
//  s.append(button);
//  filler.append(s);

//  $("body").prepend(a,filler);
// });
