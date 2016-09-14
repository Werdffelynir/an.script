(function(window, An){

    console.clear();
    console.log("Loaded: DEMO TPL");

    var an = new An({
        selector: "canvas#canvas",
        width: 800,
        height: 600,
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

    /*
     * Game Stages: main menu game end
     */

    var game = {
        level: 0,
        stages: {
            main:'',
            menu:'',
            game:'',
            end:''
        },
        graphic: {}
    };

    an.stage('main', function(ctx){
        ctx.fillRect()
    });


    an.render("main");

})(window, An);