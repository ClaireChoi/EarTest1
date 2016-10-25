<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Leap Motion JavaScript Sample</title>
<!-- speech style import -->
<link rel="stylesheet" type="text/css" href="css/speech.css">

<style>
th {
	width: 50px;
}

tr, th, td {
	border: 1px solid black;
	padding: 5px;
}

table {
	border-collapse: collapse;
	border: 1px solid black;
}

tr.hit {
	background: #00FF00;
}
</style>
<script src="tts.js/voicerss-tts.min.js"></script>
<script src="http://js.leapmotion.com/leap-0.6.3.min.js"></script>
<script src="script/jquery-3.1.0.min.js" type="text/javascript"></script>

<!-- speech script start -->
<script>
(function(e, p){
    var m = location.href.match(/platform=(win8|win|mac|linux|cros)/);
    e.id = (m && m[1]) ||
           (p.indexOf('Windows NT 6.2') > -1 ? 'win8' : p.indexOf('Windows') > -1 ? 'win' : p.indexOf('Mac') > -1 ? 'mac' : p.indexOf('CrOS') > -1 ? 'cros' : 'linux');
    e.className = e.className.replace(/\bno-js\b/,'js');
  })(document.documentElement, window.navigator.userAgent)
    </script>
    <meta charset="utf-8">
    <meta content="initial-scale=1, minimum-scale=1, width=device-width" name="viewport">
    <meta content=
    "Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier."
    name="description">
    
    <link href="https://plus.google.com/100585555255542998765" rel="publisher">
    <link href="//www.google.com/images/icons/product/chrome-32.png" rel="icon" type="image/ico">
    <link href="//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&amp;subset=latin" rel=
    "stylesheet">
    <script src="//www.google.com/js/gweb/analytics/autotrack.js"/></script>
    <script src="//www.google.com/js/gweb/analytics/doubletrack.js"></script>

    <script>
		new gweb.analytics.AutoTrack({
          profile: 'UA-26908291-1'
        });
    </script>
    
    
<!-- speech script end -->

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
	

	Leap.loop(controllerOptions, function(frame) {
		if (paused) {
			return; // Skip this update
		}

		// Display Hand object data
		var handOutput = document.getElementById("handData");
		var handString = "";
		if (frame.hands.length > 0) {
			for (var i = 0; i < frame.hands.length; i++) {
				var hand = frame.hands[i];
				handType = hand.type;
				handString += hand.type + " ";
				handString += "Palm position: "
						+ vectorToString(hand.palmPosition) + " mm<br />";

				if (hand.pointables.length > 0) {
					var fingerIds = [];
					for (var j = 0; j < hand.pointables.length; j++) {
						var pointable = hand.pointables[j];
						fingerIds.push(pointable.id);
					}
					if (fingerIds.length > 0) {
						handString += "Fingers IDs: " + fingerIds.join(", ")
								+ "<br />";
					}
				}
				handString += "</div>";
			}
		} else {
			handString += "No hands";
		}
		handOutput.innerHTML = handString;

		
		// Store frame for motion functions
		frameCopy = frame;
		previousFrame = frame;
		
		
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

	/* function togglePause() {
	 paused = !paused;
	 if (paused) {
	 document.getElementById("pause").innerText = "Resume";
	 } else {
	 document.getElementById("pause").innerText = "Pause";
	 }
	 }

	 function pauseForGestures() {
	 if (document.getElementById("pauseOnGesture").checked) {
	 pauseOnGesture = true;
	 } else {
	 pauseOnGesture = false;
	 }
	 } */

	$(function() {

		function assemble() {
			alert("assemble start!");

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
			
			alert(array.length);
			
			// 글 조합
			$.each(array, function(index, item) {
				var nokori = index % 3;
				if (nokori == 0) {
					cho = item.indicator;
				} else if (nokori == 1) {
					jun = item.indicator;
				} else if (nokori == 2) {
					jon = item.indicator;
					if(jon==2){jon++;} //ㄴ
					else if(jon==3){jon+=3;}//ㄷ
					else if(jon==5){jon+=2;}//ㄹ
					else if(jon>=6&&12>=jon){jon+=9;}//ㅁ,ㅂ,ㅅ,ㅇ,ㅈ
					else if(jon>=14&&18>=jon){jon+=8;}//ㅊ,ㅋ,ㅌ,ㅍ,ㅎ
					cho *= 1;
					jun *= 1;
					jon *= 1;
					if(jon!=0){jon++;}
					var temp = (0xAC00 + 28 * 21 * (cho) + 28 * (jun) + (jon));
					han += String.fromCharCode(temp);
					$('#test3').html(han); //test3에 글 찍기 
					array=[];
				}
			});
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

		}
		
		
		setInterval(function() {
			
			var handType="";
			if (frameCopy.hands.length > 0) {
				for (var i = 0; i < frameCopy.hands.length; i++) {
					var hand = frameCopy.hands[i];
					handType = hand.type;
				}
			}
			
			if (handType == 'right') {

				var coordinates = [];

				for (var i = 0; i < frameCopy.pointables.length; i++) {
					var pointable = frameCopy.pointables[i];
					coordinates[i] = {
						type : fingerTypeMap[pointable.type],
						direction : vectorToString(pointable.direction)
					}
				}

				var row = "<tr id='temp'>" + "<td>"
						+ coordinates[0].direction.x + "</td>" + "<td>"
						+ coordinates[0].direction.y + "</td>" + "<td>"
						+ coordinates[0].direction.z + "</td>" + "<td>"
						+ coordinates[1].direction.x + "</td>" + "<td>"
						+ coordinates[1].direction.y + "</td>" + "<td>"
						+ coordinates[1].direction.z + "</td>" + "<td>"
						+ coordinates[2].direction.x + "</td>" + "<td>"
						+ coordinates[2].direction.y + "</td>" + "<td>"
						+ coordinates[2].direction.z + "</td>" + "<td>"
						+ coordinates[3].direction.x + "</td>" + "<td>"
						+ coordinates[3].direction.y + "</td>" + "<td>"
						+ coordinates[3].direction.z + "</td>" + "<td>"
						+ coordinates[4].direction.x + "</td>" + "<td>"
						+ coordinates[4].direction.y + "</td>" + "<td>"
						+ coordinates[4].direction.z + "</td>" + "</tr>";

				//var preTemp = $('tr#temp');

				/* if (preTemp !=null) {
					preTemp.remove();
				} */

				var insertedRow = $(row).appendTo("table");

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
						}

						$("div#test2").html(function(index, html) {
							return html += alphabet.letter;
						});

						insertedRow.attr('class', "hit");
					}
					,
					error : function() {
						alert("ㄴㄴ;;");
					}

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
					alert("circle!!");
					/* 
						오타 삭제 내용;
					 */
					 array.splice(array.length-1,1);
					 $('#test2').html(function(index, html) {
							return html.substring(0,html.length-1);
						});
					break;
				case "swipe":
				case "screenTap":
		        case "keyTap":	
					alert(gestureType);
					assemble();
					break;
				}//switch */

			}//if leftHand
		}, 250);

		
		
	});

	
