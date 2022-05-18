// Dónde se guardarán los ciclos del reloj
var ciclo = 0;

// Dónde se guardará si el reloj esta [Descanso, Contando, Parado]
var estaParado = true;
var tiempo = 0;
var descanso = false;
var totalCiclos = 0;

var tiempoTrabajado = 0;
var totalDescansos = 0;
var tiempoDescanso = 0;

// cantidad de ciclos para hacer una Descanso Largo
var cicloDescansoLargo = 2;

// OPCIONES DEL RELOJ en minutos \\
var duracionCiclo = 25;
var duracionDescanso = 5;
var duracionDescansoLargo = 10;

// Pasamos de minutos a milisegundos.

duracionCiclo = duracionCiclo * 60;
duracionDescanso = duracionDescanso * 60;
duracionDescansoLargo = duracionDescansoLargo * 60;

// duracion alarma
var duracionAlarma = 5;

// Capturamos los contenedores del pomodoro
let pomodoroReloj = document.getElementById("reloj");
let pomodoroContainer = document.getElementById("pomodoro");
let pomodoroEstado = document.getElementById("estado")


pomodoroContainer.addEventListener("click", () => {
    estaParado == true ? estaParado = false : estaParado = true;
    estaParado == true ? pomodoroEstado.textContent = "Estoy Parado" : " ";
    console.log("Me has parado")
});


// Sonidos del pomodoro

var alarma = document.querySelector("audio");


var t = window.setInterval(function () {

    console.log("¿estoy parado? " + estaParado)

    // Comprobamos si está el reloj en Descanso
    if (!estaParado) {

        // sumamos +1s al contador
        tiempo++;

        if (tiempo == duracionCiclo && !descanso) {

            // si llega al fin +1c y reseteamos el contador
            ciclo++
            totalCiclos++;
            tiempo = 0;
            descanso = true;
        }

        if (descanso) {

            // Añadimos los datos del tiempo de descanso
            tiempoDescanso++;

            // hacemos sonar la alarma durante 3 segundos
            // cada vez que entremos en un descanso
            if (tiempo <= duracionAlarma) {
                alarma.play();
            }


            // Comprobamos en que tipo de descanso estamos

            if (ciclo == cicloDescansoLargo) {
                // Si estamos en el descanso largo

                // cambiamos el estilo del display
                // Mostrar el tiempo que falta en el display
                pomodoroReloj.classList.add("descansoLargo");
                pomodoroReloj.textContent = (duracionDescansoLargo - tiempo);


                let restanteDescansoLargoMin = (duracionDescansoLargo - tiempo) / 60;
                restanteDescansoLargoMin = restanteDescansoLargoMin < 10 ? "0"+ Math.round(restanteDescansoLargoMin) : Math.round(restanteDescansoLargoMin)

                let restanteDescansoLargoSec =(duracionDescansoLargo - tiempo) % 60;
                restanteDescansoLargoSec = restanteDescansoLargoSec < 10 ? "0" +restanteDescansoLargoSec : restanteDescansoLargoSec

                pomodoroReloj.textContent = restanteDescansoLargoMin + " : " + restanteDescansoLargoSec;
                
                pomodoroEstado.textContent = "¡Descanso largo!";

                // Si ha acabado el tiempo del descanso largo reseteamos el tiempo
                // Y salimos del descanso
                if (tiempo == duracionDescansoLargo) {
                    tiempo = 0;
                    descanso = false;
                }

            } else {
                // Si estamos en el descanso corto 
                // añadimos el estilo al display de descanso corto
                // mostrar cuanto queda del descanso corto
                pomodoroReloj.classList.add("descanso");

                pomodoroEstado.textContent = "¡Descanso corto!";

                let restanteDescansoCotoMin = (duracionDescanso - tiempo) / 60;
                restanteDescansoCotoMin = restanteDescansoCotoMin < 10 ? "0"+ Math.round(restanteDescansoCotoMin) : Math.round(restanteDescansoCotoMin)

                let restanteDescansoCotoSec =(duracionDescanso - tiempo) % 60;
                restanteDescansoCotoSec = restanteDescansoCotoSec < 10 ? "0" +restanteDescansoCotoSec : restanteDescansoCotoSec

                pomodoroReloj.textContent = restanteDescansoCotoMin + " : " + restanteDescansoCotoSec;
                

                // Si ha acabado el tiempo del descanso corto reseteamos el tiempo
                // Y salimos del descanso
                if (tiempo == duracionDescanso) {
                    tiempo = 0;
                    descanso = false;
                }


            }




        } else {
            // si entramos en el modo trabajo 
            // hacemos sonar la alarma durante 3 segundos

            if (tiempo <= duracionAlarma) {
                alarma.play();
            }

            // añadimos los datos del tiempo de trabajo
            tiempoTrabajado++;

            // al entrar al tiempo de trabajo 
            // quitamos los estilos de descanso
            // y mostramos el tiempo de trabajo que queda

            pomodoroReloj.classList.remove("descanso");
            pomodoroReloj.classList.remove("descansoLargo");

            // Mostramos los minutos
            let restanteTrabajoMin =  (duracionCiclo - tiempo) / 60 ;
            
            // Mostramos los minutos teniendo en cuenta el formato 00
            restanteTrabajoMin = restanteTrabajoMin < 10 ? "0"+ Math.round(restanteTrabajoMin) : Math.round(restanteTrabajoMin)

            let restanteTrabajoSec =  (duracionCiclo - tiempo) % 60;
            // Mostramos los segundos teniendo en cuenta el formato 00
            restanteTrabajoSec = restanteTrabajoSec < 10 ? "0" +restanteTrabajoSec : restanteTrabajoSec
            
            console.log(restanteTrabajoMin)

            console.log(restanteTrabajoSec)

            pomodoroReloj.textContent = restanteTrabajoMin  + " : " + restanteTrabajoSec;

            pomodoroEstado.textContent = "¡A trabajar!";
            
        }

        console.log("Estamos en el ciclo " + ciclo)
        console.log("Tiempo transcurrido " + tiempo)
    } 

    

}, 1000);