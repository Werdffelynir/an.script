<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="grid.css">
    <style>
        #upload{
            width: 200px;
            height: 200px;
            border: 5px dashed #92f292;
        }
        #upload-result{}
        #upload-result img{
            width: 100%;
        }

    </style>
</head>
<body>

<div class="tbl">
    <div class="tbl_cell">
        <div id="upload"></div>
    </div>
    <div class="tbl_cell">
        <div id="upload-result"></div>
    </div>
</div>




<script>

    var upload = document.querySelector('#upload');
    var uploadResult = document.querySelector('#upload-result');

    function onDocumentDrag(event) {
        event.preventDefault();
    }

    function onDocumentDrop(event){
        event.preventDefault();

        var file = event.dataTransfer.files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
            var image = document.createElement('img');
            image.onload = function () {
                uploadResult.textContent = '';
                uploadResult.appendChild(image);
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function onDocumentSave(event) {
        event.preventDefault();
        var fd = new FormData();
        var data =
        fd.append("file", file_data);
    }

    upload.addEventListener('drop', onDocumentDrop, false);
    upload.addEventListener('dragover', onDocumentDrag, false);
    upload.addEventListener('dragleave', onDocumentDrag, false);
</script>
</body>
</html>