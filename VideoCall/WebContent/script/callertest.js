/**
 * 
 */
'use strict';

var createChannelButton = document.querySelector('#createChannel');
var createChannelIdInput = document.querySelector('#createChannelId');
var appCaller;

/*appCaller란 이름으로 새로운 PlayRTC 객체(new PlayRTC)를 가리키도록 합니다. 
새로운 PlayRTC 객체를 생성할때, 설정 객체를 리터럴 형태의 인수로 넣어 두어 각종 설정을 할 수 있습니다. 
설정 객체에는 PlayRTC 플렛폼에서 제공하는 프로젝트 키와 Caller와 Callee의 영상이 표출될 Video 태그를 지정해 줍니다.*/
appCaller = new PlayRTC({
	projectKey: '60ba608a-e228-4530-8711-fa38004719c1',
	localMediaTarget: 'callerLocalVideo',
	remoteMediaTarget: 'callerRemoteVideo',
	ring: true
});

/*PlayRTC의 인스턴스 객체인 appCaller의 내장 기능중 이벤트를 다루는 on을 사용하여 connectChannel이벤트가 발생했으때, 
connectChannel이벤트의 결과물인 channelID를 Input 폼(createChannelId)에 넣어 사용자가 지금 만들어지고 접속한 채널의 ID를 알 수 있도록 합니다.
채널생성(createChannelButton)버튼을 클릭하면, 좀전에 생성한 appCaller객체를 통해 서버로 채널을 만들것을 요청합니다. 
그리고 성공적으로 채널이 생성되면 자동으로 서버의 채널에 접속하게 되고 이때 채널 번호를 Input 폼(createChannelId)에 넣도록 하는 코드입니다.
e.preventDefault();는 폼에 기본적으로 적용된 브라우저 동작을 사용하지 않도록 하는 기능입니다.*/

appCaller.on('connectChannel', function(channelId) {
	
    createChannelIdInput.value = channelId;
    alert('connectChannel : ' + channelId);
    $(function(){
    	$()
    });
    
    /*jQuery(document).ready(function($) {
    	$(".scroll").click(function(event){            
    	event.preventDefault();
    	$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
    	});
    	});
    alert('page scroll');*/
  });

createChannelButton.addEventListener('click', function(event) {
  event.preventDefault();
  appCaller.createChannel();
}, false);

appCaller.on('ring', function(pid, uid) {
    if (window.confirm('caller : Would you like to get a call?')) {
    	alert('pid : ' + pid);
  	  appCaller.accept(pid);
    } else {
      appCaller.reject(pid);
    }
  });

/*??여기 어케 동작함*/
  appCaller.on('accept', function() {
    alert('Peer get your connect.');
  });
ㄴ
  appCaller.on('reject', function() {
    alert('Peer turn down your connect.');
  });