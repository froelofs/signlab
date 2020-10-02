<?php

if(isset($_POST['input'])){
	$text = $_POST['input'];
	// echo "This is what you wrote: ". $text;
	$command = escapeshellcmd('/var/www/illc//projects/signlanguage/pythonTest/main2.py '. $text ."2>&1");
	$output = shell_exec($command);
	echo $output;
}
else{
	echo "Could not access the data.";
}
// echo "Great job, this works! You are now talking to test.php";
?>