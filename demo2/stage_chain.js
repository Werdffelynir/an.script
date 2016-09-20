(function(window, An){

    console.clear();
    console.log("Loaded: Demo");


    var an = new An({

        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 30,

        onClick: null,
        onFrame: null,
        onFrameBefore: null,
        onFrameAfter: null,
        onMousemove: null,
        onKeydown: null,
        onKeyup: null,

        loop: An.LOOP_ANIMATE,
        fullScreen: false,

        autoStart: true,
        autoClear: true,
        saveRestore: false,

        sorting: true,
        filtering: true,

        enableEventClick: true,
        enableEventMousemove: false,
        enableEventKeys: false
    });

    var Dm = {};

    Dm.frameCounter = 0;
    Dm.onClick = function(point){};
    Dm.onFrame = function(ctx, frameCounter){
        Dm.frameCounter ++;

        an.Text.font = 'normal 11px Verdana, Arial, sans';
        an.Text.write(200,205,'Цепочка очереди объектов stage');
        an.Text.write(200,220,"Переход осуществляется на указаный");
        an.Text.write(200,235,"stage если метод runner вернет true");

    };

    an.stage('one', function (ctx, frameCounter) {

        if (an.canvas.style.backgroundColor != '#7B5537')
            an.canvas.style.backgroundColor = '#7B5537';

        an.Text.color = '#000';
        an.Text.font = 'bold 20px Verdana, Arial, sans';
        an.Text.write(200,180,'Stage - one');

        if (Dm.frameCounter > 60) {
            console.log('one-two', 'go to next stage!');

            return 'two'; // Первый способ перейти на следующий stage 'two'
        }
    });

    an.stage('two', function (ctx, frameCounter) {

        if (an.canvas.style.backgroundColor != '#765E7B')
            an.canvas.style.backgroundColor = '#765E7B';

        an.Text.color = '#000';
        an.Text.font = 'bold 20px Verdana, Arial, sans';
        an.Text.write(200,180,'Stage - two');

        if (Dm.frameCounter > 120) {
            console.log('two-three', 'go to next stage!');

            return true; // второй способ перейти на следующий
        }
    }, 'three'); // второй способ перейти на следующий stage по имени 'three'

    an.stage('three', function (ctx, frameCounter) {

        if (an.canvas.style.backgroundColor != '#147B3F')
            an.canvas.style.backgroundColor = '#147B3F';

        an.Text.color = '#000';
        an.Text.font = 'bold 20px Verdana, Arial, sans';
        an.Text.write(200,180,'Stage - three');

        if (Dm.frameCounter > 180) {
            console.log('three-one', 'go to next stage!');
            Dm.frameCounter = 0;
            return true;
        }
    }, 'one');

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render('one');

})(window, An);
