(function(window, An){

    console.clear();
    console.log("Loaded: Demo");


    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 0
    });

    an.scene(function(ctx){

        ctx.beginPath();
        an.Graphic.shape([6,55,69,6,41,76,127,7,14,183,75,64,11,116,42,40], '#7B5537', '#000', true, 5);

        an.Graphic.rect(10, 30, 90, 100, 'red', false);

        var imgData = ctx.getImageData(10, 30, 90, 100);
        ctx.putImageData(imgData, 200, 200);

    });

    an.render();

})(window, An);
