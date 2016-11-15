<?php

if(!empty($_FILES)) {




}











?><!doctype html>
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
        <div id="upload-save">Upload Save</div>
    </div>
    <div class="tbl_cell">
        <div id="upload-result"></div>
    </div>
</div>




<script>

    var upload = document.querySelector('#upload');
    var uploadResult = document.querySelector('#upload-result');
    var uploadSave = document.querySelector('#upload-save');
    var currentFileReader = null;

    function onDocumentDrag(event) {
        event.preventDefault();
    }

    function onDocumentDrop(event){
        event.preventDefault();

        var file = event.dataTransfer.files[0];
        var reader = currentFileReader = new FileReader();

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
        var data = currentFileReader.result;
        fd.append("file", data);
        fd.append("name", 'file');


    }

    uploadSave.addEventListener('click', onDocumentSave, false);
    upload.addEventListener('drop', onDocumentDrop, false);
    upload.addEventListener('dragover', onDocumentDrag, false);
    upload.addEventListener('dragleave', onDocumentDrag, false);
</script>
</body>
</html>