//Enables all tooltips in the document
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});


//Stores suggestions
function addSuggestion(text){
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
    showBusyState(false);
  }
  function onError(xhr, error) {
    console.log ('Something went wrong. Error message: '+error);
    showBusyState(false);
  }
  function showBusyState(state) {
    $(document.body).toggleClass('busy', state===undefined?true:state);
  }
}

// $("#mySiGML").keypress(function(event) {
//     if (event.which == 13) {
//       event.preventDefault();
//       callPython(document.getElementById("mySiGML").value);
//     }
// });

$("#suggestions").keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      addSuggestion(document.getElementById("suggestions").value);
    }
});