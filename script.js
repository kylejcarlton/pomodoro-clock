$(document).ready(function(){
  var workTime = 1500000, breakTime = 300000, workTimeLeft, breakTimeLeft, minutes, seconds, percent, pomodoros=0;
  workTimeLeft = workTime;
  breakTimeLeft = breakTime;
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
    //workTimeLeft=0;
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

}); //END DOC READY
