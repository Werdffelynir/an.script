
(function() {

    "use strict";

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var An = function(options, p1, p2, p3)
    {
        if (!(this instanceof An))
            return new An(options, p1, p2, p3);

        if (arguments.length > 2 && arguments[1] > 0)
            options = {selector: arguments[0], width: arguments[1], height: arguments[2], fps: arguments[3]};

        if (!options || !options.selector || typeof options !== 'object') {
            console.error('Error: selector not find');
            return;
        }







        // 1000ms / 60(fps) = 16.7ms
        // FPS – frame per second)
        // stages
        // frames
        // frame
        // frameStage(name, frameObj)

        // layers
        // getLayer()
        // createLayer()
        // layerObject = layer('name', index)
        // layerObject.visibly(bool)
        // layerObject.index(index)














    };

    An.internalExtensions = [];
    An.Extension = function(func){
        An.internalExtensions.push(func);
    };

    An.prototype.__m__ = function () {};
    An.prototype.toString = function () {return '[object An]'};
    An.prototype.render = function (name) {};
    An.prototype.internalDrawframe = function (name) {};

    window.An = An;
    window.An.Util = Util;
    window.An.version = '1.2.0';

})();
