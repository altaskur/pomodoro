// constantes de tiempo [Minutos]

tiempoTrabajo = 25 * 60;
tiempoDescanso = 5 * 60;
tiempoDescansoLargo = 10 * 60;
activarDescansoLargo = 2; // Número de ciclos para activar el descanso largo.

//  variables control
ciclos = 0;
estaParado = true;
descanso = false;
totalCiclos = 0;
tiempo = 0;
tiempoRestante = 0;
estado = "";

// Capturas del html para mostrar el tiempo
pomodoroContainer = document.getElementById("pomodoro");
pomodoroReloj = document.getElementById("reloj");
pomodoroTexto = document.getElementById("texto");
pomodoroSonido = document.querySelector("audio");

// Eventos del pomodoro
pomodoroContainer.addEventListener("click", () => {
    estaParado === true ? (estaParado = false, empezarContar()) : (estaParado = true, pomodoroTexto = "estoy parado", dejarContar());

});

function empezarContar() {
    contador = window.setInterval(() => {
        // Empezamos a contar
        tiempo++;


        // Comprobamos si hay un descanso en marcha
        if (descanso === true) {

            // comprobamos el tipo de descanso
            if (ciclos == activarDescansoLargo) {

                // Entramos en descanso largo
                // Comprobamos que no se haya acabado el tiempo
                // reseteando los ciclos, el tiempo, el tiempo restante y el descanso
                // sino añadimos el tiempo restante.
                tiempo === tiempoDescansoLargo ? (descanso = false, ciclos = 0, tiempo = 0, tiempoRestante = 0) : tiempoRestante = (tiempoDescansoLargo - tiempo);
                
                // Añadimos el estado y la clase de CSS
                estado = "Descanso largo";
                pomodoroReloj.classList.add("descanso-largo");

            } else {

                // Entramos en descanso corto
                // Comprobamos que no se haya acabado el tiempo
                // reseteando los ciclos, el tiempo, el tiempo restante y el descanso
                // sino añadimos el tiempo restante.
                tiempo === tiempoDescanso ? (descanso = false, tiempo = 0, tiempoRestante = 0) : tiempoRestante = (tiempoDescanso - tiempo);

                // Añadimos el estado y la clase de CSS
                estado = "Descanso corto";
                pomodoroReloj.classList.add("descanso-corto");
            }


        } else {
            // Entramos en tiempo de trabajo.
            // reseteando los ciclos, el tiempo, el tiempo restante y el descanso
            // sino añadimos el tiempo restante.
            tiempo === tiempoTrabajo ? (descanso = true, tiempo = 0, ciclos++, tiempoRestante = 0) : tiempoRestante = (tiempoTrabajo - tiempo);

            // mostramos el estado del pomodoro
            estado = "Trabajando";
            pomodoroReloj.classList.remove("descanso-largo");
            pomodoroReloj.classList.remove("descanso-corto");
        }

        // Comprobamos el tiempo restante para activar la alarma
        // Sonará 3 veces, una vez por cada minuto * uno de silencio.
        tiempoRestante != 0 && tiempoRestante <= 6 ? (pomodoroSonido.play(), pomodoroReloj.classList.add("test")): (pomodoroSonido.pause(),  pomodoroReloj.classList.remove("test"));

        // Mostramos el tiempo restante
        // sacamos minutos y segundos
        minutos = Math.floor(tiempoRestante / 60)
        segundos = tiempoRestante % 60;
        pomodoroReloj.textContent = (minutos < 10 ? "0" + minutos : minutos) + ":" + (segundos < 10 ? "0" + segundos : segundos);
        pomodoroTexto.textContent = estado;

    }, 1000);
}

function dejarContar() {
    window.clearTimeout(contador);
}