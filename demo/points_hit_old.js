(function(window, An){

    console.clear();
    console.log("Loaded: Hit Point");

    var an = new An({

        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 30,

        onClick: null,
        onFrame: null,
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
        enableEventMouseMovie: true,
        enableEventKeys: false
    });

    var Dm = {};
    Dm.list = [];

    Dm.onClick = function(point, ctx){};

    Dm.onMousemove = function(point, ctx){

        var isPointInPath = ctx.isPointInPath(point.x, point.y);
        var isPointInStroke = ctx.isPointInStroke(point.x, point.y);

        if (isPointInPath) {
            Dm.colorFill = 'rgba(205,220,57,.9)';
            Dm.colorStroke = 'rgba(62,56,109,.9)';
        } else {
            Dm.colorFill = Dm.colorFillDefault;
            Dm.colorStroke = Dm.colorStrokeDefault;
        }
    };

    Dm.colorFillDefault = 'rgba(205,220,57,.4)';
    Dm.colorStrokeDefault = 'rgba(62,56,109,.4)';

    Dm.colorFill = Dm.colorFillDefault;
    Dm.colorStroke = Dm.colorStrokeDefault;

    Dm.onFrame = function(ctx, frameCounter) {
/*
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = Dm.colorStroke;
        ctx.fillStyle = Dm.colorFill;
        ctx.rect(100, 100, 300, 50);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
*/

        var points = [239,319,298,363,357,323,346,234,454,197,390,40,299,201,213,41,143,192,242,236];
        an.graphic.shape(points, Dm.colorFill, Dm.colorStroke, false, 5);


    };

    //an.scene(function(ctx){
    //    ctx.fillStyle = '#1A1A52';
    //    ctx.fillRect(50, 200, 20, 20);
    //});

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.onMousemove = Dm.onMousemove;
    an.render();

})(window, An);
