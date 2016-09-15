(function(window, An){

    console.clear();
    console.log("Loaded: Shape Generator");


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
        enableEventMouseMovie: true,
        enableEventKeys: false
    });

    var Pin = {};
    Pin.mode = 'pointer';
    Pin.isMoved = false;
    Pin.moveIndex = null;
    Pin.list = [];

    Pin.onClick = function(point){

        if (Pin.mode == 'pointer') {
            Pin.setPoint(point);
        }

        if (Pin.mode == 'move') {
            var i, rect, p;
            Pin.moveIndex = null;
            for (i = 0; i < Pin.list.length; i ++) {
                p = Pin.list[i];
                rect = [p.x-7.5, p.y-7.5, 15, 15];
                if (an.hitTestPoint(rect, point)) {
                    Pin.moveIndex = i;
                    Pin.isMoved = !Pin.isMoved;
                    break;
                }
            }
        }
    };

    Pin.onFrame = function (ctx, frameCounter) {

        if (Pin.mode == 'move' && Pin.isMoved && Pin.list[Pin.moveIndex]) {
            Pin.list[Pin.moveIndex].x = an.mouse.x;
            Pin.list[Pin.moveIndex].y = an.mouse.y;
        }


    };

    Pin.setPoint = function(point){
        Pin.list.push(point);
    };

    Pin.colorPointsLineDefault = '#C9A9FF';
    Pin.colorPointsLine = Pin.colorPointsLineDefault;
    Pin.colorPointCircleInnerDefault = '#2D1F45';
    Pin.colorPointCircleInner = Pin.colorPointCircleInnerDefault;
    Pin.colorPointCircleOuterDefault = '#C9A9FF';
    Pin.colorPointCircleOuter = Pin.colorPointCircleOuterDefault;

    Pin.renderPoints = function(ctx, fc){
        var mapPoints = [];
        Pin.list.map(function(point){
            mapPoints.push(point.x, point.y);
            an.graphic.circle(point.x, point.y, 15, Pin.colorPointCircleOuter, true);
            an.graphic.circle(point.x, point.y, 5, Pin.colorPointCircleInner, true);
        });
        an.graphic.shape(mapPoints, Pin.colorPointsLine, false, false, 1);
    };
    Pin.Control = false;

    document.addEventListener('keydown', function (event) {
        console.log(event);

        if (event.key == "Control") {
            console.log('Control',Pin.Control);
            if (Pin.Control) {
                Pin.mode = 'move';

                Pin.colorPointsLine = '#731100';
                Pin.colorPointCircleOuter = '#FF1E00';
                Pin.colorPointCircleInner = '#731100';
            }
            else {
                Pin.mode = 'pointer';
                Pin.colorPointsLine = Pin.colorPointsLineDefault;
                Pin.colorPointCircleOuter = Pin.colorPointCircleOuterDefault;
                Pin.colorPointCircleInner = Pin.colorPointCircleInnerDefault;
            }

            Pin.Control = !Pin.Control;
        }

        if (event.key == "t" || event.keyCode == 84) {
            console.log('Clean!');
            Pin.list = [];
        }

    });

    an.scene(function(ctx, fc) {

        Pin.renderPoints(ctx, fc);

        an.Text.font = '13px sans, Arial';
        an.Text.write(10, 10, 'Edit: Ctrl', '#000', true);
        an.Text.write(10, 25, 'Clear: T', '#000', true);
    });

    an.onClick = Pin.onClick;
    an.onFrame = Pin.onFrame;
    an.render();

})(window, An);