(function () {(function(w) {

  var routes = [];
  var map = {};
  var reference = "routie";
  var oldReference = w[reference];

  var Route = function(path, name) {
    this.name = name;
    this.path = path;
    this.keys = [];
    this.fns = [];
    this.params = {};
    this.regex = pathToRegexp(this.path, this.keys, false, false);

  };

  Route.prototype.addHandler = function(fn) {
    this.fns.push(fn);
  };

  Route.prototype.removeHandler = function(fn) {
    for (var i = 0, c = this.fns.length; i < c; i++) {
      var f = this.fns[i];
      if (fn == f) {
        this.fns.splice(i, 1);
        return;
      }
    }
  };

  Route.prototype.run = function(params) {
    for (var i = 0, c = this.fns.length; i < c; i++) {
      this.fns[i].apply(this, params);
    }
  };

  Route.prototype.match = function(path, params){
    var m = this.regex.exec(path);

    if (!m) return false;


    for (var i = 1, len = m.length; i < len; ++i) {
      var key = this.keys[i - 1];

      var val = ('string' == typeof m[i]) ? decodeURIComponent(m[i]) : m[i];

      if (key) {
        this.params[key.name] = val;
      }
      params.push(val);
    }

    return true;
  };

  Route.prototype.toURL = function(params) {
    var path = this.path;
    for (var param in params) {
      path = path.replace('/:'+param, '/'+params[param]);
    }
    path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');
    if (path.indexOf(':') != -1) {
      throw new Error('missing parameters for url: '+path);
    }
    return path;
  };

  var pathToRegexp = function(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/\+/g, '__plus__')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/__plus__/g, '(.+)')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  };

  var addHandler = function(path, fn) {
    var s = path.split(' ');
    var name = (s.length == 2) ? s[0] : null;
    path = (s.length == 2) ? s[1] : s[0];

    if (!map[path]) {
      map[path] = new Route(path, name);
      routes.push(map[path]);
    }
    map[path].addHandler(fn);
  };

  var routie = function(path, fn) {
    if (typeof fn == 'function') {
      addHandler(path, fn);
      routie.reload();
    } else if (typeof path == 'object') {
      for (var p in path) {
        addHandler(p, path[p]);
      }
      routie.reload();
    } else if (typeof fn === 'undefined') {
      routie.navigate(path);
    }
  };

  routie.lookup = function(name, obj) {
    for (var i = 0, c = routes.length; i < c; i++) {
      var route = routes[i];
      if (route.name == name) {
        return route.toURL(obj);
      }
    }
  };

  routie.remove = function(path, fn) {
    var route = map[path];
    if (!route)
      return;
    route.removeHandler(fn);
  };

  routie.removeAll = function() {
    map = {};
    routes = [];
  };

  routie.navigate = function(path, options) {
    options = options || {};
    var silent = options.silent || false;

    if (silent) {
      removeListener();
    }
    setTimeout(function() {
      window.location.hash = path;

      if (silent) {
        setTimeout(function() { 
          addListener();
        }, 1);
      }

    }, 1);
  };

  routie.noConflict = function() {
    w[reference] = oldReference;
    return routie;
  };

  var getHash = function() {
    return window.location.hash.substring(1);
  };

  var checkRoute = function(hash, route) {
    var params = [];
    if (route.match(hash, params)) {
      route.run(params);
      return true;
    }
    return false;
  };

  var hashChanged = routie.reload = function() {
    var hash = getHash();
    for (var i = 0, c = routes.length; i < c; i++) {
      var route = routes[i];
      if (checkRoute(hash, route)) {
        return;
      }
    }
  };

  var addListener = function() {
    if (w.addEventListener) {
      w.addEventListener('hashchange', hashChanged, false);
    } else {
      w.attachEvent('onhashchange', hashChanged);
    }
  };

  var removeListener = function() {
    if (w.removeEventListener) {
      w.removeEventListener('hashchange', hashChanged);
    } else {
      w.detachEvent('onhashchange', hashChanged);
    }
  };
  addListener();

  w[reference] = routie;
   
})(window);

define("routie", function(){});

/*
 * JavaScript Templates 2.4.1
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Inspired by John Resig's JavaScript Micro-Templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 */

/*jslint evil: true, regexp: true, unparam: true */
/*global document, define */

(function ($) {
    "use strict";
    var tmpl = function (str, data) {
        var f = !/[^\w\-\.:]/.test(str) ? tmpl.cache[str] = tmpl.cache[str] ||
                tmpl(tmpl.load(str)) :
                    new Function(
                        tmpl.arg + ',tmpl',
                        "var _e=tmpl.encode" + tmpl.helper + ",_s='" +
                            str.replace(tmpl.regexp, tmpl.func) +
                            "';return _s;"
                    );
        return data ? f(data, tmpl) : function (data) {
            return f(data, tmpl);
        };
    };
    tmpl.cache = {};
    tmpl.load = function (id) {
        return document.getElementById(id).innerHTML;
    };
    tmpl.regexp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
    tmpl.func = function (s, p1, p2, p3, p4, p5) {
        if (p1) { // whitespace, quote and backspace in HTML context
            return {
                "\n": "\\n",
                "\r": "\\r",
                "\t": "\\t",
                " " : " "
            }[p1] || "\\" + p1;
        }
        if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
            if (p2 === "=") {
                return "'+_e(" + p3 + ")+'";
            }
            return "'+(" + p3 + "==null?'':" + p3 + ")+'";
        }
        if (p4) { // evaluation start tag: {%
            return "';";
        }
        if (p5) { // evaluation end tag: %}
            return "_s+='";
        }
    };
    tmpl.encReg = /[<>&"'\x00]/g;
    tmpl.encMap = {
        "<"   : "&lt;",
        ">"   : "&gt;",
        "&"   : "&amp;",
        "\""  : "&quot;",
        "'"   : "&#39;"
    };
    tmpl.encode = function (s) {
        /*jshint eqnull:true */
        return (s == null ? "" : "" + s).replace(
            tmpl.encReg,
            function (c) {
                return tmpl.encMap[c] || "";
            }
        );
    };
    tmpl.arg = "o";
    tmpl.helper = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" +
        ",include=function(s,d){_s+=tmpl(s,d);}";

        $.tmpl = tmpl;
    
}(this));

define("tmpl", function(){});

/*!
 * Masonry PACKAGED v3.3.2
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

/**
 * Bridget makes jQuery widgets
 * v1.1.0
 * MIT license
 */

( function( window ) {



// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
  return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
  // don't overwrite original option method
  if ( PluginClass.prototype.option ) {
    return;
  }

  // option setter
  PluginClass.prototype.option = function( opts ) {
    // bail out if not an object
    if ( !$.isPlainObject( opts ) ){
      return;
    }
    this.options = $.extend( true, this.options, opts );
  };
}

// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
  // add to jQuery fn namespace
  $.fn[ namespace ] = function( options ) {
    if ( typeof options === 'string' ) {
      // call plugin method when first argument is a string
      // get arguments for method
      var args = slice.call( arguments, 1 );

      for ( var i=0, len = this.length; i < len; i++ ) {
        var elem = this[i];
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( "cannot call methods on " + namespace + " prior to initialization; " +
            "attempted to call '" + options + "'" );
          continue;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
          logError( "no such method '" + options + "' for " + namespace + " instance" );
          continue;
        }

        // trigger method with arguments
        var returnValue = instance[ options ].apply( instance, args );

        // break look and return first value if provided
        if ( returnValue !== undefined ) {
          return returnValue;
        }
      }
      // return this if no return value
      return this;
    } else {
      return this.each( function() {
        var instance = $.data( this, namespace );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( this, options );
          $.data( this, namespace, instance );
        }
      });
    }
  };

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *   the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
  addOptionMethod( PluginClass );
  bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'jquery-bridget/jquery.bridget',[ 'jquery' ], defineBridget );
} else if ( typeof exports === 'object' ) {
  defineBridget( require('jquery') );
} else {
  // get jquery from browser global
  defineBridget( window.jQuery );
}

})( window );

/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};


  window.eventie = eventie;

})( window );

/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };


        exports.EventEmitter = EventEmitter;
    
}.call(this));

/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {



var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport

  window.getStyleProperty = getStyleProperty;


})( window );

/*!
 * getSize v1.2.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false, console: false */

( function( window, undefined ) {



// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  var getComputedStyle = window.getComputedStyle;
  getStyle = ( function() {
    var getStyleFn = getComputedStyle ?
      function( elem ) {
        return getComputedStyle( elem, null );
      } :
      function( elem ) {
        return elem.currentStyle;
      };

      return function getStyle( elem ) {
        var style = getStyleFn( elem );
        if ( !style ) {
          logError( 'Style returned ' + style +
            '. Are you running this code in a hidden iframe on Firefox? ' +
            'See http://bit.ly/getsizebug1' );
        }
        return style;
      };
  })();

  // -------------------------- box sizing -------------------------- //

  boxSizingProp = getStyleProperty('boxSizing');

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox measures the inner-width
   */
  if ( boxSizingProp ) {
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style[ boxSizingProp ] = 'border-box';

    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );

    isBoxSizeOuter = getStyleSize( style.width ) === 200;
    body.removeChild( div );
  }

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport

  window.getSize = defineGetSize( window.getStyleProperty );

})( window );

/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {



var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}
  window.docReady = defineDocReady( window.eventie );

})( window );

/**
 * matchesSelector v1.0.3
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( ElemProto ) {

  

  var matchesMethod = ( function() {
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  // ----- match ----- //

  function match( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  }

  // ----- appendToFragment ----- //

  function checkParent( elem ) {
    // not needed if already has parent
    if ( elem.parentNode ) {
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild( elem );
  }

  // ----- query ----- //

  // fall back to using QSA
  // thx @jonathantneal https://gist.github.com/3062955
  function query( elem, selector ) {
    // append to fragment if no parent
    checkParent( elem );

    // match elem with all selected elems of parent
    var elems = elem.parentNode.querySelectorAll( selector );
    for ( var i=0, len = elems.length; i < len; i++ ) {
      // return true if match
      if ( elems[i] === elem ) {
        return true;
      }
    }
    // otherwise return false
    return false;
  }

  // ----- matchChild ----- //

  function matchChild( elem, selector ) {
    checkParent( elem );
    return match( elem, selector );
  }

  // ----- matchesSelector ----- //

  var matchesSelector;

  if ( matchesMethod ) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = document.createElement('div');
    var supportsOrphans = match( div, 'div' );
    matchesSelector = supportsOrphans ? match : matchChild;
  } else {
    matchesSelector = query;
  }

  // transport

    window.matchesSelector = matchesSelector;
  

})( Element.prototype );

/**
 * Fizzy UI utils v1.0.1
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  /*global define: false, module: false, require: false */
  

    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.docReady,
      window.matchesSelector
    );

}( window, function factory( window, docReady, matchesSelector ) {



var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- isArray ----- //
  
var objToString = Object.prototype.toString;
utils.isArray = function( obj ) {
  return objToString.call( obj ) == '[object Array]';
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  var ary = [];
  if ( utils.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
};

// ----- indexOf ----- //

// index of helper cause IE8
utils.indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = utils.indexOf( ary, obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- isElement ----- //

// http://stackoverflow.com/a/384380/182183
utils.isElement = ( typeof HTMLElement == 'function' || typeof HTMLElement == 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj == 'object' &&
      obj.nodeType == 1 && typeof obj.nodeName == 'string';
  };

// ----- setText ----- //

utils.setText = ( function() {
  var setTextProperty;
  function setText( elem, text ) {
    // only check setTextProperty once
    setTextProperty = setTextProperty || ( document.documentElement.textContent !== undefined ? 'textContent' : 'innerText' );
    elem[ setTextProperty ] = text;
  }
  return setText;
})();

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !utils.isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have a selector
    if ( selector ) {
      // filter siblings
      if ( matchesSelector( elem, selector ) ) {
        ffElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( selector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        ffElems.push( childElems[j] );
      }
    } else {
      ffElems.push( elem );
    }
  }

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    if ( timeout ) {
      clearTimeout( timeout );
    }
    var args = arguments;

    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold || 100 );
  };
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-option attribute
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
    var dataAttr = 'data-' + dashedNamespace + '-options';

    for ( var i=0, len = elems.length; i < len; i++ ) {
      var elem = elems[i];
      var attr = elem.getAttribute( dataAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' +
            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
            error );
        }
        continue;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('layoutname')
      var jQuery = window.jQuery;
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    }
  });
};

// -----  ----- //

return utils;

}));

/**
 * Outlayer Item
 */

