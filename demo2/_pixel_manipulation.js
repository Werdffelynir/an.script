(function(window, An){

    console.clear();
    console.log("Loaded: Demo");

    var img = new Image();
    img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
    var canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 400;
    var ctx = canvas.getContext('2d');
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        img.style.display = 'none';
    };
    var color = document.getElementById('color');
    function pick(event) {
        var x = event.layerX;
        var y = event.layerY;
        var pixel = ctx.getImageData(x, y, 1, 1);
        var data = pixel.data;
        var rgba = 'rgba(' + data[0] + ',' + data[1] +
            ',' + data[2] + ',' + (data[3] / 255) + ')';
        color.style.background =  rgba;
        color.textContent = rgba;
    }
    canvas.addEventListener('mousemove', pick);

})(window, An);
