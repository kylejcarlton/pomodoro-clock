$(document).ready(function(){
  var workTime = 1500000, breakTime = 300000, workTimeLeft, breakTimeLeft, minutes, seconds, percent, pomodoros=0;
  workTimeLeft = workTime;
  breakTimeLeft = breakTime;
  $("#wTMinus").click(function(){
    workTime = workTime - 60000;
    workTimeLeft = workTime;
    minutes = Math.floor((workTime % (1000 * 60 * 60)) / (1000 * 60));
    $("#wt").html(minutes+":00");
  })
  $("#playButton").click(function(){
    $("#play").html('<i class="fa fa-pause fa-3x" aria-hidden="true" id="pauseButton"></i>');
    var x = setInterval(workingTime, 1000);
    function workingTime(){
      workTimeLeft = workTimeLeft - 1000;
      minutes = Math.floor((workTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((workTimeLeft % (1000 * 60)) / 1000);
      if(seconds < 10){
        seconds = "0" + seconds;
      }
      $("#wt").html(minutes+":"+seconds);
      percent = Math.round(workTimeLeft/workTime*100);
      percent = percent+"%";
      $("#wtleft").css("width", percent);
      if(workTimeLeft == 0){
        clearInterval(x);
        pomodoros++;
        $("#pomodoros").html(pomodoros);
        var y = setInterval(breakTimeFunc, 1000);
      }
    }
    function breakTimeFunc(){
      breakTimeLeft = breakTimeLeft - 1000;
      minutes = Math.floor((breakTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((breakTimeLeft % (1000 * 60)) / 1000);
      if(seconds < 10){
        seconds = "0" + seconds;
      }
      $("#bt").html(minutes+":"+seconds);
      percent = Math.round(breakTimeLeft/breakTime*100);
      percent = percent+"%";
      $("#btleft").css("width", percent);
      if(breakTimeLeft == 0){
        clearInterval(y);
        x = setInterval(workTime, 1000);
        }
    }
    $("#pauseButton").click(function(){
      $("#play").html('<i class="fa fa-play fa-3x" aria-hidden="true" id="playButton"></i>');
      workTimeLeft = workTimeLeft;
      breakTimeLeft = breakTimeLeft;
      clearInterval(x);
      clearInterval(y);
    });
  });

}); //END DOC READY
