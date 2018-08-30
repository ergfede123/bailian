<?php
include "conn.php";
@$username = $_POST["username"];
@$pass = $_POST["password"];


$sql = "select count(*) as num from table1 where username='$username' and password='$pass'";
$res = $conn->query( $sql );
$row = $res->fetch_assoc();
if( $row["num"]>0 ){
	echo '{"status":200,"msg":"登陆成功"}';
}else{
	echo '{"status":0,"msg":"账号或密码错误"}';
}

?>