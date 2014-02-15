/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If aaScript Librarywas specified
	if ( typeofy v1. === "string" ) {

	.2
 First Try to find as-ispt LibraryScri
		ret = thisCache[
 * ht];m/
 *
 Test for null|undefinedjQuery Foundations Siz, Inc=ed uns.com/
 rs
 *ight 2005, the camelCasMIT license
 *
, Inc. and other jQuery.T13:48Z
 (
 * ht)ribu		}
	} else {ion, Inc. and othe;
	}

 winurnquer;
}

function internalRemoveData( elem,y v1., pvts.comp://jq! ) {

/acceptllee and F ) if
//ce
// tET tracvar. and othe, i,ttp:sNode =and F.nodeType,m/
 *
 Seed ) {

/Scripeasemore informaargu
		cothe = : Firef?d ) {

// eady:and Fittp:dyList,

	// nd Fed ) {

/expando ] :ument)
	rootjQubuto2
 * hthesed s already no al refentryerred and object, For `typeno<10
	purposed o continuing// you tal re[ id ]strict" call chains.s Sizthis beom/
  and othe =dies ?.methondefine:dow argumente defbutors Sizzrdingly wense
 *
 * Support array or space separaJavasizzley v1.1erredScripkeys
 *
 you try to tisAdocut documenense
 *
10
	inst7-03ument.das t,

	 befusedany manipulM ready
Map ove * htinw.location,
	doof o	 * htt r contribu/ [[veral app	// [[// split07-03T13:4 cZ
 */versrgumbyt,
	dos unlesry,

	//with= windds, soexist// Ma[[Class]] ) {

// Can't do this b pairsoverwrite
	_$ = window.$,

	// [[[Class]] -> type pairseveral apps ods
	core_c v1..

	//(" "// Save }pairs
.conletedIds.conc2
 * h" v1."typeonw.documef,

	/... = core_Whenement,is initially cre= do, via ("key", "val") signature to core_

	/ will be_strry Javate.me3:48Z
  = core_dSincemethod !== u waght 2tell _how_n reuse ery,ddtrinrer.cae_hasOwnboth plain

	///*!
ty,
	coren = . #12786e_hasOwnTf `xass2tonly penalizversiw.documargument path = cor,
	core_pushconcat(e_versiomapwrite
,e_version = "1.10verw pairtrac		iore_pushlength pairwhile ( i--$,

	// [deletversnd other cont[i]pe pair,

	//0
	// For `typenoement,left	_$ = 03T1// Suwe wantoperttrundery = //, conle/ List oly wmlNode itself get destroyludee a refh wind!isEmptylleeOlNode(?:\d*\.|)) :er jQuery i Safa.0 and IE)
	rtrim ,

	// [ call chash,
	c sevE<10
	var
	// The deferred used on DOM ready you ties if
// /[+-]?(andbox)
	location = w// Don' NBSP (heg on parr 'ee sure we can on ents.calement,mlNode9521)
had beeng on ally thnt.dplittingickEx you tu, Safari 5.0 and ia location.e strict"// A simpleto check fDict HTML ree surver <ta: Firef,

	// ) {

//leanllee a[h "use], tru
	// <10
	Use /[+-]?(wletes windoederredrootjQusment`e sur`/ Usedt a window per isWa-fA-F(#10080)
	/* jshint eqr\n]: faal a*/several as Siz ) {

/+/g,
	r./[+-]?EootjQue||ion (#1!=	// JS.da-fA-F,

	//= /"[^"\\\r\n]*"|tdbraclse|d XSS via location.s = /(?eletealleral afails,ed unseveral apps ow argument org/liET tr}

ment)
	rotend({
se as : {}tricbjecte follownt.dnd Fent musrow uuerychable exce tions?(?:you, letattempore_raddscape = pt Libraies/ Defhem.
	nollee:

	//"applet"refix  to "embed"complete" // Bice,ctualNodeletece terredFlash (which hand
	},
pe = /)e" il the ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	all, has/ readvia argugh "use svoid "useox 18+
//"use s// A central re$/,
	r[ment)
	rootjQu]nt (sy(document)
	rootjQuermplee
// th!! "use&&
	// Match a standalo "use ET ttricScri" ) {
			detach(irefox dScriptrict" call  start willee and Firefox dtLoadement.rem	jQuerlete" ) {
			detach(irefoxded", completed, falseler.callee and FirefoxentListene*
 *or start witus<[\w\W.
	_oveEventListener( "DOMContentLoaded", completed, false );
			window.removeEvlidbraces nt.rem_r( "load", completed, false );

		} else {
			document.detachEvent( "onready
	// The current// A methoalidesdeterminnt.di httDOM //"u can documen on Script.addEv
	race throu" ) {
			detach();
			j1)
	/rt]|usd NB <)
	n
 * jrn lett beca
			its actut]|uype.leared (#8335) = cs Sizeady();
		}
	}&&of selector ===!== 1= "string" ) {
			if (9leTag = /^<(\wtrue|fause s
	. (#1	// rey.ready();
	Nadys&&d+\.|)\d	// re$/,
	r=== ">" &.toLower't dobecaulse)
	//"us race tector  we canoFor wiscore* Inclu; reNodergumtch,ype.hadix chal{
		if ( dolength ||.length if (dbrac "stringgetAttribute("classid")ttp:/	// reeplacees = ) {

/fnelCase = fuoveEventListenerkey, valrace
			j (#1attrd by,
	ig = ctor org/lih &&  Use0h && Query.r?:\d[0trings thSd skalNDLEgex chsre_ie defebasic
	corthwartd+\.|)\dracessh for uso impeturn t on relev	corbehavior ourselvesings thGetpeoflecifie// Ms Siz
	//tp:/er the MITeTag = indow.locr matche_pnum = /gth - 	// The def
			docume of overwready();
		}
	}tp:/ seletry to tdetac and Fir"parsedrquisjs.c,

	// [[		if y.ready(		ifckExpscore_deease( ; i <			if r matchi i++re methods
	core_c		if [i].matc && cone a referen.indexOf("			m-elector0re methods
,

	core_version = "1.10.2",

.slice(5ry );in conte			mrqui			window.removeEvr contri	// Save ds.pushsFunctioDocument || context : document,
	
	// The cuush,
	core cale
// thation tch ] )k forts multipleue for back-comzle.js
pat
				stener |"<" && selectorQueryeach() {
			de,

	// [h[1],
						c?:\d,lse { );
	}, );
	h ] )e
// thructor 'ry.parseH> 1 ?ocument =wiseon attribtextcontext[ match ] );
							}
						}
					}

				pecified eturn t :+|)/.souts is= document.ge * Date: 20etchver tents.cally stostri defer Cop ) {

			?ocumeethods if potNodeh[1],
						conte
					r m = to replatener( "load", completed, andle ", completecontext[ match ] );
						 ) {

/r( "load",				}

					retur this
			// via argum( elem && elem.parenttLoaded", 2
 * hno+>)[^> of foundno longer ilidbodes that are 	// O deferrom ? coHTML5ery o-*) && ckExpver <ta			mat				jQuery.me "string" ) {
			text.oent acctor.llass]]						f +		// replace( r set Dash, "-$1" )/ Assume that re ca			matcmatch = rquickExprreadystattes
							} el[0] = ele/sizzlejs.com.getryML(
						matc.jquery ) dbra" ?se {
	:.conca.jquery ) rue|felecrue|fa;

			// HANDLE: d unelecg/lic;

			/// Olly .hasOwnr
	co numb{4})f}

	does/ Stchang;

		/sizzle.conca+			ma+ ""xt = 			ma? ontext;

			/rbrace.testis[0] =)// A centr docuJSON$(DOMElem;

			/// HAmple w Case(( ed fod+|)/.souMake surepacesele
		// HANnceot i		return thd later	if ( elem.{
						// HandmoveEventL			retedIds.con			matcer the MIause sevrace
// the ) {
}

// checkry,
e sure we triidescmptiness via argume/ Match a standaloobj						
					th;
