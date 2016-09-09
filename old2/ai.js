
(function(){

    "use strict";

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var Ai = function (options) {

        var oKey, defaultProperties = {
            selector: '',
            fps: 0,
            width: 600,
            height: 400,
            canvas: null,
            context: null,
            frame: 0,
            listScenes: [],
            listScenesTemp: [],
            intervalId: null,
            autoClear: true,
            stopped: false
        };

        Ai.default(defaultProperties, options);

        for (oKey in defaultProperties)
            this[oKey] = defaultProperties[oKey];

        this.canvas = document.querySelector(this.selector);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        // initialize extensions
        if(Ai.extensions.length > 0){
            for(var ei = 0; ei < Ai.extensions.length; ei ++)
                if(typeof Ai.extensions[ei] === 'function') Ai.extensions[ei].call(this, this);
        }


    };


    Ai.prototype.scene = function (obj) {
        if(obj !== null) {
            if(typeof obj === 'function') {
                this.listScenesTemp.push({runner:obj});
            } else if(typeof obj === 'object' && typeof obj.runner === 'function') {
                this.listScenesTemp.push(obj);
            }
        }
        return this;
    };


    Ai.prototype.animate = function (timestamp) {

        var self = this;

        self.frame ++;

        if(self.autoClear === true)
            self.clear();

        if(self.listScenes.length == 0 && self.listScenesTemp.length > 0){
            self.listScenes = self.listScenesTemp.sort(function(one, two){
                return one['index'] > two['index'];
            });
            self.listScenesTemp = [];
        }

        self.listScenes.forEach(function(item){
            try{
                self.context.beginPath();
                self.context.save();
                item.runner.call(item, self.context, self);
                self.context.restore();
            }catch(error){
                console.error(error.message);
            }
        });

        if(self.fps > 0 && self.intervalId === null && !self.stopped) {
            self.intervalId = setInterval(function() {
                self.animate();
            }, 1000 / self.fps);
        }

    };



    Ai.prototype.play = function() {
        this.animate();
        this.stopped = false;
    };

    Ai.prototype.stop = function() {
        this.stopped = true;
        clearInterval(this.intervalId);
        this.intervalId = null;
    };


    /**
     * Clear canvas area
     */
    Ai.prototype.clear = function(){
        this.context.clearRect(0, 0, this.width, this.height);
    };

    Ai.default = function (defaultObject, object) {
        for (var key in object) {
            defaultObject[key] = object[key];
        }
        return defaultObject;
    };

    Ai.extensions = [];

    Ai.Extension = function(func){
        Ai.extensions.push(func);
    };

    window.Ai = Ai;

})();