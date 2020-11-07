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

// function fadeTab(id){
//   tablinks = document.getElementsByClassName("tabFade");
//   for (i = 0; i < tablinks.length; i++) {
//   	console.log(tablinks[i].className);
//     tablinks[i].className = tablinks[i].className.replace(" fadeIn", " undisplayed");
//   }

//   document.getElementById(id).className.replace(" undisplayed", " fadeIn");
//   console.log(document.getElementById(id).className);
// }

// $('a[class="nav-link tabFade"]').on('show.bs.tab', function (e) {
// 	linkCurrentTab = document.getElementsByClassName("nav-link tabFade active")[0];
// 	nextTab = e.target;
// 	relatedHref = linkCurrentTab + "";
// 	document.getElementById(relatedHref.split("#")[1]).className.replace(" fadeIn", "");
// 	targetHref = nextTab.href.split("#")[1];
//     document.getElementById(targetHref).className += "fadeIn";
//  });


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
