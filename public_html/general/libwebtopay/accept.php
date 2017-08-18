<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title></title>
    <link href='https://fonts.googleapis.com/css?family=Oswald:400,300,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>

    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <style>
        body {
            height: 100%;
            width: 100%;
            padding: 0;
            margin: 0;
        }
        
        .confirmmain {
            background: url(http://www.pretit.lt/img/loginbackground.jpg) no-repeat center center;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
            position: relative;
            height: 100vh;
            width: 100%;
            float: left;
            overflow: hidden;
        }
        
        .acceptas .visnone {
            display: none;
        }
        
        .emailconfirm {
            height: 100vh;
            width: 100%;
            overflow: hidden;
            background-size: 100%;
            height: 100vh;
            width: 100%;
            margin-top: 0%;
        }
        
        .confirmwindow {
            position: relative;
            height: 500px;
            margin-top: 5%;
            width: 60%;
            margin-left: 20%;
            float: left;
            background: #fff;
            box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.2);
            -webkit-box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.2);
            -moz-box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .emailmiddle {
            height: 60%;
            margin-top: 40px;
            /* background: #fff; */
            text-align: center;
            width: 70%;
            margin-left: 15%;
        }
        
        .emailmiddle img {
            display: inline-block;
            height: 50px;
        }
        
        .confirmbut {
            width: 60%;
            margin: 18% auto;
        }
        
        .confirmbut button {
            border: none;
            height: 40px;
            width: 80%;
            box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.4);
            -webkit-box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.4);
            -moz-box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.4);
            font-family: 'Open Sans', Arial, sans-serif;
            font-size: 13px;
        }
        
        .emaillogo {
            height: 40px;
        }
        
        .emailmiddle h2 {
            margin-bottom: 20%;
            text-align: center;
            margin-top: 40px;
        }
        
        .emailmiddle p {
            margin-top: 10px;
            color: #444;
            font-family: 'Open Sans', Arial, sans-serif;
            text-align: center;
            font-size: 20px;
            letter-spacing: 0px;
        }
        
        .orangebutton {
            /*  background: #ff8161; */
            background: #f38065;
            /* Old browsers */
            background: -moz-linear-gradient(left, #f38065 0%, #c9979c 100%);
            /* FF3.6-15 */
            background: -webkit-linear-gradient(left, #f38065 0%, #c9979c 100%);
            /* Chrome10-25,Safari5.1-6 */
            background: linear-gradient(to right, #f38065 0%, #c9979c 100%);
            /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
            filter: progid: DXImageTransform.Microsoft.gradient( startColorstr='#f38065', endColorstr='#c9979c', GradientType=1);
            /* IE6-9 */
            /*   transition: 0.2s all;
    -webkit-transition: 0.2s all;
    -moz-transition: 0.2s all; */
            color: #fff;
            cursor: pointer;
        }
        
        .orangebutton:hover {
            background: #f7704e;
            /*  transition: 0.2s all;
    -webkit-transition: 0.2s all;
    -moz-transition: 0.2s all; */
            */ cursor: pointer;
        }
    </style>
</head>

<body class="acceptas">

    <div class="confirmmain">

        <div class="acceptconfirm confirmwindow">

            <div class="emailconfirm">
                <div class="emailmiddle">
                    <h2>
                    <object class="emailogo" type="image/svg+xml" data="http://www.pretit.lt/img/logo/pretitlogopilnasorange.svg">Your browser does not support SVG</object>
                </h2>
                    <img src="http://www.pretit.lt/img/successreg.png">
                    <p>Mokėjimas sėkmingai įvykdytas. Ačiū, kad naudojatės!
                    </p>

                    <div class="confirmbut">
                        <a href="http://www.pretit.lt">
                            <button class="orangebutton" type="submit">Grįžti į Pretit</button>
                        </a>
                    </div>
                </div>


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