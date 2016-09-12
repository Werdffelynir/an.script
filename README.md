# Animation JS script

The script implements a control HTML5 element canvas.
Simplified realization of animation or static graphs, and some event-control model for "click", "mousemove", "keydown" and "keypress"


### Map of script

```
An. static and constants
    version: String
    LOOP_TIMER: String
    LOOP_ANIMATE: String
    Extension: Function - Add extensions in loader
    @private internalExtensions: Array - Storage of extensions

An.prototype. and instance

    # Properties
    width: Integer - Canvas size of width
    height: Integer - Canvas size of height
    canvas: Object HTMLCanvasElement - Canvas object
    context: Object CanvasRenderingContext2D - Canvas context object
    frameCounter: Integer - Number iteration of current frame 
    mouse: Object {x: 0, y: 0} - Mouse position after run, if enabled config 'enableEventMouseMovie' 
    mouseClick: Object {x: 0, y: 0} - Mouse position after click, if enabled config 'enableEventClick'
    keydownCode: Integer - get a keyCode after key down, if enabled config 'enableEventKeys'
    keyupCode: Integer - get a keyCode after key up, if enabled config 'enableEventKeys'
    errorDrawframe: String 
    isPlaying: Boolian
    @private isFiltering: Boolian
    @private setTimeoutIterator: Integer 
    @private requestAnimationFrameIterator: Integer 
    @private lists: Object
    @private options: Object

    # Methods
    play () - Start play animation
    stop () - Stop play animation
    scene (sceneObject: Object) - Add new sceneObject
    stage (stageName: String, sceneObject: Object)
    clear () - Clear canvas area
    clearScene () - Remove all scenes and clears the canvas for render a new stage
    render (stageName: String) - Start render and play. Renders a scene assignments
    resizeCanvas (width: Integer, height: Integer) - Resize canvas element to full screen mode, or by width-height
    addEventKeydown (keyCode: Integer, callback: Function) - Add callback for event "keydown" by "keyCode"
    addEventKeyup (keyCode: Integer, callback: Function) - Add callback for event "keyup" by "keyCode"
    addEventClick (rectangle: Array, callback: Function) - Add a callback for event click on a certain area: rectangle = [x, y, width, height]
    removeEventClick ( rectangle: Array) - Remove the callback event click appointed above by this.addEventClick, specific area: rectangle = [x, y, width, height]
    imageLoader (images: Object) - Loading Resource Image.
    point (x, y): Object {x: 0, y: 0}
    rectangle (x, y, width, height): Array
    toString (): String
    debugPanel (options: Object)
    @private loopTimer
    @private loopAnimationFrame
    @private scenesFiltering
    @private internalDrawframe
    @private internalStagesToScenes


An.Util. Static methods
    cloneObject (object: Object): Object - Cloned object
    mergeObject (objectBase: Object, object: Object): Object - Merge object into objectBase. Object objectBase will be modified!
    rand (min: Integer, max: Integer): Integer - Returns a random integer between min, max, unless specified from 0 to 100
    randColor (): String - Random color. Returns a string HEX format color.
    degreesToRadians (deg: Integer): Integer - Converts degrees to radians
    radiansToDegrees (rad: Integer): Integer - Converts radians to degrees
    objectLength (object: Object): Integer - Calculate the number of items in a "object"
    distanceBetween (point1: Object, point2: Object): Integer - Calculate the distance between points
    getMouseElement (element: Object, event: Object): Object - Returns the coordinates of the mouse on any designated element
    getMouseCanvas (canvas: Object, event: Object): Object - Returns the coordinates of the mouse on canvas element
    
    
Inside extantion of context.
    context.rectRound(x, y, width, height, radius)
    context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
    context.shadow()
    context.clearShadow()
```



### Constructor. parameters

Constructor can accept 4 parameters

```js
var an = An(selector,width,height,fps)
```

The second variant specify the advanced settings, send as a single parameter `object`

```js
var an = An({option})
```


#### Constructor advance options:
```js
var an = new An({
    selector: 'canvas#canvas',
    width: 800,
    height: 400,
    fps: 30,
    onClick: null,
    onFrame: null,
    autoStart: true,
    autoClear: true,
    loop: 'animation',
    fullScreen: false,
    enableEventClick: true,
    enableEventMouseMovie: false,
    enableEventKeys: false,
    debugPanelSettings: false,
});
```
option required: selector, width and height.


### debugPanel(options)
```
options = {
    bgColor: '#DDDDDD',
    textColor: '#000000',
    margin: {x:0,y:0},
    padding: {x:0,y:0},
    countElements: true,
    countEvents: true,
    countScenes: true,
    countStages: true,
    developerPanelLoaded: 6
};
```


### Extension 

Create Extension weary simple: 
file 'an.extension.shapes.js'

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


# Examples:

### Created base
```
var params = {
    selector:'#canvas',
    width:800,
    height:500,
    fps:60,
};

var an = new An(params);
```

### sceneObject. Work with scenes
```
var sceneObject = {
    index:1,
    width:100,
    runner:function(ctx){
      an.graphic.developerPanel();
    }
};

// add one scene
an.scene(sceneObject);

// add two scene
an.scene({
    index:1,
    runner:function(ctx){
        ctx.fillStyle = '#DD00FF';
        ctx.fillRect(0,50,this.width,30);
        this.width ++;
    }
});

// start animation
an.render();
```


### Work with stages
```
an.stage('home',{
    index:1,
    runner:function(ctx){
        ...
    }
});
an.stage('main',{
    index:1,
    runner:function(ctx){
        ...
    }
});

an.render('home');
```


### Work with Events
Params An default:
```
enableEventClick:true,
enableEventMouseMovie:false,
enableEventKeys:false
```

#### Event mouse 'click'
Add event click and remove after clicked
```
var rectangle = [10,220,64,64];
an.addEventClick(rectangle, function(e,rectangle){
    console.log('one click');
    an.removeEventClick(rectangle);
});
```


#### Event mouse 'mousemove'
```
console.log('Mouse X: ' + an.mouse.x + ' Mouse Y: ' + an.mouse.y);
```


#### Event mouse 'keydown' and 'keyup'
Event ...
```


```
