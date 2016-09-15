(function(window, An){

    console.clear();
    console.log("Loaded: DEMO TPL");


    var an = new An({
        selector: "canvas#canvas",
        width: 800,
        height: 600,
        fps: 12,
        onClick: null,
        onFrame: null,
        loop: 'animation',
        fullScreen: false,
        autoStart: true,
        autoClear: true,
        enableEventClick: true,
        enableEventMouseMovie: false,
        enableEventKeys: false
    });



    /*
     * Game Stages: main menu game end
     */

    var Game = {
        level: 0,
        isStart: false,
        stages: {
            main:'',
            menu:'',
            game:'',
            end:''
        },
        clip: {}
    };

    Game.canvasClick = function (point) {
        // [350, 300, 100, 30]
        // Start game
        var rectBtn_Start = an.rectangle(350, 300, 100, 30);
        if (!Game.isStart && an.hitTest(rectBtn_Start)) Game.onStart();

    };





    Game.clip.a = function () {};
    Game.clip.bg = function (ctx, color) {
        an.graphic.rect(0, 0, an.width, an.height, color, true);
    };
    Game.clip.text = function (ctx, x, y, label, color) {
        ctx.textBaseline = "top";
        ctx.font = "20px Arial";
        ctx.fillStyle = color || '#000';
        ctx.fillText(label, x, y);
    };
    Game.clip.startMenu = function (ctx) {
        // 400,150,600,400,200,400
        ctx.lineWidth = 5;
        ctx.shadow(0, 0, 20, '#AAA95F');
        an.graphic.shape([400,150,600,400,200,400], '#D3D281', true);

        ctx.shadow(0, 0, 3, '#55542B');
        an.graphic.rect(350, 300, 100, 30, '#6F6F44', true);
        Game.clip.text(ctx, 367, 307, 'START');
    };


    Game.onStart = function() {

        console.log('Game.onStart');
        an.renderStage('game');
    };


    Game.startLevel = function(level) {

        console.log('Game.onStart');
        an.renderStage('game');
    };






















    an.onClick = Game.canvasClick;

    an.stage('main', function(ctx){
        Game.clip.bg(ctx, '#EDEDBF');
        Game.clip.startMenu(ctx);
    });

    an.stage('game', function(ctx){
        Game.isStart = true;
        Game.clip.bg(ctx, '#FFF8CD');




    });

    //an.addEventClick([350, 300, 100, 30], Game.onStart);
    //an.removeEventClick([350, 300, 100, 30]);

    an.render("main");

})(window, An);