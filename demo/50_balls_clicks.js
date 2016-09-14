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
        enableEventClick: true,
        enableEventMouseMovie: false,
        enableEventKeys: false
    });


    for (var i = 0; i < 50; i++) {

        var x = An.Util.rand(0, an.width);
        var y = An.Util.rand(0, an.height);
        var vx = An.Util.rand(-10, 10) / 5;
        var vy = An.Util.rand(-10, 10) / 5;
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
            visibly: true,
            rectangle: [0, 0, 0, 0],
            runner: function (ctx) {

                if (this.visibly) {

                    an.removeEventClick(this.rectangle);

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

                    this.rectangle = [
                        this.x - this.radius,
                        this.y - this.radius,
                        this.radius * 2,
                        this.radius * 2
                    ];

                    var self = this;
                    an.addEventClick(this.rectangle, function (e) {
                        an.removeEventClick(self.rectangle);
                        self.visibly = false;
                    });

                }

            }
        });
    }

    an.render();

})(window, An);