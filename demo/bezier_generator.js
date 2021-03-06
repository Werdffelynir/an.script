(function(window, An){

    console.clear();
    console.log("Loaded: Bezier Generator");





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

    var Bezier = {sp_x:150, sp_y:150, cp1_x:200, cp1_y:220, cp2_x:350, cp2_y:220, ep_x:400, ep_y:150};
    Bezier.fields = {};

    Bezier.addFields = function(){
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
        Bezier.fields.element = fields;
        Bezier.fields.inputs = (function(){
            var i, inputs = {}, inputsElems = afterCanvas.querySelectorAll('input');
            for (i = 0; i < inputsElems.length; i ++)
                inputs[inputsElems[i].name] = inputsElems[i];
            return inputs;
        })();

    };

    Bezier.addFields();

    Bezier.getValue = function(name, defaultValue) {
        try {
            defaultValue = parseInt(Bezier.fields.inputs[name].value);
        }catch (e) { }
        return defaultValue;
    };

    Bezier.onFrame = function() {
        if (afterCanvas.querySelector)
            afterCanvas.querySelector('#mouse_pos').innerHTML = parseInt(an.mouse.x) + ' x ' + parseInt(an.mouse.y);

        if (Bezier.isMove) {
            Bezier[Bezier.movePoint[0]] = Bezier.fields.inputs[Bezier.movePoint[0]].value = parseInt(an.mouse.x);
            Bezier[Bezier.movePoint[1]] = Bezier.fields.inputs[Bezier.movePoint[1]].value = parseInt(an.mouse.y);
        }
    };
    Bezier.isMove = false;
    Bezier.movePoint = null;
    Bezier.onClick = function(point) {

        var rectSp = [Bezier.sp_x-5, Bezier.sp_y-5, 10, 10],
            rectCp1 = [Bezier.cp1_x-5, Bezier.cp1_y-5, 10, 10],
            rectCp2 = [Bezier.cp2_x-5, Bezier.cp2_y-5, 10, 10],
            rectEp = [Bezier.ep_x-5, Bezier.ep_y-5, 10, 10];

        if (an.hitTestPoint(rectSp, point)) {
            Bezier.movePoint = ['sp_x', 'sp_y'];
            Bezier.isMove = !Bezier.isMove;
        }
        else if (an.hitTestPoint(rectCp1, point)) {
            Bezier.movePoint = ['cp1_x', 'cp1_y'];
            Bezier.isMove = !Bezier.isMove;
        }
        else if (an.hitTestPoint(rectCp2, point)) {
            Bezier.movePoint = ['cp2_x', 'cp2_y'];
            Bezier.isMove = !Bezier.isMove;
        }
        else if (an.hitTestPoint(rectEp, point)) {
            Bezier.movePoint = ['ep_x', 'ep_y'];
            Bezier.isMove = !Bezier.isMove;
        }



        //console.log(Bezier.isMove, rectSp, point, an.hitTestPoint(rectSp, point));

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

        if (!Bezier.isMove) {
            Bezier.sp_x = Bezier.getValue('sp_x', 150);
            Bezier.sp_y = Bezier.getValue('sp_y', 150);
            Bezier.cp1_x = Bezier.getValue('cp1_x', 200);
            Bezier.cp1_y = Bezier.getValue('cp1_y', 220);
            Bezier.cp2_x = Bezier.getValue('cp2_x', 350);
            Bezier.cp2_y = Bezier.getValue('cp2_y', 220);
            Bezier.ep_x = Bezier.getValue('ep_x', 400);
            Bezier.ep_y = Bezier.getValue('ep_y', 150);
        }
        //console.log(Bezier.sp_x);


        ctx.textBaseline = 'middle';
        ctx.font = '11px Arial';
        var labelCp1 = '    ' + Bezier.cp1_x + ' x ' +  Bezier.cp1_y;
        ctx.fillText(labelCp1, Bezier.cp1_x, Bezier.cp1_y);
        var labelCp2 = '    ' + Bezier.cp2_x + ' x ' +  Bezier.cp2_y;
        ctx.fillText(labelCp2, Bezier.cp2_x, Bezier.cp2_y);
        var labelEp = '    ' + Bezier.ep_x + ' x ' +  Bezier.ep_y;
        ctx.fillText(labelEp, Bezier.ep_x, Bezier.ep_y);
        var labelSp = '    ' + Bezier.sp_x + ' x ' +  Bezier.sp_y;
        ctx.fillText(labelSp, Bezier.sp_x, Bezier.sp_y);

        an.graphic.linePoints(
            an.point(Bezier.sp_x,Bezier.sp_y),
            an.point(Bezier.cp1_x,Bezier.cp1_y),
            1, 'blue');

        an.graphic.linePoints(
            an.point(Bezier.ep_x,Bezier.ep_y),
            an.point(Bezier.cp2_x,Bezier.cp2_y),
            1, 'blue');


        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.moveTo(Bezier.sp_x, Bezier.sp_y);
        ctx.bezierCurveTo(Bezier.cp1_x, Bezier.cp1_y, Bezier.cp2_x, Bezier.cp2_y, Bezier.ep_x, Bezier.ep_y);
        ctx.lineWidth = 3;
        ctx.stroke();

        an.graphic.circle(Bezier.sp_x, Bezier.sp_y, 10, colorPoint, true);
        an.graphic.circle(Bezier.ep_x, Bezier.ep_y, 10, colorPoint, true);
        an.graphic.circle(Bezier.cp1_x, Bezier.cp1_y, 10, colorPoint, true);
        an.graphic.circle(Bezier.cp2_x, Bezier.cp2_y, 10, colorPoint, true);


        if (Bezier.isMove) {
        var htmlOutput = '';
            htmlOutput += '<pre style="text-align: left; padding: 10px 200px; background-color: #2b2b2b; color: #92f292;">';
            htmlOutput += 'ctx.beginPath();\n';
            htmlOutput += 'ctx.strokeStyle = "#000";\n';
            htmlOutput += 'ctx.moveTo('+Bezier.sp_x+', '+Bezier.sp_y+');\n';
            htmlOutput += 'ctx.bezierCurveTo('+Bezier.cp1_x+', '+Bezier.cp1_y+', '+Bezier.cp2_x+', '+Bezier.cp2_y+', '+Bezier.ep_x+', '+Bezier.ep_y+');\n';
            htmlOutput += 'ctx.stroke();\n';
            htmlOutput += '</pre>';
            beforeCanvas.innerHTML = htmlOutput;
        }

        //an.graphic.lineWidth(Bezier.sp_x, Bezier.sp_y, -an.width, 0.5, 'blue');
        //an.graphic.lineWidth(Bezier.cp1_x, Bezier.cp1_y, -an.width, 1, 'blue');


        //an.graphic.linePoints(an.point(10,10), an.point(150,150), 1, 'blue');
       // an.graphic.line(100, 210, -100, 1, 'blue');
        //an.graphic.lineHeight(200, 200, 100, 1, 'blue');
        //an.graphic.lineHeight(200, 200, 100, .1, 'blue');
        //an.graphic.lineHeight(220, 200, -100, 1, 'blue');

        //an.Text.write(100, 100, 'Jopa Bugaia', '#000', true);

        //if (!Bezier.isMove) {


           // an.Text.font = '12px Arial';
          //  an.Text.write(Bezier.cp1_x + 20, Bezier.cp1_y, label, '#000', true);
        //}

    });


    an.onClick = Bezier.onClick;
    an.onFrame = Bezier.onFrame;
    an.render();

    window.Bezier = Bezier;
    window.an = an;

})(window, An);