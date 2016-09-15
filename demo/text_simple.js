(function(window, An){

    console.clear();
    console.log("Loaded: DEMO TPL");

    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 12,
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


    an.scene(function(ctx){

        an.Text.lineWidth = 2;
        an.Text.font = '40px Arial';
        an.Text.write(0, 0, "HTMLCanvasElement", '#000', false);
        an.Text.write(0, 0, "HTMLCanvasElement", '#000', true);

        an.Text.lineWidth = 1;
        an.Text.font = '50px Arial';
        an.Text.write(0, 100, "HTMLCanvasElement", '#f00', '#000');


        ctx.textAlign = 'right';
        an.Text.font = '18px Arial';
        an.Text.write(an.width, 150, "document.getElementById", '#5FABCE', true);

        ctx.textAlign = 'center';
        an.Text.font = '22px Arial';
        an.Text.write(an.width/2, 200, "createLinearGradient", '#CEAC5F', true);


    });

    an.render();

})(window, An);