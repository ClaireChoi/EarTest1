/**
 * 
 */
    'use strict';

    var createChannelButton = document.querySelector('#createChannel');
    var createChannelIdInput = document.querySelector('#createChannelId');
    var appCaller;

    appCaller = new PlayRTC({
      projectKey: '60ba608a-e228-4530-8711-fa38004719c1',
      localMediaTarget: 'callerLocalVideo',
      remoteMediaTarget: 'callerRemoteVideo',
      ring: true
    });

    appCaller.on('connectChannel', function(channelId) {
      createChannelIdInput.value = channelId;
    });

    appCaller.on('ring', function(pid, uid) {
      if (window.confirm('Would you like to get a call?')) {
        appCaller.accept(pid);
      } else {
        appCaller.reject(pid);
      }
    });

    appCaller.on('accept', function() {
      alert('Peer get your connect.');
    });

    appCaller.on('reject', function() {
      alert('Peer turn down your connect.');
    });

    createChannelButton.addEventListener('click', function(event) {
      event.preventDefault();
      appCaller.createChannel();
      $('#disconnectChannel_caller').css('display', 'block');
    }, false);
    
    $('#disconnectChannel_caller').on('click', function(event){
    	event.preventDefault();
    	if(window.confirm('통화를 종료하시겠습니까?'))	{
    		appCaller.disconnectChannel(pid);
    		$('#reset_btn').trigger('click');
    	} else {
    	}   	
    });
