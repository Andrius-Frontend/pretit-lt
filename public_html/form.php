<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<?php
error_reporting(E_ALL);
date_default_timezone_set('Europe/London');
require_once 'Classes/PHPExcel/IOFactory.php';
require_once 'Classes/PHPExcel.php';
require_once('PHPMailer/PHPMailerAutoload.php');
require 'simple_html_dom.php';

ini_set("precision", 2);

$menesiai = array("Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis");

$sablonas = $_POST["excel"];
$currency = $_POST["currency"];
$data = $_POST["date"];
$serija = $_POST["serie"];
$serijosNr = $_POST["serieNr"];
$kontaktas = $_POST["contact"];
$country = $_POST["country"];
$code = $_POST["code"];
$pvmCode = $_POST["pvmCode"];
$kaina = number_format((float)$_POST["price"], 2, '.', '');
// $kaina =  $_POST["price"];
$pvm = $_POST["vat"];
$metai = substr($data, 0, 4);
$menuoSkaic = substr($data, 5, 2);
$menuo = $menesiai[$menuoSkaic - 1];
$diena = substr($data, -2);
echo $sablonas . "</br>";
echo $data . "</br>";
echo $serija . "</br>";
echo $serijosNr . "</br>";
echo $kontaktas . "</br>";
echo $kaina . "</br>";
echo $pvm . "</br>";
echo $menuo . "</br>";
    
if($currency == "1")  {
	$html = file_get_html('http://www.lb.lt/lb_buhalteriniai_euro_ir_uzsienio_valiutu_santykiai?tp=LT&rs=&dte='.$data.'&ccy=USD');
} else {
	$html = file_get_html('http://www.lb.lt/lb_buhalteriniai_euro_ir_uzsienio_valiutu_santykiai?tp=LT&rs=&dte='.$data.'&ccy=GBP');
}
$ret = $html->find('td', 6);

echo $ret . "</br>";

$aaa = str_replace(",",".",$ret);
echo $aaa . "</br>";

$vat = substr($aaa, 4);
$vak = substr($vat, 0, -5);



echo $vak . "</br>";

$kainaEur = round(bcdiv($kaina, $vak, 5),2);

echo $sablonas . "</br>";
    
if ($sablonas == "1") {    
	$inputFileName = 'Navigacijos.xls';
} else if ($sablonas =="2")  {
	$inputFileName = 'navigatio2.xls';
}

$objPHPExcel = PHPExcel_IOFactory::load($inputFileName);


//date
$objPHPExcel->getActiveSheet()->setCellValue('E3', $metai);
$objPHPExcel->getActiveSheet()->setCellValue('H3', $menuo);
$objPHPExcel->getActiveSheet()->setCellValue('M3', $diena);


// set Serie
$objPHPExcel->getActiveSheet()->setCellValue('E2', $serija);
$objPHPExcel->getActiveSheet()->mergeCells('E2:F2');

// set serie number
$objPHPExcel->getActiveSheet()->setCellValue('I2', $serijosNr);
$objPHPExcel->getActiveSheet()->mergeCells('I2:O2');

// set contact name
$objPHPExcel->getActiveSheet()->setCellValue('P6', $kontaktas);
$objPHPExcel->getActiveSheet()->mergeCells('P6:S6');

// set code
$objPHPExcel->getActiveSheet()->setCellValue('P7', $code);
$objPHPExcel->getActiveSheet()->mergeCells('P7:S7');

// set VAT code
$objPHPExcel->getActiveSheet()->setCellValue('P8', $pvmCode);
$objPHPExcel->getActiveSheet()->mergeCells('P8:S8');


// set country
$objPHPExcel->getActiveSheet()->setCellValue('N9', $country);
$objPHPExcel->getActiveSheet()->mergeCells('N9:S9');

// set price
if ($currency == "1") {
	$objPHPExcel->getActiveSheet()->setCellValue('S26', "$ " . $kaina . " (" . $kainaEur . " EUR)");
} else if ($currency == "2") {
	$objPHPExcel->getActiveSheet()->setCellValue('S26', $kaina ." EUR");
}	else {
	$objPHPExcel->getActiveSheet()->setCellValue('S26', "£ " . $kaina . " (" . $kainaEur . " EUR)");
}

