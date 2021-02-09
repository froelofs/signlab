<?php  
	$error="";
	$output="";

	if (empty($_REQUEST['input'])) {
		$errorcode=-1;
		$error="Please specify some input";
	}
	else{
		$input = $_REQUEST['input'];

		$fileName = "suggestions.txt";
		if ( !file_exists($fileName) ) {
	    	$error = "File " + $fileName + " not found";
	  	}
	  	else{
	  		//opens file in append mode
	  		$fp = fopen($fileName, 'a');
  			if ( !$fp ) {
    			$error = "File could not be opened";
  			}  
			else{
				fwrite($fp, $input);    
				fwrite($fp, "\n");    
				fclose($fp);  
				  
				$output = $input;
			} 
		}
	}

	// Send result to browser
	header("Content-type: application/json");
	print json_encode(compact("errorcode", "error", "output"));
?>  