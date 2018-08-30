<?php

//连接数据库
$conn = new mysqli( "localhost","root","root","userlist" );

//UTF-8编码
$conn->query( "set names 'utf8'" );

?>