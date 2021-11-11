function startPose() {
  playText("<?xml version='1.0' encoding='UTF-8'?><sigml><hamgestural_sign gloss='STANDARD_POSE'><sign_manual both_hands='true' lr_symm='true'><handconfig extfidir='dl' /> <handconfig palmor='l' /><handconfig handshape='fist' thumbpos='across' /><location_bodyarm contact='touch' location='belowstomach' side='right_beside'><location_hand digits='1' /></location_bodyarm></sign_manual><sign_nonmanual></sign_nonmanual></hamgestural_sign></sigml>");
} 
  
  /**
   * // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
   * @param {*} text 
   * @param {*} alert 
   */
  function toSiGML(text, alert="alertMainTran"){
    console.log('text ', text);
    text = text.replaceAll("-", "");
    text = text.replaceAll(/interStation\d{1}/g, "");
    text = text.replaceAll(/\d{1}[A-Za-z]/g, " ");
    text = text.replaceAll(/\,/g, " ");
    text = text.replaceAll(/\'/g, "");
    
    if ((globalVar.interStation1 === "-" || globalVar.interStation1 === "interStation1") && (globalVar.interStation2 === "-" || globalVar.interStation2 === "interStation2") && (globalVar.interStation3 === "-" || globalVar.interStation3 === "interStation3") && (globalVar.interStation4 === "-" || globalVar.interStation4 === "interStation4")){
      text = text.replace(/and/, "");
    }

    document.getElementById('currSentence').innerHTML = '<b>' + text + '</b>';
    
    console.log("input: " + text);
    // Checks regular sentences dict for translation
        entry = document.querySelector('button[data-id="sentenceOptions"]').title;
        
        if (entry == undefined) {
          if(globalVar.lang=="Nederlands"){
            alertMessage("info", "Er is momenteel geen vertaling beschikbaar voor deze zin.", alert);
          } else {
            alertMessage("info", "There is currently no translation available for this sentence.", alert);
          }
        } else {
          $.getJSON(globalVar.urlName, function(json) {
            sigml = json[entry];
            // Send sigml to avatar
            playURL(sigml);
            document.getElementById("replayButton").setAttribute("name", sigml);
            document.getElementById("replayButton").style.display = 'inline-block';
            document.getElementById("play").setAttribute("class", "btn btn-primary no-click-button");
          });
        }
    }
  
  