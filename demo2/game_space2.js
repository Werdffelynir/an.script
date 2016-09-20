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
        enableEventKeys: false
    });

    var Dm = {};
    Dm.clip = {};

    Dm.clip.bg = function(ctx){
        an.Graphic.shape(Dm.clip.bg.points, '#732200', '#2F0E00', true, 5);
    };
    Dm.clip.bg.points = [609,391,614,404,-3,408,-2,342,9,354,16,396,49,392,89,389,133,394,128,384,144,375,168,380,166,392,194,392,239,389,265,379,285,388,327,384,365,389,426,388,444,388,443,378,456,366,493,372,499,388,552,384,579,386];

    Dm.clip.shuttle = function(ctx){
        ctx.save();

        ctx.translate(Dm.clip.shuttle.x, Dm.clip.shuttle.y);
        ctx.lineJoin = 'round';
        ctx.shadow(0, 0, 100, '#ff0');
        an.Graphic.shape([-29,20,-39,0,0,-20,40,0,30,20], '#C70000', '#3C3737', true, 5);

        ctx.restore();
    };
    Dm.clip.shuttle.isMove = false;
    Dm.clip.shuttle.x = 200;
    Dm.clip.shuttle.y = 200;
    Dm.clip.shuttle.dx = 0;
    Dm.clip.shuttle.dy = 0;

    Dm.onClick = function(point){

        if (point.x < 200) {
            Dm.clip.shuttle.dx = -3;
        }
        else if (point.x > 400) {
            Dm.clip.shuttle.dx = 3;
        }
        else if (point.x > 200 && point.x < 400) {
            Dm.clip.shuttle.dx = 0;
        }

        if (!Dm.clip.shuttle.isMove) {
            Dm.clip.shuttle.isMove = true;
            Dm.clip.shuttle.dy = -4;
        }

    };


    Dm.onFrame = function (ctx, frameCounter) {

        Dm.clip.bg(ctx);

        if (Dm.clip.shuttle.dy < 0)
            Dm.clip.shuttle.isMove = false;

        Dm.clip.shuttle.x += Dm.clip.shuttle.dx *= 0.968;
        Dm.clip.shuttle.y += Dm.clip.shuttle.dy *= 0.988;

        // Gravitation
        Dm.clip.shuttle.dy += 0.085;

        if (Dm.clip.shuttle.y > an.height - 30)
            Dm.clip.shuttle.y = an.height - 30;

        Dm.clip.shuttle(ctx);
    };


   // an.scene(function(ctx){});
    an.backgroundColor('#1E2039');
    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
