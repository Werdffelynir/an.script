(function(window, An){

    console.clear();
    console.log("Loaded: DEMO planets.js");

    var an = new An({
        selector: "canvas#canvas",
        width: 1000,
        height: 600,
        fps: 30,
        onClick: null,
        onFrame: null,
        loop: 'animation',
        fullScreen: false,
        autoStart: true,
        autoClear: true,
        saveRestore: true,
        enableEventClick: true,
        enableEventMouseMovie: false,
        enableEventKeys: false
    });

    var clip = {};

    an.scene({
        index: 1,
        runner: function (ctx) {
            ctx.fillStyle = '#0A001B';
            ctx.fillRect(0, 0, an.width, an.height);
        }
    });

    // static start
    clip.starsCunnt = 160;
    clip.starColors = ['#ADB2BF', '#40BF00', '#BF000A'];

    for (var si = 0; si < clip.starsCunnt; si++) {
        an.scene({
            index: 1,
            starX: An.Util.rand(0, an.width),
            starY: An.Util.rand(0, an.height),
            starSize: An.Util.rand(1, 3),
            starColor: clip.starColors[An.Util.rand(0, 2)],
            runner: function (ctx) {
                an.graphic.circle(this.starX, this.starY, this.starSize, this.starColor, true);
            }
        });
    }

    // sun
    an.scene({
        index: 5,
        x: 0,
        runner: function (ctx) {
            ctx.shadow(0, 0, 35, '#D8FF00');
            ctx.fillStyle = '#D8FF00';
            ctx.arc(an.width / 2, an.height / 2, 30, 0, 2 * Math.PI);
            ctx.fill();
        }
    });

    // planet creator
    clip.planet = function (radius, size, speed, color, colorShadow, degrees) {
        return {
            index: 5,
            speed: speed || 3,
            radius: radius || 50,
            size: size || 10,
            degrees: degrees || 0,
            color: color || '#DCE7FF',
            colorShadow: colorShadow || '#F9C4F4',
            runner: function (ctx) {
                ctx.beginPath();
                ctx.save();
                ctx.shadow(0, 0, 10, this.colorShadow);
                ctx.fillStyle = this.color;
                ctx.translate(an.width / 2, an.height / 2);
                ctx.rotate(An.Util.degreesToRadians(this.degrees));
                ctx.arc(0, this.radius, this.size, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
                this.degrees += this.speed;
                if (this.degrees >= 360) this.degrees = 0;
            }
        }
    };

    an.scene(clip.planet(50, 4, 1.9));
    an.scene(clip.planet(100, 15, 1.1, '#8892BF', '#FF844B', 0));
    an.scene(clip.planet(180, 6, 0.75, '#FF001B', '#970010', 0));
    an.scene(clip.planet(200, 8, 0.65, '#304C3C', '#395847', 0));
    an.scene(clip.planet(280, 20, 0.55, '#8892BF', '#FF844B', 0));

    for (var ip = 0; ip < 200; ip++) {
        var s = An.Util.rand(1, 20) / 200;
        var p = An.Util.rand(1, 320);
        var r = An.Util.rand(1, 4);
        var distance = An.Util.rand(320, 450);
        an.scene(clip.planet(distance, r, s, '#39644C', '#67B389', p));
    }

    an.render();

})(window, An);