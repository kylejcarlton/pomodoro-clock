$(document).ready(function(){
  var workTime = 1500000, breakTime = 300000, workTimeLeft, breakTimeLeft, minutes, seconds, percent, pomodoros=0, x, y, paused = true;
  workTimeLeft = workTime;
  breakTimeLeft = breakTime;
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
        $("#wtleft").css("width", "100%");
        minutes = Math.floor((workTime % (1000 * 60 * 60)) / (1000 * 60));
        $("#wt").html(minutes+":00");
        breakTimeLeft = breakTime;
        y = setInterval(breakTimeFunc, 1000);
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
        $("#btleft").css("width", "100%");
        minutes = Math.floor((breakTime % (1000 * 60 * 60)) / (1000 * 60));
        $("#bt").html(minutes+":00");
        workTimeLeft = workTime;
        x = setInterval(workingTime, 1000);
      }
    }
  });
}); //END DOC READY
