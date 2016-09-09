(function (window) {

    /**
     * @namespace AjaxRequest
     */
    var AjaxRequest = window.AjaxRequest = {


        version:1,


        open:function(params){


            "use strict";


            var obj = {};


            obj.paramsDefault =  {

                url:document.location,
                data:'',
                async:true,
                method:'GET',
                timeout:0,
                headers:{},
                username:'',
                password:'',
                response:'text',
                contentType:'application/x-www-form-urlencoded; charset=utf-8',

                onComplete: function(e){},
                onProgress: function(e){},
                onTimeout: function(e){},
                onSuccess: function(e){},
                onBefore: function(e){},
                onChange: function(e){},
                onError: function(e){},
                onAbort: function(e){},
                onStart: function(e){}

            };


            obj.params = AjaxRequest.objectMerge(params,obj.paramsDefault);


            obj.xhr = null;


            obj.send = function(params){

                var xhr = obj.xhr = new XMLHttpRequest();
                var dataString = '';
                var dataSend = null;

                params = AjaxRequest.objectMerge(params,obj.params);
                params.headers['Content-Type'] = params.contentType;

                if((params.method == 'GET' || params.method == 'HEAD') && params.data)
                    dataString = '?' + AjaxRequest.encodeData(params.data);
                else {
                    if(typeof params.data === 'object' && params.data instanceof FormData)
                        dataSend = params.data;
                    else dataSend = AjaxRequest.encodeData(params.data);
                }

                xhr.open(params.method, params.url+dataString, params.async, params.username, params.password);
                xhr.timeout = params.timeout;

                if(!(params.data instanceof FormData)) {
                    for(var k in params.headers)
                        xhr.setRequestHeader(k, params.headers[k]);
                }

                params.onBefore(xhr);

                xhr.onreadystatechange = function(event){
                    params.onChange(xhr.readyState, xhr.status, xhr, event);
                };
                xhr.onloadstart = function(event){
                    params.onStart(xhr, event);
                };
                xhr.onprogress = function(event){
                    params.onProgress(xhr, event);
                };
                xhr.onabort = function(event){
                    params.onAbort(xhr, event);
                };
                xhr.onerror = function(event){
                    params.onError(xhr.statusText, xhr, event);
                };
                xhr.onload = function(event){
                    if(xhr.status > 400) {
                        params.onError(xhr.statusText, xhr, event);
                    }
                    else {
                        var response = xhr.responseText;
                        if(params.response == 'xml') response = xhr.responseXML;
                        if(params.response == 'json') response = JSON.parse(response);
                        params.onSuccess(response, xhr.status, xhr, event);
                    }
                };
                xhr.ontimeout = function(event){
                    params.onTimeout(xhr, event);
                };
                xhr.onloadend = function(event){
                    var response = xhr.responseText;
                    if(params.response == 'xml') response = xhr.responseXML;
                    if(params.response == 'json') response = JSON.parse(response);
                    params.onComplete(xhr.status, response, xhr, event);
                };

                xhr.send(dataSend);

            };


            return obj;

        },


        /**
         *
         * @param url
         * @param data
         * @param callback
         * @param response
         */
        get:function(url, data, callback, response){
            var params = {
                url:url,
                data:data || '',
                method:'GET',
                response:response || 'html',
                contentType:'text/html; charset=utf-8',
                onComplete:callback
            };
            var ajax = new AjaxRequest.open(params);
            ajax.send();
            return ajax.xhr;
        },


        post:function(url, data, callback, response){
            var params = {
                url:url,
                data:data || '',
                method:'POST',
                response:response || 'html',
                onComplete:callback
            };
            var ajax = new AjaxRequest.open(params);
            ajax.send();
            return ajax.xhr;
        },


        /**
         * getAllResponseHeaders();
         * getResponseHeader("header-name")
         */
        head:function(url, data, callback, headers){
            var callbackResult = function(status, response, xhr, event){
                callback(status,xhr);
            }
            var params = {
                url:url,
                data:data || '',
                method:'HEAD',
                headers:headers || false,
                onComplete:callbackResult
            };
            var ajax = new AjaxRequest.open(params);
            ajax.send();
            return ajax.xhr;
        },


        load:function(url, data, callback, method, contentType){
            var params = {
                url:url,
                data:data || '',
                method: method || 'GET',
                contentType:contentType || 'text/html; charset=utf-8',
                onComplete:callback
            };
            var ajax = new AjaxRequest.open(params);
            ajax.send();
            return ajax.xhr;
        },

        /**
         *
         * @param form      nodeElement
         * @param data      object() with parameters keys: data, url, method, contentType
         * @param callback  Function
         * @returns {null|*}
         */
        form:function(form, data, callback){
            if(typeof form === 'object' && form.nodeName == 'FORM'){

                var params = data || {};
                var paramsAppend = params.data || {};

                params.url = params.url || form.action || document.location;
                params.method = params.method || form.method || 'POST';
                params.contentType = params.contentType || form.enctype;
                params.data = new FormData(form);

                for(var key in paramsAppend)
                    params.data.append(key,paramsAppend[key]);

                if(callback) params.onComplete = callback;

                var ajax = new AjaxRequest.open(params);
                ajax.send();
                return ajax.xhr;
            }
            else
                console.log('ERROR! Element not nodeName = FORM!');
        },


        script:function(url, data, callback){
            var dataString = '';

            if(callback) {
                if(url.indexOf('?') >= 0)
                    url += '&callback=' + callback.name;
                else
                    url += '?callback=' + callback.name;
            }

            if(data) {
                dataString = AjaxRequest.encodeData(data);
                if(url.indexOf('?') >= 0)
                    url += '&' + dataString;
                else
                    url += '?' + dataString;
            }

            var script = document.querySelector('script[src="' + url + '"]');
            if(script)
                document.body.removeChild(script);

            script = document.createElement('script');
            script.setAttribute('type', 'application/javascript');
            script.setAttribute('src', url);

            document.body.appendChild(script);
        },


        message:function(element,data,append){},


        jsonp:function(url, callbackSuccess, callbackError){},


        /**
         * обединение обектов в один, к full добавляются свойства add
         * @param add
         * @param full
         * @returns {{}}
         */
        objectMerge:function(add,full){
            if(typeof full !== 'object') return {};
            if(typeof add !== 'object') return full;
            var params = {};
            for(var key in full) {
                if(add[key]) params[key] = add[key];
                else params[key] = full[key];
            }
            return params;
        },


        /**
         *
         * @param data
         * @returns {*}
         */
        encodeData:function(data){
            if(typeof data === 'string') return data;
            if(typeof data !== 'object') return '';
            var convertData = [];
            Object.keys(data).forEach(function(key){
                convertData.push(key+'='+encodeURIComponent(data[key]));
            });
            return convertData.join('&');
        },


        parseUrl:function(url){
            url = url || document.location;
            var params = {};
            var parser = document.createElement('a');
            parser.href = url;

            params.protocol = parser.protocol;
            params.host = parser.host;
            params.hostname = parser.hostname;
            params.port = parser.port;
            params.pathname = parser.pathname;
            params.hash = parser.hash;
            params.search = parser.search;
            params.get = AjaxRequest.parseGet(parser.search);

            return params;
        },


        parseGet:function(url){
            url = url || document.location;
            var params = {};
            var parser = document.createElement('a');
            parser.href = url;

            if(parser.search.length > 1){
                parser.search.substr(1).split('&').forEach(function(part){
                    var item = part.split('=');
                    params[item[0]] = decodeURIComponent(item[1]);
                });
            }

            return params;
        },


        formData:function (form, asObject){
            var obj = {}, str = '';
            for(var i=0;i<form.length;i++){
                var f = form[i];
                if(f.type == 'submit' || f.type == 'button') continue;
                if((f.type == 'radio' || f.type == 'checkbox') && f.checked == false) continue;
                var fName = f.nodeName.toLowerCase();
                if(fName == 'input' || fName == 'select' || fName == 'textarea'){
                    obj[f.name] = f.value;
                    str += ((str=='')?'':'&') + f.name +'='+encodeURIComponent(f.value);
                }
            }
            return (asObject == true)?obj:str;
        }


    };

    if (!window.Aj) {
        /**
         * Alias for AjaxRequest.open
         * @namespace Aj
         */
        window.Aj = AjaxRequest.open;
    }

    if (!window.AjGet) {
        /**
         * Alias for AjaxRequest.get
         * @namespace AjGet
         */
        window.AjGet = AjaxRequest.get;
    }

    if (!window.AjPost) {
        /**
         * Alias for AjaxRequest.post
         * @namespace AjPost
         */
        window.AjPost = AjaxRequest.post;
    }

    if (!window.AjHead) {
        /**
         * Alias for AjaxRequest.head
         * @namespace AjHead
         */
        window.AjHead = AjaxRequest.head;
    }

    if (!window.AjForm) {
        /**
         * Alias for AjaxRequest.form
         * @namespace AjForm
         */
        window.AjForm = AjaxRequest.form;
    }

    if (!window.AjLoad) {
        /**
         * Alias for AjaxRequest.load
         * @namespace AjLoad
         */
        window.AjLoad = AjaxRequest.load;
    }

    if (!window.AjScript) {
        /**
         * Alias for AjaxRequest.script
         * @namespace AjScript
         */
        window.AjScript = AjaxRequest.script;
    }

    if (!window.UtilEncode) {
        /**
         * Alias for AjaxRequest.script
         * @namespace AjScript
         */
        window.UtilEncode = AjaxRequest.encodeData;
    }

    if (!window.UtilParseUrl) {
        /**
         * Alias for AjaxRequest.parseUrl
         * @namespace UtilParseUrl
         */
        window.UtilParseUrl = AjaxRequest.parseUrl;
    }


    if (!window.UtilParseGet) {
        /**
         * Alias for AjaxRequest.parseGet
         * @namespace UtilParseGet
         */
        window.UtilParseGet = AjaxRequest.parseGet;
    }


    if (!window.UtilFormData) {
        /**
         * Alias for AjaxRequest.formData
         * @namespace UtilFormData
         */
        window.UtilFormData = AjaxRequest.formData;
    }

})(window);