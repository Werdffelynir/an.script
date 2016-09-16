(function(window, An){

    console.clear();
    console.log("Loaded: Demo");

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
    Dm.heroSpeed = 8;
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

    an.scene(function(ctx){

        if (Dm.heroMoved) {

            an.graphic.linePoints(Dm.hero, Dm.heroMovedTo, 1, '#E93641');
            an.graphic.circle(Dm.heroMovedTo.x, Dm.heroMovedTo.y, 5, '#E93641', true);

            if (ctx.isPointInPath(Dm.hero.x, Dm.hero.y) ||
                An.Util.distanceBetween(Dm.hero, Dm.heroMovedTo) <= Dm.heroSpeed)
                Dm.heroMoved = false;

            Dm.hero.x += Dm.heroDynamic.x;
            Dm.hero.y += Dm.heroDynamic.y;

        }

        an.graphic.circle(Dm.hero.x, Dm.hero.y, 20, '#C4ACED', true);
        an.graphic.circle(Dm.hero.x, Dm.hero.y, 10, '#7C55C2', true);

    });

    an.onClick = Dm.onClick;
    an.render();

})(window, An);
