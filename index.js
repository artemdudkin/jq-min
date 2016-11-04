//
//jQuery-like ajax (only POST, only application/json, no cross-domain?) IE9+
//
// url
// data                        == json to send (not stringified)
// success(responseText, data) == success callback, where data is parsed json fron responseText
// fail(status, statusText)    == fail callback
//
function post( url, data, success, fail){
	var xhr = new XMLHttpRequest();

	xhr.open('POST', encodeURI(url));
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return;
//	xhr.onload = function() {

		if (xhr.status === 200) {
			var data; try { data = JSON.parse(xhr.responseText); } catch (e) {}
			if (success) success(xhr.responseText, data);
		} else { //if (xhr.status !== 200)
			if (fail) fail(xhr.status, xhr.statusText);
		}
	};
	xhr.send(JSON.stringify(data));    
}



//
//jQuery-like lib (with method chaining) IE9+
//
// $(...)                          == select all elements at page by css selector
// $('<div id="123"></div>')       == creates new element(s) (returns array)
// find('div a')                   == find all children of all elements by selector
// html()                          == returns innerHTML of first element
// html('aaa')                     == set up innerHTML for all elements
// css('font-size')                == returns css value of first element
// css('color:red;font-size:20px') == set up css for all elements 
// addClass                        == add class to all elements
// removeClass
// hasClass                        == whether any element has specified class
// toggleClass
// event handlers, like $(...).click(f) where f is function == appends new event handler
//
var $ = (function(){

//main function of constructor of $
//creates or find DOM nodes by specified css-selector
function findOrCreate(str_selector, parent){
	if (!parent) parent = document;

        var ret = [];
	if (typeof str_selector === 'string' && str_selector.trim().indexOf('<') == 0) {//creates DOM nodes like this $('<div class="a">b</div>')
		var div = document.createElement('div');
		div.innerHTML = str_selector;
		ret = div.childNodes;
	} else if (str_selector instanceof Node) {
	    ret = [str_selector] // if it is real dom node
	} else if (str_selector && typeof str_selector.html === 'function') {
		ret = str_selector; //if it is already $object, then just return it
	} else {
		ret = parent.querySelectorAll(str_selector);
	}
	ret = Array.prototype.slice.call(ret); //convert NodeList to array
	return ret;
}

//for $(...).<event>()
//apply addEventListener to all elements (if callback provided)
function eventFunc (name){ 
	return function(f){ 
		for (var i=0; i<this.length; i++) this[i].addEventListener(name, f);
		return this;
	}; 
}
var events = [
'click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup', //Mouse Events
'keydown', 'keypress', 'keyup', //Keyboard Events
'abort', 'beforeunload', 'error', 'hashchange', 'load', 'pageshow', 'pagehide', 'resize', 'scroll', 'unload', //Frame/Object Events
'blur', 'change', 'focus', 'focusin', 'focusout', 'input', 'invalid', 'reset', 'search', 'select', 'submit', //Form Events
'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop' //Drag Events
];

//for $(...).css()
//dump computed style of element (from http://stackoverflow.com/questions/15000163/how-to-get-all-css-of-element)
function dumpCSSText(element){
	var s = '';
	var o = getComputedStyle(element);
	for(var i = 0; i < o.length; i++){
		s+=o[i] + ':' + o.getPropertyValue(o[i])+';';
	}
	return s;
}

//for $(...).css()
// translates css props to camelCase, i.e. 'font-size' to 'fontSize' (from jQuery core.js 20160315)
var rmsPrefix = /^-ms-/;
var rdashAlpha = /-([a-z])/g;
var fcamelCase = function( all, letter ) {
	return letter.toUpperCase();
};
var camelCase = function( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}

//for $(...).addClass / removeClass / hasClass
var parseClass = function(el, classToRemove) {
	var classes = (el.className || '').split(' ');
	var i=0; 
	while(i<classes.length) if (!classes[i] || classes[i]===classToRemove) classes.splice(i, 1); else i++;
	return classes;
}




function $(selector){
        if (!(selector instanceof Array)) selector = [selector];

	var ret = [];
        for (var i=0; i<selector.length; i++) ret = ret.concat(findOrCreate(selector[i]));

	for (var i in $.fn) if (typeof $.fn[i] === 'function') ret[i] = $.fn[i].bind(ret);

	return ret;				
}

$.fn = {}

//allow add event listeners just by name, like $(...).click(...)
for (var i in events) $.fn[events[i]] = eventFunc(events[i]);

$.fn.show = function() { 
	for (var i=0; i<this.length; i++) this[i].style.display='';     
	return this;
}

$.fn.hide = function() { 
	for (var i=0; i<this.length; i++) this[i].style.display='none'; 
	return this;
}

$.fn.remove = function() { 
	for (var i=0; i<this.length; i++) this[i].remove();
	return this;
}

$.fn.find = function(selector){ 
	var ret = [];
	for (var i=0; i<this.length; i++) {
		ret = ret.concat( findOrCreate(selector, this[i]));
	}
	return $(ret);
}

$.fn.html = function(h){ 
		if (h) {
			for (var i=0; i<this.length; i++) this[i].innerHTML = h;
			return this; 
		} else {
			return this[0].innerHTML;
		}
		return this;
}
$.fn.css = function(c) {
		if (c) {
			if (c.indexOf(':')<0) {// c is css name -> return this css property of first element
				if (this.length > 0) { 
					var css = dumpCSSText(this[0]).split(';');
					for (var j in css) {
						if (css[j]) {
							var t = css[j].split(':');
							if (t[0] === c) return t[1];
						}
					}
				}
			} else {// c is css style like 'color:red;font-size:16px' -> apply it to all elements
				var css = c.split(';');
				for (var j in css) if (css[j]) css[j] = css[j].split(':');

				for (var i=0; i<this.length; i++) {
					for (var j in css) {
						if (css[j]) this[i].style[camelCase(css[j][0].trim())]=css[j][1];
					}
				}
			}
		} else {//if c==null just return all css of first element
		    return dumpCSSText(this[0]);
		}
		return this;
};
$.fn.hasClass = function(c) {
		var ret = false;
		for (var i=0; i<this.length; i++) {
			var classes = parseClass(this[i]);
			if (classes.indexOf(c)>=0) ret = true;
		}
		return this;
};
$.fn.addClass = function(c) {
		for (var i=0; i<this.length; i++) {
			var classes = parseClass(this[i]);
			if (classes.indexOf(c)<0) classes.push(c);
			this[i].className = classes.join(' ');
		} 
		return this;
};
$.fn.removeClass = function(c) {
		for (var i=0; i<this.length; i++) {
			var classes = parseClass(this[i], c);
			this[i].className = classes.join(' ');
		}
		return this;
};
$.fn.toggleClass = function(c) {
		if (this.hasClass(c)) {
			this.removeClass(c);
		} else {
			this.addClass(c);
		}
		return this;
};

return $;

})();
