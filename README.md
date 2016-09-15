# Animation JS script

The script implements a control HTML5 element canvas.
Simplified realization of animation or static graphs, and some event-control model for "click", "mousemove", "keydown" and "keypress"


## Script Maps

```
// An. static and constants
    version: String
    LOOP_TIMER: String
    LOOP_ANIMATE: String
    Extension: Function - Add extensions in loader
    @private internalExtensions: Array - Storage of extensions


// An.prototype. and instance
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
    renderStage (stageName: String) - Put scenes of stage into timeline
    resizeCanvas (width: Integer, height: Integer) - Resize canvas element to full screen mode, or by width-height
    addEventKeydown (keyCode: Integer, callback: Function) - Add callback for event "keydown" by "keyCode"
    addEventKeyup (keyCode: Integer, callback: Function) - Add callback for event "keyup" by "keyCode"
    addEventClick (rectangle: Array, callback: Function) - Add a callback for event click on a certain area: rectangle = [x, y, width, height]
    removeEventClick ( rectangle: Array) - Remove the callback event click appointed above by this.addEventClick, specific area: rectangle = [x, y, width, height]
    imageLoader (images: Object) - Loading Resource Image.
    point (x, y): Object {x: 0, y: 0}
    rectangle (x, y, width, height): Array
    hitTest(rectangle: Array); - Проверка клика в области rectangle. Рек. исп. в onClick после события mouseClick
    hitTestPoint(rectangle: Array, point: Object); - Проверка point в области rectangle
    toString (): String
    debugPanel (options: Object)
    @private loopTimer
    @private loopAnimationFrame
    @private scenesFiltering
    @private internalDrawframe
    @private internalStagesToScenes


// An.Util. Static methods
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
    
    
// Inside extantion of context.
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

// or
an.scene(function(ctx){
    ctx.fillStyle = '#DD00FF';
    ctx.fillRect(0,50,this.width,30);
    this.width ++;
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

#### Event mouse 'onClick'
```
onClick: function (point) {

    var rectBtn = an.rectangle(350, 300, 100, 30);
    
    point                             // {x: , y: }
    an.hitTest(rectBtn);              // bool
    an.hitTestPoint(rectBtn, point);  // bool
},
```


#### Event mouse 'mousemove'
```
console.log('Mouse X: ' + an.mouse.x + ' Mouse Y: ' + an.mouse.y);
```


#### Event mouse 'keydown' and 'keyup'
Event ...
```


```


## KeyCode
```
Key	                Code
        
backspace	        8
tab	                9
enter	            13
shift	            16
ctrl	            17
alt	                18
pause/break	        19
caps lock	        20
escape	            27
page up	            33
page down	        34
end	                35
home	            36
left arrow	        37
up arrow	        38
right arrow	        39
down arrow	        40
insert	            45
delete	            46
0	                48
1	                49
2	                50
3	                51
4	                52
5	                53
6	                54
7	                55
8	                56
9	                57
a	                65
b	                66
c	                67
d	                68
e	                69
f	                70
g	                71
h	                72
i	                73
j	                74
k	                75
l	                76
m	                77
n	                78
o	                79
p	                80
q	                81
r	                82
s	                83
t	                84
u	                85
v	                86
w	                87
x	                88
y	                89
z	                90
left window key	    91
right window key	92
select key	        93
numpad 0	        96
numpad 1	        97
numpad 2	        98
numpad 3	        99
numpad 4	        100
numpad 5	        101
numpad 6	        102
numpad 7	        103
numpad 8	        104
numpad 9	        105
multiply	        106
add	                107
subtract	        109
decimal point	    110
divide	            111
f1	                112
f2	                113
f3	                114
f4	                115
f5	                116
f6	                117
f7	                118
f8	                119
f9	                120
f10	                121
f11	                122
f12	                123
num lock	        144
scroll lock	        145
semi-colon	        186
equal sign	        187
comma	            188
dash	            189
period	            190
forward slash	    191
grave accent	    192
open bracket	    219
back slash	        220
close braket	    221
single quote	    222
```