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
    Dm.pointExit = [473,328,476,381,551,380,553,326];
    Dm.wallPoints = [49,167,54,238,113,253,172,225,161,167,145,127,179,88,242,69,294,112,299,168,274,216,201,268,171,319,193,374,259,388,352,362,391,306,398,256,428,203,462,179,501,192,521,233,503,264,480,295,459,345,463,382,497,387,536,375,567,319,563,268,571,224,591,152,572,102,543,68,499,51,422,59,403,97,403,150,396,184,383,213,356,258,323,287,296,304,269,307,255,296,258,277,278,256,322,235,366,184,371,101,341,39,307,19,246,15,207,28,147,54,114,90,90,130];

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
        an.Text.write(10, 10, 'Speed: ' + Dm.speed.toFixed(2), '#000', true);
        an.Text.write(10, 30, 'Life: ' + parseInt(Dm.size), '#000', true);

    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.onMousemove = Dm.onMousemove;

    an.render();

})(window, An);
