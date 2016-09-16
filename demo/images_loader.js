(function(window, An){

    console.clear();
    console.log("Loaded: Loader of images");


    var an = new An({
        selector: "canvas#canvas",
        width: 800,
        height: 600,
        fps: 1,
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
    Dm.list = {};
    Dm.imageIsLoaded = false;
    Dm.onClick = function(point){};
    Dm.onFrame = function(ctx, frameCounter){};

    an.scene(function(ctx){



        if (Dm.imageIsLoaded) {
            var map = an.image('map');
            var skeleton = an.image('skeleton');

            ctx.drawImage(map, 0, 0, an.width, an.height);

            ctx.drawImage(skeleton, 10, 10, 35, 35);
            ctx.drawImage(skeleton, 50, 10, 35, 35);
            ctx.drawImage(skeleton, 90, 10, 35, 35);
            ctx.drawImage(skeleton, 130, 10, 35, 35);
            ctx.drawImage(skeleton, 170, 10, 35, 35);

            console.log();
        }
        else {
            an.Text.font = '36px Arial';
            an.Text.write(an.width/2-150, an.height/2-50, 'Images is loading...', '#000', true);
        }

    });


    an.imageLoader({

        map: '/an.script/demo/images/map.png',
        skeleton: '/an.script/demo/images/skeleton.png'

    }, function(){Dm.imageIsLoaded = true});

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
