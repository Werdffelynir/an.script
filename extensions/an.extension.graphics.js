/**
 * Graphics Dynamic Interface
 *
 * @version 0.0.1
 * @author Werd
 */
An.Extension(function(an){



    an.graphic.backgroundColor = function(color){
        an.properties.context.beginPath();
        an.properties.context.rect(0, 0, an.width, an.height);
        an.properties.context.fillStyle = color;
        an.properties.context.fill();
        an.properties.context.closePath();
    };



});

