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

        App.state = 'main';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: Main');
    });

    an.stage('blog', function(ctx){
        an.backgroundColor('#9CB9E9');

        App.state = 'blog';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: Blog');
    });

    an.stage('photos', function(ctx){
        an.backgroundColor('#D31D24');

        App.state = 'photos';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: Photos');
    });

    an.stage('contacts', function(ctx){
        an.backgroundColor('#41D13B');

        App.state = 'contacts';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: Contacts');
    });

    an.stage('about', function(ctx){
        an.backgroundColor('#FF3853');

        App.state = 'about';
        App.clip.menu(ctx);
        App.clip.title(ctx, 'Page: About');
    });

    an.onClick = App.onCanvasClick;
    an.render('main');

})(window, An);