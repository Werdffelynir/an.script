(function(window, An){

    console.clear();
    console.log("Loaded: Demo");


    var an = new An({
        selector: "canvas#canvas",
        width: 800,
        height: 600,
        fps: 30,
        onClick: null,
        onFrame: null,
        loop: 'animation',
        fullScreen: false,
        autoStart: true,
        autoClear: true,
        enableEventClick: true,
        enableEventMouseMovie: true,
        enableEventKeys: false
    });

    var Dm = {};
    Dm.list = [];

    Dm.onClick = function(point){



    };

    Dm.onFrame = function(ctx, frameCounter){



    };


    an.scene(function(ctx){

        ctx.fillStyle = '#1A1A52';
        ctx.fillRect(50, 200, 20, 20);

    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
