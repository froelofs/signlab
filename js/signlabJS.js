var flag = "";

//Adapts the page to the chosen option
function changeFunc(myRadio) {
  if (myRadio.value == "fingerspell") {
  	document.getElementById("replayButton").setAttribute("class", "btn btn-primary undisplayed");
    flag = "spell";
  }
  else if (myRadio.value == "freestyle") {
  	document.getElementById("replayButton").setAttribute("class", "btn btn-primary undisplayed");
    flag = "";
  }
  else if (myRadio.value == "explain") {
    document.getElementById("avatarTut").setAttribute("class", "undisplayed");
    document.getElementById("speedAdjTut").setAttribute("class", "undisplayed");
    document.getElementById("outputGlossTut").setAttribute("class", "undisplayed");
    document.getElementById("glossLabelTut").style.display = 'none';
    document.getElementById("speedLabelTut").style.display = 'none';
    document.getElementById("stopButtonTut").setAttribute("class", "btn btn-primary undisplayed");
    document.getElementById("replayButtonTut").setAttribute("class", "btn btn-primary undisplayed");
    flag = "explain";
  }
  else if (myRadio.value == "explAva") {
    document.getElementById("avatarTut").setAttribute("class", "CWASAAvatar av0");
    document.getElementById("speedAdjTut").setAttribute("class", "CWASASpeed av0");
    document.getElementById("outputGlossTut").setAttribute("class", "txtGloss av0");
    document.getElementById("glossLabelTut").style.display = 'inline-block';
    document.getElementById("speedLabelTut").style.display = 'inline-block';
    document.getElementById("stopButtonTut").setAttribute("class", "btn btn-primary displayed");
    document.getElementById("replayButtonTut").setAttribute("class", "btn btn-primary undisplayed");
    flag = "explain,";
  }
}

///Makes an ajax call to the python script (by way of a php wrapper)
function callPython(text) {
  showBusyState();
  //Adds a flag to the input if applicable
  flags = flag.split(",");
  flag = flags[0];
  if (flag != ""){
    inputPython = flag + " " + text;
  }
  else{
    inputPython = text;
  }
  $.ajax({
    url : 'pythonCall.php',
    type : 'POST',
    data: {"input": inputPython},
    dataType: "json",
    success : onSuccess,
    error : onError,
  });
  function onSuccess(result) {
    if (result.errorcode) {
      console.log('Error '+result.errorcode+' occured on the server. Error message: '+result.error);
    } 
    else {
      output = result.output.split(";");
      if (output[0].slice(0,5) == "HamNo" || output[0].trim() == text){
        if (flag == "explain"){
          parent = document.querySelector('#explText');
          console.log(output);
          //Ensures newlines and tabs in output are displayed in div
          var pre = document.createElement("pre");
          pre.appendChild(document.createTextNode(output));
          if (parent.childNodes.length != 0) {
            parent.removeChild(parent.childNodes[0])    
          }
          parent.append(pre);
        }
        else{
          console.log(output[1]);
          console.log(output[2]);
          document.getElementById("translationTut").value = output[1];
          playText(output[2].trim());
          document.getElementById("replayButtonTut").setAttribute("name", output[2].trim());
          document.getElementById("replayButtonTut").setAttribute("class", "btn btn-primary");
        }
      }
      else{
        alert(output);
      }
      if (flags.length == 2){
      	flag = flags[1];
      	callPython(text);
      }  
    }
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

//Handles the tabs
// function openTab(evt, tabName) {
//   // Declare all variables
//   var i, tabcontent, tablinks;

//   // Get all elements with class="tabcontent" and hide them
//   tabcontent = document.getElementsByClassName("tabcontent");
//   for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[i].style.display = "none";
//   }

//   // Get all elements with class="tablinks" and remove the class "active"
//   tablinks = document.getElementsByClassName("tablinks");
//   for (i = 0; i < tablinks.length; i++) {
//     tablinks[i].className = tablinks[i].className.replace(" active", "");
//   }

//   // Show the current tab, and add an "active" class to the button that opened the tab
//   document.getElementById(tabName).style.display = "block";
//   evt.currentTarget.className += " active";
// }

// function fadeTab(id){
//   tablinks = document.getElementsByClassName("tabFade");
//   for (i = 0; i < tablinks.length; i++) {
//   	console.log(tablinks[i].className);
//     tablinks[i].className = tablinks[i].className.replace(" fadeIn", " undisplayed");
//   }

//   document.getElementById(id).className.replace(" undisplayed", " fadeIn");
//   console.log(document.getElementById(id).className);
// }

$('a[class="nav-link tabFade"]').on('show.bs.tab', function (e) {
	targetHref = e.target.href.split("#")[1];
	// relatedHref = e.relatedTarget.href.split("#")[1];
	var relatedHref = $(event.relatedTarget).attr('href');
	console.log(targetHref);
    document.getElementById(targetHref).className.replace(" undisplayed", "");
    getElementById(relatedHref).className += "undisplayed";
    alert("Done");
});


// $('a[class="nav-link tabFade"]').on('shown.bs.tab', function (e) {
// 	alert("The function works!")
// 	alert(e);
// 	targetHref = e.target.href;
// 	relatedHref = e.relatedTarget.href;
// 	alert(targetHref);
//     getElementById(targetHref.substring(1)).replace(" undisplayed", "");
//     getElementById(relatedHref.substring(1)).className += "undisplayed";
//     alert("Done");
// });