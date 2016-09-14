(function(window, An){

    console.clear();
    console.log("Loaded: DEMO TPL");

    var an = new An({
        selector: "canvas#canvas",
        width: 800,
        height: 600,
        fps: 12,
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

    var game = {
        graphic: {}
    };

    game.begin = false;
    game.score = 0;
    game.level = 0;
    game.find = 0;
    game.result = null;
    game.rectBtnStartLevel = [10, 100, 150, 30];
    game.rectHider1 = [250, 160, 80, 80];
    game.rectHider2 = [350, 160, 80, 80];
    game.rectHider3 = [450, 160, 80, 80];

    game.graphic.hider = function (ctx, rectengle, color) {
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#212121';
        ctx.fillStyle = color || '#EAF3AB';
        ctx.rectRound(rectengle[0], rectengle[1], rectengle[2], rectengle[3], 40);
        ctx.stroke();
        ctx.fill();
    };

    game.graphic.gamePanel = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#6E002C';
        ctx.fillRect(0, 0, an.width, 30);
        ctx.beginPath();
        ctx.fillStyle = '#FCFF46';
        ctx.font = "bold 16px/18px serif";
        var showText = 'GAME: ' + game.level +
            '      SCORE: ' + game.score +
            '      FIND: ' + game.find;
        ctx.fillText(showText, 10, 20);
    };


    game.graphic.btn = function (ctx, text, x, y) {
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#34A200';
        ctx.fillStyle = '#EAF3AB';
        ctx.rect(x, y, 150, 30);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.font = '12px/12px Arial';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#180D1E';
        ctx.fillText(text, x + 10, y + 10);
    };

    game.graphic.resultText = function (text) {
        var ctx = an.context;
        ctx.beginPath();
        ctx.font = 'bold 28px/30px Arial';
        ctx.fillStyle = '#34A200';
        ctx.fillText(text, 320, 110);
    };


    an.stage("menu", {
        index: 100,
        runner: function (ctx) {
            var rect = [an.width / 2 - 75, 150, 150, 30];
            game.graphic.btn(ctx, 'Start Game', rect[0], rect[1]);
            an.addEventClick(rect, function (e, r) {
                an.removeEventClick(r);
                game.begin = true;
                game.level = 1;
                game.hideIn = An.Util.rand(0, 2);

                an.renderStage("game");
            });
        }
    });

    an.stage("game", {
        index: 100,
        defColor: '#40CB4B',
        winColor: '#1E00CB',
        failColor: '#CB1100',
        runner: function (ctx) {

            game.graphic.gamePanel(ctx);

            var colors = [
                ( (game.begin) ? this.defColor : (game.hideIn === 0) ? this.winColor : this.failColor ),
                ( (game.begin) ? this.defColor : (game.hideIn === 1) ? this.winColor : this.failColor ),
                ( (game.begin) ? this.defColor : (game.hideIn === 2) ? this.winColor : this.failColor )
            ];

            game.graphic.hider(ctx, game.rectHider1, colors[0]);
            game.graphic.hider(ctx, game.rectHider2, colors[1]);
            game.graphic.hider(ctx, game.rectHider3, colors[2]);

            if (game.begin) {
                an.addEventClick(game.rectHider1, this.choiceHider);
                an.addEventClick(game.rectHider2, this.choiceHider);
                an.addEventClick(game.rectHider3, this.choiceHider);
            } else {
                if (game.result) {
                    game.graphic.resultText('You WIN !!!');
                }
                else {
                    game.graphic.resultText('You FAIL !!!');
                }

                game.graphic.btn(ctx, "NEXT", 320, 280);

                an.addEventClick([320, 280, 150, 30], function (e, r) {
                    an.removeEventClick(r);
                    game.begin = true;
                    game.selected = null;
                    game.result = null;
                    game.level++;
                    game.hideIn = An.Util.rand(0, 2);
                });
            }
        },

        choiceHider: function (e, r) {
            game.selected = false;
            game.begin = false;

            an.removeEventClick(game.rectHider1);
            an.removeEventClick(game.rectHider2);
            an.removeEventClick(game.rectHider3);

            if (r.join('_') == game.rectHider1.join('_'))
                game.selected = 0;
            else if (r.join('_') == game.rectHider2.join('_'))
                game.selected = 1;
            else if (r.join('_') == game.rectHider3.join('_'))
                game.selected = 2;

            game.result = game.selected === game.hideIn;

            if (game.result) {
                game.score += 100;
                game.find ++;
            }
        }

    });

    an.render("menu");


})(window, An);