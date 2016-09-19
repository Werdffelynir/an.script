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

        enableEventClick: true,
        enableEventMousemove: false,
        enableEventKeys: true
    });

    var Dm = {};
    Dm.clip = {};
    Dm.carPoint = An.point(300, 200);
    Dm.carDynamicPoint = An.point(0, 0);
    Dm.speed = 3;
    Dm.angle = 0;
    Dm.moveLeft = false;
    Dm.moveRight = false;
    Dm.moveUp = false;
    Dm.moveDown = false;

    Dm.car = function(ctx){
        ctx.beginPath();
        ctx.save();

        ctx.translate(Dm.carPoint.x,  Dm.carPoint.y);
        ctx.rotate(An.Util.degreesToRadians(Dm.angle));

        ctx.fillStyle = '#147B3F';
        ctx.fillRect(-30, -15, 60, 30);

        ctx.restore();
        ctx.closePath();
    };

    an.scene( function(ctx) {

        var a =  2 * Math.PI * (Dm.angle / 360);
        var dx = Dm.speed * Math.cos(a);
        var dy = Dm.speed * Math.sin(a);

        if (Dm.moveUp) {
            Dm.carPoint.x += dx;
            Dm.carPoint.y += dy;
        }
        else if (Dm.moveDown) {
            Dm.carPoint.x -= dx;
            Dm.carPoint.y -= dy;
        }

        if (Dm.moveLeft) {
            if (Dm.moveDown) Dm.angle += 1;
            else
                Dm.angle -= 1;
        }
        else if (Dm.moveRight) {
            if (Dm.moveDown) Dm.angle -= 1;
            else
                Dm.angle += 1;
        }

        if (Dm.angle > 360) Dm.angle = 0;
        if (Dm.angle < 0) Dm.angle = 360;

        Dm.car(ctx);

    });

    an.Event.addKeydown(37, function(){Dm.moveLeft = true});
    an.Event.addKeyup(37, function(){Dm.moveLeft = false});

    an.Event.addKeydown(39, function(){Dm.moveRight = true});
    an.Event.addKeyup(39, function(){Dm.moveRight = false});

    an.Event.addKeydown(38, function(){Dm.moveUp = true});
    an.Event.addKeyup(38, function(){Dm.moveUp = false});

    an.Event.addKeydown(40, function(){Dm.moveDown = true});
    an.Event.addKeyup(40, function(){Dm.moveDown = false});

    an.onClick = Dm.onClick;
    an.render();

})(window, An);
