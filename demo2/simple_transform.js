(function(window, An){

    console.clear();
    console.log("Loaded: Demo transform");


    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 12,

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

    Dm.point = {x: an.width/2-50, y: an.height/2-50};
    /**
     * ctx.transform(1, 0, 0, 1, 0, 0);
     * ctx.setTransform(1, 0, 0, 1, 0, 0);
     *      a (m11) -  Horizontal scaling.
     *      b (m12) - Horizontal skewing.
     *      c (m21) - Vertical skewing.
     *      d (m22) - Vertical scaling.
     *      e (dx) - Horizontal moving.
     *      f (dy) - Vertical moving.
     * @type {{a: number, b: number, c: number, d: number, e: number, f: number}}
     */
    Dm.transform = {
        a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
    };


    Dm.onMousemove = function(point){};
    Dm.onClick = function (point) {};
    Dm.onFrame = function (ctx, frameCounter) {};

    an.scene(function(ctx){

        // transform OR setTransform
        ctx.setTransform(
            Dm.transform.a,
            Dm.transform.b,
            Dm.transform.c,
            Dm.transform.d,
            Dm.transform.e,
            Dm.transform.f
        );

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#F24926';
        ctx.rect(Dm.point.x, Dm.point.y, 100, 50);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    if (afterCanvas) {
        var html = '<div id="ranges">';
        html += '<div><input id="trans_a" type="range" min="-1" max="2" step="0.01" value="1"> <span>1</span></div>';
        html += '<div><input id="trans_b" type="range" min="-1" max="2" step="0.01" value="0"> <span>0</span></div>';
        html += '<div><input id="trans_c" type="range" min="-1" max="2" step="0.01" value="0"> <span>0</span></div>';
        html += '<div><input id="trans_d" type="range" min="-1" max="2" step="0.01" value="1"> <span>1</span></div>';
        html += '<div><input id="trans_e" type="range" min="-200" max="200" step="10" value="0"> <span>0</span></div>';
        html += '<div><input id="trans_f" type="range" min="-200" max="200" step="10" value="0"> <span>0</span></div>';
        html += '</div>';
        afterCanvas.innerHTML = html;
        var i, ranges = afterCanvas.querySelectorAll('input[type="range"]');
        for (i = 0; i < ranges.length; i ++) {
            ranges[i].style.width = '600px';
            ranges[i].addEventListener('change', function (event){
                var t = event.target,
                    c = t.id.slice(-1);
                if (Dm.transform[c] !== undefined) {
                    Dm.transform[c] = parseFloat(t.value);
                    t.parentNode.querySelector('span').innerHTML = t.value;
                }
            });
        }
    }





    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.onMousemove = Dm.onMousemove;

    an.render();

})(window, An);
