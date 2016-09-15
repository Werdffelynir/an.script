(function(window, An){

    console.clear();
    console.log("Loaded: DEMO TPL");





    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
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

    var Generator = {sp_x:150, sp_y:150, cp1_x:200, cp1_y:220, cp2_x:350, cp2_y:220, ep_x:400, ep_y:150};
    Generator.fields = {};

    Generator.addFields = function(){
        "use strict";

        var fields = '';
        fields += '<style>#bz_fields_points span{display:inline-block;width:120px}#bz_fields_points input{width:80px;border: 1px solid #666666; padding: 2px 5px; font-weight: bold;}</style>';
        fields += '<div id="bz_fields_points">';
        fields += '     <p><span>Start point</span>';
        fields += '         <input name="sp_x" type="number" value="150"> x <input name="sp_y" type="number" value="150"></p>';
        fields += '     <p><span>Control point 1</span>';
        fields += '         <input name="cp1_x" type="number" value="200"> x <input name="cp1_y" type="number" value="220"></p>';
        fields += '     <p><span>Control point 2</span>';
        fields += '         <input name="cp2_x" type="number" value="350"> x <input name="cp2_y" type="number" value="220"></p>';
        fields += '     <p><span>End point</span>';
        fields += '         <input name="ep_x" type="number" value="400"> x <input name="ep_y" type="number" value="150"></p>';
        fields += '<p><span id="mouse_pos">0 x 0</span></p>';
        fields += '</div>';

        afterCanvas.innerHTML = fields;
        Generator.fields.element = fields;
        Generator.fields.inputs = (function(){
            var i, inputs = {}, inputsElems = afterCanvas.querySelectorAll('input');
            for (i = 0; i < inputsElems.length; i ++)
                inputs[inputsElems[i].name] = inputsElems[i];
            return inputs;
        })();

    };

    Generator.addFields();

    Generator.getValue = function(name, defaultValue) {
        try {
            defaultValue = parseInt(Generator.fields.inputs[name].value);
        }catch (e) { }
        return defaultValue;
    };

    Generator.onFrame = function(an) {
        if (afterCanvas.querySelector)
            afterCanvas.querySelector('#mouse_pos').innerHTML = an.mouse.x + ' x ' + an.mouse.y;

        if (Generator.isMove) {
            Generator[Generator.movePoint[0]] = an.mouse.x;
            Generator[Generator.movePoint[1]] = an.mouse.y;
            Generator.fields.inputs[Generator.movePoint[0]].value = an.mouse.x;
            Generator.fields.inputs[Generator.movePoint[1]].value = an.mouse.y;
        }
    };
    Generator.isMove = false;
    Generator.movePoint = null;
    Generator.onClick = function(point) {

        var rectSp = [Generator.sp_x-5, Generator.sp_y-5, 10, 10],
            rectCp1 = [Generator.cp1_x-5, Generator.cp1_y-5, 10, 10],
            rectCp2 = [Generator.cp2_x-5, Generator.cp2_y-5, 10, 10],
            rectEp = [Generator.ep_x-5, Generator.ep_y-5, 10, 10];

        if (an.hitTestPoint(rectSp, point)) {
            Generator.movePoint = ['sp_x', 'sp_y'];
            Generator.isMove = !Generator.isMove;
        }
        else if (an.hitTestPoint(rectCp1, point)) {
            Generator.movePoint = ['cp1_x', 'cp1_y'];
            Generator.isMove = !Generator.isMove;
        }
        else if (an.hitTestPoint(rectCp2, point)) {
            Generator.movePoint = ['cp2_x', 'cp2_y'];
            Generator.isMove = !Generator.isMove;
        }
        else if (an.hitTestPoint(rectEp, point)) {
            Generator.movePoint = ['ep_x', 'ep_y'];
            Generator.isMove = !Generator.isMove;
        }



        //console.log(Generator.isMove, rectSp, point, an.hitTestPoint(rectSp, point));

    };

    /*
CanvasRenderingContext2D.prototype.bezierCurveTo([ Number ] cp1x,
                                                 [ Number ] cp1y,
                                                 [ Number ] cp2x,
                                                 [ Number ] cp2y,
                                                 [ Number ] x,
                                                 [ Number ] y )
     */

    an.scene(function(ctx){

        var colorPoint = 'red';

        if (!Generator.isMove) {
            Generator.sp_x = Generator.getValue('sp_x', 150);
            Generator.sp_y = Generator.getValue('sp_y', 150);
            Generator.cp1_x = Generator.getValue('cp1_x', 200);
            Generator.cp1_y = Generator.getValue('cp1_y', 220);
            Generator.cp2_x = Generator.getValue('cp2_x', 350);
            Generator.cp2_y = Generator.getValue('cp2_y', 220);
            Generator.ep_x = Generator.getValue('ep_x', 400);
            Generator.ep_y = Generator.getValue('ep_y', 150);
        }


        ctx.textBaseline = 'middle';
        ctx.font = '11px Arial';
        var labelCp1 = '    ' + Generator.cp1_x + ' x ' +  Generator.cp1_y;
        ctx.fillText(labelCp1, Generator.cp1_x, Generator.cp1_y);
        var labelCp2 = '    ' + Generator.cp2_x + ' x ' +  Generator.cp2_y;
        ctx.fillText(labelCp2, Generator.cp2_x, Generator.cp2_y);
        var labelEp = '    ' + Generator.ep_x + ' x ' +  Generator.ep_y;
        ctx.fillText(labelEp, Generator.ep_x, Generator.ep_y);
        var labelSp = '    ' + Generator.sp_x + ' x ' +  Generator.sp_y;
        ctx.fillText(labelSp, Generator.sp_x, Generator.sp_y);

        an.graphic.linePoints(
            an.point(Generator.sp_x,Generator.sp_y),
            an.point(Generator.cp1_x,Generator.cp1_y),
            1, 'blue');

        an.graphic.linePoints(
            an.point(Generator.ep_x,Generator.ep_y),
            an.point(Generator.cp2_x,Generator.cp2_y),
            1, 'blue');


        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.moveTo(Generator.sp_x, Generator.sp_y);
        ctx.bezierCurveTo(Generator.cp1_x, Generator.cp1_y, Generator.cp2_x, Generator.cp2_y, Generator.ep_x, Generator.ep_y);
        ctx.lineWidth = 3;
        ctx.stroke();

        an.graphic.circle(Generator.sp_x, Generator.sp_y, 10, colorPoint, true);
        an.graphic.circle(Generator.ep_x, Generator.ep_y, 10, colorPoint, true);
        an.graphic.circle(Generator.cp1_x, Generator.cp1_y, 10, colorPoint, true);
        an.graphic.circle(Generator.cp2_x, Generator.cp2_y, 10, colorPoint, true);

        //an.graphic.lineWidth(Generator.sp_x, Generator.sp_y, -an.width, 0.5, 'blue');
        //an.graphic.lineWidth(Generator.cp1_x, Generator.cp1_y, -an.width, 1, 'blue');


        //an.graphic.linePoints(an.point(10,10), an.point(150,150), 1, 'blue');
       // an.graphic.line(100, 210, -100, 1, 'blue');
        //an.graphic.lineHeight(200, 200, 100, 1, 'blue');
        //an.graphic.lineHeight(200, 200, 100, .1, 'blue');
        //an.graphic.lineHeight(220, 200, -100, 1, 'blue');

        //an.Text.write(100, 100, 'Jopa Bugaia', '#000', true);

        //if (!Generator.isMove) {


           // an.Text.font = '12px Arial';
          //  an.Text.write(Generator.cp1_x + 20, Generator.cp1_y, label, '#000', true);
        //}

    });


    an.onClick = Generator.onClick;
    an.onFrame = Generator.onFrame;
    an.render();

    window.Generator = Generator;
    window.an = an;

})(window, An);