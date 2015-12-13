/**
The script implements a control HTML5 element canvas
Simplified realization of animation or static graphs, 
and some event-control model for "click", "mousemove",
"keydown" and "keypress"
*/
(function(window){

    'use strict';

    var root = {
        version:    '1.0.1',
        selector:   null,
        width:      0,
        height:     0,
        fps:        null,
        canvas:     null,
        context:    null,
        frame:      0,
        image:      {},
        graphic:    {},
        glob:       {},
        options:    {},
        mouse:      { x:0, y:0 },
        mouseClick: { x:0, y:0 },
        keydownCode:null,
        keyupCode:  null,
        interval:  null,
        extensions: []
    };

    var Extension = function(func){
        root.extensions.push(func);
    };

    var An = function(options,p1,p2,p3)
    {
        if(!(this instanceof An))
            return new An(options,p1,p2,p3);

        if(arguments.length > 2 && arguments[1] > 0)
            options = {selector:arguments[0],width:arguments[1],height:arguments[2],fps:arguments[3]};
        
        if(!options || !options.selector || typeof options !== 'object') 
            return;

        var defaultOption = {
            selector:null,
            width:600,
            height:400,
            fps:(parseInt(options.fps) > 0) ? parseInt(options.fps) : 0,
            autoStart:true,
            autoClear:true,
            enableEventClick:true,
            enableEventMouseMovie:false,
            enableEventKeys:false
        };

        // root.options
        root.options = Util.objMerge(defaultOption, options);
        options = defaultOption = null;

        root.selector = root.options.selector;
        root.canvas = document.querySelector(root.selector);
        root.canvas.width = root.width = root.options.width || 600;
        root.canvas.height = root.height = root.options.height || 400;
        root.context = this.canvas.getContext('2d');
        root.fps = root.options.fps;

        root.lists = {};
        root.lists.stages = {};
        root.lists.events = [];
        root.lists.scenes = [];
        root.lists.scenesTemp = [];

        // Отлавлевает движения мыши по canvas, и пишет изминения в root.mouse
        if(root.options.enableEventMouseMovie){
            root.canvas.addEventListener('mousemove', function(event){
                root.mouse = Util.getMouseCanvas(root.canvas, event);
            });
        }

        // Отлавлевает клики мыши по canvas, и пишет изминения в root.mouseClick
        if(root.options.enableEventClick){
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
                            eventsClicks[key].callback.call(root, event, eventsClicks[key].rectangle);
                        }
                    }
                }
            });
        }

        /**
         *
         * @param x
         * @param y
         * @param width
         * @param height
         * @param radius
         */
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

        /**
         * Добавляет callback на событие keydown для keyCode
         * @param keyCode Numeric
         * @param callback Function callback
         */
        this.addEventKeydown = function(keyCode, callback)
        {
            if(root.lists.events.keydown == null) root.lists.events.keydown = {};
            root.lists.events.keydown[keyCode] = {keyCode: keyCode, callback: callback};
        };

        /**
         * Добавляет callback на событие keyup для keyCode
         * @param keyCode Numeric
         * @param callback Function callback
         */
        this.addEventKeyup = function(keyCode, callback)
        {
            if(root.lists.events.keyup == null) root.lists.events.keyup = {};
            root.lists.events.keyup[keyCode] = {keyCode: keyCode, callback: callback};
        };


        /**
         * Добавляет callback на событие click на определенный участок: rectangle = [x,y,width,height]
         * @param rectangle Array [x, y, width, height]
         * @param callback Function callback
         */
        this.addEventClick = function(rectangle, callback)
        {
            if(root.lists.events.click == null) root.lists.events.click = {};
            var eventItem = rectangle.join('_');
            if(root.lists.events.click[eventItem] == null)
                root.lists.events.click[eventItem] = {rectangle: rectangle, callback: callback};
        };


        /**
         * Удаляет callback событич click вызваного методом this.addEventClick, определенный участок: rectangle = [x,y,width,height]
         * @param rectangle Array [x, y, width, height]
         */
        this.removeEventClick = function(rectangle){
            var item = rectangle.join('_');
            if(root.lists.events.click != null && root.lists.events.click[item] != null)
                delete root.lists.events.click[item];
        };


        /**
         * Рисует сцены, или если указано name состояния
         * @param name String, if name set draw stage by name
         */
        this.render = function(name)
        {
            if(name !== undefined && typeof name === 'string')
                this.applyStage(name);

            if(root.extensions.length > 0){
                for(var ei = 0; ei < root.extensions.length; ei ++)
                    if(typeof root.extensions[ei] === 'function') root.extensions[ei].call(root, root);
            }

            if(root.options.autoStart)
                this.play();
        };


        /**
         * Остановка анимации
         */
        this.stop = function(){
            if( root.interval !== null ){
                clearInterval(root.interval);
                root.interval = null;
            }
        };

        /**
         * Начать анимацию
         */
        this.play = function(){
            if(root.fps > 0 && root.interval === null) {
                drawFrame();
                root.interval = setInterval(drawFrame, 1000 / root.fps);
            } else
                drawFrame()
        };

        /**
         * Очищает холст
         */
        root.clear = function(){
            root.context.clearRect(0, 0, root.width, root.height);
        };

        /**
         * Очищает холсты для нового состояния
         */
        root.clearStage = function(){
            root.lists.scenes = root.lists.scenesTemp = root.lists.events = [];
        };

        /**
         * Добавление сцены
         * @param obj Object.
         * @returns {An}
         */
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

        /**
         * Добавления состояния
         * @param name
         * @param obj Object. is scene object
         */
        this.stage = function(name, obj)
        {
            if(root.lists.stages[name] == null)
                root.lists.stages[name] = [];

            root.lists.stages[name].push(obj);
        };


        /**
         * Приминения состояния
         * @param name
         * @param clear
         */
        this.applyStage = function(name, clear)
        {
             if(clear !== false)
                root.clearStage();

            if(Array.isArray(root.lists.stages[name])){
                for(var i = 0; i < root.lists.stages[name].length; i ++){
                    this.scene(root.lists.stages[name][i]);
                }
            }
        };


        /**
         * Разворачивает Canvas на всю страницу
         * @param width
         * @param height
         */
        this.resizeCanvas = function(width,height) {
            root.canvas.style.position = 'absolute';
            root.canvas.width = root.width = width || window.innerWidth;
            root.canvas.height = root.height = height || window.innerHeight;
        };

        /**
         *
         * @param imgs
         * @param callback
         */
        this.imageLoader = function(imgs, callback) {
            if(!imgs && typeof imgs !== 'object') return;
            var length = an.u.objLength(imgs);
            var images = {};
            var iterator = 0;
            for(var name in imgs){
                var eImg = document.createElement('img');
                eImg.src = imgs[name];
                eImg.name = name;
                eImg.onload = function(e){
                        images[this.name] = this;
                        iterator ++;
                        if(iterator == length) {
                            root.image = Util.objMerge(root.image,images);
                            callback.call(root, root.image, root.context);
                        }
                    };
            }
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

            if(root.options.autoClear === true)
                root.clear();

            root.lists.scenes.forEach(function(item){
                try{
                    root.context.beginPath();
                    root.context.save();
                    item.runner.call(item, root.context, root);
                    root.context.restore();
                }catch(error){
                    console.error(error.message);
                }
            });
        };


        if(root.options.enableEventKeys){
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
        }
    };




    // - - - - - - - - - - - - - - - - - - - - - - - - -
    // Graphics static methods
    // - - - - - - - - - - - - - - - - - - - - - - - - -

    root.graphic.debugPanel = function(option){

        option = (option) ? option : {};

        if(root.options.devPanel === undefined){
            root.options.devPanel = {
                bgColor:option.bgColor||'#DDDDDD',
                textColor:option.textColor||'#000000',
                iterator:0,
                timeStart:new Date().getTime(),
                timeLast:0,
                percent:0,
                countElements:true,
                countEvents:true,
                countScenes:true,
                countStages:true,
                developerPanelLoaded:6,
                margin:{x:0,y:0},
                padding:{x:3,y:3}
            };
        }
        var opt = root.options.devPanel;

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
        root.context.font = "12px/14px Arial";
        root.context.fillText("FPS: " + parseInt(1/ftp) + '/' + root.fps, 80+opt.padding.x, opt.padding.y+6);
        root.context.fillText(opt.percent+'', 150+opt.padding.x, opt.padding.y+6);
        if(opt.countElements)
            root.context.fillText("Elements: " + root.lists.scenes.length , 190+opt.padding.x, opt.padding.y+6);
        if(opt.countEvents)
            root.context.fillText("Events: " + Util.objLength(root.lists.events.click), 300+opt.padding.x, opt.padding.y+6);
        if(opt.countScenes)
            root.context.fillText("Scenes: " + root.lists.scenes.length, 390+opt.padding.x, opt.padding.y+6);
        if(opt.countStages)
            root.context.fillText("Stages: " + Util.objLength(root.lists.events.stages), 490+opt.padding.x, opt.padding.y+6);

        opt.timeLast = timeNow;
        opt.iterator ++;

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

    // Обеденит два объекта, на базе второго (obj2 будет изменен)
    Util.objMerge = function(objectBase,object){
        for(var key in object){
            objectBase[key] = object[key];
        }
        return objectBase;
    };
    Util.objMergeNotExists = function(objectBase,object){
        for(var key in object) 
            if(objectBase[key] === undefined) 
                objectBase[key] = object[key];
        return objectBase;
    };
    Util.objMergeOnlyExists = function(objectBase,object){
        for(var key in object) 
            if(objectBase[key] !== undefined) 
                objectBase[key] = object[key];
        return objectBase;
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
    window.An.Util = Util;
    window.An.Extension = Extension;

})(window);
