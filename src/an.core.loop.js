(function () {

    var Loop = function (_options, width, height, fps) {

        if (!(this instanceof Loop))
            return new Loop(_options, width, height, fps);

        if (arguments.length > 2 && arguments[1] > 0)
            _options = {selector: arguments[0], width: arguments[1], height: arguments[2], fps: arguments[3]};

        var pk, properties = {
            selector: null,
            width: 600,
            height: 400,
            fps: 30,
            loop: 'animation',
            sorting: true,
            filtering: true
        };

        Util.defaultObject(properties, _options);

        for (pk in properties)
            this[pk] = properties[pk];

        this.isPlay = false;
        this.isFiltering = false;
        this.setTimeoutIterator = 0;
        this.requestAnimationFrameIterator = 0;
        this.frameCounter = 0;
        this.frameStorageList = {};
        this.renderName = 'default';
        this.onFrame = null;
        this.canvas = document.querySelector(this.selector);

        if (!(this.canvas instanceof HTMLCanvasElement)) {
            console.error('[Error]: Canvas element not find. selector: ' + this.selector);
        } else {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.context = this.canvas.getContext('2d');
            if (!(this.context instanceof CanvasRenderingContext2D)) {
                console.error('[Error]: Canvas context 2d not query from element with selector: ' + this.selector);
            }
        }
    };

    Loop.LOOP_TIMER = 'timer';
    Loop.LOOP_ANIMATE = 'animation';
    Loop.prototype.internalDrawframe = function () {
        var i, frame, that = this;
        var frames = this.frameStorageList[this.renderName];
        this.frameCounter++;

        if (Array.isArray(frames)) {
            if (!this.isFiltering && frames.length > 0) {
                if (!!this.sorting)
                    frames = frames.sort(function (one, two) {
                        return one['index'] > two['index']
                    });
                if (!!this.filtering)
                    frames = frames.filter(function (val) {
                        return !val['hide']
                    });
                this.isFiltering = true;
            }
            for (i = 0; i < frames.length; i++) {
                frame = frames[i];
                if (typeof this.onFrame === 'function')
                    this.onFrame.call(this, this.context, this.frameCounter);
                frame.runner.call(frame, this.context, this.frameCounter);
            }
        }
    };

    Loop.prototype.frame = function (name, sceneObject) {
        if((typeof name === 'object' || typeof name === 'function') && arguments.length === 1){
            sceneObject = name;
            name = 'default';
        }

        sceneObject = this.createSceneObject(sceneObject);
        if (!Array.isArray(this.frameStorageList[name]))
            this.frameStorageList[name] = [];
        this.frameStorageList[name].push(sceneObject);
        return sceneObject;
    };

    Loop.prototype.createSceneObject = function (sceneObject) {
        var sceneObjectDefault = {index: 100, hide: false, name: 'scene', runner: null};
        if (typeof sceneObject === 'function') sceneObject = {runner: sceneObject};
        Util.defaultObject(sceneObjectDefault, sceneObject);
        return sceneObjectDefault;
    };

    Loop.prototype.render = function (renderName) {
        this.play(renderName || 'default');
    };

    Loop.prototype.play = function (renderName) {
        if (!this.isPlay) {
            this.renderName = renderName;
            if (this.loop === Loop.LOOP_ANIMATE) {
                this.loopAnimationFrame();
                this.isPlay = true;
            } else if (this.loop === Loop.LOOP_TIMER) {
                this.loopTimer();
                this.isPlay = true;
            }
        }
    };

    Loop.prototype.stop = function () {
        if (this.isPlay) {
            if (this.loop === Loop.LOOP_ANIMATE) {
                cancelAnimationFrame(this.requestAnimationFrameIterator);
                this.isPlay = false;
            } else if (this.loop === Loop.LOOP_TIMER) {
                clearTimeout(this.setTimeoutIterator);
                this.isPlay = false;
            }
        }
    };


    Loop.prototype.loopTimer = function () {
        var that = this;
        var fps = this.fps || 30;
        var interval = 1000 / fps;

        return (function loop(time) {
            that.setTimeoutIterator = setTimeout(loop, interval);
            // call the draw method
            that.internalDrawframe.call(that);
        }());
    };

    Loop.prototype.loopAnimationFrame = function () {
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
                that.internalDrawframe.call(that);
            }
        }(0));
    };


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Utilities static methods
    //

    var Util = {};

    Util.defaultObject = function (defaultObject, object) {
        for (var key in object) {
            defaultObject[key] = object[key];
        }
        return defaultObject;
    };


    window.Loop = Loop;
    window.Loop.Util = Util;

})();