echo $pvm;

//set pvm p
if($pvm == "on"){
	$objPHPExcel->getActiveSheet()->setCellValue('A26', "PVM įstatymo 49 str. 1 d.");
	$objPHPExcel->getActiveSheet()->mergeCells('A26:M26');
} else {
	$objPHPExcel->getActiveSheet()->setCellValue('A26', "PVM įstatymo 41 str. 1 d.");
	$objPHPExcel->getActiveSheet()->mergeCells('A26:M26');
}

// calculate vat
if ($currency == "1") {
if ($pvm == "on") {
	$pvmSumTotal = round(bcdiv($kaina, 1.21, 5),2);
	$pvmSum = round(bcsub($kaina, $pvmSumTotal, 5),2);
	$pvmSum2 = number_format((float)$pvmSum, 2, '.', '');
	$pvmEur = round(bcdiv($pvmSum, $vak, 5),2);
	$pvmSumTotalEur = round(bcdiv($pvmSumTotal, $vak, 5),2);
	// pvm
  	$objPHPExcel->getActiveSheet()->setCellValue('S25', "$ " . $pvmSum2 . " (" . $pvmEur . " EUR)");
  	$objPHPExcel->getActiveSheet()->setCellValue('P16', "$ " . $pvmSum2 . " (" . $pvmEur . " EUR)");
  	
  	
  	$objPHPExcel->getActiveSheet()->setCellValue('H16', "$ " . $pvmSumTotal . " (" . $pvmSumTotalEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('M16', "$ " . $pvmSumTotal . " (" . $pvmSumTotalEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('S16', "$ " . $pvmSumTotal . " (" . $pvmSumTotalEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('S24', "$ " . $pvmSumTotal . " (" . $pvmSumTotalEur . " EUR)");



} else {
	$objPHPExcel->getActiveSheet()->setCellValue('S25', "$ 0 (0 EUR)");
  	$objPHPExcel->getActiveSheet()->setCellValue('P16', "$ 0 (0 EUR)");
  	
  	$objPHPExcel->getActiveSheet()->setCellValue('H16', "$ " . $kaina . " (" . $kainaEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('M16', "$ " . $kaina . " (" . $kainaEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('S16', "$ " . $kaina . " (" . $kainaEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('S24', "$ " . $kaina . " (" . $kainaEur . " EUR)");
}
} else if ($currency == "2") {
if ($pvm == "on") {
	$pvmSumTotal = round(bcdiv($kaina, 1.21, 5), 2);
	$pvmSum = round(bcsub($kaina, $pvmSumTotal, 5),2);
	$pvmSum2 = number_format((float)$pvmSum, 2, '.', '');
	$pvmEur = round(bcdiv($pvmSum, $vak, 5), 2);
	$pvmSumTotalEur = round(bcdiv($pvmSumTotal, $vak, 5),2);
	// pvm
  	$objPHPExcel->getActiveSheet()->setCellValue('S25', $pvmSum2 .  " EUR");
  	$objPHPExcel->getActiveSheet()->setCellValue('P16', $pvmSum2 . " EUR");
  	
  	
  	$objPHPExcel->getActiveSheet()->setCellValue('H16', $pvmSumTotal . " EUR");
	$objPHPExcel->getActiveSheet()->setCellValue('M16', $pvmSumTotal . " EUR");
	$objPHPExcel->getActiveSheet()->setCellValue('S16', $pvmSumTotal . " EUR");
	$objPHPExcel->getActiveSheet()->setCellValue('S24', $pvmSumTotal . " EUR");



} else {
	$objPHPExcel->getActiveSheet()->setCellValue('S25', "0 EUR");
  	$objPHPExcel->getActiveSheet()->setCellValue('P16', "0 EUR");
  	
  	$objPHPExcel->getActiveSheet()->setCellValue('H16', $kaina . " EUR");
	$objPHPExcel->getActiveSheet()->setCellValue('M16', $kaina . " EUR");
	$objPHPExcel->getActiveSheet()->setCellValue('S16', $kaina . " EUR");
	$objPHPExcel->getActiveSheet()->setCellValue('S24', $kaina . " EUR");
}
} else {
	if ($pvm == "on") {
	$pvmSumTotal = round(bcdiv($kaina, 1.21, 5), 2);
	$pvmSum = round(bcsub($kaina, $pvmSumTotal, 5),2);
	$pvmSum2 = number_format((float)$pvmSum, 2, '.', '');
	$pvmEur = round(bcdiv($pvmSum, $vak, 5),2);
	$pvmSumTotalEur = round(bcdiv($pvmSumTotal, $vak, 5),2);
	// pvm
  	$objPHPExcel->getActiveSheet()->setCellValue('S25', "£ " . $pvmSum2 . " (" . $pvmEur . " EUR)");
  	$objPHPExcel->getActiveSheet()->setCellValue('P16', "£ " . $pvmSum2 . " (" . $pvmEur . " EUR)");
  	
  	
  	$objPHPExcel->getActiveSheet()->setCellValue('H16', "£ " . $pvmSumTotal . " (" . $pvmSumTotalEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('M16', "£ " . $pvmSumTotal . " (" . $pvmSumTotalEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('S16', "£ " . $pvmSumTotal . " (" . $pvmSumTotalEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('S24', "£ " . $pvmSumTotal . " (" . $pvmSumTotalEur . " EUR)");



	} else {
	$objPHPExcel->getActiveSheet()->setCellValue('S25', "£ 0 (0 EUR)");
  	$objPHPExcel->getActiveSheet()->setCellValue('P16', "£ 0 (0 EUR)");
  	
  	$objPHPExcel->getActiveSheet()->setCellValue('H16', "£ " . $kaina . " (" . $kainaEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('M16', "£ " . $kaina . " (" . $kainaEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('S16', "£ " . $kaina . " (" . $kainaEur . " EUR)");
	$objPHPExcel->getActiveSheet()->setCellValue('S24', "£ " . $kaina . " (" . $kainaEur . " EUR)");
	}
}
function convert_number_to_words($number) {
    
    $hyphen      = ' ';
    $conjunction = ' ';
    $separator   = ', ';
    $negative    = 'negative ';
    $decimal     = ' euras(-ai, -ų) ir ';
    $dictionary  = array(
        0                   => 'nulis',
        1                   => 'vienas',
        2                   => 'du',
        3                   => 'trys',
        4                   => 'keturi',
        5                   => 'penki',
        6                   => 'šeši',
        7                   => 'septyni',
        8                   => 'aštuoni',
        9                   => 'devyni',
        10                  => 'dešimt',
        11                  => 'vienuolika',
        12                  => 'dvylika',
        13                  => 'trylika',
        14                  => 'keturiolika',
        15                  => 'penkiolika',
        16                  => 'šešiolika',
        17                  => 'septyniolika',
        18                  => 'aštuoniolika',
        19                  => 'devyniolika',
        20                  => 'dvidešimt',
        30                  => 'trisdešimt',
        40                  => 'keturiasdešimt',
        50                  => 'penkiasdešimt',
        60                  => 'šešiasdešimt',
        70                  => 'septyniasdešimt',
        80                  => 'aštuoniasdešimt',
        90                  => 'devyniasdešimt',
        100                 => 'šimtas',
        1000                => 'tūkstantis',
        1000000             => 'milijonas',
        1000000000          => 'billion',
        1000000000000       => 'trillion',
        1000000000000000    => 'quadrillion',
        1000000000000000000 => 'quintillion'
    );
    if (!is_numeric($number)) {
        return false;
    }
    if (($number >= 0 && (int) $number < 0) || (int) $number < 0 - PHP_INT_MAX) {
        // overflow
        trigger_error(
            'convert_number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX,
            E_USER_WARNING
        );
        return false;
    }

    if ($number < 0) {
        return $negative . convert_number_to_words(abs($number));
    }
    $string = $fraction = null;
    
    if (strpos($number, '.') !== false) {
        list($number, $fraction) = explode('.', $number);
    }
    switch (true) {
        case $number < 21:
            $string = $dictionary[$number];
            break;
        case $number < 100:
            $tens   = ((int) ($number / 10)) * 10;
            $units  = $number % 10;
            $string = $dictionary[$tens];
            if ($units) {
                $string .= $hyphen . $dictionary[$units];
            }
            break;
        case $number < 1000:
            $hundreds  = $number / 100;
            $remainder = $number % 100;
            $string = $dictionary[$hundreds] . ' ' . $dictionary[100];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_words($remainder);
            }
            break;
        default:
            $baseUnit = pow(1000, floor(log($number, 1000)));
            $numBaseUnits = (int) ($number / $baseUnit);
            $remainder = $number % $baseUnit;
            $string = convert_number_to_words($numBaseUnits) . ' ' . $dictionary[$baseUnit];
            if ($remainder) {
                $string .= $remainder < 100 ? $conjunction : $separator;
                $string .= convert_number_to_words($remainder);
            }
            break;
    }
    if (null !== $fraction && is_numeric($fraction)) {
        // $string .= $decimal;
        $belekas = substr($number, -2);
        if (substr($number, -1, 1) == '0') {
        	$string .= " eurų "; 
        } 	else if (10 < $belekas && $belekas < 20) {
        	$string .= " eurų "; 
        }  else if (substr($number, -1, 1) == '1') {
        	$string .= " euras ";
        }	else {
        	$string .= " eurai ";
        }
        
        $words = array();
        echo $fraction . " fraction ";
        if ($fraction < 10) {
        	$trump = substr($fraction, -1);
        	$words[] = $dictionary[$trump];
        } else if ($fraction < 21) {
        	$words[] = $dictionary[$fraction];
        } else {
        	$tens   = ((int) ($fraction / 10)) * 10;
            $units  = $fraction % 10;
            $words[] = $dictionary[$tens];
            if ($units) {
                $words[] .= $hyphen . $dictionary[$units];
            }
        }
       //  foreach (str_split((string) $fraction) as $number) {
//             $words[] = $dictionary[$number];
//         }
        $string .= implode(' ', $words);
    }
    return $string;
}

echo '</br>';
echo convert_number_to_words($kainaEur);
if ($currency == "2") {
$zodziai = convert_number_to_words($kaina);
$galune = substr($kaina, -2);
} else {
$zodziai = convert_number_to_words($kainaEur);
$galune = substr($kainaEur, -2);
}

$centai = '';


if ($currency == "2") {
 if (substr($kaina, -1) == '0') {
        	$centai .= " eurocentų "; 
        } 	else if (10 < $galune && $galune < 20) {
        	$centai .= " eurocentų "; 
        } 	else if (1 < $galune && $galune < 10) {
        	$centai .= " eurocentai "; 
        }  	else if (substr($kainaEur, -1) == '1') {
        	$centai .= " eurocentas ";
        }	else {
        	$centai .= " eurocentai ";
        }
}
else {
 if (substr($kainaEur, -1) == '0') {
        	$centai .= " eurocentų "; 
        } 	else if (10 < $galune && $galune < 20) {
        	$centai .= " eurocentų "; 
        } 	else if (1 < $galune && $galune < 10) {
        	$centai .= " eurocentai "; 
        }  	else if (substr($kainaEur, -1) == '1') {
        	$centai .= " eurocentas ";
        }	else {
        	$centai .= " eurocentai ";
        }
}
$objPHPExcel->getActiveSheet()->setCellValue('A27', $zodziai . $centai);
echo "</br>";
echo $zodziai . $centai;

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('files/' . $serija . $serijosNr . '.xlsx');


// mailo siuntimas


$mail = new PHPMailer;

// $mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'jonas.petraitis.lt@gmail.com';                 // SMTP username
$mail->Password = 'jon555pp';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->setFrom('from@example.com', 'Saskaita');
$mail->addAddress('shmignas@gmail.com');     // Add a recipient
// $mail->addAddress('ljunokas@gmail.com');     // Add a recipient
$mail->addReplyTo('info@example.com', 'Information');


$mail->addAttachment('files/' . $serija . $serijosNr . '.xlsx');         // Add attachments

$mail->Subject = 'Saskaita - ' . $serija . $serijosNr;
$mail->Body    = 'This is the HTML message body <b>in bold!</b>';
$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}


?>