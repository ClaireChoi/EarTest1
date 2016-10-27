/**
 * 
 */
$(function(){
	var chId = $('#createChannelId').val();
	alert("channel: " + chId);

	if(chId === ''){
		var appCaller;

	    appCaller = new PlayRTC({
	      projectKey: '60ba608a-e228-4530-8711-fa38004719c1',
	      localMediaTarget: 'callerLocalVideo',
	      remoteMediaTarget: 'callerRemoteVideo',
	      ring: true
	    });
	    
		appCaller.createChannel();
		
		appCaller.on('connectChannel', function(chId) {
	    	alert('create : ' + chId);
	    	document.getElementById('createChannelId').value=chId;
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

	    
	} else {
		var appCallee;
	    var pid = '';

	    appCallee = new PlayRTC({
	      projectKey: '60ba608a-e228-4530-8711-fa38004719c1',
	      localMediaTarget: 'calleeLocalVideo',
	      remoteMediaTarget: 'calleeRemoteVideo',
	      ring: true
	    });

	    appCallee.connectChannel(chId);
	    
	    appCallee.on('ring', function(pid, uid) {
	    	this.pid = pid;
	    	if (window.confirm('callee : Would you like to get a call?')) {
	    		appCallee.accept(pid);
	    	} else {
	        appCallee.reject(pid);
	    	}
	    });
	}
	
});

