(function(window, An){

    console.clear();
    console.log("Loaded: 400 balls");

    var clip = {};

    var an = new An({
        selector: "canvas#canvas",
        width: 1000,
        height: 500,
        fps: 60,
        onClick: null,
        onFrame: null,
        loop: 'animation',
        fullScreen: false,
        autoStart: true,
        autoClear: true,
        enableEventClick: false,
        enableEventMouseMovie: false,
        enableEventKeys: false
    });


    for (var i = 0; i < 400; i++) {

        var x = An.Util.rand(0, an.width);
        var y = An.Util.rand(0, an.height);
        var vx = An.Util.rand(-5, 10) / 2;
        var vy = An.Util.rand(-5, 10) / 2;
        var color = An.Util.randColor();
        var radius = An.Util.rand(10, 20);

        an.scene({
            index: 5,
            name: 'display',
            deep: 40,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            color: color,
            radius: radius,
            runner: function (ctx) {

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();

                this.x += this.vx;
                this.y += this.vy;

                if (this.x > an.width && this.x) this.vx = -this.vx;
                else if (this.x < 0) this.vx = this.vx * -1;

                if (this.y > an.height) this.vy = -this.vy;
                else if (this.y < 0) this.vy = this.vy * -1;

            }
        });
    }

    an.render();

})(window, An);