


// ---------------------------------------------------------------------------
// -- Оптимизация. Кеширование или фиксация конечного результата анимации, сохранение и отображение в виде изображеня

var Dm = {};

// in loop

if (Dm.imagedata) {
    ctx.putImageData(Dm.imagedata, 0, 0);
} else {

    Dm.radian += 0.15;

    // animate...

    if (Dm.radian > Math.PI * 2) {
        Dm.radian = 0;
        Dm.imagedata = ctx.getImageData(0, 0, an.width, an.height);
    }
}

// in loop end



// ---------------------------------------------------------------------------
// -- getImageData

ctx.fillStyle = "red";
ctx.fillRect(10,10,100,40);
ctx.fillStyle = "green";
ctx.globalAlpha = "0.5";
ctx.fillRect(90,30,50,50);

var Pixel1 = ctx.getImageData(10,10,140,80);

ctx.putImageData(Pixel1,200,200,80,20,50,50); // отображаем только зеленый квадрат

// -- getImageData

var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.fillStyle="red";
ctx.fillRect(10,10,50,50);

function copy()
{
    var imgData=ctx.getImageData(10,10,50,50);
    ctx.putImageData(imgData,10,70);
}





// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --







// ---------------------------------------------------------------------------
// --