( function( window, factory ) {
  
    // browser global
    window.Outlayer = {};
    window.Outlayer.Item = factory(
      window,
      window.EventEmitter,
      window.getSize,
      window.getStyleProperty,
      window.fizzyUIUtils
    );


}( window, function factory( window, EventEmitter, getSize, getStyleProperty, utils ) {


// ----- helpers ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
  'transform',
  'transition',
  'transitionDuration',
  'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
  var cache = {};
  for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
    var prop = prefixableProperties[i];
    var supportedProp = getStyleProperty( prop );
    if ( supportedProp && supportedProp !== prop ) {
      cache[ prop ] = supportedProp;
    }
  }
  return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EventEmitter
utils.extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
  var style = getStyle( this.element );
  var layoutOptions = this.layout.options;
  var isOriginLeft = layoutOptions.isOriginLeft;
  var isOriginTop = layoutOptions.isOriginTop;
  var xValue = style[ isOriginLeft ? 'left' : 'right' ];
  var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
  // convert percent to pixels
  var layoutSize = this.layout.size;
  var x = xValue.indexOf('%') != -1 ?
    ( parseFloat( xValue ) / 100 ) * layoutSize.width : parseInt( xValue, 10 );
  var y = yValue.indexOf('%') != -1 ?
    ( parseFloat( yValue ) / 100 ) * layoutSize.height : parseInt( yValue, 10 );

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var layoutOptions = this.layout.options;
  var style = {};

  // x
  var xPadding = layoutOptions.isOriginLeft ? 'paddingLeft' : 'paddingRight';
  var xProperty = layoutOptions.isOriginLeft ? 'left' : 'right';
  var xResetProperty = layoutOptions.isOriginLeft ? 'right' : 'left';

  var x = this.position.x + layoutSize[ xPadding ];
  // set in percentage or pixels
  style[ xProperty ] = this.getXValue( x );
  // reset other property
  style[ xResetProperty ] = '';

  // y
  var yPadding = layoutOptions.isOriginTop ? 'paddingTop' : 'paddingBottom';
  var yProperty = layoutOptions.isOriginTop ? 'top' : 'bottom';
  var yResetProperty = layoutOptions.isOriginTop ? 'bottom' : 'top';

  var y = this.position.y + layoutSize[ yPadding ];
  // set in percentage or pixels
  style[ yProperty ] = this.getYValue( y );
  // reset other property
  style[ yResetProperty ] = '';

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};

Item.prototype.getXValue = function( x ) {
  var layoutOptions = this.layout.options;
  return layoutOptions.percentPosition && !layoutOptions.isHorizontal ?
    ( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
};

Item.prototype.getYValue = function( y ) {
  var layoutOptions = this.layout.options;
  return layoutOptions.percentPosition && layoutOptions.isHorizontal ?
    ( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
};


Item.prototype._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  transitionStyle.transform = this.getTranslate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

Item.prototype.getTranslate = function( x, y ) {
  // flip cooridinates if origin on right or bottom
  var layoutOptions = this.layout.options;
  x = layoutOptions.isOriginLeft ? x : -x;
  y = layoutOptions.isOriginTop ? y : -y;

  if ( is3d ) {
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  }

  return 'translate(' + x + 'px, ' + y + 'px)';
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
  Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

// dash before all cap letters, including first for
// WebkitTransform => -webkit-transform
function toDashedAll( str ) {
  return str.replace( /([A-Z])/g, function( $1 ) {
    return '-' + $1.toLowerCase();
  });
}

var transitionProps = 'opacity,' +
  toDashedAll( vendorProperties.transform || 'transform' );

Item.prototype.enableTransition = function(/* style */) {
  // HACK changing transitionProperty during a transition
  // will cause transition to jump
  if ( this.isTransitioning ) {
    return;
  }

  // make `transition: foo, bar, baz` from style object
  // HACK un-comment this when enableTransition can work
  // while a transition is happening
  // var transitionValues = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   prop = vendorProperties[ prop ] || prop;
  //   transitionValues.push( toDashedAll( prop ) );
  // }
  // enable transition styles
  this.css({
    transitionProperty: transitionProps,
    transitionDuration: this.layout.options.transitionDuration
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform',
  '-moz-transform': 'transform',
  '-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  // remove display: none
  this.css({ display: '' });
  this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  var _this = this;
  this.once( 'transitionEnd', function() {
    _this.removeElem();
  });
  this.hide();
};

Item.prototype.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

Item.prototype.onRevealTransitionEnd = function() {
  // check if still visible
  // during transition, item may have been hidden
  if ( !this.isHidden ) {
    this.emitEvent('reveal');
  }
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
Item.prototype.getHideRevealTransitionEndProperty = function( styleProperty ) {
  var optionStyle = this.layout.options[ styleProperty ];
  // use opacity
  if ( optionStyle.opacity ) {
    return 'opacity';
  }
  // get first property
  for ( var prop in optionStyle ) {
    return prop;
  }
};

Item.prototype.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

Item.prototype.onHideTransitionEnd = function() {
  // check if still hidden
  // during transition, item may have been un-hidden
  if ( this.isHidden ) {
    this.css({ display: 'none' });
    this.emitEvent('hide');
  }
};

Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}));

/*!
 * Outlayer v1.4.2
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {
  

    // browser global
    window.Outlayer = factory(
      window,
      window.eventie,
      window.EventEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );

}( window, function factory( window, eventie, EventEmitter, getSize, utils, Item ) {


// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for ' + this.constructor.namespace +
        ': ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  if ( this.options.isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isInitLayout: true,
  isOriginLeft: true,
  isOriginTop: true,
  isResizeBound: true,
  isResizingContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

// inherit EventEmitter
utils.extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
  utils.extend( this.options, opts );
};

Outlayer.prototype._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  utils.extend( this.element.style, this.options.containerStyle );

  // bind resize method
  if ( this.options.isResizeBound ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
  var elems = [];
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    elems.push( this.items[i].element );
  }
  return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var isInstant = this.options.isLayoutInstant !== undefined ?
    this.options.isLayoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
  this.getSize();
};


Outlayer.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( utils.isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
  var layoutItems = [];
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( !item.isIgnored ) {
      layoutItems.push( item );
    }
  }
  return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
  this._emitCompleteOnItems( 'layout', items );

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    return;
  }

  var queue = [];

  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var obj = queue[i];
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
  }
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
  this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
  if ( !this.options.isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
Outlayer.prototype._emitCompleteOnItems = function( eventName, items ) {
  var _this = this;
  function onComplete() {
    _this.dispatchEvent( eventName + 'Complete', null, [ items ] );
  }

  var count = items.length;
  if ( !items || !count ) {
    onComplete();
    return;
  }

  var doneCount = 0;
  function tick() {
    doneCount++;
    if ( doneCount === count ) {
      onComplete();
    }
  }

  // bind callback
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.once( eventName, tick );
  }
};

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
Outlayer.prototype.dispatchEvent = function( type, event, args ) {
  // add original event to arguments
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery ) {
    // set this.$element
    this.$element = this.$element || jQuery( this.element );
    if ( event ) {
      // create jQuery event
      var $event = jQuery.Event( event );
      $event.type = type;
      this.$element.trigger( $event, args );
    } else {
      // just trigger with type if no event available
      this.$element.trigger( type, args );
    }
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed stamp elements
    utils.removeFrom( this.stamps, elem );
    this.unignore( elem );
  }

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = utils.makeArray( elems );
  return elems;
};

Outlayer.prototype._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  for ( var i=0, len = this.stamps.length; i < len; i++ ) {
    var stamp = this.stamps[i];
    this._manageStamp( stamp );
  }
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
  // bind just one listener
  if ( this.isResizeBound ) {
    return;
  }
  eventie.bind( window, 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
  if ( this.isResizeBound ) {
    eventie.unbind( window, 'resize', this );
  }
  this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  var _this = this;
  function delayed() {
    _this.resize();
    delete _this.resizeTimeout;
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
  this._emitCompleteOnItems( 'reveal', items );

  var len = items && items.length;
  for ( var i=0; len && i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
  this._emitCompleteOnItems( 'hide', items );

  var len = items && items.length;
  for ( var i=0; len && i < len; i++ ) {
    var item = items[i];
    item.hide();
  }
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.revealItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.hideItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    if ( item.element === elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
  elems = utils.makeArray( elems );
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
  var removeItems = this.getItems( elems );

  this._emitCompleteOnItems( 'remove', removeItems );

  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  for ( var i=0, len = removeItems.length; i < len; i++ ) {
    var item = removeItems[i];
    item.remove();
    // remove item from collection
    utils.removeFrom( this.items, item );
  }
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  function Layout() {
    Outlayer.apply( this, arguments );
  }
  // inherit Outlayer prototype, use Object.create if there
  if ( Object.create ) {
    Layout.prototype = Object.create( Outlayer.prototype );
  } else {
    utils.extend( Layout.prototype, Outlayer.prototype );
  }
  // set contructor, used for namespace and Item
  Layout.prototype.constructor = Layout;

  Layout.defaults = utils.extend( {}, Outlayer.defaults );
  // apply new options
  utils.extend( Layout.defaults, options );
  // keep prototype.settings for backwards compatibility (Packery v1.2.0)
  Layout.prototype.settings = {};

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = function LayoutItem() {
    Item.apply( this, arguments );
  };

  Layout.Item.prototype = new Item();

  // -------------------------- declarative -------------------------- //

  utils.htmlInit( Layout, namespace );

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));


/*!
 * Masonry v3.3.2
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window, factory ) {
  

    window.Masonry = factory(
      window.Outlayer,
      window.getSize,
      window.fizzyUIUtils
    );

}( window, function factory( Outlayer, getSize, utils ) {



// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');

  Masonry.prototype._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    var i = this.cols;
    this.colYs = [];
    while (i--) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
  };

  Masonry.prototype.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    var columnWidth = this.columnWidth += this.gutter;

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - containerWidth % columnWidth;
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
    cols = Math[ mathMethod ]( cols );
    this.cols = Math.max( cols, 1 );
  };

  Masonry.prototype.getContainerWidth = function() {
    // container is parent if fit width
    var container = this.options.isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  Masonry.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );

    var colGroup = this._getColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );
    var shortColIndex = utils.indexOf( colGroup, minimumY );

    // position the brick
    var position = {
      x: this.columnWidth * shortColIndex,
      y: minimumY
    };

    // apply setHeight to necessary columns
    var setHeight = minimumY + item.size.outerHeight;
    var setSpan = this.cols + 1 - colGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.colYs[ shortColIndex + i ] = setHeight;
    }

    return position;
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  Masonry.prototype._getColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      // make an array of colY values for that one group
      var groupColYs = this.colYs.slice( i, i + colSpan );
      // and get the max value of the array
      colGroup[i] = Math.max.apply( Math, groupColYs );
    }
    return colGroup;
  };

  Masonry.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var firstX = this.options.isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp
    var stampMaxY = ( this.options.isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  Masonry.prototype._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this.options.isFitWidth ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  Masonry.prototype._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  Masonry.prototype.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth !== this.containerWidth;
  };

  return Masonry;

}));


define("masonry", function(){});

define('assets/core/key/KeyManager',["require", "exports"], function (require, exports) {
    var KeyManager = (function () {
        function KeyManager() {
        }
        KeyManager.Register = function (aKeyBindable) {
            if (!this.mInitialize) {
                document.addEventListener('keydown', this.OnKeyDown.bind(this));
                document.addEventListener('keyup', this.OnKeyUp.bind(this));
                this.mInitialize = true;
            }
            if (this.mKeyBindableList.indexOf(aKeyBindable) >= 0) {
                return;
            }
            this.mKeyBindableList.push(aKeyBindable);
            this.mListLength++;
        };
        KeyManager.Unregister = function (aKeyBindable) {
            var keyBindableIndex = this.mKeyBindableList.indexOf(aKeyBindable);
            if (keyBindableIndex <= -1) {
                return;
            }
            this.mKeyBindableList.splice(keyBindableIndex, 1);
            this.mListLength--;
            if (this.mListLength == 0) {
                document.removeEventListener('keydown', this.OnKeyDown.bind(this));
                document.removeEventListener('keyup', this.OnKeyUp.bind(this));
            }
        };
        KeyManager.OnKeyDown = function (aEvent) {
            var keyListIndex = this.mKeyList.indexOf(aEvent.keyCode);
            if (keyListIndex >= 0) {
                return;
            }
            this.mKeyList.push(aEvent.keyCode);
            var keyBindableListLength = this.mKeyBindableList.length;
            for (var i = 0; i < keyBindableListLength; i++) {
                this.mKeyBindableList[i].KeyPressed(this.mKeyList);
            }
        };
        KeyManager.OnKeyUp = function (aEvent) {
            var keyListIndex = this.mKeyList.indexOf(aEvent.keyCode);
            this.mKeyList.splice(keyListIndex, 1);
        };
        KeyManager.mListLength = 0;
        KeyManager.mKeyList = [];
        KeyManager.mKeyBindableList = [];
        return KeyManager;
    })();
    return KeyManager;
});

define('assets/core/navigation/NavigationManager',["require", "exports"], function (require, exports) {
    var NavigationManager = (function () {
        function NavigationManager() {
        }
        NavigationManager.Register = function (aNavigable) {
            if (!this.mInitialize) {
                this.mInitialize = true;
            }
            if (this.mNavigableList.indexOf(aNavigable) >= 0) {
                return;
            }
            this.mNavigableList.push(aNavigable);
            this.mListLength++;
        };
        NavigationManager.Unregister = function (aNavigable) {
            var keyBindableIndex = this.mNavigableList.indexOf(aNavigable);
            if (keyBindableIndex <= -1) {
                return;
            }
            this.mNavigableList.splice(keyBindableIndex, 1);
            this.mListLength--;
            if (this.mListLength == 0) {
            }
        };
        NavigationManager.NavigateTo = function (aPath) {
            for (var i = 0; i < this.mListLength; i++) {
                var routeList = this.mNavigableList[i].GetRouteList();
                for (var j = 0; j < routeList.length; j++) {
                    if (routeList[j] == aPath) {
                        return (this.mNavigableList[i]);
                    }
                }
            }
            return (null);
        };
        NavigationManager.mListLength = 0;
        NavigationManager.mNavigableList = [];
        return NavigationManager;
    })();
    return NavigationManager;
});

/***
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
define('assets/core/event/EventGroup',["require", "exports"], function (require, exports) {
    var EventGroup = (function () {
        function EventGroup() {
            this.mCallbackList = new Array();
        }
        EventGroup.prototype.Destroy = function () {
            this.mCallbackList.splice(0, this.mCallbackList.length);
            this.mCallbackList = null;
        };
        EventGroup.prototype.Add = function (aCallback, aScope) {
            this.mCallbackList.push({
                callback: aCallback,
                scope: aScope
            });
        };
        EventGroup.prototype.Remove = function (aIndex) {
            this.mCallbackList.splice(aIndex, 1);
        };
        EventGroup.prototype.Find = function (aCallback, aScope) {
            var index = -1;
            var callbackListLength = this.mCallbackList.length;
            for (var i = 0; i < callbackListLength; i++) {
                var callbackObject = this.mCallbackList[i];
                if ("" + callbackObject.callback === "" + aCallback && callbackObject.scope === aScope) {
                    index = i;
                    break;
                }
            }
            return (index);
        };
        EventGroup.prototype.Exist = function (aCallback, aScope) {
            return (this.Find(aCallback, aScope) >= 0);
        };
        EventGroup.prototype.Empty = function () { return (this.mCallbackList.length <= 0); };
        EventGroup.prototype.FireEvent = function (aEvent) {
            var callbackListLength = this.mCallbackList == null ? 0 : this.mCallbackList.length;
            for (var i = callbackListLength - 1; i >= 0; i--) {
                this.mCallbackList[i].callback.apply(this.mCallbackList[i].scope, [aEvent]);
            }
        };
        return EventGroup;
    })();
    return EventGroup;
});

/***
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
define('assets/core/event/EventDispatcher',["require", "exports", "./EventGroup"], function (require, exports, EventGroup) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.mListenerDictionary = {};
        }
        EventDispatcher.prototype.Destroy = function () {
            this.mListenerDictionary = undefined;
        };
        EventDispatcher.prototype.HasEventListener = function (aEventName) {
            return (this.mListenerDictionary[aEventName] != null);
        };
        EventDispatcher.prototype.AddEventListener = function (aEventName, aCallback, aScope) {
            if (this.mListenerDictionary[aEventName] == null) {
                this.mListenerDictionary[aEventName] = new EventGroup();
            }
            if (!this.mListenerDictionary[aEventName].Exist(aCallback, aScope)) {
                this.mListenerDictionary[aEventName].Add(aCallback, aScope);
            }
        };
        EventDispatcher.prototype.RemoveEventListener = function (aEventName, aCallback, aScope) {
            if (!this.HasEventListener(aEventName)) {
                return;
            }
            var callbackIndex = this.mListenerDictionary[aEventName].Find(aCallback, aScope);
            if (callbackIndex >= 0) {
                this.mListenerDictionary[aEventName].Remove(callbackIndex);
            }
            if (this.mListenerDictionary[aEventName].Empty()) {
                this.mListenerDictionary[aEventName].Destroy();
                this.mListenerDictionary[aEventName] = undefined;
            }
        };
        EventDispatcher.prototype.DispatchEvent = function (aEvent) {
            if (this.mListenerDictionary[aEvent.eventName] != null) {
                aEvent.target = this;
                this.mListenerDictionary[aEvent.eventName].FireEvent(aEvent);
            }
        };
        return EventDispatcher;
    })();
    return EventDispatcher;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/core/mvc/AbstractController',["require", "exports", "../event/EventDispatcher"], function (require, exports, EventDispatcher) {
    var AbstractController = (function (_super) {
        __extends(AbstractController, _super);
        function AbstractController() {
            _super.call(this);
        }
        AbstractController.prototype.Init = function (aActions) {
        };
        AbstractController.prototype.Destroy = function () {
        };
        return AbstractController;
    })(EventDispatcher);
    return AbstractController;
});

/* tslint:disable */
/**
    Module P: Generic Promises for TypeScript

    Project, documentation, and license: https://github.com/pragmatrix/Promise
*/
define('assets/promise/promise',["require", "exports"], function (require, exports) {
    var P;
    (function (P) {
        function defer() {
            return new DeferredI();
        }
        P.defer = defer;
        function resolve(v) {
            return defer().resolve(v).promise();
        }
        P.resolve = resolve;
        function reject(err) {
            return defer().reject(err).promise();
        }
        P.reject = reject;
        function unfold(unspool, seed) {
            var d = defer();
            var elements = new Array();
            unfoldCore(elements, d, unspool, seed);
            return d.promise();
        }
        P.unfold = unfold;
        function unfoldCore(elements, deferred, unspool, seed) {
            var result = unspool(seed);
            if (!result) {
                deferred.resolve(elements);
                return;
            }
            while (result.next && result.promise.status == P.Status.Resolved) {
                elements.push(result.promise.result);
                result = unspool(result.next);
                if (!result) {
                    deferred.resolve(elements);
                    return;
                }
            }
            result.promise
                .done(function (v) {
                elements.push(v);
                if (!result.next)
                    deferred.resolve(elements);
                else
                    unfoldCore(elements, deferred, unspool, result.next);
            })
                .fail(function (e) {
                deferred.reject(e);
            });
        }
        (function (Status) {
            Status[Status["Unfulfilled"] = 0] = "Unfulfilled";
            Status[Status["Rejected"] = 1] = "Rejected";
            Status[Status["Resolved"] = 2] = "Resolved";
        })(P.Status || (P.Status = {}));
        var Status = P.Status;
        function when() {
            var promises = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                promises[_i - 0] = arguments[_i];
            }
            var allDone = defer();
            if (!promises.length) {
                allDone.resolve([]);
                return allDone.promise();
            }
            var resolved = 0;
            var results = [];
            promises.forEach(function (p, i) {
                p
                    .done(function (v) {
                    results[i] = v;
                    ++resolved;
                    if (resolved === promises.length && allDone.status !== Status.Rejected)
                        allDone.resolve(results);
                })
                    .fail(function (e) {
                    if (allDone.status !== Status.Rejected)
                        allDone.reject(new Error("when: one or more promises were rejected"));
                });
            });
            return allDone.promise();
        }
        P.when = when;
        var PromiseI = (function () {
            function PromiseI(deferred) {
                this.deferred = deferred;
            }
            Object.defineProperty(PromiseI.prototype, "status", {
                get: function () { return this.deferred.status; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PromiseI.prototype, "result", {
                get: function () { return this.deferred.result; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PromiseI.prototype, "error", {
                get: function () { return this.deferred.error; },
                enumerable: true,
                configurable: true
            });
            PromiseI.prototype.done = function (f) {
                this.deferred.done(f);
                return this;
            };
            PromiseI.prototype.fail = function (f) {
                this.deferred.fail(f);
                return this;
            };
            PromiseI.prototype.always = function (f) {
                this.deferred.always(f);
                return this;
            };
            PromiseI.prototype.then = function (f) {
                return this.deferred.then(f);
            };
            return PromiseI;
        })();
        var DeferredI = (function () {
            function DeferredI() {
                this._resolved = function (_) { };
                this._rejected = function (_) { };
                this._status = Status.Unfulfilled;
                this._error = { message: "" };
                this._promise = new PromiseI(this);
            }
            DeferredI.prototype.promise = function () {
                return this._promise;
            };
            Object.defineProperty(DeferredI.prototype, "status", {
                get: function () {
                    return this._status;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeferredI.prototype, "result", {
                get: function () {
                    if (this._status != Status.Resolved)
                        throw new Error("Promise: result not available");
                    return this._result;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeferredI.prototype, "error", {
                get: function () {
                    if (this._status != Status.Rejected)
                        throw new Error("Promise: rejection reason not available");
                    return this._error;
                },
                enumerable: true,
                configurable: true
            });
            DeferredI.prototype.then = function (f) {
                var d = defer();
                this
                    .done(function (v) {
                    var promiseOrValue = f(v);
                    if (promiseOrValue instanceof PromiseI) {
                        var p = promiseOrValue;
                        p.done(function (v2) { return d.resolve(v2); })
                            .fail(function (err) { return d.reject(err); });
                        return p;
                    }
                    d.resolve(promiseOrValue);
                })
                    .fail(function (err) { return d.reject(err); });
                return d.promise();
            };
            DeferredI.prototype.done = function (f) {
                if (this.status === Status.Resolved) {
                    f(this._result);
                    return this;
                }
                if (this.status !== Status.Unfulfilled)
                    return this;
                var prev = this._resolved;
                this._resolved = function (v) { prev(v); f(v); };
                return this;
            };
            DeferredI.prototype.fail = function (f) {
                if (this.status === Status.Rejected) {
                    f(this._error);
                    return this;
                }
                if (this.status !== Status.Unfulfilled)
                    return this;
                var prev = this._rejected;
                this._rejected = function (e) { prev(e); f(e); };
                return this;
            };
            DeferredI.prototype.always = function (f) {
                this
                    .done(function (v) { return f(v); })
                    .fail(function (err) { return f(null, err); });
                return this;
            };
            DeferredI.prototype.resolve = function (result) {
                if (this._status !== Status.Unfulfilled)
                    throw new Error("tried to resolve a fulfilled promise");
                this._result = result;
                this._status = Status.Resolved;
                this._resolved(result);
                this.detach();
                return this;
            };
            DeferredI.prototype.reject = function (err) {
                if (this._status !== Status.Unfulfilled)
                    throw new Error("tried to reject a fulfilled promise");
                this._error = err;
                this._status = Status.Rejected;
                this._rejected(err);
                this.detach();
                return this;
            };
            DeferredI.prototype.detach = function () {
                this._resolved = function (_) { };
                this._rejected = function (_) { };
            };
            return DeferredI;
        })();
        function generator(g) {
            return function () { return iterator(g()); };
        }
        P.generator = generator;
        ;
        function iterator(f) {
            return new IteratorI(f);
        }
        P.iterator = iterator;
        var IteratorI = (function () {
            function IteratorI(f) {
                this.f = f;
                this.current = undefined;
            }
            IteratorI.prototype.advance = function () {
                var _this = this;
                var res = this.f();
                return res.then(function (value) {
                    if (isUndefined(value))
                        return false;
                    _this.current = value;
                    return true;
                });
            };
            return IteratorI;
        })();
        function each(gen, f) {
            var d = defer();
            eachCore(d, gen(), f);
            return d.promise();
        }
        P.each = each;
        function eachCore(fin, it, f) {
            it.advance()
                .done(function (hasValue) {
                if (!hasValue) {
                    fin.resolve({});
                    return;
                }
                f(it.current);
                eachCore(fin, it, f);
            })
                .fail(function (err) { return fin.reject(err); });
        }
        function isUndefined(v) {
            return typeof v === 'undefined';
        }
        P.isUndefined = isUndefined;
    })(P || (P = {}));
    return P;
});

/***
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright Cortex Media 2015
 *
 * @author Mathieu Rhéaume
 */
define('assets/core/net/LazyLoader',["require", "exports", "../../promise/promise"], function (require, exports, P) {
    var LazyLoader = (function () {
        function LazyLoader() {
        }
        LazyLoader.loadJSON = function (aFile, aApiToken, aDatastoreObject) {
            var deferObject = P.defer();
            if (aDatastoreObject != null && aDatastoreObject.get(aFile) != null) {
                deferObject.resolve(aDatastoreObject.get(aFile));
            }
            else {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", aFile, true);
                try {
                    xhr.responseType = "json";
                }
                catch (e) {
                    if (xhr.responseType !== "json" && xhr.responseText !== "json") {
                    }
                }
                if (aApiToken !== undefined && aApiToken.length > 0) {
                    xhr.setRequestHeader("Authorization", "Token token=" + aApiToken);
                }
                xhr.onerror = function (error) {
                    deferObject.reject(error);
                };
                xhr.onload = function () {
                    if (xhr.response !== null) {
                        var objToReturn;
                        if (typeof (xhr.response) === "string") {
                            objToReturn = JSON.parse(xhr.response);
                        }
                        else {
                            objToReturn = xhr.response;
                        }
                        if (aDatastoreObject !== undefined) {
                            aDatastoreObject.set(aFile, objToReturn);
                        }
                        deferObject.resolve(objToReturn);
                    }
                    else {
                        deferObject.reject(new Error("No valid JSON object was found (" +
                            xhr.status + " " + xhr.statusText + ")"));
                    }
                };
                xhr.send();
            }
            return deferObject.promise();
        };
        LazyLoader.loadFile = function (aFile) {
            var deferObject = P.defer(), xhr = new XMLHttpRequest();
            xhr.open("GET", aFile, true);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                if (xhr.response !== null) {
                    var objToReturn;
                    if (typeof (xhr.response) === "string") {
                        objToReturn = JSON.parse(xhr.response);
                    }
                    else {
                        objToReturn = xhr.response;
                    }
                    deferObject.resolve(objToReturn);
                }
                else {
                    deferObject.reject(new Error("No valid JSON object was found (" +
                        xhr.status + " " + xhr.statusText + ")"));
                }
            };
            xhr.send();
            return deferObject.promise();
        };
        LazyLoader.loadTemplate = function (aFile) {
            var deferObject = P.defer(), xhr = new XMLHttpRequest();
            xhr.open("GET", aFile, true);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                if (xhr.response !== null) {
                    deferObject.resolve(xhr.response);
                }
                else {
                    deferObject.reject(new Error("No valid JSON object was found (" +
                        xhr.status + " " + xhr.statusText + ")"));
                }
            };
            xhr.send();
            return deferObject.promise();
        };
        LazyLoader.sendJSON = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
            var deferObject = P.defer(), xhr = this.getXHRObject("POST", aFile, aSyncOrNot, aApiToken);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                LazyLoader.handleXHRReponse(xhr, deferObject);
            };
            xhr.send(JSON.stringify(aJsonObject));
            return deferObject.promise();
        };
        LazyLoader.updateJSON = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
            var deferObject = P.defer(), xhr = this.getXHRObject("PUT", aFile, aSyncOrNot, aApiToken);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                LazyLoader.handleXHRReponse(xhr, deferObject);
            };
            xhr.send(JSON.stringify(aJsonObject));
            return deferObject.promise();
        };
        LazyLoader.deleteRequest = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
            var deferObject = P.defer();
            var xhr = this.getXHRObject("DELETE", aFile, aSyncOrNot, aApiToken);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                deferObject.resolve(xhr.status);
            };
            xhr.send();
            return deferObject.promise();
        };
        LazyLoader.handleXHRReponse = function (requestObject, aDeferObject) {
            var requestResponse = requestObject.response;
            if (requestResponse !== null) {
                var objToReturn;
                if (typeof (requestResponse) === "string" && requestResponse !== "") {
                    objToReturn = JSON.parse(requestResponse);
                }
                else {
                    objToReturn = requestResponse;
                }
                aDeferObject.resolve(objToReturn);
            }
            else {
                aDeferObject.reject(new Error("No valid JSON object was found (" +
                    requestObject.status + " " + requestObject.statusText + ")"));
            }
        };
        LazyLoader.getXHRObject = function (aHttpOperation, aFile, aSyncOrNot, aApiToken) {
            var xhr = new XMLHttpRequest;
            xhr.open(aHttpOperation, aFile, aSyncOrNot);
            if (aApiToken !== undefined && aApiToken.length > 0) {
                xhr.setRequestHeader("Authorization", "Token token=" + aApiToken);
            }
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            return xhr;
        };
        return LazyLoader;
    })();
    return LazyLoader;
});

/***
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
define('assets/core/event/Event',["require", "exports"], function (require, exports) {
    var Event = (function () {
        function Event(aEventName, aBubble, aCancellable) {
            if (aBubble === void 0) { aBubble = true; }
            if (aCancellable === void 0) { aCancellable = false; }
            this.eventName = aEventName;
            this.bubble = aBubble;
            this.cancellable = aCancellable;
        }
        return Event;
    })();
    return Event;
});

/******
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/core/mouse/event/MouseTouchEvent',["require", "exports", "../../event/Event"], function (require, exports, Event) {
    var MouseTouchEvent = (function (_super) {
        __extends(MouseTouchEvent, _super);
        function MouseTouchEvent(aEventName) {
            _super.call(this, aEventName);
        }
        MouseTouchEvent.TOUCHED = "com.cortex.core.mouse.event.MouseTouchEvent::TEMPLATE_CLICKED";
        return MouseTouchEvent;
    })(Event);
    return MouseTouchEvent;
});

/******
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/core/mvc/event/MVCEvent',["require", "exports", "../../event/Event"], function (require, exports, Event) {
    var MVCEvent = (function (_super) {
        __extends(MVCEvent, _super);
        function MVCEvent(aEventName) {
            _super.call(this, aEventName);
        }
        MVCEvent.TEMPLATE_LOADED = "com.cortex.core.mvc.event.MVCEvent::TEMPLATE_LOADED";
        MVCEvent.JSON_LOADED = "com.cortex.core.mvc.event.MVCEvent::JSON_LOADED";
        return MVCEvent;
    })(Event);
    return MVCEvent;
});

/***
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright Cortex Media 2015
 *
 * @author Mathieu 'Sanchez' Cote
 */
define('assets/core/geom/Point',["require", "exports"], function (require, exports) {
    var Point = (function () {
        function Point(aX, aY) {
            if (aX === void 0) { aX = 0; }
            if (aY === void 0) { aY = 0; }
            this.mX = aX;
            this.mY = aY;
        }
        Point.prototype.Clone = function () {
            return (new Point(this.mX, this.mY));
        };
        Object.defineProperty(Point.prototype, "X", {
            get: function () { return (this.mX); },
            set: function (aValue) { this.mX = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "Y", {
            get: function () { return (this.mY); },
            set: function (aValue) { this.mY = aValue; },
            enumerable: true,
            configurable: true
        });
        Point.prototype.Add = function (aPoint) {
            this.mX += aPoint.X;
            this.mY += aPoint.Y;
            return this;
        };
        Point.prototype.Subtract = function (aPoint) {
            this.mX -= aPoint.X;
            this.mY -= aPoint.Y;
            return this;
        };
        Point.prototype.Multiply = function (aValue) {
            this.mX *= aValue;
            this.mY *= aValue;
            return this;
        };
        Point.prototype.Invert = function () {
            this.mX *= -1;
            this.mY *= -1;
            return this;
        };
        Point.prototype.IsEqual = function (aPoint) {
            return this.mX === aPoint.X && this.mY === aPoint.Y;
        };
        Point.prototype.toString = function () {
            return (this.mX + ", " + this.mY);
        };
        return Point;
    })();
    return Point;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/core/mouse/TouchBehavior',["require", "exports", "../event/EventDispatcher", "./event/MouseTouchEvent", "../geom/Point"], function (require, exports, EventDispatcher, MouseTouchEvent, Point) {
    var AbstractView = (function (_super) {
        __extends(AbstractView, _super);
        function AbstractView() {
            _super.call(this);
            this.mElementList = new Array();
            this.mMousePosition = new Point();
        }
        AbstractView.prototype.Destroy = function () {
            for (var i = 0; i < this.mElementList.length; i++) {
                this.RemoveClickControl(this.mElementList[i]);
            }
            this.mElementList.length = 0;
            this.mElementList = null;
            this.mLastTouchEvent = null;
            this.mMousePosition = null;
        };
        AbstractView.prototype.AddClickControl = function (aElement) {
            this.mElementList.push(aElement);
            aElement.addEventListener("touchstart", this.OnTouchStart.bind(this));
            aElement.addEventListener("touchmove", this.OnTouchMove.bind(this));
            aElement.addEventListener("touchend", this.OnTouchEnd.bind(this));
            aElement.addEventListener("mousedown", this.OnMouseDown.bind(this));
            aElement.addEventListener("mouseup", this.OnMouseUp.bind(this));
        };
        AbstractView.prototype.RemoveClickControl = function (aElement) {
            var elementIndex = this.mElementList.indexOf(aElement);
            var element = this.mElementList[elementIndex];
            element.removeEventListener("touchstart", this.OnTouchStart.bind(this));
            element.removeEventListener("touchmove", this.OnTouchMove.bind(this));
            element.removeEventListener("touchend", this.OnTouchEnd.bind(this));
            element.removeEventListener("mousedown", this.OnMouseDown.bind(this));
            element.removeEventListener("mouseup", this.OnMouseUp.bind(this));
            this.mElementList.splice(elementIndex, 1);
        };
        AbstractView.prototype.OnMouseDown = function (aEvent) {
        };
        AbstractView.prototype.OnMouseUp = function (aEvent) {
            var touchEvent = new MouseTouchEvent(MouseTouchEvent.TOUCHED);
            touchEvent.target = aEvent.target;
            touchEvent.currentTarget = aEvent.currentTarget;
            this.DispatchEvent(touchEvent);
        };
        AbstractView.prototype.OnTouchStart = function (aEvent) {
            this.mLastTouchEvent = aEvent;
            this.mTouchTarget = aEvent.target;
            var firstTouch = aEvent.targetTouches.item(0);
            this.mMousePosition.X = firstTouch.clientX || firstTouch.pageX;
            this.mMousePosition.Y = firstTouch.clientY || firstTouch.pageY;
        };
        AbstractView.prototype.OnTouchMove = function (aEvent) {
            this.mLastTouchEvent = aEvent;
        };
        AbstractView.prototype.OnTouchEnd = function (aEvent) {
            var endTouch = this.mLastTouchEvent.targetTouches.item(0);
            var endTouchX = endTouch.clientX || endTouch.pageX;
            var endTouchY = endTouch.clientY || endTouch.pageY;
            if (this.mTouchTarget === this.mLastTouchEvent.target &&
                this.mMousePosition.X === endTouchX &&
                this.mMousePosition.Y === endTouchY) {
                var touchEvent = new MouseTouchEvent(MouseTouchEvent.TOUCHED);
                touchEvent.target = aEvent.target;
                touchEvent.currentTarget = aEvent.currentTarget;
                this.DispatchEvent(touchEvent);
            }
        };
        return AbstractView;
    })(EventDispatcher);
    return AbstractView;
});

/******
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/core/mvc/AbstractView',["require", "exports", "../net/LazyLoader", "../event/EventDispatcher", "../mouse/event/MouseTouchEvent", "./event/MVCEvent", "../mouse/TouchBehavior"], function (require, exports, LazyLoader, EventDispatcher, MouseTouchEvent, MVCEvent, TouchBehavior) {
    var AbstractView = (function (_super) {
        __extends(AbstractView, _super);
        function AbstractView(aID) {
            if (aID === void 0) { aID = ""; }
            _super.call(this);
            this.mID = aID;
        }
        AbstractView.prototype.Destroy = function () {
            this.mTouchBehavior.Destroy();
            this.mTouchBehavior = null;
            this.mData = null;
            this.mTemplateHTML = null;
        };
        AbstractView.prototype.LoadTemplate = function (aTemplatePath) {
            var _this = this;
            var promise = LazyLoader.loadTemplate(aTemplatePath);
            promise.then(function () { return _this.OnTemplateLoaded(promise.result); });
        };
        Object.defineProperty(AbstractView.prototype, "Data", {
            get: function () { return this.mData; },
            set: function (aData) { this.mData = aData; },
            enumerable: true,
            configurable: true
        });
        AbstractView.prototype.RenderTemplate = function (aData) {
            this.Data = aData;
            if (this.mTemplate == "") {
                this.mTemplateHTML = "TEMPLATE IS EMPTY";
            }
            else {
                this.mTemplateHTML = tmpl(this.mTemplate, aData);
            }
            return this.mTemplateHTML;
        };
        AbstractView.prototype.AddClickControl = function (aElement) {
            if (this.mTouchBehavior == null) {
                this.mTouchBehavior = new TouchBehavior();
            }
            this.mTouchBehavior.AddClickControl(aElement);
            this.mTouchBehavior.AddEventListener(MouseTouchEvent.TOUCHED, this.OnTouched, this);
        };
        AbstractView.prototype.RemoveClickControl = function (aElement) {
            this.mTouchBehavior.RemoveClickControl(aElement);
        };
        Object.defineProperty(AbstractView.prototype, "ID", {
            get: function () { return (this.mID); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractView.prototype, "Template", {
            get: function () { return (this.mTemplate); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractView.prototype, "TemplateHTML", {
            get: function () { return (this.mTemplateHTML); },
            enumerable: true,
            configurable: true
        });
        AbstractView.prototype.OnTemplateLoaded = function (aTemplate) {
            this.mTemplate = aTemplate;
            this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
        };
        AbstractView.prototype.OnTouched = function (aEvent) {
            this.DispatchEvent(aEvent);
        };
        return AbstractView;
    })(EventDispatcher);
    return AbstractView;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/core/mvc/AbstractModel',["require", "exports", "../event/EventDispatcher", "../net/LazyLoader", "./event/MVCEvent"], function (require, exports, EventDispatcher, LazyLoader, MVCEvent) {
    var AbstractModel = (function (_super) {
        __extends(AbstractModel, _super);
        function AbstractModel() {
            this.mDataCache = {};
            _super.call(this);
        }
        AbstractModel.prototype.Fetch = function (aURL, aForceRefresh) {
            var _this = this;
            if (aForceRefresh === void 0) { aForceRefresh = false; }
            if (!aForceRefresh && this.mDataCache[aURL] != null) {
                this.OnJSONLoadSuccess(this.mDataCache[aURL], aURL);
                return;
            }
            var promise = LazyLoader.loadJSON(aURL);
            promise.then(function () { return _this.OnJSONLoadSuccess(promise.result, aURL); });
            promise.fail(function () { return _this.OnJSONLoadError(aURL); });
        };
        AbstractModel.prototype.GetData = function (aURL) {
            return this.mDataCache[aURL];
        };
        AbstractModel.prototype.OnJSONLoadError = function (aURL) {
            console.log("There was an error loading, ", aURL);
        };
        AbstractModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
            this.mDataCache[aURL] = aJSONData;
            this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
        };
        return AbstractModel;
    })(EventDispatcher);
    return AbstractModel;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
define('assets/livreouvert/team/data/Team',["require", "exports"], function (require, exports) {
    var Team = (function () {
        function Team() {
            this.mDepartmentList = new Array();
        }
        Object.defineProperty(Team.prototype, "ID", {
            get: function () { return this.mID; },
            set: function (aValue) { this.mID = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "URL", {
            get: function () { return this.mURL; },
            set: function (aValue) { this.mURL = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "DepartmentList", {
            get: function () { return this.mDepartmentList; },
            enumerable: true,
            configurable: true
        });
        Team.prototype.FromJSON = function (aData) {
            this.ID = aData.route_id;
        };
        return Team;
    })();
    return Team;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/team/TeamModel',["require", "exports", "../../core/mvc/AbstractModel", "./data/Team"], function (require, exports, AbstractModel, Team) {
    var TeamModel = (function (_super) {
        __extends(TeamModel, _super);
        function TeamModel() {
            _super.call(this);
        }
        TeamModel.prototype.CreateTeam = function (aTeamName) {
            this.mTeam = new Team();
            this.mTeam.Name = aTeamName;
        };
        TeamModel.prototype.GetTeam = function () { return this.mTeam; };
        TeamModel.prototype.ValidateTeamName = function (aTeamName) {
            // validate team name on server
            return (false);
        };
        TeamModel.GetInstance = function () {
            if (TeamModel.mInstance == null) {
                TeamModel.mInstance = new TeamModel();
            }
            return TeamModel.mInstance;
        };
        return TeamModel;
    })(AbstractModel);
    return TeamModel;
});

/******
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/team/event/TeamEvent',["require", "exports", "../../../core/event/Event"], function (require, exports, Event) {
    var TeamEvent = (function (_super) {
        __extends(TeamEvent, _super);
        function TeamEvent(aEventName) {
            _super.call(this, aEventName);
        }
        TeamEvent.SHOW_DEPARTMENT = "com.cortex.template.team.event.TeamEvent::SHOW_DEPARTMENT";
        return TeamEvent;
    })(Event);
    return TeamEvent;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright Cortex Media 2015
 *
 * @author Jonathan Roy
 */
define('assets/core/ui/GraphicValidator',["require", "exports"], function (require, exports) {
    var GraphicValidator = (function () {
        function GraphicValidator() {
        }
        GraphicValidator.ShowInputErrorMessage = function (aInputID, aMessage) {
            var inputErrorContainer = document.createElement("div");
            var triangleElement = document.createElement("div");
            var inputElement = document.getElementById(aInputID);
            triangleElement.className = "triangle-error";
            inputErrorContainer.id = aInputID + "Error";
            inputErrorContainer.className = "error-message-input";
            inputErrorContainer.textContent = aMessage;
            inputErrorContainer.appendChild(triangleElement);
            inputErrorContainer.style.width = String(inputElement.clientWidth) + "px";
            inputElement.parentNode.insertBefore(inputErrorContainer, inputElement.nextSibling);
            inputElement.style.borderColor = "#d7564d";
        };
        GraphicValidator.HideInputErrorMessage = function (aInputID) {
            var inputErrorElement = document.getElementById(aInputID + "Error");
            if (inputErrorElement == null) {
                return;
            }
            var inputElement = document.getElementById(aInputID);
            inputElement.parentElement.removeChild(document.getElementById(aInputID + "Error"));
            inputElement.style.borderColor = "";
        };
        GraphicValidator.ShowErrorMessageAtContainer = function (idElement, msg) {
            var errorContainer = document.createElement("div");
            var container = document.getElementById(idElement);
            errorContainer.className = "error-message-container";
            errorContainer.textContent = msg;
            container.appendChild(errorContainer);
        };
        GraphicValidator.RemovesAllErrorMessages = function () {
            var errorMessages = document.querySelectorAll(".error-message-input, .error-message-container");
            var errorMessageLength = errorMessages.length;
            if (errorMessageLength > 0) {
                for (var i = 0; i < errorMessageLength; i++) {
                    errorMessages[i].parentNode.removeChild(errorMessages[i]);
                }
                var lengthErrorInputElements = this.errorInputElements.length;
                if (lengthErrorInputElements > 0) {
                    for (i = 0; i < lengthErrorInputElements; i++) {
                        this.errorInputElements[i].removeAttribute("style");
                    }
                    this.errorInputElements = [];
                }
            }
        };
        GraphicValidator.errorInputElements = [];
        return GraphicValidator;
    })();
    return GraphicValidator;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/team/TeamController',["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "./TeamModel", "./event/TeamEvent", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager"], function (require, exports, AbstractController, AbstractView, TeamModel, TeamEvent, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager) {
    var TeamController = (function (_super) {
        __extends(TeamController, _super);
        function TeamController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        TeamController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mTeamView = new AbstractView();
            this.mTeamView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mTeamView.LoadTemplate("templates/team/team.html");
        };
        TeamController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("teamView"));
            this.mTeamInput = null;
            this.mTeamView.Destroy();
            this.mTeamView = null;
        };
        TeamController.prototype.GetRouteList = function () { return TeamController.mRouteList; };
        TeamController.prototype.OnTemplateLoaded = function (aEvent) {
            document.getElementById("core").innerHTML += this.mTeamView.RenderTemplate({});
            this.mTeamView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mTeamInput = document.getElementById("teamName");
            this.mTeamInput.addEventListener("focusout", this.OnTeamNameFocusOut.bind(this));
            this.mTeamView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mTeamView.AddClickControl(document.getElementById("createAccount"));
        };
        TeamController.prototype.OnTeamNameFocusOut = function (aEvent) {
            GraphicValidator.HideInputErrorMessage("teamName");
            var teamName = this.mTeamInput.value;
            if (teamName == "") {
                GraphicValidator.ShowInputErrorMessage("teamName", "team name cannot be empty");
            }
            else if (TeamModel.GetInstance().ValidateTeamName(teamName)) {
                GraphicValidator.ShowInputErrorMessage("teamName", "team name is already taken");
            }
        };
        TeamController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "createAccount") {
                TeamModel.GetInstance().CreateTeam(this.mTeamInput.value);
                this.DispatchEvent(new TeamEvent(TeamEvent.SHOW_DEPARTMENT));
            }
        };
        TeamController.mRouteList = ["team"];
        return TeamController;
    })(AbstractController);
    return TeamController;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/core/component/ListComponent',["require", "exports", "../mvc/event/MVCEvent", "../event/EventDispatcher"], function (require, exports, MVCEvent, EventDispatcher) {
    var ListComponent = (function (_super) {
        __extends(ListComponent, _super);
        function ListComponent() {
            _super.call(this);
        }
        ListComponent.prototype.Init = function (aComponentListID) {
            this.mComponentDataBinding = new Array();
            this.mComponentCreated = 0;
            this.mComponentListHTML = document.getElementById(aComponentListID);
        };
        ListComponent.prototype.Destroy = function () {
            this.mComponentDataBinding.length = 0;
            this.mComponentDataBinding = null;
            this.mComponentListHTML = null;
        };
        Object.defineProperty(ListComponent.prototype, "ComponentListHTML", {
            get: function () { return (this.mComponentListHTML); },
            enumerable: true,
            configurable: true
        });
        ListComponent.prototype.GetDataList = function () {
            var dataList = new Array();
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                dataList.push(this.mComponentDataBinding[i].data);
            }
            return (dataList);
        };
        ListComponent.prototype.GetDataByComponent = function (aComponent) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].component == aComponent) {
                    return (this.mComponentDataBinding[i].data);
                }
            }
            return (null);
        };
        ListComponent.prototype.GetDataByID = function (aID) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].data.ID == aID) {
                    return (this.mComponentDataBinding[i].data);
                }
            }
            return (null);
        };
        ListComponent.prototype.GetComponentByData = function (aData) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].data == aData) {
                    return (this.mComponentDataBinding[i].component);
                }
            }
            return (null);
        };
        ListComponent.prototype.GetComponentByID = function (aID) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].data.ID == aID) {
                    return (this.mComponentDataBinding[i].component);
                }
            }
            return (null);
        };
        ListComponent.prototype.AddComponent = function (aComponentView, aTemplate, aData, aKeepID) {
            if (aKeepID === void 0) { aKeepID = false; }
            if (!aKeepID) {
                aData.ID = this.mComponentCreated.toString();
                this.mComponentCreated++;
            }
            aComponentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnComponentTemplateLoaded, this);
            aComponentView.LoadTemplate(aTemplate);
            this.mComponentDataBinding.push({ component: aComponentView, data: aData });
        };
        ListComponent.prototype.OnComponentTemplateLoaded = function (aEvent) {
            var componentView = aEvent.target;
            var componentData = this.GetDataByComponent(componentView);
            this.mComponentListHTML.insertAdjacentHTML("beforeend", componentView.RenderTemplate(componentData));
        };
        ListComponent.prototype.RemoveComponent = function (aElementIDList, aComponent) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].component == aComponent) {
                    break;
                }
            }
            this.mComponentDataBinding.splice(i, 1);
            for (var j = 0; j < aElementIDList.length; j++) {
                var componentToRemoveHTML = document.getElementById(aElementIDList[j]);
                this.mComponentListHTML.removeChild(componentToRemoveHTML);
            }
        };
        return ListComponent;
    })(EventDispatcher);
    return ListComponent;
});

