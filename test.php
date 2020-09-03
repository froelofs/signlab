<?php
// $exe_command = 'C:\\Windows\\System32\\ping.exe -t google.com';

// $process = proc_open($exe_command, $descriptorspec, $pipes);


// $descriptors = [['pipe', 'r'], ['pipe', 'w'], ['pipe', 'w']];
// $handle = proc_open('echo Hello world, $USER!', $descriptors, $pipes, null, ['USER' => 'guest']);
// $world = stream_get_contents($pipes[1]);
// var_dump($world);
	function debug_to_console($data) {
	    $output = $data;
	    if (is_array($output))
	        $output = implode(',', $output);

	    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
	}
	// echo json_encode("hello world");
	debug_to_console("text");
	echo json_encode($_POST["text"]);
	// get the q parameter from URL
	// $q = $_REQUEST["q"];
	// echo q

?>