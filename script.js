$(document).ready(function(){
  var workTime = 1500000, breakTime = 300000, workTimeLeft, breakTimeLeft, minutes, seconds, percent, pomodoros=0, x, y, paused = true;
  var audioCtx;
  var beepBuffer;
  function getOrCreateAudioContext(){
    if(audioCtx){
      return audioCtx;
    }
    if(window.AudioContext){
      audioCtx = new AudioContext();
    }
    else if(window.webkitAudioContext){
      audioCtx = new webkitAudioContext();
    }
    return audioCtx || null;
  }
  workTimeLeft = workTime;
  breakTimeLeft = breakTime;

  function ensureAudioContextReady(){
    var context = getOrCreateAudioContext();
    if(!context){
      return Promise.resolve(null);
    }
    if(context.state === "suspended"){
      return context.resume().then(function(){
        return context;
      }).catch(function(){
        return context;
      });
    }
    return Promise.resolve(context);
  }

  function getBeepBuffer(context){
    if(beepBuffer){
      return beepBuffer;
    }
    var duration = 0.4; // seconds
    var sampleRate = context.sampleRate;
    var frameCount = Math.floor(sampleRate * duration);
    var buffer = context.createBuffer(1, frameCount, sampleRate);
    var data = buffer.getChannelData(0);
    for(var i = 0; i < frameCount; i++){
      var t = i / sampleRate;
      var envelope = Math.min(1, i / (sampleRate * 0.02)) * (1 - (i / frameCount));
      data[i] = Math.sin(2 * Math.PI * 660 * t) * envelope * 0.5;
    }
    beepBuffer = buffer;
    return buffer;
  }

  function playBeep(){
    ensureAudioContextReady().then(function(context){
      if(!context || context.state !== "running"){
        return;
      }
      var source = context.createBufferSource();
      source.buffer = getBeepBuffer(context);
      source.connect(context.destination);
      source.start();
    });
  }
  $(document).one("click keydown touchstart touchend", function(){
    ensureAudioContextReady();
  });
  $("#wTMinus").click(function(){
    if(workTime > 60000 && paused == true){
      workTime = workTime - 60000;
      workTimeLeft = workTime;
      minutes = Math.floor((workTime % (1000 * 60 * 60)) / (1000 * 60));
      $("#wt").html(minutes+":00");
    }
  });
  $("#wTPlus").click(function(){
    if(workTime > 60000 && paused == true){
      workTime = workTime + 60000;
      workTimeLeft = workTime;
      minutes = Math.floor((workTime % (1000 * 60 * 60)) / (1000 * 60));
      $("#wt").html(minutes+":00");
    }
  });
  $("#bTMinus").click(function(){
    if(breakTime > 60000 && paused == true){
      breakTime = breakTime - 60000;
      breakTimeLeft = breakTime;
      minutes = Math.floor((breakTime % (1000 * 60 * 60)) / (1000 * 60));
      $("#bt").html(minutes+":00");
    }
  });
  $("#bTPlus").click(function(){
    if(workTime > 60000 && paused == true){
      breakTime = breakTime + 60000;
      breakTimeLeft = breakTime;
      minutes = Math.floor((breakTime % (1000 * 60 * 60)) / (1000 * 60));
      $("#bt").html(minutes+":00");
    }
  });
  $("#play").click(function(){
    ensureAudioContextReady();
    if (paused == true) {
      if(breakTime == breakTimeLeft){
        $("#play").html('<i class="fa fa-pause fa-3x" aria-hidden="true"></i>');
        paused = false;
        x = setInterval(workingTime, 1000);
      }
      else{
        $("#play").html('<i class="fa fa-pause fa-3x" aria-hidden="true"></i>');
        paused = false;
        y = setInterval(breakTimeFunc, 1000);
      }
    }
    else{
      $("#play").html('<i class="fa fa-play fa-3x" aria-hidden="true"></i>');
      paused=true;
      clearInterval(x);
      clearInterval(y);
    }
    function workingTime(){
      workTimeLeft = workTimeLeft - 1000;
      var remainingWorkMs = Math.max(0, workTimeLeft);
      minutes = Math.floor((remainingWorkMs % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((remainingWorkMs % (1000 * 60)) / 1000);
      if(seconds < 10){
        seconds = "0" + seconds;
      }
      $("#wt").html(minutes+":"+seconds);
      percent = Math.round(remainingWorkMs/workTime*100);
      percent = percent+"%";
      $("#wtleft").css("width", percent);
      if(workTimeLeft <= 0){
        clearInterval(x);
        pomodoros++;
        $("#pomodoros").html(pomodoros);
        $("#wtleft").css("width", "100%");
        minutes = Math.floor((workTime % (1000 * 60 * 60)) / (1000 * 60));
        $("#wt").html(minutes+":00");
        breakTimeLeft = breakTime;
        workTimeLeft = workTime;
        playBeep();
        y = setInterval(breakTimeFunc, 1000);
      }
    }
    function breakTimeFunc(){
      breakTimeLeft = breakTimeLeft - 1000;
      var remainingBreakMs = Math.max(0, breakTimeLeft);
      minutes = Math.floor((remainingBreakMs % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((remainingBreakMs % (1000 * 60)) / 1000);
      if(seconds < 10){
        seconds = "0" + seconds;
      }
      $("#bt").html(minutes+":"+seconds);
      percent = Math.round(remainingBreakMs/breakTime*100);
      percent = percent+"%";
      $("#btleft").css("width", percent);
      if(breakTimeLeft <= 0){
        clearInterval(y);
        $("#btleft").css("width", "100%");
        minutes = Math.floor((breakTime % (1000 * 60 * 60)) / (1000 * 60));
        $("#bt").html(minutes+":00");
        workTimeLeft = workTime;
        breakTimeLeft = breakTime;
        playBeep();
        x = setInterval(workingTime, 1000);
      }
    }
  });
}); //END DOC READY