/******
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/project/event/ProjectEvent',["require", "exports", "../../../core/event/Event"], function (require, exports, Event) {
    var ProjectEvent = (function (_super) {
        __extends(ProjectEvent, _super);
        function ProjectEvent(aEventName) {
            _super.call(this, aEventName);
        }
        ProjectEvent.SHOW_PROJECT_CREATION = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_CREATION";
        ProjectEvent.SHOW_PROJECT_LIST = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_LIST";
        ProjectEvent.SHOW_PROJECT_EDIT = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_EDIT";
        ProjectEvent.SHOW_EVALUATION = "com.cortex.template.project.event.ProjectEvent::SHOW_EVALUATION";
        return ProjectEvent;
    })(Event);
    return ProjectEvent;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/project/ProjectModel',["require", "exports", "../../core/mvc/AbstractModel"], function (require, exports, AbstractModel) {
    var ProjectModel = (function (_super) {
        __extends(ProjectModel, _super);
        function ProjectModel() {
            _super.call(this);
            this.mProjectList = new Array();
        }
        ProjectModel.prototype.AddProject = function (aProject) {
            this.mSelectedProject = aProject;
            this.mProjectList.push(aProject);
        };
        ProjectModel.prototype.GetProjectList = function () {
            return this.mProjectList;
        };
        Object.defineProperty(ProjectModel.prototype, "SelectedProject", {
            get: function () { return this.mSelectedProject; },
            set: function (aValue) { this.mSelectedProject = aValue; },
            enumerable: true,
            configurable: true
        });
        ProjectModel.GetInstance = function () {
            if (ProjectModel.mInstance == null) {
                ProjectModel.mInstance = new ProjectModel();
            }
            return ProjectModel.mInstance;
        };
        return ProjectModel;
    })(AbstractModel);
    return ProjectModel;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/project/ProjectListController',["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/navigation/NavigationManager", "../../core/component/ListComponent", "./event/ProjectEvent", "./ProjectModel"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, NavigationManager, ListComponent, ProjectEvent, ProjectModel) {
    var ProjectListController = (function (_super) {
        __extends(ProjectListController, _super);
        function ProjectListController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        ProjectListController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mProjectView = new AbstractView();
            this.mProjectView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mProjectView.LoadTemplate("templates/project/projectListView.html");
        };
        ProjectListController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("projectListView"));
            this.mListComponent.Destroy();
            this.mListComponent = null;
            this.mProjectView.Destroy();
            this.mProjectView = null;
        };
        ProjectListController.prototype.GetRouteList = function () { return ProjectListController.mRouteList; };
        ProjectListController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mProjectView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").innerHTML += this.mProjectView.RenderTemplate({});
            this.mListComponent = new ListComponent();
            this.mListComponent.Init("projectList");
            this.mProjectView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mProjectView.AddClickControl(document.getElementById("addProject"));
            this.GenerateProjectList();
        };
        ProjectListController.prototype.GenerateProjectList = function () {
            var projectList = ProjectModel.GetInstance().GetProjectList();
            var projectListLength = projectList.length;
            for (var i = 0; i < projectListLength; i++) {
                var project = new AbstractView();
                project.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnProjectTemplateLoaded, this);
                this.mListComponent.AddComponent(project, "templates/project/project.html", projectList[i]);
            }
        };
        ProjectListController.prototype.OnProjectTemplateLoaded = function (aEvent) {
            var project = this.mListComponent.GetDataByComponent(aEvent.target);
            this.mProjectView.AddClickControl(document.getElementById("edit" + project.ID));
        };
        ProjectListController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addProject") {
                this.AddProject();
            }
            else if (element.id.indexOf("edit") >= 0) {
                var projectID = element.id.split("edit")[1];
                ProjectModel.GetInstance().SelectedProject = this.mListComponent.GetDataByID(projectID);
                this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
            }
        };
        ProjectListController.prototype.AddProject = function () {
            this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_CREATION));
        };
        ProjectListController.mRouteList = ["project"];
        return ProjectListController;
    })(AbstractController);
    return ProjectListController;
});

define('assets/core/component/data/ComponentData',["require", "exports"], function (require, exports) {
    var ComponentData = (function () {
        function ComponentData() {
        }
        Object.defineProperty(ComponentData.prototype, "ID", {
            get: function () { return this.mID; },
            set: function (aValue) { this.mID = aValue; },
            enumerable: true,
            configurable: true
        });
        ComponentData.prototype.FromJSON = function (aData) {
        };
        ComponentData.prototype.ToJSON = function () {
        };
        return ComponentData;
    })();
    return ComponentData;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/project/data/Project',["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComponentData) {
    var Project = (function (_super) {
        __extends(Project, _super);
        function Project() {
            _super.call(this);
            this.mEvaluationList = new Array();
        }
        Project.prototype.Destroy = function () {
            var evaluationListLength = this.mEvaluationList.length;
            for (var i = 0; i < evaluationListLength; i++) {
                this.mEvaluationList[i].Destroy();
            }
            this.mEvaluationList.length = 0;
            this.mEvaluationList = null;
        };
        Object.defineProperty(Project.prototype, "Client", {
            get: function () { return this.mClient; },
            set: function (aValue) { this.mClient = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "Description", {
            get: function () { return this.mDescription; },
            set: function (aValue) { this.mDescription = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "URL", {
            get: function () { return this.mURL; },
            set: function (aValue) { this.mURL = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "EvaluationList", {
            get: function () { return this.mEvaluationList; },
            set: function (aValue) { this.mEvaluationList = aValue; },
            enumerable: true,
            configurable: true
        });
        return Project;
    })(ComponentData);
    return Project;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/project/ProjectCreationController',["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager", "./ProjectModel", "./data/Project", "./event/ProjectEvent"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager, ProjectModel, Project, ProjectEvent) {
    var ProjectCreationController = (function (_super) {
        __extends(ProjectCreationController, _super);
        function ProjectCreationController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        ProjectCreationController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mProjectCreationView = new AbstractView();
            this.mProjectCreationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mProjectCreationView.LoadTemplate("templates/project/projectCreationView.html");
        };
        ProjectCreationController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("projectCreationView"));
            this.mProjectCreationView.Destroy();
            this.mProjectCreationView = null;
        };
        ProjectCreationController.prototype.GetRouteList = function () { return ProjectCreationController.mRouteList; };
        ProjectCreationController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mProjectCreationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").innerHTML += this.mProjectCreationView.RenderTemplate({});
            this.mProjectCreationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mProjectCreationView.AddClickControl(document.getElementById("create"));
            this.mProjectCreationView.AddClickControl(document.getElementById("delete"));
            document.getElementById("clientName").addEventListener("focusout", this.OnClientNameFocusOut.bind(this));
            document.getElementById("projectName").addEventListener("focusout", this.OnProjectNameFocusOut.bind(this));
        };
        ProjectCreationController.prototype.ValidateInput = function (aInput) {
            GraphicValidator.HideInputErrorMessage(aInput.id);
            if (aInput.value == "") {
                GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");
                return (false);
            }
            return (true);
        };
        ProjectCreationController.prototype.OnClientNameFocusOut = function (aEvent) {
            var input = aEvent.target;
            this.mClientNameValid = this.ValidateInput(input);
        };
        ProjectCreationController.prototype.OnProjectNameFocusOut = function (aEvent) {
            var input = aEvent.target;
            this.mProjectNameValid = this.ValidateInput(input);
        };
        ProjectCreationController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "create") {
                this.CreateProject();
            }
            else if (element.id == "delete") {
                this.DeleteProject();
            }
        };
        ProjectCreationController.prototype.CreateProject = function () {
            if (!this.mClientNameValid || !this.mProjectNameValid) {
                return;
            }
            var project = new Project();
            project.Client = document.getElementById("clientName").value;
            project.Name = document.getElementById("projectName").value;
            project.Description = document.getElementById("projectDescription").value;
            ProjectModel.GetInstance().AddProject(project);
            this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
        };
        ProjectCreationController.prototype.DeleteProject = function () {
            this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST));
        };
        ProjectCreationController.mRouteList = ["projectCreation"];
        return ProjectCreationController;
    })(AbstractController);
    return ProjectCreationController;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/project/ProjectEditController',["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager", "./ProjectModel", "./event/ProjectEvent"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager, ProjectModel, ProjectEvent) {
    var ProjectEditController = (function (_super) {
        __extends(ProjectEditController, _super);
        function ProjectEditController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        ProjectEditController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mProjectCreationView = new AbstractView();
            this.mProjectCreationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mProjectCreationView.LoadTemplate("templates/project/projectEditView.html");
        };
        ProjectEditController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("projectEditView"));
            this.mProjectCreationView.Destroy();
            this.mProjectCreationView = null;
        };
        ProjectEditController.prototype.GetRouteList = function () { return ProjectEditController.mRouteList; };
        ProjectEditController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mProjectCreationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").innerHTML += this.mProjectCreationView.RenderTemplate(ProjectModel.GetInstance().SelectedProject);
            this.mProjectCreationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mProjectCreationView.AddClickControl(document.getElementById("backToProjectList"));
            this.mProjectCreationView.AddClickControl(document.getElementById("addEvaluation"));
        };
        ProjectEditController.prototype.ValidateInput = function (aInput) {
            GraphicValidator.HideInputErrorMessage(aInput.id);
            if (aInput.value == "") {
                GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");
                return (false);
            }
            return (true);
        };
        ProjectEditController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "backToProjectList") {
                this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST));
            }
            else if (element.id == "addEvaluation") {
                this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_EVALUATION));
            }
        };
        ProjectEditController.mRouteList = ["projectEdit"];
        return ProjectEditController;
    })(AbstractController);
    return ProjectEditController;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/department/data/Department',["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComportentData) {
    var Department = (function (_super) {
        __extends(Department, _super);
        function Department() {
            _super.call(this);
            this.mUserList = new Array();
        }
        Object.defineProperty(Department.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Department.prototype, "HourlyRate", {
            get: function () { return this.mHourlyRate; },
            set: function (aValue) { this.mHourlyRate = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Department.prototype, "UserList", {
            get: function () { return this.mUserList; },
            enumerable: true,
            configurable: true
        });
        return Department;
    })(ComportentData);
    return Department;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/department/DepartmentModel',["require", "exports", "../../core/mvc/AbstractModel", "./data/Department", "../team/TeamModel"], function (require, exports, AbstractModel, Department, TeamModel) {
    var DepartmentModel = (function (_super) {
        __extends(DepartmentModel, _super);
        function DepartmentModel() {
            _super.call(this);
        }
        DepartmentModel.prototype.CreateDepartment = function (aDepartmentName) {
            var department = new Department();
            department.Name = aDepartmentName;
            this.AddDepartment(department);
        };
        DepartmentModel.prototype.AddDepartment = function (aDepartment) {
            TeamModel.GetInstance().GetTeam().DepartmentList.push(aDepartment);
        };
        DepartmentModel.prototype.GetDepartmentList = function () {
            return TeamModel.GetInstance().GetTeam().DepartmentList;
        };
        DepartmentModel.prototype.GetDepartmentByName = function (aDepartmentName) {
            var departmentList = this.GetDepartmentList();
            for (var i = 0; i < departmentList.length; i++) {
                if (departmentList[i].Name == aDepartmentName) {
                    return (departmentList[i]);
                }
            }
            return (null);
        };
        DepartmentModel.GetInstance = function () {
            if (DepartmentModel.mInstance == null) {
                DepartmentModel.mInstance = new DepartmentModel();
            }
            return DepartmentModel.mInstance;
        };
        return DepartmentModel;
    })(AbstractModel);
    return DepartmentModel;
});

/******
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/department/event/DepartmentEvent',["require", "exports", "../../../core/event/Event"], function (require, exports, Event) {
    var DepartmentEvent = (function (_super) {
        __extends(DepartmentEvent, _super);
        function DepartmentEvent(aEventName) {
            _super.call(this, aEventName);
        }
        DepartmentEvent.SHOW_USER = "com.cortex.template.department.event.DepartmentEvent::SHOW_USER";
        return DepartmentEvent;
    })(Event);
    return DepartmentEvent;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/department/DepartmentController',["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/component/ListComponent", "./DepartmentModel", "./data/Department", "./event/DepartmentEvent", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager"], function (require, exports, AbstractController, AbstractView, ListComponent, DepartmentModel, Department, DepartmentEvent, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager) {
    var DepartmentController = (function (_super) {
        __extends(DepartmentController, _super);
        function DepartmentController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        DepartmentController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mDepartmentView = new AbstractView();
            this.mDepartmentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mDepartmentView.LoadTemplate("templates/department/departmentView.html");
        };
        DepartmentController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("departmentView"));
            this.mListComponent.Destroy();
            this.mListComponent = null;
            this.mDepartmentView.Destroy();
            this.mDepartmentView = null;
        };
        DepartmentController.prototype.GetRouteList = function () { return DepartmentController.mRouteList; };
        DepartmentController.prototype.OnTemplateLoaded = function (aEvent) {
            document.getElementById("core").innerHTML += this.mDepartmentView.RenderTemplate({});
            this.mListComponent = new ListComponent();
            this.mListComponent.Init("departmentList");
            this.mDepartmentView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            ;
            this.mDepartmentView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mDepartmentView.AddClickControl(document.getElementById("addDepartment"));
            this.mDepartmentView.AddClickControl(document.getElementById("createDepartment"));
        };
        DepartmentController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addDepartment") {
                this.AddDepartment();
            }
            else if (element.id.indexOf("delete") >= 0) {
                this.DeleteDepartment(element.id);
            }
            else if (element.id == "createDepartment") {
                this.CreateDepartmentList();
            }
        };
        DepartmentController.prototype.CreateDepartmentList = function () {
            var departmentList = this.mListComponent.GetDataList();
            var departmentListLength = departmentList.length;
            for (var i = 0; i < departmentListLength; i++) {
                var department = departmentList[i];
                if (department.Name == "") {
                    return;
                }
            }
            for (var i = 0; i < departmentListLength; i++) {
                DepartmentModel.GetInstance().AddDepartment(departmentList[i]);
            }
            this.DispatchEvent(new DepartmentEvent(DepartmentEvent.SHOW_USER));
        };
        DepartmentController.prototype.AddDepartment = function () {
            var department = new AbstractView();
            department.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
            this.mListComponent.AddComponent(department, "templates/department/department.html", new Department());
        };
        DepartmentController.prototype.DeleteDepartment = function (aElementID) {
            var departmentIndex = aElementID.split("delete")[1];
            this.mListComponent.RemoveComponent(["department" + departmentIndex], this.mListComponent.GetComponentByID(departmentIndex));
        };
        DepartmentController.prototype.OnDepartmentTemplateLoaded = function (aEvent) {
            var department = this.mListComponent.GetDataByComponent(aEvent.target);
            this.mDepartmentView.AddClickControl(document.getElementById("delete" + department.ID));
            document.getElementById("input" + department.ID).addEventListener("focusout", this.OnDepartmentInputFocusOut.bind(this));
        };
        DepartmentController.prototype.OnDepartmentInputFocusOut = function (aEvent) {
            var input = aEvent.target;
            GraphicValidator.HideInputErrorMessage(input.id);
            var departmentID = input.id.split("input")[1];
            var department = this.mListComponent.GetDataByID(departmentID);
            if (input.value == "") {
                GraphicValidator.ShowInputErrorMessage(input.id, "input cannot be empty");
            }
            else {
                department.Name = input.value;
            }
        };
        DepartmentController.mRouteList = ["department"];
        return DepartmentController;
    })(AbstractController);
    return DepartmentController;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/evaluation/data/Evaluation',["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComponentData) {
    var Evaluation = (function (_super) {
        __extends(Evaluation, _super);
        function Evaluation() {
            _super.call(this);
            this.mFeatureList = new Array();
            this.mDepartmentList = new Array();
        }
        Evaluation.prototype.Destroy = function () {
            var featureListLength = this.mFeatureList.length;
            for (var i = 0; i < featureListLength; i++) {
                this.mFeatureList[i].Destroy();
            }
            this.mFeatureList.length = 0;
            this.mFeatureList = null;
            this.mDepartmentList.length = 0;
            this.mDepartmentList = null;
        };
        Object.defineProperty(Evaluation.prototype, "Client", {
            get: function () { return this.mClient; },
            set: function (aValue) { this.mClient = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Evaluation.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Evaluation.prototype, "Description", {
            get: function () { return this.mDescription; },
            set: function (aValue) { this.mDescription = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Evaluation.prototype, "FeatureList", {
            get: function () { return this.mFeatureList; },
            set: function (aValue) { this.mFeatureList = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Evaluation.prototype, "DepartmentList", {
            get: function () { return this.mDepartmentList; },
            set: function (aValue) { this.mDepartmentList = aValue; },
            enumerable: true,
            configurable: true
        });
        return Evaluation;
    })(ComponentData);
    return Evaluation;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright Cortex Media 2015
 *
 * @author Mathieu Rhéaume
 */
