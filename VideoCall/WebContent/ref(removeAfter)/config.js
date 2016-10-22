/**
 * 
 */
    var g_projectKey = "60ba608a-e228-4530-8711-fa38004719c1";
    var g_iceServers = null;
    var g_video_constrains = {
      minWidth: 640,
      minHeight: 480,
      maxWidth: 640,
      maxHeight: 480
    };
    var g_video_bandwidth = 2500;
    var g_data_bandwidth = 1638400;
    var g_ckbTurn = false;
    var g_ckbRing = false;
    
    $(':radio[name="optionsRadios"]').change(function(){
      if(this.value === "nagTurn"){
        $("#userTurnSetting").hide();
      } else{
        $("#userTurnSetting").show();
      }
    });

    $("#configSave").click(function(){
        var iceServers_value = $(':radio[name="optionsRadios"]:checked').val();

        if(iceServers_value === "nagTurn"){
          g_iceServers = null;
        } else{
          var ip = $("#turnIp").val();
          var username = $("#turnUsername").val();
          var pwd = $("#turnPwd").val();

          if(!ip || !username || !pwd){
            alert("must set turn!!");
            return;
          }

          g_iceServers = [{
            url: "turn:" + ip,
            credential: pwd,
            username: username
          }];
        }
        
        g_projectKey = $("#projectKey").val();

        g_video_constrains.minWidth = parseInt($("#minWidth").val());
        g_video_constrains.minHeight = parseInt($("#minHeight").val());
        g_video_constrains.maxWidth = parseInt($("#maxWidth").val());
        g_video_constrains.maxHeight = parseInt($("#maxHeight").val());

        g_video_bandwidth = parseInt($("#videoBandwidth").val());
        g_data_bandwidth = parseInt($("#dataBandwidth").val());
        g_ckbTurn = $("#ckbTurn").is(":checked");
        g_ckbRing = $("#ckbRing").is(":checked");
        
        channelListApp = new PlayRTC({
            projectKey: g_projectKey,
            video: false,
            audio: false
          });
        $('#channelList').empty();
        getChannelList();

        alert("save completed!!");
    });
    
