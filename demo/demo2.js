(function(window, An){

    console.clear();
    console.log("Loaded: DEMO 2");

    var clip = {};

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

    clip.bg = function(ctx){
        ctx.beginPath();
        ctx.rect(0, 0, an.width, an.height);
        ctx.fillStyle = '#F4BCBC';
        ctx.fill();
        ctx.closePath();
    };


    an.scene({
        hide: false,
        index: 1,
        runner: function(ctx){
            clip.bg(ctx);
        }
    });

    an.scene({
        hide: false,
        index: 1,
        x: 0,
        runner: function(ctx){
            ctx.fillStyle = '#1A1A52';
            ctx.fillRect(this.x, 50, 20, 20);
            if(this.x > an.width) this.x = 0;
            else this.x += 2.8;
        }
    });

    an.render();

})(window, An);