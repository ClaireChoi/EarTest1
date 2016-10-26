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
	left:1%;
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
    
    <!-- text to voice -->
    <script src="script/voicerss-tts.min.js"></script>
    
    <!-- leap motion -->
	<script src="http://js.leapmotion.com/leap-0.6.3.min.js"></script>
	
	<script>
	
		// Store frame for motion functions
		var previousFrame = null;
		var paused = false;
		var pauseOnGesture = false;
	
		// Setup Leap loop with frame callback function
		var controllerOptions = {
			enableGestures : true
		};
	
		// to use HMD mode:
		// controllerOptions.optimizeHMD = true;
	
		var frameCopy;
		var fingerTypeMap = [ "Thumb", "Index finger", "Middle finger",
				"Ring finger", "Pinky finger" ];
	
		//store alphabet (division, indicator)
		var array = [];
		var han = '';
	
		var cho ='';
		var jun ='';
		var jon ='';
		
		
		var handType="";
		var timeId=''; 
		
		
		Leap.loop(controllerOptions, function(frame) {
			if (paused) {
				return; // Skip this update
			}
	
			// Display Hand object data
			if (frame.hands.length > 0) {
				for (var i = 0; i < frame.hands.length; i++) {
					var hand = frame.hands[i];
					handType = hand.type;
			}
			// Store frame for motion functions
			frameCopy = frame;
			previousFrame = frame;
			}
			
		})//loop
	
		function vectorToString(vector, digits) {
			if (typeof digits === "undefined") {
				digits = 1;
			}
			var fingers = {
				x : vector[0].toFixed(digits),
				y : vector[1].toFixed(digits),
				z : vector[2].toFixed(digits)
			};
	
			return fingers;
		}
	
	
		$(function() {
	
			function assemble() {
				//alert("assemble start!");
	
				//쌍자음 구별하기 
				var sftAlphabet = {
					"division" : "1",
					"indicator" : "0"
				};
				for(var i = 0;i<array.length ; i++){
					if(array[i].division==2){
						array[i+1].indicator++; //쌍자음용 자음 (ㄱ,ㅅ,ㄷ,ㅈ,ㅂ) +1 하면 쌍자음의 인덱스
						array.splice(i,1); //sht 신호와 단자음 객체를 빼고 쌍자음의 indicator를 가진 sftAlphabet 객체를 추가
					}
					
				}			
				//그외의 종성들과 초성이 3개로 겹칠 때 
				for(var i = 0;i<array.length-2 ; i++){
					var a = array[i];
					var b = array[i+1];
					var c = array[i+2];
					if(a.division==b.division&&a.division==c.division){//쌍자음을 걸러낸 후에도 연속된 3개의 자음이 있으면 첫번 째 두번 째 자음을 합친 종성자음을 만든다. 
						if(a.indicator==0  &&b.indicator==9  ){//ㄳ0,9
							sftAlphabet.indicator= 2;
						}else if(a.indicator==2 &&b.indicator==12){//ㄵ 2,12
							sftAlphabet.indicator= 4;
						}else if(a.indicator==2 &&b.indicator==18){//ㄶ 2,18
							sftAlphabet.indicator= 5;
						}else if(a.indicator==5 &&b.indicator==0){//ㄺ 5,0
							sftAlphabet.indicator= 8;
						}else if(a.indicator==5 &&b.indicator==6){//ㄻ 5,6
							sftAlphabet.indicator=9 ;
						}else if(a.indicator==5 &&b.indicator==7){//ㄼ 5,7
							sftAlphabet.indicator= 10;
						}else if(a.indicator==5  &&b.indicator==18  ){//ㅀ 5,18
							sftAlphabet.indicator= 14;
						}else if(a.indicator== 7 &&b.indicator== 9 ){//ㅄ 7,9
							sftAlphabet.indicator=17 ;
						}
							array.splice(i,2,sftAlphabet);
					}
				}
				
				//종성 넣기 - 마침표 액션 들어오면 실행
				var alphabet = {
					"division" : "0",
					"indicator" : "0"
				};
				for (var i = 1; i * 3 < array.length; i++) {
					var ii = i * 3 - 1;
					var iii = i * 3;
					var a = array[ii].division;
					var b = array[iii].division;
					if (a != b) {
						array.splice(i * 3 - 1, 0, alphabet);
					}
				}
				if (array.length % 3 != 0) {
					array.push(alphabet);
				}
				
				//alert(array.length);
				
				// 글 조합
				$.each(array, function(index, item) {
					var nokori = index % 3;
					if (nokori == 0) {
						cho = item.indicator;
					} else if (nokori == 1) {
						jun = item.indicator;
					} else if (nokori == 2) {
						jon = item.indicator;
						var gy = item.division;
						if(jon==2){jon++;} //ㄴ
						else if(jon==3){jon+=3;}//ㄷ
						else if(jon==5){jon+=2;}//ㄹ
						else if(jon>=6&&12>=jon){jon+=9;}//ㅁ,ㅂ,ㅅ,ㅇ,ㅈ
						else if(jon>=14&&18>=jon){jon+=8;}//ㅊ,ㅋ,ㅌ,ㅍ,ㅎ
						cho *= 1;
						jun *= 1;
						jon *= 1;
						if(jon!=0||gy==1){jon++;}
						var temp = (0xAC00 + 28 * 21 * (cho) + 28 * (jun) + (jon));
						han += String.fromCharCode(temp);
					}
				});
				if (han.length>0) {
					$('p#singRecog').html(han); //글 찍기 
					rss();
				}
				array=[];
				
			}// 글자 보이기 
	
			//조합된 글 목소리로! 
			function rss() {
				VoiceRSS.speech({
					key : '2330e4438d154c34803f4f4e72f066fa',
					src : han,
					hl : 'ko-kr',
					r : 0,
					c : 'mp3',
					f : '44khz_16bit_stereo',
					ssml : false
				});
				han='';
			}
			
			
			setInterval(function() {
				if (timeId=='') {
					timeId = setInterval(recog, 250);
				} 
			}, 250);
			
			
			function recog() {
				
				if (handType == 'right') {
	
					var coordinates = [];
	
					for (var i = 0; i < frameCopy.pointables.length; i++) {
						var pointable = frameCopy.pointables[i];
						coordinates[i] = {
							type : fingerTypeMap[pointable.type],
							direction : vectorToString(pointable.direction)
						}
					}
					
					var temp = {
						"fingerdata.thumb_x" : coordinates[0].direction.x,
						"fingerdata.thumb_y" : coordinates[0].direction.y,
						"fingerdata.thumb_z" : coordinates[0].direction.z,
						"fingerdata.index_x" : coordinates[1].direction.x,
						"fingerdata.index_y" : coordinates[1].direction.y,
						"fingerdata.index_z" : coordinates[1].direction.z,
						"fingerdata.middle_x" : coordinates[2].direction.x,
						"fingerdata.middle_y" : coordinates[2].direction.y,
						"fingerdata.middle_z" : coordinates[2].direction.z,
						"fingerdata.ring_x" : coordinates[3].direction.x,
						"fingerdata.ring_y" : coordinates[3].direction.y,
						"fingerdata.ring_z" : coordinates[3].direction.z,
						"fingerdata.little_x" : coordinates[4].direction.x,
						"fingerdata.little_y" : coordinates[4].direction.y,
						"fingerdata.little_z" : coordinates[4].direction.z
	
					};
	
					temp = JSON.stringify(temp);
					temp = JSON.parse(temp);
	
					$.ajaxSettings.traditional = true;
					$.ajax({
						url : 'find',
						method : 'post',
						data : temp,
						dataType : 'json',
						success : function(resp) {
							var alphabet = resp.alphabet;
							// 			var division = resp.alphabet.division;
							// 			var indicator = resp.alphabet.indicator;
							/* 		
								배열에 넣기.
								alphabet.division // 구분자
								alphabet.indicator // index
							 */
							 if (alphabet!=null) {
								array.push(alphabet);
								$('p#singRecog').html(function(index, html) {
									return html += alphabet.letter;
								});
							}
						}//success
						,
						error : function() {
							
						}//error
	
					});//ajax
					
				}//if rightHand
				else if (handType == 'left') {
					var gestureType = "";
					if (frameCopy.gestures.length > 0) {
					    for (var i = 0; i < frameCopy.gestures.length; i++) {
					      var gesture = frameCopy.gestures[i];
					 		gestureType = gesture.type;
							//alert(gesture.type);
					 }
					}
					switch (gestureType) {
					case "circle":
						//alert("circle!!");
						/* 
							오타 삭제 내용;
						 */
						 array.splice(array.length-1,1);
						 $('p#singRecog').html(function(index, html) {
								return html.substring(0,html.length-1);
							});
						clearInterval(timeId);
						timeId='';
						break;
					case "swipe":
						//alert("swipe!!");
						assemble();
						clearInterval(timeId);
						timeId='';
						break;
					}//switch */
	
				}//if leftHand
			}//recog
			
		});
</script>
	
	
    
    
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
			
			
			<label>수화 내용</label>
			<p id="singRecog">
			</p>
			
			
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