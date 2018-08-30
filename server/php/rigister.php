<?php
	include "conn.php";
	@$user = $_POST["username"];
	@$pass = $_POST["password"];
	@$phone = $_POST["phone"];
	@$email = $_POST["email"];
	//数据库查询
	$sql = "select count(*) as num from table1 where username = '$user'";
	$res = $conn->query( $sql );
	$row = $res->fetch_assoc();
	if( $row["num"]>0 ){
		echo '{"status":0,"msg":"用户名已存在"}';
	}else{
		$sql = "insert into table1 (username,password,phone,email) values ('$user','$pass','$phone','$email')";
		$conn->query( $sql );
		echo '{"status":200,"msg":"注册成功"}';
	};
?>