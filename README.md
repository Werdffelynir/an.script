# Animation JS script

The script implements a control HTML5 element canvas.
Simplified realization of animation or static graphs, and some event-control model for "click", "mousemove", "keydown" and "keyup"



## Loop schema
```
onClick
onMousemove
onKeyup ...
- --------------------------------------------------

    - onFrameBefore()
    
    - frames

    if scenes is empty
        - onFrame
    else
        - onFrame
        - scenes (or scenes of stage)
            
    - onFrameAfter
    
- --------------------------------------------------
```


## Script Maps

### Constants and static properties
```
An.version [Only read]
An.LOOP_TIMER [Only read]
An.LOOP_ANIMATE [Only read]
An.Extension(callback: Function) [Only write]
```

### Properties
```
an = new An ();
an.selector: String [Only read]
an.width: Integer [Only read] - Canvas size of width
an.height: Integer [Only read] - Canvas size of height
an.fps: Integer [Only read]
an.canvas: Object HTMLCanvasElement [Only read] - Canvas object
an.context: Object CanvasRenderingContext2D [Only read] - Canvas context object
an.frameCounter: Integer [Only read] - Number iteration of current frame 
an.errorDrawframe: String [Only read] - получает сообщение о ошибке
an.isPlaying: Boolian [Only read] - проигруется анимация в текущий момент времени
an.isFiltering: Boolian [Only read]
an.loop: String [Only read]
an.fullScreen: Boolian [Only read]
an.autoStart: Boolian [Only read]
an.autoClear: Boolian [Only read]
an.saveRestore: Boolian [Only read]
an.enableEventClick: Boolian [Only read]
an.enableEventMousemove: Boolian [Only read]
an.enableEventKeys: Boolian [Only read]

// events
an.onFrame: Function [Only write]
an.onFrameBefore: Function [Only write]
an.onFrameAfter: Function [Only write]
an.onClick: Function [Only write]
an.onMousemove: Function [Only write]
an.onKeyup: Function [Only write]
an.onKeydown: Function [Only write]

an.eventMousemove: Object {x: 0, y: 0} [Only read] - Mouse position after run, if enabled config 'enableEventMousemove' 
an.eventClick: Object {x: 0, y: 0} [Only read] - Mouse position after click, if enabled config 'enableEventClick'
an.eventKeyup: Object [Only read] - get a event object after key down, if enabled config 'enableEventKeys'
an.eventKeydown: Object  [Only read]- get event object after key up, if enabled config 'enableEventKeys'
```

### Methods
```
an.render (stageName: String) - Start render and play. Renders a scene assignments
an.renderStage (stageName: String) - Put scenes of stage into timeline

an.play () - Start play animation
an.stop () - Stop play animation

an.scene (sceneObject: Object) - Add new sceneObject
an.stage (stageName: String, sceneObject: Object)
an.createSceneObject (): Object

an.clear () - Clear canvas area
an.clearScene () - Remove all scenes and clears the canvas for render a new stage

an.resizeCanvas (width: Integer, height: Integer) - Resize canvas element to full screen mode, or by width-height
an.imageLoader (images: Object) - Loading Resource Image.

an.point (x, y): Object {x: 0, y: 0}
an.rectangle (x, y, width, height): Array

an.hitTest(rectangle: Array); - Проверка клика в области rectangle. Рек. исп. в onClick после события mouseClick
an.hitTestPoint(rectangle: Array, point: Object); - Проверка point в области rectangle

an.imageLoader (imgs:Object, callback): String
an.image (name): Array|Object

an.backgroundColor ()

an.addFrame (callback, index: Integer): Integer
an.removeFrame (index: Integer)

an.toString (): String
```


### Extension inside of context (CanvasRenderingContext2D) object
```
an.context.rectRound(x, y, width, height, radius)
an.context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
an.context.shadow()
an.context.clearShadow()
```


## An.Util
```
An.Util.cloneObject (object: Object): Object - Cloned object
An.Util.mergeObject (objectBase: Object, object: Object): Object - Merge object into objectBase. Object objectBase will be modified!
An.Util.rand (min: Integer, max: Integer): Integer - Returns a random integer between min, max, unless specified from 0 to 100
An.Util.randColor (): String - Random color. Returns a string HEX format color.
An.Util.degreesToRadians (deg: Integer): Integer - Converts degrees to radians
An.Util.radiansToDegrees (rad: Integer): Integer - Converts radians to degrees
An.Util.objectLength (object: Object): Integer - Calculate the number of items in a "object"
An.Util.distanceBetween (point1: Object, point2: Object): Integer - Calculate the distance between points
An.Util.getMouseElement (element: Object, event: Object): Object - Returns the coordinates of the mouse on any designated element
An.Util.getMouseCanvas (canvas: Object, event: Object): Object - Returns the coordinates of the mouse on canvas element
```


## Extensions Graphic
```
Graphic.shape (points, color, fill, closePath, lineWidth) 
Graphic.rect (x, y, width, height, color, fill)
Graphic.rectRound (x, y, width, height, radius, color, fill)
Graphic.circle (x, y, radius, color, fill) 
Graphic.linePoints (point1, point2, lineWidth, color)
Graphic.lineWidth (x, y, width, lineWidth, color)
Graphic.lineHeight (x, y, height, lineWidth, color)
```


## Extensions Text
```
Text.font
Text.textAlign
Text.textBaseline
Text.direction
Text.lineWidth

Text.write (x, y, label, color, fill)
```


