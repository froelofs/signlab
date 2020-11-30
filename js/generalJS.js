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
    showMeridian: false
  });
