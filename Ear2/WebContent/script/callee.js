/**
 * 
 */
 'use strict';
 
    var connectChannelIdInput = document.querySelector('#connectChannelId');
    var connectChannelButton = document.querySelector('#connectChannel');
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

    $('#connectChannel').on('click', function(event) {
     channelId = $('#createChannelId').val();
     event.preventDefault();
      if (channelId === '') {
    	  alert('채널ID를 입력해주세요');
        return;
      }
      appCallee.connectChannel(channelId);
      $('#disconnectChannel_callee').css('display', 'block');
    });
    
    $('#disconnectChannel_callee').on('click', function(event){
    	event.preventDefault();
    	if(window.confirm('통화를 종료하시겠습니까?')){
    		appCallee.disconnectChannel(pid);
    		// 상대방한테 통화가 종료되었습니다 alert 띄울라면?
    	} else {
    	}
    });
