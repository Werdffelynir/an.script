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
    Dm.list = [];
    Dm.onClick = function(point){};
    Dm.onFrame = function(ctx, frameCounter){};





    an.stage('welcome', function(ctx){

        ctx.beginPath();
        ctx.fillStyle = '#dddddd';
        ctx.rect(240, 200, 400, 35);
        ctx.fill();
        ctx.closePath();

        if (ctx.isPointInPath(an.eventClick.x, an.eventClick.y)) {
            console.log('Render: game');
            an.renderStage('begin');
        }

        an.Text.font = 'bold 18px Arial';
        an.Text.write(250, 210, "Space 3", '#000');
    });

    an.stage('begin', function(ctx){

        ctx.beginPath();
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(0, 0, 400, 200);

    });

    an.stage('game', function(ctx){

        ctx.beginPath();
        ctx.fillStyle = '#f02f03';
        ctx.fillRect(0, 0, 400, 200);

    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;

    an.render('welcome');

})(window, An);
