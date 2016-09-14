(function(window, An){

    console.clear();
    console.log("Loaded: DEMO 1");

    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 0,
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



    an.scene(function(ctx){
        /**
         *
         * @type CanvasRenderingContext2D ctx
         */

        var
            point = [100,50,150,100,150,200,100,250,50,200,50,100,100,120,100,180,140,195],
            pointBg = [100,50,150,100,150,200,100,250,50,200,50,100],
            color = '#839345',
            colorBg = '#BCCE7B',
            fill = false,
            closePath = false;

        // bg
        an.graphic.shape(pointBg, colorBg, true, true);

        // border
        ctx.lineWidth = 3;
        an.graphic.shape(point, color, fill, closePath);
    });

    an.scene(function(ctx){
        var
            point = [250,50,300,100,350,50,315,200,350,160,350,250,315,210,350,350,300,315,250,350,285,210,250,250,250,160,285,200],
            color = '#1A1A52',
            fill = false,
            closePath = true;

        ctx.lineWidth = 15;
        an.graphic.shape(point, color, fill, closePath);
        ctx.fillStyle = '#E9D0E6';
        ctx.fill();
    });

    an.render();

})(window, An);