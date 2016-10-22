/**
 * 
 */
 'use strict';
 
    var connectChannelIdInput = document.querySelector('#connectChannelId');
    var connectChannelButton = document.querySelector('#connectChannel');
    var connectChannelValue = document.getElementById("channelId_callee");
    var appCallee;
    var channelId = '';
    var pid = '';

    appCallee = new PlayRTC({
      projectKey: '60ba608a-e228-4530-8711-fa38004719c1',
      localMediaTarget: 'calleeLocalVideo',
      remoteMediaTarget: 'calleeRemoteVideo',
      ring: true
    });

    appCallee.on('ring', function(pid, uid) {
    	this.pid = pid;
      if (window.confirm('callee : Would you like to get a call?')) {
        appCallee.accept(pid);
      } else {
        appCallee.reject(pid);
      }
    });

    connectChannelButton.addEventListener('click', function(event) {
      channelId = connectChannelIdInput.value;
     connectChannelValue.value = channelId;

      event.preventDefault();
      if (!channelId) {
        return;
      }
      appCallee.connectChannel(channelId);
    }, false);
    
    $('#disconnectChannel_callee').on('click', function(event){
    	event.preventDefault();
    	if(window.confirm('통화를 종료하시겠습니까?')){
    		appCallee.disconnectChannel(pid);
    		// 상대방한테 통화가 종료되었습니다 alert 띄울라면?
    	} else {
    	}
    });
