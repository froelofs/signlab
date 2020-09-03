<!-- $exe_command = 'C:\\Windows\\System32\\ping.exe -t google.com';

$process = proc_open($exe_command, $descriptorspec, $pipes); -->


$descriptors = [['pipe', 'r'], ['pipe', 'w'], ['pipe', 'w']];
$handle = proc_open('echo Hello world, $USER!', $descriptors, $pipes, null, ['USER' => 'guest']);
$world = stream_get_contents($pipes[1]);
var_dump($world);