# Animation JS script

The script implements a control HTML5 element canvas.
Simplified realization of animation or static graphs, and some event-control model for "click", "mousemove", "keydown" and "keypress"







## Constructor
```
var an = An({option})
```






### Constructor Options:
```js
{
    selector:null,
    width:null,
    height:null,
    fps:0,
    autoStart:true,
    autoClear:true,
    enableEventClick:true,
    enableEventMouseMovie:false,
    enableEventKeys:false,
}
```







## Properties:
```
version:    '1.0.0',
selector:   null,
width:      0,
height:     0,
fps:        null,
canvas:     null,
context:    null,
frame:      0,
graphic:    {},
image:      {},
glob:       {},
options:    {},
mouse:      { x:0, y:0 },
mouseClick: { x:0, y:0 },
keydownCode:null,
keyupCode:  null,
lists:  	{stages:{},events:[],scenes:[],scenesTemp:[]},
```








## Methods:

### Control methods

#### scene(obj)
#### stage(name, obj)
#### applyStage(name, clear)
#### render([name])
#### stop() [not tested]
#### play() [not tested]
#### clear()
#### clearStage()
#### resizeCanvas()


### Events methods

#### addEventKeydown(keyCode, callback)
#### addEventKeyup(keyCode, callback)
#### addEventClick(rectangle, callback)
#### removeEventClick(rectangle)
#### imageLoader(object)


### Graphics methods

#### graphic.developerPanel(options)
```
{
	bgColor:'#DDDDDD',
	textColor:'#000000',
	margin:{x:0,y:0},
	padding:{x:0,y:0},
}
```

### Utilites methods
``` 
// static call
AnUtil.method()

// alternative call
an.u.method()
```
#### objClone(obj)
#### objMerge(obj1, obj2)
#### objLength(obj)
#### rand(min,max)
#### randColor()
#### degreesToRadians(deg)
#### radiansToDegrees(rad)
#### distanceBetween(p1,p2)
#### getMouseElementelement, event)
#### getMouseCanvas(canvas, event)







## Methods added to object 'context' of element canvas:

#### context.rectRound(x, y, width, height, radius)

#### context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)

#### context.shadow()

#### context.clearShadow()









## Exemple:

### Created base statment
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

#### Event mouse 'click'
Event ...
```
```


#### Event mouse 'mousemove'
Event ...
```
```


#### Event mouse 'keydown'
Event ...
```
```


#### Event mouse 'keyup'
Event ...
```
```


