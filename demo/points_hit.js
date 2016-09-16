(function(window, An){

    console.clear();
    console.log("Loaded: Hit Point");

    var an = new An({

        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 12,

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
    Dm.colorFill = '#ddd';
    Dm.colorStroke = '#000';

    Dm.onClick = function(point, ctx){};
    Dm.onMousemove = function(point, ctx){};
    Dm.onFrame = function(ctx, frameCounter) {

        //console.log(frameCounter, an.mouse);
        //an.Text.write(an.mouse.x, an.mouse.y, 'frame:'+frameCounter, '#000', true);

        var points = [239,319,298,363,357,323,346,234,454,197,390,40,299,201,213,41,143,192,242,236];
        an.graphic.shape(points, Dm.colorFill, Dm.colorStroke, false, 5);

        if (ctx.isPointInPath(an.mouse.x, an.mouse.y)){
            Dm.colorFill = '#f00';
            Dm.colorStroke = '#333';
        } else if (Dm.colorFill != '#ddd') {
            Dm.colorFill = '#ddd';
            Dm.colorStroke = '#000';
        }
    };


    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.onMousemove = Dm.onMousemove;
    an.render();

})(window, An);
