/**
 * Animation script
 */
(function () {

    "use strict";

    window.requestAnimationFrame = function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (f) {
                window.setTimeout(f, 1e3 / 60);
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
    var An = function (props_selector, width, height, fps) {

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

            // events
            onClick: null,
            onFrame: null,
            onFrameBefore: null,
            onFrameAfter: null,
            onMousemove: null,
            onKeydown: null,
            onKeyup: null,

            // functionality
            loop: An.LOOP_ANIMATE, //'animation',
            fullScreen: false,

            autoStart: true,
            autoClear: true,
            saveRestore: false,

            enableEventClick: true,
            enableEventMouseMovie: false,
            enableEventKeys: false,

            // else
            //canvas: null,
            //context: null,
            contextId: '2d'
        };

        Util.mergeObject(propertiesDefault, props_selector);

        for (pk in propertiesDefault)
            this[pk] = propertiesDefault[pk];

        // dynamics

        this.canvas = document.querySelector(this.selector);

        if (!(this.canvas instanceof HTMLCanvasElement)) {
            console.error('[Error]: Canvas element not find. selector: ' + this.selector);
            return;
        }

        if (!!this.fullScreen) {
            this.resizeCanvas();
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext(this.contextId);

        if (!(this.context instanceof CanvasRenderingContext2D)) {
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
            images: {}
        };

        this.options = {
            sorting: true,
            filtering: true,
            debugPanelElement: false,
            debugPanelSettings: false
        };

        Util.mergeObject(this.options, props_selector);


        if (this.options.debugPanelElement) {
            An.Debug.setDebugPanelElement(this.options.debugPanelElement);
        }
        if (this.options.debugPanelSettings) {
            An.Debug.internalSettings = this.options.debugPanelSettings;
        }


        var that = this;

        // initialize extensions
        if (An.internalExtensions.length > 0) {
            for (var ei = 0; ei < An.internalExtensions.length; ei++)
                if (typeof An.internalExtensions[ei] === 'function') An.internalExtensions[ei].call(that, that);
        }

        // It catches the mouse movement on the canvas, and writes changes root.mouse
        if (that.enableEventMouseMovie) {
            that.canvas.addEventListener('mousemove', function (event) {
                that.mouse = Util.getMouseCanvas(that.canvas, event);

                if (typeof that.onMousemove === 'function')
                    that.onMousemove.call(that, that.mouse, that.context);
            });
        }

        // It catches the mouse clicks on the canvas, and writes changes root.mouseClick
        if (that.enableEventClick) {
            that.canvas.addEventListener('click', function (event) {
                that.mouseClick = Util.getMouseCanvas(that.canvas, event);

                if (typeof that.onClick === 'function')
                    that.onClick.call(that, that.mouseClick, that.context);

                if (typeof that.lists.events.click === 'object') {
                    var key, eventsClicks = that.lists.events.click;
                    for (key in eventsClicks) {
                        if (
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
        if (that.enableEventKeys) {
            window.addEventListener('keydown', function (event) {
                that.keydownCode = event.keyCode;

                if (typeof that.onKeydown === 'function')
                    that.onKeydown.call(that, event, event.keyCode);

                if (that.lists.events.keydown != null && typeof that.lists.events.keydown[event.keyCode] === 'object') {
                    var e = that.lists.events.keydown[event.keyCode];
                    e.callback.call(that, event);
                }
            });
            window.addEventListener('keyup', function (event) {
                that.keyupCode = event.keyCode;

                if (typeof that.onKeyup === 'function')
                    that.onKeyup.call(that, event, event.keyCode);

                if (that.lists.events.keyup != null && typeof that.lists.events.keyup[event.keyCode] === 'object') {
                    var e = that.lists.events.keyup[event.keyCode];
                    e.callback.call(that, event);
                }
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
    An.Extension = function (func) {
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

        this.frameCounter++;
        this.scenesFiltering();

        var i,
            scene,
            scenes = this.lists.scenes;

        if (this.autoClear === true)
            this.clear();

        if (!this.errorDrawframe) {

            if (typeof this.onFrameBefore === 'function')
                this.onFrameBefore.call(this, this.context, this.frameCounter);

            if (scenes.length == 0 && !this.onFrameBefore && !this.onFrameBefore && typeof this.onFrame === 'function')
                this.onFrame.call(this, this.context, this.frameCounter);
            else {

                for (i = 0; i < scenes.length; i++) {
                    scene = scenes[i];
                    try {
                        if (this.saveRestore)
                            this.context.save();

                        if (typeof this.onFrame === 'function')
                            this.onFrame.call(this, this.context, this.frameCounter);

                        scene.runner.call(scene, this.context, this.frameCounter);

                        if (this.saveRestore)
                            this.context.restore();

                    } catch (error) {
                        /**
                         * @type ReferenceError error
                         */
                        this.errorDrawframe = 'Error message: ' + error.message;
                        this.errorDrawframe += '\nError file: ' + error.fileName;
                        this.errorDrawframe += '\nError line: ' + error.lineNumber;
                        break;
                    }
                }
            }

            if (typeof this.onFrameAfter === 'function')
                this.onFrameAfter.call(this, this.context, this.frameCounter);

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
    An.prototype.render = function (stageName) {
        var run = true;
        if (typeof stageName === 'string') {
            run = this.internalStagesToScenes(stageName);
        }

        if (run && this.autoStart)
            this.play();
    };

    /**
     * Change current stage
     * @param stageName
     */
    An.prototype.renderStage = function (stageName) {
        this.internalStagesToScenes(stageName);
    };

    /**
     * Start "play" animation
     */
    An.prototype.play = function () {
        if (!this.isPlaying) {
            this.internalDrawframe();

            if (this.fps && this.loop === An.LOOP_ANIMATE) {
                this.loopAnimationFrame();
            }
            else if (this.fps && this.loop === An.LOOP_TIMER) {
                this.loopTimer();
            }

            if (this.fps > 0)
                this.isPlaying = true;
        }
    };


    /**
     * Stop "play" animation
     */
    An.prototype.stop = function () {
        if (this.isPlaying) {
            if (this.loop === An.LOOP_ANIMATE) {
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
    An.prototype.loopTimer = function () {
        var that = this;
        var fps = this.fps || 30;
        var interval = 1000 / fps;

        return (function loop(time) {
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

        return (function loop(time) {
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
     * @param {{index: number, hide: boolean, name: string, runner: null}|function} sceneObject
     *      index - deep of scene, option march on z-index
     *      hide - bool
     *      name - name
     *      runner - function run every time relatively root.fps
     * @returns {{index: number, hide: boolean, name: string, runner: null}}
     */
    An.prototype.scene = function (sceneObject) {
        sceneObject = this.createSceneObject(sceneObject);
        this.lists.scenes.push(sceneObject);
        return sceneObject;
    };

    /**
     * Internal method
     * @private
     */
    An.prototype.scenesFiltering = function () {
        var lists = this.lists;

        if (!this.isFiltering && lists.scenes.length > 0) {

            if (!!this.options.sorting)
                lists.scenes = lists.scenes.sort(function (one, two) {
                    return one['index'] > two['index']
                });

            if (!!this.options.filtering)
                lists.scenes = lists.scenes.filter(function (val) {
                    return !val['hide']
                });

            this.isFiltering = true;
        }
    };

    An.prototype.createSceneObject = function (sceneObject) {
        var sceneObjectDefault = {index: 100, hide: false, name: 'scene', runner: null};
        if (typeof sceneObject === 'function') sceneObject = {runner: sceneObject};
        Util.mergeObject(sceneObjectDefault, sceneObject);
        return sceneObjectDefault;
    };
    /**
     * Added stage
     * @param {String} stageName - name of stage, rendering is defined by name
     * @param {{index: number, hide: boolean, name: string, runner: null}|function} sceneObject - Object. is scene object
     */
    An.prototype.stage = function (stageName, sceneObject) {
        if (this.lists.stages[stageName] == null)
            this.lists.stages[stageName] = [];

        sceneObject = this.createSceneObject(sceneObject);

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

        if (clear !== false) this.clearScene();

        if (Array.isArray(lists.stages[stageName])) {
            for (i = 0; i < lists.stages[stageName].length; i++) {
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
        this.lists.scenes = [];
        //this.lists.events = [];
    };


    /**
     * Clear canvas area
     */
    An.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };


    /**
     * Resize element Canvas on full page, or by params
     * @param {Number} width - default full window width
     * @param {Number} height - default full window height
     */
    An.prototype.resizeCanvas = function (width, height) {
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
    An.prototype.addEventKeydown = function (keyCode, callback) {
        if (this.lists.events.keydown == null)
            this.lists.events.keydown = {};

        this.lists.events.keydown[keyCode] = {keyCode: keyCode, callback: callback};
    };

    /**
     * Added callback for event "keyup" by "keyCode"
     * @param {Number} keyCode
     * @param {Function} callback - callback on event
     */
    An.prototype.addEventKeyup = function (keyCode, callback) {
        if (this.lists.events.keyup == null)
            this.lists.events.keyup = {};

        this.lists.events.keyup[keyCode] = {keyCode: keyCode, callback: callback};
    };

    /**
     * Adds a callback for the event click on a certain area: rectangle = [x,y,width,height]
     * @param {Array} rectangle - [x, y, width, height]
     * @param {Function} callback - callback on event
     */
    An.prototype.addEventClick = function (rectangle, callback) {
        if (this.lists.events.click == null)
            this.lists.events.click = {};

        var eventItem = rectangle.join('_');

        if (Util.objectLength(this.lists.events.click) > 49) {
            var key;
            for (key in this.lists.events.click) {
                delete this.lists.events.click[key];
                break;
            }
        }

        if (this.lists.events.click[eventItem] == null)
            this.lists.events.click[eventItem] = {rectangle: rectangle, callback: callback};
    };

    /**
     * Removes the callback onclick event appointed above by this.addEvent Click,
     * specific area: rectangle = [x,y,width,height]
     * @param {Array} rectangle - [x, y, width, height]
     */
    An.prototype.removeEventClick = function (rectangle) {
        var item = rectangle.join('_');

        if (this.lists.events.click != null && this.lists.events.click[item] != null)
            delete this.lists.events.click[item];
    };


    /**
     * Simple point
     * @param x
     * @param y
     * @returns {{x: *, y: *}}
     */
    An.prototype.point = function (x, y) {
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
    An.prototype.rectangle = function (x, y, width, height) {
        return [x, y, width, height];
    };

    An.prototype.hitTest = function (rectangle) {
        return this.hitTestPoint(rectangle, this.mouseClick)
    };

    An.prototype.hitTestPoint = function (rectangle, point) {
        if (typeof rectangle !== "object" || typeof rectangle !== "object") {
            console.error("rectangle - must be Array [x, y, w, h]; point - must be Object { x: , y: }");
            return false;
        }
        var mouseClick = point;
        return rectangle[0] < mouseClick.x &&
            rectangle[1] < mouseClick.y &&
            rectangle[0] + rectangle[2] > mouseClick.x &&
            rectangle[1] + rectangle[3] > mouseClick.y;
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
                    callback.call(that, images);
                }
            };
        }
    };

    /**
     *
     * @param name
     * @returns {*}
     */
    An.prototype.image = function (name) {
        if (!name)
            return this.lists.images;
        if (this.lists.images[name])
            return this.lists.images[name];
    };


    /**
     * Set background color for canvas element;
     * @param color
     */
    An.prototype.backgroundColor = function (color) {
        this.canvas.style.backgroundColor = color;
    };


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Utilities static methods
    //

    An.Debug = {};
    An.Debug.internalSettings = {};
    An.Debug.internalElement = null;

    An.Debug.setDebugPanelElement = function (selector) {
        var elem = null;
        if (typeof selector == 'string')
            elem = document.querySelector(selector);
        else if (typeof selector == 'object')
            elem = selector;
        if (elem) {
            elem.style.margin = '0 auto';
            elem.style.border = '2px solid #1e1e1e';
            elem.style.padding = '5px';
            elem.style.backgroundColor = '#2b2b2b';
            elem.style.color = '#d1d1d1';
            An.Debug.internalElement = elem;
        }
    };

    An.Debug.field = function (field, value) {
        if (!An.Debug.internalElement) {
            console.error('DebugPanelElement not find! Set DebugPanelElement!');
            return;
        }
        var fieldId = field.replace(/[^\w]/g, '');
        var fieldElement = An.Debug.internalElement.querySelector('#dp_' + fieldId);
        if (!fieldElement) {
            fieldElement = document.createElement('div');
            fieldElement.id = 'dp_' + fieldId;
            An.Debug.internalElement.appendChild(fieldElement);
        }
        fieldElement.innerHTML = '<strong>' + field + '</strong> ' + (value || '');
        return fieldElement;
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


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Internal Extensions
    //


    /**
     * Extension expands of current context (CanvasRenderingContext2D)
     */
    An.Extension(function (self) {

        /**
         * @type An self
         * @type CanvasRenderingContext2D self.context
         */

        if (!(this instanceof An) || !(self instanceof An))
            return;

        /**
         * Draw round rectangle
         * @param x
         * @param y
         * @param width
         * @param height
         * @param radius
         */
        self.context.rectRound = function (x, y, width, height, radius) {
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
        self.context.shadow = function (x, y, blur, color) {
            self.context.shadowOffsetX = x;
            self.context.shadowOffsetY = y;
            self.context.shadowBlur = blur;
            self.context.shadowColor = color;
        };

        /**
         * Clear shadow params (shadowOffsetX,shadowOffsetY,shadowBlur)
         */
        self.context.clearShadow = function () {
            self.context.shadowOffsetX = self.context.shadowOffsetY = self.context.shadowBlur = 0;
        };

        if (!self.context.ellipse) {
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
            self.context.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
                self.context.save();
                self.context.beginPath();
                self.context.translate(x, y);
                self.context.rotate(rotation);
                self.context.scale(radiusX / radiusY, 1);
                self.context.arc(0, 0, radiusY, startAngle, endAngle, (anticlockwise || true));
                self.context.restore();
                self.context.closePath();
                self.context.stroke();
            }
        }
    });


    /**
     * Extension of simple graphic shapes
     */
    An.Extension(function (self) {

        /**
         * @type An self
         * @type CanvasRenderingContext2D self.context
         */

        if (!(this instanceof An) || !(self instanceof An))
            return;

        self.graphic = {};

        /**
         *
         * @param points
         * @param color
         * @param fill
         * @param closePath
         * @param lineWidth
         */
        self.graphic.shape = function (points, color, fill, closePath, lineWidth) {

            var positions = [];
            var i, temp = {};

            points.map(function (p) {
                if (temp.x === undefined) {
                    temp.x = p
                }
                else if (temp.y === undefined) {
                    temp.y = p
                }
                if (temp.x !== undefined && temp.y !== undefined) {
                    positions.push(temp);
                    temp = {};
                }
            });

            self.context.beginPath();

            for (i = 0; i < positions.length; i++) {
                self.context.lineTo(positions[i].x, positions[i].y);
            }

            if (fill) {
                if (typeof fill === 'string') {
                    self.graphic.shape(points, color, true);
                    self.graphic.shape(points, fill, false, closePath, lineWidth);
                } else {
                    self.context.closePath();
                    self.context.fillStyle = color || '#000';
                    self.context.fill();
                }
            }
            else {

                if (lineWidth)
                    self.context.lineWidth = lineWidth;

                if (closePath !== false)
                    self.context.closePath();

                self.context.strokeStyle = color || '#000';
                self.context.stroke();
            }

        };

        /**
         *
         * @param x
         * @param y
         * @param width
         * @param height
         * @param color
         * @param fill
         */
        self.graphic.rect = function (x, y, width, height, color, fill) {
            self.context.beginPath();
            self.context.rect(x || 0, y || 0, width || 100, height || 100);

            if (fill) {
                self.context.fillStyle = color || '#000';
                self.context.fill();
                if (typeof fill === 'string') {
                    self.context.strokeStyle = fill || '#000';
                    self.context.strike();
                }
            }
            else {
                self.context.strokeStyle = color || '#000';
                self.context.stroke();
            }

            self.context.closePath();
        };

        /**
         *
         * @param x
         * @param y
         * @param width
         * @param height
         * @param radius
         * @param color
         * @param fill
         */
        self.graphic.rectRound = function (x, y, width, height, radius, color, fill) {
            self.context.rectRound(x, y, width, height, radius);

            if (fill) {
                self.context.fillStyle = color || '#000';
                self.context.fill();
                if (typeof fill === 'string') {
                    self.context.strokeStyle = fill || '#000';
                    self.context.strike();
                }
            }
            else {
                self.context.strokeStyle = color || '#000';
                self.context.stroke();
            }

            //self.context.closePath();
        };

        /**
         *
         * @param x
         * @param y
         * @param radius
         * @param color
         * @param fill
         */
        self.graphic.circle = function (x, y, radius, color, fill) {
            self.graphic.rectRound(x - (radius / 2), y - (radius / 2), radius, radius, radius / 2, color, fill);
        };

        // line.line(10, 10, 100, 2, 'blue');


        self.graphic.linePoints = function (point1, point2, lineWidth, color) {

            self.context.beginPath();
            self.context.lineWidth = lineWidth || 1;
            self.context.strokeStyle = color;
            self.context.moveTo(point1.x, point1.y);
            self.context.lineTo(point2.x, point2.y);
            self.context.stroke();

            self.context.beginPath();
            self.context.closePath();
        };

        /**
         *
         * @param x
         * @param y
         * @param width
         * @param lineWidth thickness
         * @param color
         */
        self.graphic.lineWidth = function (x, y, width, lineWidth, color) {
            if (width < 0) {
                x -= Math.abs(width);
                width = Math.abs(width);
            }
            self.graphic.linePoints(self.point(x, y), self.point(x + width, y), lineWidth, color);
        };

        self.graphic.lineHeight = function (x, y, height, lineWidth, color) {
            if (height < 0) {
                y -= Math.abs(height);
                height = Math.abs(height);
            }
            self.graphic.linePoints(self.point(x, y), self.point(x, y + height), lineWidth, color);
        };
    });


    /**
     * Extension of simple Text
     */
    An.Extension(function (self) {

        /**
         * @type An self
         * @type CanvasRenderingContext2D self.context
         */

        if (!(this instanceof An) || !(self instanceof An))
            return;

        var Text = {
            font: '12px Arial, sans',
            lineWidth: 1,
            textBaseline: "top"
        };
        /**
         * font 12pt/10pt sans-serif
         * font bold italic 110% serif
         * font normal small-caps 12px/14px fantasy
         * font 400 24pt
         * font italic 900 14px/10px Arial
         * @param fontString
         */
        Text.font = function (fontString) {
            Text._font = fontString;
        };

        /**
         *
         * @param x
         * @param y
         * @param label
         * @param color
         * @param fill
         */
        Text.write = function (x, y, label, color, fill) {

            if (Text.font)
                self.context.font = Text.font;

            if (Text.textBaseline)
                self.context.textBaseline = Text.textBaseline;

            if (Text.lineWidth)
                self.context.lineWidth = Text.lineWidth;

            //self.context.beginPath();

            if (fill) {
                self.context.fillStyle = color || '#DDD';
                self.context.fillText(label, x, y);

                if (typeof fill === 'string') {
                    self.context.strokeStyle = fill || '#000';
                    self.context.strokeText(label, x, y);
                }
            }
            else {
                self.context.strokeStyle = color || '#000';
                self.context.strokeText(label, x, y);
            }

            //self.context.closePath();
        };

        self.Text = Text;
    });


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // External out
    //

    window.An = An;
    window.An.Util = Util;
    window.An.version = '0.2.0';

})();