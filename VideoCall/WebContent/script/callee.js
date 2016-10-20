/**
 * 
 */
 'use strict';
 
    var connectChannelIdInput = document.querySelector('#connectChannelId');
    var connectChannelButton = document.querySelector('#connectChannel');
    var appCallee;

    appCallee = new PlayRTC({
      projectKey: '60ba608a-e228-4530-8711-fa38004719c1',
      localMediaTarget: 'calleeLocalVideo',
      remoteMediaTarget: 'calleeRemoteVideo',
      ring: true
    });

    appCallee.on('ring', function(pid, uid) {
      if (window.confirm('callee : Would you like to get a call?')) {
        appCallee.accept(pid);
      } else {
        appCallee.reject(pid);
      }
    });

    connectChannelButton.addEventListener('click', function(event) {
      var channelId = connectChannelIdInput.value;
      alert('callee:'+channelId);

      event.preventDefault();
      if (!channelId) {
        return;
      }
      appCallee.connectChannel(channelId);
    }, false);