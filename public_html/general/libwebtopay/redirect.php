<?php
 
require_once('WebToPay.php');


header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');



$kontaktas = $_POST["email"];
$oType = $_POST["oType"];
$lala = intval($oType);
$num = $oType[0];
$fType = intval($num);
$suma = 1000;
echo $oType;
	echo "\r\n";
if ($num == '1') {
	$suma = 799;
} 	else if ($num == '2') {
	$suma = 1399;
}	else if ($num == '3') {
	$suma = 1999;
} else if ($num == '4' ) {
	$a = substr($oType, 1, 2);
	
	$b = substr($oType, 3, 2);

	$suma = intval($a) * intval($b) * 0.9 * 100;

}

function get_self_url() {
    $s = substr(strtolower($_SERVER['SERVER_PROTOCOL']), 0,
                strpos($_SERVER['SERVER_PROTOCOL'], '/'));
 
    if (!empty($_SERVER["HTTPS"])) {
        $s .= ($_SERVER["HTTPS"] == "on") ? "s" : "";
    }
 
    $s .= '://'.$_SERVER['HTTP_HOST'];
 
    if (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] != '80') {
        $s .= ':'.$_SERVER['SERVER_PORT'];
    }
 
    $s .= dirname($_SERVER['SCRIPT_NAME']);
 
    return $s;
}
 
try {
    $self_url = get_self_url();
 
    $request = WebToPay::redirectToPayment(array(
        'projectid'     => 88556,
        'sign_password' => '21b9e7a8e9be5e75ba5c5b3af5ec3aa3',
        'orderid'       => $oType,
        'amount'        => $suma,
        'currency'      => 'EUR',
        'country'       => 'LT',
        'accepturl'     => $self_url.'/accept.php',
        'cancelurl'     => $self_url.'/cancel.php',
        'callbackurl'   => $self_url.'/callback.php',
        'test'          => 0,
        'p_email'		=> $kontaktas,
    ));
} catch (WebToPayException $e) {
    // handle exception
}