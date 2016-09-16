(function(window, An){

    console.clear();
    console.log("Loaded: Demo move to mouse click");


    var an = new An({
        selector: "canvas#canvas",
        width: 800,
        height: 600,
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

    var Dm = {};
    Dm.hero = an.point(an.width/2, an.height/2);
    Dm.heroSpeed = 4;
    Dm.heroMovedTo = Dm.hero;
    Dm.heroDynamic = {x: 1, y: 1};
    Dm.heroMoved = false;

    Dm.onClick = function(point){
        Dm.heroMoved = true;
        Dm.heroMovedTo = point;
        var xDiff = Dm.heroMovedTo.x - Dm.hero.x;
        var yDiff = Dm.heroMovedTo.y - Dm.hero.y;
        var angle = Math.atan2(yDiff, xDiff);
        Dm.heroDynamic.x = Dm.heroSpeed * Math.cos(angle);
        Dm.heroDynamic.y = Dm.heroSpeed * Math.sin(angle);
    };

    Dm.onFrame = function(ctx, frameCounter) {};

    an.scene(function(ctx, frameCounter){

        if (Dm.heroMoved) {
            an.graphic.linePoints(Dm.hero, Dm.heroMovedTo, 1, '#E93641');
            an.graphic.circle(Dm.heroMovedTo.x, Dm.heroMovedTo.y, 5, '#E93641', true);

            if (Math.abs(Dm.heroDynamic.x) < 0.1 && Math.abs(Dm.heroDynamic.y) < 0.1)
                Dm.heroMoved = false;

            Dm.hero.x += Dm.heroDynamic.x *= 0.988;
            Dm.hero.y += Dm.heroDynamic.y *= 0.988;

            var heroMovedToString = parseInt(Dm.heroMovedTo.x) + ' x ' + parseInt(Dm.heroMovedTo.y);
            heroMovedToString += ' Distance: ' + (An.Util.distanceBetween(Dm.hero, Dm.heroMovedTo).toFixed(2));
            an.Text.write(Dm.heroMovedTo.x + 20, Dm.heroMovedTo.y, heroMovedToString, 'black', true);
        }

        an.graphic.circle(Dm.hero.x, Dm.hero.y, 20, '#C4ACED', true);
        an.graphic.circle(Dm.hero.x, Dm.hero.y, 10, '#7C55C2', true);

    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
