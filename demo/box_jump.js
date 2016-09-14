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
    clip.dy = 1;
    clip.acceleration = 0.15;

    an.scene(function(ctx){

        if (clip.y > an.height - 20 && clip.dy > 0) {
            clip.dy *= -1;
        }

        ctx.fillRect(clip.x, clip.y, 20, 20);
        ctx.fillStyle = '#1A1A52';

        clip.x += clip.dx;
        clip.y += clip.dy;
        clip.dy += clip.acceleration;
    });


    /*var clip = {};

    clip.speed = 5;
    clip.x = 100;
    clip.y = 0;
    clip.move = null;
    clip.dx = -2.5;
    clip.dy = 3;

    an.addEventKeydown(38, function(){
        clip.move = 'up';
    });
    an.addEventKeydown(37, function(){
        clip.move = 'left';
    });
    an.addEventKeydown(39, function(){
        clip.move = 'right';
    });

    an.scene(function(ctx){
        ctx.fillStyle = '#1A1A52';
        ctx.fillRect(clip.x, clip.y, 20, 20);

        //clip.y += clip.dy;
        if (clip.y > an.height-20 || clip.y < 0) clip.dy *= -1;

        if (clip.y >= an.height-20) {
            clip.y = an.height-20;
            if (clip.move == 'up') {
                clip.dy = -3;
                clip.y += clip.dy;
            }
        }else
            clip.y += clip.dy;

        if (clip.move == 'left') clip.dx = -2;
        else if (clip.move == 'right') clip.dx = 2;
        else clip.dx = 0;

        clip.x += clip.dx;

        //if (clip.move == 'left' && clip.dx > 0) clip.dx *= -1;
        //if (clip.move == 'right' && clip.dx < 0) clip.dx *= -1;
        //clip.x += clip.dx;
        //if ((clip.x > an.width-20 && clip.dx > 0) || (clip.x < 0 && clip.dx < 0)) clip.dx *= -1;

        clip.dy += 0.05;
        clip.move = null;
    }); */



    an.render();

})(window, An);