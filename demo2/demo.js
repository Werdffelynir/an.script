(function(window, An){

    console.clear();
    console.log("Loaded: Demo transform");


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

        enableEventClick: false,
        enableEventMousemove: false,
        enableEventKeys: true
    });

    var Dm = {};

    Dm.heroPoint = {x: an.width/2, y: an.height - 30};
    Dm.heroPointDynamic = {x: 0, y: 0};
    Dm.heroSpeed = 3;
    Dm.heroLeft = false;
    Dm.heroRight = false;
    Dm.heroUp = false;
    Dm.heroDown = false;
    Dm.satus = 'play';

    Dm.tracksList = [
        {speed: An.Util.rand(2, 8), rect: an.rectangle(An.Util.rand(-100, an.width), 50,  100, 50)},
        {speed: An.Util.rand(2, 8), rect: an.rectangle(An.Util.rand(-100, an.width), 100, 100, 50)},
        {speed: An.Util.rand(2, 8), rect: an.rectangle(An.Util.rand(-100, an.width), 150, 100, 50)},
        {speed: An.Util.rand(2, 8), rect: an.rectangle(An.Util.rand(-100, an.width), 200, 100, 50)},
        {speed: An.Util.rand(2, 8), rect: an.rectangle(An.Util.rand(-100, an.width), 250, 100, 50)},
        {speed: An.Util.rand(2, 8), rect: an.rectangle(An.Util.rand(-100, an.width), 300, 100, 50)}
    ];

    Dm.setTracks = function (ctx) {
        var i;

        for (i = 0; i < Dm.tracksList.length; i ++) {

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            ctx.fillStyle = '#D04A2E';
            ctx.rect.apply(ctx, Dm.tracksList[i]['rect']);
            ctx.fill();
            ctx.stroke();

            if (ctx.isPointInPath(Dm.heroPoint.x, Dm.heroPoint.y)) {

                Dm.satus = 'end';
            }

            ctx.closePath();

            if (Dm.tracksList[i]['rect'][0] > an.width) {
                Dm.tracksList[i]['rect'][0] = An.Util.rand(-200, -50);
                Dm.tracksList[i]['speed'] = An.Util.rand(2, 8);
            } else
                Dm.tracksList[i]['rect'][0] += Dm.tracksList[i]['speed'];

        }
    };


    Dm.setHero = function (ctx) {
        ctx.beginPath();
        an.Graphic.circle(Dm.heroPoint.x, Dm.heroPoint.y, 25, '#56D130', true);
    };

    //Dm.onMousemove = function(point) {};
    //Dm.onClick = function (point) {};

    Dm.onFrame = function (ctx, frameCounter) {

        if (Dm.satus == 'play') {

            Dm.setTracks(ctx);
            Dm.setHero(ctx);

            if (Dm.heroLeft)    Dm.heroPoint.x -= Dm.heroSpeed;
            if (Dm.heroRight)   Dm.heroPoint.x += Dm.heroSpeed;
            if (Dm.heroUp)      Dm.heroPoint.y -= Dm.heroSpeed;
            if (Dm.heroDown)    Dm.heroPoint.y += Dm.heroSpeed;
        }
        else {

            an.Text.write(200, 200, 'Game Over', '#000', true);
        }

    };

    an.Event.addKeydown(37, function(e){Dm.heroLeft = true});
    an.Event.addKeyup(37, function(){Dm.heroLeft = false});

    an.Event.addKeydown(39, function(){Dm.heroRight = true});
    an.Event.addKeyup(39, function(){Dm.heroRight = false});

    an.Event.addKeydown(38, function(){Dm.heroUp = true});
    an.Event.addKeyup(38, function(){Dm.heroUp = false});

    an.Event.addKeydown(40, function(){Dm.heroDown = true});
    an.Event.addKeyup(40, function(){Dm.heroDown = false});

    //an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    //an.onMousemove = Dm.onMousemove;

    an.render();

})(window, An);
