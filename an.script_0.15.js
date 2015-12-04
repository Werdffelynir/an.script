(function(window){

    var root = {
        selector:   null,
        width:      0,
        height:     0,
        fps:        null,
        canvas:     null,
        context:    null,
        frame:      0,
        graphic:    {},
        opt:        {},
        mouse:      { x:0, y:0 },
        mouseClick: { x:0, y:0 },
        keydownCode:null,
        keyupCode:  null
    };

    var An = function(selector,width,height,fps)
    {
        if(!(this instanceof An))
            return new An(selector,width,height,fps);

        root.selector = selector;
        root.canvas = document.querySelector(selector);
        root.canvas.width = root.width = width || 600;
        root.canvas.height = root.height = height || 400;
        root.context = this.canvas.getContext('2d');
        root.fps = (parseInt(fps) > 0) ? parseInt(fps) : 0;

        root.lists = {};
        root.lists.stages = {};
        root.lists.events = [];
        root.lists.scenes = [];
        root.lists.scenesTemp = [];

        // Отлавлевает движения мыши по canvas, и пишет изминения в root.mouse
        /*root.canvas.addEventListener('mousemove', function(event){
            root.mouse = Util.getMouseCanvas(root.canvas, event);
        });*/

        // Отлавлевает клики мыши по canvas, и пишет изминения в root.mouseClick
        root.canvas.addEventListener('click', function(event)
        {
            root.mouseClick = Util.getMouseCanvas(root.canvas, event);
            if(root.lists.events.click && typeof root.lists.events.click === 'object') {
                var eventsClicks = root.lists.events.click;
                for(var key in eventsClicks ){
                    if(
                        eventsClicks[key].rectangle[0] < root.mouseClick.x &&
                        eventsClicks[key].rectangle[1] < root.mouseClick.y &&
                        eventsClicks[key].rectangle[0]+eventsClicks[key].rectangle[2] > root.mouseClick.x &&
                        eventsClicks[key].rectangle[1]+eventsClicks[key].rectangle[3] > root.mouseClick.y
                    ){
                        eventsClicks[key].callback.call(root, event);
                    }
                }
            }
        });

        root.context.rectRound = function(x, y, width, height, radius){
            root.context.beginPath();
            root.context.moveTo(x + radius, y);
            root.context.arcTo(x + width, y, x + width, y + height, radius);
            root.context.arcTo(x + width, y + height, x, y + height, radius);
            root.context.arcTo(x, y + height, x, y, radius);
            root.context.arcTo(x, y, x + width, y, radius);
        };

        // Вернет
        root.context.clearShadow = function(){root.context.shadowOffsetX = root.context.shadowOffsetY = root.context.shadowBlur = 0;};

        if(!root.context.ellipse){
            root.context.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise){
                root.context.save();
                root.context.beginPath();
                root.context.translate(x, y);
                root.context.rotate(rotation);
                root.context.scale(radiusX / radiusY, 1);
                root.context.arc(0, 0, radiusY, startAngle, endAngle, (anticlockwise||true));
                root.context.restore();
                root.context.closePath();
                root.context.stroke();
            }
        }
        root.context.shadow = function (x,y,blur,color){
            root.context.shadowOffsetX = x;
            root.context.shadowOffsetY = y;
            root.context.shadowBlur = blur;
            root.context.shadowColor = color;
        };

        // Добавляет callback на событие keydown для keyCode
        this.addEventKeydown = function(keyCode, callback)
        {
            if(root.lists.events.keydown == null) root.lists.events.keydown = {};

            root.lists.events.keydown[keyCode] = {keyCode: keyCode, callback: callback};
        };

        // Добавляет callback на событие keyup для keyCode
        this.addEventKeyup = function(keyCode, callback)
        {
            if(root.lists.events.keyup == null) root.lists.events.keyup = {};

            root.lists.events.keyup[keyCode] = {keyCode: keyCode, callback: callback};
        };

        // Добавляет callback на событие click на определенный участок: rectangle = [x,y,width,height]
        this.addEventClick = function(rectangle, callback)
        {
            if(root.lists.events.click == null) root.lists.events.click = {};

            var eventItem = rectangle.join('_');

            if(root.lists.events.click[eventItem] == null)
                root.lists.events.click[eventItem] = {rectangle: rectangle, callback: callback};
        };

        // Удаляет callback событич click вызваного методом this.addEventClick, определенный участок: rectangle = [x,y,width,height]
        this.removeEventClick = function(rectangle){
            var item = rectangle.join('_');
            if(root.lists.events.click != null && root.lists.events.click[item] != null)
                delete root.lists.events.click[item];
        };

        // Рисует сцены, или если указано name состояния
        this.render = function(name)
        {
            if(name !== undefined && typeof name === 'string')
                this.applyStage(name);

            if(root.fps > 0) {
                drawFrame();
                root.interval = setInterval(drawFrame, 1000 / this.fps);
            } else
                drawFrame();
        };

        // Полная остановка анимации
        this.stop = function(){
            clearInterval(root.interval);
        };

        // Начать анимацию
        this.play = function(fps, name){
            root.fps = fps || 24;
            this.render(name);
        };

        // Очищает холст
        root.clear = function(){
            root.context.clearRect(0, 0, root.width, root.height);
        };

        // Очищает холсты для нового состояния
        root.clearStage = function(){
            root.lists.scenes = root.lists.scenesTemp = root.lists.events = [];
        };

        // добавление сцены
        this.scene = function(obj) {
            if(obj !== null) {
                if(typeof obj === 'function') {
                    root.lists.scenesTemp.push({runner:obj});
                } else if(typeof obj === 'object' && typeof obj.runner === 'function') {
                    root.lists.scenesTemp.push(obj);
                }
            }
            return this;
        };

        // Добавления состояния
        this.stage = function(name, obj)
        {
            if(root.lists.stages[name] == null)
                root.lists.stages[name] = [];

            root.lists.stages[name].push(obj);
        };

        // Приминения состояния
        this.applyStage = function(name, clear)
        {
            clear = (clear === false) ? false : true;

            if(clear)
                root.clearStage();

            if(Array.isArray(root.lists.stages[name])){
                for(var i = 0; i < root.lists.stages[name].length; i ++){
                    this.scene(root.lists.stages[name][i]);
                }
            }
        };

        // Разворачивает Canvas на всю страницу
        this.resizeCanvas = function() {
            root.canvas.style.position = 'absolute';

            root.canvas.width = root.width = window.innerWidth;
            root.canvas.height = root.height = window.innerHeight;
        };


        // - - - - - - - - - - - - - - - - - - - - - - - - -
        // graphics methods
        // - - - - - - - - - - - - - - - - - - - - - - - - -

        root.graphic.developerPanel = function(option){

            option = (option instanceof Object) ? option : {};

            if(root.opt.devPanel === undefined){
                root.opt.devPanel = {
                    bgColor:option.bgColor||'#DDDDDD',
                    textColor:option.textColor||'#000000',
                    iterator:0,
                    timeStart:new Date().getTime(),
                    timeLast:0,
                    percent:0,
                    developerPanelLoaded:6,
                    margin:{x:0,y:0},
                    padding:{x:3,y:3}
                };
            }
            var opt = root.opt.devPanel;

            root.context.fillStyle = opt.bgColor;
            root.context.fillRect(opt.margin.x,opt.margin.y,root.width,30);
            root.context.font = '12px/12px Arial';
            root.context.textBaseline = 'top';
            root.context.fillStyle = opt.textColor;
            root.context.fillText('frames: ' + opt.iterator, opt.padding.x,opt.padding.y);
            root.context.fillText('seconds: ' + parseInt((new Date().getTime() - opt.timeStart) / 1000), opt.padding.x,opt.padding.y + 12);

            var timeNow = (new Date).getTime();
            var ftp = (timeNow - opt.timeLast)/1000;

            if(opt.iterator % 60 == 0){
                var p = parseInt(parseInt(1/ftp) *  100 / root.fps) + opt.developerPanelLoaded;
                opt.percent = ((p>100)?100:p) + '%';
            }

            root.context.fillStyle = opt.textColor;
            root.context.font = "14px/14px Arial";
            root.context.fillText("FPS: " + parseInt(1/ftp) + '/' + root.fps, 100+opt.padding.x, opt.padding.y+5);
            root.context.fillText("" + opt.percent, 200+opt.padding.x, opt.padding.y+5);
            root.context.fillText("Elements: " + root.lists.scenes.length , 280+opt.padding.x, opt.padding.y+5);

            opt.timeLast = timeNow;
            opt.iterator ++;

        };

        // - - - - - - - - - - - - - - - - - - - - - - - - -
        // insides methods
        // - - - - - - - - - - - - - - - - - - - - - - - - -

        var drawFrame = function()
        {
            root.frame ++;

            if(root.lists.scenes.length == 0 && root.lists.scenesTemp.length > 0){
                root.lists.scenes = root.lists.scenesTemp.sort(function(one, two){
                    return (one['index'] > two['index']) ? true : false;
                });
                delete root.lists.scenesTemp;
            }
            root.clear();
            root.lists.scenes.forEach(function(item){
                try{
                    root.context.save();
                    root.context.beginPath();
                    item.runner.call(item, root.context, root);
                    root.context.restore();
                }catch(error){
                    console.error(error.message);
                }
            });
        };
/*
        window.addEventListener('keydown', function(event){
            root.keydownCode = event.keyCode;
            if(root.lists.events.keydown != null && typeof root.lists.events.keydown[event.keyCode] === 'object'){
                var e = root.lists.events.keydown[event.keyCode];
                e.callback.call(root, event);
            }
        });

        window.addEventListener('keyup', function(event){
            root.keyupCode = event.keyCode;
            if(root.lists.events.keyup != null && typeof root.lists.events.keyup[event.keyCode] === 'object'){
                var e = root.lists.events.keyup[event.keyCode];
                e.callback.call(root, event);
            }
        });
*/
    };








    var Util = {};

    // Вернет клон объекта
    Util.objClone = function(obj){
        if (obj === null || typeof obj !== 'object') return obj;
        var temp = obj.constructor();
        for (var key in obj)
            temp[key] = Util.objClone(obj[key]);
        return temp;
    };

    // Вернет случайное целое число между min, max, если не указано от 0 до 100
    Util.rand = function(min,max){
        min = min||0; max = max||100;
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    // Вернет строку формата HAX цвета
    Util.randColor = function(){
        var letters = '0123456789ABCDEF'.split(''),
            color = '#';
        for (var i = 0; i < 6; i++ )
            color += letters[Math.floor(Math.random() * 16)];
        return color;
    };

    // Конвертирует градусы в радианы
    Util.degreesToRadians = function(deg){return (deg * Math.PI) / 180;};

    // Конвертирует радианы в градусы
    Util.radiansToDegrees = function(rad){return (rad * 180) / Math.PI;};


    // Конвертирует радианы в градусы
    Util.objLength = function(obj){
        var it = 0;
        for(var k in obj) it ++;
        return it;
    };

    //
    Util.distanceBetween = function(p1,p2){
        var dx = p2.x-p1.x;
        var dy = p2.y-p1.y;
        return Math.sqrt(dx*dx + dy*dy);
    };

    // Вернет координаты мыши по любому елементу
    Util.getMouseElement = function(element, event) {
        var x = event.pageX - element.offsetLeft;
        var y = event.pageY - element.offsetTop;
        return {x: x, y: y};
    };

    // Вернет координаты мыши по елементу канвас
    Util.getMouseCanvas = function(canvas, event){
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    An.prototype = root;
    An.prototype.u = Util;
    window.An = An;

})(window);





