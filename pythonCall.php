<?php

if(isset($_POST['input'])){
	$text = $_POST['input'];
	$command = escapeshellcmd('main.py '. $text ."2>&1");
	$output = shell_exec($command);
	echo $output;
}
else{
	echo "Could not access the data.";
}
?>