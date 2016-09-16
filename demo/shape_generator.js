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
    Pin.isGrid = false;

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

            //an.graphic.circle(an.mouse.x, an.mouse.y, 17, 'rgba(225,0,0,.9)', true);
            an.graphic.linePoints(
                {x: an.mouse.x-17, y: an.mouse.y},
                {x: an.mouse.x+17, y: an.mouse.y},
                3
            );
            an.graphic.linePoints(
                {x: an.mouse.x, y: an.mouse.y-17},
                {x: an.mouse.x, y: an.mouse.y+17},
                3
            );
        }



    };

    Pin.setPoint = function(point){
        Pin.list.push(point);
    };

    Pin.colorPointsLineDefault = 'rgba(725, 85, 195, 0.6)'; // #C9A9FF
    Pin.colorPointsLine = Pin.colorPointsLineDefault;
    Pin.colorPointCircleInnerDefault = '#7C55C2';
    Pin.colorPointCircleInner = Pin.colorPointCircleInnerDefault;
    Pin.colorPointCircleOuterDefault = 'rgba(725, 85, 195, 0.4)';
    Pin.colorPointCircleOuter = Pin.colorPointCircleOuterDefault;
    Pin.mapPoints = [];

    Pin.generateMapPoints = function(){
        Pin.mapPoints = [];
        Pin.list.map(function(point){
            Pin.mapPoints.push(parseInt(point.x), parseInt(point.y));
        });
        return Pin.mapPoints;
    };

    Pin.renderPoints = function(ctx, fc){
        Pin.generateMapPoints();

        an.graphic.shape(Pin.mapPoints, Pin.colorPointsLine, false, false, 1);

        Pin.list.map(function(point){
            an.graphic.circle(point.x, point.y, 15, Pin.colorPointCircleOuter, true);
            an.graphic.circle(point.x, point.y, 5, Pin.colorPointCircleInner, true);

            var label = parseInt(point.x) + ' x ' +  parseInt(point.y);
            ctx.fillText(label, point.x + 20, point.y);
        });

    };
    Pin.onClickPointArray = function (event) {
        var j, a, list = [], t = event.target;

        if (Pin.list.length == 0 && t.className != 'pm_shape') return;

        try {
            a = t.textContent.slice(1, -1).split(',');
            if (typeof a === 'object') {
                for (j = 0; j < a.length; j += 2) {
                    list.push({x: parseInt(a[j]), y: parseInt(a[j+1])});
                }
                Pin.list = list;
            }
            Pin.mode = 'move';
        } catch (e){}
    };

    Pin.isEditable = false;

    document.addEventListener('keydown', function (event) {
        //console.log(event);

        if (event.keyCode == an.keycode.get('1')) {
            console.log('Edit!');
            if (Pin.isEditable)
                Pin.mode = 'move';
            else
                Pin.mode = 'pointer';
            Pin.isEditable = !Pin.isEditable;
        }
        else
        if (event.keyCode == an.keycode.get('2')) {
            console.log('Pop!');
            Pin.list.pop();
        }
        else
        if (event.keyCode == an.keycode.get('3')) {
            console.log('Save!');
            var htmlPointArray = '',
                mapPoints = Pin.generateMapPoints(),
                elemPointArray = document.createElement('div');
            elemPointArray.id = 'shape_' + mapPoints.slice(0,10).join('');
            elemPointArray.className = 'pm_shape';
            htmlPointArray += '['+mapPoints.join(',')+']';
            elemPointArray.innerHTML = htmlPointArray;
            afterCanvas.appendChild(elemPointArray);
        }
        else
        if (event.keyCode == an.keycode.get('5')) {
            console.log('Clean!');
            Pin.list = [];
        }
        else
        if (event.keyCode == an.keycode.get('right arrow')) {
            console.log('right arrow!');
            Pin.list.map(function(item){item.x += 5});
        }
        else
        if (event.keyCode == an.keycode.get('left arrow')) {
            console.log('right arrow!');
            Pin.list.map(function(item){item.x -= 5});
        }
        else
        if (event.keyCode == an.keycode.get('up arrow')) {
            console.log('right arrow!');
            Pin.list.map(function(item){item.y -= 5});
        }
        else
        if (event.keyCode == an.keycode.get('down arrow')) {
            console.log('right arrow!');
            Pin.list.map(function(item){item.y += 5});
        }

    });

    Pin.onLoadMapPoints = function (event) {
        event.preventDefault();
        var arr, list = [], value,
            t = event.target,
            inp = t.querySelector('input');

        if (inp.value.length > 1) {
            try {
                value = inp.value.trim();
                if (value.slice(0, 1) == '[') value = value.slice(1);
                if (value.slice(-1, 1) == ']') value = value.slice(0, -1);
                arr = value.split(',');
                if (typeof arr === 'object') {
                    for (j = 0; j < arr.length; j += 2) {
                        list.push({x: parseInt(arr[j]), y: parseInt(arr[j+1])});
                    }
                    Pin.list = list;
                }
                Pin.mode = 'move';
            } catch (e){}
        }
    };


    beforeCanvas.innerHTML = '<form><input name="map_points" type="text" value="" placeholder="[100,100, 100,100]" style="width: '+an.width+'px; border: 1px solid #2b2b2b; padding: 3px 5px; margin-bottom: 10px"></form>';
    afterCanvas.addEventListener('click', Pin.onClickPointArray);
    Pin.formMapPoints = beforeCanvas.querySelector('form');
    Pin.formMapPoints.addEventListener('submit', Pin.onLoadMapPoints);

    an.scene(function(ctx, fc) {


        if (!Pin.isGrid) {
            var i, j;
            for (i = 0; i < an.width/5; i ++) {
                var i5 = i * 5;
                if (i5 % 100 === 0) {
                    an.graphic.linePoints({x:0,y:i5}, {x:an.width,y:i5}, 2, '#C6FFFD');
                    an.graphic.linePoints({x:i5,y:0}, {x:i5,y:an.height}, 2, '#C6FFFD');
                }
                else if (i5 % 10 === 0) {
                    an.graphic.linePoints({x:0,y:i5}, {x:an.width,y:i5}, 1, '#E2FFFD');
                    an.graphic.linePoints({x:i5,y:0}, {x:i5,y:an.height}, 1, '#E2FFFD');
                }
            }
        }

        an.Text.font = 'bold 12px/15px Arial';
        an.Text.write(10, 10, 'Arrows - Movie','#000', true);
        an.Text.write(10, 25, '1 - Edit', '#000', true);
        an.Text.write(10, 40, '2 - Back', '#000', true);
        an.Text.write(10, 55, '3 - Save', '#000', true);
        an.Text.write(10, 70, '5 - Clear','#000', true);

        ctx.textBaseline = 'middle';
        ctx.font = 'normal 11px Arial';

        Pin.renderPoints(ctx, fc);

        if (Pin.mode == 'move' && Pin.colorPointsLine == Pin.colorPointsLineDefault) {
            Pin.colorPointsLine = '#FF1E00';
            Pin.colorPointCircleOuter = 'rgba(255, 30, 0, .4)'; // #FF1E00
            Pin.colorPointCircleInner = '#FF1E00'; // #731100
        } else if (Pin.mode == 'pointer' && Pin.colorPointsLine != Pin.colorPointsLineDefault) {
            Pin.colorPointsLine = Pin.colorPointsLineDefault;
            Pin.colorPointCircleOuter = Pin.colorPointCircleOuterDefault;
            Pin.colorPointCircleInner = Pin.colorPointCircleInnerDefault;
        }

    });

    an.onClick = Pin.onClick;
    an.onFrame = Pin.onFrame;
    an.render();

})(window, An);