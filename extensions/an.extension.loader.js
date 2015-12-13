/**
 * Resources loader with events progress, error, complete
 * load types - image, audio, video, script, style
 *
 videoSizeWidth videoSizeHeight videoType
 * @version 0.0.1
 * @author Werd
 */
An.Extension(function(root) {

    "use strict";

    var loader = {};
    loader.total = 0;
    loader.iterator = 0;
    loader.options = null;
    loader.defaultOptions = {
        image: null,
        audio: null,
        video: null,
        script: null,
        style: null,
        audioType: "audio/mpeg",
        videoType: "video/mp4",
        videoSizeWidth: root.width||600,
        videoSizeHeight: root.height||450,
        progress: new Function,
        error: new Function,
        complete: new Function
    };
    loader.resourcesLibrary = [];

    loader.addResourceItems = function (type, obj) {
        for (var n in obj)
            loader.resourcesLibrary.push({type: type, name: n, url: obj[n], source: null});
    };

    root.loader = loaderPlugin;
    root.loader.resources = null;
    root.loader.onProgress = null;
    root.loader.onComplete = null;
    root.loader.onError = null;

    function loaderPlugin(options) {
        loader.options = options = An.Util.objMerge(loader.defaultOptions, options);

        root.loader.onError = options.error;
        root.loader.onProgress = options.progress;
        root.loader.onComplete = options.complete;

        if (options.image !== null && typeof options.image === 'object')
            loader.addResourceItems('image', options.image);
        if (options.audio !== null && typeof options.audio === 'object')
            loader.addResourceItems('audio', options.audio);
        if (options.video !== null && typeof options.video === 'object')
            loader.addResourceItems('video', options.video);
        if (options.script !== null && typeof options.script === 'object')
            loader.addResourceItems('script', options.script);
        if (options.style !== null && typeof options.style === 'object')
            loader.addResourceItems('style', options.style);

        loader.total = loader.resourcesLibrary.length;
        loader.resourcesLibrary.forEach(function (item, index) {
            switch (item.type) {
                case 'image':
                    loader.loadImage(item, index);
                    break;
                case 'script':
                    loader.loadScript(item, index);
                    break;
                case 'audio':
                    loader.loadAudio(item, index);
                    break;
                case 'video':
                    loader.loadVideo(item, index);
                    break;
                case 'style':
                    loader.loadStyle(item, index);
                    break;
            }
        });
    }

    loader.total = 0;
    loader.iterator = 0;
    loader.loadImage = function (item, index) {
        var elem = document.createElement('img');
        elem.name = item.name;
        elem.src = item.url;
        elem.onerror = function (e) {
            root.loader.onError.call(root, e, item);
        };
        elem.data = {item: item,index: index};
        elem.onload = loader.onLoadEvent;
    };
    loader.loadScript = function (item, index) {
        var elem = document.createElement('script');
        elem.name = item.name;
        elem.src = item.url;
        elem.type = 'text/javascript';
        elem.onerror = function (e) {
            root.loader.onError.call(root, e, item);
        };
        elem.data = {item: item,index: index};
        elem.onload = loader.onLoadEvent;
        document.head.appendChild(elem);
    };
    loader.loadStyle = function (item, index) {
        var elem = document.createElement('link');
        elem.name = item.name;
        elem.href = item.url;
        elem.rel = "stylesheet";
        elem.onerror = function (e) {
            root.loader.onError.call(root, e, item);
        };
        elem.data = {item: item,index: index};
        elem.onload = loader.onLoadEvent;
        document.head.appendChild(elem);
    };
    loader.loadAudio = function (item, index) {
        var audio = document.createElement('audio');
        audio.name = item.name;
        audio.style.display = 'none';
        var source = document.createElement('source');
        source.src = item.url;
        source.type = loader.options.audioType;
        audio.appendChild(source);
        audio.onerror = function (e) {
            root.loader.onError.call(root, e, item);
        };
        audio.data = {item: item,index: index};
        audio.onloadstart = loader.onLoadEvent;
        document.body.appendChild(audio);
    };
    loader.loadVideo = function (item, index) {
        var video  = document.createElement('video');
        video.name = item.name;
        video.width = loader.options.videoSizeWidth;
        video.height = loader.options.videoSizeHeight;
        video.style.display = 'none';
        var source = document.createElement('source');
        source.src = item.url;
        source.type = loader.options.videoType;
        video.appendChild(source);
        video.onerror = function (e) {
            root.loader.onError.call(root, e, item);
        };
        video.data = {item: item,index: index};
        video.onloadstart = loader.onLoadEvent;
        document.body.appendChild(video);
    };
    loader.onLoadEvent = function (event) {
        var item = this.data.item,
            index = this.data.index;
        loader.resourcesLibrary[index].source = this;
        loader.resourcesLibrary[index].total = loader.total;
        loader.resourcesLibrary[index].index = index;
        loader.iterator ++;
        root.loader.onProgress.call(root, event, loader.total, index, item);
        if(loader.iterator == loader.total)
            root.loader.onComplete.call(root, loader.convertToObject());
        //else
    };
    loader.convertToObject = function () {
        var _obj = Object.create({});
        for(var i = 0; i < loader.total; i ++){
            if(_obj[loader.resourcesLibrary[i].type] == undefined)
                _obj[loader.resourcesLibrary[i].type] = Object.create({});
            _obj[loader.resourcesLibrary[i].type][loader.resourcesLibrary[i].name] = loader.resourcesLibrary[i];
        }
        return root.loader.resources = _obj;
    };
});