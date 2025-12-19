$(document).ready(function(){
  var workTime = 1500000, breakTime = 300000, workTimeLeft, breakTimeLeft, minutes, seconds, percent, pomodoros=0, x, y, paused = true;
  var audioCtx;
  var masterGain;
  var beepBuffer;
  var fallbackAudio;
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

  function getMasterGain(context){
    if(!context){
      return null;
    }
    if(masterGain){
      return masterGain;
    }
    masterGain = context.createGain();
    masterGain.gain.value = 0.85;
    masterGain.connect(context.destination);
    return masterGain;
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

  function primeAudio(){
    ensureAudioContextReady().then(function(context){
      if(!context){
        return;
      }
      var gainNode = getMasterGain(context);
      var osc = context.createOscillator();
      var gain = context.createGain();
      var now = context.currentTime;
      osc.frequency.value = 40;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.06);
    });

    try{
      var unlockedFallback = getFallbackAudio();
      var playAttempt = unlockedFallback.play();
      if(playAttempt && playAttempt.then){
        playAttempt.then(function(){
          unlockedFallback.pause();
          unlockedFallback.currentTime = 0;
        }).catch(function(){});
      }
    }
    catch(e){}
  }

  function getBeepBuffer(context){
    if(beepBuffer){
      return beepBuffer;
    }
    var duration = 1.5; // longer, more sustained alert
    var sampleRate = context.sampleRate;
    var frameCount = Math.floor(sampleRate * duration);
    var buffer = context.createBuffer(1, frameCount, sampleRate);
    var data = buffer.getChannelData(0);
    var attack = 0.03;
    var decay = 0.18;
    var sustainLevel = 0.78;
    var release = 0.35;
    for(var i = 0; i < frameCount; i++){
      var t = i / sampleRate;
      var envelope;
      if(t < attack){
        envelope = t / attack;
      }
      else if(t < attack + decay){
        envelope = 1 - (1 - sustainLevel) * ((t - attack) / decay);
      }
      else if(t < duration - release){
        envelope = sustainLevel;
      }
      else{
        envelope = sustainLevel * Math.max(0, (duration - t) / release);
      }
      var sub = Math.sin(2 * Math.PI * 110 * t) * 0.95;
      var fundamental = Math.sin(2 * Math.PI * 220 * t) * 0.95;
      var lowMid = Math.sin(2 * Math.PI * 330 * t) * 0.55;
      var harmonic = Math.sin(2 * Math.PI * 440 * t) * 0.32;
      data[i] = (sub + fundamental + lowMid + harmonic) * envelope * 0.65;
    }
    beepBuffer = buffer;
    return buffer;
  }

  function createFallbackToneUri(){
    var sampleRate = 16000;
    var duration = 0.5;
    var frequency = 520;
    var harmonic = 1040;
    var samples = Math.floor(sampleRate * duration);
    var dataSize = samples * 2;
    var buffer = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buffer);

    function writeString(offset, str){
      for(var i = 0; i < str.length; i++){
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    var offset = 44;
    for(var i = 0; i < samples; i++){
      var t = i / sampleRate;
      var sample = Math.sin(2 * Math.PI * frequency * t) * 0.72 + Math.sin(2 * Math.PI * harmonic * t) * 0.32;
      var clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, clamped * 0x7FFF, true);
      offset += 2;
    }

    var bytes = new Uint8Array(buffer);
    var binary = "";
    for(var b = 0; b < bytes.length; b++){
      binary += String.fromCharCode(bytes[b]);
    }
    return "data:audio/wav;base64," + btoa(binary);
  }

  function getFallbackAudio(){
    if(fallbackAudio){
      return fallbackAudio;
    }
    var uri = createFallbackToneUri();
    fallbackAudio = new Audio(uri);
    fallbackAudio.volume = 0.8;
    return fallbackAudio;
  }

  function playFallbackBeep(){
    try{
      var tone = getFallbackAudio();
      tone.currentTime = 0;
      var playPromise = tone.play();
      if(playPromise && playPromise.catch){
        playPromise.catch(function(){});
      }
    }
    catch(e){}
  }

  function playBeep(){
    ensureAudioContextReady().then(function(context){
      if(!context || context.state !== "running"){
        playFallbackBeep();
        return;
      }
      var source = context.createBufferSource();
      source.buffer = getBeepBuffer(context);
      var destination = getMasterGain(context) || context.destination;
      source.connect(destination);
      source.start();
      playFallbackBeep();
    });
  }
  $(document).one("click keydown touchstart touchend pointerdown", function(){
    primeAudio();
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
