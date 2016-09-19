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
    Dm.clip = {};
    Dm.clip.circle = function(ctx, radius){
        ctx.beginPath();
        ctx.strokeStyle = '#1A1A52';
        ctx.arc(an.width/2, an.height/2, radius, 0, Dm.radian);
        ctx.stroke();
    };
    Dm.radian = 0;
    Dm.imagedata = null;


    Dm.onClick = function(point){};
    Dm.onFrame = function(ctx, frameCounter){};


    an.scene(function(ctx){

        if (Dm.imagedata) {
            ctx.drawImage(Dm.imagedata, 0, 0);
        } else
        if (Dm.radian > Math.PI * 2) {
            Dm.imagedata = ctx.getImageData(0, 0, an.width, an.height);
            Dm.radian = 0;
        } else {
            Dm.radian += 0.15;

            Dm.clip.circle(ctx, 200);
            Dm.clip.circle(ctx, 190);
            Dm.clip.circle(ctx, 180);
            Dm.clip.circle(ctx, 170);
            Dm.clip.circle(ctx, 160);
            Dm.clip.circle(ctx, 150);
            Dm.clip.circle(ctx, 140);
            Dm.clip.circle(ctx, 130);
            Dm.clip.circle(ctx, 120);
            Dm.clip.circle(ctx, 110);
            Dm.clip.circle(ctx, 100);
            Dm.clip.circle(ctx, 90);
            Dm.clip.circle(ctx, 80);
            Dm.clip.circle(ctx, 70);
            Dm.clip.circle(ctx, 60);
            Dm.clip.circle(ctx, 50);
            Dm.clip.circle(ctx, 40);
            Dm.clip.circle(ctx, 30);
            Dm.clip.circle(ctx, 20);
            Dm.clip.circle(ctx, 10);
        }






    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
