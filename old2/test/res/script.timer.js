/* Скрипт таймер (Timer.js) симулирует класс ActionScript 3.0 Timer */

(function(){

    "use strict";

    function Timer(ms, delay){
        if(!ms) return;
        if(!(this instanceof Timer)) return new Timer(100);

        // создание элемента для навешивания обработчиков
        var eventTarget = document.createDocumentFragment();
        eventTarget.onstart = null;
        eventTarget.onprogress = null;
        eventTarget.oncomplete = null;
        eventTarget.progress = 0;

        var delay = parseInt(delay) || 0,
            interval = null;

        // создание внутренних событий таймера
        var eventStart = new Event(Timer.START),
            eventProgress = new Event(Timer.PROGERSS),
            eventComplete = new Event(Timer.COMPLETE);

        // метод запуска таймера
        eventTarget.start = function(){

            if(typeof eventTarget.onstart == 'function') 
                eventTarget.addEventListener(Timer.START, eventTarget.onstart, false);

            if(typeof eventTarget.onprogress == 'function') 
                eventTarget.addEventListener(Timer.PROGERSS, eventTarget.onprogress, false);

            if(typeof eventTarget.oncomplete == 'function') 
                eventTarget.addEventListener(Timer.COMPLETE, eventTarget.oncomplete, false);

            eventTarget.dispatchEvent(eventStart);

            // интервал выполняет 
            interval = setInterval(function(){

                eventProgress.progress = eventTarget.progress ++;

                eventTarget.dispatchEvent(eventProgress);

                if(eventTarget.progress >= delay){
                    clearInterval(interval);
                    eventTarget.dispatchEvent(eventComplete);
                }

            }, ms);
        }

        // метод остановки таймера
        eventTarget.abort = function(){
            clearInterval(interval);
        }

        return eventTarget;
    }
    Timer.START = 'start';
    Timer.PROGERSS = 'progress';
    Timer.COMPLETE = 'complete';

})();