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

    // Properties
    clip.x = 50;
    clip.y = 50;
    clip.dx = 0;
    clip.dy = 2;
    clip.dyDefault = -4.8;
    clip.acceleration = 0.145;
    clip.isJump = false;
    clip.isLeft = false;
    clip.isRight = false;
    clip.grounds = [];

    clip.addGrounds = function(x, y, width, height, color){
        clip.grounds.push([x, y, width, height, color]);
    };
    clip.drawGrounds = function(ctx){
        clip.grounds.map(function(g){
            ctx.fillStyle = g[4] || '#793737';
            ctx.fillRect.apply(ctx, g);
        });
    };
    clip.hitTest = function(ground) {
        var i, x, y, width, height,
            xClip = clip.x,
            yClip = clip.y;

        for (i = 0; i < clip.grounds.length; i ++) {
            x = clip.grounds[i][0];
            y = clip.grounds[i][1];
            width = clip.grounds[i][2];
            height = clip.grounds[i][3];
            if (xClip+20 >= x && xClip <= x + width &&
                yClip+20 >= y && yClip <= y /*+ height*/) {
                return y - 20;
            }
        }
        return ground;
    };


    // Functionality
    an.addEventKeydown(38, function(){clip.isJump = true});
    an.addEventKeyup(38, function(){clip.isJump = false});

    an.addEventKeydown(37, function(){clip.isLeft = true});
    an.addEventKeyup(37, function(){clip.isLeft = false});

    an.addEventKeydown(39, function(){clip.isRight = true});
    an.addEventKeyup(39, function(){clip.isRight = false});


    clip.addGrounds(120, 200, 150, 20);
    clip.addGrounds(500, 300, 100, 20);

    clip.addGrounds(0, 380, 300, 20, '#414248');
    clip.addGrounds(300, 360, 300, 40, '#414248');

    clip.addGrounds(380, 250, 80, 20);
    clip.addGrounds(20, 150, 80, 20);

    an.scene(function(ctx){
        clip.dy += clip.acceleration;

        clip.drawGrounds(ctx);

        var ground = an.height - 20;

        // hit test with grounds
        ground = clip.hitTest(ground);


        if (clip.isJump && clip.dy >= 0 && clip.y >= ground) {
            clip.dy = clip.dyDefault;
        }

        if (clip.y > ground - 5 && clip.dy >= 0) {
            clip.y = ground;
            clip.dy = 0;
        }

        if (clip.isLeft)
            clip.dx = -2;
        else
        if (clip.isRight)
            clip.dx = 2;
        else
            clip.dx = 0;


        // speed limit
        if (clip.dx > 5) clip.dx = 5;

        clip.x += clip.dx;
        clip.y += clip.dy;

        ctx.fillStyle = '#1A1A52';
        ctx.fillRect(clip.x, clip.y, 20, 20);
    });

    an.render();

})(window, An);