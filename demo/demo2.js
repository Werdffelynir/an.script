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

/*
    an.scene({
        hide: false,
        index: 1,
        x: 0,
        runner: function(ctx){
            //ctx.fillStyle = '#1A1A52';
            //ctx.fillRect(this.x, 50, 20, 20);
            //if(this.x > an.width) this.x = 0;
            //else this.x += 2.8;


            //for (i = 0; i < an.width/5; i ++) {
                //for (j = 0; j < an.height/5; j ++) {//}
            //    an.graphic.linePoints({x:0,y:i*5}, {x:an.width,y:i}, 1, 'blue');
            //}
        }
    });
*/

    var points1 = [93,194,115,214,148,196,158,469,134,471,114,526,686,524,660,444,611,439,605,193,659,227,681,205,404,46];
    var points2 = [311,226,425,216,419,356,308,344];

    an.scene(function(ctx) {
        //var points = [50,405,50,405,50,405,50,405,50,405,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,50,400,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,165,145,165,145,165,145,165,145,165,145,85,60,85,60,85,60,85,45,85,45,85,45,535,90,535,90,535,90,575,170,575,170,575,170,500,295,500,295,500,295,170,580,170,580,170,580,685,195,685,195,685,195,305,160,305,160,305,160,640,545,640,545,640,545,395,395,395,395,395,395,215,290,215,290,215,290,120,205,120,205,120,205,90,205,90,205,90,205];


        an.backgroundColor('#532323');
        an.graphic.shape(points1, '#951E00', '#212121', true, 15);
        an.graphic.shape(points2, '#730200', '#212121', true, 5);
    });












    /*
    an.scene(function(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.moveTo(296, 221);
        ctx.bezierCurveTo(87, 321, 519, 322, 316, 222);
        ctx.stroke();

        //for (j = 0; j < an.height/5; j ++) {//}
        //for (i = 0; i < an.width/5; i ++) {
        //    an.graphic.linePoints({x:0,y:i*5}, {x:an.width,y:i*3}, 1, 'rgba(0,0,0,.4)');
        //}

        //var p1 = {x: 100, y: 100, z: 0};
        //var p2 = {x: 200, y: 200, z: 0};
        //
        //ctx.moveTo(p1.x, p1.y);
        //ctx.lineTo(p2.x, p2.y);
        //ctx.stroke();
    });
     */


    an.render();

})(window, An);