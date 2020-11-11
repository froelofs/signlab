//Enables all tooltips in the document
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});


//Stores suggestions
function addSuggestion(text){
  showBusyState();
  $.ajax({
    url : 'suggestions.php',
    type : 'POST',
    data: {"input": text},
    dataType: "json",
    success : onSuccess,
    error : onError,
  });
  function onSuccess(result) {
    if (result.errorcode) {
      console.log('Error '+result.errorcode+' occured on the server. Error message: '+result.error);
    } 
    else{
    console.log(result.output);
    showBusyState(false);
    }
  }
  function onError(xhr, error) {
    console.log ('Something went wrong. Error message: '+error);
    alertMessage(error, 'Something went wrong. Error message: '+ error, "suggestions");
    showBusyState(false);
  }
  function showBusyState(state) {
    $(document.body).toggleClass('busy', state===undefined?true:state);
  }
}

function alertMessage (type, text, parent){
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
  a.appendChild(document.createTextNode("&times;"));
  alert.appendChild(a);
  var textNode = document.createTextNode(text);
  alert.appendChild(textNode);
  alert.setAttribute("class",msgClass);
  
  // var element = document.getElementById(parent);
  // element.appendChild(alert);

  document.body.appendChild(alert);


  // <div class="alert alert-success alert-dismissible">
  //   <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
  //   <strong>Success!</strong> This alert box could indicate a successful or positive action.
  // </div>
}
