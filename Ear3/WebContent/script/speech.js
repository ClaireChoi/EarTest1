window.___gcfg = { lang: 'en' };
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();

var langs =
[['한국어', ['ko-KR']]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;
select_language.style.visibility = 'hidden';
select_dialect.style.visibility = 'hidden';
select_dialect.selectedIndex = 0;

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var recognition;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
    
	createRecog();
	settingRecog();

}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
	/*if (recognizing) {
    recognition.stop();
    return;
  } */
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  
  ignore_onend = false;
  final_span.innerHTML = ''; //검은색 글씨로 나오는 부분
  interim_span.innerHTML = ''; //회색 글씨로 나오는 부분
  showButtons('none');
}

var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
}

function createRecog() {
	recognition = new webkitSpeechRecognition();
	  recognition.continuous = true;
	  recognition.interimResults = true;
}//create Recog();

function settingRecog(){
	recognition.onstart = function() {
	    recognizing = true;
	  }; 

	  recognition.onend = function() {
		//alert("onend!");
	    //recognizing = false;
		/*if (ignore_onend) {
	    	alert("ignore: " + ignore_onend);
	      return;
	    }

	    if (!final_transcript) {
	    	alert("script: " + !final_transcript);
	      return;
	    }*/
	    createRecog();
	    settingRecog();  
	    startButton(event);
	    //final_span.innerHTML="onend";
	    return;
	  };

	  recognition.onresult = function(event) {
	    var interim_transcript = '';
	    if (typeof(event.results) == 'undefined') {
	      recognition.onend = null;
	      alert("stop");
	      recognition.stop();
	      upgrade();
	      recognition.start();
	      alert("strated");
	      return;
	    }
	    for (var i = event.resultIndex; i < event.results.length; ++i) {
	        if (event.results[i].isFinal) {
	          final_transcript += event.results[i][0].transcript;
	        } else {
	          interim_transcript += event.results[i][0].transcript;
	        }
	      }
	    final_transcript = capitalize(final_transcript);
	    final_span.innerHTML = linebreak(final_transcript);
	    interim_span.innerHTML = linebreak(interim_transcript);
	    
	    if (final_transcript || interim_transcript) {
	      showButtons('inline-block');
	    }
	  };
}//setting Recog




////////////////////상직
$(function(){
   var pre_contents = "";
   startButton(event);
/*   setInterval(function(){
      var contents = $('span#final_span').text();
      if (pre_contents == contents) {
         $('span#final_span').text("");
      }
      else {
         pre_contents = contents;
      }
   }, 5000);
*/
});