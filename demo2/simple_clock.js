(function(window, An){

    console.clear();
    console.log("Loaded: Simple clock");

    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 60,

        onClick: null,
        onFrame: null,
        onFrameBefore: null,
        onFrameAfter: null,
        onMousemove: null,
        onKeydown: null,
        onKeyup: null,

        loop: An.LOOP_ANIMATE,
        fullScreen: false,

        autoStart: true,
        autoClear: true,
        saveRestore: false,

        sorting: true,
        filtering: true,

        enableEventClick: true,
        enableEventMousemove: false,
        enableEventKeys: false
    });

    var Dm = {};
    Dm.dynamicSec = 0;
    Dm.dynamicMin = 0;
    Dm.dynamicHour = 0;

    Dm.onFrame = function (ctx, frameCounter) {

        // Rotate
        Dm.dynamicSec += 0.10471975511965977;
        if (Dm.dynamicSec > 6.283185307179586) Dm.dynamicSec = 0;
        Dm.dynamicMin += 0.0017453292519943294;
        if (Dm.dynamicMin > 6.283185307179586) Dm.dynamicMin = 0;
        Dm.dynamicHour += 0.000029088820866572157;
        if (Dm.dynamicHour > 6.283185307179586) Dm.dynamicHour = 0;

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(Dm.dynamicSec);
        an.Graphic.rect(0, -2, 150, 4, '#ddd', true);
        ctx.restore();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(Dm.dynamicMin);
        an.Graphic.rect(0, -3, 100, 6, '#ddd', true);
        ctx.restore();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(Dm.dynamicHour);
        an.Graphic.rect(0, -3, 70, 6, '#ddd', true);
        ctx.restore();

        an.Graphic.circle(200, 200, 20, '#eee', true);
    };


    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
