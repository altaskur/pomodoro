
// Pomodoro texts
const blockTexts = {
  workTime: "Trabajando",
  shortBreak: "Descanso corto",
  longBreak: "Descanso largo",
};

const blockTime = {
  workTime: Math.round(30 * 60), // 30 minutos
  shortBreak: Math.round(5 * 60), // 5 minutos
  longBreak: Math.round(10 * 60), // 10 minutos
  breaksCycle: 4,
};

// blocType
const blockType = {
  workTime: "workTime",
  shortBreak: "shortBreak",
  longBreak: "longBreak",
};

//  Pomodoro Stauts
const clockStatus = {
  cycles: 1,
  currentTime: 0,
  isStopped: true,
  actualBlock: blockType.workTime,
  selectedBlockTime: blockTime.workTime,
};

// Pomodoro Elements
const mainElement = document.querySelector("main");

const bellElement = document.querySelector("button.bell-container");
const containerElement = document.querySelector("section#pomodoro");
const displayElement = containerElement.querySelector(".display");
const messageElement = containerElement.querySelector(".message");
const playElement = containerElement.querySelector(".play-container");
const displayContainerElement = containerElement.querySelector(".clock-container");
const audioElement = containerElement.querySelector("audio");


function getNextBlock() {
  if (clockStatus.cycles === blockTime.breaksCycle) {
    clockStatus.cycles = 0;
    displayContainerElement.classList.remove("short-break", "long-break", "work-time");
    containerElement.classList.add("long-break");
    return blockType.longBreak;
  }

  if (clockStatus.actualBlock === blockType.workTime) {
    clockStatus.cycles++;
    displayContainerElement.classList.remove("short-break", "long-break", "work-time");
    containerElement.classList.add("short-break");
    return blockType.shortBreak;
  }

  containerElement.classList.remove("short-break", "long-break", "work-time");
  containerElement.classList.add("work-time");
  return blockType.workTime;
}

function changeActualBlock() {
    clockStatus.actualBlock = getNextBlock();
    clockStatus.selectedBlockTime = blockTime[clockStatus.actualBlock];
    clockStatus.currentTime = 0;
}

function startStopSoundAlert() {

  if(clockStatus.actualBlock === blockType.workTime) {
    return;
  }

  // Comprobamos el tiempo restante para activar la alarma
  // Sonará 3 veces, una vez por cada minuto * uno de silencio.
  const remainingTime = clockStatus.selectedBlockTime - clockStatus.currentTime;

  if (remainingTime != 0 && remainingTime <= 6) {
    audioElement.play();
    return;
  }

  setTimeout(() => {
    audioElement.pause();
  }, 300);
  return;
}

function startTimer() {

  contador = window.setInterval(() => {
    // Start counting
    clockStatus.currentTime++;

    if ( clockStatus.currentTime >= clockStatus.selectedBlockTime) {
      changeActualBlock();
    };

    // Mostramos el tiempo restante
    // sacamos minutos y segundos
    const remainingTime = clockStatus.selectedBlockTime - clockStatus.currentTime;

    startStopSoundAlert();

    minutos = Math.floor(remainingTime / 60);
    segundos = remainingTime % 60;
    displayElement.textContent =
      (minutos < 10 ? "0" + minutos : minutos) +
      ":" +
      (segundos < 10 ? "0" + segundos : segundos);
    messageElement.textContent = blockTexts[clockStatus.actualBlock];
  }, 1000);
}

function stopTimer() {
  window.clearTimeout(contador);
}

const muteSwitch = () => {
  if(audioElement.muted) {
    audioElement.muted = false;
    bellElement.classList.remove("bell-off");
    return;
  }

  audioElement.muted = true;
  bellElement.classList.add("bell-off");
};

const clockTrigger = () => {

  if (!clockStatus.isStopped) {
    clockStatus.isStopped = true;
    stopTimer();

    messageElement.textContent = "Pomodoro detenido";
    playElement.classList.remove("ux-show");
    playElement.classList.add("ux-hide");
    return;
  }


  if(clockStatus.cycles === 1) {
    playElement.classList.remove("ux-show");
    playElement.classList.add("ux-hide");
  }

  clockStatus.isStopped = false;
  startTimer();
};

mainElement.addEventListener("click", (event) => {
  const classListContain = event.target.classList.contains("bell-img");
  if (event.target.tagName === "MAIN" || !classListContain) {
    clockTrigger();
    return;
  }

  muteSwitch();
  return;
});

