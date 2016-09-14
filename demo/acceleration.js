(function(window, An){

    console.clear();
    console.log("Loaded: DEMO Box Jump");

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
        enableEventClick: false,
        enableEventMouseMovie: false,
        enableEventKeys: true
    });

    var clip = {};

    clip.x = 50;
    clip.y = 50;
    clip.dx = 0;
    clip.dy = 1;
    clip.acceleration = 0.15;

    an.scene(function(ctx){
        ctx.fillStyle = '#1A1A52';
        ctx.fillRect(clip.x, clip.y, 20, 20);

        clip.x += clip.dx;
        clip.y += clip.dy;

        clip.dy += clip.acceleration;
    });



    an.render();

})(window, An);