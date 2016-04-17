    var socket = io();
    function getUrlParam()
    {
      var reg = new RegExp("(^|&)"+ "session" +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r!=null) return unescape(r[2]); return null; //返回参数值
    } 

    var playlist = [];
    //playlist.push("M7lc1UVf-VE");
    console.log(getUrlParam());
    if(getUrlParam()==null)
    {
      dateObj=new Date();
      var session=dateObj.getTime();
      window.location.href=window.location+"?session=" +session;
    }
    else
    {
      var session=getUrlParam();
    }
    var sycctrl="chat";
    //var sycctrl="ctrl" + session;
    console.log(sycctrl);
     $.ajax({
        type:'POST',
        async : false,
        data:{
            name:session
        },
        url:'../register',
        success: function (data) {
            if(data == "exists"){
                console.log("exists");
            }else if(data == 'error'){
                console.log("error");
            }else{
                console.log("success")

            }

        }
    })

     $.ajax(
        {
            url:"../getListByName?name="+session,
            type:'get',
            async : false,
            success: function (data) {
                event = JSON.parse(data);
                console.log(event)
                for (var i = 0; i < event.playlist.length; i++) {
                  playlist.push(event.playlist[i]);
                }
            }
    })
    var youtube_key="AIzaSyB0cy6KkKE0gGRkuwdreEDGMcfrxkTnWBk";
    var count=0;

    function getTitle(id)
    {$.ajax({
          url: "https://www.googleapis.com/youtube/v3/videos?id="+id+"&key="+youtube_key+"&part=snippet&fields=items(id,snippet(title,thumbnails(default)))",
          async : false,
        success: function (data) {
            //alert(data);
            console.log(data);
            //d = JSON.parse(data);
            //console.log(d);
            //console.log(data.items[0].id);
            $messages.append(data.items[0].snippet.title);
            return data.items[0].snippet.title;
        }
    });}


      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: playlist[0],
          events: {
            //'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        switch(event.data){
          case YT.PlayerState.ENDED:
          next();
          break;
          default:
          break;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }

      window.addEventListener( 'resize', function() {
        if ( window.innerWidth >= 992 ) {
          if ( player === null ) {
                    player = new YT.Player('player', {
                      height: '390',
                      width: '640',
                      videoId: playlist[0],
                      events: {
                        //'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                      }
                    });
          }
        }
        else
        {
          player.destroy(); // Destroy the video player
          player = null;
        }
      });

      function play()
      {
        player.playVideo();
        socket.emit(sycctrl,"play" +","+session);
      }

      function pause()
      {
        player.pauseVideo();
        socket.emit(sycctrl,"pause" +","+session);
      }

      function stop()
      {
        player.stopVideo();
        count=0;
        socket.emit(sycctrl,"stop" +","+session);
      }

      function mute()
      {
        player.mute();
        socket.emit(sycctrl,"mute" +","+session);
      }

      function unmute()
      {
        player.unMute();
        socket.emit(sycctrl,"unmute" +","+session);
      }

      function rewind()
      {
        var currentTime = player.getCurrentTime();
        player.seekTo( currentTime - 2.0 );
        socket.emit(sycctrl,"rewind" +","+session);
      }

      function fast_forward()
      {
        var currentTime = player.getCurrentTime();
        player.seekTo( currentTime + 2.0 );
        socket.emit(sycctrl,"fast_forward" +","+session); 
      }

      function previous()
      {
        var id = playlist[count- 1 ]; // Get the next video ID in the playlist
        if(id!=undefined)
        {
          player.loadVideoById( id ); // Change the current video
          count--; 
        }
        socket.emit(sycctrl,"previous" +","+session);
      }

      function next()
      {
        var id = playlist[count+ 1 ]; // Get the next video ID in the playlist
        if(id!=undefined)
        {
          player.loadVideoById( id ); // Change the current video
          count++; 
        }
        socket.emit(sycctrl,"next" +","+session);
      }

   function youtube_parser(url){
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = url.match(regExp);
      console.log(match[7]);
      return (match&&match[7].length==11)? match[7] : false;
  }

    function valid(url)
    {
      if(url.length!=11)
      {
        url=youtube_parser(url);
      }
      return url;
    }

    function clearAll()
    {
      socket.emit(sycctrl,"clearAll" +","+session);
      $messages.empty();
      playlist=[];
      $.ajax({
        type:'POST',
        data:{
            session:session
        },
        url:'../clearAll',
        success: function (data) {
            if(data == "exists"){
                console.log("exists");
            }else if(data == 'error'){
                console.log("error");
            }else{
                console.log("success")
            }

        }
    });
    }

  var $m = $( '#m' );
  console.log($m.val());


  var $messages = $( '#messages' );
  for (var i = 0; i < playlist.length; i++) {
    $messages.append( '<li>' + playlist[i] + '</li>');
  }
 // var sycadd="chat" + session;
  $( '#form' ).on( 'submit', function( e ) {
    e.preventDefault();
    var url=valid($m.val());
    if(url!=false)
    {
      socket.emit(sycctrl, url +","+session);
      $m.val( '' );
      playlist.push(url);
      if(playlist.length==1)
      {
        player.loadVideoById(url);
      }
      //$messages.append( '<li>' + url + '</li>'); 
      $.ajax({
        type: 'POST',
        url: '../addSession',
        traditional: true,
        data: {
            session:session,
            events: playlist
        },
        success: function (data) {
            if (data == "success") {
                console.log('添加成功');
            }
            else
                console.log("添加失败");
        }
    })
    }
    else
    {
      alert("invalid data");
    }
  });
  socket.on( sycctrl, function( data ) {
    console.log(data);
    if(!Array.isArray(data)){
      data = data.split(",");
    }
    if(data[1]==session && data[0].length==11)
    {
      $messages.append( '<li>' + data[0] +" " );
      getTitle(data[0]);
      $messages.append(' </li>');   
    }

  });

  socket.on( sycctrl, function( temp ) {
    console.log(temp);
    if(!Array.isArray(temp)){
      var temp = temp.split(",");
    }
    if(temp[1]==session){
     var data=temp[0];
    if(data=="play")
    {
      play1();
    }
    else if(data=="pause")
    {
      pause1();
    }
    else if(data=="stop")
    {
      stop1();
    }
    else if(data=="previous")
    {
      previous1();
    }
    else if(data=="rewind")
    {
      rewind1();
    }
    else if(data=="fast_forward")
    {
      fast_forward1();
    }
    else if(data=="next")
    {
      next1();
    }
    else if(data=="mute")
    {
      mute1();
    }
    else if(data=="unmute")
    {
      unmute1();
    }
    else if(data=="clearAll")
    {
      clearAll1();
    }
  }
  });


      function play1()
      {
        player.playVideo();
      }

      function pause1()
      {
        player.pauseVideo();
      }

      function stop1()
      {
        player.stopVideo();
        count=0;
      }

      function mute1()
      {
        player.mute();
      }

      function unmute1()
      {
        player.unMute();
      }

      function rewind1()
      {
        var currentTime = player.getCurrentTime();
        player.seekTo( currentTime - 2.0 );
      }

      function fast_forward1()
      {
        var currentTime = player.getCurrentTime();
        player.seekTo( currentTime + 2.0 );
      }

      function previous1()
      {
        var id = playlist[count- 1 ]; // Get the next video ID in the playlist
        if(id!=undefined)
        {
          player.loadVideoById( id ); // Change the current video
          count--; 
        }
      }

      function next1()
      {
        var id = playlist[count+ 1 ]; // Get the next video ID in the playlist
        if(id!=undefined)
        {
          player.loadVideoById( id ); // Change the current video
          count++; 
        }
      }

    function clearAll1()
    {
      $messages.empty();
      playlist=[];
      $.ajax({
        type:'POST',
        data:{
            session:session
        },
        url:'../clearAll',
        success: function (data) {
            if(data == "exists"){
                console.log("exists");
            }else if(data == 'error'){
                console.log("error");
            }else{
                console.log("success")
            }

        }
    });
    }