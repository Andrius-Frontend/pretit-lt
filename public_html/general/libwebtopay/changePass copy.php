<?php
require_once('autoload.php');

define( 'PARSE_SDK_DIR', 'src/Parse/' );
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

\Parse\ParseClient::initialize( "myAppId", "lukas", "labas" );
// Users of Parse Server will need to point ParseClient at their remote URL and Mount Point:
\Parse\ParseClient::setServerURL('http://212.24.106.31:1337','parse');
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
use Parse\ParseCloud;
// use Parse\ParseClient;
// 
// $query = ParseUser::query();
// // $query->equalTo("gender", "female"); 
// $results = $query->find();
// 
// echo $results;

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$auth = generateRandomString();
$email = $request->email;

$search_result = ParseCloud::run("changePassword", ["email" => $email, "auth" =>$auth]);

$msg = "Sveiki, Norėdami pakeisti slaptažodį spauskite nuorodą - http://www.pretit.lt/#/app/pamirstasSlaptazodis?e=" . $email . "&a=" . $auth;


$msg = wordwrap($msg,70);


mail($email,"My subject",$msg);
function generateRandomString($length = 20) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

echo "success";








?>