# An JS script

The script implements a control HTML5 element canvas.
Simplified realization of animation or static graphs, and some event-control model for "click", "mousemove", "keydown" and "keypress"


## Constructor
```
var an = An({option})
```

### Constructor Options:
```
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



## Methods:

#### An::




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



