//Changes the javascript file loaded depending on the chosen language
function changeLanguage(flagClass) {
	var head = document.getElementsByTagName('head')[0];
	var js = document.createElement("script");

	js.type = "text/javascript";

	if (flagClass == "flag-icon flag-icon-nl")
	{
	    js.src = "covid19/zonmwEN.js";
	    document.getElementById('language').setAttribute("class","flag-icon flag-icon-gb");
	}
	else
	{
	    js.src = "covid19/zonmwNL.js";
	    document.getElementById('language').setAttribute("class","flag-icon flag-icon-nl");
	}

	head.appendChild(js);
}

