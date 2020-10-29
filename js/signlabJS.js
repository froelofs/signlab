var flag = "";

//Adapts the page to the chosen option
function changeFunc(myRadio) {
  if (myRadio.value == "fingerspell") {
    document.getElementById("avatar").setAttribute("class", "CWASAAvatar av0");
    document.getElementById("explanation").setAttribute("class", "undisplayed");
    document.getElementById("explText").setAttribute("class", "undisplayed");
    document.getElementById("speedAdj").setAttribute("class", "CWASASpeed av0");
    document.getElementById("outputGloss").setAttribute("class", "txtGloss av0");
    document.getElementById("glossLabel").style.display = 'inline-block';
    document.getElementById("speedLabel").style.display = 'inline-block';
    document.getElementById("stopButton").setAttribute("class", "btn btn-primary displayed");
    document.getElementById("replayButton").setAttribute("class", "btn btn-primary undisplayed");
    document.getElementById("translation").setAttribute("class", "inputBox");
    document.getElementById("tranLabel").style.display = 'inline-block';
    flag = "spell";
  }
  else if (myRadio.value == "freestyle") {
    document.getElementById("avatar").setAttribute("class", "CWASAAvatar av0");
    document.getElementById("explanation").setAttribute("class", "undisplayed");
    document.getElementById("explText").setAttribute("class", "undisplayed");
    document.getElementById("speedAdj").setAttribute("class", "CWASASpeed av0");
    document.getElementById("outputGloss").setAttribute("class", "txtGloss av0");
    document.getElementById("glossLabel").style.display = 'inline-block';
    document.getElementById("speedLabel").style.display = 'inline-block';
    document.getElementById("stopButton").setAttribute("class", "btn btn-primary displayed");
    document.getElementById("replayButton").setAttribute("class", "btn btn-primary undisplayed");
    document.getElementById("translation").setAttribute("class", "inputBox");
    document.getElementById("tranLabel").style.display = 'inline-block';
    flag = "";
  }
  else if (myRadio.value == "explain") {
    document.getElementById("avatar").setAttribute("class", "undisplayed");
    document.getElementById("explanation").setAttribute("class", "explSpan");
    document.getElementById("explText").setAttribute("class", "explSiGML");
    document.getElementById("speedAdj").setAttribute("class", "undisplayed");
    document.getElementById("outputGloss").setAttribute("class", "undisplayed");
    document.getElementById("glossLabel").style.display = 'none';
    document.getElementById("speedLabel").style.display = 'none';
    document.getElementById("stopButton").setAttribute("class", "btn btn-primary undisplayed");
    document.getElementById("replayButton").setAttribute("class", "btn btn-primary undisplayed");
    document.getElementById("translation").style.display = 'none';
    document.getElementById("tranLabel").style.display = 'none';
    flag = "explain";
  }
}

///Makes an ajax call to the python script (by way of a php wrapper)
function callPython(text) {
  showBusyState();
  //Adds a flag to the input if applicable
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
    } else {
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
          document.getElementById("translation").value = output[1];
          playText(output[2].trim());
          document.getElementById("replayButton").setAttribute("name", output[2].trim());
          document.getElementById("replayButton").setAttribute("class", "btn btn-primary");
        }
      }
      else{
        alert(output);
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