<?php

$email = $_GET['e'];
$id = $_GET['id'];



?>
<form class="iskelimoforma form-style-4" action="libwebtopay/redirect.php" method="post">
    <input class="val" type="text" name="email" value="<?php echo $email ?>" readonly/>
    <input class="payNotSee" type="text" name="oType" value="<?php echo $id ?>" />
    <input class="iskelbuttonas buttonasnew greenbutton" type="submit" value="Aktyvuoti" id="save" />

</form>
<script>
	document.getElementById('save').click();
</script>