## Extensions Event
```
Event.addClick (callback: Function, index: Integer)
Event.removeClick (index: Integer)
Event.addRectClick (rectangle: Array, callback: Function) - Add a callback for event click on a certain area: rectangle = [x, y, width, height]
Event.removeRectClick (rectangle: Array) - Remove the callback event click appointed above by this.addEventClick, specific area: rectangle = [x, y, width, height]
Event.addKeydown (keyCode: Integer, callback: Function) - Add callback for event "keydown" by "keyCode"
Event.removeKeydown (keyCode: Integer)
Event.addKeyup (keyCode: Integer, callback: Function) - Add callback for event "keyup" by "keyCode"
Event.removeKeyup (keyCode: Integer)
```


# Constructor and options

Constructor can accept 4 parameters

```js
var an = An(selector, width, height, fps)
```


The second variant specify the advanced settings, send as a single parameter `object`

> option required: selector, width and height.

```js
var option = {
    // canvas settings
    selector: 'canvas#canvas',
    width: 600,
    height: 400,
    fps: 30,

    // events
    onFrame: null,
    onFrameBefore: null,
    onFrameAfter: null,
    onClick: null,
    onMousemove: null,
    onKeyup: null,
    onKeydown: null,

    // functionality
    loop: An.LOOP_ANIMATE,
    fullScreen: false,
    autoStart: true,
    autoClear: true,
    saveRestore: false,

    // enable events by types
    enableEventClick: true,
    enableEventMousemove: false,
    enableEventKeys: false,
}
var an = An(options)
```


# Scenes
```
var sceneObject = {
    hide:false,
    index:1,
    width:100,
    runner:function(ctx, frameCounter){
      an.graphic.developerPanel();
    }
};

// add one scene
an.scene(sceneObject);

// add two scene
an.scene({
    hide:false,
    index:1,
    runner:function(ctx, frameCounter){
        ctx.fillStyle = '#DD00FF';
        ctx.fillRect(0,50,this.width,30);
        this.width ++;
    }
});

// or
an.scene(function(ctx, frameCounter){
    ctx.fillStyle = '#DD00FF';
    ctx.fillRect(0,50,this.width,30);
    this.width ++;
});

// start animation
an.render();
```



# Stages
```
an.stage('home', {
    index: 1,
    runner: function (ctx, frameCounter) {
        ...
    }
});

an.stage('main',{
    index:1,
    runner: function (ctx, frameCounter) {
        ...
    }
});
// or function as method runner
an.stage('page', function (ctx, frameCounter) {
    ...
});

an.render('home');
```


# Work with Events

#### Обработка событий устанавлевается в опциях при создании экземпляра:
```
{
enableEventClick: true,      // оброботка onClick; пишится в свойство eventClick;
enableEventMousemove: false, // оброботка onMousemove; пишится в eventMousemove;
enableEventKeys: false       // оброботка onKeydown и onKeyup; пишится в eventKeydown или eventKeyup;
}
```

При сробатывании события происходит запись в свойства по типам

```
an.eventClick = {x: 0, y: 0};
an.eventMousemove = {x: 0, y: 0};
an.eventKeyup = null|KeyEvent;
an.eventKeydown = null|KeyEvent;
```


#### Event mouse 'onClick'


```
an.onClick = function (point) {

    var rectBtn = an.rectangle(350, 300, 100, 30);
    
    // point                          // {x: , y: }
    an.hitTest(rectBtn);              // bool
    an.hitTestPoint(rectBtn, point);  // bool
},
```


#### Event mouse 'onMousemove'
```
an.onMousemove = function (point) {
    console.log('Mouse X: ' + point.x + ' Mouse Y: ' + point.y);
}

an.onFrame = function (ctx, frameCounter) {
    console.log('Last click X: ' + an.eventClick.x + ' Mouse Y: ' + an.eventClick.y);
    console.log('Mouse X: ' + an.eventMousemove.x + ' Mouse Y: ' + an.eventMousemove.y);
}
```



#### Event mouse 'keydown' and 'keyup'
```
an.Event.addKeydown(37, function(){gotoLeft = true});
an.Event.addKeyup(37, function(){gotoLeft = false});

an.Event.addKeydown(39, function(){gotoRight = true});
an.Event.addKeyup(39, function(){gotoRight = false});

an.Event.addKeydown(38, function(){gotoUp = true});
an.Event.addKeyup(38, function(){gotoUp = false});
```




# Extension

Create Extension weary simple: example - file 'an.extension.shapes.js'

```
An.Extension(function(root){

    root.shape = function(name){
        console.log(name);
    };
    
});

// and include after main script
// Use:

var an = new An(params);

an.shape('Frodo');
```





# Templates

### Extension template
```
/**
 * An script extension
 */
An.Extension(function(self) {

    /**
     * @type An self
     * @type CanvasRenderingContext2D self.context
     */

    if (!(this instanceof An) || !(self instanceof An))
        return;

    var ext = {
        name: '__You_Extension__'
    };

    ext.m = function(){};

    self[ext.name] = ext;
});
```


### Script full template
```
(function(window, An){

    console.clear();
    console.log("Loaded: Demo");

    var an = new An({
        selector: "canvas#canvas",
        width: 600,
        height: 400,
        fps: 30,

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
        enableEventMouseMovie: false,
        enableEventKeys: false
    });

    var Dm = {};

    Dm.onClick = function(point){};
    Dm.onFrame = function(ctx, frameCounter){};

    an.scene(function(ctx){
        ctx.fillStyle = '#1A1A52';
        ctx.fillRect(50, 200, 20, 20);
    });

    an.onClick = Dm.onClick;
    an.onFrame = Dm.onFrame;
    an.render();

})(window, An);
```


