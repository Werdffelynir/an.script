/**
The script implements a control HTML5 element canvas. Simplified realization of animation or static graphs,
and some event-control model for "click", "mousemove", "keydown" and "keyup"
*/
(function(window){

    'use strict';

    var extensions = [];

    var Extension = function(func){
        extensions.push(func);
    };

    var An = function(options,p1,p2,p3)
    {
        if(!(this instanceof An))
            return new An(options,p1,p2,p3);

        if(arguments.length > 2 && arguments[1] > 0)
            options = {selector:arguments[0],width:arguments[1],height:arguments[2],fps:arguments[3]};

        if(!options || !options.selector || typeof options !== 'object')
            return;

        var self = this;
        Util.objMerge(this.properties, options);

        // instance aliases to properties
        this.selector = this.properties.selector;
        this.canvas = this.properties.canvas = document.querySelector(this.selector);
        this.width = this.properties.canvas.width = this.properties.width;
        this.height = this.properties.canvas.height = this.properties.height;
        this.context = this.properties.context = this.canvas.getContext('2d');

        // initialize extensions
        if(extensions.length > 0){
            for(var ei = 0; ei < extensions.length; ei ++)
                if(typeof extensions[ei] === 'function') extensions[ei].call(self, self);
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
                    var eventsClicks = self.properties.lists.events.click;
                    for(var key in eventsClicks ){
                        if(
                            eventsClicks[key].rectangle[0] < self.properties.mouseClick.x &&
                            eventsClicks[key].rectangle[1] < self.properties.mouseClick.y &&
                            eventsClicks[key].rectangle[0]+eventsClicks[key].rectangle[2] > self.properties.mouseClick.x &&
                            eventsClicks[key].rectangle[1]+eventsClicks[key].rectangle[3] > self.properties.mouseClick.y
                        ){
                            eventsClicks[key].callback.call(self, event, eventsClicks[key].rectangle);
                        }
                    }
                }
            });
        }


        this.properties.context.rectRound = function(x, y, width, height, radius){
            radius = radius || 5;
            self.properties.context.beginPath();
            self.properties.context.moveTo(x + radius, y);
            self.properties.context.arcTo(x + width, y, x + width, y + height, radius);
            self.properties.context.arcTo(x + width, y + height, x, y + height, radius);
            self.properties.context.arcTo(x, y + height, x, y, radius);
            self.properties.context.arcTo(x, y, x + width, y, radius);
        };



        //console.log(this);
    };




    An.prototype.properties = {
        fps:                    0,
        width:                  600,
        height:                 400,
        selector:               null,
        autoStart:              true,
        autoClear:              true,
        enableEventClick:       true,
        enableEventMouseMovie:  false,
        enableEventKeys:        false,
        frame:                  0,
        canvas:                 null,
        context:                null,
        mouse:                  { x:0, y:0 },
        mouseClick:             { x:0, y:0 },
        keydownCode:            null,
        keyupCode:              null,
        interval:               null,
        lists:                  {
                                    stages: {},
                                    events: [],
                                    scenes: [],
                                    scenesTemp: []
                                }
    };




    An.prototype.internalDrawFrame = function()
    {
        if( !(this instanceof An) ) return false;
        var self = this,
            prop = this.properties;

        prop.frame ++;

        if(prop.lists.scenes.length == 0 && prop.lists.scenesTemp.length > 0) {
            prop.lists.scenes = prop.lists.scenesTemp.sort(function(one, two) {
                return one['index'] > two['index'];
            });
            //delete prop.lists.scenesTemp;
            prop.lists.scenesTemp = [];
        }

        if(prop.autoClear === true)
            this.clear();

        prop.lists.scenes.forEach(function(item){
            try{
                prop.context.beginPath();
                prop.context.save();
                item.runner.call(item, prop.context, prop);
                prop.context.restore();
            }catch(error){
                console.error(error.message);
            }
        });
    };

    An.prototype.addEventKeydown = function(keyCode, callback){};
    An.prototype.addEventKeyup = function(keyCode, callback){};
    An.prototype.addEventClick = function(rectangle, callback){};
    An.prototype.removeEventClick = function(rectangle){};
    An.prototype.render = function(name){
        if(name !== undefined && typeof name === 'string')
            this.applyStage(name);
        if(this.properties.autoStart)
            this.play();
    };
    An.prototype.stop = function(){
        var interval = this.properties.interval;
        if( interval !== null ){
            clearInterval(interval);
            interval = null;
        }
    };
    An.prototype.play = function(){
        var self = this;
        if(self.properties.fps > 0 && self.properties.interval === null) {
            self.internalDrawFrame();
            self.properties.interval = setInterval(function(){
                self.internalDrawFrame.call(self);
            }, 1000 / self.properties.fps);
        } else
            self.internalDrawFrame()
    };
    An.prototype.clear = function(){
        this.context.clearRect(0, 0, this.properties.width, this.properties.height);
    };
    An.prototype.clearStage = function(){
        this.properties.lists.scenes = this.properties.lists.scenesTemp = this.properties.lists.events = [];
    };
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
    An.prototype.stage = function(name, obj){
        if(this.properties.lists.stages[name] == null)
            this.properties.lists.stages[name] = [];

        this.properties.lists.stages[name].push(obj);
    };
    An.prototype.applyStage = function(name, clear){
        if(clear !== false)
            this.clearStage();
        if(Array.isArray(this.properties.lists.stages[name])){
            for(var i = 0; i < this.properties.lists.stages[name].length; i ++){
                this.scene(this.properties.lists.stages[name][i]);
            }
        }
    };
    An.prototype.resizeCanvas = function(width, height){};
    An.prototype.imageLoader = function(imgs, callback){};
    An.prototype.debugPanel = function(option){};



    // - - - - - - - - - - - - - - - - - - - - - - - - -
    // Graphics static methods
    // - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - -
    // Utilities static methods
    // - - - - - - - - - - - - - - - - - - - - - - - - -


    var Util = {};

    /**
     * Cloned object
     * @param {Object} obj
     * @returns {Object}
     */
    Util.objClone = function(obj){
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
    Util.objMerge = function(objectBase, object){
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
    /**
     * Returns a random integer between min, max, unless specified from 0 to 100
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    Util.rand = function(min,max){
        min = min||0; max = max||100;
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    /**
     * Random color. Returns a string HEX format color.
     * @returns {string}
     */
    Util.randColor = function(){
        var letters = '0123456789ABCDEF'.split(''),
            color = '#';
        for (var i = 0; i < 6; i++ )
            color += letters[Math.floor(Math.random() * 16)];
        return color;
    };
    /**
     * Converts degrees to radians
     * @param {number} deg - degrees
     * @returns {number}
     */
    Util.degreesToRadians = function(deg){return (deg * Math.PI) / 180;};
    /**
     * Converts radians to degrees
     * @param {number} rad - radians
     * @returns {number}
     */
    Util.radiansToDegrees = function(rad){return (rad * 180) / Math.PI;};
    /**
     * Calculate the number of items in e "obj"
     * @param {Object} obj
     * @returns {number}
     */
    Util.objLength = function(obj){
        var it = 0;
        for(var k in obj) it ++;
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
    Util.distanceBetween = function(p1,p2){
        var dx = p2.x-p1.x;
        var dy = p2.y-p1.y;
        return Math.sqrt(dx*dx + dy*dy);
    };
    /**
     * Returns the coordinates of the mouse on any designated element
     * @param {Object} element
     * @param {Object} event
     * @returns {{x: number, y: number}}
     */
    Util.getMouseElement = function(element, event) {
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
    Util.getMouseCanvas = function(canvas, event){
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };




    An.version = '1.1.0';

    window.An = An;
    window.An.Util = Util;
    window.An.Extension = Extension;

})(window);
