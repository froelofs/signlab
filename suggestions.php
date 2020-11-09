<?php  
	$error="";
	$output="";

	if (empty($_REQUEST['input'])) {
	$errorcode=-1;
	$error="Please specify some input";
	}
	else{
	$input = $_REQUEST['input'] + "";
	//opens file in append mode  
	$fp = fopen('https://www.florisroelofsen.com/signlab/suggestions.txt', 'a');
	fwrite($fp, $input);    
	fwrite($fp, "\n");    
	fclose($fp);  
	  
	$output = "Suggestion successfully saved";  
	}

	// Send result to browser
	header("Content-type: application/json");
	print json_encode(compact("errorcode", "error", "output"));
?>  