let currentTimeSpan = document.getElementById('current-time');
let submitButton = document.querySelector("button[type='submit']");
const alarmAudio = document.getElementById("alarm-audio");
let form = document.querySelector('form');
let alarmList = document.querySelector('#alarm-list');

alarmAudio.src = "http://soundbible.com/grab.php?id=1252&type=mp3";
alarmAudio.load();

setInterval(()=>{
    currentTimeSpan.textContent = new Date().toLocaleTimeString();
},1000);

function showNotification(timeString, timerId){
    document.querySelector('.modal-start-button').click();
    let modalTitle = document.querySelector(".modal-body");
    modalTitle.textContent = `Hi! The time is ${timeString}`;
    let modalBody = document.querySelector('#staticBackdrop');
    modalBody.addEventListener('click', (event)=>{
        if(event.target.dataset.closeModal == "true"){
            stopMusic();
            clearTimeout(timerId);
        }
    })
}

function stopMusic(){
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
}

function playMusic(){
    alarmAudio.play();
    return setTimeout(stopMusic, 60000);
}

/* remove the alarm */
alarmList.addEventListener("click",(event)=>{
    if(event.target.dataset.clearAlarm == "true"){
        document.getElementById(event.target.dataset.parentId).remove();
        clearInterval(event.target.dataset.parentId);
        stopMusic();
    }
})

/* add alarm in the alarm lists */
function updateAlarmList(interval, timeString){
    let newAlarm = document.createElement('li');
    newAlarm.id = interval;
    newAlarm.className = "list-group-item d-flex justify-content-between align-items-center";
    newAlarm.textContent = timeString;
    let clearTag = document.createElement('span');
    clearTag.className = 'badge bg-danger rounded-pill';
    clearTag.textContent = "Clear";
    clearTag.dataset.clearAlarm = true;
    clearTag.dataset.parentId = interval;
    newAlarm.append(clearTag);
    alarmList.append(newAlarm);
}

function setAlarm(hour, minute, dayTime){
    hour = parseInt(hour);
    let timeString = `${hour}:${minute}:00 ${dayTime}`;
    
    var interval = setInterval((timeString)=>{
        let currentTime = new Date().toLocaleTimeString();
        if(timeString == currentTime){
            let timerId = playMusic();
            showNotification(timeString, timerId);
            document.getElementById(interval).remove();
            clearInterval(interval);
        }
    },1000,timeString, interval);
    updateAlarmList(interval, timeString);
}

function validate(hour, minute){
    console.log(hour, minute);
    if(hour > 12 || hour <= 0 || hour.length > 2 ||
        minute > 60 || minute < 0 || minute.length > 2){
        return false;
    }
    return true;
}


/* Save the alarm */
submitButton.addEventListener('click',(e)=>{
    e.preventDefault();
    let hour = document.querySelector('#hour').value;
    let minute = document.querySelector('#minute').value;
    let dayTime = document.querySelector('#day-time').value;
    if(validate(hour, minute)){
        setAlarm(hour, minute, dayTime);
    }else{
        alert('Enter the correct time');
    }
    form.reset();
})