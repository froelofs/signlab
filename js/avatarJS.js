function playURL(surl,av = 0) {
	CWASA.playSiGMLURL(surl,av);
}

function playText(stext,av = 0) {
	CWASA.playSiGMLText(stext,av);
}

function addStatus(evt) {
	var elt = document.getElementById("myStatusLog");
	var msg = evt.msg;
	if (evt.av != "*") {
		msg = "[av" + evt.av + "] " + msg;
	}
	elt.value = elt.value + msg + "\n";
}
CWASA.addHook("status", addStatus);

var lggr = CWASA.getLogger("CWASA", "trace");

function setFPS(evt) {
	var elt = document.getElementById("myFPS");
	elt.value = evt.msg.toFixed(2);
}
CWASA.addHook("avatarfps", setFPS, 0);

function setSignFrame(evt) {
	var msg = evt.msg;
	var elt = document.getElementById("mySF");
	elt.value = (msg.s+1)+"/"+(msg.f+1);
	elt = document.getElementById("myGloss");
	elt.value = msg.g;
}
CWASA.addHook("avatarsign", setSignFrame, 0);