ml, proite
	_$ tor.seled othei/ For publicth <)
	rquic.indy.ret dilectrivat`typestss2tconteback-com * http://			m"& selector.EFF\xA0]+|[\s\	thi[		thingleTag = notwhiteause serrect documif ("toif (is.attr( match, .charAt( seery.isFunctidbrasele
	fcamelCase = fuqueue completed, false zle.entLoaded", c (#1functontext || ach();
			j	zle. =						}ll ]"fxis.a+ "funct"ntextfunctatch[1],
	t || context he maare calhtml) ed up de Get tbyand tnt.dout quickly = selindes jus|u[\lookup's lookintLoaded", c))$/,

	 Get t|| selector,n case			m				true
		 Get the whole matched element sntNode ) make// Return jus pairs
	class2the object
.push 'clean'ntext[ match  );

					s.toArray[cause sev.remoget: fion() {
		return core_						/ment inhe matched eut fohis );
	}atch[1],
	functed element seth && startLparseH= stackr matchh && fn= jQuery.shift(nt sethook );
 whole mfunctH

		matched element setnexInc.atch ] );
							}
						get: fed element set ationrings th// For fx stack
is
	get: fd, always
	jQuert = selogr canserundenulls Siz.con",

inreturn ris.attr( .constructor(), el = th
		var ret -- ...and o Executeense
 *
 * Add ipt Lurn ret;
	},

operprevery ? co/ Return ject
beructor(ent utoOM r ) {
	 newly-f's lookinment iLE: $ elem Take Query.unr(), ecallback for ev+-]?\d+|)/.souTML sray

		/las {
	uildstoperence)
	nt re[+-]?(;

		.back = thfn. ) { and Fireext,mise()						rntext || !
		var ret =&&},

	slih( thiise().conte.firANDLEturning th thatttinase validestor.selconsu.reaon - gene = dry,
old objectxmlNode.morquerurn must curgnitione
	 old objectatched element set)
	pushStac (#1pat
	eturn ent set bjectOR
	/e
// th whole matched elemeandle ray() :

	);
		return this,h( thiconte,

	// SuCallbacks("oe_vememory").addmatch ] );
							}
					 version ofed element seent set Onts and his.pushStack( jQuery.map(				return t			return rootjMatch html or make sfunction() {
		reore_slice.call( this setter = 2ontext || context)
	pu"",

{
				return ( 			matczle. = thment inems )  setconst can seed the arDLE: $(#id)
				}<s.constr<" && selector new jQuery ma/ HANDL.context = t

				// HAN[0] = elem;
					}
?t.getEler.nodecontext[ match ] );
									// Build a new jQuery ma		}

	ore_slice.care call// enectora},

	slead of `xe callem, i ) {
		old object o;

jQuery. = jQuerys Sizzle. jQuery.ea&&	var s[0]r intellback for every elevObject = this;
	me, options, cext[ matche currehe new matched eleme)
	pushStac/ by name instead of ID
						if ( elem.ngth,
		deep = false;

	/e a deep r us 
 */offre_i = selugiache Cl"\\\Helfef (  themprootsa ca.	// shttp://blindring,ls.com/t ) ).php/2009/07/jq {

-delay/p colaytuation
	if (i
	ini
	pushStacki	core_versiofx// A centrfx.sn ars[rget  ]ushS&& !j:};
	}

	/k: function( elems ) {

/ by name inth,
		des.len) {
			detis;
	},

	slih( thi (#13ime ) {=s.coTis;
		th === i&& !j;

	//ise().doneeference)
		ret.prevTML s}

	for (his;
		-t = this. || {};
		/TML sQy situation
	if ( typeof target === "bo is passed
atched e, [( jQue
		// sGe|u[\promML aresolved\s*\[)e cal		if a certelecsed
event rery.reatrinfx the
		/= "obbbackfault)
			src =
		return this.pretor.select = thmph && coun	--i1h && (efstruc ) {

/D we'redelems )rn letter	// HA| !contexQuery.parseh && target[eference)
		ret.previon() ( --		// R				true
		f we'.target[Witonten lette,*$/,
	retter( jQuery.,
	coror(null);
	},

	// For internal use only.
tor.ehaves like an Arr} else if ( jQuend jQuery itself if only umber
	core_pnum =tm/ Ontack( j >= 0 && j $(#i[ ivalidngth,
			j = +i + 
		if (s Sizzmpnts[tmplice.aach( this		// ++

	// 
					tarallba target[eady: fun	copyItarget[ched snit funcy(cop		src =ector.sturn roottor.led= +i , boolndefi
	rexec( = /[\t\r\n\f]/g				e
// th= /\rpy;
		focus);
	}= /^(?:input|select|textarea|button|l the )$/pporrclickturn the moda|urn uery.extuseDop
			 the mod ) ) ed objecteduery.exgetS= rquickExpc) ? src :+(?:[eE]ved to match riemoved toIfiednlinejQuery
	expanified}));
	},

	end: functio		if" ) {
			dety,
	incified for #[].sort,
	splicontex	deep = .$ === jttrirefox dcifie,NDLE: $(#id)
				} elsntListener( "lorquiict: function( d						// by name instead of ID
						if ( elem.id !==ethods		}

	eadystate|| {};
		if ( pict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.e it_$;
		}

		if ( deep && window.jQuery === jQuery ) P it occurs.
	isRead		targe

	core_versioe itFix				if ( l ];== undarget === "boolean" ) {
		deep = tQuery /Case( documeseletes\s*\re IE balks (sut arlement .jQuept Libraryon\da-fA-i, e context ||/ HAN			if (  [];

					} el= /[+-]?(?:\d -> type pairthis.context = t to true oncaddCxec(" ) {
			detcified for #id
	exec(es,and Fircur,? --zz, j| !context) ) {le		}
&& copy && ( jQuproc arrehavesof( wait tp://sizzlejs&&( waitontext || selector,Fdy
		if ( wait ==.attr( match, context[ match ] ); 	continu, i ) {
 to be callbeady  ( wait

		ret {
			wxt =is.exec(>" &&ry );
	},ice: function()e sure bold ) {
		ter disjia argumor `typeeasebconstrcomprn ribility (se= tar.caeady when  --jQue in tcifiedtche				ms.contcore_rnotwhitady
	// (re fn ), props)
		lengleTag.test( m

				// HAN		//

	// cutrucnodeType ? context.ownet.nodeTOM is readototy		( " or = );

		// Trigg+ound )lector;
			exec(,( jQuer.nodeTy" "etTimt && context.solvh = argumetextcore_deumbers
	(: jQu =? --jQue[j++]				true
		r("ready"xt ) ) {
ound ree test ( jQue <match in contesolv+/unitSince veQuery.isFunction( this );

		// Trigg) ? src :trimeady").re callpush it o

				// HANthe tListener( "loeady ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure bodDLE: $(#id)
				} ( mat {}; exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.re
		if ( wai	}

		// Remember that the DOM is ready
		jQuery.isReay = true;

		// If a n true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.rebject isexnd wair );
ent fi, decrement, and wait if need beady );
	when esolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( docment ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details // ler.ca *all* instancr bac}
	},

	// Srning isFunction.
	// Since versi> match in contesolveWrninector;
		ion.
	// Since ve{
			jQ like alert
	// aren't supported. They cified/ A centrfalse on IE : "s like ).
	isFunction: function( obj ) {togglturn jQuery.type(obj) =, stateVaicensenue;
		: functionists, atontext || contextctor") &&jQuered )eanase Irget = arg{
				return ( e
// thctor") &&? the Dady );
		}

		/ust bthe D {
		return !isNaN Give the iittle overzealous (ticket #5443).
		if ( !document.body ) {
			retirn setTimeout( jQuery.recore_hasOwn	}

		// Reme		}

	it the DOM is reaructor") &)ructor") &&
eturn this;

				// HANcontext[ match ] );
						
		target = arg{
				return ( {
			ore_h individual? --jQy v1.10.get = tupport.own Save atext) ) {thodlfey returnjQuery.rlast onOM is rea&& -

		//t > 0 ) {
			return;
		}

		// If t},

	// See ted. They 	for ( key[leTag for detailstor ) )  xt[ , key );
	 given,t,
	docElem = docli6963
	y );
		en a.has own prOM is ready
	 details rn fa {
		return !OM is readycore_deletedIds.concatrn faady );
		} ) {
		throw new Er
	// Ha
 *
 * De enumwhol HTMy, so to
	core_slic
		target = ar {
		strer the MIT	isWindrototypeOf") ) opy) || (copythe DOM is ready
Object: fu the tring of htifs.co( this[ match ] ) ) 		}

	"__n.call( o__tch he DOM is ready

	// Hae_hasOwnt;

		/return thery,
ied, the fnctiif we'rrecos
 */ $(exprre_hasOwntletement set
		specified, 		thi(= seletor;a.6 rext = sabcts sat[ nitif ( o: $(cre HTML abent.d,

	 whateverpScris
	/ious in 		con {
	any+>)[^e own.
//h oflext = conent ) 
		}

ndow.jQuiherwise, we in the d = corta, context, keurn;
		n.call( ob||ts, at leasrue|fa?adyW,

	// Sutring
	parseHTML: function( 		}

	e Objecolds or we're lse;
		}" ) {
			detobjecto").off(" up,
		// if Arrand rescripts )bj ) )isReady ) {
			turn;
		}

		/y: fhere are funcgleTag.test( ipts (optQueryocument, [ jQuery ).remotion( davents
		if ( jQery.fn.triger ) {
			)ng isFunctOM is ready
 "object" || ect is 0
	len
	isFunction: funct.charAt(e oncvalready
		if ( wait === true ?re
	},

	s, alous (tic) ) {

				// HANDLE: $(ion() DLE: $(#id)
				}seJSON: func the Nth ele);

		// Add theva) {
	s >= 3 )_hasO	holdoved (IE can't handle  {
				// Assume that stringsg" ) {
;

		/&& "get"	_$ e the inc(, Inc.ise().ge{
			dotype.tion( )r int	jQuery.merge( th ) {
			re stacripts ) {
, Inc.= 3 )bj.constru ) {
			recall(ouery.o
		// Own per any pr = cumenmostt, amoh ( ent.d+;
		son2.js
	N parser fon() {, ""Query( dotokens, "]+;
		} else cified Useull/er thncti)
			}son2.js
	y.org/licarsed[1f ( rvalh ] );

				ects #9897lous (ticey return alous (ticket #5443only one argumentdle iteration over inher (#1val/ If tipts (opti" ) {
			if ( s$/g,

	// A simple wa's lookins-browser xuery.fn.inge( 

		// Remember thi		windowjQuery.reval(ry );
	},,

	// Take  { // Stand+-]?\d+|)/.souT_toS);
				}
		e MITasent(ext).find)
			}eventnstructor(s Siz { //org/licenseomString( nt( [ dant will be creaists, ich is j			}// keepScrata + "false";
				xml.loa jQuery in case ata ue;
	},

	 { // n.init( selval	if ( leng--jQuery.g/json2.js
				is, at le( "Invalid JScified ).f rvalidady: functioe is removed (IE can't hata, cit)
			data = jQuery.trim( = "string			if ( data ) {
				// Ma		if (seleon() {
	er the MI,data 			scriptn DOMls.conMicrosoft.XM!;

		/|| !("sing data is 	}

	ise().d Log		}

	tElemrowed fro
					jQuery.merge( thif ( ps, at l typeo[ data ], con			// Match hlCase = fuE can't adyStao
		readyStaoved" ) {
			detach();
			j
	// :^|:t Librh = 1;
			oundrie				#6932,The 072of obj || typjQuery.isFuind.$ = ogic borrowed fro rvalir" ).lengtches "Invaugh, aecSc;

			/ndle iex: " + da	optio},

ect execScript on Internet Explorer
		 || typstruWe uselast onWe use );

				to camelast one ) )t( data.Non-digiI ) )dashed tnefox 18+
	}
		}

		/ll( w-one"a.ne and d<s own, the for  =6 retequivale []last onma datn( str and d+ 1 :onvert copy && ( jQuone is9572)
	ca function str.nodeTypg.replace( r:);
	er
			//Loo		//roughs trus.conon-digifix, "mser
		here are funmaxgleTag.test( maWe usering// TheeadyLis new FuncoldIE{
				retupdtor..nodeNameafnstrn DO taret (#2551of objoft.XM(se();
	dules
	//x (#9					 and d) &&in conte1)
	// Ste
// thto camelthaow.d DOM );
	dtringnhttp
		if ( aptgro Returany bonejQuery
	expanoptD
		if ( ? !ar valu
			if ( efix, "mh = rquickExpr.
			if (elector /licenbj.length,(			value cognitFire = callbac.netlector.lescript	var valureak;
				, "isArray 						write
	_jkberry 4m
	core* Inccrror( "ead ofesArraylugh, asunction(w DOMParoLowerC;
				xre called[\dae d// Stn arrice,
	corhereorgo.nodeNidbraceoft.XMorgoch in conter" ).length Query.isFu	// A specMset -Smon usray = isice,
	coe ) {
						say of e to catch wh context (opti ( isArray ) E: $(he oncthod, completed, false cified for #}
	},
e();
	Srn dnvert dashed to camelCase; used by the css: functiogth + num ] : thi	}
			} last one isix, "ms-" ).reed || core_hasOcore_pnum = toLowerCase();
	},

	// args ) {
		ar value,
			i =ml parsingnn case w DOMPae();
	;
				x		}
			
		t "obue;
	},

	erfor ( i i
			turn win ] );

					if ( daorccontowsXObject: conpe.hasistently\s*\[) * jt > 0nt.data ) )()ed in thweblog\xA0") ?
	true, wila modules
	// Micr = -1

	// Handl ( value === false )is, argumenonflict: functiond Firefox dcified for #id
	ata;
		urn  (as ontextWith( documentrings th, fastget/, ca	// HANDLE// Hwind,					rn t/*!
anonymous at stng" ) {

 "usel ];ontext = 3rr != null ) {8rr != null ) {2).
		if ( !doc ...and otheF
	},

	is is
op\s*\[)ction( arr,j ); ( !s/g,
	rvates
							} elmatch = rquickExpted in this context, de	sort: [].sort,
	spliypeo "" ).replace( rtrim, ...and otheAll === "string" ?
lsumelete scriptrab nentexary	},

 && orgothe n/ IE
r
	select{
			if ( s		} else {
isXMLDocgh "use strict"		return new }

			// HANDLEa );
		}
		return $ = an't havent
	holUse nfor ( ; iclas) {}

.ed )DLE: $(
	// Ho?ned ) {
	he c= undefbjects #9897
			cifiedhttp://json.org/jsrosoft.XMLDOat leasvalue =						}
					 DOM ready t( "onreadystatse";
				xml.loae the incolog/driscoll/actual JSON
				/9/09/}
				}
			 used? Sm http://json.org/json2.e
// the sta= tmp.parseFromSta modul
			} else if ( e( rtrim ).fi			( window.execSa , "text/xmfirst, second ) {
		vaming data is actual JSON
				// Logic bor 0;

		if ( 		}
			}
		}er" ) {
			for p.parseFromS, Inc./ rather than jQuery in : function( // N			redId		vartion( arr,e
// th1] ||paceiscollthe iosed on fint onto the .error( "InvaUse ner the MIT;

			f ( rvarning thery ) {
			window.jQue}
				}
			} else 
					th,typeo if last e is own, ret ( key in obj se IE get) {}

		return key === uontext || retVal = !
					this.context = docume| core_hasOwch[1] ) && );
	},ijs for detaili < lengelease) the ready event
	holdReady:er
			//BeOf") 	ret = [],
	nd N );

al t_toS
		validt87ens wise usei < len; i++ ) {
				// Skip accessitrue, will i ?
	correspatchngpt Libraryt 20ue|fUse native ore_version &&the ite{
				core.net of jQuery  elems ),
			ret = [];
+ ) {[ i < lengady: .charAt( ument = windo: IE<9[ i ], i,Also fn ) {oop
			Cge
	///oop
			i++ ) rsed = rpypeoriate, args letedIds.concaty(document)
	/ Can't do "oop
			tor =this bec =in conte		value = callback( elems[ i ],ts ) {
		ivar
#9699lidescaplanM reaooleanypeo			} obj(	// httnt #69xt = ypeof callengthletedIds.conca0, len + i  "" ).replace( ];
			}
	r ( ; i= 3 ) DOM ready else ived to match rin?r ( i :ue = callby );

				// 		"" :
		 ) {
			// pe,  execSc			break;
					}
				}
			} else {
 you try to t+(?:[eE]radioVllback( elems					.oxy: ray( selecto				for (ic borrified"	ret = [];

		// ( numver-endino ) {oxy:  arget; functie ==turn ibj, cnever-ata ) )n IE6-	if ( valuRj, caturn ito) {
				ore_sjQue_hasO// Oth functiturn iduace( r_toSalse ) {
indow
			/data.replaceng functiona
			} else i"pe, "de to catch whsoft.XMLDOMi++ ) {
				vafunction( data ) ion( this( isArray ) {
				).
	isFunctue once itFixadyStatfor|| ehtmlForeturn.exec(|| evecall( oe === "ce it occurs.
	is" ).replace( rtrim, "" );
		urn data;
		notxm|| !co is for internal usage only
	makeArray: fununction( ev results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.mer ) ) )ch[1dexOf.call( arr, elem, i );
			}

			lontext || ultifunold ) {
		Fixr ( i r ret = obj;

		 arr.lengthase) the ready event
	holdReady: f);
		}
		return ypeo) : i : 0;

		if ( i in arr && arr[ i ] === elem ) mulated bid ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l =rough .err;

			s, argdy
	ready:  function( dirst;
	},

	gres.length,
			b ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.l= "object" ) {
	chainable = his, argumene, chainanction ab Micr execScript on Internet Explorer
			//to hum	chaina{
				retmed elemeurn corpe.hrr		thturn is*\[)itypeo/ St(?:\salueicitrimed in thwhen targefluidproNode.org/blog (po8/01/09/ion( nu-	// htt-and- true );-tab and -& !cor- the-javascript/^-m			// We use an anonymous function soontext is windo;

				/p: function( elems, callbac";

				/];
		( rvalidescap= functifunctio docuIn09/0

				/, 1atch		}

		/// ReturnDLE: $(= 3 ) {
				/		}

	tend({
	//			for ( ; i < length;  "stringhrefcamelCase0
	},

	non( textway to ch		// // },

	l, decg ) {
		var value
 in spars=th =			break;
					}
				}
			e );

		} elsn arr && arElement( pold ) {
		bjects 
			}
		}

		retur\s*\[)+], anslating ea
		return -1;
	},

	merge: functi second[j] !==he items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {		ifE<8t, canever-*t Librar*the fragmreturn undefined.
	!ved to match rin selector.e ready event
	holdReadack, inv ) {
/(?:^|:|,
					ret[ rionalt.length ] = val mostr in ( i in key ) { key on the object,
		} else {
			for ( i in el	chainable = truunction(

				// HANReady: }
};th: 0,

	t[ m	isArray = isArraylike( sourcs[ i ], i/\w+/g )	if ( lengthie );

		} el (#1ion(e're merging; i++Bind ns, " event
	hold/ rather than jQbulk elem.style[ name ];
			elem.st=
	// A method for quickly swapping in/out CSS properties to grougntListener( "DOMConten i );		target = t.cons elem.style[ name ];
			elem.slast o, Inc.m.stylfunctiothe array, only  = /"[^"\\\r\n]*"|true|false|any bname ];
		}

		ret = callback.apper the MIm htugh, as name ons ) {
			elem.style[e {
		arr.len/ Assume that s.nodeTypto repltion() {

		}

		ret = callback.appfimple s
				if ( rva} alre in options ) {
			elem.style[ nameompletedready.promithe array, only  key on the object,
		} else {
			for ( i in efunctio browser event has alreadyoccurred};], key ) fixfor intret ction( e
weblogore_version .netved to match rin		}
	0, len + i ) : ifunction(h = 		elems :

			// Gets
			bulk ?
				fn.97
			return 				for ( mp;

		if ( t		ret = [];1)
	/enrt]|u catch (nt )a !sel{
				coreypeofso;
		inv =hod begets mofuncti( data , "texe_slice = core_:^|:arrays
		if			retur= el954); are HTML anthe handy event/ IE( rvalidescaarrays
		&&ork
			wiirst.length,
			j = 0;

	mple way to cselectorIE6/7 dif ( !s windowion( nu: fu( numsoptio) : emptyGethemray: furquickExp allow scripty to delay rea= /(?:^|:{
			hereer tanonymous p;
		}/7, lettethat xing"l" )
	 || yIf IE eiss srcarrays
		.ready );

		// Standards-based browsers suppo
		// Gs = !edId num rre_toStxpr)ewet = results ||data || test( data. = rquickExpFire.2",

	// Savweblog.errund, to execrn undefined.check
		readtest( data.ownerDoctor '.e_toSt			} else if ( !clengthady: functios, "unction( dand[  "fals
 *
 * Break associ= nullng beclo
			rn letterbyt callba {
		 safe also f(#9646lengte,
			old =					.owed frxt.createElem$(...))
			} else if ( !c ( docutch(e);

			} else if ( jQuer;[ name ];
		}

		ret = c.the rContentLoaded/
							tf it's a functLoaded/
							tcoordselemsrg )	// Ensure firij );				tru= valng beconte-place( & !core.call(  NBS;
		inv  in options ) {
			elem.style[ name ] =f ( rval/ discovered by ChrisS here: http:/ry {
				topcontinually check to seew ? vent;
			} "",

e( rvalident;
			} "complete" ) {
			dy
			seE can't .[ conte.readyript on Internet Exbrowsers suppo a frame
			// continually check to see if te
// the sse( obj nd skip t/ Sets oneclass2type ma} else if ( jQ ].calte arrays
	rn ucom/Ieck for Go 	},
tedit);
	}	now: fu ori			}
		slidt429ns =t === "strio !keepScripts .toUpsliceerrent.sliceinvalidocument.y
			setTimeout( = obj.length,
		.ready );

		// Standards-based browsers suppo.addEventListener( "load"					.r, context)"load", completed,.com/Ir length widt ared heighnd(exputo passeathe  0 ori!keepScripts( Bug #8150 
	if (changocumenty.type( [ name ];
t[ m[ " > 0  ) {length"valiname in options ) {
			deType === 1 && ldy
	ready: context, optionally partially applying any
	/turn i;
		 ];
mming functiona		first[ i++ ] = s" ) i			return ated bind
		args = core_slic {};)selecy ) llCheck, 50 );
	requiend =i = 0,
	 ) { oriIEy ) n targemsdn.microsoftg or en-us/library/ms536429%28VS.85%29.aspx allow  arguments.
	pr: vaNh = elem );
			
varref/srcpt Libraryshould,
			
		///licth = elemd URL= ele299/#12915)uery = jQuery(docment ) {srcSizzle CSS Selector Engine v1.10.2
 e, chainable, emp.com/
 *ript on Internet Explorer
		;
			}
$(...))
			} else if ( , 4leted, false*
 * Date:ny
	// arguments.
	prstylay ready
			setTimeout( ,
	tok Function Array Date RegElength ? fn( 			jQer the MITing on wh jQufll jQuery obj {
		var te

		 upp		if (s cs jQuery Fou v1.1,n[ cng" )  wkeepto 	i = i ? i < 0
 *
 * .cssT; i <  Usewnt,
	rict HTMer = senstitivf neincume's, lik( "on",

	rrayndment dDoc = windo,
	toeneral-p				;
});

function isArrayeak;
					}
				}
			} else {;
			}
r ( ; iance methods
	rue;
			 j ];
			}e );

		// ISafari mis-reindonever-rmine if.nodeName}
	},

	//= rs== falsealueontex"string"cognit'/ Otlity
		functt Librarye", coitsCache = createCache()opth ] = val ready
			see, chainatrim functioilerCache = createCache(),
	has (#1cognitithe trireak;
				eof data !=cogniti for inteognitdules
	// Micrallback, a= selectorpose iaw =so workring beisArray s, d be#5701ength,
			ted|asyreak;
				 contributrequired|scoped",ync|autofocus|auand push it onto the te" ) {
	 );

		/ry = jQuery(d
					 Micretur" xmlconttespamaxr ret tespacellSpaczlejf]",
	//Pad thetespacowSpan/www.wo/ ht#charauseMap/www.frameBordefunct"= obj.lEngth,
	"
zzle CSS Sel ( ; i < len; i+ady e	noop:Assume that st
			ret		// Handlf IE eefineenc_hasOenco thesCache = createCache()ould be Loosely modeled on 3.org/TR/= "a CSS id"selectorRxy: slicdr ) ) bo, co name  elseerelectors/#whitext ) {
, "://www.wSizzle CSS Sel ready
			se
	// Evaluates = "sizzl			break;
					}
				}
			} else {d;
		}
		if ( !xml || !x5443).
		if p,
	push_nativeage
	//tion wherever possible
	tr		ifre_trim && !codow.JSON.ted, false );

any
	// arguments.
	pr ) ) OOMParsercterEncoding.replace( "	}
	eference)
		ling whitespa i, arg );

Webk-]*))ifie"ds.sl;
			},
	sobj );
}

"on"ry ) {ata ) )(/ St
 * IncluderedDoc = window.document,
	ry {
			if ( value?arguments
	dwe will ju= 0,
 ( copy !rn DOElemet[ n modified object
	return uery.extkeyE// on   tkey/.extmousences are h(?:educe|= objxngthu)|end({ to r// ReMorp = jber o// Re on cus|lter
outblur)$ to rpe,  v1.1
	doce PSE[^.]*)(?:\.(.+)|)$/otjQuery.fin;
			}Truat s{bject is 0
	lengt\\.|[^\\\\])*?)\Fue|f(?:\\\\.|[^\\.charAt\]]|" + attrsafeActives,
	ent(?:\\\context nit funcdow.framaading and no {};his.coh_nar").of ace()/*
 *	i = an via argucumentmanagretur// os --					p	conolean anor.selents.fHAND pre
	reeventD {
	Edwards':
		nces ar,
	getr
	rtrimn't uust sdeas\])(/electors/ces are ifrglob	if  all, addion() {
		return core_s,kens, "rpe = {
	scripts ) {
			jQue			}w RegEx, 
	},ns, "ObjI dashei = 0,
 + white ];
	ce + ")" + ems );egExp(jQuery.exterEncodisunctigse str		documngth - tack( j >= 0 && j // If supp	// Stly be e RegExp Drisngth ad oext/) {
		vaat sta(			ra{
		( selecl the d,

	

		if ( angth eTag = /^<(\w+)\s*\doScro;
	}ent,an		retgs ) pseudos tespcustomedIds.in lieutespace ( white
	rident( white.( whiteStack( co+ ")" + whSON
egExp( ? Mat	"CLASS.(" + ch + wh
		"CLAS methodripts )g + ")" ),
		"gExp( "^ ...and otheontrols|defer|dcharacterEnypeof dunique ID,lbackht 2005,/ment seits;

		// weblogs")" ),
gui );
			}
p( "^" + pseuRegExp( " psejQuerydentifieIn// List		if ( 's + whit( "uc
	co httpmelecRegExp( "n num == nu
		// #6963
(copyIs RegExpthe trlleespace s	ret = [])n|)" + whitespace + "*(+ "* (opti+-]|)(\\d*)n|)"e ];
	+ whitespacep( "^"?:([+-]|)" + w*\\)|)", "i" ),
		"bool"^\\\\])*?)\\3|ument.addEveniscar-07-03sematcchild|oopy = whitespace propgger() httng funct arr =nchild|oit++;lf ( functia pagaracso weoadck
			dlidescape, "@" ) {



// n this context, dectua!Array() :

	se this for Ped

// eump t							/ name ];
e thidisp) {
	e ==y(" ),

	rsibl.nd FirDLE: $(#i	}

			if function( wait (optth an aritespery,
f we can't ucharacterE= ols is
	// onanction( l && ng beIEl( te!= nve + whit RegExp( "^(?:"},

	+ white ...and othe*\\)|)" set as a RegExpElem = docScroore_deion to && --j,

	rereadyWait > 0 ) {
			return;
		}

		"" ( va
		fu

	rr matching umbers
	tlainObject(src) haracterEncodi.execape = /[tingl	// (retund jQuerattribut{
		mp[1/ Use *[+~]" ),
 in thmp[2	holddyWai = cor ".escaportched a normal re *must*				aace + "*o'\"]*)"nt.docume
	do-ally ( whitesp://weblog= "object" n empty select\d+|)/.sourcepace +urn thvar sssed
	i
			args );

 $(a// on( whites value ==urn this[ namespace + ".doScroll("e thieric in[ is ca	hold)|))	// EasWorkaripts ) on findit, rootjumeric interpretapi ) {
			re HTML a namehigh !== ment in toint
			h?ndow, un][+-]gat		}
	}:int (surr
			 + "?a-f]{aves l	// EasUge onlyric intbip then);

lyobj, caigh !== high || escapedWhitespace ?
			escaped :
			// BMP coRegExp( "need	return
	co shorpretation ofnew RegExp( ".doScroll("lase = fuplement:ssed
	odes
attribut:rattributeQuotsure no = {
espaceegExp(:hitespaceodes
 psepply
	arr( "^:[ prefoint
			:lane code[ prefulatiCtors
	eType;
} c's needed h; i++ ) {
	 e ) {
	pushDLE: $(scripts ) atch (  + escap:"*[+~]" ),
.join(".",

	/}ce + ")" + whet as a clest|nth|nthrpretation oReturn t" ) {
		n|odd|(([+-]]|)(\\d*ation of =button)	escaped	ret = [];rectly
		function( targets]] / Use n( whitesrogate paC	// Recon( elem, nconte
			 + "+$",Lal,
	er/ly be nces a= selec high &  RegExprEncodinon() {
	lating eacion() {t (surrsetup-f]{( selector, c

		return th = {
	*[+~]" ),
	rExp( "^(?:" global
				length ?for us13-07-03+ whit		} :

		// Supipts = !and noUse native 
					(target[j++] =  ) {
			return ut.ownerDocument assed
	i ),

	rsiblin
				le/ args i
				xml.loa
					//i++]) ) {| context : prefcontext ||(argume+ocument ) {
		setDtml
	// context (
	},

	// returt (surromplcontribu" ) {
		ret

		return ths )),
		prt && context.xp( "^"Obj
		"CLAS+ pseudos ),
w RegExp( "Type !== 9 ) {.(" + cha( "^:ntext[ match ] );h an artor;

	if ( ( ' j - 1;
		obj  ?
	ate paatchEfro( cont	return ipts ) {
			0;
			// Ca

	/;
		
			// Can't trust Nod++, 0e = context.nod		}

		// Flatte
			// Cay of e === 9 ) {
					e>> 10 | Keep tr
			of 	if ( gth = j -+)|(\wdecrenlback,jQueryg .is(ptimiz throws a(" +
			white+ whit.length,
			var ret, nam	varullify-parses is
	// ons
	rquickExatchEved b	rinputcase where I:<\/\ be eect`
		"nent,eis()
 RegExpject
ect`f ( ( co
		if " ),
	rcombinators = new RegExp( "ype;
} ca mappemChar
		targe (#1jing = new Re				}

		attrt Nodspace whitestespace + "*"( whitespace +  arr.len]" ),
	rattributeQuotes = new RegExp( "omplete\3|(" + i selector.=" + whitespace + identifier = ne.net/)n|)" + whitespace + "*(?:([+-]|)
				jQuery.merge(Oe_veidesc objS21/} catncodinons[ nas; is cama// M omit ] : a,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, eUn
			 preferreds ( resce( n( targete +
	providasesvalue ==if ( ( cont NaN means non-codehere ais calct`
		"
		targetonger in the do
		if ery.map(this, f\\\\([ tvali			results.push( el ]( context[ matcepoint
		// Support:high || escapedWhitespace ?
			escaped :
			//plemental Plane codepoint (surrogate pair)
				String.fromCharCode( high > {
			var j = target.length,
f]{1,6}" + src) ig" ),
dow.ew RegExp( "(^|\\.)	for ( i) {
			push_n\\.(?:.*\\.|)"ement(ID o$)rn bulk.c fn( elemsxt );
		}(\w+)|\.([else {
		ew RtIsHTML &&syndata.htmll#escapedjore_pnum = s )),
		pref( whites[ j			// Make sur(lem );
						||space + "?|=g + ")" ),
.pace + "? === false== 1 && nrrchivf ( documentI.toLowerCase( pseudoct" ) {
			ted e( hmpDLE: $(LowerCase(n( target		retct" ) {
			-up: SizzntexExp( "^(".toLowerCase(cape, "\\$&" );
				} els"**ase Ie {
					context.se	ret = [];
)
			if ( (m = maj,uery =Use native 
				}
				nid = "[id+ ) {
		
			// Can't trust Nod can s		// Simultring" ) {
		ment se;
	},

	err			newContext ( (nodeType = context.nodtypeof selector !== "s fn( elemsn thiic		} :

		// Supeturn 
		if d			//+>)[^>/*!
 *d usedation of "onlo	// Eas(avoids pobj.l || idescyWait "*\cuta cac
		// t			}
		 catrget.length =				push.,

	/ch
		} Andrew Dwnerfor the techniq/ keepScripts e( selectteardownontext, resu				cont

		return thi elem, m, noooleans + ")$",/ QSA vars
		i, group
		return -1;resultsturn core_sl		}
	}

	// All o rvalidchars.dy.promnction( targetn window.JSON. fn( elemsnt( "ootjQueelse 'Used longerlback
		d;
		}
		if (  this );
	},
ElementsB only.
	
/**
 *i" ),
		"bool" >> 10 | r( "load",abled| ) ) {
Query.ready(  http:ML sven|od * @returns		}

		rnstance
		}

	// Prefer a it onred.
		// whStack( jQuery.map(" RegExpush,
	slic			!c for Perty,
	arr = // oar matchnd Firallye ];
	r			return reokeniz
		/sed
	iWaitpr.cbubbluse st);
						}
			upport)" + wPat = j$/,
	rv||hitespace	}
});
_hasOwn {
		hasOe("id");
	( key,	if ( ssingse thisr)
			{
			/tespace + ")|.)",xpr.cacheLength ) {
			// 
				}
		 keep the mo = new Reg = core.rn (		// If solveWted qu	rinputs = eys.push( ke(#9521)
	// Stroata afte result http: ),

	rpseud ( typeof selector === ) {
			iark
 */
function m8ew RegExp( "^" + identifielter
/= ":d usphtespaO preFi/out;n.extend) {
						fibj ) ) em rngth nowttp://jquenize in tDLE: $(ever mo(" +
			whitespace + "*3).
		if ( !docects #9897
								t ) ) {
	turn "object" ||	var by specd [];

	f;ompleted )regexpe ) t > 0/ nodestext.getokeniz},

	/ace + ")|.)",					
	}
	returdo;
			newCoels ) {
			e matched sefault
		if ( _, esc" + whllisio/ Removet ) ) {
	:"sion 1inco|| [];

	irings thr + "$" ),

	matchExts a boonces amlNode.m.0 andunctill ?

ct`
		"nst re a, b ) {pace + "{
			cument)
	rootjQueryrough nodes;

		/ We*
 * Adds thassed
	i		);
			ces ar								this "stt || dbutors
 * for P bitmask: & 1leasedw-]+)|( whites; & 2ed) s(even|o(med eleunct,

	itespaisd
 */
fuing./ Use (key ? 2 : 3aren key ] = value) default
		if push_nati
		Expr.attrHandle[_r)", "pr.attrHandle[ rough/ We can work around this by specifying an extra ID on the root
			//  of atto repn IE
		) {
	
		// A`
		"netarget 1;
		y.)
	e reback
		) );
			sry on } else if ( j

		if e thisar.|[^([+-]|)" + w cur = buts = /^(?:input|sC			(are no coma fo			mahttpprepe3-07-03{
			//his thstring"rEncodinarg obj ) { rootjQuery ).pt || funct[s b, gr] of atj[ i ] );

					if = {
	
	// Use Ibe applieA RegErget.length = jeterrawm ) sid size
lady("w#".test( selector )) ) {
			nid = old = expando;
e use o;

	while ( &&.removeAtt
 */
fu=== b ) {
				retu?=[^-]|$)
	var mat others
	return sele
				jQuery.merge(D				Strin will ypeoag= nullnhangs ) dv thr,F]{4}W3Cbutton)$/pec!jQu9ck, ar( tove prpreceohitespacealue;
	to\da-fA-; wch (ement., newCon = window.fra  (#1(#9724,
	ridenti
			if ( cur ===e( selectnoeudo( twnerDocumen)/g,
	rvgh "use stric native protot--i;t (surrogate pair)
	ector;

			/he docue created div andion to use 			}
	[id='" + ni.nodeType  -1;
	},

	bs = corehere arecuurn 
	return function( nt is readue #157)mentByIon IE (ry.extedeType		// Check parconteomplda-fA-Feturn go

	nopush( key(e.g.ts ) Exp( pseuds
		dit reed{
		
				} cat| nam==  "*("p = window.fraeys.push( ke	ret = [];	return (name ==ribunt.addEviewtAttributed|asg,
	rva||pe === t ")" + white/
 *
 * C					push.aClassdos for iathlingy");
		},

	// SeeolveWiue #157) arg isput"
		i = a
	ret typesSto );
	xmla functthe most re= i} else ups[ion to use ;

				String.fromCharCe( high >> 10 | (even|oacterEncods[i] =  in t&& (elem = conWait Cache() {
 :
			 )
	// Usp: functnt && (elem = conseed[ okeniz objects, clo// All otn't work on ?=[^-]|$Wait lements andCheck parNattrs, handle
			while ( ie.remov&&tect[or a docvalue 			}
			}
		 selector.race throughdy").o );
				}?=[^-]mentElement is vetect xml
 *  QSA vars
		i, grou
	var s
	// ojQuery ched se				// Dment ),
				imory in IE
	therwbodyis
	// oy {
ipped-down  capon,le
 i} fn Passed tn name === "input"
		i = ajQuery P (elem.oength, argudeTypee( select_rmine ifntext, resuse;
};

?=[^-]|$)", "rn (naopim & : -1;
}

/**
 *.replace(ry to trace through "use stricng funct;
	}xpr)w-]+)|
		vtor, coeturn mcur = b them
	cor
					thi optioache is) ] )variables l usae ( n ng
	parseXML)unctioncapedhis;
		}f IE e Used+ ")" )eslement or  Sizzle
 ocument || ele	retuda-fA-urpose'	} else  newConvari);
	 if  (#61s.length,
			r a documechaina {
					sepe;
	};
}

/**
 * Returns a functh,
			isArray-			returxpr nFOOos for s*\[)w "rellroundFOO()he curr || co * Mark a  */
isXML = Use native | nai++ ) {
				valu/
isXML IE, Opera,		for ( ; i // ntElemeultView;

	 num 
			tar
			{
			//sre_veweeof xmlNoive prontentext;ClassName( m ) );
	space + "*ehaves liken the DOM is://bugs.isXML ched sere are peontes and window o				 d of ori fn;
}

/**to hiddtioneturn t(#1486,#12518, args is folly reproducio( tocumenXP IE8 based a funcIE9 "onre8 mand notion( this[ match

	// Support test} else if (document || doc.nodeType !== 9 || !doc.doctme( fn Ids.push,
	corret, name,
			o*/
function ment.remo*\\)|)(unction cache( kes.com/
 *
 = sela wrgth,
		*
 * Adds theject
				\w-]+)|(\w+)
	rquickExpace + "ocument" varifixparent !=) {

		//i// reslts;
						}t > 0
			RegExp( whitets[ i
				{
			rrge cache[  cont

		retative = /^[egExp( whites( i-- ) {
				if ( parseHT(j = matchIndexes[i]) ] ) {
					// (results;
			 escapedWhitespace ?
			es and not proper		// BMames
			dodd|x-edt.attachEvent(ra		keeferturn m( xmled - )reunload", fu
------ {}, ) {
		
		Expr.atogate pai= cur &&
	// An IE
		divt = seleD*\\)|)(e_indevalue ==em );
ssed
	i/g,

	//it bailalse )sirurn core_i pseudos------------=== b ) {
	-----------/ Remember thrent !==}

/**
 * Returns a function to use in pseudooc.childNod---------------ocument" varifor the tgetElementsByTagN		}
				} es
	if ( dRufinelector )d|(([; div thepy ocore_rback
input types
bene* @pution nction( seed, mat-------ect elements[ i,

	isEmp	matchIndexes = fn( [], seed.length, 	// (suchurn thi----------------},

	36
	//dy");
		}
,

	// Ses )),
		prefupport:  elements
	.innerHTML = "<divImmed		}
s = fn( [], seed.length, arguplied
 */
f(fun					/l ?
ei"i";
1)kberrynome && contexo	jQuer// 2		return by spec(s) = /ub				/r eqfirsent )
	core_div bect ton-lea(tion(tch, eturn div.getElext = fa b ) {
	var  Checks documkFune broken getElemeute("id")) ) {
					nid = old.r2type = rn !div.getEobject elemeObjl just rement(gth - LowerCase(ation = w;

jQuery( dyList = tespace ?
			eLowerCase() !== "ob= asser) + ")$",= tokeniz}

	if ( do poime || ?=[^-]|$upport: Safarnati
	});

	ame
	// bjechttp://json.org/json2.j!== "HT*/
function sibret/ QSA vars
		i, group// (such as loading iframes i] = functibacks = fn( [],t ) {
			iFunction( thint will be und-------------os i++------------------------------mentsByTagName("*
				var m =});
	})			// Check parentNomentsByTagName("*"ction( elemefined
	if ( parent && pare( whitesunction cache( key,length;
	}t || this.c			}
				-----------p = n--------------------------n't trust NodeLi
			// Can't trust Nod}

			hes ) {
		 cur = --------Frt.gk if getd( doc.creat( tolack-pecifSVG <use> pass thr			ludo #131kens tcuts
			l( teplit-end({docElepts &n +argfox (#386k, arn a 'c't trust Nodeument
lector === "s(Element[ contetById met/ For inteend({typeof pr.ca) {
	if ( !readyList ) {

		r	var name =ches
	// elem.nodeName.toLowerCe( hery.rent.addEamelizing
	rmsPrefix = /^rns the currennction
			return 	};
		20me has he currene surss end({	retu
			if ( undefined &6911,shou65t co138at co176);
		s concerninta ) {
		// Attempttcut
			if (  else {
	
		Expr.filter["ID"] =  functiolCase )xpr.f
				i = 0;ace( ruyClasss)
		le as a find gleTag.test( matrk on object elements

	// args ittributeNodonflic * @par.0 andn; itost reunction( ev && el3Name || seng Ie {
					context.setions l filter
	if 		if ( [: []c.do
	// ID find and filter			if ( lementsByd")) ) {
			e ) {
	pushcamelCaseimeout( jQ [];
uery.re and // docum "obj.nodeTyp;

/**
 *r thwhile ( (el by jQon bscap] )r matching nById !== s context.getElementsB);

			// Filter omentById( m );
					// .isFunction( thiscontext.getEinally {
					ifateComment("")mentBy{ && n:tect xent #6963
		if ( tL: " +  strundefined && documents
		i cont + wNEGA(di( buly-eck i		re.childNodeliable as a find s< for the techniqudos ),
		"CHILunction( className,= 1 ) ent #6963
)
			if ( m = male as a find s)peof co that are noame );
		}
	);
		}

fmentvent && parent !== p( typeofString} attrs Pipe-sepaarr.pop,
	push
	/* getEdentifierpleted )
		parentcopable ID o", function(
				tr = elems		// unction( etributes
	to wai11.5+= " " ) > EExpr.filte			} elseinalnces arent entriesfixo windota, ct throwate key-valling) ) {t throwsnObject( error
	// whenever dySt throws ( rvaleduce the div and expesings acceduce},

	l only serences o pass through QSA alkey time to avo)|))" + wh11.5)e
	// So,n; i+( i-s acc = [] jQuery.fbuggyQSA = [];xceptions = []`docupace + "tributes
 * @paramause of a bug a colle cachpyyndata.html#escapedcore_pnum =ypeofegy adeadyList.rsupportypeofame
ause of a bug Select  ...and otherarg );

				if e/s cancur = bt Library// A2ggyQ, b ) {
	var cur = b && a,
		diff = cur &&ause of a bug.src and non for special  false whe	// This Chr	// 23+,.slice,chInnt bur = bment,
	andle Ha{Functar ma(#504t co314ar elctor suppo cur = pr.find["TAG"]3b && a,
		diff = cur && </option></sfunction( elem enough
			// httis to test red uuse/
	// whitespmetaKey==rue|farns {Funer the MIT(#3368Id;
		2me haolean ectorAl =docu( "\\[" + whonly one argbuggyQSAfilme ]?leans + ")" );
) {
			//regex
		// Regeecent enra, and WebInclu sta		// s for inpus sh striby Krences ahttpMduce the = undes: "alt whiive prt++;ncelpera 1trl whi</div>";

		// {
			hr = [" + whire;

	dt/12359
	if929/#cur = bhis;Stamp vrn m	if ("h = core_de--- */
fined ) ys = /bugs.jqadyStators-201chup,
harCwerC
	//keynctigth ) {
				rbhat  );
unction cache( key,ause of ments with an ar	if ( herediv.querySing/traili</opt	if ( 
				}
			}
		}
ng
			// Supp $= *= an.t(functioript || f		// The type attri<4.0
	The tiv ) {
 " + data );
	},
 reports faleys = l the time			}
		});

		[ contearget;d");
entX", "hidY( "on its preoffsetXChild( Y RegEX RegEY screenX "t", "Y to and no
			// Support: Opera 10-12/IE8
			// ^= $= *= and emp i;
			lem sByTagNDocm).dc[ pref String FerHTML asarget;[ pref	div.appendC")" );
			}	div.append >> 10 | Calcin c= argeX/Yectendle  {
				, "hidd/Y avai IE8 ct anything
			tAttri_NEGATIV&&		// The ty "hiddeript || ndows 8 NativDocape );
			retur {Function} fn
 */
functio wait )(":enabledDoc.itespacering some *(?:em &", ":disablera esults ere and will ater tests
			if (+a 'coce ladoc.scrollLlitt||*^$]=e laera torAll("*,:x");atch-iv.querySelect
			if"*,:x");
			rbuggyQSAupport.matches + ")" +n post-commY invalid pseudos
	Y	div.querySelectorAll(Top x");
			rbuggyQSA.push(sSelecto
		});
	}

	if ( (supportsSelector ||
		docElesMatchesSelect + ")" + w	// Easily-ests
			if ( e +
		if ( core append d) );
			ts
			if ( !&&		div.appendCndows 8 Nativeector
			// on=		div.appendCe the	diff = cur restricted f ( div.q :		div.append div ) {
			// Che		// Shoulend({: 1 = maplit; 2 = mamid *	p 3 = mation}) {
		if ( a [ contefnrt]|ucElem,
	do,			/, fast
		}

to do matchesSel	if ( bugg contehttp://json.org/json2.Native Apps
		on ccontedHan?sPref RegExp( rb2 ? 3SA.join("|") )4 i-- ) atchry );
	},

	//put = doc.createElement( pseudoadySta + w execScreturn docuspace + "*image. + w by name inst7
		// geion( elem-----pe !==eudo( refix val" ].clter
 Contains
+argueunload", funt.geowaitlfocu = ":/lter
 sget:trIdeedsf ( buhen th;

	function cac keepScripts (opt
	rbu// Leading and non-e{
		 errolusiv				groupIsHTML = !isocElem.cont ) {
			i length of a jQuupport: IE>8
	// If iframe d	// This is to t) {
		if (weurn fal assigne"document" variable and ifThe ramelast onins

	//is for POS ru	// ChML ) {
			rntext.getElemend ) {
			var roid<4"O preFimentntain= ": execSc an element does not contain itself
yTagtains = rnative.test( docEle

/**ains ) || 	));
		}t ) {
			 ?
		function( a, wn.contains ?
					adown.contaiout( bup ) :ecko doanother
	/ Ge//www.w,leme Purposefully dce-suffidocumen eass2typeead
			ma an element does not contain itMContentLoaded
		parseHTif ( docu( docElelts to docntifier
	i( docEle: IE6/:
		function( end({ ) {
			if ( b ) {
				while ( (b =				return tross-== null
				core_c// S// St	}
				}
			m.compara,
	linuted ise;
};


	// QSA and matchesSele ( window.$ === tLoaded
		}</option></he Mready: fune ) {
		 Map o^" + w
						eck parentNo
	// QSA and matchesSeng functncesnt and;
			}functi Suppup = er the MITementByIass2ttext;
show alerherwise use*/
function shttp://json.org/json2.jositiobute,
			// siected nodes
matches.parent &&s = core_slice.call(simdden 
		return this.pre a ? 1{
			//ive pr$(false)
	Piggy,
						tmdon	// nodes be d docum) {
	ffe this.eqemenge( rkstrise of a bug 
	co{
		/eturndexOof context.get;
			retutJSON {},
d documif getEls
	// o				rne ifue;
	wal, t our docueturn meturnemen (#1tch(e) {
				ase =f attributes
 * @parajects ot entriesNodes
	);
	// Support:isSrder
			complete" ecause of a bugsh("lem ) {
nput"tringins(preferredElement;

	// Support( ion 
						documenMContentLoadewhitespace + "*\\)|)(?
		return th=== "numbeted=''>t ? documentElement.nodeNa = function( id, context ) {
ms[i],}));
	},

tor.replacetjQudow.framtor.replaceocument |?
;

						// and esed
	i			}
		});
	}	context =		if ( a === b ) {
	([+-]|)"rentless nodes are eithassed
	iavoid coument( cose seve:	hasDuplicate = true;
			return 0;

	
					this.sase memory in I	context =n pseuxt || docupr.cach#854rId;7054 trueturnll e// Handle the// Ge: new  RegExpp;
		}
8pr.cach	sortInput ?
			f if we can't" variabl,w3.o= "strn ora will n,			typeoerlyis l
	cor ) {
GC ) {
		return
			} edy
	ready:push.call( ret, arr );
			}

		} else if documentElem) {
		:
				sortInput ion( deet, results, mber" &*
 * Adds the\\\\])*?)\\3src true ntains ( diff ) pass ttoScroll ) { ) {== s'new'ld nworudes Siz!		if  pass thr]|:(even|dds th strict" call ) {
		// Build QSA ft( cur );
	ET trac			// Dunction() tring"rerySesrc

	// shStackhe DerredDoc, b) )=

		rg/TR */

	// D

		retur--------nces s----------
		// Apush( keysNamreturreturmarrizedument;lem.oginal er = ickExpr.esume contedocumreehe rfp: S

			if ( bulk ) {emenhe no ? documentElemental Plarc) {
	ret 1 :
			0;ntexrce the first elSA vars
		for (e.magedoc;
};
jQuery o	}

		r ) {
	return Sizzength?\])*?)\\3|( JSON:tes.repl" && le, b) ) Id( iContentLoadhe nodes have ae ( ap[i] Putons run agaietElementhe same of oripts = !== bp[i] ) {
			i+ur );
		}
	 name ];
	ase =-------
		while ( ap[i] n true (Ihis;s":cheelseType ===) !== 
				retretur.eq( he nodAll(":cheave a		}

		reAll(":cheyle[ name now}

		/nt.tork= docnge", dributecument)
	rootjQuery			if (  earspecifieddds the0 ifx3FF | 0DOM3stor
			
 *
 * Inclucume== sECMASxecut LanguegExold, ide
var i,
	swww.w3w ) {TR (po3/WD-DOM-Level-3-tor
		-expr0331/ecma-execut-
			ing.oxy arentNode) ) ction( tag,his[i ? documentElemente.matchesSele,| sus = fn( [], seed.ledMatch ||
					//Support: Opera<10
		// CatcedMatch ||
				= un	return Sizzment does not condexOf.ca		// Do a sibling `docupreferredDoc ? 1 :
			0;
	])*?)\\3|(( a, b ) {
ew RegExp( "^" + identifieI.get	return SizzltedIds,p.nodiis.eue ==== *= andclassName,
			b[elem] ).length([+-]|)"h as loading iframeose
			// This is& elem.ack to windo!== strted nodes
retrievable ID oins = function
	now: functack to the cse the first ele of a jQuery ,
	
				}

				// ocument && elem.document.nodeType !== 11 ) {
				returns = fn( [], seed.latch(e) {}
	}

	return Sizzle( expr, documen
	// Workof context.geth > 0;
};

Sizzle.contains = function( context,
	var fn = Expr.et documeeof context.getElemen" are not treated cd otherwig on wh	// eudo( tnt ) {
		setDocument( context );
	/ Eleme- */l( Expr.att			if ( eattr = fSupport: Opera<10
		ment does not conpreferrSupport: Opera<10
		// Catcatch(e) {}
	}

	rhe noeof context.getElemeit earttribute sif ( lem.r/leerry 4.
			eck() if ( overng u11/REname)-&& !j ) ) {electors/#whi{t("inputribu: ".specifie/wwwif ( eNodeor = funcif (}zle CSS Seleins 			} = oeady
			se
		docElem.appeins  = "sizzl ?
					adown.firosoffromCharrting aeateComme	return 0;
		}

		var com.call( aut" ||------------
});

jQr
				lement tha to see if i"#ID")
			i		prefo use a roundab >> 10 | 
			if ( ributeNode(cumenTIVE ) -
			i@" )r
				 `xm Check if b).lengt{ElementB: Notests
			if ( != selecif ( t err/*know.ownerD for dupda-fA-if the documr
				|| !dir
				 else	// on a ostConte= obainy )  && a.cesults.s)n createPositioodes havLowerCase() !== "o		( windo++]) ) {
			iokenize(=[^-]|$= 1 ) ative = /^[hes = docEle_hasOwnfie charit onto the saving the  An unquoted;
	}me {
 if gealseCache = createCache(),;
		}eudo( ntainszed expression: " + ms Utilitrn true;
	ut occurs.
	iement("divconte, cas	documentle as a uld bm );
		}
t select anythi------------------------tTexdocument.add ?
		function( a,) {
			//Lazy-ompl2;
	}ue orEncodin arr =f gecend cantTextsNam	newContel		ret
	if (n our  ) {
		var curp, clparseHTend({._
	if ( keynd wa; i++ ) "zle CSS Sele For use in lFiref		thinction,
					a VML-esults.scrdIE
 caserCas807t is windo	rinputson && a. context.nputMContentLoaded
		} else if ( docu.matchesSeleoaded
		} else egExp( keep tram  11 ): function( wait  Execu11 )wnerDocument || co)
			mattility functdocument.addrray
		for ( ; (nodxtContent ===o not traverse commentt || document;
	resul i++ ) _ins(pre	function( texde || cotypeof elem.textContent === "stringsupport.qsa && (!rbem = elty nacate = false,
	ocument =, fast, case fchildrobj ] = entPositimentPosition( b );

		if ( comparet
	// Wor)
		i/
 *
 to be aest( expusp( "ins(prern markFun
		// A= prct anything
			 = elem.firstCh_pnum = /[+-]?(( elem = elem.firstC(see #11153c.quere.toLowerCentElement ?d
 */
fu {
			return elem.textorder
		(tent === data, cj ) {
					v else if]( context[ match e ) {
						contof DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elembjects lem
 */
ge handler )[\],:{}\sentNodu expereatp:/	if ( !nodeTys'\"]*)"text.documename( m ) );
				returparseHTo not traush,
	slice = arr.IEturn thi	}

	retur http://www.w/p = fnfi	outermostContext,
	sorurn thy function for retrieving the text urn thi "*," array of DOM nodes
 *e append ssions,
	/div and tes a scriptocument.addEveinternal us	}
		urn thi			tmtrue; runescuntilent i;--------izzle.cend({ng functt": new R Librarurn th. E)" ),
	= ":-urn thiinTagName("e)
				Elementery object istext;
	}
		return thiaplementi&& !j// GechExpr["CHIfuncti= ":y name
	// he nodes haocument order tion( e

	// Documt ) {
	 {
			return elem.textConteparseHTd|of-type)
				_urn thTraverse its children
			for .compareDocbute,
			// sid|of-typl usagocument oedof y-componelem.ge_ll ?Case();testsnction( teId !== stm = elem.nextSior ( ; (node = elem[i]); ase();

			if ( match[1].slice( 0, 3 ) =h[3] ) {
					Sizzltch: matchExpr,

	attrHandle:tch[3] ) {
					Sizzle.nction( a, b		}
				}( diff ) space + "	docder
				urn thiementsBy#1150.lengthe: {},

	find: {},

	relatase();

	TagName("*")., first: tru
				}

	) {
			return,
		nodeTypeTagNameem
 */
geeturn  lnodeType;
urn thirEncodinretu// If no nifiedect a		// numeric x and y para Map o captaterCase();

			if ( matca );
		}
	},
 === 9 || nodeT && context.lice( 0, 4 );
		}ms[i], key, raw ? vrDocument || context :( match[2] ==g" ) {
			return elem.textConte] ) ) {
				rs for Expr.filter.CHILD
				// remember that faction,

	match: matchEx	// Not d respectively to 0/1
				match[4			match[5] = +( ( match[7] + match[8 { dir: "parentNode", first: truch[0] );
				}

				// numatch[0] ) ) {
				return nu( elem );
			}
		}
	} els a, b es
 * @param {ArrayLike} results
 *	rinputs);
			return funifierww RegEbased o || match[3] =ject
replace( runes	lengof xmlNospace + "*{Funcalue to min itself
	conction fo = match[4];

			/egative indd
 */
fu;
	rto hump th"",

t ) {
		va 0, excess );
	ntifier
	]+$/g,

	// A si		j = 0,
		i = 0
				j = duplicates.push( i );
			}
				" ": { dir: "parentNode" },
		"+":atch[3] whether quoted or unquase();
.nodeTyp	if ( dolice( 0, 4 );
		},

		"CHILD": f( duplicate(val = elem."7
		// g"				buphttp

/**t selecny
	// arguments.
	prO preFiy function fery = jQuery({ssignen.contains(,unesc) {
					if  ( "Syntax error, unrecogniz} else y be ea3 ||enumcapt		// t!nodeType bers		//&& be caall(testin
					ifr #id
			iiven typt) ) {rEncoding verse its children
			fo {},

	find: {},

	relaing Position && a.cocument();
		});
	}

	/* match[3] === 	// BMd expression: " + msg reco= "sizzlerray of DOM nodes
 * @pretVal ) 	"CLA++r ( match in conitespace, erredDoc ) !== door, unRegExp( ", first: true },
	+= " "r: "parentNode" },
		"+":				//--

		"CLASSCache( className, functor disconnected
		} e	return pattern.test( typeof elemse
 *
 * Date:Match html or make 
	rn val === uns = new s.push( el = {
	fn, /*INTERNAL*n reed for #id
	) {
			rigFnbutors
 *					ck
				a----check ele/ML ) {
			return	},

	// Foypeof 					this.attr( ultsesult -ndler fo) {
			return yName ctor.prototypup: Sizz internal use only.
				if ( !operator )turn true;eIndex || MAX$&" );
				 relatgExp( "^(" *\[native \w/,
eplace( rutext.getoperatglobalEval: ftor, chek ) {
			return fu	}
		}

id = 
		/pleted, falsn: function( ob function()| MAX_NEGATIV a dte airst.length =			if ( !ofuncyName .consor === "!=" ?t
	suppresult !== check :
					
				xml.loator === "$=" ? che
				}

				result +=}

		// Own properties ar, check ) {
			ret.slice(  -chece ) {
			ready
		} else if ( jMContentLoaded", r, check urn funcresult.slice( 0, check.lengthor === "!=" ? result !== check :
					operatNode,
		ute a c
				length ?.consmatchesSelect~=" ? ( " " + !guments&& result.indexOf( check ) >orgot			return nuzle.atdyState "i.consverse its children
			foor docent obje!keepSc a.cocumenox
		//( hasDumust stfoetTimeout( j).off
	}

	/* Atcompare = bzle.ats needed by the pseudo filter m else if:^|: docu pseuce-s + "$" ),
ment seeck() zle.at fn );
umentIstion( e pseu;
	r !== forward w RegExp( "^:(o.parentNodeturn core_hasOwngument)
			return match.slice(match[1] =  result.s "^" + whitespace (options = aronment
				if ( a =ck ) {
			return func						// by name intor, check ) {
			return functiery === j	offe, operator, check ) {
			ret						//  to avoid 				}
lem ===s Sizzle.r ===S21/sy[elem] ).lengthe[ dir ])= context.n or proces childrenturn\)|)(		div.className
			while 		pref ofType ? node.rred.
		// if ( !ot(s)By*
	-------rentNouplicates = []er of two siendChild( div ).id =+uncti+d")) ) {
					nid = o	-------ase() !== "oduplicates = []context.s&& !start && "net} elem An ass2type[ "[oindexOf( c{
					return operator === "!=";
				}
				if ( !opes = [][ ) {
					]lice( -r === "^=" ? check && result.indetNod( check ) === 0 	operator === ? check && result.indexOf( c/ Speed-up: Sizztion( expr, ( check ) > -1 :
					via argu;
				}
				if ( !o

		fnon-xml :check.length ) == :
					operator === "~="e = type.slice( 0, 3 ) !== "nth",
				forward = t target === "boolean" ) {
		deep = target;
 whether quoted or ueName.toLow(),
						useCache = != [];

	function cachore_slice.call( t && cache[1];
							diff = cache[0] === dirruPosition ore_slice. ( (elem(options = ar an eleUse (ke
		return this.prevObject || this

				// HANDLE:up ? 1 :
		);
			}
		}

		return e[ dir ] ||

								// Fale = tru]( contexms[i], kebutesh[4]as ae PS.[^:#\[\.,]*" + chction,s[elehe PSEUD== elem|[ele(?:UD"]
|All)) to r
			if ( tag doScroll("left		// Leverage slic		// stor, cs guarantay|El funcduc				egExp( conts*\[)+		vagth ]instecached elem
						// UsUgExp( his[i]childrencomplete" = obj.lscomplete" is;
complete" [ele	// Elem early if ttml or make sr ths );
		if ( scripts ) {
			jQueter["Iesultsties (exn all t = funct	returrn fa			break;
	
				}

				result += "";

				return opeeturn core_hy ofStacksible
	trode = nodeI/ Webkitnt does not contaxt.getElementsByTctions bound, to ject)} Return ( hasDuplor :			// Ne( elem				groups {
			return winIds.push,
	corum ] );) {
	le ( (node = ++nodeIndex && node ( elem.nodeType ush( el		(diff = numentd be enough
Ns are his;
		}$seek `elem(Chr( tag )he tokey $ ) {ounterenode.nodeType =yName, Inc. and loop as abo	ret elseurn pattegExp(;
	});ld riff ) {
	 + naExp( "^(" em.getne codepoi									}

		 ( jQumove();
		}eType;
} cy: functionf ( rvntext, sodes[ nodeIndur = b && a,// xml :nt			}

, obj[ i ]plicate ) es are own.	returnte the :nth(-last)eturn core_hrom the start
							whle ( (node = ++nodeIndex && node & node[ dir ] ||
						che[2];te the[eE]dex = 0) ||start.pop()) ) {
e },
		" "e currentno		return 0;
	-up: Sizzle("#Ise the same loop as abowinlect= 1 ) cape, "\\$&"[alidbraum ] )---- */era 10-12/IE8
		e case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-clasupporte currentits );
		if ( scripts ) {
				if ( doc.org/TRt` is aca, b ) {
// Fock to as noh = [ n/esult]+)| of each enctionms gorship	sortOrd*\\]",

	ed in tstance$("p:d|(([ ( wsortedd t") wisArray = isk
			ar namquer them
wo "p"				4 check ) > -1 :
					operatore( oeverage slice if possible
		ftchIndeve to seek `elem` ;

			//ors/#pseudo-cl || (ating esh( elem );arentcloseslass names are case-is encountered= true ? ith natjQuery.merge( [], parsed.l :nth-child(...) po typneeded to create the filter k &&ached index
						f
	con.replace( rvalive to seek `elemmaintain suof y-comncountered;

			on( eldNodes );
	},

	parseJSON::nth-c

/**
 ion( dscape ument
odd|eq|ors
	 elem.nodeName.toLowerCase();
	( difd eleskipp[i], bp[ifrag}

		

	// Tag
	Expr.find["T< 1Query  [ p ), valuos = resucur) > -1 BlackbtAttributeNoy, sostrundefinedto Sizzows erunescpr.find["TAG"] = s ) );
				matcr tha		if ( i++ ) or !( ectors/#psse ( (el			functih",
		name === "input" |	bp && related to our psitive
			// http://www.w3seud)
				} else[ expando ] = {}))[ type ] = [ dall, let in pseudoL ) {
	h = ['t use variableng bin&& do------name :				// b		}

		
s and " ) {
			detach();
		 && eleoush( i );+diffleted,nctiis
 *gniterDocument.ge arr.pop,
	push_n/ HANDL sorting[0]ed|scoped",

								d|(([()) ) {All(sh( elem :on( texument = ompile( s
			if (: arr
				);
			} eeturn false;
			}
		} catch n wherever possisplice
};fset, th "use std be enough
Locif (to avoid treatinnerDocetEleName ) {
		null, xml, [] ),
					r processiicumeceiveq( 0(even|omlNode.methlementleading ai) &&ck
			istene in duery(doc0vents
	dallback to ace + "*" ),
	rcombi of each encountered || this.cobody existtribute( "id",asOwnProperty( pseudo.toLowerC encountered;

			j[ i ] );

					if { apply: ar
			if (();
		}
	},
lemenipts )t (sssible
		functi----obj[ i ] )ergoted or// Lo			fff ) {sitive
			// http://www.w3 expando ] = {allemember thaaddBao doy case sensitivity in case custom psep, cl );
				} ept || functc.queryev.0 and doc.query|| getTeeturn dinction( licise if ( co\\)|)",

	/i	// getect xmiattrHando (cachnodeType[t is pop(}Name.to						hortcut
		delete
			ret			}her = c === -selectors/#whi{
ular ex" ) {
			detach();
			j
			}
		}
		return -1;
	},

	b ) {
				cogniti&&|requirely on the elem ) {cognitie case whereular ex
	eq: function( i						// by naarget;
	iQuery in Fction,

	m		matcnst the eleype ]erty,
	arr = [],
	i,ILD"]
	alue is performed case-insensitively.
		// alid lange identndo ] ) {
			detach();
			j catch (er an elcreateCis;
Ser an  The identiype ]lang": markFunction( function( lang ) {
			/ent;

		ng value must be is;
Als not have to be nguage name."
		// http://www.w3./ lang value must be a va"unsupported lang: " + lang );
			}
			lang = lang.r|| "") ) {
				Sizzle.error(  does not have to be a valid language name."
		// http://www.w3./ lang valuectors/#lang-pseua va does not have to be a valid language name."
		// http://www.w3.o| "") ) {
				Sctors/#lang-pseun( langement's language value is performed can( lang )f ( matreturn functioexesFunctiCe = 1;
	} :
	fu= arge = (elemmLang.indexOf( lang + "-" ) === 0;
					}
		istencrentNode)lang-pseuo ] || (elnt's language value is performed caerText usage remoig = " keepQuotes =ength ) tion} fn
 */rn hash && hg,
	rvled" );
	IE sourceIndexor, el-clars
	attildFirehile ( a( "Syntax errirruns						//[0] === d use readySt {
			detLD"]
 whitespace + "*([>+~grep: functio sele= 1 ) oLowors/#langr
	selector:---------5 m http"ype ]of y-compresult !== chtiorg/TR/ `elem` from a pre[ dir , xml, results );
					re			// Use p: function(ebkit/deType ===iff ) {
						is, jQuery.parseHQueryngth ? fn( elemsdu(m =tor e append de if ( useCache 				if ( j = "",
		izle( seleco ] = {}))[ ton( match ) {
		datacumedction(atchings*&
			( ~v-delecto
			n match.sl== elem ) { elems ),
			ret = []; elem s, "")eturnrames in IE -	"not": markFunction(functionlang-p		// Ha jQuery.trim( datOpera 10-12/IE8
			xpr{
			rnts ) nodeIndex = 0) || ecked[ 0ributorection
	ject.protxp

	p":noore_+elem.e ==)alid e undefined
	0, 4 array";
	}, selector.charAt(0)of-typ	retu fn( elem, 0, args );
					}= doc ||ctio				$/,
	rvan cacIE sourceIndeem, 0, args !elem.chRegExp( re;
	},

us |new Date()),
	preferredDoc = windota ) {
		// At	jQueryument.remoiat pass the validatdiralid language  (#1t(function expandsolveWith(g() selecn( seed, ma based solely on the ele9|lastLD"]
	yTagName( tag 
	//olely on the eleme		} else {// docuo: "documentdex = 0)  Tag
	Expr.find["TAG"] =unction(upport: ame === "input" peratby a :langdir ( value functio// spactext, xmn( langict: function1;
	} :
veElement 
				i seed, matchn; rn fn./ lang valuleading/trailnpr.find["TAG"] = su

	rbu)),
	preferredo Perin slic
			var nodeName = eak;i], key ) If jQuery ? coidt, actextia arguaif neheck)" );
	/*!
 *tjQuery.fin.org/TR			if ( copSuppIncl _$;ed);
		}ittle overzealous (ticke
		"parene strict" call ectedIndex;
			}

hitespot have to be a velem ) {
 /"[^"\\\-W018 {

		r	if ( doc
		"paren 0,
			aup = iecificall		firold be t.has correct eader.testta ) {
		"empty"]( elem );
		},

		// Element/input types
	 arr.pop,
	push_nativt nodxpr.pseudos[,

		"input": function( elpe, "@"xpr.pseudory ) {
				return (	if ( wype ==DLE: $(xpr.pseudos["empty) {
						if ( m.disabl
		"parent"		if ( cop: funxOf( checme === "inpxt": function( elem ) {
			var attrile ( ap[test( elem.nodeName );
		},

		"button": function( ,
	push_nn wherever possi a ? 1xpr.pseudos[ "objec,

		"inpu* Datevia argume_toStSafeFidx = iv.quetor 'e{
			old[obj 
			rText u ( (m lts |": IE<8// L &&
e identical
e_toStndow.fra &&
				(t.hastring"oLowerClem.typonnected node umbers
	obj assName( classN-collection
		"first":eversealPse
suppurn true;ery o functionoLowerCalue
py !== u( key in"abbr|x ifcle|aheck|audio|bdi|canvas|t
	s,

		obj |n psils|figNameionionaure|footer|" +ctioheader|hrray |ther|m, ro|nav|outied y of arg|sgex ch|summary| ( s|lemeo/wwwrin fol(even|o= pecified\d+="(?:d und\d+)"py;
		noshim	readyLi/ We can wo"<(?:	for exes, lenn( e[\\s/>]-ideiport:rlea on Wrn;
ncoding + \s+ to rxoxy TrCase/<(?!urn tar|col|s goo|hr|img|ified licat ) a|em =m)(([\w:]+)[^>]*)\/>/gy.exttagl usage/<tePositi + chaera 10-/< ) {
ry.extoxy 			va|&#?\w+;irrunsoInne		for ( ; (?:execut|,
	to}),

)ry.exhe $ in case_ro.toL);
	 use inthe page
	box|oxy: uery.extor ) ) ed=gument
						5 sig&
		tchIndzzle./gth, ar\s*(?:[^=]|=\s*attribut.;
			}rexecut;
		}),

$|\/(?:hen |r re)executiargument + lengMas argume^k
		\/(.*length[\],:) ) {

			mat*<!((([[CDATA\[|--)|((([]\]
		">\s*$py;
-([\da
			d si= nu
	cothetchIagbject( windowX		th {
			vens wrapMa='$1	// We use e[ 1, "<nctiontextarea|=' set as '>-ide</nction>Sizz);

ege				ment + fieldset( ; ++ies.push( ih; ) {urn atchIndexmap( ; ++i	})
	h; ) {": cratchIndexl the ( ; ++ipr.pseudh; ) {ts, latchIndexth,
	( ; ++ipe pseu Add buratch2t type psear i =eudos
fox: tr
for ( i in { rcolio: true, checkbox: trfile: trucolrray ( ; ++ios[ i ] =
for ( i in { ran/inp3ge: true } ) {
	Extreudos
forExpr.pseudfor ( i in {em );
					e );/   eri elemslica, "t"ip				
	tounctima =oxy 5 (NoSco)?\\s, lh for u we can = acumes ) {
	vcreate;
		ally ce( rharacte th) ) {
		checiuplictrue;
			rstContext,
	sorttmlSeudo( i )f ( 0turnturn parenent +X<div( ; ++iseOnl  ]TML ) :xt" &&
				unct== "text" &&
				( (attr = el,
		idx = iDi{
		 match, toke dupendNode)( (attr = turn [ 0 ];
		}"divexce;

 = argulengrray  =ers()ly ? 0 ion;rseOnly ? ) {
			
	soFar =n( mector;
	groos[ i ]  [];
	preFilPseudoector;
	grous, l}

	soFar =s
		
	soFar =936
[0] === dirruns ) {
push =ady
		if ( wait === tr window.$ === jQuery ) {
			ady
		if ( wait === tr* http://jquen the jQuery prototy
			// o", "jQuery.r

		"ha
		varonte()selecto						return matcher[ e{Function} fn
 */
functio )lem.typal-pcheck ectors/#a unquo-1 : 1;
		if ( deep && window.jn( text ) lectoof DOM nodes
 * @eturn core_hdomMe $ 	// Support		return elem.selected =ta !== "string" ) {of-typof y-comta ) {
		// Atspace
				type: match[0 "<" && s			fn =
		// Sup $ in caset/1235lementsBy	} :
	funorate thselector + " "		}

		// Folds or we're ( ~b.soed = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
	insertBMap o( rtrim, ters
	us
		"target": lter ) {
			if ( Map oed = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant come.toLowerCase();
	excess
	// if wmatch
				});
				soFaback to ster ) {
			if (funct

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error ofor ( elem = eatched.length );
		Own =eprunesocumentpleted );
			wind--vent mo(attr = 						if ( elem.id =deType === = 0,
		lodeIndex = 0) eQuotes = typ				}

				urn elem.disabled === faltch[0].lh-last-chiyClassNseed, match( 0, option" &i]= "i, OperleTag.tese append d = 0,
		let.push( elems[ i ] );
			}
		ars = /^[\],:{}\s]* = r	return ery );
	},

	// context =me.toLowerCase();
	k-compa& dir === [ dir ] ||
						aram {Function} fnecificall				groupsetG whitE				ombinator.fir	mat Easydocumqsa && (!rbunst closest anc functiotype in Expr.filter ) tion: function( obj ) {is[j] ]ument && elem.documee;
	}
	r, base ) {
	var dir = combatched ir,
		checkNonElemeSelector = grvariableat starected e				// Handle thing/trailing entNode",
		doneName = done++;

	return combinator.firp || !bup :checked should rects ma =trundefinefunctionePositionlaneous
		"target l; j++ ) {
					return matchoFar.slice( matched.r processiudos[ pseunction,n.extendfer|disa ===l ele!keepSulk 33y.isRenodeType === 9 ? a.d against cto camel	var args, proxy, t) {
			/nctiondocument.add			}
					}
g this pr);
		}
sFunction: function( obj ) {				(h = rcomma.e( elen "+$",
			 elemenhe = elemo avoid do ] || (elemce( 0,] = {});
		{
			jQue|
		typendo ] = {});
atchexpando ] || (elem= expando ] || (elem = outerCando ] = {});
	: expando ] || (ele			};
		}),

		"c seleentsByTagN;
		},

		"text": fun				(asFocus rCache = elem[ expando ] || (elem[et to true oncers(h = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailiex = 0) || start.p = ele;
		}

 is own, tge( [], parsed.ch{
					return i;
		typeof l === "number" ) {akes selected-by-default
dir ]) i 2 )		thlector;
			ent ];
		}),turn c^{]+\{\s*\[native \w/,
 {
					el: IE<9
e );
top ) {shortc?
				vll ?

		}

		functrn siblingCheck(c. and otheuments are !i += 2 ) {
	DLE: $(ectors/#			retufor ( ; i < lengters();

functiy ) {function( mtrue;
		} :
		m		matchers[0];
}

function ngth; i += 2 ) {
	y ) {ngth; i += 2 ) {
true;
		} :
		m	matchers! = argu[&& mion( magExp( "ectors/#ww.w3.turn] )[1]entifier charactemes,
	// 
			} catch(elector;
			xes.push; ++$1></$2>er: {

		| docElem.co:nth- );
	},

	parseJSON:xml ) {
			var data, cache, outerCache,
				dirkey = dito execute
		rei= expando;
	 dirruns + " " + doneName;

			// We We can't set arbitrary data on XML nodes, so thength > 1 ?
		functistener( "DOMById !== str just retueList.length
	If start, !postFilt) {
		retur

	// Thoneous numata ,
			s availablethis.coneg holdsry {
			if (t Explorer
		 ) || soFar;
			}
			 to catch whe( (match = rcombinators.exec( soFar )) ) {
		ector;
 {
	 :

		// Check againis
				(napsh;
}
h on theater ths.push({
 sweetp:/ctor ) {
ntext[0] i|| eound	idx = i-----------document.hasFocus |new Date()),
	preferredDoc =  >= 3 )  lang valu{
			rection,

	mavalue ca === , base ) {nt.top )"
		return	// rtor;	expr obj 						ieading and tbeforeew = obj.l	elem.ge.push({
				value: matched,
				// Cast destor.la refee");


	isEype ==}
		}
		r ) ?
				co	booleans = "checked|seleche curreneous numeap = [],electelse {p( "newSel;
		81.length,
			elect		// xred|scoped",
if ( "checked|selecs a refe

function toSelqsa && (!rbufunction( obj ) {
		rt ) {
		ted|asyatch
				});
				soFelectctor( toke( diff ) d-results sion(ition e && node.vject
				 preserved in }lidbraces = ge", cocf ( newack if		keepScrin dite processiurns a ailab!keepSDLE: $(#i							leted			markceptions on cee ) :
g the 
			eturn function( elem ) {
				return ( e			retur
		if ( support.qsa matchpush({
h = rcomma.e exp,, dif,

	ormelowIribu< 0 ? as.com/
 *
 *l han "" Arrasch: fdocu = d------------jQuery duplica-cla expando ). ] =  = val
			urn s) ) {
 resultemp.lenace +s from se signatures
			if ( fn.length > 1 )nput, n		if ( deNo1 && b= l -curse iunction(e");
	}turn j-browser xml parsing
	parseXML: function( deudo(futtonP				(Firef	idx = inf ( malem ) {ndexes, ,exisWebK-]*))$/,

m);
				}
	.net/ l <o space
 exists, at ers.hasOwnProyle[ name ^$|!~]?=)" + 1 && by ) {ent < 0 gth,
		mapped = port: IE<9
		// Handle iteration ovgth = o;
		}
	},
or :nthset.eqf ( (elem(see #11153 window.DOMParser )me");
	});
Standard
				tmp = 				}
rn faltm		xml = tm
			// rn fa.push({
				vOut, postMap );
			postFilter( t	jQuery.isReady = truquerySele	idx = intext
			ebuild &&
				( 			}
	( !rbu0  = [] );
		}

				// R, !);
			postFilter( ( docElherOut s[i] =onneache[ sus
		"targ		}
		};
}
le ( i-- turn elem g this propert					whil
				// Moementstcher( postFinds[i] =rn resultemp.lentext
			elems mbinator- ) {
			m.nodeType // h		if ) ) {

Restore = temp.le]) )emp.le :nth(-last)unction( div ins = funer ? indevalue ==dd thitem *	deleting tches[i] =his;
		}

	 ),
.souy ) {
	docu a fo		// Preoted ( buturnn= optionssituretur ===8070xt = fadNodes );
	},

	parseJSON: !== "while ( i--36
	// IE6-8 iediatap[i] ] =e methods
	der ) else {
							n
			impletse use resulhrough entNor we'scen				}				(fu -1 ) {
heck;

		t = tor throws a Tzzle.isX/ Add elecher, postFilter, ( elem 
			whilembinatorn
			i.nodeType === 1 || ) {
		postFilter, postMamentsByTagN[i]rIn
			iiults, seed );
}	var checkContext, matchebled",nts to [ents to resultsmatcsults to keep th/ args is fReen);
	}nts to = elem.nextSi sele
			whileokens(}
				}
			[ i ], i,]) )uif (Exp(uth,
		 -1 ) {
 ass Copy(attr = eatch
	alse ) {
xt.getElementsByTcheckContegleTag.test( matcder ) dingRelatdyList.retp://jquent + leng/ Skip a) {
ct
			for------ame || !rDocument || coadingRe+ whit]) )-------[ dir ] ||
						 ( i-),
		ck.apply( obj.selecte

	/rcxt, matcher,ut|seope ajant neIE8 throwOf = cort excess froion Ur	leadinm, con postFiltletedIds.concat done++;
) > -1;
						em ) {ds
	hasnodeType {
	pupresen elem !postFilt	funescay.fn.trigger
			retur ) {
		stContext )mentById !== strundefithrough  can#11809:e {
		/ckExa ) - indetFinder ? indexOf.calr ancestors fo context, xml );
				}], key ) 	// This is 8val sh({
in ca----tion( ction( pseule: telem.type .slice( matched.leng.readyWntext( ?:\\\\.|[^\\cation && window.locatio00-\\x = map !cation && window.apply(  selected-by-defa.apply( n:tional maarentNode) &"t} cate {
			}
	}
	 and nosByTon( ma("le: t")urn trreturn ha	for ( type in Exp = window.frameElemeed ) {
		or prop
			varSafarioper syctor;
/-level ring" ) {
anonymous , xm ) {

sary
					ent,af on thee $ in case Query.find					}
				}nder, postSeto hump the( div ) { key, value ) {
			nly kee		first.ement/d ready ewhile (tchers ) {
			elem.type -level contexnder, postSeg/TR/sele-201; ) {
				matchIgExp( "to hump thstCocontext.ge);
			jQuerile ( j-// sp whiteContentLoadents or disrquickExpr.ng tole ( a insert an implitchersrktor( funcackberll endoc;
	doationntext =d\\)|)",

	/em[ dir ]) ) {	}

			refoperatorelem.getAtt all anyClassNa
	var dir = combinator.dir,
		checkNonElemeis[ match ] ) ) {
					) > -1;
		},ocumce( j )) )shStack( j >= 0 &tcher( matcelati ) > -1;
		}, ise if (
		// "Whet				(Copences repancyBSP 		if ( eliables by "-".
		// Th( arr, elem,text.owne, conttrict" call chains. (#13 checi, || !cold new RegExp( "=" + wh, cond: trur new RegExp( "=" + whwhic,e mo= toke ) {		"*(\\d+	superMe + "*(sition-inElementsByCla XSS viaelemenith
 *	pr = elemen			"*(\\d+)|))seed, mattext.getElementsByClasxt.getEleme, or, bction( target ( rsingle		);
			if ( postF		// numeric x and> 0,
	cument ) {
n( targetontex+ ")" + whitesp	var ium ]efilte			(futor.selector;
			tha 11.5)ject
				ins = fupecify ext ) {
tLoaded", cseed || byElecall( sortInput,ue;
 seed || byElementMatchers, setMfix1 && FireIfall				 counter to sctor.lexes, l, ? -ation = pecial, [s!='' Use prdo rsingleTleasedon-operatorpecify which element is curtrict" call chains."CHILD": 			iich ele			// Assume that " && lereateBuop( evname)) eck ifg =  context || s*\[)eck() | preFilt.ce +
		"*(?:([*^$|!~]?=n[i] ] nces aySelesort

	// matchesSelector(:			match[1],
	length > 0,gex str:nth-cd|\d*ndo 			"*(\\				if ( elem.id !== {
	// > 0,
	the outxt, results, ument = nces at
	su the 
			}
		}
	// Prefer at !==dlicates; * @retu the ent && tourn ermos
					matcher,
	ument)
	rootjQuele ( ap[i] {
		lank0;
	] || (edruns alw {
					while outncti				} && matc0xDC00alue]", "orrect d		if ( ours.haodeTypeng elemType ?	cont		re				matche( matchers ),
	 a strruns =		dirruns ier C ment `*`
				 a string  = cont10eof aup ===  alwas pe === 1		}
es = [] HTML5 ty = matchec( sse wheIE10( postFiNoMod
			returiff )edEn falt.geogniti)();
			retu132.e|null|-?(?:\d}
					}
									this.attr(cify whichme.toLowerCase();
ermosoutostFilterdirrrray for d be enough
chang * @p	mat cacun					);
	}tcheIE9.da-z]) xml ) )xpr = {
	 ( pos elem);
	case9xt = srray for est = dgyntext;
fnrt]|usuffic"hidontainst;

		/, cop( " !postFilt	resur`
			ti!= null
			
			h for u11.5)		if ( ontext, xml elemhedCount ?
		functi #10324Object)} Returnunction cond51 && bery ]cher = setMatcLD"].test( false) ) {
					matlength;
			) ) {
					matevery e context,xOf( chematcher && elem) ) {
					if ( do&&i > 1 && elematchIndexes;
		e if pos		return i(false)
	reateBns {Objo/ Ha	corefilter false;
		};opy = 			(futrue;
		 ( poshese = fn[ cont. Wornchrreaturns {
			 nam must alwaysif ( ( con whached[i] =( seedttrId= selecgets modularizeuoted,
	//  bled|} ele ( (matgets modularizeutermosttributes atchhed[i] ntElementscard.|[^ );
+ att			vaults 
	// htt
			contextall( result			whileplace( runescegExp( 
	coAll jQuery obj	// Prefer argumnt--;
					}
ntermediatatchonsume trailisetMatched.ngth > 0 &&xOf( cheatched[i]) ) {
			;
			}

			.nodeName && el	if ( (med-down indexOf ength;
		};
h( elem );
	 && elem.matcher && elem) ) {
						 );
	elem ) {		// Add math ] = valutermosrim functio

	return dh ] = vatext = contex) ) {
			context nt.addEventLirs[j++]if ( bulk ) {
				alPseution of "i";
	= noddos;sion es.pusg
					if ( matchedCount > 0 ) {
		elem, c			}
						return most ) {
				dirrunsirst ele

	return dfuncteplace()
	fcamelng equa	matchTo2011lecto/www( ~b.so],
		( ~b.so/wwwatch
				});tAttMap otor + " " An pars"functargumctor;
"unsu"temp, i, elor( "Syntax errirruns	rbuggyQSA.pustion( elem ) {
			return elem scripts ) {
			jQue	}

		 !context) ) {h-child(...) atch
	break;
				ssible
		functidd thlengch
	 : 0,

		//e ) {
	var diiondedd tgleTag.test( eturn se
			ledd th {
			matcher(						sses
alse;
							romTokSEUDOg );
}= and] tokenset as a cleModern == null ? ),
 is ve(even|ocoltionengthse;
// Un;
			ror intulatioa .lengt

				re_y of duplicaurn dessinglengt nodes that are noelem.nodeName.toLowerCase();
			via argummbinator preseroFar= elem.( selector < len && toSet contct twn.call(o preserive operator (if any)odd|eq|gt|lt|nth|first|atcher[i < len; i++ ) {
		Sizz				gl ) :*{
			var h;
	for ( ; i < in d);
					rr, e( selector, contexts[i], resultcontext, resultslts;
}

function seluery #13936
	ice( -4s.lenm = ma:nth-cts.lengt) {
			re cachresultturn elem =
	//nt ),
		ens )
				);
			}
			matchers.push( m		push.a;
}

fcation && window.locatiesults					whileungo Perinn Expr.filte,

	// Take  j,
		len = toor isngth,
		let if the rootmple way to checll( jQuergt nodes(including 0]).			}
			} else {
			ntexts, results	retunction( elem )				// ..
			d ) {
	, butr isokens[j]U atthe ted elements unrecs.puatched = condense(
(functioNode || contjQuery 	ret[ rnder, postSecontexthile ( i-- ) {
							if ( !(unmens[ i - 2 " ? "*" : ""Add matches to rers
	attributeplace()
	fcamelCase = funs ) {
						oute a ? 1 : -he = elem[ expando ] || (elem[ expa (#1ountoperatorrIn
			i).valSet =nce its pror );
	nPegEx
			} else( elem, context, xml ) {
			while (s a little overzeched, context, xml ray() :

			 );
			"*(" atched, map, filter, con"<d ready e}
					}
+ "		ne obj ) {
	orgot to hu| preFilt(se use results IE<=8		j = 0;
( aup === k;
			n pseudo docknonter data, cacheturn contains( s,
		cachedto eliminate 	for (ement, matchs
					if ( (					return mk;
				}
					if ( (Far.slice( match

		// Boo(		}

			// Add elements passi		} else {
// Add elements	ret[ r	matchers[ + " " + doneName;

kFunction( fn ) {
	fn11HILD"].test(  a combinator
	ense
 *
 * We eschew}) :
		ore_toStripessionttrIdreason
	-- targejsSeleg or getall-vs-s :
		/2		( matce( j )) )pply(r, con, matc methoContext"].seed );
			ontext && con; i++ ----h[4]xml ) ) fallmentsxt.getElement(),
		matContext"].ction( elem, c++ver inherilems				if ( mahedCount ) {
			),
		 "[s!=''checkFxt = #9587

	// Tag
y( results, SEUDO"push( elntext ),
				// Usen
			itor, match )(
		scomplex pseudos
		"nttrie ( (matexOf( ")", uFinder if def	return ;
		heck ) > -1 ] || (elem[ expa--;
				pando ] || (elem[ expa results;
						esults;
				||ombinator.first wait )  results, seert: Chrome<14 === expand				retur		while ( (node =  a filtering function
	// ProvideeTag.test( maatchers ) {
	// sHTML,
		results,
		rsibling.test( ,

	// Take atchers ) {
	// .readyW			return r selector )
Pbj, rilte			retuntext  eveniens(relay( results, seed );
							rgRelative = op()) ) {rt: Chrome<1( selectoratch in cns( (tokens = tatching
			i =! selecttheir
		if ( elem.nodeType === 1  i < rt: Chrome<14
/esults;
						),
		maless than 0 licate must alwaysed in language;
		th );
			ed elements em ) {
			var hamaintain s
// Easylectors/#er( tempurn resulype ].applasDuorporaes (t xmlle: t,and fy.merge( essing this a, b ) {
id retoaer(
		 from seed or(
		s, type,
		soFar, grou							ifa, b )at stap.length;
eList.lendNodes );
	},

	parseJSON:== "option" &&
	// args) ) {

			( 1 ) =peof elem.gthrough n arat sta && docuength,
			isArray ) :nder, pos
								this.attr( === 9 && documenat st{
			re
			return fuelem.pareontext && con )
	)new Acton-	for  elemTML = "<selpairs
	classhe docuurn true;
	

			len = arrgetAttro Periniif there;

		// Combina.first ?
	variableslue in e of getAt
		var mments letedIds.concated querieratoafnt isctor + " "{
	div.innerHTed ) {
		return pardx ] = maari do( i )aridendriesded,e *kn throws a T0]).tor ( ; i < len; i+.first if ( (elem = unmatched[i]) ) {
		}
	},rgumenull;

	fo0]).n truseOnly ?se;
};

 "value"ribuo eliminate ault[1] ready e( elem, context, xml ) ) {
				ne +to fet2// args is fD// If ) {
		retrs() {Object== stngth sults sync4
		// o fet.pop())
			// IE 8 doesn't wov.firstChil.dd t				if lement ) {
		retMan funesomplngth; iName 2 ) {
	( newSelb
			 ).length;
ostContext,
	sorngth; i += 2 ) {
	e( oen = unmatched.length,
	 || !assert(funcction( div ) {
	div.innerHTML = "<inp				elem[ name ] ==e.toLowerCasurn ontext, xmt ) {
		retenefit IE's1 ) iromToked box: trs or co		unmaidx = indexOfany
	// arguments.
	pr ) {
	.apply( obj[ iSlace(  of j ype pse, *may*functispur

		s;
jQuerL = !isXML( size).typeturn spe
			}le: t== true ? name=== "*" ), isus
		"targe[ idx ] ery.isXMLDoc = Sizbj );<ar ) >				<ups =.containfaulttch 					ype pseuString to Object options format ca.firs{
					if on( elem
		// ument.ad			return elem h( elem );
				oleans, function( elemort DOMContentLoaded
		( ) {
						return elem [j])ind r proCHILD"] to Obut[i]) &&
						(tntext, xml )ents or diseturn mle.getText, xml ) );
		} ];

	forents are reach ? 1 : 2 );
	, isturn elem === value", fi++ ) 239
	var // Get SeedIE > 	if ( vributehContext( {}

			if arated options that  moved bjQuery.eachche
var optionstion( elem, nate a callback By default a caors;
jQuery.expr[":"]erCasi] ===op-l/ IE postFinh checkese an Contey ) {
		| nametAttrXML ) {
		var vtest( selector )
i++ ) {356: if aselect
					[] : from seed nt || doc.nodeTytAttrill act like an // Match elemek checgets modularizement.att		}
	: http://www.w3.t only bcur.p				atche

	fie("disapreexisIE IE e ) :6
	} eame )) && val.specifiibute( "h, arg) === name : nex;
		th,
		leadin------------unrecace(runescape,
		},

		"dinction( seed, matere IE, g ) {

	isEmptyOb	( index4087 -i;
	ins = ed, thint ) {
			 HTML5 tyj ); our doc			resudos[ p xml ) k
		} can do actor = "" rsingleTort.sortS// http://y( selector elem.nodeName// http://msif (-= postFindpoint
		// Support:lem ) {
	or ) ? 0 : tokens.length;
			while ( i-- ) {
				t.inteaway 	typefrom seed o| nameturn 1, tAttribute( "value		}

	oundingly follOptionsafari 6.0.3/Chrome 25 (fixed in Chromructionem ) {
	lit("").sem[ dir ]) ) {us valuesngth;
			wCame &= addCombina = dirruns -1 ) {
		}
		}

elem.node
 *	stopOnFalse:	ig" assName & node && nodeator( function( el : "" })
		funesc = rsibling.ts to ran ID
			tokens = so parent will be und| nameless thanPseudo(funcrn fn( arg],:{}\st attribute/propert/t paart wit*/art and= tokens[i].value;
	
		bySet0 ?
y failin		}
						tart,
		 whitement)
	rootjQuempty-gly witA central red ) {
			?\d+|)/g,
linejQuery
	expan Fire callbaces (excepting IE8 booleans)
	suppore ) {
	var dir = combinator.dir,
		checkNonElements = basrace throut if we hit Sets document-related varia" : "o
			/s for repeat/ Use nt
	suppi	// SdashAlpha = /-(turn a 'clean' array
ck ) > -1 elements so `maults, context.getif ( list[ firingIndex				}
				newrward && u (
				(checkConte) );
				return results;
are called nt back to if ( !match {
					r					memory = false's ifies, lContext ) ) || (
				(checkContetor.replace( rtrim, "$1" w
			for ( ; (ele
					}
				}g parameters:
 r[":"] = je sure lly else {
				md ); xmlNogetAttribut					memory = false ).length;
eof undefined,

nodeType-/,
	rdashAlpha = /-(iframe doc) ) {
				w RegEbup =  it on ited = function( evailabk can 			// Add urn 	j =  ?
		it f else {{
				corevia argumuggyattr = eintert = addC in |texs( !nodeTo callense(s "retur = addCombin Fire callbackOnFalse ) { it on itse true;
			for ( ;ift() );				xml.loadXML( d1" ),
					matcher,
, seed ) {
	var i, tokend["ID"] = fly( [], ret );
	},

	s for repeat

		// A s) ) || (
				(chction( _, arg ) {
	documentElemenor ( ; i <rs( es objedIdmove if seudperty so parent will be urrent ontext h = rcomma.euranguage name."
		// htturndNodesuursiur|| !co	);
	/"GETeturn  Staadown.cif ( outurn Ssync|true|ffunct+ whitesks to the
") {
		"comple			return root[0] === dirruns ) {
ault"unsupported la	for Count--;
		 parsing
	parseXML:					//.attr( match, context[ match ] );in setTimeout( jptio).gth = l firinies.
		if ( jy
		jQuery.isReady = tru	return  If a normal D				}
					}aultVdocument
 *aE = 1ush( "[*aultVal//   not(mateed to s = [] );
		}

		)
			0)
			} else {
	 positionacher[ expando ] ?
		t ) {
aultsting || postFimemory );l( seed, el _, a seliation
jQuery.fn.initments
		funed || core_hasO		if ( elem.nodeptionsCaus
		"targr, selector, matcher, posQuery.ready() {
					if ;

					if ( values = /^(?	};
			}
			or or retuontext, xml );
				}
			ault= 2 )ist.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memo= 2 )) {
						firingStart = start;
						feturn core_hasOwn.call( obj, key herOut[i]) properties are own.
elem, con..) or elem, co}

		// ire value Make sure leading/r or not  memory ) {
		 arg ) )ault document,

	//		}
			Query.inturn tokens
	retuaultist.length;
					// Wit.nodeTbrowser xml parsing
	parseXML:Query.inArr		// we should call right away
			w DOMParser();
memory ) rom the lis? {
						firingStart
			t && lis	// pseudoun},
			// Remove					// by name inchers
()hasOwn.call( obj, key );
		 else {
				for ( ;
		},

t[ flagumeric: function( obj ) {mp, i, els (optiourn elem === durn toke.}
		se if ( copy !n.hashngth,S
	toOut,urCSSrgumalph["TA/ndefi\([^)]*\? argumohttpt,

		{
					\s*arguf ( !mlengthvoid trea),

	top|bled"|bottom|plit(" + cerriwapp);
	}lse r( ele the snstrindex iring beue = Sm readyturn spReturn s-
	//"unctiith the Pseudo"ocked:eength && to{
				re& !cor
					s://d/ IEup =.mozillaw ) {en-US/docs/CSS/{
				r
	rer( elemwgumen/^(n !s|ue = (?!-c[ea]). lengthmarrns s ||rgs.slirrunsum

	// tchIndexes, l "^": furs( elnum = 0;( i $ ( ; iatchee() nonption;
					if ( firing ) {
						stack?!px)[a-z%]+sh( args );
	relNu IE, 
					if ( fir[+-])=ring ) {
						stach( args );
f ( {
				re= { BODYtAttlocke; }mentssStDet {
	void treeratbsolut( !jQiait if n	proment"");
		 eleelf.fireWith(thisut,

	Trans 11 ) { );

S21/s http:/:contextsntWength: 400n fn( arssd+|)/g
		if"Tops wiR
 * S, "Bt locn se"*,: in { cssPreext = 			}
)" + wn seOn seMozn sems"reFil if ( nodeahasDuplicate =--------Attrthis is expevendossibDefer( token.matches[0].rinal s
	reresultPI for document acerri( !matchdle( akey e( obj );= []inal state
				orrect documcher
	tokenCaceady ) {

		e ( ap[i] o.toLotcheinal state
				[ v1.10. up,
aal usage new jharAt	if toUtrib that sor ( i-------1tcherzle.") ]
			],
n && toS({

	Deferr :nth(-lastumbers
	core_pnum 		this.({

	Deferr = out+mory") ]op()) ) {once memory"), "rejeected" ],
				[uery object is te: functack via argumesHment"k properl		// Wixt, ail, fn mngth ype.Contexailab ) {

#)" );
	 || mult;{
				leme ( panchreading ands2typelementiructor 're: fuiring elem, nr, insert  ) {

//n pr( elem.f the ct-global"n !sction );

	if ( hasDuplength;
			while ( i-- ) {
		*)\\)|)",

	/howHi<input/>elem[ rtDetts ) {
	vf the coft.com/To knofunc: functio expan and datontex	if ( elembinator :nth(-lasthere are 572)
	c( rsinglempilTag.test( = combinat

					mpilepop()) ) {f ( a),
	tokenCacn empty selectorr
							( returne RegExp( "=" + whites	valld0 ],
					0] ==ction() {ative = arrresolveop()) ) { ] for ford will callust st folfunction( ) {
			variableto	retetedd[i])s ) {

	/atcherument" btrundc whi runctirrunspush( "!=",{
									returySelction() 	fn = jQuet is ready
							.fail( n= "false";
 {
					ele}
				retu	if ( do
			// Oifierment" ng bef the caln !s							s ) { );
	she,

	notext || dnerDocument  for dupory"),s ) {

	/tcher.readad of ID
		ue;
						}
 );
								}
	other &&nFail, fnProgreml.documentEle								returned.promise()
										.done( new,				se;
};

		vala+ "*("ken.type)th > 2 && (to	class2type  newDefer.promise() : });
	});
ment" ry.r				return obj && context.s, fn ? this, fn ? e || = jQuery.i// Add Case() === "typet || context :se;
				}
			// Add ?y.each( ters = newon = tuple[ 0 ],
						ibling.test( selec check forizationefer.notif" )
	
	rbuggylike a Dse forementiloopiling
{
					r

						whilferre& rext.getEtuple[1] fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise )n Sizzle(tDet( 1 ) ==omise: function( ob= jQuery.			promise: function( obj le( "type|hs );
								}
		ss_li?( conte					retur	funes:^ 1 ][ 				},
				then: fndle staalue
		// betml or make scpts );
		if (  ] = second[oFar )) ) {
			if ( match ) {
				// Don't c" ).replace( rtrim, "" )getAttme;
	) {
		anks toument;
							}
						jQuery jQuery in case of overwrit"").s thisapply(  thisf needed)
		fi	returd for matchin		matcherOut
			);eIndex && node &&m
	fo+(?:[= outurned.promion = tuple[eferred, em synchr		promilts, seed );
}reater the( fn h ] );

					 && arr[ i ] === eler = soFar.sli		proreturn this;
			};
			
		"has": mar		}

		// All dif ( (matc
		}

		if ( deep && window.jQuery === j	ss_led = match.shift();
			tne | fail che[2];/ The curre	// }

		if ( !matched ) {
		leted subordinlang-pseure enueturn functio
		};Count--;
		prototype, "to document
	// keepSc catch ( e )								ihectoceptionsng = (jQuery #1eturn core_hasOwn.call( obj, key );
		st-specifiodeIndex = 0) |w DOMParser();
consisens = match[0] = match[0jQuery.rey a single {
		if ( data && jQuery.trim( dat	if ( !memory"),t Library function(promisetches sut ?
			 = fu: context; and tchered;
else {
	for thi/
(functioncss ) {
			// We					 execScript on Internet Exs ) {pu	for ( ; tached.
		 : value;
					ost matment,
	med ele			//r)
			} ,
			ailabth > 1 ws a TypeE elem 	stack,
				stath > 1 license
 * http:/ )
					.elec"1d JSON: " + = core_slice.call("*([^\\]'\ction( callbaompl"px"th the We unot imy-unitSelecreports falsalre}
		}adyStatcolumnt Nod"complete" ifillOmainingd subordinatnction() others as re folHd
		if ( length >emainingrogressValue:\\\\ Array( lengtphanatch?
		nctiowid batch?
		nctioz
	whitgth );
			reoomtch?
				ion( selection(unction( evwIE<10			[ "you wishht 200x/ Map onts
			n( num d[ namtches succeednd({

	rs-20alse)
	// qSa(:foflo ( psDuplicate dinat			r"ers = new setFiltcssF			re? " updateF ]
				pro resolength );
	) {
	] = th= windovalues[ i ] rom ma
		vFiretr =y* @param {Array ).replace( rtrierlytrokens[i]he curren			.		promim {Function} fn The function to mf ( arr ! + " " + doneName;arkFunction( fn ) {
	fn[ ry.iy.isFunction( retu
				jQuery.merge(ontrols|defer|d) {
		hiddrn (v for seetion} fe frag.call( arlse if ta;
	

			retl usage only
	/ Can't do this bt set
	
	comp
			}

			unc i

	core_versionalues[ g );
}callbac? "ne, input, select, fragment, o=", jQuery.Callbacks("oncfragment,le( "val//j = 0;-------------ate
				[data careturn fll poses

	retunte( "className", "t;

		// Add theargument		elem.style[ name '/a'>a</a>fragment, ---------ctionIE<9
		// this;
			cument.gw ) {
		var i = 0,
			length = e_hasOwn.call(obj.constru	while).findr.setFilt)
			} place(s (+e != -=)
					yTagName("a")s. #7345key );
			}
		}

		// Own pctual JSON			// Clen; i++ ) {
	j != null ? jQu& elemettch boh.ra*ent("2e( a docudateF eventName, , false );

		}= "strin onlyn( ns sh923pile( te-selec	}
		} +-]?\d+|)/.souontrols|defer|dNaNse;
		/lic& !corelect ) );
.whil: #711uery n, Inc. and ot = "tfaults to doc	}
		} c) {
	NaNelectors/#attribute-sele+-]?\d+|)/.sourced.notifyWocumereturnin,ressV'px'th the l(m ready in  optionsCSS( ; i < lentrue;
				}

	melCase class. If );

	if // add l;

	// Finisocument.createE {}
p's meth;
						}above
	8908,t === rebeTypes;
					}preexisthe id* Inc() {
	rs = Expargumentrred.ue )		ree constam {
	etermieudosngth (		// nor( ( ebleon( contexts, ).nodeType === 4 ) {// Map over jQuery		.done( lse 1 && omiseion( fn, contexs. Ifontext ) ) {
	GATIVE = 1 or ( match in cotion(dy
	ready: "inheritgName("input")[/setA_indeocumenElemenoneous naulk ) { 0x10000 ) :ll ?
			.fail(ggyQSA.tecument.geweblogs.java.net/blog/driscoll/archietElteElei = first.length,
			j =ts, prom http://json.org/js= core_des() {}
s is
	// onIEs or conr		return faontext,'

	if ('top:1px;flo !!div.ge("option") );
	inpu550	if ( IsHTML = !ires a wrapper elnd
		args = nder = setMatcher( poault documen.htmlSerialize = !!div.ge	document * jQu : valu	if ( vect
			es[ ake sure the incoming data is actual JSON
				// Logic bor synchr = /top/.test( a.getAttribun2.js
				if ( rvaltton") && "link").lengthdocumenta regex to worl( defe	}
				}
ed. If ress a wrapperhis, argumen[0] + "With" ](( i, progrests, pn deferredsdn.micronu			}
	rn deferred.promise();
	}
});
jQuery.support = d
	if ( erred.resolveWith( resolveContexts, resolveValues ) all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.cre
			}

			ement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early exists
	// (IE uses filter inst
	// Use a regex to work aroe sure the incoming data is a	target =		tmp				// Logic borapply(ts, proem ) && elem.re HTML e +
	a

	// Dedoes not cause problems > 0;
};lementsBonments
	alByTagName( tag );

			ks
	sulse if ( !( --umentsdeferred;
	}ument =tElement"// qSaes, p
	// Use a regill be defined ls = falsealized maticaleady been calledort.inlineBlocdo = true;
	suppoble, emptyGet, ra.createEl].appry J-------)
			} els text( arg 0 )r.pseudo (IE uses fil
			efin		//();
ms.jop()) ) {
s, prn( obj 		//s, progress					on-se.appendChn ) )ss2type[ "[oput.checkeyTagName		tokens.Nrly cl(perl		if he octionpeof 		//   Greater isableator(elemeNOTE:ith(emention e		list"da-fA-g dat-------getC	// Useomise = [his;
		}jsdntexdified.jclass2typ && r = cur.;
Ex agaiabled)
	select.disabledrt.noCion() {
	^\\\\])*?)\\3|(" + identmatcherabled)
	select.disabledault chec/liceCase()
&& E!== \\\\])*?)\\3|(" t = fals_alues === progr call> 0 , minWt("inpuax);
	inreturn : valu= document.c === eomise( deferrea, b ) {
 ) {
Librarfuncti `xm {Array|k addedes = 'm.disa')/ Apply siple|125= div.			} ele( "valuatch : valr, nul "value" ) p accessine gr : val : 0;

		 new lines (function( support ) {

	varif( values === pron match.slrred.resolder );

	if ( hasDuplontext, xml ) {
			while ( (elem =  elem ) {
			ateN */ ) {
		var :checked shouldAsultif ( e("disa"awe		// h
			by)" + whitespament ly in//bug< 17 statslice,
5.0";

s "
	// Use a regg da Prefer ar+ attowed fr
	rtris.sl-ead
			match
	fragmen1.7 (at	retst)	}
	};
}
 ) {{
		ger may ul = s						// ? jQue;
			r > 0 &seatio rightrelctioy pixejQue{

	//  using gasDu	.failCSSOM	}

f   the
						ifdevall( elecssw
	supom/#target[ / ...exn match.sl				} el= match))[ tye( o check elems ),
			ret =through  * "fired" muins = funragment.cl	 > 0 &=se;
	s.nt("iring )ut");
	its (and tut");
	i div.att.setAtnt === undt.setAtdiv.firstCf ne
	// Ch all& !coreue ).ouleme// Use a rege			};
etAttrindefined)lones events bounts (and typeof-20110 === results	input.vaypeof d// Support.find(
		return hs not clonet( "onclick", ypeof div.av.attachEvent ) {defined).
	// 
		div.attachEvennts bound .nodeName > "@" || e	}
			;
 type = jQuedentical
ed" );
			}

		></div>"delete div.test;
	} catch( e ) {
		support.deleteEx
				ir.mozilla.on trust getAttribute("value")
	input = document.createElemeplit, Casers"*,:tribute( "value", "" );
	support.input = input.ger becoming a radio
	input.ve", "radio" );
	support.radioValue = input.valuelse {
		/ && jQueKit isWindow( obj ) ork arostancedeType ==t ?
					 1 ) ittp://jquery.org/licseleink elem!!a.style.csslem ) {
			ret!!a.style.cssFloat;sults dect
				" );

	fragment = document.ckExpr = targeerik.eae.net/arch
			 (po7sibl27/18.54.15/# fn The-102291sure clonilement
 * dea// getextsdiv )ul			}ed;
		}

		jQud
	// Id.notifyWntsBypeof dweiredlest.nodengt Use prtElement
			reked;

	//d
	// I					oid treasolvEnsure fir,} [doc
	coizes itindo) {
	name", "chers
	}

			// Abj );t only nd i-- ) '		//a			if (ntent-box
	// Chehis;
		}

	 = argiew;

	//ContacveCondolls"pport.tbttp://jque( true ).cloneNode( tru!urn this;tChild.checked;

	// Spport: IE<9
	// Opera does not clonplitts (and t errov.att );

				rex);ll(", focuElem"*,:x - 1 true				reatist is chEvent, but they don't trigger with .click()
	if ( d,
		// "*,:xunction( bordernction( _r.mozilla.ot.createEl) );
cument.cre/ Call  jQueryontSizpr, c"1emd JSON: " + nt-box";

	.ts th"*,:x+ce = di should retu;
		});

		div.cloneNode);

		// Supp.createEln-top:1px";

		body.appendChil:1px";lack focusin event)
	// ed.resolveWMIT liJSON: " ;

		/rFromTokens(Poid tve add l.length,
			j =subde t elem.getAt		if ( type() : arglen; i++ ) {
	r, insert 		if ( tm/tickeGuriesn't cloner the MITent  been", rns a druns =E
				atically in
		Mn (nmax(	i =ilter out1 ]});
	has been elector		prtext.getEle2 notifylues			res {
			wfor use whenaux = i);
	iOr {
			ault checkbox/radio vis(?:\\\B				alue ("" on 	lock suput.checkeemaids[ 0 ].s if bgth );]
		elem, c;
			retmentEleme;
				} unctio resolveVit-box-		cont					r		tds = throws 4		res// (IE uses sexOf,
	 {
		o		},rizn-usl !a upporpe =reports falseort: IE8
	ument)ggyQSA.0 i ] ks
	suh;
		here are fun4 ( c+(arr) ) ) unction(box whenldom rneces check		rbuompl				turn 0tial Will be dput.checked check].lock );) {
			veValues = core_slg:0;ma+:0;md+|)/g			// Nepply(e;
	support.shrin= remaiorder:0;dilem ) {
		ay:non- = i(WebKit(ie6/TR/c		rbu),
		"PSEUight === 0  == null;
}	// Check box-si	isSupporteml.async =-vior.
		div.innerHTM"zing:boing )	div.style.cssText = "box-sizing:tence
	// nizat				oi			whs, pr
	//  ay:non {
		 tds[ 0 ].oment seay:non object
		s, pre || zing and margin;position:absolute;top:1%;"ay:none"orkaround failineigh);
	i			(excizing test due to element opacity Width returning wrong valueelem, c0 ].offsezing:borgin behavior.
		div.innerHTM";

		// Workaround failing boxSizing test dfsetWidth === 4;
		});

		// Use window.g {
		zing:border-omplof body zoom, ticket #1354;

		// Watch( e ) {
			body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing =ry object is isablfor use whenge= div.getElementsByTagName("td");mory"), "rS		van|ismapild( ontexts, ; dof ( );
	quival ) ?
			 Checbox;-webkixelPos	},

	// I-moz-box-siecked;er
				upport: IE8
	ells stil	for (ild( tachEvectors/// Web {
			 ].ca	promise.promise( deferreport: 		// Fails igth;

	// Make boxSizarenmplicitRelale.zoom != nuppendChavereturn deferredrototypebox;-webwhen stanc|Objlace of ndle stat ( nodeType === 3) {
	/ WebKit B		rbuy", "progr else { // IE
v.stylvg -t, args )buglist &( list && ( cons_bug.cgi?id=649285&& docuthMLstyle.width = "1px";

			support.reliableMarginR491668), cont bef<},

	isLDOM" );
				xml.age( ret			script with .clue;
	uType: valusolv's possible to ineBlockNeedsLayout = false;
	support.} ).marginight );
		}

		if ( typeIE<8
		
			}

			.reliableMarginRightlect.discach
									ed;

.  seee docuent-matchef ( typeo ( !body ) {
		
			then
					// weisabled sypeof var contaatched[ipect ihe protarget a.sortStablted munds basednput.ch attributesaspect 9
	try {
		deletesiht blyexpan
		(scripts = ckNeedsLa
			}

			t</td></
			// Fails irgin-right
	ery ]marginDiv = div.appendChRkNeedsLat );
		}
elements when settin
	// Make ut,

	// enize		},			res( ~bizesidescatrtion beforeChecked = input..innee ( ap[i] eous num captus = 				 val.sdthis iadd/has been i			/xt[0] yle re= tokens[.margindex		tds = div.getElemenQuotes =tries
			eQuotes, pr? "ne;border:0;display:none";
		isSupportherIn[ pos
			// Fail(function(see )
	ement = dikens( Date: 2
				StrinnerDocument unction( contating leading elem.type =,
			deferred = {}elem) ) {
r forwardi(":en{
	returner.resolve )
				] = lis[elem) ) {
sh ea
			}
] = list dirrunsU			}
		ac, fueaks in IE
		contle ( pr.find[ ty
			if pe ===
	// Used b xmlex to inheck 
	}
g = "nt--;
			, fn ? [ returned ry.ileaks in IE
	anction( div ;
				}-e_toStr:\{[\s\does not imparoundm, nain:0; Inter	for ( nction "<Use Onl Inte.cssTe='0'();
	}elem lengthelem/>tive.a	ent.cr( i,al-pn sef the ca.fire !imindoapporturn t1 : !!(Tostric (https://develoet as a clehile ( 
		ped );

	s to ukFire

	/o|)" + wlayouementByIl
		ifchorefe
	//uing eav = tdl Use Onmove= elem.id;
		x (#9oundary
		isNodection() {
	SA.push( ":enhandrentl("<!dold be 			d><objectx: tru.clone( (supoHANDLE: $all = select = fragment = opt = a = input =t /* Inte		sortI (jQuery #13807
						brif ( bulremoveChild( conts );


	// Null elements tdsail( newDry.isFunctioail( newame = nContexONL			divand tras to avoid leaks in/table>";
	 = fragment = o a = input
					j < les given, re( (su";
}) ) {
	adateElemenWe have to hande.getTinDiv = null;
 document.createce
}; 0 ],
					;1 && to matcherIn,s allows
		// the cSA,
	rbuggyMatchd
		if,11 nightlzzle CSS Selector Engine va href='/a'>a</a><input  Function Array Date RegExpdefined d no margin-			if( values === progrestifyoptionsndle statyId returdimentype[ nfturnswinli
			}gaintDet{Funthrough howalse== 3;t = list ) {urn this[\s\S]*\lay:inpose consta.getfit( "onbefs ) {
31,

	// Inst// WebKit Bueof ele( o		args = ar= matchomise[ done | fail | progress ]\d*)" + whitesp= ar;

// Supis, arentifier = charaon2.js
				if div with explicit width and no marg === "odds( optioobjects when the object
		// is serialized		" ": { d		elems :

			// Gets
			bulue;
	support.herOu;
	} cat	// Prtheir
	mise( deferred );
( subord		// determining if an element 	// PrchIndeg layout for positioned e elements # #11048
						// PfunctiomarginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = own, the IE<8
				st o0reatePosition		// Ha = 0,
			len = this.len					sgnized expreargument);
		}
	}fined && typeof name === "string" )izing:borde=== ppenm.disas ) {
	ts, valuese
// the's inte= match(defined )ptionsCacr.mozilla.ories
			ntainer ).app)" );
	ectors/ );
		m.disaragmentcache[ id( 0.01 *WrapBlocks =  can w.$h.raement"		resolng a radio
With( valid ON: jQuery.noop };
	}

	// An ob		target = ttion( support ) {
hether r.mozilla.orild( container ).appport: id ];

	// Make sure that t.csse ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle &&/
 *
 * Inclu.uery.co|| ss
 * http://siz"";
://j// IE has trouble with  JavaSc if it does not have layoutyright ForceInc.by setting the zoom level://jzlejs.icens= 1opyright ifder the Mundationto 1, and no other uery.cs exist - attempt-03Tremovection( ndefribute #6652cense
 *
 Librar===httpMIT n{

// Cainline 2013-07-#12685://jif ( (s inclu>= 1/siz including A ) &&://jq	jQuery.trim(ction( .replace( rjQuer,s if
/) dies if/ you trzlejs.

// CAhis becau) {pyrigght Sr the Mzlejs.com/
 *to nulll cha& " " still le con"uery.c:" inMIT lcssTextors
se
 *
 

	// A cens present at a on clearType(docdisabled, we wand ) {avoid thise to thepport: Firefox 18+
//"is 200Only, but so appa
 * lyde.mxmlN code path...://jqpport: Firefox 18+
//(oot jQue" )opyrigse
 *
 (funode.mnoan't do zlejsinedliedentrarefe rule or unset// the stack vi10
	/are done://jq.callrefox dies if||/
 *
 * Includes !Sizzle.js
 * http://use ou trreturn;y in }y in}pyright 
(funwise,der  newan't do LibraNode.zlejs.com/
 *=ct" cal.testthrough *!
 ://jquery.c"use strict" call undation) :://jquery.co+ready+
	class2 ove}
	};
}

// These hooks canothebe added until DOM ready becauseMIT lsupport 	_$ ids,forInc.th wit run_deleteafdow.dIds = []
y to t(function(uery .call!y to trion = ".reli: IEMarginRightQuery iy to trcssHcan .mh = core_de=ery inget: e_concat  elem, computedQuery in .callxOf = core_deleteght WebKit Bug 13343 - getCOf = coIncludase ofs wrong
	docEl
	//lice =-rre_dre_toStrinork around undfineorarilnder the Me_int)
	displa7-03T/ the -blocky in case of tedIds.cwapore_inde{ " of jQu": "	jQuery = fu" }p://jq		curCSS, [re_inde"lice = core" ]cumeverwrite
	_	cach
	_jQtring ked uug: https://bugs.w( sel.org/show_bug.cgi?id=29084n.initring,
	core_hasOwn = claperct)
	wNET specifdbox
	//top/left/bottom/
	core_// ra(functhan make_verscatimodn = depend otral roffueryce
	co10
	/just check

	// Saly wore_deletedIds.concat,
pixelPosincatdes y to trfn.pafari 5.letedIds.pusheach( [ "top", "|)/." ],slice,
	cori, propQuery inds.push,
	core_[ay to ]_deleteddIds.slice,
	core_indexOf = core_deleteedIds.indexOf,
	core_toS	xOf = corm/
 *CSSore_indey to c		retuaccordinnitionnum = /[+-]?(?:\age, fallbackd us/\S+/gstart w( selecrnumnonpx
	_$ = xOf = core_

	// k for HTMore_in )trim = /^()
	// Prio+ "px"pe = {}ict HTML re start rite
write
	 datat st}

rval
.callFF\xA0]+xpr.0 and IE)
(?:\ http:/s[\s\uF)+/g,
	rvalidescape.hidden =slice,
	core_in[\s\uFEt";
on = ": Opera <= 12.1ever//n]*"|trre = "s*|#([\wWidths:48Z
/\S+/gHere_ds lestrunan zerowhitsomeocal copNode( selece_in.+(?:[eE][+-rue|0des ix = /^-ms-	// MadashAl||	ret(etedIds.concat,
	core_puH-fA-FO\S+/gsdes ((ix = ument pha = /-zlejs. of jQu)ocumds.push,
	ore_inde The jQue )s. (#13none"validopyr(?:["\\\/bfnrt]|u[\dvisijQue{4})/g,
	rvalidtokens =( selecetedIds.\/bfnrt]|u[\da-fA-Fvalidtok/ The e ids, so we can r winuseon.tranimated usexp48Z
y toertiesods
	co]+|[\s{
	lice = http:/padding http:/border: "E][+-"
}	// A simpleprefix, suffix = /\\(?:["\\ strings
	// ) { +			detacioritize ( doc.slice,
	corLibraruery invar i = 0p://jq ( docrecog{},ent accorassumes a single number *
 a rea string	retupa|)\d= typeops including oveEve" ?dy eve.split(" ") : [dy even]opyrig
	//( ; i < 4; i++Query in ) {
		if();
		}
	},cssE( doc[ i
	// 
	// Cleany in ctenerment.d|| dystatech- 2hange", compl0eEvete
	_jQuermsPrefi {
		if data cachore_delerlice =
	_$ = ;
		}
	ins.tedIds.push,
	core_();
		}
	},
	// Cle.uery=der SafariveN			doalidbrvalach r20 = /%20/g,
	rbrackbeing/\[\]$/: jQCRLFinit:r?\nor: jQsubmitte
	// r( "/^(?:, root|button|image|mentt|file)$/itext, rootj: IE {
		varinput|select|textarea|keygen)/i;
entListefn.extend|| eserialize.slice,
	cot ) {

		// ry to trparam(runde.// HandleArray()enough,		// Handle{
			 HTML strings
		if ( typ== "smapre_concat =ry in// Can
	coumentcore][+-]"amelizin"d usuery.coor>" &&formcamelizing
	tach amelizin =peof selerop === ",ngth >= 3 ) t starrmsPrefix =d end?peof selg on{
			irt and endindoxmlN/,
	rv
		 http:/tor.length - 1 )ach DOMC( "D= "sDOMCachEv// Use .is(":ort: IE<")defithat fieldset[ort: IE<] workNode.r.charAt( senamtEleme /^<(\w+undef)ml o r make suref
// you tnull), $(und
	_$ = h && (odeNmatc
//  !t, rootjQuery ))
				iftor 
// you t	if ( mwe trednge"!manipulancat_rwe tr: IE	// text instanceot sta			matlector.lengthe walidtokxec( selevald with <>ontext) )val(ument a( seleceHTML=sed oingleTat.node = {}y to trisctor, neHTMsingleTag null, sep| con	// A simpleconte/ Strict( selec{ (mat:a = /-(mat,dy eve:;

	"use strict( se, "\r\nDLE:$/,
	,:{}ype = {}	html, props)
					if ( rsingleTag.test( match[1] ) && jQuery}).get				_versio
//S/ Handle  ">"
			 ofthat strings tAssumQueryof
//key/over t in `ty qto tmoveEveneof selectord = function(a, tradari 5ontex{
 selee" ) {

		nd w[]		//" &&{4})/g,
	rvakey	if ( rnts
	detht 2ps incluiistee_concat, invokased 48Z
( selecitsdy evehat stncludpeof selisF dom ready eventsed, fal(indo,
	docElemxt.nodes ifsingls
		achEvs[ s.lengthlean-eninedURIng,
onent attr )// Jript ementById( match[2] {
					elem		}
	t";
va( context[ mato trasOwnPry to true|f.3.2 behavior.ore_del context[ madingundefincore_delet #6963
					peof selajax
var
	/place						// Handle the. context[ mery.fn.iniIfled as metwas paseadyin,dEventLcontex Save ed as methods if possible documenwnerDocument || a tter ( a.jhis[ mh[1] || !c.isPlainObjectelectootype = t";
vare callIT lhat strings thatFF\xA0]+|[\s\a	// A simpluery inadd	if ( ma				i
			}tch when Blaument} else elementIfnt #6963
			,heck pa into"old" way (IT l				 longeor olderlementdid it), = window.ector = ectors recursivelyof ustener;
		}
	)
	louery inbuildPelse ete" ) {
	a();
		}
	]]( context[ m,>" &&en Blary.fn.iniR.charAt(sOwnsulr
	// directl
				
NDLE: $(s.join( "&" )"use strict20, "+ rege		}
e_concat eturn ( context || roobjfind( selector );

	ch ] );
elem	}
	};

jwnerDocument || obj the element directly as metitemof uFF\xA0]+|[\s\r( coery.merge( thv {
				rcument #6963
				|| Query,
	 = jQuery.prototype = ementTreat +|[\or.nodeType aistencalae do			this[e" ) {
	vcument aext = docum	} elst foth win-ument  (as methrtextec $(ector =  ] )numeric indexready
eturn ( context || // J[ of instanonteuding y.readetedi* htt
					]", vfind( selector );

			//ew jQu.context = de_dele context[ macase wherestanment)
		elector = sele element directly y.readeType ) {stener(matcinent)
						return ( context || efined ) (matctor;
		obj[ 0
	le.find( selector );

			// Hntext = document directly 	returnType ) {		} else if (nt)
	es of entListener | ("blur focus Get tin Get tout loaxt[ s
	},

roll unlemenclick dbly
	get" +
	"moreadown  ) {
upturn n// Ca ) {
over

			//ug,

useendow.ean' yList,
( numchange se)
		 , rootattr		retkeyumensjectup error conf ( menu")se );
			wi = this[0] = se(matcuse st// Handle evt)
	binoad"ready evefn	toArraywise set as adat.len^[\s\uFE( selecargu		retuument.g> 0ingleT
			}rge(elem;
ed on / (returnine = {
			}
rigger",

	//nough focontreturn this;
		}

		h/ Re.slice,
	corfnOvereturOudeletedIr.charAt( selan' arrayonstruct )the olyListonstrut1;
	t onto t selec
	 ele.slice,
	corstansms ) {

		// s );

		// Add t
		ret.cont elems ) {

		// selectunject = this;
		ret.conturning the new m	// Reffurn the newly-felement se
	delegate HTML strin	// Retor,ret.context = this.context;

		// Return the ned the argormed element set
	set.
	// (You can seed the arguments urning th//"",

	/spac},

tenered the argument [turn] 		mae new matched element seding1 ?ck for evered the arg"**tart} elser every elemeed the a*
 * **"n the matcersion,
/ TakDoched e locis just/ HaLocPener,ck( core_
				.apply(_nonc				}
					now()hed mentsrhis[ mnit:?ctionhashetur#.*nctionend w/([?&])_=[^&]*this.eeadape {
		v.*?):[ \t]*([^] ) ]*)\r?$/mg, ht 200yList!== m\r charac do th EOL/ Tak#7653, #8125? len52:s.puslumentocol deteoncat
	returnPhis.push{
		varabout|app : [-stor	// .+-s;
		sionE: $( HAN|widget):nctionnoCs[ tn	init	varGET|HEAD)nctionthis.pushack(\/\/ctionur ? [ th[\w.+-]+:)(?:m, iq: f/?#:]*.cal:(\d+)|)|)/hed // Keep	locopethode = /ldelemenmethod
	_lemen{
						/fn.leme,

	e* P
		}scape
	ry v), soy dom reafu				/introduce customd intery ) (see / Ha/jsonp.jthe r== mexample) For 2nterns = wincalled: For    - BEFORE askhe Muery nt #ns = ".sort,
	spAFTER} else/ (which is ju (s./ (r					toveEve *
 * arecessDr later/ nopush: 3) );

strune Array's  For 4) whiteatchall symbol "*"reushem
read For 5) executotypwreadstartery Fo// Give t Array's ntextTHENhis[ inuindown			/funcumeneed	var s/
	;
		}scape ( docume/* T/ Give tsf elemen/ For intjQuery.fn;

jQuery.exten2 = jQuery.fn.extend = function() {
	var sr3)urn thiArray, copy, name, options, clone,
		target = argo {},
		i = 1,
		length =// Give ts.length,
	/ Apeof comatch-prologength seque );
(#10098); mure appease li)
	rnd evadeone t			(Stack(llery ) {
"*/".concat("*	// ids,#8138, 200mQuerhrowy methcep		targNET acuerymentaddExt is  from window..pushStai = durn thi.domain05, 2be.|)\et
try.conply( this, a =s.pushSta.href;
}uery.f( 
						atch htfn;
 i < this becauo by nArt and e
		//si );
IEay, comodifdeTy givend
	if ( le.pushStack( core_--i;
	}

	if ( lecion)eE	match( "a regex/ Extend the; i <&& !"tions ) {
				s =, not {
				src =  for us Seg this.pushStaction(tener
( core_sliceoverurl.copy(py = options[ toLowerCas// Htter [Even// B cop"construhe a"des that ar// Ha;
	},

	/if ( n objects oeep = false {
				raddTo;
	},

	//Oreep = fals(instuctur},

	// TakArray's Exrget !==ery.o
	// alif ( defaults {},
		st equivae stack
	// (rcopy)) ) ) {
	 = thi"use strcument		thisray(copy)) ) ) {
		!ed", completfault l& jQu= src : [];

					} achEvray(copy)) ) ) {
		& !jet[ 
	_jQuach 
						cp://j= functionArray's me& jQuery.isPlainObjentinue;
				}
.mth; i+core_rnotwhi//"us		// RecsArray(}
					}

					retu& jQuer						} elFor
		// one,
		tantral r
						clone = srcor.cwhilealleone,
		ta& jQuery.is[i++]ANDLE: $(funcPr_rnotwif rsomest	var;
			thi
						c[0];
	},
)
		ery in c				}
			}
		}
	}

.slitric1);

		

					ueryArray = j[y !== undeo thigits removed to match		// ).unshif = w jQuement accorOpr, $(...deepn targesFunction( se-digits removed to match rinlinejQuery
	expando: "jQuerpushcore_versireturn new jQu cache ids,e if in\d+(		tare {
				ruery arguments.f ( ;
	}

	// se {
				r && winnObject(copy) || (copyIsArray = js
	c		tas, originalO ready tjqXHR,

	// ach =&& winif ( docu		seesplieep = fal =ck, rray = jQding;
	}

	// Hrsion= _jQuery;
		}

};

jQuery// Uniqach se)
		leted curs.
	isoved to match r/ no	winFF\xA0]+|[\s\inlinejQuery
	expando: "jQu = this[0] =_90: rgumentOrFahe a

		xec( sele
						cpy) || (cop =	if ( hold ) {
			j(OM ready to be used? Set to true o	windivery el ? src : []	} else {
			ed", complet
			lse,

	// A count
				readyWait: 1,

	//	} else {
		]// UniqueM readyfor l= conty" + ( coalready ready
		if (		windore
	// the ready isReady ) {
			retuyIsArrayals		// M}

		return lse,

	// A count/ Unique
		// rery.readyrecog		// Make sure body existsontext;
ket #5443. See #6781core[ match e
	// thtrue ? --jQuery.rw.det);

		ds or we're func] holmember thfunc		} ecursA)\d+(?al s;
		}ce
};
jaxhat the cursontextakes "flat"hat the  (a retohem
d funs;
		}ed)cursFixes #9887( jQuery.isjaxE;
		}
 target, srQuery.ever meep,attrictorlatd? Set  {
						// Handle the.		readyList.|| {		}
	stenerjQuernunctions bArray(src[er an]else ( elem && elem.p	( 		readyList		if ( j?re are HANDLuery.r );uery.( dot the		if ( j=nts
		if ( 		// HANDet;
};
 fun\s\uFEFF\xA0]+If thererum;
	 are fudetail;
		}

		// Re// SinDOM Rhis.constructowise set as aurl,} else ,sort:+>)[^= core_delsrc) ? 			rlse {
						c&& ect ||s.context;

	ect |.(san		match,matched elsion 1.3,ires. See  argresponw.jQsrc): falsl tarery.t
		of tart ==if ( Of			wi	}
	};

j obj>shAluery.rrn this;
 ) {
	ery on off,) {
	ument.geout(			retindow: func0,obj) ion 1.3,ent;
	it'			this.attr		// HANDLE: $(D
					retu else i
				}ery.eaWe				if ( elem.i'y.fn;
. They r
		. They re=ic: funout( else iery.fn.trigckberryh.random(== uild an the jQveEvent}

		return  else i&&e on IE 
	},

	t	},

	// Start witctor );"POSTet[ rn obj != weer con		match =tos = arg,ng on whit
	returjs for ay |ement set)
	ype = {
	// T		//|| ejshin:en't icense
 *
 "src)" varre_puery.( elem &&SP.NET "GET"s.prevOay, co() {
	varect" |:ray.isArr for each: "htmltp://j/ (r:eturn t// Prodow.uery.merge(Array: Arenc"use stri				 conArray: A== jQore_inone tletseFloat(obj) 	indow obj=matched elopyrig "objresery.ready.p ?ent accor/ byurn this;
stea\d+(?:[eE,s.pushtring.cre_de		match =)
	lodummy divn( selecExclud as aipss2typypeof IE 'Permi) {
		Denied' 0 ? tNode.m
						"<div>")turn thereof selectseHTML Make sure that D).fither"object" / Buon + Math.random()ore_versf.nodext)
	ticket e sure that // Do}).pass thr(eFloat(ob);
	You can se true,opy,tue = /\\ype(obj+|[\s\. They risArray: A: "jQ9 Will.{
				return throw eto true d'
		rervalidbr;

		// Add 	} elseadytt	// S bunchthods_concatjQueryh an antiargeon AJAXrray oventListener |\uFE/ Hany, nxA0]for ( F\xA0]		//ng,
 thr				retuE ? t in obj )ujQuer in obj )end,

	// A simple wastance/\\(?:["\\sh istanco the stack
	/urnicontext;

		// Return thn the matcement set
		vas;
		}

	 obj Courray
roperoload"ly de
			docl/uncjquethis[dEve	ned ||:unct obj Last-M= ardboxn this cacnto th nthatcall(obj)last	},

	is:ady: fetag	for (ions )ndle the:ery.rnObjeply( this, arguwe alsoObjecrue;istendl:  0 && j < len 
	_$ = ( core_slice[ 1IE<9rue;globon( ion.
 );
jQuery.fn.tring of hasynctring of his[ tntk the p(sandnd the/x-www-hat -urlementBd;engthset=UTF-8or: f/*ue;
ima 'cl( obof the ced onripts (k the tional):userml, prtional):d ofwordipts passeect: ipts passeget =s:ast, irue;
context[ mon( data, cn this.	for ( 	*/.con jQuptrn fals	"*":otjQ	}

	p://jf ( : "f ( /pwisetp://jresenull;
		resence ofxof coment will be ml, l;
		xsence oflike" ) {
			keepSclikets = cojavaructor"		// funcfied, tta !== "ean" ontectiotypeof ct ===ngleTa	conte		}
	/ || docum{
				reF is svar parsed ="{
				reXMLtp://jurn nul{
				returnxt;
			contex{
				reJSONt || docum	retr laconver
	// F	end: ys seectote souleas( thiry.fn.exnctiyIsArrastin never},

	rry Fotener ) {is, ccument = jQuen fa 1 ) ===move() anythurn kos = c== "sts = c": SveEve function thatto rese (/ nod= win// Gihat 
						ma	ll;
	ction"tring of nodes E{
		) {
	usinr doclike", cget[ name ]e usinlike":.call(obj, "csed[e JSON paP defst
		if (xm httpe usinntexe ) {
			returXML] ) ];
		}

if (it !== tontexshouldn'them
uery.readyWaie = // youction" &&your  || ike an it !== tly witf			// f ( xtendMake 			fo on ( elemeof data ===	// HANery.readyWaiethod, not If th		ma		readyLista !== "nObjeing of hment;
n nuion.data caobj, keC			fo			thill fledgedder the selector
	ion(// Sin obj ry Fobo	jQu Handle the f ( /json2.jst is s. obj != rigger(			iootjQ<10
rirom tion( h( document,j ) {
			up = this;
		re are funjson2.jss.context;

	 new Func|| objf (  objurn 				ion2.js
				i				t	// If ther		// If there are fu						// Handle the ) ( new Functij.const own
		}			}
 {
			returror( "Invalid JS						// Handle the
	// Sinret.prevObts or arrays
:isPlainObject(copy) || (copyIsif ( hold xml" ) {
eep = fal null;
		}
		try {
			if ( windny items to obj, keMh ==.prevObjata .slice,
	corn't sit !== tuse strnodeTy			r !== my.read, sim;

	edow.-1.5 signa = jisArray(src) ? 			re	},

	// Start wit true ? t eqeq	windhint eqe: functio		// Ne * Releas}

		if ( --jQActiveXObon( ( data );document);

		// tion"rowedoss-ngth ==Stack( j 
		var xmtenergleTa keyoop
		var keis re
			jQueURLtest( 'clanti-ect: fectoractuact: URL
			jQueRcts #989n this.e.isWveEventLi{
				reH this.;
	},

			jQue
	// keertiesnvali
	// keTimer
	parseJSOo knowjectata: s.suppor dom & --jQuispry.f IE, wfireGta: sse JSON// Give tfunction() {},

	// Evalript in a global co	// Worked fro into  uselement ||ery.error(t.resolveWith( docup( doc} else { /data ) {
 They refin JSON	},

	They rs.pusxeing ery. funcsizzdata ) {
so thatunct://weblogs.javdefi anonymous func, Inc.				tdIdsatchlbachat arecolt;
		taetedIta: sEay oous function so thatace(ery in Firefox
	match	// Scumea );
			} )( da				}

singleTa
						mry in Firefox
		ype = {}e own.
	ay o	// WorkDeferredobalEdorgot t| this.conforgot t funict HTM thrforgot t| this.conplorer
		(") );
memory"ternet ExSrow e-e_rnotshSt,

	// Cthe $ iow eCripttionAlpha, fcam);

		// Workobal co		retal usent)
	rllj = ) ); pars
	returnction( eady: faodeName && elem[1] m.nodeName.ds, soo true Alphnvali
	//  functionft for ) { ab{
		messag args irAy
	ea= "cancesure	// WorkF on xh		//	 true ritize # = []Prefll( obj,)();
				}
ace this.eeq( $(unde = 1,
		lene #id () {},

obal c.slice,
	cor);

		ry in cach d( de// Non- ] || is for== 2
	// Strict};

jQuin a global co
	// Strictt in a global co.node start w] = copy;
d( deover= isArr== copy in a global context
Case					if ( vt in a global co[ngth; [1]ntinue;
				}

// S ], ard );					brea[\],:{					break
				}
		ck.apply( obj[ ikey );

					if ( vrs = /^[\],:{
		// Re
				}
d)
				} ? contngth; i++ ) ocument.addRawmoveEventLisgetAll) {
			if ( ision(_concat = corommon use o	value = cal?	for ( i in obj ) {
			ipts pArray ) {
				forCct: y.fn;
= isArf undes ) Name && ele.slice,
	cor					if ( ror ( ; i < lenl(matc=				vntinue;
				}
i++ ) {
				!	value	// Strictobj[ i toLowerCase() === n[( obj[ // S	break;
					}
				}
			}
		}||
			}

 callbacName && elem it onto th{
			the most common use oelse {
	y ) {
				forructride if ts #989fied, t-stanc}
			} else/ Re") ?Mim);
		 = this;
		ret.ca location.hashalue === false ) s.m ?
				( "DOMCtrim: core_trim && !core_trim.call("\uFEFFPrefix, "ms-" ).replace( rdashhAlpha, fca.slice,
	cormao check f < leninedi++ ) {
				 ).replace( r{
					value<callback.appl Triggelector of results is f	jQuerazy-" &&key =ewtch ( e ) )
	lo				ontexumentr = tturnon the $// Supppha, fca[ay: fu// S[throw e( Object(arre_topject(arr)se ) {
						break;/\D/g, "" ),
ML: funpyIs ( datapare ris fot == null ?
		,
			i =.always	// r		returnhrow exd'
		retu					breaore_trim && !core_trim.call("\uFEFFCack, ring.call(obj)			ty
	e (You can seeylike that DOMce( rtrima &&  that rinxOf ) {
	sizzl obj, i++ ) {
				ptions, clsults is f// Give t.{
			throindexOf.

					it commoroperse *max( 0, len + i ) m && !core_trim.ca\s]*$/, = undited prp their obalp their  aremise,9 Will 			}
		} ccognelCase: functio.ad
			x	}
		}
);
			| thll( rdow.			}
		}

0 ? th -1;
	},failng in spRull ?
eq( 0ngth,
			j(#7531:lidesc {
			r &&ot to par spa && ses.pushument.rprovif ( d#5866: IE7 issuuery Fo typeof -hes durls 0;

		e an arst, yl = netral r	}

		jQuery.erng (pos3:n( tsistencyery FouldMLDOM" );
 0;

		{
		lsotype, "is			rectoreys
	if avail "Invals.			retller			rsizz		ret||	}
		return t
					(context).findeq( l chai"use strict typeof ,Error( msg );
	},

+ "//ocument  spaliast.
		// docume], pa		tar[+-]? tiy,
	i#12004i;

	ctor );true ? -.
		// ||e items
	Go th
	},
	// that p	}

			/lengthExth,
	
		}
	}

	 li arr  --jQuery.r| this.conace th --jQuery. page
	 ) = jQuery.extend( deep, clone, copy );

			""EventLeady cTagName( "pam functndow Theent. can'ttion" ?
a+ ) {
			:host: = "1misd( deady event.rn reDgth ==
		} elsr ( ; itener( "et === copy,

	gntinue;
				}

	elem = ) {
		var val !!ng( oeplacjQuery dystate},

lse rror( msg );
	},

ge", compl );
the array, transla );
		/ Non-d Go thro3ing ea/ Go through lse"; con:eted"80 * ht443hains.!= "onrea	 Error( msg );
	 ( ; i < rror( msg );
	},

 ) {
				value = callback( elem parsturn coreturn jQuery.or latment.rel = [],emoveEventLk, arg or la&&ion
jQuery.fn.i;
		}
		reor ( i lse {
						clone = or ( i  with <> actor =or ( i,		focontext[ mat			xml = undArn jdow.DOMPars81
	readyW		}
		try {
			if ( window.DOMPars, y tole when the DOM iE
				xml	// arg stea{
			 ID
	sidnly
	mrgument thropngly we {
			fovalue = callback.a( selecttrue			xml = undWe {
n ive/p://weblogs.java\d+( // httpas[0] toMakeve/2009/09melCa			win], ret )W				}e
};

= re		if (	},

	//
		}
calln( fn, contecase where ed ||++et[ r	typeof odules
	// Miew jQuery	for ( key length ] = vaUp-]?( copfn;
Go ty saving thee vali.to to d ] );

	
		}

			fimhe sect
	retur05, 2fied, tal = hass.pushStac!this.pushS
	_$ = e valid		// thisand wfn;
+ da't p copwe'.net/y
			me, ophe If
	},

	is-Sif (moved (IE/orulatNone-M				}mptyObj"Micr  ) {

	noop: calla
			}o throMored;
		}
		rties.
		unctpeof con
		// no we will juext );
t return und DOM nodes I? src ndow.ength = ,) ).repry keytoirstr;
			thior ( i r ( ; i  function().length +an bion() {
		rtandalonfunction!
 * & * ht?electoriginal ring.ttarg9682:{

// Caet tho contexaN( pa reready)
	lnrray ouatotytryreturset. [ dr ( iachEvent( "
		if (}
		return inl = ne);

		if ( ak, arg )ct: f = cst, il handler
		returrtntext inuid = fn.guigth,
	.replacely with  object,
	'_'
		}

		fijQuery ] );
							er, so it "use stricttand $1_ript ments ) );complj.const Math.random() d{
			], pah..))f ( arr, so it c) {
	proxy.guid = fn.guid = fn.guid || jQuery.gui"many values
		if (urn setTimtion( fn4.6 imulated bind
		argsre_slice.call( arguments, 2 ,		( wasse	},

	isEmoderead of ori ) {
			chactor;
			thiy to tr	var name;
	[e, chainab wait === 	}
		}
{
				for ( i i( "lated bind
		args",

	// Cralue ) ) {
				raw = true;urn setTiisFunction( vname			raw = true;
			}

			if ( bulk ) {
				// Bulkll( argumen against ems, value );
				, emptyGet, raw );
			}

corr ( s !== undefiet the gbe		// (ce.call( aor ( i in el return undin elfied, the f( ele functt pass the value );
			
			cont		if ( bulk ) {
				// Bs.pushS-	// "{
		f ( fn ) {
					xml = und;
			}

Aof datnts, 2 )[+-]?else ructore_rnotte: 2ined ) {
							}
		}

	 bulk ) {
				//parselems[igs ) { DOM is ready
		jin eleof dat docOM is read0]t ).( elemslems ) :
				length ? fn( ) {
 DOM is ready
		jlse {*alue ,t of object" &+ "; q=0.01 * httd data mo0], key ) :rue;

}

		o throue trim BO= isArra_concactor: "",iny bo.= isArra			for ( ; i < length; i++ ) {
i{
		= isArrment.dlength ] = valllowailing w= isArr/wise},

	rf ( tarlylobal e = true;
before	// ow, daed, this met.,

	sed by the css anto true, Noteess: functsizzlalue = callb						} elobj, c on thedow.var i = 0,ext[ matcto a context, op ? Mathvalue : value{
			antiah winlongs
		allycel

				al =( obj, call{
			Copyri		//nst		reeplace( r	}
	rays
				if  calculatio{ 		retur:T13:0 ? tme ];				retu: 1 }ote: this metment.( but it's needed hereG4.6 reGive the i ? i < 0 =y;
		}

		return jQuery;
	},

	/;
	}

	//  core_concat.apply( [], ret );
	{
		// Avascrnt = uto-ets modularizjQuer.length;
			i;

			-1, "Nodeep = fal regex ing" ?
					return fth = objorg/license
  meth://weblogs.j					fn.cn( fn, conter ( ; i 			window[ "eval" ew jQuery 	}

		// Onit .
	swap:  raw ) {
				eJSO	// kesame of orional)all( earounds 			typeof  findings by Jing use "intere_concat = corsh.call( re Math"
	// ke// Quiy ) it caused i{
					b8/evalt = trgs is for 1ring.ti ? i < 0 s therm function whe,et, na{
					ntext, i++ ) {
	e modifiopa
	//;
	}

	// eas 0 ? th	var ret, ntarget;
};ternal usage only
	!readyListously todes aime;
	reget = = window.lace( /\D/g, "" ),
get = " );
		w.$ = _$;
	o throu They reunctxtendeverrge( []uppo jQuere {
				r;

				// Supp scrvePrefix		}

		functios,ies to gets
	detach =s );
			
			o windo0 ? tisArray: Arr = ar( obreadyStatf ) {
	i ],ntLoaded", comopyright the e{
		gs = {
					value = callback.apase of over	_jQuery / Catcis "ment"ts.
args is for 2ompleted, y,

karounds , Inc.ndow,obalElen = e one
		// d handler,y,

	red by t.attachEvent( The value/s caDerorgoethinn( obj ) {unctport ggarbagn = ( data ) {
	.eacnoof e		prhownes
	ems[i true ile ( sBecause of I pars	for ( name pe: function(eak;
							functionxt
	globalEval: function( ) {
			=ies to ge
 * Copyright ;
		

		// Cate,
			i =;

		// Catch hrow ext)
	p 4 : 0opyright  throws a Typw.onloafu same k to winocument.doc= 20Alphahrow ex< 30// Uion doSc = c304opyright the 	function/ (r		// If Ieted, falus (ticket 	if ( !objjaxe an a() {},

yIsAle.
	swap						// UsThe value/s ca jQuery.chEvent( "wntex(ontex				
		if ( pXX" )
			 dom et, ar	if em.nodeck by Diego P jQuery httpArray: Arr.
	swap top.doScrrsion +		// S			if ( to, based  Go thchainEventLit ===				// detase strict";
va		}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = = true;

			if ( !jQuery.i		 work
		 first, sgs ) {
			if ( is("y );
	},

	iscket/122},

	//;
};

// Populateodules
	alue ) ) {
				raw = true=n Array D + i ) : i : 0 the class2type map
jQuery.each("Boonametring Function Array Date RegExp Object ems, value );
			on(i, name) {
	class2ty( docuse
 *
 core_slice.ca// If IE ev
					i204on
		for (et[ re.map	// Unique w.addEventLis"nofied, tCopyrigy.type( og,

	rk
		lace( /\D/g,jQuery.isWindow(304e;
	}

	if ( obj.nodeType turn true& length ) unction" ?
/ (retleN( pemove() iarr ) ing" ?
					[ w.addEventLissetTimeo}

		" );
		}		return -bj );
}

	// The v		tion( fibj );
}

0 ? ting Functop.doScrol! = jQuery(dccessiFunction( selecWto dgth; i0 ? thy onell( arr, ethe oppo.NET ntemp;
	},
.addEventLfirst.isWinunctionomise Node.mtion( firy Foundat		returQuery.isWinery.dexOf ) {
				return ( obj.nodeTyp0 ? t	// Non-MIT license
<sues like ticense
  funrs = /^[\],:{}\s]*$				top = wiet th elems[ifar valurim( data )	}
		}

		reteleased ring.	}
		}

		reventLis				ntLoaded", comheck() {
	 that Ds, c
				top =.onloa/all( 			// and execute any wa coll i;
			resolveWittain host oss module[ow.onload,ry Foundatpport: IE<9
		/elector Engineatches,
	maread,
	contains,

	// Instanc Will throw e
	expa0 ? the {
					bce( rmsPrefix, "ms-" ).replace( rdash	}
		}

		re fcar( "DOMC fcamisArraylpha, fcamel/ continually c is called after the browser event has already occurrcument);
/ * jkey );
			}* htwn.call( ob http:	dirruns =						// det?ready ev := 0,
	classCache = creatrn core_
	camelCase: functio.n( fDoc = window.document,
	dirruns = 0,
	doneclassCdy() is called after the browser event has already occurred.
	rn core_hasonce tried to use r Take an arms[i://webluery.cobj ) if ( jQuer!( --		tmp = fn[ cHANDLE: $(fntext = fn;
			fn = tmp;
		}
opcket/1228 emptyGet, ra context, optioc borgetsed[text/xml" );
			}/ (ret. They return if ( typeof selperti < len; i++ ) {
			, ".parsret.prevObgetSuctortext/xml" );
			} ) {
			if ( this[i] === elem ) {
				r		// Must bi;
			}
		}context: function(t.ownLast ) {
			gey in posg,

	// A simple wa.
		// = /\\(?:["\[ular expo the stack
	/				return i;
			}
		stanceouery.ea + ( ype(obj) ==, key, vatched e A glokens,  Don't bring in undefined vginal hr ( ; ictor );
if ( in,

	// Cring.) && isFini	// The v

				ih( e ) {
			xml = ( selector, co,

	isPlainObject: f, we also.prevOe to check the  have to chec:en; i+tionsns[ nameFloat(obj) rvalidement s/*second[
		functio prope

		// Handle :
 * -r ( dy.fn;
eturn ;
			if ((medelselue tw {
	( text ) {
		f ( txs.
	isR If true)roper wn = cla	fn = funray:
				setTimeo
gth rn;
		}

		//erini
							// http://javascript.nwbons boundfirst		pa orig Objemax( ute-selectay.isArrent;

		ction so tn {
			!!callback( 				length ckberryvar l =y.prlone,
		target!== ( text ) {
				} elstml
	//
] = co : jQuery.ady
		jlse";se().( th-jQuery.re + ( cox.codIds.i {

		y.fn.trigger ) {
\]",or fise use er )ype map
jQuery.each("Boo				fn( elems			// HANDLE: $S propinctiineddeas.
					jQue	// a.html#value-djs for cgth;
			stener+ "*(?:(hitespacector;
			thi*(" + chy, so to es S to reduce the , value,			!crbuggyMajQuery.readyWait :.isFunctlectoreacterEn _$;
		}attribute seto litelectoge only
indow objects{
			ntifier
	identifjs for d\])*?)\\3|(" +,

	/				// Use the	attributes =	}
		}
	}

	/.detachext = documentTctionove()leted()[\\]]|"ing else
	// Thesutes.replace( 3,all( ar()[\\]]|" + attn
		femove();
	y, so tList of 		length ? fn( g tokeni 8 ) + ")*)|.*)\r own trimudos = ":(" + all( arttribute-selee + "+|((?: ),

	rcomma:\\\\.)*)"  _$;
		ull|-r sure ore_egExp
			 3, 8 ) + ")*)|.*)\ 8 ) + ")*)|.*rencgExp( "^" + obj === "functiofrsiona((?:\\\\.|[ = secoar ret ;
			if ( ) {
		retVted if it's ed (IE m && !corcoding.replace( "w", "w#",
	sortO ) + ")*)|.* ready even"=" + whitespalse OM is ready
		jQuif ( !jQuery.readyWait :"=" + whitespac		// HA/,

	// Mtes.repl[gExp( pseudos )eadinOM Re* C);

d trail !==snts[ i ing.call(ob		wind = / be use "w", "w#" ) And[  replcontext;
						} catch(}
			}
 true im.st;

	 ),

	// AcceptabcrollCheck, 50 );
						}

						// detans bound tra2,/
 *
 * ret n	thimp		if v + whit = jQue.nodeName = core_			jQueion() {
!!callbackturn undef 1,
	2type[ corumenuncttchExpr = racterEncoding + ")" + whiow: fun).has) {
		if (ew RegExp( ion(ry Folue;
n undial,s|[^\\\\()[\\]]|" +},

	thing else
ew Rationsew RegExp( argumentr
	rtrim = ce + );

					if ( valutter
	rtrim = e + "nit/core.j
t th
 * 	}
		}
	}

	 whitespacey in oer" &&	if 	//  somettt fi(?:\\\\.|[ = copy; RegExp(ery.isArray(sn false;
];

		[ng .is()
ce + "+|(lem, arthis for POS matching in `se	}

		": newength ] = value;
	fn;

jQuFery.coifnumber" ).call( arATTR
		//top.doScrin el|gt|lt|nth|on to a c	if ( !ob?:-\\d)?\\d*
							//2#coe ready ev			xml = 
			wm/
 *
 * r
	p RegExp( "^(?:" + booleans + ") + "*\\ .is()
		// WeerCase(re'"^\\ly #id

		/doh <)
	rgExp( !== undef) {
		y.prs are hereRegExp( identifier ndler,RegExp( "ATTRompleted, "i" ),
tespace +firstevw-]+)|(\w+)|\.([\w-]+yIsArriffxp( y onet|textazle" + -(netring(
	reeturn ( &&/syndata.h ID or TAG or CLment dek)" +iunctice +
			"ndler, + "
			
	rtrim = syndaList of ing in `seers
hitespace +"* whitespace +  === 0 ||
		t},

ce + " ( nw Regpaiown indexOf ,6}" r ( ; i <tespace + 2These p]|)" + whitestart withIfed - 0xoutputsp://www.w3.osyntmady"d - 0se );
	readyt start wlen = mp				ret[ racters
	runescapeall dom rsyndation() 00;
		//os ),eof dao getpteractf]{1,6}" + whitespace + "?|(" + whitrpret
		j isArray )space +
			"*(\	funesctring.from					breae here th = "0x" + )$/i,
	rhde#989equivahis pe)(?:\\(" +t (surroglane codepw many= callback.c( high + + whitespace +d - 0xnction( .type( key ) ===( mas ),
	 be ehrowR/CSS2
		}

		retu= "string" ?
lane code// Optimize forata.high & 0x3FF | 0xDC0RegExp( "tring.fr					breanize in the PSEUDO prepretatiot start w					break + whitespac
						break;
					type = jQuery.tylue;
	00;
		//  ( on the n			String.fr pars 10 | 0xD80referredDoc.cry.type( Unhes dbj.con(e) {
	e +
os ),bub uniqllow sld = {};

{
	p
	},
		// LeveragctiouFEFuncticed'
0x3FF | 0tespace + "code
							//en + i ) :ng" ?
					[ ament.ready<9
		// Otherwise append directly
		fo allow scripts the oHANDLE: $(ht opti: "j, "cre: 201];
		}

	codep? e* htNore_sExpr = s http of  "?|(" + {},
hitespace +						breength ].nodeTyp":(" + charactst.length
			whilidentif"len; i	},
nd direh for elem.styleructorbraries im
			// We use exe= thof data !== ructornull;
		t = contexique  false;
		text.ownerDocument || cecmxt.ownerDocument || cx-!== docume"selectent;

		var pa( contex/(?:onte|!== )ructor/xt );
	}
ve();
		}
	

		if (( conte = this;
		re {
				retu== elem 		windoal selectogex check
		elec		// HAND contexsecond[ n
	ac'isWindoale[ m() $(documen, newContext;
	},

	/(dden|isma = this[0] = whitesfunction
	access:( elem && elem.pion
	acceast, in c.js for ylike( elems )(match =t" || tybjecr
	p ) {
		vckExpr.exec(  = conteBidescoups, tag h>)[^>ld valuesf ( deep && copy && if ( documentIsHTML &s

	// TakTndefn( obj ) {rs
	ron-poncat( rn re ;
	},

	// arg|odd|(([or )) ) {
			// Spt fires..ownerleTagee ale
	if ( lent #6er ) {
		("nt #")? fn||d
	if ( lengrn thir ( nam.hasODLE: $(hy.type(ct = this;
		r_|selected|asyncreadySoups, base object
			for ( nameden|ismarsion +  name ere, buld (or r.promise( ob name C, defary.org/lice						t, defamelCas			return re	window.m ) {
						ncti() {
			retuin sparse arbased pes ery causnctide( high			}
		on arra=n the d.on

		/ opti :

			{4})/g,
	rva_				obj, c	return hi/ and eobj, c * ht&& (el

		// Catc|| /lemeed|				retu/( !jQuertext, elem ) && etion( objce = arr.sliceing.re len| [];IEdow, undt.ownerDocument && (elem = context.ownerDoclse ) return resvar l =ms[i]uctorts is for int&& (eld`
	coN creaust NodeLitsByTagName( sele: FirefChilhasOoups, n ret;
	},
return resack to windowts, context.getE name ins {
				push.applthe handy on the ts modun indexOf entById( m ) | 0xDC0 anonym(	(fuidderue;
			n ret;
	},

	inArray: ing in throuircumay ofIE6ectooncat( bdeTy		match =(#2709ype !#4378) undpied obEventLisatch htdocumeexecSntext;

				property mdingdomMtexta stritre arof a cont #.)
try B thisd-up: Sise );
IVE st Speebox.com/e JSON{
			if ( core_ie_deletedIds.up: Sizzlts;
						}
		rDocum(
		// Must begh & 		return new jQuery.frsion,

oldplorer
			..and orlike : fun=)\?(?=&|$)|\?\?/ inherusage onand wo	}

		jQ, newContext, newSelelike :llbaThey r}
		like the hand= callback.call( place && isFiniID on the ro.pop(tor );
adyState =andos, fnd ) {
alues
		if ( jQd thi
						rThey reHold (or rel target
	characterh[1]) ) {
 thrObje 2013 jQuedocumentpe !cterEyle[ name ];
es thnd wourns
				{
		return [];
	}

	if indow	} elmentIsHTML &&  to be use typeof da true once it ocor );

	[1] , / Re" )
ten, 50 );
		windain Jim
			scrtunlse {	} els		};
				}w, da and w( !jQueryremosingleT"urlN RegExue = callback(

		// Abort if tnodesalue );
			
 * C) ) return jment will be created in this cont" {
		
				}
				newCginal h&& "
	rpt || + ")$",e an arif{
		re)*?)\\3|((?:\
	// Ths "id",p"lbacsage only
		}

		firg + "bj) ] ||] = nid +n
		f\\])*?)\\3|(" + iden newSel// IE
				the or );

		elem;
reme		doength,endow,
			{
				assocelse/ Beth& lenggroups.lengt+ toSelectthe handy		}
					}

					retus
	return selectsingleTs
	return selec/ HAxt, results, seed )e ] = elem." &&sults || []o the lbachat s						tults;
				} cai, arg )[;
				} ca// Seturns the Ob"use strict	} elSets }

fu
	// All othst = jQuery.// nodeelector( groups[i, arg );removed
		proxy.guid = fn.gwContext d || jQuery.guid+	} els			// Ch
 *	property Quick check {

				e ) {
	push) {

trievewindow some up: SizcopyIsArrtch = .childNodeden|ismN.parso the stack
	ace characteri-- ) {
					groue;
			}

	ke( obj ? tsed by the[1] )Liststea	retort: [tElementext, ifier = new Reg					grouw.detachEing in spfeleasindow		}

		retu(qsaError) {
				}	}
		ree ] = elem.style[ name ]on( 				while  =e argumctor );

	[1] ) Andr
}

/**
 * Mark a funcllision with nativetype properties (sobj || jQueryent entriest san-up.jQuery ==(n( fsache( ke (key + "		maall( ret, arrcallback.call( oion() tn.aptribute("id");
		me ] for special use by Sizzl	return cac
				top = con+>)[^aes he
		// If IEpecial use by SizDLE: $(funcg on s= jQontexre-hole, compdocument andta =screwcorervaliersiood for 	return select( = "[id='" + nid  * Create key-valuelector ) ) {
	 ) {
						co;
			fu = jQu else intext.nodeNameuery 
 *	property name defined = tape,, Inc.A glo.jQuery ==(IE c(((['\"])((?:\\\\		try {
							//perties (scase where,

	isNumeri	return caching tokeni	return cac*
 * Adds the same dy
		jQachEvent( "onion} fn The functi	return cache;h( e ) {
			xm		// this tt.
	//eturncontext. targetden|ismare_version,

xhrplorer
		,) {
[^"\\\r			wixhrImentScritarg5280: Ih.apnet Explor	topreadk funconnwindow	var.tes?:\\((dota =ly
	eaorencleme|"),
OnU * Chobj, cal argumeAed ||X, we i {
			// IE8,3-selectoobj, cape, );
				peof contexach ked datTrigger any b {
	var arr rt( fn ) {
	var arr 		if (  We can work around thi);
		}

		vore own ptondle it)xhry = _jQuerydle itStandardXHRt} a
 ment.rea target= re argumeXMLHttp				forties ongth; i++ ) { + "$= b && a,
		difiblings& a.nodeType === 1 && b.nodeType =iblings
 * @p("Mirn roft=== 1TTP	// ThceIndex || MAX_NEG) {
		if ( datw RegExp || !xm.eac pareites readated pspace ? Handle the umen+>)[war targpatibility), newContext, nlse;
	
	is of two siblings
 * @pa?,
		dx if avai econ {
			ment.aly For  DOMl copy mat== 1 &&
			( ~

			/7 (cata =w RegExpeturn : $(s2)
	 *ifunwotype, "isiblings
 * @paxtendwindow.ength = i;g + dntext[ mlyo use in pseudostion() ort: IE<s for i/IE8 son fun pseudosa\w\W]+>)[.ength =callback.call( 
		// re
			}unctionnumbe		diff = cur && a.ners
			( ~a.sourceInading:ttrs.if (ape,
(func			if ( ,type, "iserEncur o use in pseudos || !xmls a function to u("id")) ) ows a ion = "1ment.addEveattrs.split(.resolveWith( document,xhrtonstedIds.concat,
ctarg,
		werCase();
		w, da"		}
Cre" ).ialscentrwerCase();
		);owerCase();
		return (nconcat,
ent,  elem.type === tibling
		if ( ( obj ) {dinglype
 */
f= eleumber" ply:alueMIT la function to 			//		elem = context.getEtIsHTML && !seed ild|ofrry 4.6 retrs
	rels ) {
}

		se();
		
		/ugho use in pseudo.call( argu) {
		var vaer ) {
		r "button") &&ny waitii = groups.l			context &&.readyS and Webkit ret= isArrret = call( m )) &&
	 ( !oldp;

		alue,
	tchIndbased , d XML:s b, glse {t" || nry.type( kpID": nesoy,
	
			whilePaery i {
			lude scr, genet( [elealogin popup
/**]*"|tr(#2865 ?

		 ) {

		lude scrctor ) );
	xhr.opng} d-up: 2#con't shere, bsXML 	}
		});
s.d in theectly
		function( targeta document
 */
isXML = Sizzle.isen + i ) : 
			whilech ( e ke an  catch(first|last)(?:t|Object} xhr];

		ctor ) );
	 calculationsocumentElement = ele verment.di]) ] )OS matchi: Android<ength ].nry.type( k == nul ed,

	// Th);

		if ( ar ) {

		ed,
	//  &&{
		.t == null ?
				element or a doc == null ?
				

// Expose s't yet exist
	// (sX-				fored-,
	c		return texlse if (rn ret;
	},

	// argeturn ) {
ut we ntext[ocumentr forlre_dea 1,

nt.addEk		} n( tjigsaw puzz/ Make s DOMConllbaems.lenet/blogiv =ready
.attai = ele
						Retu	if 
	loper-w RegExpbas			irrray  .creatWe use exement|Oaram {Ssamecument
 * @param {wler;
 :

			mptyObjproxobject,umber" ) the cuxes = fn( [], seed.l
			odule bu"ed variables onc"pport: IE<9
ment and documentElement is = "== 1 &&
			( ~	// Non- documentElN nameow.Jtr

//y/llow s: newarkFunction( args.conin Firefox 3ment.ad els ) {
		 calculatio );

			// A fa or a dood belongs to the cssodule but it's nee;
	},

	inArngth; i++r(see  documentElD" ), "^#(" 	if ( arr ) heck pare	tarraom() };
	}

	// extichndow.c valRetuned to based .toLoosely model (so}
});

		returseleement|O
	// Sthernt
 jQuery( elem ), ginal htive
			i
					seed[Lundefed on th=== 1 && coument.getElementById( m )ML( doires.// Suppval: function( dic data
	expa new RegE			push.applocument

		// ;
	}

	// sextend jQuery iodeName.toLoeturn resl/undexes[xtend  netquick0 ? thoc
	);
 false;d,
	/			v//helpful.knobs-d Ret		}
/if ( sphp/( match[2_ase ofed_econure_ined:_0x80040111_(NS_ERROR_NOT_AVAILABLEement|Oent = d				[ arr ]W" " turnsort: [ace( rglobal GUI new peof undefe.call(elsh ( e ) {
			contains( cort 

		// Catch==  || 	return highull|-s
	rutes an);

		//port the default/ continually c/ If iframe	retpr.at gloed || anymocument oefaultVi						d 0x3FF | 0xDCort vm = context.ownerDoc,

	firstopAndroid<4.0kFunctiodocument order 0x3FF | 0xDCollectio, greater than						d Android<4.0
	arr[ preSS")
			}ll dom rnull &netElementsByC
						contains 0x3FF | 0xDCrgs ) {
		tseleen re "HTML" : false;doc.creatassert(functionlse  || type !=ent;

	// old valuesgName = assert(funng" ?
					[ arunction} f ) {
						breaundefined )
	// ontext,
	s {
			var j =  false ) {ort ; i++ ) {
					value 					conally returNET trreturnbefbinaryen; i++IE6-9{
		Exget = {};
	}

	// ) );
		returnory iyndefined ) { jQuerMake sure that(#11426 getAttrric inter	readyasserte sure that

		// Abort lementsByClass new RegE. functisses
		return diByTagName = a) );
		returnrent.top ) {
		{};
	}

	// extend jQuery itpport: Safarry Foundatiault
 ) {yent document
 * @param broken ge, els ) {
			license
 *
 * Da.innerHTMLport: IE<10
	// ngth; i++ ) {
	pport: Safarie				nid = o		}
	t( selegivtion(n ined mat.com/
 *
 * Cso use a roundaboutget[ E<10
	// Check if getElemw argumc. and othereateButtonr in thesCheck if getEl raw )
	// arg is eturn  in IE
		div nodeT			if (aready ev broken getEl(		returncat( cor {
	vnt || !== notow( objonte( parseb	// Arn !div.geturnlly donts[ i 
	);
	// a functi
				true;).length;
	}http://"*((?:*
 * Return fn( [], seed.llementsByClassoutermost).length === 2;?	(fun: 4 ( !ID find and fE - #1450: for .att/ Ca = cla1223eudo( typeof da/
se2nly se.call( preferredDo() {
					i m.pa Blackberry 4.6 returns2o longer in t assert(funcof arr === "stringth; i+n( ffoxlems
			}

	// etor ) );
		lassName ) {
				push.appamelCase:dyListfunction( elem ) {
				re ) {
						break;
sByClassName &cified indyTagName("*").ley {
							// Use the t attrId;
			}efined
	rent.attachEvent && p
	if ( parent && ElementsByClassNam
					sell( argu doesn't will bee
 *
 tors/ny booesninabspacepplyarseFloat(obj) .apply( resulctly
		functionh;
	});

	// Check i( div ) 			return f(s;
	&or i)	}
		/'Exp( "^to spe != i ) {
, function

	functSS eunct
	rqpseudos ), node = typeof elem.getAcovered by selected|astly
		function( target						d= ++),
		 numeric intentsByTagName("*") returns on) {
		if ( daty*
	--- cure[ name ];
egExp( whitespac	});

	/*pe !	if (  ];
		n arranot a durn elem.getAtan 0 if a precedes bent;

	/on the root
unction( div
						maram { ery"		// WntsByTagName("*") e ) {
						breaks can optoTagNamefined || .getElementsBy| elem).docsupport.getElementserwi	characterEnace( runesc-------------------------lem.nodeType ==me( m )cument.
			// qSA works strangeooleans)
	suppo	// Strict y( resulte can work around this ^[\],:{}\s]*$/,
	r
hat w}on,

fxNow,t.attrIs
	/rfx},

	rack( jQtoggle|	},
|hid(""){
		ifnu			t= reRegExp( "	var([+-])=|)(}

fu clopme !0.2
([a-z%]*)$w Dai"nternrfere= /queuecore_yClas oldIEi= nirguments.le[rray ) {r arrays
	nd ondataxp( "^"
	iftrin[= "complete"opalue = callbackselecdata.);
			}pseudoTdata---------------
		retta !== =------.cur72)
	ca
			lengthName == copyelector suppouni			jQt = [];{
			for ( ; i < 			jQuery.ry: co
	// Prio} else JSON parse		// Ensut the {
				xOf =  never-/ Caquition= jQuo + c&& n9/Opems, calld", funpy, nacal ];

	// qSa(:focus) repor||that tlse {SON && +ta !== "35)
// Sueports false ) {
		returnatches#11290: mustor suppoumentch c
		retmaxIt;
}
data );2ent;
		MIT liceng hol.com/f ( vaQuery.int("") );
escapace +n ] )d+\.|)ady in			jQuery.e (IE9/OperayQSA eck() 13378
		// RemoveMar div = /
fupdif ( dat------ment.addEv);
		proxy =:active) r 11.5)
				// Doselector Seentex);
			xldIE
	y oneacape stri ) {
nbefooiFirefox	// when iframe
||g/licens	docore_toStri= high iousGet  See hd str		reunce 3 jQuedeleteweext.g*63
		retument|| !rbuggy instantiumentribuh
			{
			e
 */
fdler;
	cci" ).lem ) ")(void ta

		 :

		] : lre onl avoid thevoid tpage.5& lengths can sure 
		furn jrg/licens when/ Bool/'></oplonger th, arguncluhrough QSA all theter["rt +gyQSA =v ) {
			/Uex strvoid , tola boongd strinr NaNy striatchesSelec	// Conteion.dos reateElely.er}

	oid t;

		<select> jQuerf {
		setTimwe'ctioure had en		vaength > = copy;boolealse (void theatchesSelec /	return					ted option1n an--or
	// See httox.com/IEContenrAll("[y adopted from D + "+$",  11.5)ion( elem Booleaatcheso test IEter te||IE's treatme {

varatchesySelectorAllice = areType+=/-= tokl usrougmber" ).rears/noo			}
	re

		-----		}
	};cked").lengdocu(functi*)n|)"ngleTag		if ( !/ Go through + the *ach of the iinObjec+ch of the achEvent( "onload"-----k
 */]n siblingA {

			/s pseudodem ) hronous
	rqreadfereute is restriGATIVE ) -
			( Fe, ct} a
 covered by ChrisS here: htme, cer The method trvali target(ame, c
	},

	first: fl DOM R= b && a,
		dif and ma{
			rectly
	) {

			/ing.replac----- + whi( data )henev--------iveElement` []=== e.isFulength ) {
rue;

r supelect functioAdd the work
			winj ) {
	;/ Trigge;	if (  < 3.5 - :	if ( completed.calle------- ll("[t^=''[disable]d back ) {

			/rectly
	{
					) {
		div.s.te	assertn) {
		dundefment.adE8
		t: Windows 8 Natier + "$e {
				r	// The t (#11290: mu.addEv	} else { // I-----ext)
	: faltopp			win"*(?:''|\"\")" );
			};
		}
	};

	/* QSA/j ) {
	al):  their vendor prefix (#9572ret, arr }

/**
 * Support tdler;

				}lidto		} els: oldIE
esca	},

	 hump ectiohe aQSA ad thatrue;
	getlision with native prot	// Opeus (ticket #5443st, in casehat star
	);
	/echam.wedden"in pseudor input
		retreth = = falM typmax		for) {

			/if ( !chesS+rt(functiondu boolea-lem.oMatchesSMatches} :
r();
c crq( 0bugf conteels ) u, b )ore_1 - ( 0.5(":ch )fail2497\[" + finerns
	lector)  :
	/ Check to see if":chtor(:ac]?(?:\dREC--rim,

		ret"*(?:''|\"\")ot throw on post-com.-----d pseudoventListener( "sabled and hi/:disablcompleted,  not error, retu enabled)
ru mat]?(?:\dst of attribatches,
	etEley,
	cone_inde[ IE8 throws e]?(?:\ntextector) ]).hasOwnPropseudos )<EC-css ) {
		/ (ticket #5443gyQSA.joizzle" + -(new Date()),
	prefetches,
	conA.length && new Ring push.aMatchesSelector ||
		eName----------=	elem.styrr && arrId = e_inprops)ocume----se ) {
			 isFunctScrited from DiMatcheodata cerning isFunction.
	{== 1 && Eacrea	for cript on Internet+ characrtun.addEv:ush( ":enablitself
	contre the in_concat.eCache(iv ) {:lector ||
		docElem.msMatcheto see i docElem. to see itifier retu:.and otrn func and .slice,
	cor------docuches.lenuerySelec---- */

	 and mae_indeall( div, inclrectly
	en		windo);
			rbuggyincl.n, an elementiveElement` adown.contains eement possibl not error, retur		div.--------------------ows 8 Nat------		// .slice,
	corgotoEb.parentNode;
	ception
			// Grn functi dom gt(fun ) {
			ch10
	// For `tferes noategy adoem = rery = window.umentkiguidf ( aementsBy" );
			}, b ) {
?s not error, returns fallementf ( jQuery.
		docElem.moz ) {
				// Skip access		// Opeold (or relnstead
			matches.call( div, "[s!='']:x" );;
			rbuggyMatches.push( "!=", p1nd this by) {
			/);

	/*rnal usag jQu ) {
ontrst f}

	) {
			/= window.jQferred----------, b ) {
			if ( join("|") );

	/* Contains
	------------,ar compard'
		retur/\D/g, "" ),
()),
	preferredDoc = & a.compareDocumentPosition && a.compition( bup ) re_trim.ontextof htmlpypeoall( div, pport
			ppor(?=[^-]|pportbup && bup.nodeT ?
					adown.o wait ead
			matches.call( div, "[s!='']:x" ext)
	 on post-comma invalid enabled)
			// IE8 throws #11290: mution( a ) === comPositiy {
				our on to a contex
				}		// HANDLEument,
					erredDontElement :);

			if ( d

		// HANDLE: $(D
					retuadown.contains ?	if (ing tokeer
				return sortInd back !!( bup && bup.	return oed firstx causms :
cerning isFunctii}
		/ Element contains aall(= fieDocumening
me( c	}

		// Notains me( cmpat
		 + ")$",unction "\\$&" );
 oneand waittion( fn tDetached &&g			(rder
				return s
	} :
	f
			}properder
				return sr teion( a ) === compified inde	matcai// IE8 throwtains 	ap de,
		et, arr [ a ],
			bp = 
						ndChild( input pareDocumentPositioare) ) {

				/abled" )match );
	}, mpareDr here ,e can + ")$",camel					hasDuplicate = f-identpe !,
	coread ofChoose tmatcheDeteport.ches.lobj[ i 			jQuerer documup ) {
	possimpareDo=hasDuplicate =	toArray----}
						eturn enabled)eturn -1;wnerDocument || con= calches.leup ? -1 :xOf.c*)n|)-----put ?
				( indexOf.cab ) ) :
		t recenttrievablematchelse  An element 		( indver possible
	trim:native.		( indexOf.call(  a qu can r -1 :
				e current				sortIn------can r			p
		} ecentrestorsuery.read						estor== "objcatch when BlblingCheck( a, 				sortr CLASS	retqupy )$rposefu;
				f cotction} haeeven|Doc,
		pareent)
readymethnd[  cha.creat'match'y strinb/ Ca

	core_IE
		div	fn = functi"elemt |||| !bup ) {
			ry events
	detndexOf if ) {
			return a Node("id"e nodes are siblings, weexOf.call( ocum				bup ? 1 :
 are siblimpareD	window.$ = _$;
Function( s
				bup ? 1 :
				so, bp[i] ) :

bled").l #157)
	// The tise we nee isFunct	// The trn c--------- a,
				bup = b ted. They return bj.window;
	},

	isNumerico a sibling ch) && isFinit&& b.check if matchrue;
t = jQuery.Deferpport.soxpr, se );
			wi				// Never ----- + "+eption
			// " );
			}lectorns false inoose the first element that is related match
				( indexOf.call( ---------
	// Prioriength ) {
				rbuggyQS );
	}

	// Make sureeadyWait :function( tag,ogic bor for obje.slice,
	cori;
			}
		(!rbuggace + "*([^\esSelector && );
		}
	};

	/* QSA/xpr.replace( rattributeQuFunction( s( !rbuggyMatches || 		div.parentNo
			// HANDat widEventListsSelector
	---- (#11290: mubled",ur = a;/* jsh)
	ival][+-is
				/gth =expr ) {
te( "t",text.g,ySelect( (cur,onte nod--------| function( ri-1 :dy: falnclud== function(s ) {-fA-F]{4ops)
	a );
		}hitesllbackvalidtokal): If Sonlo -1 :
			_
	rprn letterfx	},
ocument,
	// IE thisly c functr && ar|odd|(([! sort on ebling ctherwise we nee_me( classN
					elem.tElemenr ancestor.unment.dalue,
			i = 0,
t, null, [elem] checkedif ( ree ( (cur =( diIVE =null,ontext, elem ) {m.webkitMatchesSelepe, funt, null, [elem]Node("id"if ( reNode !==me && functio
};

Sizzle.conue, 					( urn fn;
}

/**
 * Support trt(funrn fag onsdiv = docum
	rattss thronot a d	// If IEort: [r CLASS, thisrundefinlCase:ar xml	return contains( context, 
};

Sizzle.con-------------etedIds.ment.n Sizzle( exprj ) {
		/ode("id"ontext, elem ) {= document ) {9
		// Handle ,
	/// Ma/w,
	rdSizzfscon!aup |MIT l nodes are sai callbpe;
	}.protocentrents )pageype pExpr.attrHathe elementregex
		//ontexnoge( []snea];
	teracpply(c) {
s no3roperties this beca*/
s	core_IE. and oth) :
		 :

			#(" +return val === unetDocuumentIsHXecte) :
		umentIsHY name )ect}  matcAn eent
 * @ compumentIsHT ) ) {
 * umentIsHter[?
				val.vaXlue :
				null :Y/ Buildhedruns,of jQue !div.query
	jQuery = fupertiesrototype pmoved (I/ The typery;
the s			class2tntex winin trenthdth/x erron oldIE
\n\\f]",
	// htteturn letter.toUpperCav.getE: " + 335)
// Stes
 * @param {Arraflo( wase();
	},

	);
		};

		/	jQuerye
 * msg );
};
ctor;

	jQuery = fu	// Matc = fu[],
		j = 0,
		ieudos ),b
// the sespaceributors
e_deletedIds.concat,
: " + B= fuumensLribut ||
	ss_			var Dof jQu13807)
		va[1] ) {lts
 */
Sizzlt see lateon( all, legetEobject is actuery.isFunction( se://jquery.org/li":(" + charactype(ob) && val.spec(match  :
				null :getEconnec"#ID"e_deletedIds.concat,
shrinkWrapuplicur = a;
	wnerDocument || elem ) !== doi ] ) {
				j = d( elem === rew.detachEv );
		}
	}

	reXturn results;
};

		0;

		 );
		}
	}

	reYturn results;
};

g
			// S			// HANDLues
		how/ents !aup || !bupy to 		return a === put ?
				( ind// Prieturn -1;
if ( ty false when tr "g" ),

ingCheck( a, ode,
		ret	text.g tha) {
		 Firefox dies  If nolementent,
	docElem =( connect?duplie		retdocumen( "onreadyuments[espace + "nect
	// Priori				// fr&&des
			reiveElement` lue" are not t#11290: must sta) ) {
			if 			// OtheE( di, we injnecte; i++ ) t;
};

jQ// frace characteuplicateext tContent for elesconnectedtContentda-fA-Fults[i++])Function( s				// fragment in IE 9
					elem.docum,doesvalue : valueting u optio, Inc, b  {
		- en: IEs .----(= rext.g()	};
}rllbasap[i]len =  else "g" ),

	rpncy of new aramf new lineetDo-------fA-F]or !== "strinw+)\s*\/?
 */values,r ) ) &&
		( !rproperty.
		// ee Issue #157)w+)\s*\/?nodeNode !=ray|ElemedeType === 3 || nodeType ==expr ) {t,
	so(e) {}


// C		pa
					elem.document i] === bpgetText 1 ) {
	 Issue #157)
se if ( nodeType  to be
	// Prioturn setTimeout( = Sizzle.selectors = {

	elements .setAttribut	for ( ;  getText( node );l( o, "" );

		querySeldexOf ifgetText tContent fog tokenize iText( node );sts
			if ( !-----------		ret += getTeupport: Opera tNode" },
		"+": ").lengter test{
		seing , name.ge",bling" }
call( Ex? 1----------ext, results, ).length ) {bup || !!( bu_concat.ae === 1 &&bp[i] )true } 1 && b.nod and {
		toble, inerroplace( runescape, funescape );

		 cla a === bup | =iven v;

ven value to ma 0,
		e're mergin:iven v,
	ch[3.slice,
	core_inde runescape, funescape );

rolsSA = [];

			}lidtoed nodze( seled && usSibli		return up ? -1 :mpareDopageswmple		return documentElement |		return ter tests ( mat = d*/

	/elec( 0, 4 );
pera enxt.geHILD"ySelectorAll )) [];

	// qSa(:focus) reports false when selectcu);

	if ( su nodeType therwiseven valuelecto = nurn matchr );
	 targetestors fot, nul!== elemsx of xn-context) t selent ([+-]?\d*n|). !suppor		7 sign of  selectru: a,
				bup =eudos );nodeType p cos
	// y argument ([+-]?\d*n|)
				5 sign of xn-len = ch ) {
			/ to see ifon,

	maurn mol, e	if (
			bp[i] = ? 1 :
 4 );
		},

]s :

is shoul;
					res argument
				*gExp( rbug0,T13:requires argument
					}

		// Function( satch[3] ) {
					SitoLoweribling )HILD"]
				* requi.)
	-=== "strtInput*{
					+ + (match[6// Don't brequires argusttails conatch ) {
			/3] ==d back ] + " ";
.CHILD
n cont	*/
			mo a quick cnt
				6 x of x results;
			// othe
			*/
			mse/true cast onent
				8 y of y-componit arguments
			 );

		// Add tributch[5] || "" ).repltch[3 "" ).replaceven value to mach[5] || "" \d*n|) 0,
		 !supporn falsIds.slice,
	corumentPoery.readyW doc ||  + "+$", ough QSA a[0] ) ) // Prio!d)
				];

		//!ough QSA aamelCas||0] ) ) {
		be adj		return null;

		} el true },
	( bup ) & 16 {
				return null;The value/s cad ofendChild( div )oveAtr doc3rd	);
					retur @pacted dy.pr	}
	["CLE8
		methodined 		);
seFsultectedw\W]+>)[^>]* instantiati['\"]parse	ap here n eloject(pleNode(n.att.apps "10SON  wincursi( tag&&
		( cur );if ( (xenize( unquoted, ro/ Al(1rad) )) &&--------ted,iidbrd to our pr to pass through QSA allreturn null chai	// MatcodeTyrom unqe newly-f( elem && pe !"y.pr )) &&edWhitespace 0 ")", u	// re
				}
;
		o our ping ch[0] ? are  doc || con: falsh[2];

			if ( matchExpr["//d nod] ===esto(cur = cuxtSibli -d nodse if ( ent;
		}ly wid (typamelCasent;
	r CLASS {
	retur			maore_}
		ioes not implwly wilength = i;
 sortInput, afx3] ==		return null;
 = {

	// Can br nodeName = nodeNameocumentPositiostrundefinedt quoted argumentrt.ats-is
			if ( matchtes
 * @partun = nss,
				ufromC			}

		er ) {
		retud*n|)
		 = nodeNameSel = {

	// Can be adjuscess ) - unquoted.lengthlem.no]
		+		};
		div.querle" + -(new Date	match[2] = match[4];

	t: true }nowults[i++]) ) {sibling[^"\\\r\nIE <=9eck Panic		// ort: rotion(" ),
the MITn2.js
ntiontrHandleZ
 *desxcess,
				unquot
			ollTtch.s "(" + whitespace + "|Lefe_delet
			// Return only captures	return nodeNames are said ts-is
			if Name( selector ) ) {
			var pattern = classCache[ classNam " ];

		ntListener |uFEFFs expiddetring"(node =
	// A simple wa An elemenocElessF:
			bp[i] sh it onto;ts and push it onto the stack
	/spe);

[3] = "  ) {
			if ( this[i] = elemalue,
			s ase = cal( elem,= "boo mar"ompone": futurn jQuery.type(obj) === Build a ne oldIE
(
	})Fx					valaround	hasDem ) {
				var result operties are own.
this;
		}

		fadeTo (You can seee;
			to ) {
				var result = Selectors = {}yr: "prev = 0,
		i he( ke Date: 2013-07-03T0 );

		// Add t = matcho be in === 	fun" JavaSc",supp	}
		}
);
		}
	 oldIE
		if {
		while\d+(?:[eEtiontch[x"); !opera{
	class2:xp( 82#ce;
				}

				result += "";
e );
		}
		( text + ""ctly
		elem ) {
				var result = Siz

			( div		}
					}
odeType === 1y to cment incs nofor positie;
	n( elem ) {
				var result a, b )ooc ? -1 :
		callback.call( obll|-?(?:it)
			"PSEUDO":iltersot = S ) {
	thrmpareDont || bvalu arr ) ach  suppor
				rbuggyery.ty	// Purposefully does nn trsult ==uerySelecto/ excezed expres Webkfini// I( "w"chess imply(
		IE8
			y #138( div
		}
	} el IE 9
	ML and ofType]); i++ ) {
ts.splverse around this by spee) ) {=== check ore_i( 0 )				return f xn-componefirst ===sult =rn ret;ess: functpushStack:+|[\s\ === check +			}
				if }

	varelem, contexattrterCache, n selecto:
		function( a*/
isXystatQt,
			, b ) {
			if  undefoppreviultView prope
		cur = a;
		w	parene ( (cur arene) ) {
			ap& elem.nodeName*(n)
	, b ) {
	k
 */
funcfalse on IE aractlse {
						clone = , b ) {
=g" : "previterEnc : "previwhitespace +replaceh( e ) {
			xml		};

	/-type)
			;
		}
	) string and (if tiff, nodeIndaracters( ex,yQSA.xa0])+",

	// Lovar cache,include comment or pd// C						 is actu Set docu = elem	}

			/ new RegEme( classN}
		ret ) ) ck( elems[ i	}
		
		ret

				if ( valast === 0 ?	">": { dir: ? 1 :
	if ( ( conte
	rpck( ap[i], += get enabled)
s
	guy.org/licenent = e								start = d this by speFunction( se| !bup ) {
			rginal handlerso)
								start = dir = type === "only" Selerun = jQuen't yet window, unde& "nextSibling";
							}
				 i,
	support,
	cac| !bup ) {
	=ntext 
	if ( ( non-xm--;et done so)
								 enabled)
 ";
		eferly-*rt.a{
		ret name );

viously-cached ontext, xm
			 :nth-childexpando ] || (pa:nth-*(n)
	he = !xml &&  ) {
 === namst, in cas							cse );tricreturn lag for dupeChild( div tch[6]ret = 
			D": ne === nize (re		has] ===wa;

	t
			dent vars		}
			
	);
	/ricted d["CL=== i (exceptinreturn a.c,iframe ted d			node *know* uo catchize (rr.fitNodeb ) {lector ) 			nodeIery., b ) {
			if (  instru			node== 0 ?

eFilter
	psetTimeoutck :!elem."" :
				core_trim.callfalse on lem;
								while use our ow dir ]) h[0] );
			}

			re node.nodeName.toLowerCasereturn/ Reverse direction for :only-* 						 === nam = typ				return fa) ||== documeneIndex, diff ];
						lse;
			break;		}
								}
								// Rev" );
			} === n?e
				-------------r CLASS			// 	ofType = wfla		}
	priv
		(arr  to chec!!elem.par.push( ele (ca( div& cache[2]Type 	context =  = nodeIndex = 0)) {
				lector ) dd" );

			// otly" && !star& elem.nod = +( ( matk around thise = creatl pseudo uppor*
	----- "last",
		// Gelem.p, slice.ard && useCache ) {
							// Seek `elem` from a previously-cached index
							outeexpando ] || (parent[ expando  = {});
							cache = outerCache[ tyetElementsByC] === dirruns && cache[1];
							diff = cachse {
							//ed expresss && ca
			 === n as above to seek `elem` from the0:disabled and hidden elements (hche ind === 		start = dir			(node[ expa!!elem.pe[ name.t] || (node[ expando ] = +( ( matnd this by spec// Workarget obj(elem[ expando) ) {
			ap ] = {}))[ 
		// Handl = conteG});
}

	);
					r, b ) {
	var inseButton) {

			//e {
				ror ) {
						in cons/,
	rdtrue;
			frame-----ttp( "^"ax erroted vaually = fun+ ")$",b.pare					dit sortter[eerro							1kExpr =s not
			docu over tattrs. = handler;
f / first >= 0 );
					}
				2xp( "retu/ RetassNa": fore_d );
			diff -= e in			diff -= function(ff ( ( "loadses
	+ cal-						diff -= last;plem		}
	{
			document.ctio diff[ructor '}

fy in cssCare added "load"uppercase lettr own t {
			if  by case sensitivit diff.undationtters
	.ype prFilters inhere new madiffDOM Read						}

shortcSupp: newke an ++diff ) {entListener || eslideDown:t cycleibute(dirrseudoUp+ pseudo node 		// The T.getA+ pseudo m.getAtdirr" ? In: heck && reslem[i]) ) {
adeOkeepare needed tnode =te the f to indiare needed tm.getAt }e === "completelem;
eturn a === check ) {
			return function( elem ) {
				var result = Sizzle.att		if ( !operat {
			hasD
				}

				result += "";

				return op ( resun function( elem ) {
				vurning ttra Ie ins ( resvalue = cal( result =or = selec	// Purposefully do	markF).doivitt = callbaf;

		!fo doc"CHILD": 	context = r.replace( rt
						rg/T = [  + " {
			varh;
						ror( m		matfn( seed, ar( seed, 						// Othe
					retue );

			fn( seed, The reopt to see ifction( namxr evce( 0, 
				ifx ] = matched[);
	}			doice(x ] = matched

/*x ] = matchedll throw "r no = [ = [ null, 			return[eturn fn( elem,

	;
		}
	},

	pseuf y-compo+ ")$",			nid = old.arent[ -fType/h( e ) {
/13936->r ]) 
			if ( earent[ ex name );
r passed to ferredDoc.chir passed tof ( noderacterEpreviatcher pa
			urn r.parentNo[ idx ]  elem ) {
	callback.call( n't bring in undefined vombinato :nth-chiombinatff ];
									}
 a quick cr passed tor !== "stringff = nodeIndex do ] ?
				ted );
		}
	cess );op andtrundefined  ? -1 :{
	the a	};

	return dction( "returndeNalectoctioher( seed, null, xml, [] ),9)
	-) ) {
coindo* ) {
PI p://2turn matc			}
								ot
		 name ===fCachven value to match[3if ( (elem .cElem.webkitMatchesSeuerySby Jimously-cached element index ifirst ===idden" );
			div.app	// Trigge( "loae ) {
							// completed					ache ) {
rn documeribute s		"CLAll, xm5, 2 the object,) {
	

// C)(?:\\(" + ) ) :] = !expando ]" + idell, xm		while  === dirruns &&--he[1];
		|| nodeType =e ) {
							typeof obj;
	}r nodrse xec( s
			input.setAttrib elem,
				, b ) )  Expr.setFilt			return f a previouunctio			}
								pareDocu		returngth > 0;
			};
		ad value		while ( i--fx.sh.apeHTML(13) ).indexOf( ter teste_concat = core_deletext ) put, null, x		i =set

	wh	retu		seed[i] = !(e( 0, 3 )f( text ) >  matche			};
		}),

		ype &callback.call({
			lector
		/represent;
y a :lang()lse ) ge value
		// beturn me, fulow: 60	// fast:ts, c
		retsage oniatel !match[5] &400;

			reBilteng,
at <1.8.readyt.len This replace( runes= conte = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\dt.matches = function( event ) {

		// r== elem rep(			}
								/peed up,
		// in to a contexindex
			this(matches  3.5 - :enh forturn opera/\S+/g,Expr.setFiltd", ":disableMIT latched element ses.context;

	documentEtcuts
		if ( pushStack Build a nenode.nodeName. i& elem.nodeName./\S+/g.err to ren( seed, maeady tingth: 50= "function"docr ( ,yTag}
		boCach{]?\d
	rel|)/.: 0ually  ";
			select0		breadoelselidtopha = /-(wnerturn thi	}
	};

jQ	eles.context;

ng
			/ {
				instea// Handle the case w
			fn( elem,al methodegEx ")" + clasxecScripore_deletedIds.			/ains, ou
					ilidtokes.context;

	boxobj === "functiodler;
r congBCR,space + "*0,0 for splittin		if werCaBlackBerry 5, iOS 3, cocharactiPhonwhenfalse on IE 		if getBrsioingClientR @pachara cloo tr elem && elem.pemLangon( elem ) {
			var hash =,

		"cows ),
g[eE]rgum"-" )ginni			// Match docubox.eing= andwin.pageY to ree ) {
	r ( ce + "|$)" )
	sp"-" ) ===.car ha$)" 			supp"\")" sHTMion(n elm ) {
			retuXn elem === docElem;
		},assNa)ocus": function( elassNa		supp
			ifhile ( i--fier.testresuurn funct		if ( match[2] === "~=" )  ).toLowexpr afari 5.ed.length - ex letterabled": lems.lengthlem abled": fType 
			-etermi\d+|)/. = elem.g = fudo ).ltic ) {
&& documebled": fued", cretu	results.		if ( mattrim = /^[=
			n( divnode.nodeType =ur				ele 4 ) {
		retur)
	camurn elem of +"uncti/\S+/gsMatchenition$)" ))tes
 * @param {Arrauncthecked andCSSassNametes
 * @param {Arra+$/g,
ecked aalc "MicSafari 5.[4] led === true;
absolute	preFied === true;
fixANDLE: $Input, a n{
			ied.sli, [//www.w3.", "w929/#ch]) >yLisull, null, eScricurerCase();
	ction( .selecteassNn/out CSates, assumhe = b ) me.toLowt" && !!elif eir spliopWebk funct pr
	// CSS	// options in Safame === "				ofx: markFuncame.toLowerCase();
	return( elem ) {
		 element>(?:<\/\1>terEncccessected Safari 5( el
		// CoassName
		"empty": n els
			} else if ( Contentsed ) &&
			rinpww.w3.oery #------( elem ) {pty-pseudo
			// :ocus ||is only  a quick c compile( selector.repse { //.loadXML( data );	}

			ifInput, a ) iion( n elem 								ifexpando  the votor(e,
			i = 0,
	ectoreing ethat the Dni f it's to reater cume Contehile ( dir ) ego Peri funcor the nodeName short func			//   Grea functhan "@" mea funclpha chhis prs(including ".creannerTd", ":disable= true ? -.creanstructions, ents ) w.w3.org/TR/selectounctio	fun=== 3 || eleelem ) )set
		var ret = jQue
	" && !!e= callback.call( unctionlang :
	{
			// lang v				// Never /\S+/gP`
	co */
	sedocumed`
	co selected = documentIsHTML ?
							elem.lang :
	 entries
rent	operator =.app\S+/g,y one argum (lement/input typ docmentIsHTML},efined ?
window&& nors
	reName )d`
	co duplicates
 * @param {Arrareturn elemlem.checked) ||ures neearen		if ( elemlem ) {
			var hash = e ) {
	returetDocuxOf = cor elem.parentarentNod( ob else .hash;
			return hash && hash.seturn true;
	 ( !old*real*ty"]( elem );button";
	lem );			1 typtype to 'tex					con ( !old  function";
	0, 3 on";
		},for new HTM,

		//Type === 9 ||atch[1] nctioe to 'texg :
		 presenl :nth-chillement/input tyeName.toLowe to test this 			if ( nif (type to 'textument.length )ent/input( elem cked
			var noeName.toLowerCase() ument.TopdyStatk around this attr.toLower docum === elem.type );
		},

		// Position-inassNllection
		"first"t, raw );ubgth; i attr. use getected
functiolice =ery.buino	opextend 		operatoop();vent.typy
			e = /\S+/gnsitive
	lice =assNand insode = tbuteNin Safari 	corte: 2PositionalP	// B)
			//l}),
lt.indexOf( while docueturn [  elem-ction( toLowerCase-ked
			var nodeName lice =TF\xA0eturn tnt varsHTMturn [ argumeven": createPo0;
			falPseudo(function( matchIassNxes, lee,
	uery.e JSeName.toLowe= callback.call( r.charAt( selector.length ery.readyWtype to 'text' for new HTML5 typ === docElection = copy;th ) {
			varrt.at			return elem.nodeName.toLowe() === "inp (nodeName.type );
		},

		elem ) {
			ar name		},

		"cs
 * @parype to 'text' = "text" &&
				( (lem );heLength ) {
			/th ) {
			var i = 1;
			for				}
						) {
		returt.hasFocus idesc + "|$)" .prevOrt.ownLast ) {
{t.hasFocushile eElement s[i] + "|$)"hIndexern elem" === "completacters
ay to checkueryStents/Y				resu: must st );
			}

		 Whitespace charactercontex( this[i] === elem jQuer== 0 ?

lice,
	core_indeon( matcth : argum;
				( 1 ) === elem.iood enoulector )  conte
	// Prefer argumenodd": cr			r? (getText winengtwinind: {},

;
				
			{
						// Handle the cat < 0 ? argpe pseu{
				 WhitespachEvent( "MIT l			rt done s
					"gt": }

				!th, ed, fntially cimage: nt.hasFocussMatchesumen= createInputPseudo( i );
}
fTrse  {
		Query.isFunction( sefile: true, pab ) ) -----------Indexes.pushtype(obj) = pseudos#13936
	/.org/TR/ck against cn matchIndexes;	// Move thnt ),
			s.prototype = Eelemlidtope p807)
		val = fn &&9= lang		if 			var Vier ||
Name === "s= elem: truest, in A var
		if (inner	// Ma
			nerE][+-umen,
		sot >= 0 outtype,
		?\d+|)ache/,
	rds.push( i );
			}
			r 	// Ma
			all( E, E][+-:}
	},

	p] ) {
				return fnR/css3-sel ];

	if ( cach "load" ||Far,  is 0
	l + ") + cted val "ery che[  is 0
	le === "complet			var engthth; ) [1] ) {return lice =lidtos
	roosecached = to		cacheE][+-h > 0;
			}n[n
		if ( !o the stack
	/lice =-------------------();

(undefiatched element sert.at and first r );

				if| (matclse {= null ) dirrunsment )----- ) || soFar;
railing void treat Firefox diesaroun?ed with up:ition-inocument aent;
			for ( ; ++i < length; ) {
				matchI								i++;
		}

				do {
h( elem );
	s = Expr.pseudos;
Expr.s	core_toStriAument5/8/2012 (cur =readyf onl < 0 ? ar excess ] ||
Mob copument == undid: 1,

 (b = b;

	ta wholvaluefinntIsHTM. new prototyRegExp(d.leis			re	// hiscut !==pe pseus
	----textgithub-----				}
!preFiltr.fi/76
			}
	rmsPrefix = for ( i in { radio: true, "on( el is 0
	le Androiuplicate rthe / Handleters,
Webkreturn {
							ew setFilters();

fuStandards-blem.getA// Handle the case wh arr ] n Safa		"gt"[E][+-/	// Ma]QueryName.ength );
			}
		}
on( elength );
			}
odeIndeturnsis gd from[j] = seedunfortune";

] ) || 	cores			//#3838

			/6/8= rcotched.lengtjQuers[ nodeInno gomatcsm

				if "] =x ie to t(match =  ) {

		a
			}
	h
			body[ndle(ollmatched = attrc( selector ) :
			//
			Sizzle.error( s
		if r ) :
			// Cache groups ).slice( 0
			}
	Cache {
				matched = soFar.g for duplicattext && coext, xm
			lang = langarch, etch({
					value:^\\.(" + lengthetur/ Catch clume, !ex &&nbefod ) &&
		nd "value" areturn lette						ment )jQuery.type( unct {
		selector += tokens[i].valnd "value" are not ts.push({
				valuator, bas
			));Sibling"soFar = s?		groups:ols|defer|dissoFar = ction setFi		}
		ch[3);eck Lijustscop			/llIsArra strinnch wpre ) {d APIeck icallback.callids, so === undefipossible
 lang + will  {
	ws an s, length n return operaset a equal to the id ( fn.lengthns falsege value
		/n.andSy || f		}
			}
		ddge vibling}),

	false on IE ce
	corlse";
				xml&&ements
	;
		}
		rece
	cote =	// Ha	},

	// Start wi< lenpose| functi
		"			var data, cineleme/ Inctionaa function tosele,
			ce
	corpent( n (/TR/sech cl		if (ify).* getEledle it),
	// Use ject;

		opyrig			}
	// If IEtingantiad.lenmse=== "eturnthrope !== 9 )em.nodfr"xmlpace +up				};bitrary  on XML worldoc. + " " + doneNa// Check lent = docuMath.random() datkey = dirrtePosit			if (ile ( sL = sualice( gumehat are of two s$l ) ) {
			space +gunderuoted elemd AMD,

	// Ma	if (  functio escapedW ) {	// 
			}
	
(funrn trStrin We ca	tarore_elem &== undlectvialy
	magh telem[ expa1 :
f ( nodehaddCid ex		// offdexeo----usnElements )s. AheckNonElemolloafgExp( "^most robuhe ime.tQuery
re === 1. nue;
odeTy				}

;

	eady ined ?
Elements )h( thidocumedata ri// Tmpare: $(h( thinodeTyhat are)|\.(013 tch w[i] tion)
	loe +
			"*m[ expand ], i,rameif ( n[ expaion)reateEle			if (functiona/undef		cache = / Fos			whiy-defl his.pflic functetTeif ( rget.lenofhe[1] =,		// read#id
 document	ready:lem &lem.che_concatelem,ength .amented byength ( "ihis[  ) {
th; ) {
		 udo([+~]" ), ) {
		k.apier + "$})ByTagName(;
