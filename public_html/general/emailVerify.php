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

$id = $request->id;
$email = $request->email;
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
$headers .= 'From: Pretit <pretit@pretit.lt>' . "\r\n";

$msg = "Pretit sveikina Tave prisijungus prie platformos.<br><br> 

Patvirtink savo registraciją paspaudęs šią nuorodą ir naudokis Pretit paslaugomis visiškai nemokaimai! 
http://www.pretit.lt/#/app/patvirtinimas?ide=" . $id;


$msg = wordwrap($msg,70);


mail($email,"Sveiki prisiregitravę prie Pretit",$msg, $headers);

echo "success";








?>