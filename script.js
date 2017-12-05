$(document).ready(function(){
  var workTime = 1500000, breakTime = 300000, workTimeLeft, breakTimeLeft, minutes, seconds, percent;

  workTimeLeft = workTime;
  setInterval(workingTime, 1000);
  function workingTime(){
    workTimeLeft = workTimeLeft - 1000;
    minutes = Math.floor((workTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((workTimeLeft % (1000 * 60)) / 1000);
    $("#wt").html(minutes+":"+seconds);
    percent = workTimeLeft/workTime*100;
    //$("#wtupdate").html('<div id="worktime" style="width: 90%">');

    if(workTimeLeft < 0){
      clearInterval();
    }
  }

}); //END DOC READY
