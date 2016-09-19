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
    Dm.y = 100;
    Dm.dx = 0;
    Dm.dy = 0;
    Dm.speed = 3;
    Dm.gotoLeft = false;
    Dm.gotoRight = false;
    Dm.gotoUp = false;
    Dm.gotoDown = false;
    Dm.size = 1;



    Dm.healths = [];
    for (var i = 0 ; i < 30; i ++) {
        Dm.healths.push({
            x: An.Util.rand(10, an.width-10),
            y: An.Util.rand(10, an.height-10)
        });
    }

    Dm.createHealths = function (ctx, x, y) {

        Dm.healths.map(function(health, i){

            an.Graphic.circle(health.x, health.y, 15, '#FFDAC8', true);
            an.Graphic.circle(health.x, health.y, 8,  '#FB2F3D', true);
            an.Graphic.circle(health.x, health.y, 25,  'rgba(0, 0, 0, 0.01)', true);

            if (ctx.isPointInPath(x, y)) {
                Dm.speed += 0.2;
                Dm.size += 0.15;
                delete Dm.healths[i];
            }

            //console.log(ctx.isPointInPath(x, y));


            /*
            var rect = an.rectangle(health.x-8, health.y-8, 16, 16);
            var point = an.point(x, y);

            if (health && an.hitTestPoint(rect, point)) {
                delete Dm.healths[i];
            }
            else if (health) {
                an.Graphic.circle(health.x, health.y, 15, '#FFDAC8', true);
                an.Graphic.circle(health.x, health.y, 8,  '#FB2F3D', true);
            }*/
        });


    };


    Dm.onClick = function (point) { };
    Dm.onFrame = function (ctx, frameCounter) {
        //var point = an.eventMousemove;
        //if (an.hitTestPoint([Dm.x-10, Dm.y-10, 20, 20], point) || An.Util.distanceBetween({x:Dm.x, y:Dm.y}, point) < 3) {
        //    Dm.dx = 0;
        //    Dm.dy = 0;
        //}
    };

    Dm.onMousemove = function(point){
        //var xDiff = point.x - Dm.x;
        //var yDiff = point.y - Dm.y;
        //var angle = Math.atan2(yDiff, xDiff);
        //Dm.dx = Dm.speed * Math.cos(angle);
        //Dm.dy = Dm.speed * Math.sin(angle);
    };


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

        an.Graphic.circle(Dm.x, Dm.y, 15*Dm.size, '#C4ACED', true);
        an.Graphic.circle(Dm.x, Dm.y, 8*(Dm.size/2), '#7C55C2', true);

        // health
        Dm.createHealths(ctx, Dm.x, Dm.y);

        an.Text.write(10, 10, 'Speed: ' + Dm.speed.toFixed(2), '#000', true);
        an.Text.write(10, 30, 'Life: ' + parseInt(Dm.size), '#000', true);

    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.onMousemove = Dm.onMousemove;

    an.render();

})(window, An);
