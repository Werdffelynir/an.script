(function(window, An){

    console.clear();
    console.log("Loaded: DEMO TPL");

    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
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


    an.scene(function(ctx){
        ctx.fillStyle = '#1A1A52';
        ctx.fillRect(50, 150, 20, 20);
    });

    an.scene(function(ctx){
        ctx.fillStyle = '#1A1A52';
        ctx.fillRect(50, 200, 20, 20);
    });

    an.render();

})(window, An);