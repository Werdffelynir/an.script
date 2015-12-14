# Animation JS script

The script implements a control HTML5 element canvas.
Simplified realization of animation or static graphs, and some event-control model for "click", "mousemove", "keydown" and "keypress"


## Constructor. parameters

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
var an = new An({selector: '#canva'
    , width: 800
    , height: 400
    , fps: 30
    , autoStart: true
    , autoClear: true
    , enableEventClick: true
    , enableEventMouseMovie: false
    , enableEventKeys: false
});
```
option required: selector, width and height.


## Properties:
```js
version:string

selector:string

width:integer

height:integer

fps:integer

canvas:object

context:object

frame:integer

image:object

graphic:object

glob:object

options:object

mouse:object { x:0, y:0 }

mouseClick:object { x:0, y:0 }

keydownCode:integer

keyupCode:integer
```


## Methods:

### Control methods
```js
scene(operation:object||function):An

stage(name:string, obj:object):An

applyStage(name:string [, clear:bool]):void

render([name]):void

stop():void

play():void

clear():void

clearStage():void

resizeCanvas():void
```


### Events methods
```js
addEventKeydown(keyCode:int, callback:function):void

addEventKeyup(keyCode:int, callback:function):void

addEventClick(rectangle:array, callback:function):void

removeEventClick(rectangle:array):void

imageLoader(images:object):void
```


### Graphics methods

#### graphic.debugPanel(options)
```
options = {
      bgColor:'#DDDDDD'
    , textColor:'#000000'
    , margin:{x:0,y:0}
    , padding:{x:0,y:0}
    , countElements:true
    , countEvents:true
    , countScenes:true
    , countStages:true
    , developerPanelLoaded:6
};
```

### Utilities methods

``` 
// static call
An.Util.method()

// instance call
an.u.method()
```

```js
objClone(obj:object):object

objMerge(objectBase:object, object:object):object

objMergeNotExists(objectBase:object, object:object):object

objMergeOnlyExists(objectBase:object, object:object):object

objLength(obj:object):object

rand(min:int, max:int):int

randColor():string

degreesToRadians(deg:int):int

radiansToDegrees(rad:int):int

distanceBetween(point1:object, point2:object):int

getMouseElement(element:object, event:object):object

getMouseCanvas(canvas:object, event:object):object
```


## Methods added to object 'context' of element canvas:

```js
context.rectRound(x, y, width, height, radius)

context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)

context.shadow()

context.clearShadow()
```


## Extension 

Create Extension weary simple: 
file 'an.extension.shapes.js'

```
An.Extension(function(root){

    root.shape = function(name){
        console.log(name);
    };
    
});
```
and include after main script

Use:
```
var an = new An(params);

an.shape('Frodo');
```


## Example:

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

### Work with scenes
```
an.scene({
    index:1,
    width:100,
    runner:function(ctx){
        an.graphic.developerPanel();
    }
});
an.scene({
    index:1,
    runner:function(ctx){
        ctx.fillStyle = '#DD00FF';
        ctx.fillRect(0,50,this.width,30);
        this.width ++;
    }
});

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
