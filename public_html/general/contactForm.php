<?php
require_once('autoload.php');

define( 'PARSE_SDK_DIR', 'src/Parse/' );
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// \Parse\ParseClient::initialize( "myAppId", "lukas", "labas" );
// // Users of Parse Server will need to point ParseClient at their remote URL and Mount Point:
// \Parse\ParseClient::setServerURL('http://212.24.106.31:1337','parse');
// 
// use Parse\ParseObject;
// use Parse\ParseQuery;
// use Parse\ParseACL;
// use Parse\ParsePush;
// use Parse\ParseUser;
// use Parse\ParseInstallation;
// use Parse\ParseException;
// use Parse\ParseAnalytics;
// use Parse\ParseFile;
// use Parse\ParseCloud;
// use Parse\ParseClient;
// 
// $query = ParseUser::query();
// // $query->equalTo("gender", "female"); 
// $results = $query->find();
// 
// echo $results;

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$name = $request->name;
$email = $request->email;
$tel = $request->tel;
$message = $request->message;
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

$msg = "Naujas užklausimas.<br><br> 

<strong>Vardas</strong> - " . $name ."<br>
<strong>Email</strong> - " . $email ."<br>
<strong>Telefono numeris</strong> - " . $tel ."<br>
<strong>Žinutė</strong> - " . $message ."<br>
";


$msg = wordwrap($msg,70);


mail("pretit@pretit.lt","Nauja užklausa",$msg, $headers);

echo "success";








?>