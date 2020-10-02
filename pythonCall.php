<?php
if(isset($_POST['input'])){
	$text = $_POST['input'];
	$command = '/var/www/illc/projects/signlanguage/ZonMw/main.py '. $text ." 2>&1";
	$output = passthru($command);
	echo $output;
}
else{
	echo "Could not access the data.";
}
?>