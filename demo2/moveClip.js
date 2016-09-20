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
    var Clip = {};

    Dm.list = [];
    Dm.onClick = function(point){};
    Dm.onFrame = function(ctx, frameCounter){};


    Clip.box = an.moveClip({
        x: 100,
        y: 200,
        width: 100,
        height: 50,
        speed: 2
    }, function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#7B5537';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.x += this.speed;
        if (this.x > an.width) this.x = -this.width;
    });



    Clip.ball = an.moveClip({
        x: 100,
        y: 300,
        radius: 50,
        speed: 3
    }, function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#726D7B';
        an.Graphic.circle(this.x, this.y, this.radius);

        this.x += this.speed;
        if (this.x > an.width + this.radius/2) this.x = -this.radius/2;
    });


    an.scene(function(ctx){

        Clip.box(ctx);

        Clip.ball(ctx);

    });


    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
