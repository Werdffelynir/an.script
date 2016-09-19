(function(window, An){

    console.clear();
    console.log("Loaded: DEMO Shapes");

    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 30,
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
            point = [200,50,250,100,250,200,200,250,150,200,150,100,200,120,200,180,240,195],
            pointBg = [200,50,250,100,250,200,200,250,150,200,150,100],
            color = '#839345',
            colorBg = '#BCCE7B',
            fill = false,
            closePath = false;

        // bg
        an.Graphic.shape(pointBg, colorBg, true, true);

        // border
        ctx.lineWidth = 3;
        an.Graphic.shape(point, color, fill, closePath);
    });

    an.scene(function(ctx){
        var
            point = [400,50,450,100,500,50,465,200,500,160,500,250,465,210,500,350,450,315,400,350,435,210,400,250,400,160,435,200],
            color = '#1A1A52',
            fill = false,
            closePath = true;

        ctx.lineWidth = 15;
        an.Graphic.shape(point, color, fill, closePath);
        ctx.fillStyle = '#E9D0E6';
        ctx.fill();
    });

    an.render();

})(window, An);