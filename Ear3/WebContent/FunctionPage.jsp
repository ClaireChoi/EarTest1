<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<style>
html {
  height: 100%;
}

body {
  height: 100%;
  overflow: hidden;
}

#wrapper{
  height: 100% !important;
  margin: 0 auto;
  overflow: hidden;
}


#left_block {
	position: relative;
    left: 0;
    top: 0;
    width: calc(100% - 60px);
    height: 100%;
}

#right_menu {
	position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
    vertical-align: top;
    width: 60px;
    min-width: 60px;
    height: 100%;
    min-height: inherit;
    background-color: #0cf;
}

.remote-video {
	position:absolute;
	left:0;
	top:0;
	z-index:-3;
	width:100%;
	background-position:center;
	background-repeat:no-repeat;
	pointer-events:none;
}

.local-video {
	position:absolute;
	left:43%;
	bottom:3%;
	z-index:6;
	width:13%;
	background-position:center;
	background-repeat:no-repeat;
	pointer-events:none;
}

.sidenav {
    position: absolute;
    right: 0;
    top: 50px;
    z-index: 5;
    display: none;
    width: 400px;
    height: calc(100% - 50px);
    overflow: hidden;
    cursor: default;
    pointer-events: none;
    background-color: #737373;
}

.sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 22px;
    color: #0cf;
    display: block;
}
</style>
<script src="script/jquery-3.1.0.min.js"></script>
    <script src="script/playrtc.min.js"></script>
    <script src="script/functionCustom.js"></script>
</head>
<body>
<div id="wrapper">
	
	<!-- 화상화면 나오는 곳 -->	
	<div id="left_block">
		<input type="text" id="createChannelId" value="<s:property value='channelId'/>" />
		<video class="remote-video center-block" id="callerRemoteVideo"></video>
		<video class="remote-video center-block" id="calleeRemoteVideo"></video>
		
		<video class="local-video pull-right" id="callerLocalVideo"></video>
		<video class="local-video pull-right" id="calleeLocalVideo"></video>
	</div>
	
	<!-- 우측 주요 기능 나오는 곳 -->
	<div id="right_menu">
		<span style="font-size:30px;cursor:pointer; color:white" class="nav_btn">☰ </span>
		<div id="mySidenav" class="sidenav">
			
		</div>
	</div>
	<!-- 메뉴오픈 -->
	<script>
	$(function(){
		$(".nav_btn").on("click", function(){
			if ($('#mySidenav').css('display') == "none") {
				$('#mySidenav').css('display', 'block');
				$(".nav_btn").text("X");
			}
			else {
				$('#mySidenav').css('display', 'none');
				$(".nav_btn").text("☰");
			}
		});
		
	});
	</script>
</div><!-- wrapper -->

</body>
</html>