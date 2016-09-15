(function(window, An){

    console.clear();
    console.log("Loaded: DEMO TPL");





    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 1,
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

    var Generator = {};
    Generator.fields = {};

    Generator.addFields = function(){
        "use strict";

        var fields = '';
        fields += '<style>#bz_fields_points span{display:inline-block;width:120px}#bz_fields_points input{width:80px}</style>';
        fields += '<div id="bz_fields_points">';
        fields += '     <p><span>Start point</span>';
        fields += '         <input name="sp_x" type="text" value="20"> x <input name="sp_y" type="text" value="20"></p>';
        fields += '     <p><span>Control point 1</span>';
        fields += '         <input name="cp1_x" type="text" value="20"> x <input name="cp1_y" type="text" value="100"></p>';
        fields += '     <p><span>Control point 2</span>';
        fields += '         <input name="cp2_x" type="text" value="200"> x <input name="cp2_y" type="text" value="100"></p>';
        fields += '     <p><span>End point</span>';
        fields += '         <input name="ep_x" type="text" value="200"> x <input name="ep_y" type="text" value="20"></p>';
        fields += '</div>';

        afterCanvas.innerHTML = fields;

        Generator.fields.inputs = (function(){
            var i, inputs = {}, inputsElems = afterCanvas.querySelectorAll('input');
            for (i = 0; i < inputsElems.length; i ++)
                inputs[inputsElems[i].name] = inputsElems[i];
            return inputs;
        })();

    };

    Generator.addFields();

    Generator.getValue = function(name, defaultValue) {
        return Generator.fields.inputs[name] ? Generator.fields.inputs[name].value : defaultValue;
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

        ctx.beginPath();
        ctx.moveTo(
            Generator.getValue('sp_x', 20),
            Generator.getValue('sp_y', 20)
        );
        ctx.bezierCurveTo(
            Generator.getValue('cp1_x', 20),
            Generator.getValue('cp1_y', 100),
            Generator.getValue('cp2_x', 200),
            Generator.getValue('cp2_y', 100),
            Generator.getValue('ep_x', 200),
            Generator.getValue('ep_y', 20)
        );
        ctx.lineWidth = 3;
        ctx.stroke();

    });

    an.render();


})(window, An);