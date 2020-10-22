<?php  
	$error="";

	if (empty($_REQUEST['input'])) {
	$errorcode=-1;
	$error="Please specify some input";
	}
	else{
	$input = $_REQUEST['input'];
	//opens file in append mode  
	$fp = fopen('suggestions.txt', 'a');
	fwrite($fp, $input);    
	fwrite($fp, "\n");    
	fclose($fp);  
	  
	echo "Suggestion successfully saved";  
	}
?>  