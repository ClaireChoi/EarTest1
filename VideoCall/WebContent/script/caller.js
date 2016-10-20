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
      alert('connectChannel' + channelId);
    });

    appCaller.on('ring', function(pid, uid) {
      if (window.confirm('caller : Would you like to get a call?')) {
        alert('pid : ' + pid);
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
    	alert('addEventListener');
      event.preventDefault();
      appCaller.createChannel();
    }, false);
