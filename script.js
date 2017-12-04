$(document).ready(function(){
  var workTime = 1500000, breakTime = 300000, workTimeLeft, breakTimeLeft, minutes, seconds;

  workTimeLeft = workTime;
  setInterval(workingTime, 1000);
  function workingTime(){
    workTimeLeft = workTimeLeft - 1000;
    minutes = Math.floor((workTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((workTimeLeft % (1000 * 60)) / 1000);
    $("#wt").html(minutes+":"+seconds);

    if(workTimeLeft < 0){
      clearInterval();
    }
  }

}); //END DOC READY
