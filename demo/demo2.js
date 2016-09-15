(function(window, An){

    console.clear();
    console.log("Loaded: DEMO 2");

    var clip = {};

    var an = new An({
        selector: "canvas#canvas",
        width: 800,
        height: 600,
        fps: 30,
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
    clip.bg = function(ctx){
        ctx.beginPath();
        ctx.rect(0, 0, an.width, an.height);
        ctx.fillStyle = '#F4BCBC';
        ctx.fill();
        ctx.closePath();
    };
    an.scene({
        hide: false,
        index: 1,
        runner: function(ctx){
            clip.bg(ctx);
        }
    });*/


    an.scene({
        hide: false,
        index: 1,
        x: 0,
        runner: function(ctx){
            ctx.fillStyle = '#1A1A52';
            ctx.fillRect(this.x, 50, 20, 20);
            if(this.x > an.width) this.x = 0;
            else this.x += 2.8;
        }
    });

    an.scene(function(ctx) {
        //var points = [50,405,50,405,50,405,50,405,50,405,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,165,145,165,145,165,145,165,145,165,145,85,60,85,60,85,60,85,45,85,45,85,45,535,90,535,90,535,90,575,170,575,170,575,170,500,295,500,295,500,295,170,580,170,580,170,580,685,195,685,195,685,195,305,160,305,160,305,160,640,545,640,545,640,545,395,395,395,395,395,395,215,290,215,290,215,290,120,205,120,205,120,205,90,205,90,205,90,205];
        //an.Graphic.shape(points, '#000');
    });

    an.scene(function(ctx) {
        //ctx.bezierCurveTo();
    });

    an.render();

})(window, An);