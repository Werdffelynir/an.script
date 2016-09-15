(function(window, An){

    console.clear();
    console.log("Loaded: DEMO Navigation");

    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 0,
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

    var App = {};
    App.state = '';
    App.clip = {};
    App.rect = {};
    App.clip.menu = function(ctx) {

        ctx.fillStyle = '#EDE29F';
        ctx.fillRect(0, 0, 160, 400);

        an.Text.font = '16px Arial';
        an.Text.write(10, 50,  "Main", '#000', true);
        an.Text.write(10, 100, "Blog", '#000', true);
        an.Text.write(10, 150, "Photos", '#000', true);
        an.Text.write(10, 200, "Contacts", '#000', true);
        an.Text.write(10, 250, "About", '#000', true);

        App.rect.btnMain = [10, 50, 160, 20];
        App.rect.btnBlog = [10, 100, 160, 20];
        App.rect.btnPhotos = [10, 150, 160, 20];
        App.rect.btnContacts = [10, 200, 160, 20];
        App.rect.btnAbout = [10, 250, 160, 20];
    };

    App.clip.title = function(ctx, text){
        ctx.fillStyle = '#EDE29F';
        ctx.fillRect(0, 0, an.width, 40);
        an.Text.font = '14px Arial';
        an.Text.write(200, 15,  text, '#000', true);
    };

    App.onCanvasClick = function(point){

        if (App.state != 'main' && an.hitTest(App.rect.btnMain)) {
            an.renderStage('main');
        }
        if (App.state != 'blog' && an.hitTest(App.rect.btnBlog)) {
            an.renderStage('blog');
        }
        if (App.state != 'photos' && an.hitTest(App.rect.btnPhotos)) {
            an.renderStage('photos');
        }
        if (App.state != 'contacts' && an.hitTest(App.rect.btnContacts)) {
            an.renderStage('contacts');
        }
        if (App.state != 'about' && an.hitTest(App.rect.btnAbout)) {
            an.renderStage('about');
        }

        an.play();
    };

    an.stage('main', function(ctx){
        an.backgroundColor('#FFF8CD');

        an.graphic.shape([300,100,450,100,400,200,400,210,450,310,300,310,350,210,350,200], '#80794E', true);
        an.graphic.shape([300,100,450,100,400,200,400,210,450,310,300,310,350,210,350,200], '#999999', false, true, 15);

        App.state = 'main';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: Main');
    });

    an.stage('blog', function(ctx){
        an.backgroundColor('#9CB9E9');

        an.graphic.shape([430,400,370,200,440,365,360,45,450,325,445,70,400,200,440,10,465,30,470,350,510,110,540,125,555,260,525,165,480,400], '#2B2400', false, true, 3);
        an.graphic.shape([430,400,370,200,440,365,360,45,450,325,445,70,400,200,440,10,465,30,470,350,510,110,540,125,555,260,525,165,480,400], '#DA6415', true);

        App.state = 'blog';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: Blog');
    });

    an.stage('photos', function(ctx){
        an.backgroundColor('#D31D24');

        an.graphic.shape([300,115,300,190,380,190,380,120], '#fff', true);
        an.graphic.shape([400,140,330,220,435,235], '#00f', true);

        App.state = 'photos';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: Photos');
    });

    an.stage('contacts', function(ctx){
        an.backgroundColor('#41D13B');

        var colorc = '#313670';
        an.graphic.shape([340,125,530,115,520,165,345,165], '#08f', true);
        an.graphic.circle(365, 145, 12, colorc, true);
        an.graphic.circle(505, 140, 10, colorc, true);
        an.graphic.shape([345,185,545,170,555,220,335,220], '#08f', true);
        an.graphic.circle(363, 200, 14, colorc, true);
        an.graphic.circle(530, 205, 12, colorc, true);
        an.graphic.shape([340,250,545,240,540,280,335,275], '#08f', true);
        an.graphic.circle(355, 262, 14, colorc, true);
        an.graphic.circle(525, 265, 16, colorc, true);
        an.graphic.shape([335,300,350,345,545,335,540,310], '#08f', true);
        an.graphic.circle(370, 325, 16, colorc, true);
        an.graphic.circle(530, 325, 19, colorc, true);

        an.graphic.shape([230,135,270,140,290,175,285,220,240,235,190,190,200,150], colorc, false, true, 15);
        an.graphic.shape([230,135,270,140,290,175,285,220,240,235,190,190,200,150], '#1D2042', true);

        an.graphic.shape([215,250,265,245,280,265,270,290,240,300,205,290,205,265], colorc, false, true, 15);
        an.graphic.shape([215,250,265,245,280,265,270,290,240,300,205,290,205,265], '#1D2042', true);

        App.state = 'contacts';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: Contacts');
    });

    an.stage('about', function(ctx){
        an.backgroundColor('#1D1F2E');


        an.graphic.circle(380, 245, 100, '#CDDC39', true); // head
        an.graphic.circle(355, 240, 16, '#404512', true);  // eay left
        an.graphic.circle(405, 240, 16, '#404512', true);  // eay right

        ctx.beginPath();
        ctx.moveTo(355, 270);
        ctx.bezierCurveTo(
            365, 285,
            395, 285,

            405, 270
        );

        ctx.lineCap = 'round';
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#404512';
        ctx.stroke();


        App.state = 'about';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: About');
    });

    an.onClick = App.onCanvasClick;
    an.render('main');

})(window, An);