define('assets/core/ui/DomManipulator',["require", "exports"], function (require, exports) {
    var DomManipulator = (function () {
        function DomManipulator() {
        }
        DomManipulator.CreateElement = function (aElementType, aTextToAppend, aClassName, aNodeToAppendTo) {
            if (aTextToAppend === void 0) { aTextToAppend = ""; }
            if (aClassName === void 0) { aClassName = ""; }
            var newHTMLElement = document.createElement(aElementType);
            newHTMLElement.textContent = aTextToAppend;
            newHTMLElement.className = aClassName;
            if (aNodeToAppendTo != null) {
                aNodeToAppendTo.appendChild(newHTMLElement);
            }
            return newHTMLElement;
        };
        DomManipulator.CreateElementWithChild = function (aElementType, aClassName, aTextToAppend, aChildList) {
            var element = document.createElement(aElementType);
            element.className = aClassName;
            if (aTextToAppend != null) {
                var textNode = document.createTextNode(aTextToAppend);
                aChildList.push(textNode);
            }
            if (aChildList != null) {
                var childListLength = aChildList.length;
                for (var i = 0; i < childListLength; i++) {
                    element.appendChild(aChildList[i]);
                }
            }
            return element;
        };
        DomManipulator.CreateOptionElement = function (aTextToAppend, aValue) {
            var optionElement = DomManipulator.CreateElement("option", aTextToAppend);
            optionElement.value = aValue;
            return optionElement;
        };
        DomManipulator.CreateListOfElement = function (aStringToAppendList, aCoreListType, aElementType) {
            if (aCoreListType === void 0) { aCoreListType = "ul"; }
            if (aElementType === void 0) { aElementType = "li"; }
            var newHTMLList = document.createElement(aCoreListType);
            var stringToAppendListLength = aStringToAppendList.length;
            var newLi;
            for (var i = 0; i < stringToAppendListLength; i = i + 1) {
                newLi = document.createElement(aElementType);
                newLi.appendChild(document.createTextNode(aStringToAppendList[i]));
                newHTMLList.appendChild(newLi);
            }
            return newHTMLList;
        };
        DomManipulator.SetTextOfElementById = function (aId, aText) {
            var element = document.getElementById(aId);
            element.textContent = aText;
        };
        return DomManipulator;
    })();
    return DomManipulator;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/evaluation/data/Task',["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComponentData) {
    var Task = (function (_super) {
        __extends(Task, _super);
        function Task() {
            _super.call(this);
            this.mRisk = 0;
            this.mQuantity = 0;
            this.mHourList = new Array();
        }
        Task.prototype.Destroy = function () {
            this.mHourList.length = 0;
            this.mHourList = null;
        };
        Object.defineProperty(Task.prototype, "FeatureID", {
            get: function () { return this.mFeatureID; },
            set: function (aValue) { this.mFeatureID = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Description", {
            get: function () { return this.mDescription; },
            set: function (aValue) { this.mDescription = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Evaluate", {
            get: function () { return this.mEvaluate; },
            set: function (aValue) { this.mEvaluate = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Risk", {
            get: function () { return this.mRisk; },
            set: function (aValue) { this.mRisk = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Quantity", {
            get: function () { return this.mQuantity; },
            set: function (aValue) { this.mQuantity = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "HourList", {
            get: function () { return this.mHourList; },
            enumerable: true,
            configurable: true
        });
        return Task;
    })(ComponentData);
    return Task;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/evaluation/data/Hour',["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComponentData) {
    var Hour = (function (_super) {
        __extends(Hour, _super);
        function Hour(aDepartmentID, aExecutionTime) {
            _super.call(this);
            this.mDepartmentID = aDepartmentID;
            this.mExecutionTime = aExecutionTime;
        }
        Object.defineProperty(Hour.prototype, "DepartmentID", {
            get: function () { return this.mDepartmentID; },
            set: function (aValue) { this.mDepartmentID = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hour.prototype, "ExecutionTime", {
            get: function () { return this.mExecutionTime; },
            set: function (aValue) { this.mExecutionTime = aValue; },
            enumerable: true,
            configurable: true
        });
        return Hour;
    })(ComponentData);
    return Hour;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/evaluation/FeatureController',["require", "exports", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/ui/DomManipulator", "../../core/event/EventDispatcher", "../../core/component/ListComponent", "../../core/mouse/event/MouseTouchEvent", "./data/Task", "./data/Hour"], function (require, exports, AbstractView, MVCEvent, DomManipulator, EventDispatcher, ListComponent, MouseTouchEvent, Task, Hour) {
    var FeatureController = (function (_super) {
        __extends(FeatureController, _super);
        function FeatureController() {
            _super.call(this);
        }
        FeatureController.prototype.Init = function (aFeature, aFeatureView) {
            this.mFeature = aFeature;
            this.mFeatureView = aFeatureView;
            this.mListComponent = new ListComponent();
            this.mListComponent.Init("taskList" + this.mFeature.ID);
            this.mFeatureView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mFeatureView.AddClickControl(document.getElementById("addTask" + this.mFeature.ID));
        };
        FeatureController.prototype.Destroy = function () {
            this.mListComponent.Destroy();
            this.mListComponent = null;
            this.mFeatureView.Destroy();
            this.mFeatureView = null;
            this.mFeature = null;
        };
        FeatureController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addTask" + this.mFeature.ID) {
                this.AddTask();
            }
            else if (element.id.indexOf("deleteTask" + this.mFeature.ID) >= 0) {
                this.DeleteTask(element.id);
            }
        };
        FeatureController.prototype.AddDepartment = function (aDepartment) {
            this.mFeature.HourList.push(new Hour(aDepartment.ID, 0));
            var featureDepartmentListDiv = document.getElementById("departmentList" + this.mFeature.ID);
            featureDepartmentListDiv.appendChild(this.CreateHourElement("departmentHour" + this.mFeature.ID + "_" + aDepartment.ID));
            var taskListLength = this.mFeature.TaskList.length;
            for (var i = 0; i < taskListLength; ++i) {
                var task = this.mFeature.TaskList[i];
                task.HourList.push(new Hour(aDepartment.ID, 0));
                var taskDepartmentListDiv = document.getElementById("departmentList" + this.mFeature.ID + "_" + task.ID);
                taskDepartmentListDiv.appendChild(this.CreateHourElement("departmentHour" + this.mFeature.ID + "_" + task.ID + "_" + aDepartment.ID));
            }
        };
        FeatureController.prototype.RemoveDepartment = function (aDepartment) {
            var featureHourListLength = this.mFeature.HourList.length;
            for (var j = 0; j < featureHourListLength; ++j) {
                if (this.mFeature.HourList[j].DepartmentID == aDepartment.ID) {
                    this.mFeature.HourList.splice(j, 1);
                    break;
                }
            }
            var featureDepartmentListDiv = document.getElementById("departmentList" + this.mFeature.ID);
            var featureDepartmentHourDiv = document.getElementById("departmentHourContainer" + this.mFeature.ID + "_" + aDepartment.ID);
            featureDepartmentListDiv.removeChild(featureDepartmentHourDiv);
            var taskListLength = this.mFeature.TaskList.length;
            for (var i = 0; i < taskListLength; i++) {
                var task = this.mFeature.TaskList[i];
                task.HourList.splice(j, 1);
                var taskDepartmentListDiv = document.getElementById("departmentList" + this.mFeature.ID + "_" + task.ID);
                var taskDepartmentHourDiv = document.getElementById("departmentHourContainer" + this.mFeature.ID + "_" + task.ID + "_" + aDepartment.ID);
                taskDepartmentListDiv.removeChild(taskDepartmentHourDiv);
                document.getElementById("departmentHour" + task.FeatureID + "_" + task.ID + "_" + aDepartment.ID).removeEventListener("focusout", this.OnTaskFocusOut.bind(this));
            }
        };
        FeatureController.prototype.CreateHourElement = function (aElementID) {
            var tdElement = document.createElement("td");
            var inputElement = DomManipulator.CreateElement("input", "0");
            inputElement.type = "text";
            inputElement.id = aElementID;
            inputElement.style.width = "100%";
            inputElement.value = "0";
            inputElement.addEventListener("focusout", this.OnTaskFocusOut.bind(this));
            tdElement.appendChild(inputElement);
            return (tdElement);
        };
        FeatureController.prototype.AddTask = function () {
            var taskView = new AbstractView();
            taskView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTaskTemplateLoaded, this);
            var task = new Task();
            task.FeatureID = this.mFeature.ID;
            for (var i = 0; i < this.mFeature.HourList.length; ++i) {
                task.HourList.push(new Hour(this.mFeature.HourList[i].DepartmentID, 0));
            }
            this.mFeature.TaskList.push(task);
            this.mListComponent.AddComponent(taskView, "templates/evaluation/task.html", task);
        };
        FeatureController.prototype.DeleteTask = function (aElementID) {
            var taskIndex = aElementID.split("deleteTask" + this.mFeature.ID + "_")[1];
            var taskComponent = this.mListComponent.GetComponentByID(taskIndex);
            var task = this.mListComponent.GetDataByComponent(taskComponent);
            this.mFeature.TaskList.splice(this.mFeature.TaskList.indexOf(task));
            this.mListComponent.RemoveComponent(["task" + this.mFeature.ID + "_" + taskIndex], this.mListComponent.GetComponentByID(taskIndex));
        };
        FeatureController.prototype.OnTaskTemplateLoaded = function (aEvent) {
            aEvent.target.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTaskTemplateLoaded, this);
            var task = this.mListComponent.GetDataByComponent(aEvent.target);
            this.mFeatureView.AddClickControl(document.getElementById("deleteTask" + this.mFeature.ID + "_" + task.ID));
            for (var i = 0; i < task.HourList.length; ++i) {
                document.getElementById("departmentHour" + task.FeatureID + "_" + task.ID + "_" + task.HourList[i].DepartmentID).addEventListener("focusout", this.OnTaskFocusOut.bind(this));
            }
        };
        FeatureController.prototype.OnTaskFocusOut = function (aEvent) {
            var input = aEvent.target;
            var inputIDSplitted = input.id.split("_");
            var departmentID = inputIDSplitted[2];
            var task = this.mListComponent.GetDataByID(inputIDSplitted[1]);
            for (var j = 0; j < task.HourList.length; ++j) {
                if (task.HourList[j].DepartmentID == departmentID) {
                    task.HourList[j].ExecutionTime = input.value == "" ? 0 : Number(input.value);
                    break;
                }
            }
            var calculatedExecutionTime = 0;
            var taskList = this.mFeature.TaskList;
            var taskListLength = taskList.length;
            for (var i = 0; i < taskListLength; ++i) {
                calculatedExecutionTime += taskList[i].HourList[j].ExecutionTime;
            }
            this.mFeature.HourList[j].ExecutionTime = calculatedExecutionTime;
            document.getElementById("departmentHour" + task.FeatureID + "_" + departmentID).value = String(calculatedExecutionTime);
        };
        return FeatureController;
    })(EventDispatcher);
    return FeatureController;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/evaluation/data/Feature',["require", "exports", "./Task"], function (require, exports, Task) {
    var Feature = (function (_super) {
        __extends(Feature, _super);
        function Feature() {
            _super.call(this);
            this.mTaskList = new Array();
        }
        Feature.prototype.Destroy = function () {
            var taskListLength = this.mTaskList.length;
            for (var i = 0; i < taskListLength; i++) {
                this.mTaskList[i].Destroy();
            }
            this.mTaskList.length = 0;
            this.mTaskList = null;
        };
        Object.defineProperty(Feature.prototype, "TaskList", {
            get: function () { return this.mTaskList; },
            set: function (aValue) { this.mTaskList = aValue; },
            enumerable: true,
            configurable: true
        });
        return Feature;
    })(Task);
    return Feature;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/evaluation/EvaluationController',["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/component/ListComponent", "../../core/mouse/event/MouseTouchEvent", "../../core/navigation/NavigationManager", "./data/Evaluation", "../project/ProjectModel", "../project/event/ProjectEvent", "./FeatureController", "./data/Feature", "../department/DepartmentModel"], function (require, exports, AbstractController, AbstractView, MVCEvent, ListComponent, MouseTouchEvent, NavigationManager, Evaluation, ProjectModel, ProjectEvent, FeatureController, Feature, DepartmentModel) {
    var EvaluationController = (function (_super) {
        __extends(EvaluationController, _super);
        function EvaluationController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        EvaluationController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mEvaluationView = new AbstractView();
            this.mEvaluationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mEvaluationView.LoadTemplate("templates/evaluation/evaluationView.html");
        };
        EvaluationController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("evaluationView"));
            this.mFeatureListComponent.Destroy();
            this.mFeatureListComponent = null;
            this.mEvaluationView.Destroy();
            this.mEvaluationView = null;
        };
        EvaluationController.prototype.GetRouteList = function () { return EvaluationController.mRouteList; };
        EvaluationController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mEvaluationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mEvaluation = new Evaluation();
            var baseData = {
                Client: ProjectModel.GetInstance().SelectedProject.Client,
                Name: ProjectModel.GetInstance().SelectedProject.Name,
                Description: ProjectModel.GetInstance().SelectedProject.Description,
                DepartmentList: DepartmentModel.GetInstance().GetDepartmentList().slice(0, DepartmentModel.GetInstance().GetDepartmentList().length)
            };
            document.getElementById("core").innerHTML += this.mEvaluationView.RenderTemplate(baseData);
            this.mFeatureListComponent = new ListComponent();
            this.mFeatureListComponent.Init("featureList");
            this.mDepartmentListComponent = new ListComponent();
            this.mDepartmentListComponent.Init("departmentList");
            this.mFeatureControllerList = new Array();
            this.mEvaluationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mEvaluationView.AddClickControl(document.getElementById("addFeature"));
            this.mEvaluationView.AddClickControl(document.getElementById("addDepartment"));
            this.mEvaluationView.AddClickControl(document.getElementById("backToProject"));
        };
        EvaluationController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addFeature") {
                this.AddFeature();
            }
            else if (element.id.indexOf("deleteFeature") >= 0) {
                this.DeleteFeature(element.id);
            }
            else if (element.id == "addDepartment") {
                this.AddDepartment();
            }
            else if (element.id.indexOf("deleteDepartment") >= 0) {
                this.DeleteDepartment(element.id);
            }
            else if (element.id == "backToProject") {
                this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
            }
        };
        EvaluationController.prototype.AddDepartment = function () {
            var departmentSelect = document.getElementById("department");
            var departmentName = departmentSelect.options[departmentSelect.selectedIndex].text;
            var department = DepartmentModel.GetInstance().GetDepartmentByName(departmentName);
            var optionListLength = departmentSelect.options.length;
            for (var i = 0; i < optionListLength; i++) {
                if (departmentSelect.options[i].text == departmentName) {
                    departmentSelect.options.remove(i);
                    break;
                }
            }
            this.mEvaluation.DepartmentList.push(department);
            var departmentView = new AbstractView();
            departmentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
            this.mDepartmentListComponent.AddComponent(departmentView, "templates/evaluation/department.html", department, true);
        };
        EvaluationController.prototype.DeleteDepartment = function (aElementID) {
            var departmentIndex = aElementID.split("deleteDepartment")[1];
            var departmentComponent = this.mDepartmentListComponent.GetComponentByID(departmentIndex);
            var department = departmentComponent.Data;
            this.ReturnDepartmentOption(department);
            var departmentListIndex = this.mEvaluation.DepartmentList.indexOf(department);
            this.mEvaluation.DepartmentList.splice(departmentListIndex, 1);
            var featureControllerListLength = this.mFeatureControllerList.length;
            for (var i = 0; i < featureControllerListLength; i++) {
                this.mFeatureControllerList[i].RemoveDepartment(department);
            }
            this.mDepartmentListComponent.RemoveComponent(["department" + departmentIndex], departmentComponent);
        };
        EvaluationController.prototype.ReturnDepartmentOption = function (aDepartment) {
            var departmentSelect = document.getElementById("department");
            var departmentOption = document.createElement("option");
            departmentOption.value = aDepartment.Name;
            departmentOption.text = aDepartment.Name;
            departmentSelect.add(departmentOption, Number(aDepartment.ID) + 1);
        };
        EvaluationController.prototype.AddFeature = function () {
            var featureView = new AbstractView();
            featureView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnFeatureTemplateLoaded, this);
            var feature = new Feature();
            this.mEvaluation.FeatureList.push(feature);
            this.mFeatureListComponent.AddComponent(featureView, "templates/evaluation/feature.html", feature);
        };
        EvaluationController.prototype.DeleteFeature = function (aElementID) {
            var featureIndex = aElementID.split("deleteFeature")[1];
            var featureComponent = this.mFeatureListComponent.GetComponentByID(featureIndex);
            var featureListIndex = this.mEvaluation.FeatureList.indexOf(featureComponent.Data);
            this.mEvaluation.FeatureList.splice(featureListIndex, 1);
            this.mFeatureListComponent.RemoveComponent(["feature" + featureIndex,
                "featureTaskList" + featureIndex,
                "featureAddTask" + featureIndex], featureComponent);
        };
        EvaluationController.prototype.OnDepartmentTemplateLoaded = function (aEvent) {
            aEvent.target.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
            var department = this.mDepartmentListComponent.GetDataByComponent(aEvent.target);
            var featureControllerListLength = this.mFeatureControllerList.length;
            for (var i = 0; i < featureControllerListLength; i++) {
                this.mFeatureControllerList[i].AddDepartment(department);
            }
            this.mEvaluationView.AddClickControl(document.getElementById("deleteDepartment" + department.ID));
        };
        EvaluationController.prototype.OnFeatureTemplateLoaded = function (aEvent) {
            aEvent.target.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnFeatureTemplateLoaded, this);
            var feature = this.mFeatureListComponent.GetDataByComponent(aEvent.target);
            var featureController = new FeatureController();
            featureController.Init(feature, this.mEvaluationView);
            var departmentList = this.mDepartmentListComponent.GetDataList();
            var departmentListLength = departmentList.length;
            for (var i = 0; i < departmentListLength; i++) {
                featureController.AddDepartment(departmentList[i]);
            }
            this.mFeatureControllerList.push(featureController);
            this.mEvaluationView.AddClickControl(document.getElementById("deleteFeature" + feature.ID));
        };
        EvaluationController.mRouteList = ["evaluation"];
        return EvaluationController;
    })(AbstractController);
    return EvaluationController;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/library/data/Book',["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComponentData) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book() {
            _super.call(this);
        }
        Object.defineProperty(Book.prototype, "ISBN", {
            get: function () { return this.mISBN; },
            set: function (aValue) { this.mISBN = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Book.prototype, "Title", {
            get: function () { return this.mTitle; },
            set: function (aValue) { this.mTitle = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Book.prototype, "Author", {
            get: function () { return this.mAuthor; },
            set: function (aValue) { this.mAuthor = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Book.prototype, "Collection", {
            get: function () { return this.mCollection; },
            set: function (aValue) { this.mCollection = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Book.prototype, "Image", {
            get: function () { return this.mImage; },
            set: function (aValue) { this.mImage = aValue; },
            enumerable: true,
            configurable: true
        });
        Book.prototype.FromJSON = function (aData) {
            this.mTitle = aData.title;
            this.mAuthor = aData.author;
            this.mImage = aData.image;
            this.ISBN = aData.isbn;
            this.mTitle = aData.title;
        };
        return Book;
    })(ComponentData);
    return Book;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/library/event/LibraryEvent',["require", "exports", "../../../core/event/Event"], function (require, exports, Event) {
    var LibraryEvent = (function (_super) {
        __extends(LibraryEvent, _super);
        function LibraryEvent(aEventName) {
            _super.call(this, aEventName);
        }
        LibraryEvent.BOOK_FETCHED = "com.cortex.livreouvert.library.event.LibraryEvent::BOOK_FETCHED";
        return LibraryEvent;
    })(Event);
    return LibraryEvent;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/library/LibraryModel',["require", "exports", "../../core/mvc/AbstractModel", "../../core/mvc/event/MVCEvent", "./data/Book", "./event/LibraryEvent"], function (require, exports, AbstractModel, MVCEvent, Book, LibraryEvent) {
    var LibraryModel = (function (_super) {
        __extends(LibraryModel, _super);
        function LibraryModel() {
            _super.call(this);
            this.mBookList = new Array();
        }
        LibraryModel.prototype.GetBookList = function () {
            return this.mBookList;
        };
        LibraryModel.prototype.RequestBookList = function () {
            this.AddEventListener(MVCEvent.JSON_LOADED, this.OnBookListLoaded, this);
            this.Fetch(LibraryModel.AUTHOR_URL);
        };
        LibraryModel.prototype.OnBookListLoaded = function (aEvent) {
            this.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnBookListLoaded, this);
            var rawData = this.mDataCache[LibraryModel.AUTHOR_URL].hits.hits;
            for (var i = 0; i < rawData.length; i++) {
                var book = new Book();
                book.FromJSON(rawData[i]._source);
                this.mBookList.push(book);
            }
            this.DispatchEvent(new LibraryEvent(LibraryEvent.BOOK_FETCHED));
        };
        LibraryModel.GetInstance = function () {
            if (LibraryModel.mInstance == null) {
                LibraryModel.mInstance = new LibraryModel();
            }
            return LibraryModel.mInstance;
        };
        LibraryModel.AUTHOR_URL = "http://louiscyr2.bio2rdf.org/biblio-lo-v2/_search?/q=author";
        return LibraryModel;
    })(AbstractModel);
    return LibraryModel;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/library/LibraryController',["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/navigation/NavigationManager", "./LibraryModel", "./event/LibraryEvent"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, NavigationManager, LibraryModel, LibraryEvent) {
    var LibraryController = (function (_super) {
        __extends(LibraryController, _super);
        function LibraryController() {
            _super.call(this);
            this.mLibraryModel = LibraryModel.GetInstance();
            NavigationManager.Register(this);
        }
        LibraryController.prototype.Init = function (aAction) {
            this.mLibraryView = new AbstractView();
            this.mLibraryView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mLibraryView.LoadTemplate("templates/library/library.html");
        };
        LibraryController.prototype.Destroy = function () {
            var loginHTMLElement = document.getElementById("libraryView");
            document.getElementById("core").removeChild(loginHTMLElement);
            this.mLibraryView.Destroy();
            this.mLibraryView = null;
        };
        LibraryController.prototype.GetRouteList = function () { return LibraryController.mRouteList; };
        LibraryController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mLibraryView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            if (document.readyState == "complete" || document.readyState == "interactive") {
                this.OnDeviceReady();
            }
            else {
                document.addEventListener("deviceready", this.OnDeviceReady.bind(this));
            }
        };
        LibraryController.prototype.OnDeviceReady = function () {
            this.mLibraryView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mLibraryModel.AddEventListener(LibraryEvent.BOOK_FETCHED, this.OnBookListLoaded, this);
            this.mLibraryModel.RequestBookList();
        };
        LibraryController.prototype.OnBookListLoaded = function (aEvent) {
            document.getElementById("core").innerHTML += this.mLibraryView.RenderTemplate({ bookList: this.mLibraryModel.GetBookList() });
            var msnry = new Masonry('.grid', {});
        };
        LibraryController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "connect") {
            }
            else if (element.id == "register") {
            }
            console.log(element.id);
        };
        LibraryController.mRouteList = ["", "library"];
        return LibraryController;
    })(AbstractController);
    return LibraryController;
});

