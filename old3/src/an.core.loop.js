(function(){

    var An = function(_options, p2, p3, p4){

        var pk, properties = {
            selector: null,
            width: 600,
            height: 400,
            fps: 30,
            loop: 'animation'
        };

        Util.defaultObject(properties, _options);
        for (pk in properties)
            this[pk] = properties[pk];

        this.isPlay = false;
        this.setTimeoutIterator = 0;
        this.requestAnimationFrameIterator = 0;
        this.frameCounter = 0;


    };
    An.LOOP_TIMER = 'timer';
    An.LOOP_ANIMATE = 'animation';

    An.prototype.internalDrawframe = function(){
        document.querySelector('#counter').innerHTML = this.frameCounter;
    };

    An.prototype.render = function(){
        this.play();
    };

    An.prototype.play = function(){
        if(!this.isPlay){
            if(this.loop === An.LOOP_ANIMATE) {
                this.loopAnimationFrame();
                this.isPlay = true;
            } else if (this.loop === An.LOOP_TIMER) {
                this.loopTimer();
                this.isPlay = true;
            }
        }
    };

    An.prototype.stop = function(){
        if(this.isPlay){
            if(this.loop === An.LOOP_ANIMATE) {
                cancelAnimationFrame(this.requestAnimationFrameIterator);
                this.isPlay = false;
            } else if (this.loop === An.LOOP_TIMER) {
                clearTimeout(this.setTimeoutIterator);
                this.isPlay = false;
            }
        }
    };


    An.prototype.loopTimer = function(){
        var that = this;
        var fps = this.fps || 30;
        var interval = 1000 / fps;

        return (function loop(time){
            that.setTimeoutIterator = setTimeout(loop, interval);
            // call the draw method
            that.frameCounter ++;
            that.internalDrawframe.call(that);
            console.log('loopTimer>>>', that.frameCounter);
        }());
    };

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
                that.frameCounter ++;
                that.internalDrawframe.call(that);
                console.log('loopAnimationFrame>>>', that.frameCounter);
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


    window.An = An;

})();



var o = {
    selector: '#canvas',
    fps: 1,
    loop: An.LOOP_ANIMATE
};
var a = new An(o);
a.render();
