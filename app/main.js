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

const buttonMuteElement = document.querySelector("button#bellButton");
const buttonMenuElement = document.querySelector("button#menuButton");
const containerElement = document.querySelector("section#pomodoro");
const menuElement = document.querySelector("nav.menu");
const displayElement = containerElement.querySelector(".display");
const messageElement = containerElement.querySelector(".message");
const playElement = containerElement.querySelector(".play-container");
const displayContainerElement =
  containerElement.querySelector(".clock-container");
const audioElement = containerElement.querySelector("audio");

function getNextBlock() {
  if (clockStatus.cycles === blockTime.breaksCycle) {
    clockStatus.cycles = 0;
    displayContainerElement.classList.remove(
      "short-break",
      "long-break",
      "work-time"
    );
    containerElement.classList.add("long-break");
    return blockType.longBreak;
  }

  if (clockStatus.actualBlock === blockType.workTime) {
    clockStatus.cycles++;
    displayContainerElement.classList.remove(
      "short-break",
      "long-break",
      "work-time"
    );
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
  if (clockStatus.actualBlock === blockType.workTime) {
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

    if (clockStatus.currentTime >= clockStatus.selectedBlockTime) {
      changeActualBlock();
    }

    // Mostramos el tiempo restante
    // sacamos minutos y segundos
    const remainingTime =
      clockStatus.selectedBlockTime - clockStatus.currentTime;

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
  const imgElement = buttonMuteElement.querySelector("img");

  if (audioElement.muted) {
    audioElement.muted = false;
    imgElement.src = "assets/img/bell-on.svg";
    return;
  }

  audioElement.muted = true;
  imgElement.src = "assets/img/bell-off.svg";
};

const menuSwitch = (event) => {
  const { target } = event;
  const imgElement = target;

  if (menuElement.classList.contains("ux-menu-show")) {
    menuElement.classList.remove("ux-menu-show");
    menuElement.classList.add("ux-menu-hide");
    imgElement.src = "assets/img/menu.svg";
    return;
  }

  menuElement.classList.remove("ux-menu-hide");
  menuElement.classList.add("ux-menu-show");
  imgElement.src = "assets/img/close.svg";

  buttonExitElement = menuElement.querySelectorAll("button#exit");

  buttonExitElement[0].addEventListener("click", () => {
    window.electronAPI.minimize();
    window.electronAPI.sendNotification({
      title: "🍅 Pomodoro",
      body: "El Pomodoro minimizado en la bandeja de sistema",
    });
  });
};

const clockTrigger = () => {
  if (clockStatus.isStopped) {
    clockStatus.isStopped = false;
    startTimer();
    if (clockStatus.cycles === 1) {
      playElement.classList.remove("ux-show");
      playElement.classList.add("ux-hide");
    }
  } else {
    clockStatus.isStopped = true;
    stopTimer();
    messageElement.textContent = "Pomodoro detenido";
    playElement.classList.remove("ux-show");
    playElement.classList.add("ux-hide");
  }
};

buttonMenuElement.addEventListener("click", (event) => {
  menuSwitch(event);
});

buttonMuteElement.addEventListener("click", (event) => {
  muteSwitch(event);
});

containerElement.addEventListener("click", (event) => {
  clockTrigger();
});

window.electronAPI.on("silence", () => {
  muteSwitch();

  if (!audioElement.muted) {
    window.electronAPI.sendNotification({
      title: "🍅 Pomodoro",
      body: "Alarma activada",
    });
    return;
  }

  window.electronAPI.sendNotification({
    title: "🍅 Pomodoro",
    body: "Alarma desactivada",
  });
});

window.electronAPI.on("stopResume", () => {
  clockTrigger();

  if (clockStatus.isStopped) {
    window.electronAPI.sendNotification({
      title: "🍅 Pomodoro",
      body: "Pomodoro detenido",
    });
    return;
  }

  window.electronAPI.sendNotification({
    title: "🍅 Pomodoro",
    body: "Pomodoro reanudado",
  });
});

document.querySelectorAll("a[href]").forEach((enlace) => {
  enlace.addEventListener("click", (event) => {
    event.preventDefault();
    window.electronAPI.openLink(enlace.href);
  });
});
