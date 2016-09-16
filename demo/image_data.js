(function(window, An){

    console.clear();
    console.log("Loaded: Loader of images");


    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 1,
        onClick: null,
        onFrame: null,
        loop: 'animation',
        fullScreen: false,
        autoStart: true,
        autoClear: false,
        enableEventClick: true,
        enableEventMouseMovie: true,
        enableEventKeys: false
    });

    var Dm = {};
    Dm.list = {};
    Dm.imageIsLoaded = false;
    Dm.mapData = null;

    Dm.onClick = function (point) {

        var i, clickIndex, imageData;

        //an.context.fillStyle = '#000';
        //an.context.fillRect(point.x, point.y, 1, 1);

        clickIndex = parseInt(point.x) == 0 ? 1 : parseInt(point.x);
        clickIndex += parseInt(point.y) == 0 ? 0 : parseInt(point.y) * an.width;

        if (!Dm.mapData) {
            imageData = an.context.getImageData(0, 0, an.width, an.width).data;
            Dm.mapData = [];
            for (i = 0; i < imageData.length; i += 4) {
                Dm.mapData.push(imageData.slice(i, i+4));
            }
        }

        console.log(clickIndex, Dm.mapData[clickIndex]);
    };

    Dm.onFrame = function(ctx, frameCounter){};

    Dm.isDraw = false;
    an.scene(function(ctx) {

        if (!Dm.isDraw && Dm.imageIsLoaded) {
            Dm.isDraw = true;

            ctx.drawImage(an.image('map'), 0, 0, an.width, an.height);

            //ctx.fillStyle = '#FFD087';
            //ctx.fillRect(0,0,5,5);
            //
            //ctx.fillStyle = '#87E1FF';
            //ctx.fillRect(0,5,5,5);
            //
            //ctx.fillStyle = '#B1FF87';
            //ctx.fillRect(5,0,5,5);
            //
            //ctx.fillStyle = '#C8FFF8';
            //ctx.fillRect(5,5,5,5);
        }





/*        if (Dm.imageIsLoaded) {
            var map = an.image('map');
            ctx.drawImage(an.image('map'), 0, 0, an.width, an.height);
            //if (!Dm.mapData)
            //    Dm.mapData  = ctx.getImageData(0, 0, an.width, an.height);
            //var i, j,
            //an.clear();
            //
            //ctx.createImageData(100, 100);
            //for (i = 0; i < 100; i ++) {
            //
            //}
        }
        else {
            an.Text.font = '36px Arial';
            an.Text.write(an.width/2-150, an.height/2-50, 'Images is loading...', '#000', true);
        }*/

    });


/* */
    an.imageLoader({

        map: '/an.script/demo/images/map.png',
        skeleton: '/an.script/demo/images/skeleton.png'

    }, function(){Dm.imageIsLoaded = true});

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
