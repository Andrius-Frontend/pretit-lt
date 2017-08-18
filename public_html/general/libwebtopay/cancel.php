<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title></title>
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
        
        .whiteborderbutton {
            background: none;
            border: 2px solid #eee;
        }
        
        .buttonasnew:hover {
            cursor: pointer;
        }
        
        .whiteborderbutton:hover {
            background: #fff;
            color: #555;
            cursor: pointer;
        }
    </style>
</head>

<body>

    <div class="emailconfirm orangebg">
        <div class="emailmiddle">
            <h2>
                    <object class="emailogo" type="image/svg+xml" data="img/logo/pretitlogopilnaswhite.svg">Your browser does not support SVG</object>
                </h2>
            <p>Mokėjimas nesėkmingas. Bandykite dar kartą!</p>

            <div class="confirmbut">
                <button class="buttonasnew whiteborderbutton" type="submit">Bandyti dar kartą</button>
                <button class="buttonup buttonasnew whiteborderbutton" type="submit">Grįžti į Pretit</button>
            </div>
        </div>


    </div>
</body>

</html>