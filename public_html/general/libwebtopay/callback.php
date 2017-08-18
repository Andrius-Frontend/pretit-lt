<?php
 
require_once('WebToPay.php');

try {
    $response = WebToPay::checkResponse($_GET, array(
        'projectid'     => 0,
        'sign_password' => '21b9e7a8e9be5e75ba5c5b3af5ec3aa3',
    ));
 	
    if ($response['test'] !== '0') {
        throw new Exception('Testing, real payment was not made');
    }
    if ($response['type'] !== 'macro') {
        throw new Exception('Only macro payment callbacks are accepted');
    }
 
    $orderId = $response['orderid'];
    $amount = $response['amount'];
    $currency = $response['currency'];
    //@todo: patikrinti, ar užsakymas su $orderId dar nepatvirtintas (callback gali būti pakartotas kelis kartus)
    //@todo: patikrinti, ar užsakymo suma ir valiuta atitinka $amount ir $currency
    //@todo: patvirtinti užsakymą

	
	
    echo 'OK';
} catch (Exception $e) {
    echo get_class($e) . ': ' . $e->getMessage();
} 