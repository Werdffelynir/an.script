/**
 The script implements a control HTML5 element canvas. Simplified realization of animation or static graphs,
 and some event-control model for "click", "mousemove", "keydown" and "keyup"
 */
(function() {

    "use strict";

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var An = function(options, p1, p2, p3)
    {
        if(!(this instanceof An))
            return new An(options, p1, p2, p3);

        if (arguments.length > 2 && arguments[1] > 0)
            options = {selector: arguments[0], width: arguments[1], height: arguments[2], fps: arguments[3]};

        if(!options || !options.selector || typeof options !== 'object') {
            console.error('Error: selector not find');
            return;
        }

        // Свойства по уоллчанию, после назначения будут принадлежать экземпляру [instance].[key]
        var propertiesKey, defaultProperties = {
            selector: '',
            fps: 0,
            width: 600,
            height: 400,
            canvas: null,
            context: null,
            frame: 0,
            mouse: {x: 0, y: 0},
            mouseClick: {x: 0, y: 0},
            keydownCode: null,
            keyupCode: null,
            graphic: {},
            u: Util
        };

        // Опции по уоллчанию
        var defaultOptions = {
            debugPanelSettings:false,
            fullScreen:false,
            autoStart:true,
            autoClear:true,
            enableEventClick:true,
            enableEventMouseMovie:false,
            enableEventKeys:false,
        };

        // Назначение свойств и опций
        this.options = Util.defaultObject(defaultOptions, options);
        Util.defaultObject(defaultProperties, options);


        // Все свойства defaultProperties стают общими свойствами экземпляра
        for (propertiesKey in defaultProperties)
            this[propertiesKey] = defaultProperties[propertiesKey];


        // Списки хранимых временных данных
        this.lists = {
            stages:{},
            events:[],
            scenes:[],
            scenesTemp:[]
        };

        // Обработаные параметры
        this.canvas = document.querySelector(this.selector);

        if( !(this.canvas instanceof HTMLCanvasElement) ) {
            console.error('[Error]: Canvas element not find. selector: ' + this.selector);
            return;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        if( !(this.context instanceof CanvasRenderingContext2D) ) {
            console.error('[Error]: Canvas context 2d not query from element with selector: ' + this.selector);
            return;
        }

        var self = this;

        // initialize extensions
        if(An.extensions.length > 0){
            for(var ei = 0; ei < An.extensions.length; ei ++) {
                if(typeof An.extensions[ei] === 'function') {
                    An.extensions[ei].call(self, self);
                }
            }
        }

        // It catches the mouse movement on the canvas, and writes changes [instance].mouse
        if(this.options.enableEventMouseMovie){
            this.canvas.addEventListener('mousemove', function(event){
                self.mouse = Util.getMouseCanvas(self.canvas, event);
            });
        }

        // It catches the mouse clicks on the canvas, and writes changes [instance].mouseClick
        if(this.options.enableEventClick)
        {
            this.canvas.addEventListener('click', function(event)
            {
                self.mouseClick = Util.getMouseCanvas(self.canvas, event);
                if(self.lists.events.click && typeof self.lists.events.click === 'object') {
                    var key, eventsClicks = self.lists.events.click;
                    for(key in eventsClicks ){
                        if(
                            eventsClicks[key].rectangle[0] < self.mouseClick.x &&
                            eventsClicks[key].rectangle[1] < self.mouseClick.y &&
                            eventsClicks[key].rectangle[0] + eventsClicks[key].rectangle[2] > self.mouseClick.x &&
                            eventsClicks[key].rectangle[1] + eventsClicks[key].rectangle[3] > self.mouseClick.y
                        ){
                            eventsClicks[key].callback.call(self, event, eventsClicks[key].rectangle);
                        }
                    }
                }
            });
        }

    };


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // An static methods
    //

    /**
     * Storage of extensions
     * @type {Array}
     */
    An.extensions = [];

    /**
     * Add extensions in loader
     * @param func
     * @constructor
     */
    An.Extension = function(func){
        An.extensions.push(func);
    };



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // An prototype methods
    //

    An.prototype.toString = function () {
        return '[object An]'
    };

    An.prototype.animate = function (timestamp) {
        if(!(this instanceof An)){
            console.error('[Error]: Method animate() called is not An instance: ' + this.toString());
            return;
        }
        var self = this;

        self.frame ++;

        if(self.lists.scenes.length == 0 && self.lists.scenesTemp.length > 0){
            self.lists.scenes = self.lists.scenesTemp.sort(function(one, two){
                return one['index'] > two['index'];
            });
            self.lists.scenesTemp = [];
        }

        if(self.options.autoClear === true)
            self.clear();

        self.lists.scenes.forEach(function(item){
            try{
                /**
                 * @type CanvasRenderingContext2D self.context
                 */
                self.context.beginPath();
                self.context.save();
                item.runner.call(item, self.context, self);
                self.context.restore();
            }catch(error){
                console.error(error.message);
            }
        });

        if(self.options.enableEventKeys){
            window.addEventListener('keydown', function(event){
                self.keydownCode = event.keyCode;

                if(self.lists.events.keydown != null && typeof self.lists.events.keydown[event.keyCode] === 'object'){
                    var e = self.lists.events.keydown[event.keyCode];
                    e.callback.call(self, event);
                }
            });
            window.addEventListener('keyup', function(event){
                self.keyupCode = event.keyCode;

                if(self.lists.events.keyup != null && typeof self.lists.events.keyup[event.keyCode] === 'object'){
                    var e = self.lists.events.keyup[event.keyCode];
                    e.callback.call(self, event);
                }
            });
        }

        console.log(self.frame);

        // Timer
        if (self.fps === '*' || self.fps === 'max') {
            requestAnimationFrame(function(_timestamp){
                self.animate(_timestamp);
            });
        }
        else if(self.options.fps > 0) {
            setTimeout(function(){
                requestAnimationFrame(function(_timestamp){
                    self.animate(_timestamp);
                });
            }, 1000 / self.fps);
        }
    };

    /**
     * Added scene
     * @param {Object} obj
     * @param {Number} obj.index - deeps scene, option march on z-index
     * @param {Function} obj.runner - function run every time relatively root.fps
     * @returns {An}
     */
    An.prototype.scene = function(obj){
        if(obj !== null) {
            if(typeof obj === 'function') {
                this.lists.scenesTemp.push({runner:obj});
            } else if(typeof obj === 'object' && typeof obj.runner === 'function') {
                this.lists.scenesTemp.push(obj);
            }
        }
        return this;
    };

    /**
     * Added stage
     * @param {String} name - name of stage, rendering is defined by name
     * @param {Object} obj - Object. is scene object
     * @param {Number} obj.index - deeps scene, option march on z-index
     * @param {Function} obj.runner - function run every time relatively root.fps
     */
    An.prototype.stage = function(name, obj)
    {
        if(this.lists.stages[name] == null)
            this.lists.stages[name] = [];

        this.lists.stages[name].push(obj);
    };

    /**
     * Clear canvas area
     */
    An.prototype.clear = function(){
        this.context.clearRect(0, 0, this.width, this.height);
        this.mouse = this.mouseClick = {x: 0, y: 0};
        this.keydownCode = this.keyupCode = null;
    };

    /**
     * It clears the canvas to render the new stage
     */
    An.prototype.clearStage = function(){
        this.lists.scenes = this.lists.scenesTemp = this.lists.events = [];
    };


    /**
     * It renders the scene assignments,
     * or if the specified parameter name - renders the stage by name
     * @param name - stage name
     */
    An.prototype.render = function (name) {
        if(name !== undefined && typeof name === 'string')
            this.applyStage(name);

        if(this.options.autoStart)
            this.play();
    };

    /**
     * Apply renderer for the scene by the name
     * @param {String} name
     * @param {Boolean} clear
     */
    An.prototype.applyStage = function(name, clear)
    {
        if(clear !== false)
            this.clearStage();

        if(Array.isArray(this.lists.stages[name])){
            for(var i = 0; i < this.lists.stages[name].length; i ++){
                this.scene(this.lists.stages[name][i]);
            }
        }
    };


    /**
     * Play animation
     */
    An.prototype.play = function(){
        var self = this;
        if(this.fps > 0 && this.options.interval === null) {
            self.animate();
            self.options.interval = setInterval(function(){
                self.animate();
            }, 1000 / self.fps);
        } else {
            self.animate();
        }
    };

    /**
     * Stop animation
     */
    An.prototype.stop = function() {
        if( this.options.interval !== null ) {
            clearInterval(this.options.interval);
            this.options.interval = null;
        }
    };

    /**
     * Resize element Canvas on full page, or by params
     * @param {Number} width - default full window width
     * @param {Number} height - default full window height
     */
    An.prototype.resizeCanvas = function(width, height){
        this.canvas.style.position = 'absolute';
        this.canvas.width = this.width = width || window.innerWidth;
        this.canvas.height = this.height = height || window.innerHeight;
    };


    /**
     * Added callback for event "keydown" by "keyCode"
     *
     * @param {Number} keyCode
     * @param {Function} callback - callback on event
     */
    An.prototype.addEventKeydown = function(keyCode, callback){
        if(this.lists.events.keydown == null)
            this.lists.events.keydown = {};

        this.lists.events.keydown[keyCode] = {keyCode: keyCode, callback: callback};

    };

    /**
     * Added callback for event "keyup" by "keyCode"
     * @param {Number} keyCode
     * @param {Function} callback - callback on event
     */
    An.prototype.addEventKeyup = function(keyCode, callback){
        if(this.lists.events.keyup == null)
            this.lists.events.keyup = {};

        this.lists.events.keyup[keyCode] = {keyCode: keyCode, callback: callback};
    };

    /**
     * Adds a callback for the event click on a certain area: rectangle = [x,y,width,height]
     * @param {Array} rectangle - [x, y, width, height]
     * @param {Function} callback - callback on event
     */
    An.prototype.addEventClick = function(rectangle, callback){
        if(this.lists.events.click == null)
            this.lists.events.click = {};

        var eventItem = rectangle.join('_');

        if(this.lists.events.click[eventItem] == null)
            this.lists.events.click[eventItem] = {rectangle: rectangle, callback: callback};

    };

    /**
     * Removes the callback onclick event appointed above by this.addEvent Click,
     * specific area: rectangle = [x,y,width,height]
     * @param {Array} rectangle - [x, y, width, height]
     */
    An.prototype.removeEventClick = function(rectangle){
        var item = rectangle.join('_');

        if(this.lists.events.click != null && this.lists.events.click[item] != null)
            delete this.lists.events.click[item];
    };


    /**
     * Loading Resource Image.
     * Object imgs:
     * key - is the name for the access, assigned after loading
     * value - is the URL of the resource to load
     * @param {Object} imgs - { key : value, key : value, ...  }
     * @param {Function} callback
     */
    An.prototype.imageLoader = function(imgs, callback) {
        if(!imgs && typeof imgs !== 'object') return;
        var self = this;
        var length = Util.objLength(imgs);
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
                    self.options.image = Util.defaultObject(self.options.image, images);
                    callback.call(self, self.options.image, self.options.context);
                }
            };
        }
    };


    /**
     * Debug Panel, show dynamic information: load, performance, frames ...
     * Panel size - full width and 30px height.
     * Position - default on top
     * @param  {Object} option - params object
     * @param  {String} option.bgColor - background color of panel, default = #DDDDDD
     * @param  {String} option.textColor - color of panel text, default = #000000
     * @param  {Boolean} option.countEvents - show the number of active events
     * @param  {Boolean} option.countScenes - show the total number of scenes
     * @param  {Boolean} option.countStages - show the total number of stages
     * @param  {Number} option.load - loading panel, default = 6%
     * @param  {Object} option.margin - params position, margin of panel
     * @param  {Number} option.margin.x - margin x
     * @param  {Number} option.margin.y - margin y
     * @param  {Object} option.padding - params padding text inside panel
     * @param  {Number} option.padding.x - padding x
     * @param  {Number} option.padding.y - padding y
     */
    An.prototype.debugPanel = function(option){
        option = (option) ? option : {};

        var self = this;

        if (typeof self.options.debugPanelSettings !== 'object') {

            self.options.debugPanelSettings = {
                bgColor: option.bgColor || '#DDDDDD',
                textColor: option.textColor || '#000000',
                iterator: 0,
                timeStart: new Date().getTime(),
                timeLast: 0,
                percent: 0,
                countEvents: option.countEvents === false,
                countScenes: option.countScenes === false,
                countStages: option.countStages === false,
                load: (option.load && option.load !== 0) ? option.load : 6,
                margin: option.margin || {x: 0, y: 0},
                padding: option.padding || {x: 3, y: 3}
            };
        }
        var opt = self.options.debugPanelSettings;
        var textX = opt.padding.x + opt.margin.x;
        var textY = opt.padding.y + opt.margin.y;

        self.context.fillStyle = opt.bgColor;
        self.context.fillRect(opt.margin.x,opt.margin.y,self.width,30);
        self.context.font = 'bold 12px/12px Arial';
        self.context.textBaseline = 'top';
        self.context.fillStyle = opt.textColor;
        self.context.fillText('frames: ' + opt.iterator,textX,textY);
        self.context.fillText('seconds: ' + parseInt((new Date().getTime() - opt.timeStart) / 1000), textX, textY + 12);

        var timeNow = (new Date).getTime();
        var ftp = (timeNow - opt.timeLast)/1000;

        if(opt.iterator % 60 == 0){
            var p = parseInt(parseInt(1/ftp) *  100 / self.fps) + opt.load;
            opt.percent = ((p>100)?100:p) + '%';
        }

        self.context.fillStyle = opt.textColor;
        self.context.font = "12px/14px Arial";
        self.context.fillText("FPS: " + parseInt(1/ftp) + '/' + self.fps, 100+textX, textY+6);
        self.context.fillText(opt.percent+'', 170+textX, textY+6);
        if(opt.countEvents)
            self.context.fillText("Events: " + Util.objLength(self.lists.events.click), 230+textX, textY+6);
        if(opt.countScenes)
            self.context.fillText("Scenes: " + self.lists.scenes.length, 320+textX, textY+6);
        if(opt.countStages)
            self.context.fillText("Stages: " + Util.objLength(self.lists.stages), 410+textX, textY+6);

        opt.timeLast = timeNow;
        opt.iterator ++;
    };



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Utilities static methods
    //

    var Util = {};

    /**
     * Cloned object
     * @param {Object} object
     * @returns {Object}
     */
    Util.cloneObject = function (object) {
        if (object === null || typeof object !== 'object') return obj;
        var temp = object.constructor();
        for (var key in object)
            temp[key] = Util.objClone(object[key]);
        return temp;
    };

    /**
     * Merge object into objectBase. Object objectBase will be modified!
     * @param {Object} defaultObject
     * @param {Object} object
     * @returns {*}
     */
    Util.defaultObject = function (defaultObject, object) {
        for (var key in object) {
            defaultObject[key] = object[key];
        }
        return defaultObject;
    };

    /**
     * Returns a random integer between min, max, unless specified from 0 to 100
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    Util.rand = function (min, max) {
        min = min || 0;
        max = max || 100;
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * Random color. Returns a string HEX format color.
     * @returns {string}
     */
    Util.randColor = function () {
        var letters = '0123456789ABCDEF'.split(''),
            color = '#';
        for (var i = 0; i < 6; i++)
            color += letters[Math.floor(Math.random() * 16)];
        return color;
    };

    /**
     * Converts degrees to radians
     * @param {number} deg - degrees
     * @returns {number}
     */
    Util.degreesToRadians = function (deg) {
        return (deg * Math.PI) / 180;
    };

    /**
     * Converts radians to degrees
     * @param {number} rad - radians
     * @returns {number}
     */
    Util.radiansToDegrees = function (rad) {
        return (rad * 180) / Math.PI;
    };

    /**
     * Calculate the number of items in e "obj"
     * @param {Object} obj
     * @returns {number}
     */
    Util.objectLength = function (obj) {
        var it = 0;
        for (var k in obj) it ++;
        return it;
    };

    /**
     * Calculate the distance between points
     * @param {Object} p1
     * @param {number} p1.x
     * @param {number} p1.y
     * @param {Object} p2
     * @param {number} p2.x
     * @param {number} p2.y
     * @returns {number}
     */
    Util.distanceBetween = function (p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    /**
     * Returns the coordinates of the mouse on any designated element
     * @param {Object} element
     * @param {Object} event
     * @returns {{x: number, y: number}}
     */
    Util.getMouseElement = function (element, event) {
        var x = event.pageX - element.offsetLeft;
        var y = event.pageY - element.offsetTop;
        return {x: x, y: y};
    };

    /**
     * Returns the coordinates of the mouse on canvas element
     * @param {Object} canvas
     * @param {Object} event
     * @returns {{x: number, y: number}}
     */
    Util.getMouseCanvas = function (canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };





    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Internal Extensions
    //

    An.Extension(function(self){

        if(!(this instanceof An) || !(self instanceof An))
            return;

        /**
         * Draw round rectangle
         * @param x
         * @param y
         * @param width
         * @param height
         * @param radius
         */
        self.context.rectRound = function(x, y, width, height, radius){
            width = width || 100;
            height = height || 100;
            radius = radius || 5;
            self.context.beginPath();
            self.context.moveTo(x + radius, y);
            self.context.arcTo(x + width, y, x + width, y + height, radius);
            self.context.arcTo(x + width, y + height, x, y + height, radius);
            self.context.arcTo(x, y + height, x, y, radius);
            self.context.arcTo(x, y, x + width, y, radius);
        };

        /**
         * Draw shadow for all elements on scene
         * @param x
         * @param y
         * @param blur
         * @param color
         */
        self.context.shadow = function (x, y, blur, color){
            self.context.shadowOffsetX = x;
            self.context.shadowOffsetY = y;
            self.context.shadowBlur = blur;
            self.context.shadowColor = color;
        };

        /**
         * Clear shadow params (shadowOffsetX,shadowOffsetY,shadowBlur)
         */
        self.context.clearShadow = function(){
            self.context.shadowOffsetX = self.context.shadowOffsetY = self.context.shadowBlur = 0;
        };

        if(!self.context.ellipse){
            /**
             * Draw ellipse - cross-browser function
             * @param x
             * @param y
             * @param radiusX
             * @param radiusY
             * @param rotation
             * @param startAngle
             * @param endAngle
             * @param anticlockwise
             */
            self.context.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise){
                self.context.save();
                self.context.beginPath();
                self.context.translate(x, y);
                self.context.rotate(rotation);
                self.context.scale(radiusX / radiusY, 1);
                self.context.arc(0, 0, radiusY, startAngle, endAngle, (anticlockwise||true));
                self.context.restore();
                self.context.closePath();
                self.context.stroke();
            }
        }
    });


    window.An = An;
    window.An.Util = Util;
    window.An.version = '1.2.0';

})();

