<?php
include "conn.php";
@$username = $_POST["username"];
@$pass = $_POST["password"];
$sql = "select count(*) as num  from table1 where username='$username'";
$res = $conn->query($sql);
$row = $res->fetch_assoc();
if( $row["num"]>0 ){
	echo '{"status":0,"msg":"用户名已存在"}';
}else{
	echo '{"status":200,"msg":"可以使用"}';
};
?>