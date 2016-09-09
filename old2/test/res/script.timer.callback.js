/**
 * Класс предназначен для цеклического вызова функции callback, через заданое время delay, количество вызовов repeat
 * класс должен создавать экземпляр посредством оператора new
 *
 * Constructor
 *  Timer(callback:function, delay:integer, repeat:integer)
 *
 * Class properties
 *  Timer::iterator::integer
 *
 * Class methods
 *  Timer::start():void    Старт таймера
 *  Timer::stop():void    Отсановка таймера
 *  Timer::pause():void    Пауза таймера
 *  Timer::reset():void    Сброс счетчика repeat
 *  Timer::clear():void
 *
 * @param callback
 * @param delay
 * @param repeat
 * @returns {Timer}
 * @constructor
 */
function Timer(callback, delay, repeat) {
    if (!(this instanceof Timer))
        return new Timer(callback, delay, repeat);

    if (typeof callback !== 'function')
        return null;
    var config = {self: this, callback: callback, delay: delay || 500, repeat: repeat || 0};
    var ht = null;
    var hc = function () {
        config.self.iterator++;
        if (config.repeat !== 0 && config.repeat <= config.self.iterator)
            config.self.stop();
        config.callback(config.self.iterator, config.repeat);
    };
    this.iterator = 0;
    this.start = function () {
        if (config.repeat === 0 || config.repeat > config.self.iterator)
            ht = setInterval(hc, config.delay);
    };
    this.stop = function () {
        this.iterator = config.repeat;
        this.clear();
    };
    this.pause = function () {
        this.clear();
    };
    this.reset = function () {
        this.iterator = 0;
    };
    this.clear = function () {
        clearInterval(ht);
    };
}
