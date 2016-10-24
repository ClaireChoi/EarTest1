/**
 * 
 */
    'use strict';

    var createChannelButton = document.querySelector('#createChannel');
    var createChannelIdInput = document.querySelector('#createChannelId');
    var refreshChannelButton = document.querySelector('#refreshChannel');
    var channelList = document.querySelector('#channelList');
    var getChannelList;
    var disconnectChannelButton = document.querySelector('#disconnectChannel');
    var startRemoteVideoRecordButton = document.querySelector('#startRemoteVideoRecord');
    var stopRemoteVideoRecordButton = document.querySelector('#stopRemoteVideoRecord');
    var saveRemoteVideoRecordButton = document.querySelector('#saveRemoteVideoRecord');
    var startLocalVideoRecordButton = document.querySelector('#startLocalVideoRecord');
    var stopLocalVideoRecordButton = document.querySelector('#stopLocalVideoRecord');
    var saveLocalVideoRecordButton = document.querySelector('#saveLocalVideoRecord');
    var chattingTimeline = document.querySelector('#timeline');
    var sendMessageInput = document.querySelector('#sendMessage');
    var selectFileInput = document.querySelector('#selectFile');
    var sendTextButton = document.querySelector('#sendText');
    var sendFileButton = document.querySelector('#sendFile');
    var sendFileToRemoteBar = document.querySelector('#sendFileToRemoteBar');
    var sendFileToRemoteBarWrapper = document.querySelector('#sendFileToRemoteBarWrapper');
    var remoteVideo = document.querySelector('#remoteVideo');
    var localVideo = document.querySelector('#localVideo');
    var recordedRemoteVideoBlob;
    var recordedRemoteVoiceBlob;
    var recordedLocalVideoBlob;
    var recordedLocalVoiceBlob;
    var userIdInput = document.querySelector('#userId');
    var userId;
    var app;

    var channelListApp = new PlayRTC({
      projectKey: g_projectKey,
      video: false,
      audio: false
    });


    function getChannelList() {
      channelListApp.getChannelList(function (result) {
        var channels = result.channels;
        var channelsLength = channels.length;

        while (channelList.hasChildNodes()) {
          channelList.removeChild(channelList.firstChild);
        }

        for (var i = 0; i < channelsLength; i++) {
          var channelListAnchor = document.createElement('a');
          var linkIcon = document.createElement('span');

          channelListAnchor.classList.add('list-group-item');
          channelListAnchor.setAttribute('data-channelid', channels[i].channelId);
          channelListAnchor.textContent = channels[i].channelId;

          linkIcon.classList.add('glyphicon', 'glyphicon-menu-right', 'pull-right');
          linkIcon.setAttribute('aria-hidden', 'true');

          channelListAnchor.appendChild(linkIcon);

          channelList.appendChild(channelListAnchor);
        }
      }, function (arg1, arg2){
    	  alert(arg2.error.message);
      });
    }

    getChannelList();


    function rtcStart(){
      app = new PlayRTC({
        projectKey: g_projectKey,
        localMediaTarget: 'localVideo',
        remoteMediaTarget: 'remoteVideo',
        iceServers: g_iceServers,
        video: g_video_constrains,
        bandwidth: {
          video: g_video_bandwidth,
          data: g_data_bandwidth
        },
        onlyTurn: g_ckbTurn,
        ring: g_ckbRing
      });

      app.on('connectChannel', function (channelId) {
        createChannelIdInput.value = channelId;
        getChannelList();
      });

      app.on('disconnectChannel', function (channelId) {
        createChannelIdInput.value = '';

        while (chattingTimeline.hasChildNodes()) {
          chattingTimeline.removeChild(chattingTimeline.firstChild);
        }

        getChannelList();
      });

      app.on('otherDisconnectChannel', function (channelId) {
        remoteVideo.src = '';

        while (chattingTimeline.hasChildNodes()) {
          chattingTimeline.removeChild(chattingTimeline.firstChild);
        }

        getChannelList();
      });
      
      app.on('ring', function(pid, uid){
  		if(window.confirm("수락?")){
  			app.accept(pid);
  		}
  		else{
  			app.reject(pid);
  		}
  	});

      app.on('addDataStream', function (pid, uid, dataChannel) {
        dataChannel.on('message', function (message) {
          var chatParagraph;

          if (message.type === 'text') {
            chatParagraph = document.createElement('p');
            chatParagraph.classList.add('local');
            chatParagraph.textContent = message.data;

            chattingTimeline.appendChild(chatParagraph);
          } else if (message.type === 'binary') {
            PlayRTC.utils.fileDownload(message.blob, message.fileName);
            sendFileToRemoteBar.style.width = '0px';
          }
        });

        dataChannel.on('progress', function (message) {
          var width = sendFileToRemoteBarWrapper.clientWidth;
          var progressbar = (width / message.fragCount) * (message.fragIndex + 1);

          if (message.totalSize === message.fragSize) {
            return;
          }

          sendFileToRemoteBar.style.width = progressbar + 'px';
        });

        dataChannel.on('error', function (event) {
          alert('ERROR. See the log.');
        });
      });
    }

    refreshChannelButton.addEventListener('click', function (event) {
      event.preventDefault();
      getChannelList();
    }, false);

    channelList.addEventListener('click', function (event) {
      rtcStart();
      var channelId = event.target.dataset.channelid;

      userId = userIdInput.value;

      app.connectChannel(channelId, {
    	  peer: {
          uid: userId
    	  }
      });

    }, false);

    createChannelButton.addEventListener('click', function (event) {
      rtcStart();
      event.preventDefault();

      userId = userIdInput.value;

      app.createChannel({
        peer: {
          uid: userId
        }
      })

    }, false);

    disconnectChannelButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      event.preventDefault();
      app.disconnectChannel();
    }, false);

    startRemoteVideoRecordButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      var peers = app.getAllPeer();
      var hasPeers = peers.length > 0;
      var firstPeerMedia = peers[0].getMedia();

      event.preventDefault();

      if (hasPeers) {
        firstPeerMedia.record();
      }
    }, false);

    stopRemoteVideoRecordButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      var peers = app.getAllPeer();
      var hasPeers = peers.length > 0;
      var firstPeerMedia = peers[0].getMedia();

      event.preventDefault();

      if (hasPeers) {
        firstPeerMedia.recordStop(function (blob) {
          recordedRemoteVideoBlob = blob;
        });
      }
    }, false);

    saveRemoteVideoRecordButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      event.preventDefault();
      if (recordedRemoteVideoBlob) {
        PlayRTC.utils.fileDownload(recordedRemoteVideoBlob, 'remote-video.webm');
      }
    }, false);

    startLocalVideoRecordButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      var media = app.getMedia();

      event.preventDefault();

      if (media) {
        media.record();
      }
    }, false);

    stopLocalVideoRecordButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      var media = app.getMedia();

      event.preventDefault();
      if (media) {
        media.recordStop(function (blob) {
          recordedLocalVideoBlob = blob;
        });
      }
    }, false);

    saveLocalVideoRecordButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      event.preventDefault();
      if (recordedLocalVideoBlob) {
        PlayRTC.utils.fileDownload(recordedLocalVideoBlob, 'local-video.webm');
      }
    }, false);

    sendTextButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      var chatParagraph;
      var message = sendMessageInput.value;

      event.preventDefault();

      if (message) {
        app.sendText(message);

        chatParagraph = document.createElement('p');
        chatParagraph.classList.add('remote');
        chatParagraph.textContent = message;

        chattingTimeline.appendChild(chatParagraph);
      }
      sendMessageInput.value = '';
    }, false);

    sendFileButton.addEventListener('click', function (event) {
      if(!app){
        return;
      }
      var myFile = selectFileInput.files[0];

      event.preventDefault();

      if (!myFile) {
        return false;
      }
      app.sendFile(myFile);
      selectFileInput.value = '';
    }, false);