/******
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/login/event/LoginEvent',["require", "exports", "../../../core/event/Event"], function (require, exports, Event) {
    var LoginEvent = (function (_super) {
        __extends(LoginEvent, _super);
        function LoginEvent(aEventName) {
            _super.call(this, aEventName);
        }
        LoginEvent.SHOW_TEAM = "com.cortex.template.login.event.LoginEvent::SHOW_TEAM";
        LoginEvent.CONNECT = "com.cortex.template.login.event.LoginEvent::CONNECT";
        return LoginEvent;
    })(Event);
    return LoginEvent;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/user/UserModel',["require", "exports", "../../core/mvc/AbstractModel", "../department/DepartmentModel"], function (require, exports, AbstractModel, DepartmentModel) {
    var UserModel = (function (_super) {
        __extends(UserModel, _super);
        function UserModel() {
            _super.call(this);
            this.mUserList = new Array();
        }
        UserModel.prototype.AddUser = function (aUser) {
            var departmentList = DepartmentModel.GetInstance().GetDepartmentList();
            var departmentListLength = departmentList.length;
            for (var i = 0; i < departmentListLength; i++) {
                if (departmentList[i].Name == aUser.Department) {
                    departmentList[i].UserList.push(aUser);
                    break;
                }
            }
            this.mUserList.push(aUser);
        };
        UserModel.GetInstance = function () {
            if (UserModel.mInstance == null) {
                UserModel.mInstance = new UserModel();
            }
            return UserModel.mInstance;
        };
        return UserModel;
    })(AbstractModel);
    return UserModel;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/user/data/User',["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComponentData) {
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            _super.call(this);
        }
        Object.defineProperty(User.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Email", {
            get: function () { return this.mEmail; },
            set: function (aValue) { this.mEmail = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Password", {
            get: function () { return this.mPassword; },
            set: function (aValue) { this.mPassword = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Picture", {
            get: function () { return this.mPicture; },
            set: function (aValue) { this.mPicture = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Department", {
            get: function () { return this.mDepartment; },
            set: function (aValue) { this.mDepartment = aValue; },
            enumerable: true,
            configurable: true
        });
        return User;
    })(ComponentData);
    return User;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('assets/livreouvert/user/UserController',["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager", "./UserModel", "./data/User", "../project/event/ProjectEvent", "../../core/component/ListComponent", "../../core/component/data/ComponentData", "../department/DepartmentModel"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager, UserModel, User, ProjectEvent, ListComponent, ComponentData, DepartmentModel) {
    var UserController = (function (_super) {
        __extends(UserController, _super);
        function UserController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        UserController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mUserView = new AbstractView();
            this.mUserView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mUserView.LoadTemplate("templates/user/userView.html");
        };
        UserController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("userView"));
            this.mListComponent.Destroy();
            this.mListComponent = null;
            this.mUserView.Destroy();
            this.mUserView = null;
        };
        UserController.prototype.GetRouteList = function () { return UserController.mRouteList; };
        UserController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mUserView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").innerHTML += this.mUserView.RenderTemplate({});
            this.mListComponent = new ListComponent();
            this.mListComponent.Init("userList");
            this.mUserView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mUserView.AddClickControl(document.getElementById("addUser"));
            this.mUserView.AddClickControl(document.getElementById("createUsers"));
        };
        UserController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addUser") {
                this.AddUser();
            }
            else if (element.id.indexOf("delete") >= 0) {
                this.DeleteUser(element.id);
            }
            else if (element.id == "createUsers") {
                this.CreateUserList();
            }
        };
        UserController.prototype.CreateUserList = function () {
            var userList = this.mListComponent.GetDataList();
            var userListListLength = userList.length;
            var i;
            var user;
            for (i = 0; i < userListListLength; i++) {
                user = userList[i]["user"];
                if (user.Name == "" || user.Email == "") {
                    return;
                }
            }
            for (i = 0; i < userListListLength; i++) {
                user = userList[i]["user"];
                UserModel.GetInstance().AddUser(user);
            }
            this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST));
        };
        UserController.prototype.AddUser = function () {
            var user = new AbstractView();
            user.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnUserTemplateLoaded, this);
            var data = new ComponentData();
            data["user"] = new User();
            data["departments"] = DepartmentModel.GetInstance().GetDepartmentList();
            this.mListComponent.AddComponent(user, "templates/user/user.html", data);
        };
        UserController.prototype.OnUserTemplateLoaded = function (aEvent) {
            var user = this.mListComponent.GetDataByComponent(aEvent.target);
            this.mUserView.AddClickControl(document.getElementById("delete" + user.ID));
            document.getElementById("name" + user.ID).addEventListener("focusout", this.OnUserNameInputFocusOut.bind(this));
            document.getElementById("email" + user.ID).addEventListener("focusout", this.OnUserEmailInputFocusOut.bind(this));
        };
        UserController.prototype.DeleteUser = function (aElementID) {
            var userIndex = aElementID.split("delete")[1];
            this.mListComponent.RemoveComponent(["user" + userIndex], this.mListComponent.GetComponentByID(userIndex));
        };
        UserController.prototype.ValidateInput = function (aInput) {
            GraphicValidator.HideInputErrorMessage(aInput.id);
            if (aInput.value == "") {
                GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");
                return (false);
            }
            return (true);
        };
        UserController.prototype.OnUserNameInputFocusOut = function (aEvent) {
            var input = aEvent.target;
            if (this.ValidateInput(input)) {
                var userID = input.id.split("name")[1];
                var user = this.mListComponent.GetDataByID(userID);
                user.Name = input.value;
            }
        };
        UserController.prototype.OnUserEmailInputFocusOut = function (aEvent) {
            var input = aEvent.target;
            if (this.ValidateInput(input)) {
                var userID = input.id.split("email")[1];
                var user = this.mListComponent.GetDataByID(userID);
                user.Email = input.value;
            }
        };
        UserController.mRouteList = ["user"];
        return UserController;
    })(AbstractController);
    return UserController;
});

/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
define('assets/livreouvert/main/Main',["require", "exports", "../../core/key/KeyManager", "../../core/navigation/NavigationManager", "../team/TeamController", "../team/event/TeamEvent", "../project/ProjectListController", "../project/ProjectCreationController", "../project/ProjectEditController", "../project/event/ProjectEvent", "../department/DepartmentController", "../department/event/DepartmentEvent", "../evaluation/EvaluationController", "../library/LibraryController", "../login/event/LoginEvent", "../user/UserController"], function (require, exports, KeyManager, NavigationManager, TeamController, TeamEvent, ProjectListController, ProjectCreationController, ProjectEditController, ProjectEvent, DepartmentController, DepartmentEvent, EvaluationController, LibraryController, LoginEvent, UserController) {
    var Main = (function () {
        function Main() {
            this.Init();
        }
        Main.prototype.Init = function () {
            this.SetupRouting();
            KeyManager.Register(this);
        };
        Main.prototype.KeyPressed = function (aKeyList) {
            if (aKeyList.indexOf(192) >= 0) {
                var outputStyle = document.getElementById("output").style;
                outputStyle.visibility = outputStyle.visibility == "hidden" ? "visible" : "hidden";
            }
            console.log(aKeyList);
        };
        Main.prototype.SetupRouting = function () {
            routie("", this.ShowLibraryScreen.bind(this));
        };
        Main.prototype.OnDataLoaded = function (aResult) {
            console.log(aResult);
        };
        Main.prototype.ShowLibraryScreen = function () {
            this.SetupNavigable("library", LibraryController);
            this.mLastController.AddEventListener(LoginEvent.SHOW_TEAM, this.OnShowTeamScreen, this);
        };
        Main.prototype.OnShowTeamScreen = function (aEvent) {
            (aEvent.target).RemoveEventListener(LoginEvent.SHOW_TEAM, this.OnShowTeamScreen, this);
            this.ShowTeamScreen();
        };
        Main.prototype.ShowTeamScreen = function () {
            this.SetupNavigable("team", TeamController);
            this.mLastController.AddEventListener(TeamEvent.SHOW_DEPARTMENT, this.OnShowDepartmentScreen, this);
        };
        Main.prototype.OnShowDepartmentScreen = function (aEvent) {
            (aEvent.target).RemoveEventListener(TeamEvent.SHOW_DEPARTMENT, this.OnShowDepartmentScreen, this);
            this.ShowDepartmentScreen();
        };
        Main.prototype.ShowDepartmentScreen = function () {
            this.SetupNavigable("department", DepartmentController);
            this.mLastController.AddEventListener(DepartmentEvent.SHOW_USER, this.OnShowUserScreen, this);
        };
        Main.prototype.OnShowUserScreen = function (aEvent) {
            (aEvent.target).RemoveEventListener(DepartmentEvent.SHOW_USER, this.OnShowUserScreen, this);
            this.ShowUserScreen();
        };
        Main.prototype.ShowUserScreen = function () {
            this.SetupNavigable("user", UserController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
        };
        Main.prototype.OnShowProjectListScreen = function (aEvent) {
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.ShowProjectListScreen();
        };
        Main.prototype.ShowProjectListScreen = function () {
            this.SetupNavigable("projectList", ProjectListController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_CREATION, this.OnShowProjectCreationScreen, this);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
        };
        Main.prototype.OnShowProjectCreationScreen = function (aEvent) {
            this.SetupNavigable("projectCreation", ProjectCreationController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
        };
        Main.prototype.OnShowProjectEditScreen = function (aEvent) {
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
            this.SetupNavigable("projectEdit", ProjectEditController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_EVALUATION, this.OnShowEvaluationScreen, this);
        };
        Main.prototype.OnShowEvaluationScreen = function (aEvent) {
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_EVALUATION, this.OnShowEvaluationScreen, this);
            this.SetupNavigable("evaluation", EvaluationController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
        };
        Main.prototype.SetupNavigable = function (aName, aControllerClass) {
            if (NavigationManager.NavigateTo(aName) == null) {
                this.mLastController = this.LoadNavigation(aName, new aControllerClass());
            }
            else {
                this.mLastController = this.LoadNavigation(aName);
            }
        };
        Main.prototype.LoadNavigation = function (aActions, aForceController) {
            if (aForceController === void 0) { aForceController = null; }
            aActions = (aActions == null) ? "" : aActions;
            this.mLastActions = aActions;
            if (this.mLastController != null) {
                this.mLastController.Destroy();
            }
            this.mLastController = (aForceController != null) ? aForceController : NavigationManager.NavigateTo(aActions.split("/")[0]);
            this.mLastController.Init(aActions);
            return this.mLastController;
        };
        return Main;
    })();
    return Main;
});

require.config({
	baseUrl: "",
	paths: {
		'routie': 'lib/routie/routie',
		'masonry':'lib/masonry-layout/masonry.pkgd',
		'tmpl': 'lib/blueimp-tmpl/tmpl'
	},
	
	shim: {
		'assets/livreouvert/main/Main': {
			deps: ['routie', 'tmpl', 'masonry']
		}
	}
	
});

require(['assets/livreouvert/main/Main'], function(Main) {

 	return new Main();
});

define("bootstrap", function(){});

}());