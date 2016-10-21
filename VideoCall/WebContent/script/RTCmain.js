var video = document.querySelector('video');
var p = navigator.mediaDevices.getUserMedia({video:true, audio:true});

var constraints = {
		  audio: true,
		  video: true
		};

function successCallback(stream){
	window.stream = stream;
	if(window.URL){
		video.src = window.URL.createObjectURL(stream);
	} else {
		video.src = URL.createObjectURL(stream);
	}
}

function errorCallback(error){
	console.log('navigator.getUserMedia error : ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);