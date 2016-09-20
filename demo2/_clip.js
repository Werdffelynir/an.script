(function(window, An){

    console.clear();
    console.log("Loaded: Demo");


    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 5
    });

    an.scene(function(ctx, frameCounter){
        ctx.beginPath();

        ctx.arc(100, 100, 50, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = '#7B5537';
        ctx.fillRect(0, 0, 100, 100);

        if (frameCounter > 5) an.renderStage('next1');

    });

    an.stage('next1', function (ctx, frameCounter) {
        ctx.beginPath();

        ctx.arc(100, 100, 50, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = '#7B5537';
        ctx.fillRect(100, 0, 100, 100);

        if (frameCounter > 10) an.renderStage('next2');

    });

    an.stage('next2', function (ctx, frameCounter) {
        ctx.beginPath();

        ctx.arc(100, 100, 50, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = '#7B5537';
        ctx.fillRect(100, 100, 100, 100);

        if (frameCounter > 15) an.renderStage('next3');
    });


    an.stage('next3', function (ctx, frameCounter) {
        ctx.beginPath();

        ctx.arc(100, 100, 50, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = '#7B5537';
        ctx.fillRect(0, 100, 100, 100);
    });

    an.render();

})(window, An);