</script>
</head>
<body>
	<h1>Leap Motion JavaScript Sample</h1>
	
	<!-- speech Dom start -->
	<div class="browser-landing" id="main">
      <div class="compact marquee-stacked" id="marquee">
        <div class="marquee-copy">
          
        </div>
      </div>
      <div class="compact marquee">
    
        <div id="results">
          <span class="final" id="final_span"></span> <span class="interim" id=
          "interim_span"></span>
        </div>

        <div class="compact marquee" id="div_language">
          <select id="select_language" onchange="updateCountry()">
            </select>&nbsp;&nbsp; <select id="select_dialect">
            </select>
        </div>
      </div>
     </div>
     <!-- speech script import -->
     <script type="text/javascript" src="script/speech.js"></script>
	<!-- speech Dom end -->
	
	
	
	<div id="main">
		<button id="pause" onclick="togglePause()">Pause</button>
		<input type="checkbox" id="pauseOnGesture"
			onclick="pauseForGestures()">Pause on gesture</input>
		<h3>Frame data:</h3>
		<div id="frameData"></div>
		<div style="clear: both;"></div>
		<h3>Hand data:</h3>
		<div id="handData"></div>
		<div style="clear: both;"></div>

		<div id="test2"></div>
		<div id="test3"></div>

		<h3>Finger and tool data:</h3>
		<div id="pointableData"></div>
		<div style="clear: both;"></div>
		<h3>Gesture data:</h3>
		<div id="gestureData"></div>
	</div>

	<div id="directions">
		<table>
			<tr>
				<th>thumb_x</th>
				<th>thumb_y</th>
				<th>thumb_z</th>
				<th>index_x</th>
				<th>index_y</th>
				<th>index_z</th>
				<th>middle_x</th>
				<th>middle_y</th>
				<th>middle_z</th>
				<th>ring_x</th>
				<th>ring_y</th>
				<th>ring_z</th>
				<th>little_x</th>
				<th>little_y</th>
				<th>little_z</th>
			</tr>
		</table>
	</div>

	<div id="test"></div>



</body>
</html>