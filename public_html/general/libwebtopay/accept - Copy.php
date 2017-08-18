<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title></title>
    <link href='https://fonts.googleapis.com/css?family=Oswald:400,300,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>

    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <style>
        .orangebg {
            background: url(http://www.pretit.lt/img/orangebg.jpg) no-repeat center center;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
        }
        
        .visnone {
            display: none;
        }
        
        body {
            margin: 0 !important;
            padding: 0;
            width: 100%;
            height: 100%;
        }
        
        .emailconfirm {
            height: 100vh;
            width: 100%;
            overflow: hidden;
        }
        
        .emailmiddle {
            height: 60%;
            margin-top: 10%;
            /* background: #fff; */
            width: 40%;
            margin-left: 30%;
        }
        
        .confirmbut {
            width: 60%;
            margin: 18% auto;
        }
        
        .emaillogo {
            height: 40px;
        }
        
        .emailmiddle h2 {
            text-align: center;
        }
        
        .emailmiddle p {
            font-weight: 300;
            margin-top: 50px;
            color: #fff;
            font-family: 'Oswald', Arial, sans-serif;
            text-align: center;
            font-size: 22px;
            letter-spacing: 1px;
        }
        
        .buttonasnew {
            font-size: 16px;
            color: #fff;
            border: 0;
            height: 40px;
            width: 100%;
            font-family: 'Oswald', Arial, sans-serif;
            /* background-color: white; */
            letter-spacing: 1px;
            font-weight: 300;
            vertical-align: middle;
            text-align: center;
            transition: 0.2s all;
            -webkit-transition: 0.2s all;
            -moz-transition: 0.2s all;
        }
        
        .buttonasnew:hover {
            cursor: pointer;
        }
        
        .whiteborderbutton:hover {
            background: #fff;
            color: #555;
            cursor: pointer;
        }
        
        .whiteborderbutton {
            background: none;
            border: 2px solid #eee;
        }
    </style>
</head>

<body>

    <div class="emailconfirm orangebg">
        <div class="emailmiddle">
            <h2>
                    <object class="emailogo" type="image/svg+xml" data="http://www.pretit.lt/img/logo/pretitlogopilnaswhite.svg">Your browser does not support SVG</object>
                </h2>
            <p>Mokėjimas sėkmingai įvykdytas. Ačiū, kad naudojatės!</p>

            <div class="confirmbut">
            <form action="http://www.pretit.lt">
 				<button class="buttonasnew whiteborderbutton" type="submit">Grįžti į Pretit</button>
			</form>
                
            </div>
        </div>


    </div>

    <div class="visnone">
        <?php 
    require_once('autoload.php');
    define( 'PARSE_SDK_DIR', 'src/Parse/' );
    
    \Parse\ParseClient::initialize( "myAppId", "lukas", "labas" );
	// Users of Parse Server will need to point ParseClient at their remote URL and Mount Point:
	\Parse\ParseClient::setServerURL('http://212.24.106.31:1337','parse');
    
    use Parse\ParseCloud;
    
    $params = array();
	parse_str(base64_decode(strtr($_GET['data'], array('-' => '+', '_' => '/'))), $params);
    $email = $params['p_email'];
    $orderid = $params['orderid'];
    $num = $orderid[0];
    $id = intval($num);
    $days = 90;
    if($id == 4){
    	$a = substr($orderid, 1, 2);
		$b = substr($orderid, 3, 2);
		
		$search_result = ParseCloud::run("paymentsStars", ["email" => $email, "days" => intval($a), "stars" => intval($b)]);
		
    } else {
    	if ($id == 1) {
    		$days = 30;
    	} else if ($id == 2) {
    		$days = 60;
    	} else if ($id == 3) {
    		$days = 90;
    	}
    	$search_result = ParseCloud::run("payments", ["email" => $email, "days" => $days]);
    }
        
    
    var_dump($search_result);
    
    ?>

    </div>
</body>

</html>