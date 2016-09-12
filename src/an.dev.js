
(function(){

    "use strict";

    window.requestAnimationFrame = function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(f) {
                window.setTimeout(f,1e3/60);
            }
    }();


    /**
     * Constructor, create one animation canvas
     *
     * @param props_selector
     * @param width
     * @param height
     * @param fps
     * @returns {An}
     * @constructor
     */
    var An = function(props_selector, width, height, fps){

        if (!(this instanceof An))
            return new An(props_selector, width, height, fps);

        if (arguments.length > 2 && arguments[1] > 0)
            props_selector = {selector: arguments[0], width: arguments[1], height: arguments[2], fps: arguments[3]};

        if (!props_selector || !props_selector.selector || typeof props_selector !== 'object') {
            console.error('Error: selector not find');
            return;
        }

        var pk, propertiesDefault = {

            // canvas settings
            selector: null,
            width: 600,
            height: 400,
            fps: 30,
            canvas: null,
            context: null,
            contextId: '2d',

            // functionality
            onClick: null,
            onFrame: null,
            loop: 'animation',
            fullScreen: false,
            autoStart: true,
            autoClear: true,
            enableEventClick: true,
            enableEventMouseMovie: false,
            enableEventKeys: false
        };

        Util.mergeObject(propertiesDefault, props_selector);
        for (pk in propertiesDefault)
            this[pk] = propertiesDefault[pk];

        // dynamics

        this.canvas = document.querySelector(this.selector);

        if( !(this.canvas instanceof HTMLCanvasElement) ) {
            console.error('[Error]: Canvas element not find. selector: ' + this.selector);
            return;
        }

        if(!!this.fullScreen) {
            this.resizeCanvas();
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext(this.contextId);

        if( !(this.context instanceof CanvasRenderingContext2D) ) {
            console.error('[Error]: Canvas context 2d not query from element with selector: ' + this.selector);
            return;
        }

        this.isPlaying = false;
        this.isFiltering = false;
        this.setTimeoutIterator = 0;
        this.requestAnimationFrameIterator = 0;
        this.errorDrawframe = false;
        this.frameCounter = 0;
        this.mouse = {x: 0, y: 0};
        this.mouseClick = {x: 0, y: 0};
        this.keydownCode = null;
        this.keyupCode = null;
        this.lists = {
            scenes: [],
            stages: {},
            layers: {},
            events: {},
            images: []
        };
        this.options = {
            sorting: true,
            filtering: true,
            debugPanelSettings: false
        };
        Util.mergeObject(this.options, props_selector);

        var that = this;

        // initialize extensions
        if(An.internalExtensions.length > 0) {
            for(var ei = 0; ei < An.internalExtensions.length; ei ++)
                if(typeof An.internalExtensions[ei] === 'function') An.internalExtensions[ei].call(that, that);
        }

        // It catches the mouse movement on the canvas, and writes changes root.mouse
        if(that.enableEventMouseMovie) {
            that.canvas.addEventListener('mousemove', function(event){
                that.mouse = Util.getMouseCanvas(that.canvas, event);
            });
        }

        // It catches the mouse clicks on the canvas, and writes changes root.mouseClick
        if(that.enableEventClick) {
            that.canvas.addEventListener('click', function(event)
            {
                that.mouseClick = Util.getMouseCanvas(that.canvas, event);

                if(typeof that.onClick === 'function')
                    that.onClick.call(that, that.mouseClick);

                if(typeof that.lists.events.click === 'object') {
                    var key, eventsClicks = that.lists.events.click;

                    for(key in eventsClicks ) {
                        if(
                            eventsClicks[key].rectangle[0] < that.mouseClick.x &&
                            eventsClicks[key].rectangle[1] < that.mouseClick.y &&
                            eventsClicks[key].rectangle[0] + eventsClicks[key].rectangle[2] > that.mouseClick.x &&
                            eventsClicks[key].rectangle[1] + eventsClicks[key].rectangle[3] > that.mouseClick.y
                        ) {
                            eventsClicks[key].callback.call(that, event, eventsClicks[key].rectangle);
                        }
                    }
                }
            });
        }

        //
        if(that.enableEventKeys){
            window.addEventListener('keydown', function(event){
                that.keydownCode = event.keyCode;
                //if(that.lists.events.keydown != null && typeof that.lists.events.keydown[event.keyCode] === 'object'){
                //    var e = that.lists.events.keydown[event.keyCode];
                //    e.callback.call(that, event);
                //}
            });
            window.addEventListener('keyup', function(event){
                that.keyupCode = event.keyCode;
                //if(that.lists.events.keyup != null && typeof that.lists.events.keyup[event.keyCode] === 'object'){
                //    var e = that.lists.events.keyup[event.keyCode];
                //    e.callback.call(that, event);
                //}
            });
        }

    };


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // An static methods
    //


    /**
     * Constant type of timer
     * @type {string}
     */
    An.LOOP_TIMER = 'timer';
    An.LOOP_ANIMATE = 'animation';

    /**
     * Storage of extensions
     * @private
     * @type {Array}
     */
    An.internalExtensions = [];


    /**
     * Add extensions in loader
     * @param func
     * @constructor
     */
    An.Extension = function(func){
        An.internalExtensions.push(func);
    };


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // An prototype methods
    //

    /**
     * toString
     * @returns {string}
     */
    An.prototype.toString = function () {
        return '[object An]'
    };

    /**
     * The main method of drawing on the canvas in a loop
     * Internal method
     * @private
     */
    An.prototype.internalDrawframe = function () {

        this.frameCounter ++;
        this.scenesFiltering();

        var i,
            scene,
            that = this,
            scenes = this.lists.scenes;

        if(this.autoClear === true)
            this.clear();

        if(!this.errorDrawframe) {
            for (i = 0; i < scenes.length; i ++) {
                scene = scenes[i];
                try{
                    that.context.beginPath();
                    that.context.save();
                    scenes[i].runner.call(scenes[i], that.context, that);
                    that.context.restore();

                }catch (error) {
                    this.errorDrawframe = error.message;
                    break;
                }

                if(typeof that.onFrame === 'function') {
                    console.log('onFrame');
                    that.onFrame.call(that, that);
                }
            }
        } else {
            this.stop();
            console.error(this.errorDrawframe);
        }





    };


    /**
     * It renders the scene assignments,
     * or if the specified parameter name - renders the stage by name
     * @param stageName - stage name
     */
    An.prototype.render = function(stageName) {
        var run = true;
        if(typeof stageName === 'string') {
            run = this.internalStagesToScenes(stageName);
        }

        if(run && this.autoStart)
            this.play();
    };


    /**
     * Start "play" animation
     */
    An.prototype.play = function(){
        if(!this.isPlaying){
            this.internalDrawframe();

            if(this.fps && this.loop === An.LOOP_ANIMATE) {
                this.loopAnimationFrame();
            } else
            if(this.fps && this.loop === An.LOOP_TIMER) {
                this.loopTimer();
            }
            this.isPlaying = true;
        }
    };


    /**
     * Stop "play" animation
     */
    An.prototype.stop = function(){
        if(this.isPlaying){
            if(this.loop === An.LOOP_ANIMATE) {
                cancelAnimationFrame(this.requestAnimationFrameIterator);
            } else if (this.loop === An.LOOP_TIMER) {
                clearTimeout(this.setTimeoutIterator);
            }
            this.isPlaying = false;
        }
    };

    /**
     * Loop for timer type of "timer"
     * Internal method
     * @private
     */
    An.prototype.loopTimer = function() {
        var that = this;
        var fps = this.fps || 30;
        var interval = 1000 / fps;

        return (function loop(time){
            that.setTimeoutIterator = setTimeout(loop, interval);
            // call the draw method
            that.internalDrawframe.call(that);
        }());
    };

    /**
     * Loop for timer type of "requestAnimationFrame"
     * Internal method
     * @private
     */
    An.prototype.loopAnimationFrame = function () {
        var that = this;
        var then = new Date().getTime();
        var fps = this.fps || 30;
        var interval = 1000 / fps;

        return (function loop(time){
            that.requestAnimationFrameIterator = requestAnimationFrame(loop);
            var now = new Date().getTime();
            var delta = now - then;
            if (delta > interval) {
                then = now - (delta % interval);
                // call the draw method
                that.internalDrawframe.call(that);
            }
        }(0));
    };


    /**
     * Added scene
     * @param {{index: number, hide: boolean, name: string, runner: null}} sceneObject
     *      index - deep of scene, option march on z-index
     *      hide - bool
     *      name - name
     *      runner - function run every time relatively root.fps
     * @returns {{index: number, hide: boolean, name: string, runner: null}}
     */
    An.prototype.scene = function (sceneObject) {
        var sceneObjectDefault = {index: 100, hide: false, name: 'scene', runner: null};
        if(typeof sceneObject === 'function')
            sceneObject = {runner:sceneObject};

        Util.mergeObject(sceneObjectDefault, sceneObject);
        this.lists.scenes.push(sceneObjectDefault);
        return sceneObjectDefault;
    };

    /**
     * Internal method
     * @private
     */
    An.prototype.scenesFiltering = function () {
        var lists = this.lists;

        if(!this.isFiltering && lists.scenes.length > 0){

            if (!!this.options.sorting )
                lists.scenes = lists.scenes.sort(function(one, two){ return one['index'] > two['index'] });

            if (!!this.options.filtering )
                lists.scenes = lists.scenes.filter(function(val){ return !val['hide']});

            this.isFiltering = true;
        }
    };


    /**
     * Added stage
     * @param {String} stageName - name of stage, rendering is defined by name
     * @param {{index: number, hide: boolean, name: string, runner: null}} sceneObject - Object. is scene object
     */
    An.prototype.stage = function(stageName, sceneObject) {
        if(this.lists.stages[stageName] == null)
            this.lists.stages[stageName] = [];
        this.lists.stages[stageName].push(sceneObject);
    };


    /**
     * Internal method
     * @private
     * @param stageName
     * @param clear
     * @returns {boolean}
     */
    An.prototype.internalStagesToScenes = function (stageName, clear) {
        var i, lists = this.lists;

        if(clear !== false) this.clearScene();

        if(Array.isArray(lists.stages[stageName]))
        {
            for(i = 0; i < lists.stages[stageName].length; i ++){
                this.scene(lists.stages[stageName][i]);
            }
            return true;
        } else
            return false;
    };


    /**
     * It clears the canvas to render the new stage
     */
    An.prototype.clearScene = function () {
        this.lists.scenes = this.lists.events = [];
    };


    /**
     * Clear canvas area
     */
    An.prototype.clear = function(){
        //this.keydownCode = false;
        //this.keyupCode = false;
        this.context.clearRect(0, 0, this.width, this.height);
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
     * Simple point
     * @param x
     * @param y
     * @returns {{x: *, y: *}}
     */
    An.prototype.point = function(x, y){
        return {x: x, y: y};
    };

    /**
     * Simple rectangle
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {*[]}
     */
    An.prototype.rectangle = function(x, y, width, height){
        return [x, y, width, height];
    };



    /**
     * Loading Resource Image.
     * Object imgs:
     * key - is the name for the access, assigned after loading
     * value - is the URL of the resource to load
     * @param {Object} imgs - { key : value, key : value, ...  }
     * @param {Function} callback
     */
    An.prototype.imageLoader = function (imgs, callback) {
        if (!imgs && typeof imgs !== 'object') return;
        var that = this;
        var length = Util.objectLength(imgs);
        var images = {};
        var iterator = 0;
        for (var name in imgs) {
            var eImg = document.createElement('img');
            eImg.src = imgs[name];
            eImg.name = name;
            eImg.onload = function (e) {
                images[this.name] = this;
                iterator++;
                if (iterator == length) {
                    that.lists.images = Util.mergeObject(that.lists.images, images);
                    callback.call(that, that.lists.images, that.context);
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
            temp[key] = Util.cloneObject(object[key]);
        return temp;
    };

    /**
     * Merge object into objectBase. Object objectBase will be modified!
     * @param {Object} defaultObject
     * @param {Object} object
     * @returns {*}
     */
    Util.mergeObject = function (defaultObject, object) {
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


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // External out
    //

    window.An = An;
    window.An.Util = Util;
    window.An.version = '1.2.0';

})();