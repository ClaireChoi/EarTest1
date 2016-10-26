/**
 * 
 */
$(function(){
	
	var status = false;
	var chId = '';
	var mouse_clicked = false;
	
	$('img#checkbox_leapmotion').on('click',  function(){
		if(!status) {
			$(this).attr('src', 'img/check.png');
			status = true;
			$('div#manual').css('display', 'block');
			$('div#goto_next_pg').css('display', 'block');
		} else {
			$(this).attr('src', 'img/non_check.png');
			status = false;
			$('div#manual').css('display', 'none');
			$('div#goto_next_pg').css('display', 'none');
		}
	});
	
	$('img.next_arrow').on({
		mouseenter: function(){},
		mouseleave: function(){},
		click: function(){
			chId =  $('#createChannelId').val();
			
			if(chId != ''){
				alert('ddd');
				var appCallee;
				
				appCallee = new PlayRTC({
				      projectKey: '60ba608a-e228-4530-8711-fa38004719c1',
				      localMediaTarget: 'calleeLocalVideo',
				      remoteMediaTarget: 'calleeRemoteVideo',
				      ring: true
				});
				
				appCallee.getChannel(chId, function(data){
					alert('success');
				 	console.log(data.channelId);
				 	console.log(data.peers);
				 	console.log(data.status);
				 	
				 	//alert(data.status)
				 	
				 	if (data.status!='nothing') {
				 		var form = document.getElementById("enter_form");
						form.submit();
						alert(' connect submit');
					} else {
						alert("해당 채널이 존재하지 않습니다.");
					}
				 	
				}, function(xhr, res){
					alert('xhr: ' + xhr + 'res : ' + res);
					alert("접속중에 오류가 발생하였습니다. 새로고침 후 다시 시도해주세요.");
				});
				
			} else {
				var form = document.getElementById("enter_form");
				form.submit();
				alert(' create submit');
			}
			
			}
			
			/*$(this).animate({ left:"+=300px" }, 2500 );
			if(chId === ''){
				alert("channel: " + chId);
				$(this).attr('id', 'createChannel');
				
				var appCaller;

			    appCaller = new PlayRTC({
			      projectKey: '60ba608a-e228-4530-8711-fa38004719c1',
			      localMediaTarget: 'callerLocalVideo',
			      remoteMediaTarget: 'callerRemoteVideo',
			      ring: true
			    });
			    
				appCaller.createChannel();
				
				appCaller.on('connectChannel', function(channelId) {
			    	alert('create');
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

			    
			} else {
				alert("channel: " + chId);
				$(this).attr('id', 'connectChannel');
				
				var appCallee;
			    var channelId = '';
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
			}*/
	});
	
	
});