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
        enableEventKeys: true
    });

    var Dm = {};
    Dm.list = [];
    Dm.clip = {};
    Dm.clip.ball = function (ctx) {};

    Dm.x = 100;
    Dm.y = 200;
    Dm.dx = 0;
    Dm.dy = 0;
    Dm.speed = 3;
    Dm.gotoLeft = false;
    Dm.gotoRight = false;
    Dm.gotoUp = false;
    Dm.gotoDown = false;
    Dm.size = 1;
    Dm.pointExit = [457,102,510,101,530,146,509,200,461,183];
    Dm.wallPoints = [30,193,66,270,148,296,249,263,281,201,399,191,430,260,555,276,584,175,524,67,225,47,106,79,46,126];

    Dm.createWalls = function (ctx, x, y) {

        an.Graphic.shape(Dm.wallPoints, 'rgba(90,250,50,.5)', '#000', true, 5);

        if (!ctx.isPointInPath(x, y)) {
            Dm.x = 100;
            Dm.y = 200;
            Dm.speed = 3;
        }

        an.Graphic.shape(Dm.pointExit, 'rgba(90,250,50,.9)', '#000', true, 2);
        if (ctx.isPointInPath(x, y)) {
            Dm.speed = 0;

            ctx.beginPath();
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.rect(200, 180, 130, 30);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            an.Text.font = 'bold 18px Arial';
            an.Text.write(215, 187, 'Game over', '#000', true);
            ctx.closePath();
        }
    };

    Dm.onClick = function (point) { };
    Dm.onFrame = function (ctx, frameCounter) {};
    Dm.onMousemove = function(point){};


    an.Event.addKeydown(37, function(e){Dm.gotoLeft = true});
    an.Event.addKeyup(37, function(){Dm.gotoLeft = false});

    an.Event.addKeydown(39, function(){Dm.gotoRight = true});
    an.Event.addKeyup(39, function(){Dm.gotoRight = false});

    an.Event.addKeydown(38, function(){Dm.gotoUp = true});
    an.Event.addKeyup(38, function(){Dm.gotoUp = false});

    an.Event.addKeydown(40, function(){Dm.gotoDown = true});
    an.Event.addKeyup(40, function(){Dm.gotoDown = false});

    an.scene(function(ctx){
        var point = an.eventMousemove;

        if (Dm.gotoLeft)    Dm.x -= Dm.speed;
        if (Dm.gotoRight)   Dm.x += Dm.speed;
        if (Dm.gotoUp)      Dm.y -= Dm.speed;
        if (Dm.gotoDown)    Dm.y += Dm.speed;

        // health
        Dm.createWalls(ctx, Dm.x, Dm.y);

        // hero
        an.Graphic.circle(Dm.x, Dm.y, 15*Dm.size, '#C4ACED', true);
        an.Graphic.circle(Dm.x, Dm.y, 8*(Dm.size/2), '#7C55C2', true);

        // text panel
        an.Text.font = 'bold 13px Arial';
        an.Text.write(10, 10, 'Speed: ' + Dm.speed.toFixed(2), '#000', true);
        an.Text.write(10, 30, 'Life: ' + parseInt(Dm.size), '#000', true);

    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.onMousemove = Dm.onMousemove;

    an.render();

})(window, An);
