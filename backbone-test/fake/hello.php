<?php
header('Content-Type: application/json; charset=utf-8'); 
$info= json_encode(array('name'=>'tom'));
echo $info;
?>