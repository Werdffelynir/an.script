(function(window, An){

    console.clear();
    console.log("Loaded: Demo");


    var an = new An({

        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 30,

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

        debugPanelElement: false,
        debugPanelSettings: false,

        enableEventClick: true,
        enableEventMousemove: true,
        enableEventKeys: false
    });

    var Dm = {};
    Dm.list = [];
    Dm.clip = {};
    Dm.clip.item = function (ctx) {};
    Dm.clip.ball = function (ctx) {

    };

    Dm.x = 100;
    Dm.y = 100;
    Dm.dx = 0;
    Dm.dy = 0;
    Dm.speed = 3;

    Dm.onClick = function(point){


    };

    Dm.onFrame = function(ctx, frameCounter){

        var point = an.eventMousemove;
        if (an.hitTestPoint([Dm.x-10, Dm.y-10, 20, 20], point) || An.Util.distanceBetween({x:Dm.x, y:Dm.y}, point) < 3) {
            Dm.dx = 0;
            Dm.dy = 0;
        }
    };

    Dm.onMousemove = function(point){
        var xDiff = point.x - Dm.x;
        var yDiff = point.y - Dm.y;
        var angle = Math.atan2(yDiff, xDiff);
        Dm.dx = Dm.speed * Math.cos(angle);
        Dm.dy = Dm.speed * Math.sin(angle);
    };



    an.scene(function(ctx){

        Dm.x += Dm.dx *= 0.988;
        Dm.y += Dm.dy *= 0.988;

        an.Graphic.circle(Dm.x, Dm.y, 20, '#C4ACED', true);
        an.Graphic.circle(Dm.x, Dm.y, 10, '#7C55C2', true);

    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.onMousemove = Dm.onMousemove;

    an.render();

})(window, An);
