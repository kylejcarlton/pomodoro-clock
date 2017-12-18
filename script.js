$(document).ready(function(){
  var workTime = 1500000, breakTime = 300000, workTimeLeft, breakTimeLeft, minutes, seconds, percent;

  workTimeLeft = workTime;
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
    console.log(percent);
    $("#wtleft").css("width", percent);
    if(workTimeLeft == 0){
      clearInterval(x);
    }
  }

}); //END DOC READY
