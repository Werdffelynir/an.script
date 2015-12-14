/**

dom(selector)
    Конструктор, принимает селектор. Выбраные елементы будут включены для обработки внутреними методами.
    Вернет объект

Свойства
    selector: ".ball"
    length: 1
    elements: NodeList

Методы
    one(index)
        вернет елемент по индексу index, или первый с выбраных
    all()
    children()
    parent()
    find(selector)
    first()
    last()
    next()
    prev()
    html(param)
    text(param)
    css(prop, param): undefined this
**/

/**
 * version 0.2.0
 * Конструктор принимает селектор, возвращает объект методов работы с елемен(том/тамы)
 */
function dom(selector)
{
    var privateController = {};

    var publicController = {

        selector:null,

        elements:[],

        length:0,

        /**
         * Системный
         * @param selector
         * @returns {publicController}
         */
        queryBySelector:function(selector)
        {
            if(selector === 'body' && document.body)
            {
                this.selector = 'body';
                this.elements[0] = document.body;
                this.length = 1;
            }
            else if(typeof selector === 'string')
            {
                this.selector = selector;
                this.elements = document.querySelectorAll(this.selector);
                this.length = this.elements.length;
            }
            else if(typeof selector === 'object' && selector instanceof HTMLCollection)
            {
                this.selector = null;
                for(var iHC = 0; iHC<selector.length; iHC++)
                    this.elements[iHC] = selector[iHC];

                this.length = selector.length;
            }
            else if(typeof selector === 'object' && selector.nodeType === Node.ELEMENT_NODE)
            {
                this.selector = null;
                this.elements[0] = selector;
                this.length = 1;
            }
            else
                return this;
        },

        /**
         * Вернет первый елемент по серектору конструктора, или по index
         */
        one:function(index)
        {
            index = index || 0;

            if(this.elements.length == 0)
                return;

            return this.elements[index];
        },

        /**
         * Вернет все елементы по серектору конструктора
         */
        all:function()
        {
            if(this.elements.length == 0)
                return;

            return this.elements;
        },

        /**
         * Вернет firstChild первого елемента по серектору конструктора
         */
        first:function()
        {
            if(this.elements.length == 0)
                return;

            var elem = this.elements[0].firstChild;

            while(elem.nodeType !== Node.ELEMENT_NODE)
                elem = elem.nextSibling;

            return elem;
        },

        /**
         * Вернет lastChild первого елемента по серектору конструктора
         */
        last:function()
        {
            if(this.elements.length == 0)
                return;

            var elem = this.elements[0].lastChild;

            while(elem.nodeType !== Node.ELEMENT_NODE)
                elem = elem.previousSibling;

            return elem;
        },

        /**
         * Вернет previousSibling первого елемента по серектору конструктора
         */
        prev:function()
        {
            if(this.elements.length == 0)
                return;

            var elem = this.elements[0].previousSibling;

            while(elem.nodeType !== Node.ELEMENT_NODE)
                elem = elem.previousSibling;

            return elem;
        },

        /**
         * Вернет nextSibling первого елемента по серектору конструктора
         */
        next:function()
        {
            if(this.elements.length == 0)
                return;

            var elem = this.elements[0].nextSibling;

            while(elem.nodeType !== Node.ELEMENT_NODE)
                elem = elem.nextSibling;

            return elem;
        },

        /**
         * Вернет всех потомков первого елемента по серектору конструктора
         */
        children:function()
        {
            if(this.elements.length == 0)
                return;

            var elem = this.elements[0].children;

            return elem;
        },

        /**
         * Вернет родителя первого елемента по серектору конструктора
         */
        parent:function()
        {
            if(this.elements.length == 0)
                return;

            var elem = this.elements[0].parentNode;

            return elem;
        },

        /**
         * Проводит поиск по селектору в елементх выбраных по серектору конструктора
         */
        find:function(selector)
        {
            var elems = [];

            for(var i = 0; i < this.elements.length; i++)
            {
                var _elems = this.elements[i].querySelectorAll(selector);
                for(var j = 0; j < _elems.length; j++)
                    elems.push(_elems[j]);
            }
            return elems;
        },

        /**
         * Выведет текстовые данные с первого елемента выбраных по серектору конструктора
         * или если передан пареметр `param` вставит текстовые данные во все елементы выбраных по серектору конструктора
         */
        text:function(param)
        {
            if(this.elements.length == 0)
                return;

            if(param == undefined)
                return this.elements[0].textContent;
            else
                this.elements[0].textContent = param;
            return this;
        },

        /**
         * Выведет html данные с первого елемента выбраных по серектору конструктора
         * или если передан пареметр `param` вставит html данные во все елементы выбраные по серектору конструктора
         */
        html:function(param)
        {
            if(this.elements.length == 0)
                return;

            if(param == undefined)
                return this.elements[0].innerHTML;
            else{
                for(var i = 0; i < this.elements.length; i++)
                    this.elements[i].innerHTML = param;
            }

            return this;
        },

        /**
         * Назначает значение param в параметр prop в style объектам выбраных по серектору конструктора 
         * css('display','block') == [objects].style.display = 'block'
         */
        css:function(prop, param)
        {
            if(this.elements.length > 0) {
                for(var i = 0; i < this.elements.length; i++ )
                    this.elements[i].style[prop] = param;               
            }
            return this;
        },

        /**
         * Назначает события всем объектам выбраных по серектору конструктора 
         */
        on:function(event, func)
        {
            if(this.elements.length > 0)
            {
                for(var i = 0; i < this.elements.length; i++ ){
                    if(typeof event == 'string' && typeof func == 'function')
                        this.elements[i].addEventListener(event, func, false);
                }
                
            }
            return this;
        }

    };

    publicController.queryBySelector(selector);

    return publicController;
}

window.$ = dom;