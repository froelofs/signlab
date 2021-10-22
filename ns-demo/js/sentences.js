
function startPose() {
  playText("<?xml version='1.0' encoding='UTF-8'?><sigml><hamgestural_sign gloss='STANDARD_POSE'><sign_manual both_hands='true' lr_symm='true'><handconfig extfidir='dl' /> <handconfig palmor='l' /><handconfig handshape='fist' thumbpos='across' /><location_bodyarm contact='touch' location='belowstomach' side='right_beside'><location_hand digits='1' /></location_bodyarm></sign_manual><sign_nonmanual></sign_nonmanual></hamgestural_sign></sigml>");
}
  
  /**
   * Defines the functions for autcomplete suggestions
  */
  // $( function() {
  //   // Defines the filter that searches the list of options for matches
  //   function customFilter(array, terms) {
  //     array = colorArray(array);
  //     arrayOfTerms = terms.split(" ");
  //     punctuation = ["?",",",".",";",":","/"];
  //     arrayOfTerms.forEach(function (term) {
  //       if(punctuation.includes(term)) {
  //         var matcher = new RegExp("\\" + term, "i");
  //       }
  //       else{
  //         var matcher = new RegExp(term, "i");
  //       }
  //       array = $.grep(array, function (value) {
  //         console.log('val', value);
  //        return matcher.test(value.label || value.value || value);
  //       });
        
  //     });
      
  //     return array;
  //   }
  
    /**
     * Activates the jquery autocomplete function when the user gives input
     */
  //   $("#mySiGML").autocomplete({
  //     appendTo: "#autocomp",
  //     multiple: true,
  //     mustMatch: false,
  //     source: function (request, response){
  //       autocompSugg = customFilter(options, request.term);
  //       response(autocompSugg);
  //     },
  //     select: function( event, ui ){
  //       if (ui.item != null){
  //         //Resets the replay button
  //         document.getElementById("replayButton").style.display = 'none';
  //         document.getElementById("replayButton").setAttribute("name", "");
  //         console.log("selected: " + ui.item.value);
  //         var text = checkText(ui.item.value);
  //         console.log('textvar:', text);
  //         if (text == false){
  //          console.log("variable detected");
  //          variable = true;
  //         }
  //         else{
  //           document.getElementById("play").setAttribute("class", "btn btn-primary");
  //         }
  //       }
  //     }
  //   });
  
  //   //Forces the width of the autcomplete menu to fit the input field's width
  //   jQuery.ui.autocomplete.prototype._resizeMenu = function () {
  //     var ul = this.menu.element;
  //     ul.outerWidth(this.element.outerWidth());
  //   }
  // });


  
  /**
   * // Checks the dictionary for an entry that matches 'text' and sends the SiGML code to the avatar
   * @param {*} text 
   * @param {*} alert 
   */
  function toSiGML(text,alert="alertMainTran"){
    console.log("input: " + text);
      // Checks the variable sentences dict for translation
      if (variable == true){
        entry = jsonVariable[text];
        variable = false;
      }
      // Checks regular sentences dict for translation
      else{
        entry = jsonSent[text];
      }
      // Alerts user if sentence has no corresponding translation
      if (entry == undefined) {
        alertMessage("info", "There is currently no translation available for this sentence.",alert);
      }
      // Sends sigml to avatar
      else{
        // entry = "zonmw/" + entry;
        playURL(entry);
        document.getElementById("replayButton").setAttribute("name", entry);
        document.getElementById("replayButton").style.display = 'inline-block';
        document.getElementById("play").setAttribute("class", "btn btn-primary no-click-button");
      }
    }
  