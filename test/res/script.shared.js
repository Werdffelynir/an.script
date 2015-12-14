(function(window) {

	var Shared = function(prefix, typeStorage){
		return new Shared.controller.init(prefix, typeStorage);
	};

    /**
     * @type {{prefix: string, length: number, storage: Storage, init: Function, has: Function, get: Function, set: Function, remove: Function, clear: Function, toString: Function}}
     */
	Shared.controller = {

        prefix: '',
        length: 0,
        storage: null,

        // Constructor
        init: function(_prefix, typeStorage) {
            if(typeof _prefix == 'string' && _prefix.length > 0) this.prefix = _prefix;

            if(typeStorage === 'session')
                this.storage = window.sessionStorage;
            else
                this.storage = window.localStorage;

            this.length = this.storage.length;
        },

        // If has  data with name 'item' in Storage return true
        has: function(item) {
        	return ( this.storage !== null && this.storage.getItem(this.insideAddPrefix(item)) ) ? true : false; },

        // Get data by key 'item' return value or null
        get: function(item) {
        	return (this.has(item)) ? this.storage.getItem(this.insideAddPrefix(item)) : null; },

        // Save string data with name 'item' to Storage
        set: function(item, data) {
        	return this.storage.setItem(this.insideAddPrefix(item), data); },

        // Save object data as JSON string with name 'item' to Storage
        getObject: function(item) {
            return JSON.parse(this.storage.getItem(this.insideAddPrefix(item))); },

        // Get data by key 'item', convert JSON to Object and return
        setObject: function(item, data) {
            var json = JSON.stringify(data);
            this.storage.setItem(this.insideAddPrefix(item), json); },

        // Remove 'item' in localStorage
        remove: function(item) {
        	return (this.has(item)) ? this.storage.removeItem(this.insideAddPrefix(item)) : false; },

        // Clear all Storage
        clear: function() {
        	return this.storage.clear(); },

        insideAddPrefix: function(item) {
            return this.prefix+'_'+item; },

        toString: function() {
            return 'Shared'; }

	};

    Shared.controller.init.prototype = Shared.controller;
    window.Shared = Shared;

})(window);