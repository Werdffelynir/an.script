(function(window){

    "use strict";


    var An = function (prop, p1, p2, p3)
    {
        if (!(this instanceof An))
            return new An(prop, p1, p2, p3);

        if (arguments.length > 2 && arguments[1] > 0)
            prop = {selector: arguments[0], width: arguments[1], height: arguments[2], fps: arguments[3]};

        if (!prop || !prop.selector || typeof prop !== 'object') {
            console.error('Error: selector not find');
            return;
        }

        var properties = {
                //
                // canvas settings
                selector:'',
                fps: 0,
                width:600,
                height:400,
                canvas:null,
                context:null,
                frame:0,

                //
                // functionality
                fullScreen:false,
                autoStart:true,
                autoClear:true,
                enableEventClick:true,
                enableEventMouseMovie:false,
                enableEventKeys:false,

                //
                // dynamic data
                image:      {},
                graphic:    {},
                glob:       {},
                mouse:      { x:0, y:0 },
                mouseClick: { x:0, y:0 },
                keydownCode:null,
                keyupCode:  null,
                interval:   null,
                lists:      {
                    stages:{},
                    events:[],
                    scenes:[],
                    scenesTemp:[]
                }
            };


        //
        // Properties aliases
        this.properties = Util.objMerge(properties, prop);

        this.fps = this.properties.fps;
        this.selector = this.properties.selector;
        this.canvas = this.properties.canvas = document.querySelector(this.properties.selector);

        if(!this.canvas) {
            console.error('Error: canvas not find, [selector:'+this.properties.selector+']');
            return;
        }

        if(!!this.properties.fullScreen) {
            this.properties.width = window.innerWidth - 10;
            this.properties.height = window.innerHeight - 10; //window.outerHeight;
            //this.properties.canvas.style.
        }


        this.width = this.canvas.width = this.properties.width;
        this.height = this.canvas.height = this.properties.height;
        this.context = this.properties.context = this.properties.canvas.getContext('2d');
        this.frame = this.properties.frame;
        this.graphic = {};

        var self = this;

        // initialize extensions
        if(An._extensions.length > 0){
            for(var ei = 0; ei < An._extensions.length; ei ++)
                if(typeof An._extensions[ei] === 'function') An._extensions[ei].call(self, self);
        }



        // It catches the mouse movement on the canvas, and writes changes root.mouse
        if(this.properties.enableEventMouseMovie){
            this.properties.canvas.addEventListener('mousemove', function(event){
                self.properties.mouse = Util.getMouseCanvas(self.properties.canvas, event);
            });
        }


        // It catches the mouse clicks on the canvas, and writes changes root.mouseClick
        if(this.properties.enableEventClick){
            this.properties.canvas.addEventListener('click', function(event)
            {
                self.properties.mouseClick = Util.getMouseCanvas(self.properties.canvas, event);
                if(self.properties.lists.events.click && typeof self.properties.lists.events.click === 'object') {
                    var key, eventsClicks = self.properties.lists.events.click;
                    for(key in eventsClicks ){
                        if(
                            eventsClicks[key].rectangle[0] < self.properties.mouseClick.x &&
                            eventsClicks[key].rectangle[1] < self.properties.mouseClick.y &&
                            eventsClicks[key].rectangle[0] + eventsClicks[key].rectangle[2] > self.properties.mouseClick.x &&
                            eventsClicks[key].rectangle[1] + eventsClicks[key].rectangle[3] > self.properties.mouseClick.y
                        ){
                            eventsClicks[key].callback.call(self, event, eventsClicks[key].rectangle);
                        }
                    }
                }
            });
        }


        /**
         * Draw round rectengle
         * @param x
         * @param y
         * @param width
         * @param height
         * @param radius
         */
        self.properties.context.rectRound = function(x, y, width, height, radius){
            width = width || 100;
            height = height || 100;
            radius = radius || 5;
            self.properties.context.beginPath();
            self.properties.context.moveTo(x + radius, y);
            self.properties.context.arcTo(x + width, y, x + width, y + height, radius);
            self.properties.context.arcTo(x + width, y + height, x, y + height, radius);
            self.properties.context.arcTo(x, y + height, x, y, radius);
            self.properties.context.arcTo(x, y, x + width, y, radius);
        };
        self.properties.context.shadow = function (x, y, blur, color){
            self.properties.context.shadowOffsetX = x;
            self.properties.context.shadowOffsetY = y;
            self.properties.context.shadowBlur = blur;
            self.properties.context.shadowColor = color;
        };
        self.properties.context.clearShadow = function(){
            self.properties.context.shadowOffsetX = self.properties.context.shadowOffsetY = self.properties.context.shadowBlur = 0;
        };
        if(!self.properties.context.ellipse){
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
            self.properties.context.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise){
                self.properties.context.save();
                self.properties.context.beginPath();
                self.properties.context.translate(x, y);
                self.properties.context.rotate(rotation);
                self.properties.context.scale(radiusX / radiusY, 1);
                self.properties.context.arc(0, 0, radiusY, startAngle, endAngle, (anticlockwise||true));
                self.properties.context.restore();
                self.properties.context.closePath();
                self.properties.context.stroke();
            }
        }

    };

    An.prototype.properties = {};

    An._extensions = [];

    An.Extension = function(func){
        An._extensions.push(func);
    };


    function internalDrawFrame(_this)
    {
        var self = _this,
            prop = self.properties;

        if(!prop.context){
            console.error('context object not find');
            return
        }

        prop.frame ++;

        if(prop.lists.scenes.length == 0 && prop.lists.scenesTemp.length > 0){
            prop.lists.scenes = prop.lists.scenesTemp.sort(function(one, two){
                return one['index'] > two['index'];
            });
            prop.lists.scenesTemp = [];
        }

        if(prop.autoClear === true)
            self.clear();

        prop.lists.scenes.forEach(function(item){
            try{
                prop.context.beginPath();
                prop.context.save();
                item.runner.call(item, prop.context, self);
                prop.context.restore();
            }catch(error){
                console.error(error.message);
            }
        });



        if(prop.enableEventKeys){
            window.addEventListener('keydown', function(event){
                prop.keydownCode = event.keyCode;
                if(prop.lists.events.keydown != null && typeof prop.lists.events.keydown[event.keyCode] === 'object'){
                    var e = prop.lists.events.keydown[event.keyCode];
                    e.callback.call(self, event);
                }
            });
            window.addEventListener('keyup', function(event){
                prop.keyupCode = event.keyCode;
                if(prop.lists.events.keyup != null && typeof prop.lists.events.keyup[event.keyCode] === 'object'){
                    var e = prop.lists.events.keyup[event.keyCode];
                    e.callback.call(self, event);
                }
            });
        }

    }

    An.prototype.scene = function(obj){
        if(obj !== null) {
            if(typeof obj === 'function') {
                this.properties.lists.scenesTemp.push({runner:obj});
            } else if(typeof obj === 'object' && typeof obj.runner === 'function') {
                this.properties.lists.scenesTemp.push(obj);
            }
        }
        return this;
    };

    An.prototype.stage = function(name, obj)
    {
        if(this.properties.lists.stages[name] == null)
            this.properties.lists.stages[name] = [];

        this.properties.lists.stages[name].push(obj);
    };

    An.prototype.render = function (name) {
        if(name !== undefined && typeof name === 'string')
            this.applyStage(name);

        if(this.properties.autoStart)
            this.play();
    };


    An.prototype.applyStage = function(name, clear)
    {
        if(clear !== false)
            this.clearStage();

        if(Array.isArray(this.properties.lists.stages[name])){
            for(var i = 0; i < this.properties.lists.stages[name].length; i ++){
                this.scene(this.properties.lists.stages[name][i]);
            }
        }
    };

    An.prototype.play = function(){
        if(this.properties.fps > 0 && this.properties.interval === null) {
            var self = this;
            internalDrawFrame(self);

            self.properties.interval = setInterval(function(){
                internalDrawFrame(self);
            }, 1000 / self.properties.fps);

        } else {
            internalDrawFrame(this);
        }
    };


    An.prototype.clear = function(){
        this.properties.context.clearRect(0, 0, this.properties.width, this.properties.height);
    };
    An.prototype.clearStage = function(){
        this.properties.lists.scenes = this.properties.lists.scenesTemp = this.properties.lists.events = [];
    };

    An.prototype.addEventKeydown = function(keyCode, callback){
        if(this.properties.lists.events.keydown == null) this.properties.lists.events.keydown = {};
        this.properties.lists.events.keydown[keyCode] = {keyCode: keyCode, callback: callback};

    };
    An.prototype.addEventKeyup = function(keyCode, callback){
        if(this.properties.lists.events.keyup == null) this.properties.lists.events.keyup = {};
        this.properties.lists.events.keyup[keyCode] = {keyCode: keyCode, callback: callback};

    };
    An.prototype.addEventClick = function(rectangle, callback){
        if(this.properties.lists.events.click == null) this.properties.lists.events.click = {};
        var eventItem = rectangle.join('_');
        if(this.properties.lists.events.click[eventItem] == null)
            this.properties.lists.events.click[eventItem] = {rectangle: rectangle, callback: callback};

    };
    An.prototype.removeEventClick = function(rectangle){
        var item = rectangle.join('_');
        if(this.properties.lists.events.click != null && this.properties.lists.events.click[item] != null)
            delete this.properties.lists.events.click[item];
    };


    An.prototype.stop = function() {
        if( this.properties.interval !== null ) {
            clearInterval(this.properties.interva);
            this.properties.interval = null;
        }
    };


    An.prototype.resizeCanvas = function(width, height){
        this.properties.canvas.style.position = 'absolute';
        this.properties.canvas.width = this.properties.width = width || window.innerWidth;
        this.properties.canvas.height = this.properties.height = height || window.innerHeight;
    };

    An.prototype.imageLoader = function(imgs, callback){
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
                    self.properties.image = Util.objMerge(self.properties.image, images);
                    callback.call(self, self.properties.image, self.properties.context);
                }
            };
        }
    };
    An.prototype.debugPanel = function(option){
        option = (option) ? option : {};

        var root = this;

        if (typeof root.properties.devPanel !== 'object') {
            root.properties.devPanel = {
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
        var opt = root.properties.devPanel;
        var textX = opt.padding.x + opt.margin.x;
        var textY = opt.padding.y + opt.margin.y;

        root.properties.context.fillStyle = opt.bgColor;
        root.properties.context.fillRect(opt.margin.x,opt.margin.y,root.properties.width,30);
        root.properties.context.font = 'bold 12px/12px Arial';
        root.properties.context.textBaseline = 'top';
        root.properties.context.fillStyle = opt.textColor;
        root.properties.context.fillText('frames: ' + opt.iterator,textX,textY);
        root.properties.context.fillText('seconds: ' + parseInt((new Date().getTime() - opt.timeStart) / 1000), textX,textY + 12);

        var timeNow = (new Date).getTime();
        var ftp = (timeNow - opt.timeLast)/1000;

        if(opt.iterator % 60 == 0){
            var p = parseInt(parseInt(1/ftp) *  100 / root.properties.fps) + opt.load;
            opt.percent = ((p>100)?100:p) + '%';
        }

        root.properties.context.fillStyle = opt.textColor;
        root.properties.context.font = "12px/14px Arial";
        root.properties.context.fillText("FPS: " + parseInt(1/ftp) + '/' + root.properties.fps, 100+textX, textY+6);
        root.properties.context.fillText(opt.percent+'', 170+textX, textY+6);
        if(opt.countEvents)
            root.properties.context.fillText("Events: " + Util.objLength(root.properties.lists.events.click), 230+textX, textY+6);
        if(opt.countScenes)
            root.properties.context.fillText("Scenes: " + root.properties.lists.scenes.length, 320+textX, textY+6);
        if(opt.countStages)
            root.properties.context.fillText("Stages: " + Util.objLength(root.properties.lists.stages), 410+textX, textY+6);

        opt.timeLast = timeNow;
        opt.iterator ++;
    };






    // - - - - - - - - - - - - - - - - - - - - - - - - -
    // Utilities static methods
    // - - - - - - - - - - - - - - - - - - - - - - - - -


    var Util = {};
    /**
     * Cloned object
     * @param {Object} obj
     * @returns {Object}
     */
    Util.objClone = function (obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        var temp = obj.constructor();
        for (var key in obj)
            temp[key] = Util.objClone(obj[key]);
        return temp;
    };
    /**
     * Merge object into objectBase. Object objectBase will be modified!
     * @param {Object} objectBase
     * @param {Object} object
     * @returns {*}
     */
    Util.objMerge = function (objectBase, object) {
        for (var key in object) {
            objectBase[key] = object[key];
        }
        return objectBase;
    };
    Util.objMergeNotExists = function (objectBase, object) {
        for (var key in object)
            if (objectBase[key] === undefined)
                objectBase[key] = object[key];
        return objectBase;
    };
    Util.objMergeOnlyExists = function (objectBase, object) {
        for (var key in object)
            if (objectBase[key] !== undefined)
                objectBase[key] = object[key];
        return objectBase;
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
    Util.objLength = function (obj) {
        var it = 0;
        for (var k in obj) it++;
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


    window.An = An;
    window.An.prototype = An.prototype;
    window.An.prototype.constructor = An;
    window.An.Util = Util;

})(window);