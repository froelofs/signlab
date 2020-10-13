<?php
$output="";
$error="";

if (empty($_REQUEST['input'])) {
	$errorcode=-1;
	$error="Please specify some input";
} else {
	// Start command execution
	$command=dirname(__FILE__)."/main.py";
	$pipedesc=array(
		"0"=>array("pipe", "r"),
		"1"=>array("pipe", "w"),
		"2"=>array("pipe", "w")
	);
	$pp=proc_open($command, $pipedesc, $pipes);
	if (!is_resource($pp)) {
		die("Failed to invoke command\n");
	}

	// Send input to input-stream of command (only used if program allows input over STDIN)
	$input = $_REQUEST['input'];
	fwrite($pipes[0], $input);
	fclose($pipes[0]);

	// Get normal and error output
	while(!feof($pipes[1])) {
		$output.=fread($pipes[1], 1024);
	}
	fclose($pipes[1]);
	while(!feof($pipes[2])) {
		$error.=fread($pipes[2], 1024);
	}
	fclose($pipes[2]);
	$errorcode=proc_close($pp);
}

// Send result to browser
header("Content-type: application/json");
print json_encode(compact("errorcode", "error", "output"));
