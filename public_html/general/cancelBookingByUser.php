<?php
require_once('autoload.php');


header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$arr = [];
$postdata = file_get_contents("php://input");

parse_str($postdata, $arr);

$email = $arr['email'];

$subject = 'Užsakymas atšauktas - Pretit';
$msg = "<html>

<body>
  <h3>Labas!</h3><br><br>
  <p>Tavo užsakymas buvo atšauktas ir automatiškai panaikintas iš kalendoriaus. Peržiūrėti kalendorių gali prisijungęs prie <a href='http://www.pretit.lt'>Pretit</a> paskyros.</p>
  
</body>
</html>";


$msg = wordwrap($msg,70);

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

// Additional headers
//$headers .= 'To: Mary <mary@example.com>, Kelly <kelly@example.com>' . "\r\n";
$headers .= 'From: Pretit <rezervacijos@pretit.lt>' . "\r\n";
//$headers .= 'Cc: birthdayarchive@example.com' . "\r\n";
//$headers .= 'Bcc: birthdaycheck@example.com' . "\r\n";

mail($email,$subject,$msg, $headers);

echo $email;








?>