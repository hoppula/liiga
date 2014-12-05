(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hoppula/repos/liiga_frontend/client.coffee":[function(require,module,exports){
var FastClick, React, app, appContainer, cerebellum, options;

React = require('react/addons');

cerebellum = require('cerebellum');

FastClick = require('fastclick');

options = require('./options');

appContainer = document.getElementById(options.appId);

options.render = function(options) {
  if (options == null) {
    options = {};
  }
  document.getElementsByTagName("title")[0].innerHTML = "Liiga.pw - " + options.title;
  return React.render(options.component, appContainer);
};

options.initialize = function(client) {
  return FastClick.attach(document.body);
};

app = cerebellum.client(options);



},{"./options":"/Users/hoppula/repos/liiga_frontend/options.coffee","cerebellum":"cerebellum","fastclick":"/Users/hoppula/repos/liiga_frontend/node_modules/fastclick/lib/fastclick.js","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee":[function(require,module,exports){
module.exports = {
  url: "http://api.liiga.pw"
};



},{}],"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee":[function(require,module,exports){
var Teams;

Teams = {
  namesAndIds: {
    "Ässät": "assat",
    "Blues": "blues",
    "HIFK": "hifk",
    "HPK": "hpk",
    "Ilves": "ilves",
    "Sport": "sport",
    "JYP": "jyp",
    "KalPa": "kalpa",
    "Kärpät": "karpat",
    "Lukko": "lukko",
    "Pelicans": "pelicans",
    "SaiPa": "saipa",
    "Tappara": "tappara",
    "TPS": "tps"
  },
  logo: function(name) {
    return "/svg/" + this.namesAndIds[name] + ".svg";
  },
  idToName: function(id) {
    var ids;
    ids = Object.keys(this.namesAndIds).reduce((function(_this) {
      return function(obj, name) {
        obj[_this.namesAndIds[name]] = name;
        return obj;
      };
    })(this), {});
    return ids[id];
  },
  nameToId: function(name) {
    return this.namesAndIds[name];
  }
};

module.exports = Teams;



},{}],"/Users/hoppula/repos/liiga_frontend/node_modules/fastclick/lib/fastclick.js":[function(require,module,exports){
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.3
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specified layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
function FastClick(layer, options) {
	'use strict';
	var oldOnClick;

	options = options || {};

	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = options.touchBoundary || 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	/**
	 * The minimum time between tap(touchstart and touchend) events
	 *
	 * @type number
	 */
	this.tapDelay = options.tapDelay || 200;

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Some old versions of Android don't have Function.prototype.bind
	function bind(method, context) {
		return function() { return method.apply(context, arguments); };
	}


	var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
	var context = this;
	for (var i = 0, l = methods.length; i < l; i++) {
		context[methods[i]] = bind(context[methods[i]], context);
	}

	// Set up event handlers as required
	if (deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);

/**
 * BlackBerry requires exceptions.
 *
 * @type boolean
 */
var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
			// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
			// random integers, it's safe to to continue if the identifier is 0 here.
			if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);
		this.sendClick(targetElement, event);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
		if (!deviceIsIOS || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (deviceIsIOS && !deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;
	var blackberryVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	if (deviceIsBlackBerry10) {
		blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

		// BlackBerry 10.3+ does not require Fastclick library.
		// https://github.com/ftlabs/fastclick/issues/251
		if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// user-scalable=no eliminates click delay.
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// width=device-width (or less than device-width) eliminates click delay.
				if (document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
FastClick.attach = function(layer, options) {
	'use strict';
	return new FastClick(layer, options);
};


if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}

},{}],"/Users/hoppula/repos/liiga_frontend/options.coffee":[function(require,module,exports){
(function (__dirname){
var routes, stores;

stores = require('./stores');

routes = require('./routes');

module.exports = {
  staticFiles: __dirname + "/public",
  storeId: "store_state_from_server",
  appId: "app",
  routes: routes,
  stores: stores
};



}).call(this,"/")
},{"./routes":"/Users/hoppula/repos/liiga_frontend/routes.coffee","./stores":"/Users/hoppula/repos/liiga_frontend/stores.coffee"}],"/Users/hoppula/repos/liiga_frontend/routes.coffee":[function(require,module,exports){
var GameView, IndexView, PlayerView, Q, React, ScheduleView, StandingsView, StatsView, TeamView;

Q = require('q');

React = require('react/addons');

IndexView = require('./views/index');

TeamView = require('./views/team');

PlayerView = require('./views/player');

GameView = require('./views/game');

ScheduleView = require('./views/schedule');

StandingsView = require('./views/standings');

StatsView = require('./views/stats');

module.exports = {
  "/": function() {
    return Q.spread([this.store.fetch("standings"), this.store.fetch("schedule"), this.store.fetch("teams")], function(standings, schedule, teamsList) {
      return {
        title: "Etusivu",
        component: React.createElement(IndexView, {
          standings: standings,
          teams: teamsList,
          schedule: schedule
        })
      };
    });
  },
  "/joukkueet/:id/:active?": function(id, active) {
    return Q.spread([
      this.store.fetch("standings"), this.store.fetch("team", {
        id: id
      })
    ], function(standings, team) {
      var subTitle;
      subTitle = (function() {
        switch (active) {
          case "pelaajat":
            return "Pelaajat";
          case "tilastot":
            return "Tilastot";
          default:
            return "Otteluohjelma";
        }
      })();
      return {
        title: "Joukkueet - " + team.info.name + " - " + subTitle,
        component: React.createElement(TeamView, {
          id: id,
          standings: standings,
          team: team,
          active: active
        })
      };
    });
  },
  "/joukkueet/:id/:pid/:slug": function(id, pid, slug) {
    return this.store.fetch("team", {
      id: id
    }).then(function(team) {
      var player;
      player = team.roster.filter(function(player) {
        return player.id === ("" + pid + "/" + slug);
      })[0];
      return {
        title: "Pelaajat - " + player.firstName + " " + player.lastName,
        component: React.createElement(PlayerView, {
          id: pid,
          player: player,
          team: team
        })
      };
    });
  },
  "/ottelut": function() {
    return this.store.fetch("schedule").then(function(schedule) {
      return {
        title: "Otteluohjelma",
        component: React.createElement(ScheduleView, {
          schedule: schedule
        })
      };
    });
  },
  "/ottelut/:id/:active?/:away?": function(id, active, away) {
    return Q.spread([
      this.store.fetch("schedule"), this.store.fetch("gameEvents", {
        id: id
      }), this.store.fetch("gameLineups", {
        id: id
      }), this.store.fetch("gameStats", {
        id: id
      })
    ], function(schedule, events, lineUps, stats) {
      var game;
      game = schedule.filter(function(g) {
        return g.id === id;
      })[0];
      return {
        title: "Ottelu - " + game.home + " vs " + game.away,
        component: React.createElement(GameView, {
          id: id,
          game: game,
          events: events,
          lineUps: lineUps,
          stats: stats,
          active: active,
          away: !!away
        })
      };
    });
  },
  "/sarjataulukko": function() {
    return this.store.fetch("standings").then(function(standings) {
      return {
        title: "Sarjataulukko",
        component: React.createElement(StandingsView, {
          standings: standings
        })
      };
    });
  },
  "/tilastot/:active?": function(active) {
    return this.store.fetch("stats").then(function(stats) {
      return {
        title: "Tilastot",
        component: React.createElement(StatsView, {
          stats: stats,
          active: active
        })
      };
    });
  }
};



},{"./views/game":"/Users/hoppula/repos/liiga_frontend/views/game.coffee","./views/index":"/Users/hoppula/repos/liiga_frontend/views/index.coffee","./views/player":"/Users/hoppula/repos/liiga_frontend/views/player.coffee","./views/schedule":"/Users/hoppula/repos/liiga_frontend/views/schedule.coffee","./views/standings":"/Users/hoppula/repos/liiga_frontend/views/standings.coffee","./views/stats":"/Users/hoppula/repos/liiga_frontend/views/stats.coffee","./views/team":"/Users/hoppula/repos/liiga_frontend/views/team.coffee","q":"q","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/stores.coffee":[function(require,module,exports){
var GameEventsModel, GameLineupsModel, GameStatsModel, ScheduleCollection, StandingsCollection, StatsModel, TeamModel, TeamsCollection;

TeamsCollection = require('./stores/teams');

ScheduleCollection = require('./stores/schedule');

StandingsCollection = require('./stores/standings');

StatsModel = require('./stores/stats');

TeamModel = require('./stores/team');

GameEventsModel = require('./stores/game_events');

GameLineupsModel = require('./stores/game_lineups');

GameStatsModel = require('./stores/game_stats');

module.exports = {
  teams: TeamsCollection,
  schedule: ScheduleCollection,
  standings: StandingsCollection,
  stats: StatsModel,
  team: TeamModel,
  gameEvents: GameEventsModel,
  gameLineups: GameLineupsModel,
  gameStats: GameStatsModel
};



},{"./stores/game_events":"/Users/hoppula/repos/liiga_frontend/stores/game_events.coffee","./stores/game_lineups":"/Users/hoppula/repos/liiga_frontend/stores/game_lineups.coffee","./stores/game_stats":"/Users/hoppula/repos/liiga_frontend/stores/game_stats.coffee","./stores/schedule":"/Users/hoppula/repos/liiga_frontend/stores/schedule.coffee","./stores/standings":"/Users/hoppula/repos/liiga_frontend/stores/standings.coffee","./stores/stats":"/Users/hoppula/repos/liiga_frontend/stores/stats.coffee","./stores/team":"/Users/hoppula/repos/liiga_frontend/stores/team.coffee","./stores/teams":"/Users/hoppula/repos/liiga_frontend/stores/teams.coffee"}],"/Users/hoppula/repos/liiga_frontend/stores/game_events.coffee":[function(require,module,exports){
var GameEvents, Model, apiConfig;

Model = require('cerebellum').Model;

apiConfig = require('../config/api');

GameEvents = Model.extend({
  cacheKey: function() {
    return "games/events/" + this.storeOptions.id;
  },
  url: function() {
    return "" + apiConfig.url + "/games/events/" + this.storeOptions.id + ".json";
  }
});

module.exports = GameEvents;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/game_lineups.coffee":[function(require,module,exports){
var GameLineups, Model, apiConfig;

Model = require('cerebellum').Model;

apiConfig = require('../config/api');

GameLineups = Model.extend({
  cacheKey: function() {
    return "games/lineups/" + this.storeOptions.id;
  },
  url: function() {
    return "" + apiConfig.url + "/games/lineups/" + this.storeOptions.id + ".json";
  }
});

module.exports = GameLineups;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/game_stats.coffee":[function(require,module,exports){
var GameStats, Model, apiConfig;

Model = require('cerebellum').Model;

apiConfig = require('../config/api');

GameStats = Model.extend({
  cacheKey: function() {
    return "games/stats/" + this.storeOptions.id;
  },
  url: function() {
    return "" + apiConfig.url + "/games/stats/" + this.storeOptions.id + ".json";
  }
});

module.exports = GameStats;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/schedule.coffee":[function(require,module,exports){
var Collection, Schedule, apiConfig;

Collection = require('cerebellum').Collection;

apiConfig = require('../config/api');

Schedule = Collection.extend({
  cacheKey: function() {
    return "schedule";
  },
  url: "" + apiConfig.url + "/schedule.json"
});

module.exports = Schedule;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/standings.coffee":[function(require,module,exports){
var Collection, Standings, apiConfig;

Collection = require('cerebellum').Collection;

apiConfig = require('../config/api');

Standings = Collection.extend({
  cacheKey: function() {
    return "standings";
  },
  url: "" + apiConfig.url + "/standings.json"
});

module.exports = Standings;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/stats.coffee":[function(require,module,exports){
var Model, Stats, apiConfig;

Model = require('cerebellum').Model;

apiConfig = require('../config/api');

Stats = Model.extend({
  cacheKey: function() {
    return "stats";
  },
  url: "" + apiConfig.url + "/stats.json"
});

module.exports = Stats;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/team.coffee":[function(require,module,exports){
var Model, Team, apiConfig;

Model = require('cerebellum').Model;

apiConfig = require('../config/api');

Team = Model.extend({
  cacheKey: function() {
    return "teams/" + this.storeOptions.id;
  },
  url: function() {
    return "" + apiConfig.url + "/teams/" + this.storeOptions.id + ".json";
  }
});

module.exports = Team;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/teams.coffee":[function(require,module,exports){
var Collection, Teams, apiConfig;

Collection = require('cerebellum').Collection;

apiConfig = require('../config/api');

Teams = Collection.extend({
  cacheKey: function() {
    return "teams";
  },
  url: "" + apiConfig.url + "/teams.json"
});

module.exports = Teams;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/views/game.coffee":[function(require,module,exports){
var Col, Game, GameEvents, GameLineups, GameStats, Nav, NavItem, Navigation, React, Row, TabPane, Teams, moment, _ref;

React = require('react/addons');

moment = require('moment');

Navigation = require('./navigation');

_ref = require('react-bootstrap'), Row = _ref.Row, Col = _ref.Col, Nav = _ref.Nav, NavItem = _ref.NavItem, TabPane = _ref.TabPane;

Teams = require('../lib/teams');

GameEvents = require('./game_events');

GameLineups = require('./game_lineups');

GameStats = require('./game_stats');

Game = React.createClass({
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  logo: function(teamName) {
    return React.createElement("img", {
      "src": Teams.logo(teamName),
      "alt": teamName
    });
  },
  render: function() {
    var activeKey, game, hours, minutes, _ref1;
    activeKey = (function() {
      switch (this.props.active) {
        case "tilastot":
          return "stats";
        case "ketjut":
          return "lineUps";
        default:
          return "events";
      }
    }).call(this);
    game = this.props.game;
    _ref1 = game.time.split(":"), hours = _ref1[0], minutes = _ref1[1];
    return React.createElement("div", {
      "className": "game"
    }, React.createElement(Navigation, null), React.createElement(Row, null, React.createElement(Col, {
      "className": "home",
      "xs": 4.,
      "md": 4.
    }, React.createElement("h1", null, game.home), this.logo(game.home)), React.createElement(Col, {
      "className": "score",
      "xs": 4.,
      "md": 4.
    }, React.createElement("h1", null, game.homeScore, " - ", game.awayScore), React.createElement("ul", null, React.createElement("li", null, moment(game.date).add(hours, 'hours').add(minutes, 'minutes').format("DD.MM.YYYY HH:mm")), React.createElement("li", null, "Yleis\u00f6\u00e4: ", game.attendance))), React.createElement(Col, {
      "className": "away",
      "xs": 4.,
      "md": 4.
    }, React.createElement("h1", null, game.away), this.logo(game.away))), React.createElement(Nav, {
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, React.createElement(NavItem, {
      "href": "/ottelut/" + this.props.id,
      "eventKey": "events"
    }, "Tapahtumat"), React.createElement(NavItem, {
      "href": "/ottelut/" + this.props.id + "/tilastot",
      "eventKey": "stats"
    }, "Tilastot"), React.createElement(NavItem, {
      "href": "/ottelut/" + this.props.id + "/ketjut",
      "eventKey": "lineUps"
    }, "Ketjut")), React.createElement("div", {
      "className": "tab-content",
      "ref": "panes"
    }, React.createElement(TabPane, {
      "key": "events",
      "animation": false,
      "active": activeKey === "events"
    }, React.createElement(GameEvents, {
      "events": this.props.events,
      "game": this.props.game
    })), React.createElement(TabPane, {
      "key": "stats",
      "animation": false,
      "active": activeKey === "stats"
    }, React.createElement(GameStats, {
      "id": this.props.id,
      "stats": this.props.stats,
      "away": this.props.away
    })), React.createElement(TabPane, {
      "key": "lineUps",
      "animation": false,
      "active": activeKey === "lineUps"
    }, React.createElement(GameLineups, {
      "id": this.props.id,
      "lineUps": this.props.lineUps
    }))));
  }
});

module.exports = Game;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","./game_events":"/Users/hoppula/repos/liiga_frontend/views/game_events.coffee","./game_lineups":"/Users/hoppula/repos/liiga_frontend/views/game_lineups.coffee","./game_stats":"/Users/hoppula/repos/liiga_frontend/views/game_stats.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","moment":"moment","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/game_events.coffee":[function(require,module,exports){
var GameEvents, React, _;

React = require('react/addons');

_ = require('lodash');

GameEvents = React.createClass({
  event: function(event, i) {
    var away, home;
    if (event.header) {
      return React.createElement("tr", {
        "key": event.header
      }, React.createElement("th", {
        "colSpan": "3"
      }, event.header));
    } else if (event.team && event.time) {
      return React.createElement("tr", {
        "key": i
      }, React.createElement("td", null, this.props.game[event.team]), React.createElement("td", null, event.time), React.createElement("td", null, event.text));
    } else if (event.team && !event.time) {
      home = event.team === "home" ? event.text : "";
      away = event.team === "away" ? event.text : "";
      return React.createElement("tr", {
        "key": i
      }, React.createElement("td", null, home), React.createElement("td", null), React.createElement("td", null, away));
    } else {
      return React.createElement("tr", {
        "key": i
      }, React.createElement("td", null, event.home), React.createElement("td", null, event.time), React.createElement("td", null, event.away));
    }
  },
  render: function() {
    var otherEvents, periodEvents;
    periodEvents = Object.keys(_.pick(this.props.events, "1. erä", "2. erä", "3. erä")).reduce((function(_this) {
      return function(arr, key) {
        arr.push({
          header: key
        });
        arr = arr.concat(_this.props.events[key]);
        return arr;
      };
    })(this), []);
    otherEvents = Object.keys(_.omit(this.props.events, "1. erä", "2. erä", "3. erä")).reduce((function(_this) {
      return function(arr, key) {
        arr.push({
          header: key
        });
        arr = arr.concat(_this.props.events[key]);
        return arr;
      };
    })(this), []);
    return React.createElement("div", null, React.createElement("table", {
      "className": "table table-striped game-events"
    }, periodEvents.map((function(_this) {
      return function(event, i) {
        return _this.event(event, i);
      };
    })(this))), React.createElement("table", {
      "className": "table table-striped game-events other-events"
    }, otherEvents.map((function(_this) {
      return function(event, i) {
        return _this.event(event, i);
      };
    })(this))));
  }
});

module.exports = GameEvents;



},{"lodash":"lodash","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/game_lineups.coffee":[function(require,module,exports){
var Col, GameLineups, Grid, OverlayTrigger, React, Row, Teams, Tooltip, _ref;

React = require('react/addons');

_ref = require('react-bootstrap'), Row = _ref.Row, Col = _ref.Col, Grid = _ref.Grid, OverlayTrigger = _ref.OverlayTrigger, Tooltip = _ref.Tooltip;

Teams = require('../lib/teams');

GameLineups = React.createClass({
  lineTitle: function(i) {
    var title;
    title = i < 4 ? "Kenttä " + (i + 1) : "Maalivahdit";
    return React.createElement(Col, {
      "xs": 12.
    }, React.createElement("h2", null, title));
  },
  column: function(type, player, teamId) {
    var columnSize, content;
    columnSize = type === "forward" ? 2 : 3;
    content = player ? React.createElement(OverlayTrigger, {
      "placement": "top",
      "overlay": this.tooltip(player)
    }, React.createElement("div", {
      "className": "player " + teamId
    }, React.createElement("a", {
      "href": "/joukkueet/" + teamId + "/" + player.id
    }, "#", player.number))) : "";
    return React.createElement(Col, {
      "xs": columnSize
    }, content);
  },
  tooltip: function(player) {
    return React.createElement(Tooltip, null, React.createElement("strong", null, (player != null ? player.name : void 0)));
  },
  render: function() {
    var awayTeam, homeTeam, lines;
    homeTeam = Teams.nameToId(this.props.lineUps.home.team);
    awayTeam = Teams.nameToId(this.props.lineUps.away.team);
    lines = this.props.lineUps.home.lines.map((function(_this) {
      return function(line, i) {
        var awayLine;
        awayLine = _this.props.lineUps.away.lines[i];
        return React.createElement(Grid, {
          "key": "line" + i
        }, React.createElement(Row, null, _this.lineTitle(i)), React.createElement(Row, null, _this.column("forward", line.forwards[0], homeTeam), _this.column("forward", line.forwards[1], homeTeam), _this.column("forward", line.forwards[2], homeTeam), _this.column("forward", awayLine.forwards[0], awayTeam), _this.column("forward", awayLine.forwards[1], awayTeam), _this.column("forward", awayLine.forwards[2], awayTeam)), React.createElement(Row, {
          "className": "defenders"
        }, _this.column("defender", line.defenders[0], homeTeam), _this.column("defender", line.defenders[1], homeTeam), _this.column("defender", awayLine.defenders[0], awayTeam), _this.column("defender", awayLine.defenders[1], awayTeam)), React.createElement(Row, {
          "className": "goalies"
        }, _this.column("goalie", line.goalies[0], homeTeam), _this.column("goalie", line.goalies[1], homeTeam), _this.column("goalie", awayLine.goalies[0], awayTeam), _this.column("goalie", awayLine.goalies[1], awayTeam)));
      };
    })(this));
    return React.createElement("div", {
      "className": "game-lineups"
    }, lines);
  }
});

module.exports = GameLineups;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/game_stats.coffee":[function(require,module,exports){
var GameStats, GoalieStats, Nav, NavItem, PlayerStats, React, TabPane, Teams, _ref;

React = require('react/addons');

_ref = require('react-bootstrap'), Nav = _ref.Nav, NavItem = _ref.NavItem, TabPane = _ref.TabPane;

Teams = require('../lib/teams');

PlayerStats = require('./player_stats');

GoalieStats = require('./goalie_stats');

GameStats = React.createClass({
  render: function() {
    var activeKey, awayId, homeId;
    homeId = Teams.nameToId(this.props.stats.home.team);
    awayId = Teams.nameToId(this.props.stats.away.team);
    activeKey = this.props.away ? "away" : "home";
    return React.createElement("div", {
      "className": "game-stats"
    }, React.createElement(Nav, {
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, React.createElement(NavItem, {
      "href": "/ottelut/" + this.props.id + "/tilastot",
      "eventKey": "home"
    }, this.props.stats.home.team), React.createElement(NavItem, {
      "href": "/ottelut/" + this.props.id + "/tilastot/vieras",
      "eventKey": "away"
    }, this.props.stats.away.team)), React.createElement("div", {
      "className": "tab-content",
      "ref": "panes"
    }, React.createElement(TabPane, {
      "key": "home",
      "animation": false,
      "active": activeKey === "home"
    }, React.createElement(PlayerStats, {
      "teamId": homeId,
      "stats": this.props.stats.home.players
    }), React.createElement(GoalieStats, {
      "teamId": homeId,
      "stats": this.props.stats.home.goalies,
      "playedAtLeast": 0.
    })), React.createElement(TabPane, {
      "key": "away",
      "animation": false,
      "active": activeKey === "away"
    }, React.createElement(PlayerStats, {
      "teamId": awayId,
      "stats": this.props.stats.away.players
    }), React.createElement(GoalieStats, {
      "teamId": awayId,
      "stats": this.props.stats.away.goalies,
      "playedAtLeast": 0.
    }))));
  }
});

module.exports = GameStats;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","./goalie_stats":"/Users/hoppula/repos/liiga_frontend/views/goalie_stats.coffee","./player_stats":"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/goalie_stats.coffee":[function(require,module,exports){
var GoalieStats, React, TableSortMixin, _;

React = require('react/addons');

_ = require('lodash');

TableSortMixin = require('./mixins/table_sort');

GoalieStats = React.createClass({
  mixins: [TableSortMixin],
  getInitialState: function() {
    return {
      sortField: "savingPercentage",
      sortDirection: "desc",
      sortType: "float"
    };
  },
  render: function() {
    var goalies, maxGames, playedAtLeast;
    maxGames = _.max(this.props.stats, function(player) {
      return parseInt(player.games);
    }).games;
    playedAtLeast = typeof this.props.playedAtLeast === "number" ? parseInt((this.props.playedAtLeast / 100) * maxGames) : 1;
    goalies = this.props.stats.sort(this.sort).filter(function(player) {
      if (player.games) {
        return player.games >= playedAtLeast;
      } else {
        return true;
      }
    }).map((function(_this) {
      return function(player) {
        var teamId;
        teamId = _this.props.teamId || player.teamId;
        return React.createElement("tr", {
          "key": player.id
        }, React.createElement("td", null, React.createElement("a", {
          "href": "/joukkueet/" + teamId + "/" + player.id
        }, player.firstName, " ", player.lastName)), React.createElement("td", null, player.games), React.createElement("td", null, player.wins), React.createElement("td", null, player.ties), React.createElement("td", null, player.losses), React.createElement("td", null, player.saves), React.createElement("td", null, player.goalsAllowed), React.createElement("td", null, player.shutouts), React.createElement("td", null, player.goalsAverage), React.createElement("td", null, player.savingPercentage), React.createElement("td", null, player.goals), React.createElement("td", null, player.assists), React.createElement("td", null, player.points), React.createElement("td", null, player.penalties), React.createElement("td", null, player.winPercentage), React.createElement("td", {
          "colSpan": 2
        }, player.minutes));
      };
    })(this));
    return React.createElement("table", {
      "className": "table table-striped team-roster"
    }, React.createElement("thead", {
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.createElement("tr", null, React.createElement("th", {
      "data-sort": "lastName",
      "data-type": "string"
    }, "Nimi"), React.createElement("th", {
      "data-sort": "games",
      "data-type": "integer"
    }, "PO"), React.createElement("th", {
      "data-sort": "wins",
      "data-type": "integer"
    }, "V"), React.createElement("th", {
      "data-sort": "ties",
      "data-type": "integer"
    }, "T"), React.createElement("th", {
      "data-sort": "losses",
      "data-type": "integer"
    }, "H"), React.createElement("th", {
      "data-sort": "saves",
      "data-type": "integer"
    }, "TO"), React.createElement("th", {
      "data-sort": "goalsAllowed",
      "data-type": "integer"
    }, "PM"), React.createElement("th", {
      "data-sort": "shutouts",
      "data-type": "integer"
    }, "NP"), React.createElement("th", {
      "data-sort": "goalsAverage",
      "data-type": "float"
    }, "KA"), React.createElement("th", {
      "data-sort": "savingPercentage",
      "data-type": "float"
    }, "T%"), React.createElement("th", {
      "data-sort": "goals",
      "data-type": "integer"
    }, "M"), React.createElement("th", {
      "data-sort": "assists",
      "data-type": "integer"
    }, "S"), React.createElement("th", {
      "data-sort": "points",
      "data-type": "integer"
    }, "P"), React.createElement("th", {
      "data-sort": "penalties"
    }, "R"), React.createElement("th", {
      "data-sort": "winPercentage",
      "data-type": "float"
    }, "V%"), React.createElement("th", {
      "data-sort": "minutes",
      "data-type": "float",
      "colSpan": 2
    }, "Aika"))), React.createElement("tbody", null, goalies));
  }
});

module.exports = GoalieStats;



},{"./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","lodash":"lodash","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/index.coffee":[function(require,module,exports){
var Col, Grid, Index, Navigation, React, RecentSchedule, Row, StandingsTable, TeamsList, _ref;

React = require('react/addons');

Navigation = require('./navigation');

TeamsList = require('./teams_list');

StandingsTable = require('./standings_table');

RecentSchedule = require('./recent_schedule');

_ref = require('react-bootstrap'), Grid = _ref.Grid, Row = _ref.Row, Col = _ref.Col;

Index = React.createClass({
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  render: function() {
    return React.createElement("div", null, React.createElement(Navigation, null), React.createElement("div", {
      "className": "jumbotron front-jumbo"
    }, React.createElement("h1", null, "LiigaOpas"), React.createElement("p", null, "SM-Liigan tilastot nopeasti ja vaivattomasti")), React.createElement(TeamsList, {
      "teams": this.props.teams
    }), React.createElement(Grid, null, React.createElement(Row, null, React.createElement(Col, {
      "xs": 12.,
      "sm": 6.
    }, React.createElement("h3", null, "Ottelut"), React.createElement(RecentSchedule, {
      "schedule": this.props.schedule
    })), React.createElement(Col, {
      "xs": 12.,
      "sm": 6.
    }, React.createElement("h3", null, "Sarjataulukko"), React.createElement("div", {
      "className": "standings standings-front table-responsive"
    }, React.createElement(StandingsTable, {
      "standings": this.props.standings
    }))))));
  }
});

module.exports = Index;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./recent_schedule":"/Users/hoppula/repos/liiga_frontend/views/recent_schedule.coffee","./standings_table":"/Users/hoppula/repos/liiga_frontend/views/standings_table.coffee","./teams_list":"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee":[function(require,module,exports){
var TableSortMixin;

TableSortMixin = {
  setSort: function(event) {
    var newSort, sort, type;
    sort = event.target.dataset.sort;
    if (sort) {
      type = event.target.dataset.type || "integer";
      if (this.state.sortField === sort) {
        newSort = this.state.sortDirection === "desc" ? "asc" : "desc";
        return this.setState({
          sortDirection: newSort,
          sortType: type
        });
      } else {
        return this.setState({
          sortField: sort,
          sortType: type
        });
      }
    }
  },
  sort: function(a, b) {
    var aValue, bValue;
    switch (this.state.sortType) {
      case "integer":
        if (this.state.sortDirection === "desc") {
          return (parseInt(b[this.state.sortField]) || 0) - (parseInt(a[this.state.sortField]) || 0);
        } else {
          return (parseInt(a[this.state.sortField]) || 0) - (parseInt(b[this.state.sortField]) || 0);
        }
        break;
      case "float":
        aValue = Number(a[this.state.sortField].replace("%", "").replace(/\,|\:/, ".")) || 0;
        bValue = Number(b[this.state.sortField].replace("%", "").replace(/\,|\:/, ".")) || 0;
        if (this.state.sortDirection === "desc") {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
        break;
      case "string":
        if (this.state.sortDirection === "desc") {
          if (b[this.state.sortField] < a[this.state.sortField]) {
            return -1;
          } else if (b[this.state.sortField] > a[this.state.sortField]) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a[this.state.sortField] < b[this.state.sortField]) {
            return -1;
          } else if (a[this.state.sortField] > b[this.state.sortField]) {
            return 1;
          } else {
            return 0;
          }
        }
    }
  }
};

module.exports = TableSortMixin;



},{}],"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee":[function(require,module,exports){
var DropdownButton, MenuItem, Nav, NavItem, Navbar, Navigation, React, Teams, _ref;

React = require('react/addons');

_ref = require("react-bootstrap"), Navbar = _ref.Navbar, Nav = _ref.Nav, NavItem = _ref.NavItem, DropdownButton = _ref.DropdownButton, MenuItem = _ref.MenuItem;

Teams = require('../lib/teams');

Navigation = React.createClass({
  render: function() {
    var brand, dropdown, item, teams;
    brand = React.createElement("a", {
      "href": "/",
      "className": "navbar-brand"
    }, "LiigaOpas");
    teams = null;
    if (this.props.item) {
      item = React.createElement(NavItem, {
        "href": this.props.item.url
      }, this.props.item.title);
    }
    if (this.props.dropdown) {
      dropdown = React.createElement(DropdownButton, {
        "title": this.props.dropdown.title
      }, this.props.dropdown.items.map(function(item) {
        return React.createElement(MenuItem, {
          "key": item.title,
          "href": item.url
        }, item.title);
      }));
    }
    return React.createElement(Navbar, {
      "brand": brand,
      "fixedTop": true,
      "toggleNavKey": 0.
    }, React.createElement(Nav, {
      "className": "bs-navbar-collapse",
      "eventKey": 0.,
      "role": "navigation"
    }, React.createElement(NavItem, {
      "href": "/sarjataulukko"
    }, "Sarjataulukko"), React.createElement(NavItem, {
      "href": "/tilastot"
    }, "Tilastot"), React.createElement(NavItem, {
      "href": "/ottelut"
    }, "Ottelut"), teams, item, dropdown));
  }
});

module.exports = Navigation;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player.coffee":[function(require,module,exports){
var Navigation, Player, React, moment;

React = require('react/addons');

moment = require('moment');

Navigation = require('./navigation');

Player = React.createClass({
  render: function() {
    var birthday, item, player, players, position, shoots, stats, statsTable, statsType, team;
    player = this.props.player;
    team = this.props.team;
    item = {
      title: team.info.name,
      url: team.info.url
    };
    players = {
      title: "Pelaajat",
      items: team.roster.map((function(_this) {
        return function(player) {
          return {
            title: "" + player.firstName + " " + player.lastName,
            url: "/joukkueet/" + team.info.id + "/" + player.id
          };
        };
      })(this))
    };
    statsType = player.position === "MV" ? "goalies" : "players";
    stats = team.stats[statsType].filter((function(_this) {
      return function(player) {
        var id, slug, _ref;
        _ref = player.id.split("/"), id = _ref[0], slug = _ref[1];
        return id === _this.props.id;
      };
    })(this))[0] || {};
    position = (function() {
      switch (player.position) {
        case "OL":
          return "Oikea laitahyökkääjä";
        case "VL":
          return "Vasen laitahyökkääjä";
        case "KH":
          return "Keskushyökkääjä";
        case "VP":
          return "Vasen puolustaja";
        case "OP":
          return "Oikea puolustaja";
        case "MV":
          return "Maalivahti";
      }
    })();
    birthday = moment(player.birthday);
    shoots = player.shoots === "L" ? "Vasemmalta" : "Oikealta";
    statsTable = (function() {
      switch (statsType) {
        case "goalies":
          return React.createElement("table", {
            "className": "table"
          }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "PO"), React.createElement("th", null, "V"), React.createElement("th", null, "T"), React.createElement("th", null, "H"), React.createElement("th", null, "TO"), React.createElement("th", null, "PM"), React.createElement("th", null, "NP"), React.createElement("th", null, "KA"), React.createElement("th", null, "T%"), React.createElement("th", null, "M"), React.createElement("th", null, "S"), React.createElement("th", null, "P"), React.createElement("th", null, "R"), React.createElement("th", null, "V%"), React.createElement("th", null, "Aika"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, stats.games), React.createElement("td", null, stats.wins), React.createElement("td", null, stats.ties), React.createElement("td", null, stats.losses), React.createElement("td", null, stats.saves), React.createElement("td", null, stats.goalsAllowed), React.createElement("td", null, stats.shutouts), React.createElement("td", null, stats.goalsAverage), React.createElement("td", null, stats.savingPercentage), React.createElement("td", null, stats.goals), React.createElement("td", null, stats.assists), React.createElement("td", null, stats.points), React.createElement("td", null, stats.penalties), React.createElement("td", null, stats.winPercentage), React.createElement("td", null, stats.minutes))));
        case "players":
          return React.createElement("table", {
            "className": "table"
          }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "O"), React.createElement("th", null, "M"), React.createElement("th", null, "S"), React.createElement("th", null, "P"), React.createElement("th", null, "R"), React.createElement("th", null, "+\x2F-"), React.createElement("th", null, "+"), React.createElement("th", null, "-"), React.createElement("th", null, "YVM"), React.createElement("th", null, "AVM"), React.createElement("th", null, "VM"), React.createElement("th", null, "L"), React.createElement("th", null, "L%"), React.createElement("th", null, "A"), React.createElement("th", null, "A%"), React.createElement("th", null, "Aika"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, stats.games), React.createElement("td", null, stats.goals), React.createElement("td", null, stats.assists), React.createElement("td", null, stats.points), React.createElement("td", null, stats.penalties), React.createElement("td", null, stats.plusMinus), React.createElement("td", null, stats.plusses), React.createElement("td", null, stats.minuses), React.createElement("td", null, stats.powerPlayGoals), React.createElement("td", null, stats.shortHandedGoals), React.createElement("td", null, stats.winningGoals), React.createElement("td", null, stats.shots), React.createElement("td", null, stats.shootingPercentage), React.createElement("td", null, stats.faceoffs), React.createElement("td", null, stats.faceoffPercentage), React.createElement("td", null, stats.playingTimeAverage))));
      }
    })();
    return React.createElement("div", {
      "className": "player"
    }, React.createElement(Navigation, {
      "dropdown": players,
      "item": item
    }), React.createElement("h1", null, player.firstName, " ", player.lastName), React.createElement("h2", null, React.createElement("a", {
      "className": "team-logo " + team.info.id,
      "href": "/joukkueet/" + team.info.id
    }), " #", player.number), React.createElement("div", null, React.createElement("strong", null, "Pelipaikka"), " ", position), React.createElement("div", null, React.createElement("strong", null, "Syntynyt"), " ", birthday.format("DD.MM.YYYY"), " (", moment().diff(player.birthday, "years"), " vuotias)"), React.createElement("div", null, React.createElement("strong", null, "Pituus"), " ", player.height, " cm"), React.createElement("div", null, React.createElement("strong", null, "Paino"), " ", player.weight, " kg"), React.createElement("div", null, React.createElement("strong", null, "Laukoo"), " ", shoots), React.createElement("div", {
      "className": "table-responsive"
    }, statsTable));
  }
});

module.exports = Player;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee":[function(require,module,exports){
var PlayerStats, React, TableSortMixin;

React = require('react/addons');

TableSortMixin = require('./mixins/table_sort');

PlayerStats = React.createClass({
  mixins: [TableSortMixin],
  getInitialState: function() {
    return {
      sortField: "points",
      sortDirection: "desc",
      sortType: "integer"
    };
  },
  render: function() {
    var limit, players;
    limit = this.props.limit ? this.props.limit : this.props.stats.length;
    players = this.props.stats.sort(this.sort).slice(0, limit).map((function(_this) {
      return function(player) {
        var teamId;
        teamId = _this.props.teamId || player.teamId;
        return React.createElement("tr", {
          "key": player.id
        }, React.createElement("td", null, React.createElement("a", {
          "href": "/joukkueet/" + teamId + "/" + player.id
        }, player.firstName, " ", player.lastName)), React.createElement("td", null, player.games), React.createElement("td", null, player.goals), React.createElement("td", null, player.assists), React.createElement("td", null, player.points), React.createElement("td", null, player.penalties), React.createElement("td", null, player.plusMinus), React.createElement("td", null, player.plusses), React.createElement("td", null, player.minuses), React.createElement("td", null, player.powerPlayGoals), React.createElement("td", null, player.shortHandedGoals), React.createElement("td", null, player.winningGoals), React.createElement("td", null, player.shots), React.createElement("td", null, player.shootingPercentage), React.createElement("td", null, player.faceoffs), React.createElement("td", null, player.faceoffPercentage), React.createElement("td", null, player.playingTimeAverage));
      };
    })(this));
    return React.createElement("table", {
      "className": "table table-striped team-roster"
    }, React.createElement("thead", {
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.createElement("tr", null, React.createElement("th", {
      "data-sort": "lastName",
      "data-type": "string"
    }, "Nimi"), React.createElement("th", {
      "data-sort": "games",
      "data-type": "integer"
    }, "O"), React.createElement("th", {
      "data-sort": "goals",
      "data-type": "integer"
    }, "M"), React.createElement("th", {
      "data-sort": "assists",
      "data-type": "integer"
    }, "S"), React.createElement("th", {
      "data-sort": "points",
      "data-type": "integer"
    }, "P"), React.createElement("th", {
      "data-sort": "penalties",
      "data-type": "integer"
    }, "R"), React.createElement("th", {
      "data-sort": "plusMinus",
      "data-type": "integer"
    }, "+\x2F-"), React.createElement("th", {
      "data-sort": "plusses",
      "data-type": "integer"
    }, "+"), React.createElement("th", {
      "data-sort": "minuses",
      "data-type": "integer"
    }, "-"), React.createElement("th", {
      "data-sort": "powerPlayGoals",
      "data-type": "integer"
    }, "YVM"), React.createElement("th", {
      "data-sort": "shortHandedGoals",
      "data-type": "integer"
    }, "AVM"), React.createElement("th", {
      "data-sort": "winningGoals",
      "data-type": "integer"
    }, "VM"), React.createElement("th", {
      "data-sort": "shots",
      "data-type": "integer"
    }, "L"), React.createElement("th", {
      "data-sort": "shootingPercentage",
      "data-type": "float"
    }, "L%"), React.createElement("th", {
      "data-sort": "faceoffs",
      "data-type": "integer"
    }, "A"), React.createElement("th", {
      "data-sort": "faceoffPercentage",
      "data-type": "float"
    }, "A%"), React.createElement("th", {
      "data-sort": "playingTimeAverage",
      "data-type": "float"
    }, "Aika"))), React.createElement("tbody", null, players));
  }
});

module.exports = PlayerStats;



},{"./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/recent_schedule.coffee":[function(require,module,exports){
var ListGroup, ListGroupItem, React, RecentSchedule, Teams, moment, _, _ref;

React = require('react/addons');

_ref = require('react-bootstrap'), ListGroup = _ref.ListGroup, ListGroupItem = _ref.ListGroupItem;

moment = require('moment');

_ = require('lodash');

Teams = require('../lib/teams');

moment.locale('fi', {
  months: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"]
});

moment.locale('fi');

RecentSchedule = React.createClass({
  grouped: function() {
    var current, firstFuture, groups, lastPast, _ref1;
    current = moment();
    groups = _.groupBy(this.props.schedule, function(game) {
      var dateTime, dateTimeEnd, hour, minutes, _ref1;
      _ref1 = game.time.split(":"), hour = _ref1[0], minutes = _ref1[1];
      dateTime = moment(game.date).set('hour', hour).set('minute', minutes);
      dateTimeEnd = moment(dateTime).add(2.5, 'hours');
      if (current > dateTime) {
        if (current < dateTimeEnd) {
          return "ongoing";
        } else {
          return "past";
        }
      } else {
        return "future";
      }
    });
    firstFuture = groups.future[0];
    _ref1 = groups.past, lastPast = _ref1[_ref1.length - 1];
    return {
      future: _.filter(groups.future, function(game) {
        return game.date === firstFuture.date;
      }),
      past: _.filter(groups.past, function(game) {
        return game.date === lastPast.date;
      }),
      ongoing: groups.ongoing || []
    };
  },
  render: function() {
    var future, grouped, ongoing, past;
    grouped = this.grouped();
    ongoing = grouped.ongoing.length ? React.createElement("div", {
      "className": "ongoing"
    }, React.createElement("h4", null, "K\u00e4ynniss\u00e4"), React.createElement(ListGroup, null, grouped.ongoing.map(function(game) {
      var teams, url;
      teams = "" + game.home + " - " + game.away;
      url = "http://liiga.fi/ottelut/2014-2015/runkosarja/" + game.id + "/seuranta/";
      return React.createElement(ListGroupItem, {
        "key": game.id,
        "header": teams,
        "href": url
      }, "ottelu alkanut ", game.time);
    }))) : null;
    past = grouped.past ? React.createElement("div", {
      "className": "past"
    }, React.createElement("h4", null, "Edelliset (", moment(grouped.past[0].date).format("DD.MM"), ")"), React.createElement(ListGroup, null, grouped.past.map(function(game) {
      var score, teams, url;
      score = game.homeScore && game.awayScore ? "" + game.homeScore + "-" + game.awayScore : "";
      teams = "" + game.home + " - " + game.away + " " + score;
      url = "/ottelut/" + game.id;
      return React.createElement(ListGroupItem, {
        "key": game.id,
        "header": teams,
        "href": url
      });
    }))) : null;
    future = grouped.future ? React.createElement("div", {
      "className": "future"
    }, React.createElement("h4", null, "Seuraavat (", moment(grouped.future[0].date).format("DD.MM"), ")"), React.createElement(ListGroup, null, grouped.future.map(function(game) {
      var teams;
      teams = "" + game.home + " - " + game.away;
      return React.createElement(ListGroupItem, {
        "key": game.id,
        "header": teams
      }, "ottelu alkaa ", game.time);
    }))) : null;
    return React.createElement("div", {
      "className": "recent-schedule"
    }, ongoing, past, future);
  }
});

module.exports = RecentSchedule;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","lodash":"lodash","moment":"moment","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/schedule.coffee":[function(require,module,exports){
var Navigation, React, Schedule, Teams, moment, _;

React = require('react/addons');

moment = require('moment');

_ = require('lodash');

Navigation = require('./navigation');

Teams = require('../lib/teams');

moment.locale('fi', {
  months: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"]
});

moment.locale('fi');

Schedule = React.createClass({
  getInitialState: function() {
    return {
      firstDate: moment().startOf("month"),
      lastDate: moment().endOf("month"),
      previousVisible: false,
      nextVisible: false
    };
  },
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  monthRanges: function() {
    var firstGame, lastGame, _ref;
    _ref = this.props.schedule, firstGame = _ref[0], lastGame = _ref[_ref.length - 1];
    return [moment(firstGame.date).startOf("month"), moment(lastGame.date).endOf("month")];
  },
  gameLink: function(game) {
    if (moment(game.date).endOf("day") < moment()) {
      return React.createElement("a", {
        "href": "/ottelut/" + game.id
      }, game.home, " - ", game.away);
    } else {
      return React.createElement("span", null, game.home, " - ", game.away);
    }
  },
  showPrevious: function() {
    if (!this.state.previousVisible) {
      return React.createElement("table", {
        "className": "table table-striped"
      }, React.createElement("tr", null, React.createElement("th", {
        "className": "load-more",
        "colSpan": 4,
        "onClick": this.loadPrevious
      }, "N\u00e4yt\u00e4 edelliset kuukaudet...")));
    } else {
      return null;
    }
  },
  showNext: function() {
    if (!this.state.nextVisible) {
      return React.createElement("table", {
        "className": "table table-striped"
      }, React.createElement("tr", null, React.createElement("th", {
        "className": "load-more",
        "colSpan": 4,
        "onClick": this.loadNext
      }, "N\u00e4yt\u00e4 seuraavat kuukaudet...")));
    } else {
      return null;
    }
  },
  loadPrevious: function() {
    var firstDate;
    firstDate = this.monthRanges()[0];
    return this.setState({
      firstDate: firstDate,
      previousVisible: true
    });
  },
  loadNext: function() {
    var lastDate, _ref;
    _ref = this.monthRanges(), lastDate = _ref[_ref.length - 1];
    return this.setState({
      lastDate: lastDate,
      nextVisible: true
    });
  },
  groupedSchedule: function() {
    return _.chain(this.props.schedule).filter((function(_this) {
      return function(game) {
        var gameDate;
        gameDate = moment(game.date);
        return gameDate >= _this.state.firstDate && gameDate <= _this.state.lastDate;
      };
    })(this)).groupBy(function(game) {
      return moment(game.date).format("YYYY-MM");
    });
  },
  monthlyGames: function() {
    return this.groupedSchedule().map((function(_this) {
      return function(games, month) {
        var datesWithGames;
        datesWithGames = _.chain(games).groupBy(function(game) {
          return moment(game.date).format("DD.MM.YYYY");
        });
        return React.createElement("table", {
          "className": "table table-striped team-schedule"
        }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM")))), datesWithGames.map(function(games, gameDate) {
          return React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {
            "className": "game-date",
            "colSpan": 4
          }, gameDate)), games.map(function(game) {
            return React.createElement("tr", {
              "key": game.id
            }, React.createElement("td", null, game.time), React.createElement("td", null, _this.gameLink(game)), React.createElement("td", null, game.homeScore, "-", game.awayScore), React.createElement("td", null, game.attendance));
          }));
        }));
      };
    })(this));
  },
  render: function() {
    return React.createElement("div", {
      "className": "schedule"
    }, React.createElement(Navigation, null), React.createElement("h1", null, "Otteluohjelma"), React.createElement("div", {
      "className": "table-responsive"
    }, this.showPrevious(), this.monthlyGames(), this.showNext()));
  }
});

module.exports = Schedule;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","lodash":"lodash","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/standings.coffee":[function(require,module,exports){
var Navigation, React, Standings, StandingsTable;

React = require('react/addons');

Navigation = require('./navigation');

StandingsTable = require('./standings_table');

Standings = React.createClass({
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  render: function() {
    return React.createElement("div", null, React.createElement(Navigation, null), React.createElement("h1", null, "Sarjataulukko"), React.createElement("div", {
      "className": "standings table-responsive"
    }, React.createElement(StandingsTable, {
      "standings": this.props.standings
    })));
  }
});

module.exports = Standings;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./standings_table":"/Users/hoppula/repos/liiga_frontend/views/standings_table.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/standings_table.coffee":[function(require,module,exports){
var Navigation, React, StandingsTable, TableSortMixin, Teams;

React = require('react/addons');

Navigation = require('./navigation');

TableSortMixin = require('./mixins/table_sort');

Teams = require('../lib/teams');

StandingsTable = React.createClass({
  mixins: [TableSortMixin],
  getInitialState: function() {
    return {
      sortField: "points",
      sortDirection: "desc",
      sortType: "integer"
    };
  },
  render: function() {
    var standings;
    standings = this.props.standings.sort(this.sort).map(function(team, i) {
      var rowClass;
      rowClass = (function() {
        switch (false) {
          case i !== 6:
            return "in";
          case i !== 10:
            return "maybe";
          default:
            return "";
        }
      })();
      return React.createElement("tr", {
        "className": rowClass,
        "key": team.name
      }, React.createElement("td", null, team.position), React.createElement("td", null, React.createElement("a", {
        "href": "/joukkueet/" + (Teams.nameToId(team.name))
      }, team.name)), React.createElement("td", null, team.games), React.createElement("td", null, team.wins), React.createElement("td", null, team.ties), React.createElement("td", null, team.loses), React.createElement("td", null, team.extraPoints), React.createElement("td", null, team.points), React.createElement("td", {
        "className": "hide-on-mobile"
      }, team.goalsFor), React.createElement("td", {
        "className": "hide-on-mobile"
      }, team.goalsAgainst), React.createElement("td", {
        "className": "hide-on-mobile"
      }, team.powerplayPercentage), React.createElement("td", {
        "className": "hide-on-mobile"
      }, team.shorthandPercentage), React.createElement("td", {
        "className": "hide-on-mobile"
      }, team.pointsPerGame));
    });
    return React.createElement("table", {
      "className": "table team-schedule"
    }, React.createElement("thead", {
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.createElement("tr", null, React.createElement("th", null), React.createElement("th", null), React.createElement("th", {
      "data-sort": "games"
    }, "O"), React.createElement("th", {
      "data-sort": "wins"
    }, "V"), React.createElement("th", {
      "data-sort": "ties"
    }, "T"), React.createElement("th", {
      "data-sort": "loses"
    }, "H"), React.createElement("th", {
      "data-sort": "extraPoints"
    }, "LP"), React.createElement("th", {
      "data-sort": "points"
    }, "P"), React.createElement("th", {
      "className": "hide-on-mobile",
      "data-sort": "goalsFor"
    }, "TM"), React.createElement("th", {
      "className": "hide-on-mobile",
      "data-sort": "goalsAgainst"
    }, "PM"), React.createElement("th", {
      "className": "hide-on-mobile",
      "data-sort": "powerplayPercentage",
      "data-type": "float"
    }, "YV%"), React.createElement("th", {
      "className": "hide-on-mobile",
      "data-sort": "shorthandPercentage",
      "data-type": "float"
    }, "AV%"), React.createElement("th", {
      "className": "hide-on-mobile",
      "data-sort": "pointsPerGame",
      "data-type": "float"
    }, "P\x2FO"))), React.createElement("tbody", null, standings));
  }
});

module.exports = StandingsTable;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/stats.coffee":[function(require,module,exports){
var GoalieStats, Nav, NavItem, Navigation, PlayerStats, React, Stats, TabPane, _ref;

React = require('react/addons');

_ref = require("react-bootstrap"), TabPane = _ref.TabPane, Nav = _ref.Nav, NavItem = _ref.NavItem;

Navigation = require('./navigation');

PlayerStats = require('./player_stats');

GoalieStats = require('./goalie_stats');

Stats = React.createClass({
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  render: function() {
    var activeKey;
    activeKey = (function() {
      switch (this.props.active) {
        case "maalivahdit":
          return "goalies";
        default:
          return "players";
      }
    }).call(this);
    return React.createElement("div", null, React.createElement(Navigation, null), React.createElement("h1", null, "Tilastot"), React.createElement("div", null, React.createElement(Nav, {
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, React.createElement(NavItem, {
      "href": "/tilastot",
      "eventKey": "players"
    }, "Kentt\u00e4pelaajat"), React.createElement(NavItem, {
      "href": "/tilastot/maalivahdit",
      "eventKey": "goalies"
    }, "Maalivahdit")), React.createElement("div", {
      "className": "tab-content",
      "ref": "panes"
    }, React.createElement(TabPane, {
      "key": "players",
      "animation": false,
      "active": activeKey === "players"
    }, React.createElement("h2", null, "Kentt\u00e4pelaajat"), React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement(PlayerStats, {
      "stats": this.props.stats.scoringStats,
      "limit": 100.
    }))), React.createElement(TabPane, {
      "key": "goalies",
      "animation": false,
      "active": activeKey === "goalies"
    }, React.createElement("h2", null, "Maalivahdit (yli 25% pelanneet)"), React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement(GoalieStats, {
      "stats": this.props.stats.goalieStats,
      "playedAtLeast": 25.
    }))))));
  }
});

module.exports = Stats;



},{"./goalie_stats":"/Users/hoppula/repos/liiga_frontend/views/goalie_stats.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./player_stats":"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team.coffee":[function(require,module,exports){
var Button, ButtonToolbar, Col, Jumbotron, Nav, NavItem, Navigation, React, Row, TabPane, Team, TeamRoster, TeamSchedule, TeamStats, Teams, _ref;

React = require('react/addons');

TeamSchedule = require('./team_schedule');

TeamStats = require('./team_stats');

TeamRoster = require('./team_roster');

Navigation = require('./navigation');

Teams = require('../lib/teams');

_ref = require("react-bootstrap"), TabPane = _ref.TabPane, Jumbotron = _ref.Jumbotron, ButtonToolbar = _ref.ButtonToolbar, Button = _ref.Button, Col = _ref.Col, Row = _ref.Row, Nav = _ref.Nav, NavItem = _ref.NavItem;

Team = React.createClass({
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  logo: function() {
    return React.createElement("img", {
      "src": Teams.logo(this.props.team.info.name),
      "alt": this.props.team.info.name
    });
  },
  render: function() {
    var activeKey;
    activeKey = (function() {
      switch (this.props.active) {
        case "pelaajat":
          return "players";
        case "tilastot":
          return "stats";
        default:
          return "schedule";
      }
    }).call(this);
    return React.createElement("div", null, React.createElement(Navigation, null), React.createElement("div", {
      "className": "team"
    }, React.createElement(Jumbotron, null, React.createElement(Row, null, React.createElement(Col, {
      "xs": 12.,
      "md": 6.
    }, React.createElement("h1", null, this.logo(), " ", this.props.team.info.name)), React.createElement(Col, {
      "xs": 12.,
      "md": 6.
    }, React.createElement("div", {
      "className": "team-container"
    }, React.createElement("ul", null, React.createElement("li", null, this.props.team.info.longName), React.createElement("li", null, this.props.team.info.address), React.createElement("li", null, this.props.team.info.email)), React.createElement(ButtonToolbar, null, React.createElement(Button, {
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.ticketsUrl
    }, "Liput"), React.createElement(Button, {
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.locationUrl
    }, "Hallin sijainti")))))), React.createElement("div", null, React.createElement(Nav, {
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, React.createElement(NavItem, {
      "href": "/joukkueet/" + this.props.id,
      "eventKey": "schedule"
    }, "Ottelut"), React.createElement(NavItem, {
      "href": "/joukkueet/" + this.props.id + "/tilastot",
      "eventKey": "stats"
    }, "Tilastot"), React.createElement(NavItem, {
      "href": "/joukkueet/" + this.props.id + "/pelaajat",
      "eventKey": "players"
    }, "Pelaajat")), React.createElement("div", {
      "className": "tab-content",
      "ref": "panes"
    }, React.createElement(TabPane, {
      "key": "schedule",
      "animation": false,
      "active": activeKey === "schedule"
    }, React.createElement("h1", null, "Ottelut"), React.createElement(TeamSchedule, {
      "team": this.props.team
    })), React.createElement(TabPane, {
      "key": "stats",
      "animation": false,
      "active": activeKey === "stats"
    }, React.createElement("h1", null, "Tilastot"), React.createElement(TeamStats, {
      "teamId": this.props.id,
      "stats": this.props.team.stats
    })), React.createElement(TabPane, {
      "key": "players",
      "animation": false,
      "active": activeKey === "players"
    }, React.createElement("h1", null, "Pelaajat"), React.createElement(TeamRoster, {
      "teamId": this.props.id,
      "roster": this.props.team.roster
    }))))));
  }
});

module.exports = Team;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./team_roster":"/Users/hoppula/repos/liiga_frontend/views/team_roster.coffee","./team_schedule":"/Users/hoppula/repos/liiga_frontend/views/team_schedule.coffee","./team_stats":"/Users/hoppula/repos/liiga_frontend/views/team_stats.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_roster.coffee":[function(require,module,exports){
var React, TeamRoster, moment, _;

React = require('react/addons');

moment = require('moment');

_ = require('lodash');

TeamRoster = React.createClass({
  groupedRoster: function() {
    return _.chain(this.props.roster).groupBy(function(player) {
      return player.position;
    }).reduce(function(result, player, position) {
      var group;
      group = (function() {
        switch (false) {
          case !_.include(["KH", "OL", "VL"], position):
            return "Hyökkääjät";
          case !_.include(["OP", "VP"], position):
            return "Puolustajat";
          case position !== "MV":
            return "Maalivahdit";
        }
      })();
      result[group] || (result[group] = []);
      result[group].push(player);
      return result;
    }, {});
  },
  render: function() {
    var groups;
    groups = this.groupedRoster().map((function(_this) {
      return function(players, group) {
        return React.createElement("tbody", {
          "key": group
        }, React.createElement("tr", null, React.createElement("th", {
          "colSpan": 6
        }, group)), _.chain(players).flatten().map(function(player) {
          var title, url;
          url = "/joukkueet/" + _this.props.teamId + "/" + player.id;
          title = "" + player.firstName + " " + player.lastName;
          return React.createElement("tr", {
            "key": player.id
          }, React.createElement("td", null, React.createElement("a", {
            "href": url
          }, title)), React.createElement("td", null, React.createElement("strong", null, player.number)), React.createElement("td", null, player.height), React.createElement("td", null, player.weight), React.createElement("td", null, player.shoots), React.createElement("td", null, moment().diff(player.birthday, "years")));
        }));
      };
    })(this));
    return React.createElement("div", {
      "className": "team-roster table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped team-roster"
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Nimi"), React.createElement("th", null, "Numero"), React.createElement("th", null, "Pituus"), React.createElement("th", null, "Paino"), React.createElement("th", null, "K\u00e4tisyys"), React.createElement("th", null, "Ik\u00e4"))), groups));
  }
});

module.exports = TeamRoster;



},{"lodash":"lodash","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_schedule.coffee":[function(require,module,exports){
var React, TeamSchedule, Teams, moment, _;

React = require('react/addons');

moment = require('moment');

_ = require('lodash');

Teams = require('../lib/teams');

moment.locale('fi', {
  months: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"]
});

moment.locale('fi');

TeamSchedule = React.createClass({
  gameLink: function(game) {
    if (moment(game.date) < moment()) {
      return React.createElement("a", {
        "href": "/ottelut/" + game.id
      }, this.titleStyle(game.home), " - ", this.titleStyle(game.away));
    } else {
      return React.createElement("span", null, this.titleStyle(game.home), " - ", this.titleStyle(game.away));
    }
  },
  titleStyle: function(name) {
    if (this.props.team.info.name === name) {
      return React.createElement("strong", null, name);
    } else {
      return name;
    }
  },
  logo: function(name) {
    return React.createElement("img", {
      "src": Teams.logo(name),
      "alt": name
    });
  },
  groupedSchedule: function() {
    return _.chain(this.props.team.schedule).groupBy(function(game) {
      return moment(game.date).format("YYYY-MM");
    });
  },
  render: function() {
    var attendanceTitle, monthlyGames;
    attendanceTitle = function(month) {
      if (moment(month).startOf("month") < moment()) {
        return "Yleisöä";
      } else {
        return null;
      }
    };
    monthlyGames = this.groupedSchedule().map((function(_this) {
      return function(games, month) {
        return React.createElement("tbody", {
          "key": month
        }, React.createElement("tr", {
          "className": "month-row"
        }, React.createElement("th", {
          "colSpan": 3
        }, moment(month, "YYYY-MM").format("MMMM")), React.createElement("th", null, attendanceTitle(month))), games.map(function(game) {
          return React.createElement("tr", {
            "key": game.id
          }, React.createElement("td", null, moment(game.date).format("DD.MM.YYYY"), " ", game.time), React.createElement("td", null, _this.gameLink(game)), React.createElement("td", null, game.homeScore, "-", game.awayScore), React.createElement("td", null, game.attendance));
        }));
      };
    })(this));
    return React.createElement("div", {
      "className": "team-schedule table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped team-schedule"
    }, monthlyGames));
  }
});

module.exports = TeamSchedule;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","lodash":"lodash","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_stats.coffee":[function(require,module,exports){
var GoalieStats, PlayerStats, React, TeamStats;

React = require('react/addons');

PlayerStats = require('./player_stats');

GoalieStats = require('./goalie_stats');

TeamStats = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement(PlayerStats, {
      "stats": this.props.stats.players
    }), React.createElement(GoalieStats, {
      "stats": this.props.stats.goalies
    }));
  }
});

module.exports = TeamStats;



},{"./goalie_stats":"/Users/hoppula/repos/liiga_frontend/views/goalie_stats.coffee","./player_stats":"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee":[function(require,module,exports){
var React, TeamsList;

React = require('react/addons');

TeamsList = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "row"
    }, React.createElement("div", {
      "className": "teams-view col-xs-12 col-sm-12 col-md-12 col-lg-12"
    }, this.props.teams.map(function(team) {
      return React.createElement("a", {
        "key": team.id,
        "className": "team-logo " + team.id,
        "href": "/joukkueet/" + team.id
      });
    })));
  }
});

module.exports = TeamsList;



},{"react/addons":"react/addons"}]},{},["/Users/hoppula/repos/liiga_frontend/client.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY2xpZW50LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2NvbmZpZy9hcGktYnJvd3Nlci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9saWIvdGVhbXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3RjbGljay9saWIvZmFzdGNsaWNrLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvb3B0aW9ucy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9yb3V0ZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvZ2FtZV9saW5ldXBzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2xpbmV1cHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZV9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nb2FsaWVfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvaW5kZXguY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvbWl4aW5zL3RhYmxlX3NvcnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvbmF2aWdhdGlvbi5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvcGxheWVyX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3JlY2VudF9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9zdGFuZGluZ3MuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc3RhbmRpbmdzX3RhYmxlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW0uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9yb3N0ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1zX2xpc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSx3REFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FBUixDQUFBOztBQUFBLFVBQ0EsR0FBYSxPQUFBLENBQVEsWUFBUixDQURiLENBQUE7O0FBQUEsU0FFQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRlosQ0FBQTs7QUFBQSxPQUdBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLFlBS0EsR0FBZSxRQUFRLENBQUMsY0FBVCxDQUF3QixPQUFPLENBQUMsS0FBaEMsQ0FMZixDQUFBOztBQUFBLE9BT08sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsT0FBRCxHQUFBOztJQUFDLFVBQVE7R0FDeEI7QUFBQSxFQUFBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixPQUE5QixDQUF1QyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQTFDLEdBQXVELGFBQUEsR0FBYSxPQUFPLENBQUMsS0FBNUUsQ0FBQTtTQUNBLEtBQUssQ0FBQyxNQUFOLENBQWEsT0FBTyxDQUFDLFNBQXJCLEVBQWdDLFlBQWhDLEVB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3J6QkEsSUFBQSxjQUFBOztBQUFBLE1BQUEsR0FBUyxP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QUFDLE9BQUEsRUFBVSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUF4QjtLQUFqQyxDQURGLEVBRUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsV0FBcEIsRUFBaUM7QUFBQSxNQUFDLE9BQUEsRUFBVSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUF4QjtLQUFqQyxDQUZGLEVBRE07RUFBQSxDQUFSO0NBRlUsQ0FMWixDQUFBOztBQUFBLE1BYU0sQ0FBQyxPQUFQLEdBQWlCLFNBYmpCLENBQUE7Ozs7O0FDQUEsSUFBQSxnQkFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FBUixDQUFBOztBQUFBLFNBRUEsR0FBWSxLQUFLLENBQUMsV0FBTixDQUVWO0FBQUEsRUFBQSxNQUFBLEVBQVEsU0FBQSxHQUFBO1dBQ04sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7QUFBQSxNQUFDLFdBQUEsRUFBYSxLQUFkO0tBQTNCLEVBQ0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7QUFBQSxNQUFDLFdBQUEsRUFBYSxvREFBZDtLQUEzQixFQUVJLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQWIsQ0FBaUIsU0FBQyxJQUFELEdBQUE7YUFDZixLQUFLLENBQUMsYUFBTixDQUFvQixHQUFwQixFQUF5QjtBQUFBLFFBQUMsS0FBQSxFQUFRLElBQUksQ0FBQyxFQUFkO0FBQUEsUUFBbUIsV0FBQSxFQUFjLFlBQUEsR0FBWSxJQUFJLENBQUMsRUFBbEQ7QUFBQSxRQUF3RCxNQUFBLEVBQVMsYUFBQSxHQUFhLElBQUksQ0FBQyxFQUFuRjtPQUF6QixFQURlO0lBQUEsQ0FBakIsQ0FGSixDQURGLEVBRE07RUFBQSxDQUFSO0NBRlUsQ0FGWixDQUFBOztBQUFBLE1BY00sQ0FBQyxPQUFQLEdBQWlCLFNBZGpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5jZXJlYmVsbHVtID0gcmVxdWlyZSAnY2VyZWJlbGx1bSdcbkZhc3RDbGljayA9IHJlcXVpcmUgJ2Zhc3RjbGljaydcbm9wdGlvbnMgPSByZXF1aXJlICcuL29wdGlvbnMnXG5cbmFwcENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuYXBwSWQpXG5cbm9wdGlvbnMucmVuZGVyID0gKG9wdGlvbnM9e30pIC0+XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gXCJMaWlnYS5wdyAtICN7b3B0aW9ucy50aXRsZX1cIlxuICBSZWFjdC5yZW5kZXIob3B0aW9ucy5jb21wb25lbnQsIGFwcENvbnRhaW5lcilcblxub3B0aW9ucy5pbml0aWFsaXplID0gKGNsaWVudCkgLT5cbiAgRmFzdENsaWNrLmF0dGFjaChkb2N1bWVudC5ib2R5KVxuICAjUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpXG5cbmFwcCA9IGNlcmViZWxsdW0uY2xpZW50KG9wdGlvbnMpIiwibW9kdWxlLmV4cG9ydHMgPVxuICAjdXJsOiBkb2N1bWVudC5sb2NhdGlvbi5vcmlnaW4ucmVwbGFjZShcIjQwMDBcIixcIjgwODBcIilcbiAgI3VybDogXCJodHRwOi8vbG9jYWxob3N0OjgwODBcIlxuICB1cmw6IFwiaHR0cDovL2FwaS5saWlnYS5wd1wiIiwiVGVhbXMgPVxuICBuYW1lc0FuZElkczpcbiAgICBcIsOEc3PDpHRcIjogXCJhc3NhdFwiXG4gICAgXCJCbHVlc1wiOiBcImJsdWVzXCJcbiAgICBcIkhJRktcIjogXCJoaWZrXCJcbiAgICBcIkhQS1wiOiBcImhwa1wiXG4gICAgXCJJbHZlc1wiOiBcImlsdmVzXCJcbiAgICBcIlNwb3J0XCI6IFwic3BvcnRcIlxuICAgIFwiSllQXCI6IFwianlwXCJcbiAgICBcIkthbFBhXCI6IFwia2FscGFcIlxuICAgIFwiS8OkcnDDpHRcIjogXCJrYXJwYXRcIlxuICAgIFwiTHVra29cIjogXCJsdWtrb1wiXG4gICAgXCJQZWxpY2Fuc1wiOiBcInBlbGljYW5zXCJcbiAgICBcIlNhaVBhXCI6IFwic2FpcGFcIlxuICAgIFwiVGFwcGFyYVwiOiBcInRhcHBhcmFcIlxuICAgIFwiVFBTXCI6IFwidHBzXCJcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBcIi9zdmcvI3tAbmFtZXNBbmRJZHNbbmFtZV19LnN2Z1wiXG5cbiAgaWRUb05hbWU6IChpZCkgLT5cbiAgICBpZHMgPSBPYmplY3Qua2V5cyhAbmFtZXNBbmRJZHMpLnJlZHVjZSAob2JqLCBuYW1lKSA9PlxuICAgICAgb2JqW0BuYW1lc0FuZElkc1tuYW1lXV0gPSBuYW1lXG4gICAgICBvYmpcbiAgICAsIHt9XG4gICAgaWRzW2lkXVxuXG4gIG5hbWVUb0lkOiAobmFtZSkgLT5cbiAgICBAbmFtZXNBbmRJZHNbbmFtZV1cblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIi8qKlxuICogQHByZXNlcnZlIEZhc3RDbGljazogcG9seWZpbGwgdG8gcmVtb3ZlIGNsaWNrIGRlbGF5cyBvbiBicm93c2VycyB3aXRoIHRvdWNoIFVJcy5cbiAqXG4gKiBAdmVyc2lvbiAxLjAuM1xuICogQGNvZGluZ3N0YW5kYXJkIGZ0bGFicy1qc3YyXG4gKiBAY29weXJpZ2h0IFRoZSBGaW5hbmNpYWwgVGltZXMgTGltaXRlZCBbQWxsIFJpZ2h0cyBSZXNlcnZlZF1cbiAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlIChzZWUgTElDRU5TRS50eHQpXG4gKi9cblxuLypqc2xpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuLypnbG9iYWwgZGVmaW5lLCBFdmVudCwgTm9kZSovXG5cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBmYXN0LWNsaWNraW5nIGxpc3RlbmVycyBvbiB0aGUgc3BlY2lmaWVkIGxheWVyLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuZnVuY3Rpb24gRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG9sZE9uQ2xpY2s7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgYSBjbGljayBpcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlZC5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cblxuXHQvKipcblx0ICogVGltZXN0YW1wIGZvciB3aGVuIGNsaWNrIHRyYWNraW5nIHN0YXJ0ZWQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSAwO1xuXG5cblx0LyoqXG5cdCAqIFRoZSBlbGVtZW50IGJlaW5nIHRyYWNrZWQgZm9yIGEgY2xpY2suXG5cdCAqXG5cdCAqIEB0eXBlIEV2ZW50VGFyZ2V0XG5cdCAqL1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXG5cblx0LyoqXG5cdCAqIFgtY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRvdWNoU3RhcnRYID0gMDtcblxuXG5cdC8qKlxuXHQgKiBZLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50b3VjaFN0YXJ0WSA9IDA7XG5cblxuXHQvKipcblx0ICogSUQgb2YgdGhlIGxhc3QgdG91Y2gsIHJldHJpZXZlZCBmcm9tIFRvdWNoLmlkZW50aWZpZXIuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyID0gMDtcblxuXG5cdC8qKlxuXHQgKiBUb3VjaG1vdmUgYm91bmRhcnksIGJleW9uZCB3aGljaCBhIGNsaWNrIHdpbGwgYmUgY2FuY2VsbGVkLlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudG91Y2hCb3VuZGFyeSA9IG9wdGlvbnMudG91Y2hCb3VuZGFyeSB8fCAxMDtcblxuXG5cdC8qKlxuXHQgKiBUaGUgRmFzdENsaWNrIGxheWVyLlxuXHQgKlxuXHQgKiBAdHlwZSBFbGVtZW50XG5cdCAqL1xuXHR0aGlzLmxheWVyID0gbGF5ZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiB0YXAodG91Y2hzdGFydCBhbmQgdG91Y2hlbmQpIGV2ZW50c1xuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudGFwRGVsYXkgPSBvcHRpb25zLnRhcERlbGF5IHx8IDIwMDtcblxuXHRpZiAoRmFzdENsaWNrLm5vdE5lZWRlZChsYXllcikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBBbmRyb2lkIGRvbid0IGhhdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcblx0ZnVuY3Rpb24gYmluZChtZXRob2QsIGNvbnRleHQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBtZXRob2QuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTsgfTtcblx0fVxuXG5cblx0dmFyIG1ldGhvZHMgPSBbJ29uTW91c2UnLCAnb25DbGljaycsICdvblRvdWNoU3RhcnQnLCAnb25Ub3VjaE1vdmUnLCAnb25Ub3VjaEVuZCcsICdvblRvdWNoQ2FuY2VsJ107XG5cdHZhciBjb250ZXh0ID0gdGhpcztcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGNvbnRleHRbbWV0aG9kc1tpXV0gPSBiaW5kKGNvbnRleHRbbWV0aG9kc1tpXV0sIGNvbnRleHQpO1xuXHR9XG5cblx0Ly8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzIGFzIHJlcXVpcmVkXG5cdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdH1cblxuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XG5cblx0Ly8gSGFjayBpcyByZXF1aXJlZCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IEV2ZW50I3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAoZS5nLiBBbmRyb2lkIDIpXG5cdC8vIHdoaWNoIGlzIGhvdyBGYXN0Q2xpY2sgbm9ybWFsbHkgc3RvcHMgY2xpY2sgZXZlbnRzIGJ1YmJsaW5nIHRvIGNhbGxiYWNrcyByZWdpc3RlcmVkIG9uIHRoZSBGYXN0Q2xpY2tcblx0Ly8gbGF5ZXIgd2hlbiB0aGV5IGFyZSBjYW5jZWxsZWQuXG5cdGlmICghRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0dmFyIHJtdiA9IE5vZGUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xuXHRcdFx0XHRybXYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cm12LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG5cdFx0XHR2YXIgYWR2ID0gTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0XHRcdGlmICh0eXBlID09PSAnY2xpY2snKSB7XG5cdFx0XHRcdGFkdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjay5oaWphY2tlZCB8fCAoY2FsbGJhY2suaGlqYWNrZWQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmICghZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSwgY2FwdHVyZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBJZiBhIGhhbmRsZXIgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGUgZWxlbWVudCdzIG9uY2xpY2sgYXR0cmlidXRlLCBpdCB3aWxsIGJlIGZpcmVkIGJlZm9yZVxuXHQvLyBGYXN0Q2xpY2sncyBvbkNsaWNrIGhhbmRsZXIuIEZpeCB0aGlzIGJ5IHB1bGxpbmcgb3V0IHRoZSB1c2VyLWRlZmluZWQgaGFuZGxlciBmdW5jdGlvbiBhbmRcblx0Ly8gYWRkaW5nIGl0IGFzIGxpc3RlbmVyLlxuXHRpZiAodHlwZW9mIGxheWVyLm9uY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdC8vIEFuZHJvaWQgYnJvd3NlciBvbiBhdCBsZWFzdCAzLjIgcmVxdWlyZXMgYSBuZXcgcmVmZXJlbmNlIHRvIHRoZSBmdW5jdGlvbiBpbiBsYXllci5vbmNsaWNrXG5cdFx0Ly8gLSB0aGUgb2xkIG9uZSB3b24ndCB3b3JrIGlmIHBhc3NlZCB0byBhZGRFdmVudExpc3RlbmVyIGRpcmVjdGx5LlxuXHRcdG9sZE9uQ2xpY2sgPSBsYXllci5vbmNsaWNrO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdG9sZE9uQ2xpY2soZXZlbnQpO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRsYXllci5vbmNsaWNrID0gbnVsbDtcblx0fVxufVxuXG5cbi8qKlxuICogQW5kcm9pZCByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQW5kcm9pZCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQW5kcm9pZCcpID4gMDtcblxuXG4vKipcbiAqIGlPUyByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzSU9TID0gL2lQKGFkfGhvbmV8b2QpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDQgcmVxdWlyZXMgYW4gZXhjZXB0aW9uIGZvciBzZWxlY3QgZWxlbWVudHMuXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNJT1M0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyA0X1xcZChfXFxkKT8vKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDYuMCgrPykgcmVxdWlyZXMgdGhlIHRhcmdldCBlbGVtZW50IHRvIGJlIG1hbnVhbGx5IGRlcml2ZWRcbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQgPSBkZXZpY2VJc0lPUyAmJiAoL09TIChbNi05XXxcXGR7Mn0pX1xcZC8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbi8qKlxuICogQmxhY2tCZXJyeSByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQmxhY2tCZXJyeTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdCQjEwJykgPiAwO1xuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIG5hdGl2ZSBjbGljay5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgbmVlZHMgYSBuYXRpdmUgY2xpY2tcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0NsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgdG8gZGlzYWJsZWQgaW5wdXRzIChpc3N1ZSAjNjIpXG5cdGNhc2UgJ2J1dHRvbic6XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdGNhc2UgJ3RleHRhcmVhJzpcblx0XHRpZiAodGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnaW5wdXQnOlxuXG5cdFx0Ly8gRmlsZSBpbnB1dHMgbmVlZCByZWFsIGNsaWNrcyBvbiBpT1MgNiBkdWUgdG8gYSBicm93c2VyIGJ1ZyAoaXNzdWUgIzY4KVxuXHRcdGlmICgoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0LnR5cGUgPT09ICdmaWxlJykgfHwgdGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnbGFiZWwnOlxuXHRjYXNlICd2aWRlbyc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gKC9cXGJuZWVkc2NsaWNrXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBhIGdpdmVuIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIGNsaWNrIGludG8gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIG5hdGl2ZSBjbGljay5cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0ZvY3VzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXHRjYXNlICd0ZXh0YXJlYSc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdFx0cmV0dXJuICFkZXZpY2VJc0FuZHJvaWQ7XG5cdGNhc2UgJ2lucHV0Jzpcblx0XHRzd2l0Y2ggKHRhcmdldC50eXBlKSB7XG5cdFx0Y2FzZSAnYnV0dG9uJzpcblx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0Y2FzZSAnZmlsZSc6XG5cdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdGNhc2UgJ3JhZGlvJzpcblx0XHRjYXNlICdzdWJtaXQnOlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdG8gZm9jdXMgZGlzYWJsZWQgaW5wdXRzXG5cdFx0cmV0dXJuICF0YXJnZXQuZGlzYWJsZWQgJiYgIXRhcmdldC5yZWFkT25seTtcblx0ZGVmYXVsdDpcblx0XHRyZXR1cm4gKC9cXGJuZWVkc2ZvY3VzXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcblx0fVxufTtcblxuXG4vKipcbiAqIFNlbmQgYSBjbGljayBldmVudCB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLnNlbmRDbGljayA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQsIGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGNsaWNrRXZlbnQsIHRvdWNoO1xuXG5cdC8vIE9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzIGFjdGl2ZUVsZW1lbnQgbmVlZHMgdG8gYmUgYmx1cnJlZCBvdGhlcndpc2UgdGhlIHN5bnRoZXRpYyBjbGljayB3aWxsIGhhdmUgbm8gZWZmZWN0ICgjMjQpXG5cdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRhcmdldEVsZW1lbnQpIHtcblx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0fVxuXG5cdHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cblx0Ly8gU3ludGhlc2lzZSBhIGNsaWNrIGV2ZW50LCB3aXRoIGFuIGV4dHJhIGF0dHJpYnV0ZSBzbyBpdCBjYW4gYmUgdHJhY2tlZFxuXHRjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnRzJyk7XG5cdGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQodGhpcy5kZXRlcm1pbmVFdmVudFR5cGUodGFyZ2V0RWxlbWVudCksIHRydWUsIHRydWUsIHdpbmRvdywgMSwgdG91Y2guc2NyZWVuWCwgdG91Y2guc2NyZWVuWSwgdG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXHRjbGlja0V2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQgPSB0cnVlO1xuXHR0YXJnZXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG59O1xuXG5GYXN0Q2xpY2sucHJvdG90eXBlLmRldGVybWluZUV2ZW50VHlwZSA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vSXNzdWUgIzE1OTogQW5kcm9pZCBDaHJvbWUgU2VsZWN0IEJveCBkb2VzIG5vdCBvcGVuIHdpdGggYSBzeW50aGV0aWMgY2xpY2sgZXZlbnRcblx0aWYgKGRldmljZUlzQW5kcm9pZCAmJiB0YXJnZXRFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcblx0XHRyZXR1cm4gJ21vdXNlZG93bic7XG5cdH1cblxuXHRyZXR1cm4gJ2NsaWNrJztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgbGVuZ3RoO1xuXG5cdC8vIElzc3VlICMxNjA6IG9uIGlPUyA3LCBzb21lIGlucHV0IGVsZW1lbnRzIChlLmcuIGRhdGUgZGF0ZXRpbWUpIHRocm93IGEgdmFndWUgVHlwZUVycm9yIG9uIHNldFNlbGVjdGlvblJhbmdlLiBUaGVzZSBlbGVtZW50cyBkb24ndCBoYXZlIGFuIGludGVnZXIgdmFsdWUgZm9yIHRoZSBzZWxlY3Rpb25TdGFydCBhbmQgc2VsZWN0aW9uRW5kIHByb3BlcnRpZXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IHRoYXQgY2FuJ3QgYmUgdXNlZCBmb3IgZGV0ZWN0aW9uIGJlY2F1c2UgYWNjZXNzaW5nIHRoZSBwcm9wZXJ0aWVzIGFsc28gdGhyb3dzIGEgVHlwZUVycm9yLiBKdXN0IGNoZWNrIHRoZSB0eXBlIGluc3RlYWQuIEZpbGVkIGFzIEFwcGxlIGJ1ZyAjMTUxMjI3MjQuXG5cdGlmIChkZXZpY2VJc0lPUyAmJiB0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlICYmIHRhcmdldEVsZW1lbnQudHlwZS5pbmRleE9mKCdkYXRlJykgIT09IDAgJiYgdGFyZ2V0RWxlbWVudC50eXBlICE9PSAndGltZScpIHtcblx0XHRsZW5ndGggPSB0YXJnZXRFbGVtZW50LnZhbHVlLmxlbmd0aDtcblx0XHR0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGxlbmd0aCwgbGVuZ3RoKTtcblx0fSBlbHNlIHtcblx0XHR0YXJnZXRFbGVtZW50LmZvY3VzKCk7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciBhbmQgaWYgc28sIHNldCBhIGZsYWcgb24gaXQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudXBkYXRlU2Nyb2xsUGFyZW50ID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBzY3JvbGxQYXJlbnQsIHBhcmVudEVsZW1lbnQ7XG5cblx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cblx0Ly8gQXR0ZW1wdCB0byBkaXNjb3ZlciB3aGV0aGVyIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgc2Nyb2xsYWJsZSBsYXllci4gUmUtY2hlY2sgaWYgdGhlXG5cdC8vIHRhcmdldCBlbGVtZW50IHdhcyBtb3ZlZCB0byBhbm90aGVyIHBhcmVudC5cblx0aWYgKCFzY3JvbGxQYXJlbnQgfHwgIXNjcm9sbFBhcmVudC5jb250YWlucyh0YXJnZXRFbGVtZW50KSkge1xuXHRcdHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXHRcdGRvIHtcblx0XHRcdGlmIChwYXJlbnRFbGVtZW50LnNjcm9sbEhlaWdodCA+IHBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHRcdHNjcm9sbFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gcGFyZW50RWxlbWVudDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fSB3aGlsZSAocGFyZW50RWxlbWVudCk7XG5cdH1cblxuXHQvLyBBbHdheXMgdXBkYXRlIHRoZSBzY3JvbGwgdG9wIHRyYWNrZXIgaWYgcG9zc2libGUuXG5cdGlmIChzY3JvbGxQYXJlbnQpIHtcblx0XHRzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3A7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxFdmVudFRhcmdldH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0ID0gZnVuY3Rpb24oZXZlbnRUYXJnZXQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIE9uIHNvbWUgb2xkZXIgYnJvd3NlcnMgKG5vdGFibHkgU2FmYXJpIG9uIGlPUyA0LjEgLSBzZWUgaXNzdWUgIzU2KSB0aGUgZXZlbnQgdGFyZ2V0IG1heSBiZSBhIHRleHQgbm9kZS5cblx0aWYgKGV2ZW50VGFyZ2V0Lm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuXHRcdHJldHVybiBldmVudFRhcmdldC5wYXJlbnROb2RlO1xuXHR9XG5cblx0cmV0dXJuIGV2ZW50VGFyZ2V0O1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIHN0YXJ0LCByZWNvcmQgdGhlIHBvc2l0aW9uIGFuZCBzY3JvbGwgb2Zmc2V0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciB0YXJnZXRFbGVtZW50LCB0b3VjaCwgc2VsZWN0aW9uO1xuXG5cdC8vIElnbm9yZSBtdWx0aXBsZSB0b3VjaGVzLCBvdGhlcndpc2UgcGluY2gtdG8tem9vbSBpcyBwcmV2ZW50ZWQgaWYgYm90aCBmaW5nZXJzIGFyZSBvbiB0aGUgRmFzdENsaWNrIGVsZW1lbnQgKGlzc3VlICMxMTEpLlxuXHRpZiAoZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGggPiAxKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHR0YXJnZXRFbGVtZW50ID0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCk7XG5cdHRvdWNoID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXTtcblxuXHRpZiAoZGV2aWNlSXNJT1MpIHtcblxuXHRcdC8vIE9ubHkgdHJ1c3RlZCBldmVudHMgd2lsbCBkZXNlbGVjdCB0ZXh0IG9uIGlPUyAoaXNzdWUgIzQ5KVxuXHRcdHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcblx0XHRpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgJiYgIXNlbGVjdGlvbi5pc0NvbGxhcHNlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdFx0Ly8gV2VpcmQgdGhpbmdzIGhhcHBlbiBvbiBpT1Mgd2hlbiBhbiBhbGVydCBvciBjb25maXJtIGRpYWxvZyBpcyBvcGVuZWQgZnJvbSBhIGNsaWNrIGV2ZW50IGNhbGxiYWNrIChpc3N1ZSAjMjMpOlxuXHRcdFx0Ly8gd2hlbiB0aGUgdXNlciBuZXh0IHRhcHMgYW55d2hlcmUgZWxzZSBvbiB0aGUgcGFnZSwgbmV3IHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kIGV2ZW50cyBhcmUgZGlzcGF0Y2hlZFxuXHRcdFx0Ly8gd2l0aCB0aGUgc2FtZSBpZGVudGlmaWVyIGFzIHRoZSB0b3VjaCBldmVudCB0aGF0IHByZXZpb3VzbHkgdHJpZ2dlcmVkIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgYWxlcnQuXG5cdFx0XHQvLyBTYWRseSwgdGhlcmUgaXMgYW4gaXNzdWUgb24gaU9TIDQgdGhhdCBjYXVzZXMgc29tZSBub3JtYWwgdG91Y2ggZXZlbnRzIHRvIGhhdmUgdGhlIHNhbWUgaWRlbnRpZmllciBhcyBhblxuXHRcdFx0Ly8gaW1tZWRpYXRlbHkgcHJlY2VlZGluZyB0b3VjaCBldmVudCAoaXNzdWUgIzUyKSwgc28gdGhpcyBmaXggaXMgdW5hdmFpbGFibGUgb24gdGhhdCBwbGF0Zm9ybS5cblx0XHRcdC8vIElzc3VlIDEyMDogdG91Y2guaWRlbnRpZmllciBpcyAwIHdoZW4gQ2hyb21lIGRldiB0b29scyAnRW11bGF0ZSB0b3VjaCBldmVudHMnIGlzIHNldCB3aXRoIGFuIGlPUyBkZXZpY2UgVUEgc3RyaW5nLFxuXHRcdFx0Ly8gd2hpY2ggY2F1c2VzIGFsbCB0b3VjaCBldmVudHMgdG8gYmUgaWdub3JlZC4gQXMgdGhpcyBibG9jayBvbmx5IGFwcGxpZXMgdG8gaU9TLCBhbmQgaU9TIGlkZW50aWZpZXJzIGFyZSBhbHdheXMgbG9uZyxcblx0XHRcdC8vIHJhbmRvbSBpbnRlZ2VycywgaXQncyBzYWZlIHRvIHRvIGNvbnRpbnVlIGlmIHRoZSBpZGVudGlmaWVyIGlzIDAgaGVyZS5cblx0XHRcdGlmICh0b3VjaC5pZGVudGlmaWVyICYmIHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMubGFzdFRvdWNoSWRlbnRpZmllcikge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGFzdFRvdWNoSWRlbnRpZmllciA9IHRvdWNoLmlkZW50aWZpZXI7XG5cblx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciAodXNpbmcgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoKSBhbmQ6XG5cdFx0XHQvLyAxKSB0aGUgdXNlciBkb2VzIGEgZmxpbmcgc2Nyb2xsIG9uIHRoZSBzY3JvbGxhYmxlIGxheWVyXG5cdFx0XHQvLyAyKSB0aGUgdXNlciBzdG9wcyB0aGUgZmxpbmcgc2Nyb2xsIHdpdGggYW5vdGhlciB0YXBcblx0XHRcdC8vIHRoZW4gdGhlIGV2ZW50LnRhcmdldCBvZiB0aGUgbGFzdCAndG91Y2hlbmQnIGV2ZW50IHdpbGwgYmUgdGhlIGVsZW1lbnQgdGhhdCB3YXMgdW5kZXIgdGhlIHVzZXIncyBmaW5nZXJcblx0XHRcdC8vIHdoZW4gdGhlIGZsaW5nIHNjcm9sbCB3YXMgc3RhcnRlZCwgY2F1c2luZyBGYXN0Q2xpY2sgdG8gc2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoYXQgbGF5ZXIgLSB1bmxlc3MgYSBjaGVja1xuXHRcdFx0Ly8gaXMgbWFkZSB0byBlbnN1cmUgdGhhdCBhIHBhcmVudCBsYXllciB3YXMgbm90IHNjcm9sbGVkIGJlZm9yZSBzZW5kaW5nIGEgc3ludGhldGljIGNsaWNrIChpc3N1ZSAjNDIpLlxuXHRcdFx0dGhpcy51cGRhdGVTY3JvbGxQYXJlbnQodGFyZ2V0RWxlbWVudCk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy50cmFja2luZ0NsaWNrID0gdHJ1ZTtcblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSBldmVudC50aW1lU3RhbXA7XG5cdHRoaXMudGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XG5cblx0dGhpcy50b3VjaFN0YXJ0WCA9IHRvdWNoLnBhZ2VYO1xuXHR0aGlzLnRvdWNoU3RhcnRZID0gdG91Y2gucGFnZVk7XG5cblx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBCYXNlZCBvbiBhIHRvdWNobW92ZSBldmVudCBvYmplY3QsIGNoZWNrIHdoZXRoZXIgdGhlIHRvdWNoIGhhcyBtb3ZlZCBwYXN0IGEgYm91bmRhcnkgc2luY2UgaXQgc3RhcnRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudG91Y2hIYXNNb3ZlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sIGJvdW5kYXJ5ID0gdGhpcy50b3VjaEJvdW5kYXJ5O1xuXG5cdGlmIChNYXRoLmFicyh0b3VjaC5wYWdlWCAtIHRoaXMudG91Y2hTdGFydFgpID4gYm91bmRhcnkgfHwgTWF0aC5hYnModG91Y2gucGFnZVkgLSB0aGlzLnRvdWNoU3RhcnRZKSA+IGJvdW5kYXJ5KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qKlxuICogVXBkYXRlIHRoZSBsYXN0IHBvc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCF0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIElmIHRoZSB0b3VjaCBoYXMgbW92ZWQsIGNhbmNlbCB0aGUgY2xpY2sgdHJhY2tpbmdcblx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudCAhPT0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCkgfHwgdGhpcy50b3VjaEhhc01vdmVkKGV2ZW50KSkge1xuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGZpbmQgdGhlIGxhYmVsbGVkIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBsYWJlbCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8SFRNTExhYmVsRWxlbWVudH0gbGFiZWxFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLmZpbmRDb250cm9sID0gZnVuY3Rpb24obGFiZWxFbGVtZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBGYXN0IHBhdGggZm9yIG5ld2VyIGJyb3dzZXJzIHN1cHBvcnRpbmcgdGhlIEhUTUw1IGNvbnRyb2wgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuY29udHJvbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGxhYmVsRWxlbWVudC5jb250cm9sO1xuXHR9XG5cblx0Ly8gQWxsIGJyb3dzZXJzIHVuZGVyIHRlc3QgdGhhdCBzdXBwb3J0IHRvdWNoIGV2ZW50cyBhbHNvIHN1cHBvcnQgdGhlIEhUTUw1IGh0bWxGb3IgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuaHRtbEZvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYWJlbEVsZW1lbnQuaHRtbEZvcik7XG5cdH1cblxuXHQvLyBJZiBubyBmb3IgYXR0cmlidXRlIGV4aXN0cywgYXR0ZW1wdCB0byByZXRyaWV2ZSB0aGUgZmlyc3QgbGFiZWxsYWJsZSBkZXNjZW5kYW50IGVsZW1lbnRcblx0Ly8gdGhlIGxpc3Qgb2Ygd2hpY2ggaXMgZGVmaW5lZCBoZXJlOiBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxhYmVsXG5cdHJldHVybiBsYWJlbEVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSksIGtleWdlbiwgbWV0ZXIsIG91dHB1dCwgcHJvZ3Jlc3MsIHNlbGVjdCwgdGV4dGFyZWEnKTtcbn07XG5cblxuLyoqXG4gKiBPbiB0b3VjaCBlbmQsIGRldGVybWluZSB3aGV0aGVyIHRvIHNlbmQgYSBjbGljayBldmVudCBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZm9yRWxlbWVudCwgdHJhY2tpbmdDbGlja1N0YXJ0LCB0YXJnZXRUYWdOYW1lLCBzY3JvbGxQYXJlbnQsIHRvdWNoLCB0YXJnZXRFbGVtZW50ID0gdGhpcy50YXJnZXRFbGVtZW50O1xuXG5cdGlmICghdGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBQcmV2ZW50IHBoYW50b20gY2xpY2tzIG9uIGZhc3QgZG91YmxlLXRhcCAoaXNzdWUgIzM2KVxuXHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XG5cdFx0dGhpcy5jYW5jZWxOZXh0Q2xpY2sgPSB0cnVlO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gUmVzZXQgdG8gcHJldmVudCB3cm9uZyBjbGljayBjYW5jZWwgb24gaW5wdXQgKGlzc3VlICMxNTYpLlxuXHR0aGlzLmNhbmNlbE5leHRDbGljayA9IGZhbHNlO1xuXG5cdHRoaXMubGFzdENsaWNrVGltZSA9IGV2ZW50LnRpbWVTdGFtcDtcblxuXHR0cmFja2luZ0NsaWNrU3RhcnQgPSB0aGlzLnRyYWNraW5nQ2xpY2tTdGFydDtcblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcblxuXHQvLyBPbiBzb21lIGlPUyBkZXZpY2VzLCB0aGUgdGFyZ2V0RWxlbWVudCBzdXBwbGllZCB3aXRoIHRoZSBldmVudCBpcyBpbnZhbGlkIGlmIHRoZSBsYXllclxuXHQvLyBpcyBwZXJmb3JtaW5nIGEgdHJhbnNpdGlvbiBvciBzY3JvbGwsIGFuZCBoYXMgdG8gYmUgcmUtZGV0ZWN0ZWQgbWFudWFsbHkuIE5vdGUgdGhhdFxuXHQvLyBmb3IgdGhpcyB0byBmdW5jdGlvbiBjb3JyZWN0bHksIGl0IG11c3QgYmUgY2FsbGVkICphZnRlciogdGhlIGV2ZW50IHRhcmdldCBpcyBjaGVja2VkIVxuXHQvLyBTZWUgaXNzdWUgIzU3OyBhbHNvIGZpbGVkIGFzIHJkYXI6Ly8xMzA0ODU4OSAuXG5cdGlmIChkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQpIHtcblx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0Ly8gSW4gY2VydGFpbiBjYXNlcyBhcmd1bWVudHMgb2YgZWxlbWVudEZyb21Qb2ludCBjYW4gYmUgbmVnYXRpdmUsIHNvIHByZXZlbnQgc2V0dGluZyB0YXJnZXRFbGVtZW50IHRvIG51bGxcblx0XHR0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaC5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgdG91Y2gucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpIHx8IHRhcmdldEVsZW1lbnQ7XG5cdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHR9XG5cblx0dGFyZ2V0VGFnTmFtZSA9IHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRpZiAodGFyZ2V0VGFnTmFtZSA9PT0gJ2xhYmVsJykge1xuXHRcdGZvckVsZW1lbnQgPSB0aGlzLmZpbmRDb250cm9sKHRhcmdldEVsZW1lbnQpO1xuXHRcdGlmIChmb3JFbGVtZW50KSB7XG5cdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xuXHRcdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRhcmdldEVsZW1lbnQgPSBmb3JFbGVtZW50O1xuXHRcdH1cblx0fSBlbHNlIGlmICh0aGlzLm5lZWRzRm9jdXModGFyZ2V0RWxlbWVudCkpIHtcblxuXHRcdC8vIENhc2UgMTogSWYgdGhlIHRvdWNoIHN0YXJ0ZWQgYSB3aGlsZSBhZ28gKGJlc3QgZ3Vlc3MgaXMgMTAwbXMgYmFzZWQgb24gdGVzdHMgZm9yIGlzc3VlICMzNikgdGhlbiBmb2N1cyB3aWxsIGJlIHRyaWdnZXJlZCBhbnl3YXkuIFJldHVybiBlYXJseSBhbmQgdW5zZXQgdGhlIHRhcmdldCBlbGVtZW50IHJlZmVyZW5jZSBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IGNsaWNrIHdpbGwgYmUgYWxsb3dlZCB0aHJvdWdoLlxuXHRcdC8vIENhc2UgMjogV2l0aG91dCB0aGlzIGV4Y2VwdGlvbiBmb3IgaW5wdXQgZWxlbWVudHMgdGFwcGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIGNvbnRhaW5lZCBpbiBhbiBpZnJhbWUsIHRoZW4gYW55IGlucHV0dGVkIHRleHQgd29uJ3QgYmUgdmlzaWJsZSBldmVuIHRob3VnaCB0aGUgdmFsdWUgYXR0cmlidXRlIGlzIHVwZGF0ZWQgYXMgdGhlIHVzZXIgdHlwZXMgKGlzc3VlICMzNykuXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0cmFja2luZ0NsaWNrU3RhcnQpID4gMTAwIHx8IChkZXZpY2VJc0lPUyAmJiB3aW5kb3cudG9wICE9PSB3aW5kb3cgJiYgdGFyZ2V0VGFnTmFtZSA9PT0gJ2lucHV0JykpIHtcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcblx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XG5cblx0XHQvLyBTZWxlY3QgZWxlbWVudHMgbmVlZCB0aGUgZXZlbnQgdG8gZ28gdGhyb3VnaCBvbiBpT1MgNCwgb3RoZXJ3aXNlIHRoZSBzZWxlY3RvciBtZW51IHdvbid0IG9wZW4uXG5cdFx0Ly8gQWxzbyB0aGlzIGJyZWFrcyBvcGVuaW5nIHNlbGVjdHMgd2hlbiBWb2ljZU92ZXIgaXMgYWN0aXZlIG9uIGlPUzYsIGlPUzcgKGFuZCBwb3NzaWJseSBvdGhlcnMpXG5cdFx0aWYgKCFkZXZpY2VJc0lPUyB8fCB0YXJnZXRUYWdOYW1lICE9PSAnc2VsZWN0Jykge1xuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKGRldmljZUlzSU9TICYmICFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgaWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgbGF5ZXIgdGhhdCB3YXMgc2Nyb2xsZWRcblx0XHQvLyBhbmQgdGhpcyB0YXAgaXMgYmVpbmcgdXNlZCB0byBzdG9wIHRoZSBzY3JvbGxpbmcgKHVzdWFsbHkgaW5pdGlhdGVkIGJ5IGEgZmxpbmcgLSBpc3N1ZSAjNDIpLlxuXHRcdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHRcdGlmIChzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50LmZhc3RDbGlja0xhc3RTY3JvbGxUb3AgIT09IHNjcm9sbFBhcmVudC5zY3JvbGxUb3ApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdC8vIFByZXZlbnQgdGhlIGFjdHVhbCBjbGljayBmcm9tIGdvaW5nIHRob3VnaCAtIHVubGVzcyB0aGUgdGFyZ2V0IG5vZGUgaXMgbWFya2VkIGFzIHJlcXVpcmluZ1xuXHQvLyByZWFsIGNsaWNrcyBvciBpZiBpdCBpcyBpbiB0aGUgd2hpdGVsaXN0IGluIHdoaWNoIGNhc2Ugb25seSBub24tcHJvZ3JhbW1hdGljIGNsaWNrcyBhcmUgcGVybWl0dGVkLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0YXJnZXRFbGVtZW50KSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5zZW5kQ2xpY2sodGFyZ2V0RWxlbWVudCwgZXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIGNhbmNlbCwgc3RvcCB0cmFja2luZyB0aGUgY2xpY2suXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xufTtcblxuXG4vKipcbiAqIERldGVybWluZSBtb3VzZSBldmVudHMgd2hpY2ggc2hvdWxkIGJlIHBlcm1pdHRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Nb3VzZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBJZiBhIHRhcmdldCBlbGVtZW50IHdhcyBuZXZlciBzZXQgKGJlY2F1c2UgYSB0b3VjaCBldmVudCB3YXMgbmV2ZXIgZmlyZWQpIGFsbG93IHRoZSBldmVudFxuXHRpZiAoIXRoaXMudGFyZ2V0RWxlbWVudCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKGV2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFByb2dyYW1tYXRpY2FsbHkgZ2VuZXJhdGVkIGV2ZW50cyB0YXJnZXRpbmcgYSBzcGVjaWZpYyBlbGVtZW50IHNob3VsZCBiZSBwZXJtaXR0ZWRcblx0aWYgKCFldmVudC5jYW5jZWxhYmxlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBEZXJpdmUgYW5kIGNoZWNrIHRoZSB0YXJnZXQgZWxlbWVudCB0byBzZWUgd2hldGhlciB0aGUgbW91c2UgZXZlbnQgbmVlZHMgdG8gYmUgcGVybWl0dGVkO1xuXHQvLyB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLCBwcmV2ZW50IG5vbi10b3VjaCBjbGljayBldmVudHMgZnJvbSB0cmlnZ2VyaW5nIGFjdGlvbnMsXG5cdC8vIHRvIHByZXZlbnQgZ2hvc3QvZG91YmxlY2xpY2tzLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0aGlzLnRhcmdldEVsZW1lbnQpIHx8IHRoaXMuY2FuY2VsTmV4dENsaWNrKSB7XG5cblx0XHQvLyBQcmV2ZW50IGFueSB1c2VyLWFkZGVkIGxpc3RlbmVycyBkZWNsYXJlZCBvbiBGYXN0Q2xpY2sgZWxlbWVudCBmcm9tIGJlaW5nIGZpcmVkLlxuXHRcdGlmIChldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcblx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFBhcnQgb2YgdGhlIGhhY2sgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxuXHRcdFx0ZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBDYW5jZWwgdGhlIGV2ZW50XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIElmIHRoZSBtb3VzZSBldmVudCBpcyBwZXJtaXR0ZWQsIHJldHVybiB0cnVlIGZvciB0aGUgYWN0aW9uIHRvIGdvIHRocm91Z2guXG5cdHJldHVybiB0cnVlO1xufTtcblxuXG4vKipcbiAqIE9uIGFjdHVhbCBjbGlja3MsIGRldGVybWluZSB3aGV0aGVyIHRoaXMgaXMgYSB0b3VjaC1nZW5lcmF0ZWQgY2xpY2ssIGEgY2xpY2sgYWN0aW9uIG9jY3VycmluZ1xuICogbmF0dXJhbGx5IGFmdGVyIGEgZGVsYXkgYWZ0ZXIgYSB0b3VjaCAod2hpY2ggbmVlZHMgdG8gYmUgY2FuY2VsbGVkIHRvIGF2b2lkIGR1cGxpY2F0aW9uKSwgb3JcbiAqIGFuIGFjdHVhbCBjbGljayB3aGljaCBzaG91bGQgYmUgcGVybWl0dGVkLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgcGVybWl0dGVkO1xuXG5cdC8vIEl0J3MgcG9zc2libGUgZm9yIGFub3RoZXIgRmFzdENsaWNrLWxpa2UgbGlicmFyeSBkZWxpdmVyZWQgd2l0aCB0aGlyZC1wYXJ0eSBjb2RlIHRvIGZpcmUgYSBjbGljayBldmVudCBiZWZvcmUgRmFzdENsaWNrIGRvZXMgKGlzc3VlICM0NCkuIEluIHRoYXQgY2FzZSwgc2V0IHRoZSBjbGljay10cmFja2luZyBmbGFnIGJhY2sgdG8gZmFsc2UgYW5kIHJldHVybiBlYXJseS4gVGhpcyB3aWxsIGNhdXNlIG9uVG91Y2hFbmQgdG8gcmV0dXJuIGVhcmx5LlxuXHRpZiAodGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFZlcnkgb2RkIGJlaGF2aW91ciBvbiBpT1MgKGlzc3VlICMxOCk6IGlmIGEgc3VibWl0IGVsZW1lbnQgaXMgcHJlc2VudCBpbnNpZGUgYSBmb3JtIGFuZCB0aGUgdXNlciBoaXRzIGVudGVyIGluIHRoZSBpT1Mgc2ltdWxhdG9yIG9yIGNsaWNrcyB0aGUgR28gYnV0dG9uIG9uIHRoZSBwb3AtdXAgT1Mga2V5Ym9hcmQgdGhlIGEga2luZCBvZiAnZmFrZScgY2xpY2sgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2l0aCB0aGUgc3VibWl0LXR5cGUgaW5wdXQgZWxlbWVudCBhcyB0aGUgdGFyZ2V0LlxuXHRpZiAoZXZlbnQudGFyZ2V0LnR5cGUgPT09ICdzdWJtaXQnICYmIGV2ZW50LmRldGFpbCA9PT0gMCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cGVybWl0dGVkID0gdGhpcy5vbk1vdXNlKGV2ZW50KTtcblxuXHQvLyBPbmx5IHVuc2V0IHRhcmdldEVsZW1lbnQgaWYgdGhlIGNsaWNrIGlzIG5vdCBwZXJtaXR0ZWQuIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCB0aGUgY2hlY2sgZm9yICF0YXJnZXRFbGVtZW50IGluIG9uTW91c2UgZmFpbHMgYW5kIHRoZSBicm93c2VyJ3MgY2xpY2sgZG9lc24ndCBnbyB0aHJvdWdoLlxuXHRpZiAoIXBlcm1pdHRlZCkge1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHQvLyBJZiBjbGlja3MgYXJlIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cblx0cmV0dXJuIHBlcm1pdHRlZDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYWxsIEZhc3RDbGljaydzIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGxheWVyID0gdGhpcy5sYXllcjtcblxuXHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHR9XG5cblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQsIGZhbHNlKTtcblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMub25Ub3VjaENhbmNlbCwgZmFsc2UpO1xufTtcblxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgRmFzdENsaWNrIGlzIG5lZWRlZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cbiAqL1xuRmFzdENsaWNrLm5vdE5lZWRlZCA9IGZ1bmN0aW9uKGxheWVyKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG1ldGFWaWV3cG9ydDtcblx0dmFyIGNocm9tZVZlcnNpb247XG5cdHZhciBibGFja2JlcnJ5VmVyc2lvbjtcblxuXHQvLyBEZXZpY2VzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0b3VjaCBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRpZiAodHlwZW9mIHdpbmRvdy5vbnRvdWNoc3RhcnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBDaHJvbWUgdmVyc2lvbiAtIHplcm8gZm9yIG90aGVyIGJyb3dzZXJzXG5cdGNocm9tZVZlcnNpb24gPSArKC9DaHJvbWVcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcblxuXHRpZiAoY2hyb21lVmVyc2lvbikge1xuXG5cdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xuXG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XG5cdFx0XHRcdC8vIENocm9tZSBvbiBBbmRyb2lkIHdpdGggdXNlci1zY2FsYWJsZT1cIm5vXCIgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzg5KVxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIENocm9tZSAzMiBhbmQgYWJvdmUgd2l0aCB3aWR0aD1kZXZpY2Utd2lkdGggb3IgbGVzcyBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRcdFx0XHRpZiAoY2hyb21lVmVyc2lvbiA+IDMxICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBDaHJvbWUgZGVza3RvcCBkb2Vzbid0IG5lZWQgRmFzdENsaWNrIChpc3N1ZSAjMTUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdGlmIChkZXZpY2VJc0JsYWNrQmVycnkxMCkge1xuXHRcdGJsYWNrYmVycnlWZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcLyhbMC05XSopXFwuKFswLTldKikvKTtcblxuXHRcdC8vIEJsYWNrQmVycnkgMTAuMysgZG9lcyBub3QgcmVxdWlyZSBGYXN0Y2xpY2sgbGlicmFyeS5cblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vZnRsYWJzL2Zhc3RjbGljay9pc3N1ZXMvMjUxXG5cdFx0aWYgKGJsYWNrYmVycnlWZXJzaW9uWzFdID49IDEwICYmIGJsYWNrYmVycnlWZXJzaW9uWzJdID49IDMpIHtcblx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcblxuXHRcdFx0aWYgKG1ldGFWaWV3cG9ydCkge1xuXHRcdFx0XHQvLyB1c2VyLXNjYWxhYmxlPW5vIGVsaW1pbmF0ZXMgY2xpY2sgZGVsYXkuXG5cdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gd2lkdGg9ZGV2aWNlLXdpZHRoIChvciBsZXNzIHRoYW4gZGV2aWNlLXdpZHRoKSBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBJRTEwIHdpdGggLW1zLXRvdWNoLWFjdGlvbjogbm9uZSwgd2hpY2ggZGlzYWJsZXMgZG91YmxlLXRhcC10by16b29tIChpc3N1ZSAjOTcpXG5cdGlmIChsYXllci5zdHlsZS5tc1RvdWNoQWN0aW9uID09PSAnbm9uZScpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBGYXN0Q2xpY2sgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuRmFzdENsaWNrLmF0dGFjaCA9IGZ1bmN0aW9uKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0cmV0dXJuIG5ldyBGYXN0Q2xpY2sobGF5ZXIsIG9wdGlvbnMpO1xufTtcblxuXG5pZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblxuXHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdGRlZmluZShmdW5jdGlvbigpIHtcblx0XHQndXNlIHN0cmljdCc7XG5cdFx0cmV0dXJuIEZhc3RDbGljaztcblx0fSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gRmFzdENsaWNrLmF0dGFjaDtcblx0bW9kdWxlLmV4cG9ydHMuRmFzdENsaWNrID0gRmFzdENsaWNrO1xufSBlbHNlIHtcblx0d2luZG93LkZhc3RDbGljayA9IEZhc3RDbGljaztcbn1cbiIsInN0b3JlcyA9IHJlcXVpcmUgJy4vc3RvcmVzJ1xucm91dGVzID0gcmVxdWlyZSAnLi9yb3V0ZXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3RhdGljRmlsZXM6IF9fZGlybmFtZStcIi9wdWJsaWNcIlxuICBzdG9yZUlkOiBcInN0b3JlX3N0YXRlX2Zyb21fc2VydmVyXCJcbiAgYXBwSWQ6IFwiYXBwXCJcbiAgcm91dGVzOiByb3V0ZXNcbiAgc3RvcmVzOiBzdG9yZXMiLCJRID0gcmVxdWlyZSAncSdcblJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5JbmRleFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2luZGV4J1xuVGVhbVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3RlYW0nXG5QbGF5ZXJWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9wbGF5ZXInXG5HYW1lVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvZ2FtZSdcblNjaGVkdWxlVmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvc2NoZWR1bGUnXG5TdGFuZGluZ3NWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9zdGFuZGluZ3MnXG5TdGF0c1ZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3N0YXRzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIFwiL1wiOiAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKVxuICAgICAgQHN0b3JlLmZldGNoKFwic2NoZWR1bGVcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcInRlYW1zXCIpXG4gICAgXSwgKHN0YW5kaW5ncywgc2NoZWR1bGUsIHRlYW1zTGlzdCkgLT5cbiAgICAgIHRpdGxlOiBcIkV0dXNpdnVcIlxuICAgICAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVFbGVtZW50IEluZGV4VmlldyxcbiAgICAgICAgc3RhbmRpbmdzOiBzdGFuZGluZ3NcbiAgICAgICAgdGVhbXM6IHRlYW1zTGlzdFxuICAgICAgICBzY2hlZHVsZTogc2NoZWR1bGVcblxuICBcIi9qb3Vra3VlZXQvOmlkLzphY3RpdmU/XCI6IChpZCwgYWN0aXZlKSAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKVxuICAgICAgQHN0b3JlLmZldGNoKFwidGVhbVwiLCBpZDogaWQpXG4gICAgXSwgKHN0YW5kaW5ncywgdGVhbSkgLT5cblxuICAgICAgc3ViVGl0bGUgPSBzd2l0Y2ggYWN0aXZlXG4gICAgICAgIHdoZW4gXCJwZWxhYWphdFwiIHRoZW4gXCJQZWxhYWphdFwiXG4gICAgICAgIHdoZW4gXCJ0aWxhc3RvdFwiIHRoZW4gXCJUaWxhc3RvdFwiXG4gICAgICAgIGVsc2UgXCJPdHRlbHVvaGplbG1hXCJcblxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0IC0gI3t0ZWFtLmluZm8ubmFtZX0gLSAje3N1YlRpdGxlfVwiXG4gICAgICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUVsZW1lbnQgVGVhbVZpZXcsXG4gICAgICAgIGlkOiBpZFxuICAgICAgICBzdGFuZGluZ3M6IHN0YW5kaW5nc1xuICAgICAgICB0ZWFtOiB0ZWFtXG4gICAgICAgIGFjdGl2ZTogYWN0aXZlXG5cbiAgXCIvam91a2t1ZWV0LzppZC86cGlkLzpzbHVnXCI6IChpZCwgcGlkLCBzbHVnKSAtPlxuICAgIEBzdG9yZS5mZXRjaChcInRlYW1cIiwgaWQ6IGlkKS50aGVuICh0ZWFtKSAtPlxuICAgICAgcGxheWVyID0gdGVhbS5yb3N0ZXIuZmlsdGVyKChwbGF5ZXIpIC0+XG4gICAgICAgIHBsYXllci5pZCBpcyBcIiN7cGlkfS8je3NsdWd9XCJcbiAgICAgIClbMF1cbiAgICAgIHRpdGxlOiBcIlBlbGFhamF0IC0gI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVFbGVtZW50IFBsYXllclZpZXcsXG4gICAgICAgIGlkOiBwaWRcbiAgICAgICAgcGxheWVyOiBwbGF5ZXJcbiAgICAgICAgdGVhbTogdGVhbVxuXG4gIFwiL290dGVsdXRcIjogLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJzY2hlZHVsZVwiKS50aGVuIChzY2hlZHVsZSkgLT5cbiAgICAgIHRpdGxlOiBcIk90dGVsdW9oamVsbWFcIlxuICAgICAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVFbGVtZW50IFNjaGVkdWxlVmlldyxcbiAgICAgICAgc2NoZWR1bGU6IHNjaGVkdWxlXG5cbiAgXCIvb3R0ZWx1dC86aWQvOmFjdGl2ZT8vOmF3YXk/XCI6IChpZCwgYWN0aXZlLCBhd2F5KSAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInNjaGVkdWxlXCIpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lRXZlbnRzXCIsIGlkOiBpZClcbiAgICAgIEBzdG9yZS5mZXRjaChcImdhbWVMaW5ldXBzXCIsIGlkOiBpZClcbiAgICAgIEBzdG9yZS5mZXRjaChcImdhbWVTdGF0c1wiLCBpZDogaWQpXG4gICAgXSwgKHNjaGVkdWxlLCBldmVudHMsIGxpbmVVcHMsIHN0YXRzKSAtPlxuICAgICAgZ2FtZSA9IHNjaGVkdWxlLmZpbHRlcigoZykgLT5cbiAgICAgICAgZy5pZCBpcyBpZFxuICAgICAgKVswXVxuXG4gICAgICB0aXRsZTogXCJPdHRlbHUgLSAje2dhbWUuaG9tZX0gdnMgI3tnYW1lLmF3YXl9XCJcbiAgICAgIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlRWxlbWVudCBHYW1lVmlldyxcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIGdhbWU6IGdhbWVcbiAgICAgICAgZXZlbnRzOiBldmVudHNcbiAgICAgICAgbGluZVVwczogbGluZVVwc1xuICAgICAgICBzdGF0czogc3RhdHNcbiAgICAgICAgYWN0aXZlOiBhY3RpdmVcbiAgICAgICAgYXdheTogISFhd2F5XG5cbiAgXCIvc2FyamF0YXVsdWtrb1wiOiAtPlxuICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKS50aGVuIChzdGFuZGluZ3MpIC0+XG4gICAgICB0aXRsZTogXCJTYXJqYXRhdWx1a2tvXCJcbiAgICAgIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlRWxlbWVudCBTdGFuZGluZ3NWaWV3LFxuICAgICAgICBzdGFuZGluZ3M6IHN0YW5kaW5nc1xuXG4gIFwiL3RpbGFzdG90LzphY3RpdmU/XCI6IChhY3RpdmUpIC0+XG4gICAgQHN0b3JlLmZldGNoKFwic3RhdHNcIikudGhlbiAoc3RhdHMpIC0+XG4gICAgICB0aXRsZTogXCJUaWxhc3RvdFwiXG4gICAgICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUVsZW1lbnQgU3RhdHNWaWV3LFxuICAgICAgICBzdGF0czogc3RhdHNcbiAgICAgICAgYWN0aXZlOiBhY3RpdmUiLCJUZWFtc0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL3N0b3Jlcy90ZWFtcydcblNjaGVkdWxlQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vc3RvcmVzL3NjaGVkdWxlJ1xuU3RhbmRpbmdzQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vc3RvcmVzL3N0YW5kaW5ncydcblN0YXRzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9zdGF0cydcblRlYW1Nb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL3RlYW0nXG5HYW1lRXZlbnRzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9nYW1lX2V2ZW50cydcbkdhbWVMaW5ldXBzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9nYW1lX2xpbmV1cHMnXG5HYW1lU3RhdHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL2dhbWVfc3RhdHMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgdGVhbXM6IFRlYW1zQ29sbGVjdGlvblxuICBzY2hlZHVsZTogU2NoZWR1bGVDb2xsZWN0aW9uXG4gIHN0YW5kaW5nczogU3RhbmRpbmdzQ29sbGVjdGlvblxuICBzdGF0czogU3RhdHNNb2RlbFxuICB0ZWFtOiBUZWFtTW9kZWxcbiAgZ2FtZUV2ZW50czogR2FtZUV2ZW50c01vZGVsXG4gIGdhbWVMaW5ldXBzOiBHYW1lTGluZXVwc01vZGVsXG4gIGdhbWVTdGF0czogR2FtZVN0YXRzTW9kZWwiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuR2FtZUV2ZW50cyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcImdhbWVzL2V2ZW50cy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L2dhbWVzL2V2ZW50cy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVFdmVudHMiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuR2FtZUxpbmV1cHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJnYW1lcy9saW5ldXBzLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vZ2FtZXMvbGluZXVwcy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMaW5ldXBzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cbkdhbWVTdGF0cyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcImdhbWVzL3N0YXRzLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vZ2FtZXMvc3RhdHMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdHMiLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblNjaGVkdWxlID0gQ29sbGVjdGlvbi5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJzY2hlZHVsZVwiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vc2NoZWR1bGUuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU2NoZWR1bGUiLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblN0YW5kaW5ncyA9IENvbGxlY3Rpb24uZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic3RhbmRpbmdzXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS9zdGFuZGluZ3MuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRpbmdzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblN0YXRzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic3RhdHNcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3N0YXRzLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblRlYW0gPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJ0ZWFtcy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L3RlYW1zLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbSIsIkNvbGxlY3Rpb24gPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuQ29sbGVjdGlvblxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuVGVhbXMgPSBDb2xsZWN0aW9uLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInRlYW1zXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS90ZWFtcy5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG57Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5HYW1lRXZlbnRzID0gcmVxdWlyZSAnLi9nYW1lX2V2ZW50cydcbkdhbWVMaW5ldXBzID0gcmVxdWlyZSAnLi9nYW1lX2xpbmV1cHMnXG5HYW1lU3RhdHMgPSByZXF1aXJlICcuL2dhbWVfc3RhdHMnXG5cbkdhbWUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgbG9nbzogKHRlYW1OYW1lKSAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwge1wic3JjXCI6IChUZWFtcy5sb2dvKHRlYW1OYW1lKSksIFwiYWx0XCI6ICh0ZWFtTmFtZSl9KVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcInN0YXRzXCJcbiAgICAgIHdoZW4gXCJrZXRqdXRcIiB0aGVuIFwibGluZVVwc1wiXG4gICAgICBlbHNlIFwiZXZlbnRzXCJcblxuICAgIGdhbWUgPSBAcHJvcHMuZ2FtZVxuICAgIFtob3VycywgbWludXRlc10gPSBnYW1lLnRpbWUuc3BsaXQoXCI6XCIpXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcImdhbWVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHtcImNsYXNzTmFtZVwiOiBcImhvbWVcIiwgXCJ4c1wiOiAoNCksIFwibWRcIjogKDQpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgKGdhbWUuaG9tZSkpLFxuICAgICAgICAgIChAbG9nbyhnYW1lLmhvbWUpKVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJjbGFzc05hbWVcIjogXCJzY29yZVwiLCBcInhzXCI6ICg0KSwgXCJtZFwiOiAoNCl9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCAoZ2FtZS5ob21lU2NvcmUpLCBcIiAtIFwiLCAoZ2FtZS5hd2F5U2NvcmUpKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCAobW9tZW50KGdhbWUuZGF0ZSkuYWRkKGhvdXJzLCAnaG91cnMnKS5hZGQobWludXRlcywgJ21pbnV0ZXMnKS5mb3JtYXQoXCJERC5NTS5ZWVlZIEhIOm1tXCIpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJZbGVpc1xcdTAwZjZcXHUwMGU0OiBcIiwgKGdhbWUuYXR0ZW5kYW5jZSkpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJjbGFzc05hbWVcIjogXCJhd2F5XCIsIFwieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIChnYW1lLmF3YXkpKSxcbiAgICAgICAgICAoQGxvZ28oZ2FtZS5hd2F5KSlcbiAgICAgICAgKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfVwiLCBcImV2ZW50S2V5XCI6IFwiZXZlbnRzXCJ9LCBcIlRhcGFodHVtYXRcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfS90aWxhc3RvdFwiLCBcImV2ZW50S2V5XCI6IFwic3RhdHNcIn0sIFwiVGlsYXN0b3RcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfS9rZXRqdXRcIiwgXCJldmVudEtleVwiOiBcImxpbmVVcHNcIn0sIFwiS2V0anV0XCIpXG4gICAgICApLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYi1jb250ZW50XCIsIFwicmVmXCI6IFwicGFuZXNcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwiZXZlbnRzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJldmVudHNcIil9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2FtZUV2ZW50cywge1wiZXZlbnRzXCI6IChAcHJvcHMuZXZlbnRzKSwgXCJnYW1lXCI6IChAcHJvcHMuZ2FtZSl9KVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic3RhdHNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInN0YXRzXCIpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdhbWVTdGF0cywge1wiaWRcIjogKEBwcm9wcy5pZCksIFwic3RhdHNcIjogKEBwcm9wcy5zdGF0cyksIFwiYXdheVwiOiAoQHByb3BzLmF3YXkpfSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcImxpbmVVcHNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcImxpbmVVcHNcIil9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2FtZUxpbmV1cHMsIHtcImlkXCI6IChAcHJvcHMuaWQpLCBcImxpbmVVcHNcIjogKEBwcm9wcy5saW5lVXBzKX0pXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5HYW1lRXZlbnRzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBldmVudDogKGV2ZW50LCBpKSAtPlxuICAgIGlmIGV2ZW50LmhlYWRlclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoZXZlbnQuaGVhZGVyKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IFwiM1wifSwgKGV2ZW50LmhlYWRlcikpXG4gICAgICApXG4gICAgZWxzZSBpZiBldmVudC50ZWFtIGFuZCBldmVudC50aW1lXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge1wia2V5XCI6IChpKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoQHByb3BzLmdhbWVbZXZlbnQudGVhbV0pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChldmVudC50aW1lKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZXZlbnQudGV4dCkpXG4gICAgICApXG4gICAgZWxzZSBpZiBldmVudC50ZWFtIGFuZCBub3QgZXZlbnQudGltZVxuICAgICAgaG9tZSA9IGlmIGV2ZW50LnRlYW0gaXMgXCJob21lXCIgdGhlbiBldmVudC50ZXh0IGVsc2UgXCJcIlxuICAgICAgYXdheSA9IGlmIGV2ZW50LnRlYW0gaXMgXCJhd2F5XCIgdGhlbiBldmVudC50ZXh0IGVsc2UgXCJcIlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoaSl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGhvbWUpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGF3YXkpKVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKGkpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChldmVudC5ob21lKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZXZlbnQudGltZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGV2ZW50LmF3YXkpKVxuICAgICAgKVxuXG4gIHJlbmRlcjogLT5cbiAgICBwZXJpb2RFdmVudHMgPSBPYmplY3Qua2V5cyhfLnBpY2soQHByb3BzLmV2ZW50cywgXCIxLiBlcsOkXCIsIFwiMi4gZXLDpFwiLCBcIjMuIGVyw6RcIikpLnJlZHVjZSAoYXJyLCBrZXkpID0+XG4gICAgICBhcnIucHVzaCBoZWFkZXI6IGtleVxuICAgICAgYXJyID0gYXJyLmNvbmNhdCBAcHJvcHMuZXZlbnRzW2tleV1cbiAgICAgIGFyclxuICAgICwgW11cblxuICAgIG90aGVyRXZlbnRzID0gT2JqZWN0LmtleXMoXy5vbWl0KEBwcm9wcy5ldmVudHMsIFwiMS4gZXLDpFwiLCBcIjIuIGVyw6RcIiwgXCIzLiBlcsOkXCIpKS5yZWR1Y2UgKGFyciwga2V5KSA9PlxuICAgICAgYXJyLnB1c2ggaGVhZGVyOiBrZXlcbiAgICAgIGFyciA9IGFyci5jb25jYXQgQHByb3BzLmV2ZW50c1trZXldXG4gICAgICBhcnJcbiAgICAsIFtdXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIGdhbWUtZXZlbnRzXCJ9LFxuICAgICAgICAocGVyaW9kRXZlbnRzLm1hcCAoZXZlbnQsIGkpID0+XG4gICAgICAgICAgQGV2ZW50KGV2ZW50LCBpKVxuICAgICAgICApXG4gICAgICApLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCBnYW1lLWV2ZW50cyBvdGhlci1ldmVudHNcIn0sXG4gICAgICAgIChvdGhlckV2ZW50cy5tYXAgKGV2ZW50LCBpKSA9PlxuICAgICAgICAgIEBldmVudChldmVudCwgaSlcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lRXZlbnRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbntSb3csIENvbCwgR3JpZCwgT3ZlcmxheVRyaWdnZXIsIFRvb2x0aXB9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5UZWFtcyA9IHJlcXVpcmUgJy4uL2xpYi90ZWFtcydcblxuR2FtZUxpbmV1cHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGxpbmVUaXRsZTogKGkpIC0+XG4gICAgdGl0bGUgPSBpZiBpIDwgNFxuICAgICAgXCJLZW50dMOkICN7aSsxfVwiXG4gICAgZWxzZVxuICAgICAgXCJNYWFsaXZhaGRpdFwiXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDEyKX0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwgbnVsbCwgKHRpdGxlKSlcbiAgICApXG5cbiAgY29sdW1uOiAodHlwZSwgcGxheWVyLCB0ZWFtSWQpIC0+XG4gICAgY29sdW1uU2l6ZSA9IGlmIHR5cGUgaXMgXCJmb3J3YXJkXCIgdGhlbiAyIGVsc2UgM1xuICAgIGNvbnRlbnQgPSBpZiBwbGF5ZXJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3ZlcmxheVRyaWdnZXIsIHtcInBsYWNlbWVudFwiOiBcInRvcFwiLCBcIm92ZXJsYXlcIjogKEB0b29sdGlwKHBsYXllcikpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJwbGF5ZXIgI3t0ZWFtSWR9XCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7dGVhbUlkfS8je3BsYXllci5pZH1cIn0sIFwiI1wiLCAocGxheWVyLm51bWJlcikpXG4gICAgICAgIClcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBcIlwiXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHtcInhzXCI6IChjb2x1bW5TaXplKX0sXG4gICAgICAoY29udGVudClcbiAgICApXG5cbiAgdG9vbHRpcDogKHBsYXllcikgLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRvb2x0aXAsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgKHBsYXllcj8ubmFtZSkpKVxuXG4gIHJlbmRlcjogLT5cbiAgICBob21lVGVhbSA9IFRlYW1zLm5hbWVUb0lkKEBwcm9wcy5saW5lVXBzLmhvbWUudGVhbSlcbiAgICBhd2F5VGVhbSA9IFRlYW1zLm5hbWVUb0lkKEBwcm9wcy5saW5lVXBzLmF3YXkudGVhbSlcblxuICAgIGxpbmVzID0gQHByb3BzLmxpbmVVcHMuaG9tZS5saW5lcy5tYXAgKGxpbmUsIGkpID0+XG4gICAgICBhd2F5TGluZSA9IEBwcm9wcy5saW5lVXBzLmF3YXkubGluZXNbaV1cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR3JpZCwge1wia2V5XCI6IChcImxpbmUje2l9XCIpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXG4gICAgICAgICAgKEBsaW5lVGl0bGUoaSkpXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICAgIChAY29sdW1uKFwiZm9yd2FyZFwiLCBsaW5lLmZvcndhcmRzWzBdLCBob21lVGVhbSkpLFxuICAgICAgICAgIChAY29sdW1uKFwiZm9yd2FyZFwiLCBsaW5lLmZvcndhcmRzWzFdLCBob21lVGVhbSkpLFxuICAgICAgICAgIChAY29sdW1uKFwiZm9yd2FyZFwiLCBsaW5lLmZvcndhcmRzWzJdLCBob21lVGVhbSkpLFxuICAgICAgICAgIChAY29sdW1uKFwiZm9yd2FyZFwiLCBhd2F5TGluZS5mb3J3YXJkc1swXSwgYXdheVRlYW0pKSxcbiAgICAgICAgICAoQGNvbHVtbihcImZvcndhcmRcIiwgYXdheUxpbmUuZm9yd2FyZHNbMV0sIGF3YXlUZWFtKSksXG4gICAgICAgICAgKEBjb2x1bW4oXCJmb3J3YXJkXCIsIGF3YXlMaW5lLmZvcndhcmRzWzJdLCBhd2F5VGVhbSkpXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7XCJjbGFzc05hbWVcIjogXCJkZWZlbmRlcnNcIn0sXG4gICAgICAgICAgKEBjb2x1bW4oXCJkZWZlbmRlclwiLCBsaW5lLmRlZmVuZGVyc1swXSwgaG9tZVRlYW0pKSxcbiAgICAgICAgICAoQGNvbHVtbihcImRlZmVuZGVyXCIsIGxpbmUuZGVmZW5kZXJzWzFdLCBob21lVGVhbSkpLFxuICAgICAgICAgIChAY29sdW1uKFwiZGVmZW5kZXJcIiwgYXdheUxpbmUuZGVmZW5kZXJzWzBdLCBhd2F5VGVhbSkpLFxuICAgICAgICAgIChAY29sdW1uKFwiZGVmZW5kZXJcIiwgYXdheUxpbmUuZGVmZW5kZXJzWzFdLCBhd2F5VGVhbSkpXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7XCJjbGFzc05hbWVcIjogXCJnb2FsaWVzXCJ9LFxuICAgICAgICAgIChAY29sdW1uKFwiZ29hbGllXCIsIGxpbmUuZ29hbGllc1swXSwgaG9tZVRlYW0pKSxcbiAgICAgICAgICAoQGNvbHVtbihcImdvYWxpZVwiLCBsaW5lLmdvYWxpZXNbMV0sIGhvbWVUZWFtKSksXG4gICAgICAgICAgKEBjb2x1bW4oXCJnb2FsaWVcIiwgYXdheUxpbmUuZ29hbGllc1swXSwgYXdheVRlYW0pKSxcbiAgICAgICAgICAoQGNvbHVtbihcImdvYWxpZVwiLCBhd2F5TGluZS5nb2FsaWVzWzFdLCBhd2F5VGVhbSkpXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwiZ2FtZS1saW5ldXBzXCJ9LFxuICAgICAgKGxpbmVzKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lTGluZXVwcyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xue05hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuUGxheWVyU3RhdHMgPSByZXF1aXJlICcuL3BsYXllcl9zdGF0cydcbkdvYWxpZVN0YXRzID0gcmVxdWlyZSAnLi9nb2FsaWVfc3RhdHMnXG5cbkdhbWVTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIGhvbWVJZCA9IFRlYW1zLm5hbWVUb0lkKEBwcm9wcy5zdGF0cy5ob21lLnRlYW0pXG4gICAgYXdheUlkID0gVGVhbXMubmFtZVRvSWQoQHByb3BzLnN0YXRzLmF3YXkudGVhbSlcbiAgICBhY3RpdmVLZXkgPSBpZiBAcHJvcHMuYXdheSB0aGVuIFwiYXdheVwiIGVsc2UgXCJob21lXCJcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwiZ2FtZS1zdGF0c1wifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2LCB7XCJic1N0eWxlXCI6IFwidGFic1wiLCBcImFjdGl2ZUtleVwiOiAoYWN0aXZlS2V5KSwgXCJyZWZcIjogXCJ0YWJzXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je0Bwcm9wcy5pZH0vdGlsYXN0b3RcIiwgXCJldmVudEtleVwiOiBcImhvbWVcIn0sIChAcHJvcHMuc3RhdHMuaG9tZS50ZWFtKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfS90aWxhc3RvdC92aWVyYXNcIiwgXCJldmVudEtleVwiOiBcImF3YXlcIn0sIChAcHJvcHMuc3RhdHMuYXdheS50ZWFtKSlcbiAgICAgICksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFiLWNvbnRlbnRcIiwgXCJyZWZcIjogXCJwYW5lc1wifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJob21lXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJob21lXCIpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBsYXllclN0YXRzLCB7XCJ0ZWFtSWRcIjogKGhvbWVJZCksIFwic3RhdHNcIjogKEBwcm9wcy5zdGF0cy5ob21lLnBsYXllcnMpfSksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHb2FsaWVTdGF0cywge1widGVhbUlkXCI6IChob21lSWQpLCBcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMuaG9tZS5nb2FsaWVzKSwgXCJwbGF5ZWRBdExlYXN0XCI6ICgwKX0pXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwiYXdheVwiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwiYXdheVwiKX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQbGF5ZXJTdGF0cywge1widGVhbUlkXCI6IChhd2F5SWQpLCBcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMuYXdheS5wbGF5ZXJzKX0pLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR29hbGllU3RhdHMsIHtcInRlYW1JZFwiOiAoYXdheUlkKSwgXCJzdGF0c1wiOiAoQHByb3BzLnN0YXRzLmF3YXkuZ29hbGllcyksIFwicGxheWVkQXRMZWFzdFwiOiAoMCl9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGFibGVTb3J0TWl4aW4gPSByZXF1aXJlICcuL21peGlucy90YWJsZV9zb3J0J1xuXG5Hb2FsaWVTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgbWl4aW5zOiBbVGFibGVTb3J0TWl4aW5dXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHNvcnRGaWVsZDogXCJzYXZpbmdQZXJjZW50YWdlXCJcbiAgICBzb3J0RGlyZWN0aW9uOiBcImRlc2NcIlxuICAgIHNvcnRUeXBlOiBcImZsb2F0XCJcblxuICByZW5kZXI6IC0+XG4gICAgbWF4R2FtZXMgPSBfLm1heChAcHJvcHMuc3RhdHMsIChwbGF5ZXIpIC0+XG4gICAgICBwYXJzZUludChwbGF5ZXIuZ2FtZXMpXG4gICAgKS5nYW1lc1xuICAgIHBsYXllZEF0TGVhc3QgPSBpZiB0eXBlb2YgQHByb3BzLnBsYXllZEF0TGVhc3QgaXMgXCJudW1iZXJcIlxuICAgICAgcGFyc2VJbnQoKEBwcm9wcy5wbGF5ZWRBdExlYXN0IC8gMTAwKSAqIG1heEdhbWVzKVxuICAgIGVsc2VcbiAgICAgIDFcbiAgICBnb2FsaWVzID0gQHByb3BzLnN0YXRzLnNvcnQoQHNvcnQpLmZpbHRlciAocGxheWVyKSAtPlxuICAgICAgaWYgcGxheWVyLmdhbWVzXG4gICAgICAgIHBsYXllci5nYW1lcyA+PSBwbGF5ZWRBdExlYXN0XG4gICAgICBlbHNlXG4gICAgICAgIHRydWVcbiAgICAubWFwIChwbGF5ZXIpID0+XG4gICAgICB0ZWFtSWQgPSBAcHJvcHMudGVhbUlkIG9yIHBsYXllci50ZWFtSWRcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3t0ZWFtSWR9LyN7cGxheWVyLmlkfVwifSwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ2FtZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIud2lucykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci50aWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmxvc3NlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5zYXZlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5nb2Fsc0FsbG93ZWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuc2h1dG91dHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ29hbHNBdmVyYWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnNhdmluZ1BlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ29hbHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wb2ludHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucGVuYWx0aWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLndpblBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtcImNvbFNwYW5cIjogMn0sIChwbGF5ZXIubWludXRlcykpXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCB7XCJjbGFzc05hbWVcIjogXCJzb3J0YWJsZS10aGVhZFwiLCBcIm9uQ2xpY2tcIjogKEBzZXRTb3J0KX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJsYXN0TmFtZVwiLCBcImRhdGEtdHlwZVwiOiBcInN0cmluZ1wifSwgXCJOaW1pXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnYW1lc1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiUE9cIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcIndpbnNcIiwgXCJkYXRhLXR5cGVcIjogXCJpbnRlZ2VyXCJ9LCBcIlZcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInRpZXNcIiwgXCJkYXRhLXR5cGVcIjogXCJpbnRlZ2VyXCJ9LCBcIlRcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImxvc3Nlc1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiSFwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwic2F2ZXNcIiwgXCJkYXRhLXR5cGVcIjogXCJpbnRlZ2VyXCJ9LCBcIlRPXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0FsbG93ZWRcIiwgXCJkYXRhLXR5cGVcIjogXCJpbnRlZ2VyXCJ9LCBcIlBNXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJzaHV0b3V0c1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiTlBcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdvYWxzQXZlcmFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIktBXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJzYXZpbmdQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiVCVcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdvYWxzXCIsIFwiZGF0YS10eXBlXCI6IFwiaW50ZWdlclwifSwgXCJNXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJhc3Npc3RzXCIsIFwiZGF0YS10eXBlXCI6IFwiaW50ZWdlclwifSwgXCJTXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwb2ludHNcIiwgXCJkYXRhLXR5cGVcIjogXCJpbnRlZ2VyXCJ9LCBcIlBcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBlbmFsdGllc1wifSwgXCJSXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJ3aW5QZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiViVcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcIm1pbnV0ZXNcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwiLCBcImNvbFNwYW5cIjogMn0sIFwiQWlrYVwiKVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsXG4gICAgICAgIChnb2FsaWVzKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHb2FsaWVTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGVhbXNMaXN0ID0gcmVxdWlyZSAnLi90ZWFtc19saXN0J1xuU3RhbmRpbmdzVGFibGUgPSByZXF1aXJlICcuL3N0YW5kaW5nc190YWJsZSdcblJlY2VudFNjaGVkdWxlID0gcmVxdWlyZSAnLi9yZWNlbnRfc2NoZWR1bGUnXG5cbntHcmlkLCBSb3csIENvbH0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbkluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcImp1bWJvdHJvbiBmcm9udC1qdW1ib1wifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiTGlpZ2FPcGFzXCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBcIlNNLUxpaWdhbiB0aWxhc3RvdCBub3BlYXN0aSBqYSB2YWl2YXR0b21hc3RpXCIpXG4gICAgICApLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlYW1zTGlzdCwge1widGVhbXNcIjogKEBwcm9wcy50ZWFtcyl9KSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHcmlkLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDEyKSwgXCJzbVwiOiAoNil9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVjZW50U2NoZWR1bGUsIHtcInNjaGVkdWxlXCI6IChAcHJvcHMuc2NoZWR1bGUpfSlcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoMTIpLCBcInNtXCI6ICg2KX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDNcIiwgbnVsbCwgXCJTYXJqYXRhdWx1a2tvXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJzdGFuZGluZ3Mgc3RhbmRpbmdzLWZyb250IHRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3RhbmRpbmdzVGFibGUsIHtcInN0YW5kaW5nc1wiOiAoQHByb3BzLnN0YW5kaW5ncyl9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4IiwiVGFibGVTb3J0TWl4aW4gPVxuICBzZXRTb3J0OiAoZXZlbnQpIC0+XG4gICAgc29ydCA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnNvcnRcbiAgICBpZiBzb3J0XG4gICAgICB0eXBlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQudHlwZSBvciBcImludGVnZXJcIlxuICAgICAgaWYgQHN0YXRlLnNvcnRGaWVsZCBpcyBzb3J0XG4gICAgICAgIG5ld1NvcnQgPSBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIiB0aGVuIFwiYXNjXCIgZWxzZSBcImRlc2NcIlxuICAgICAgICBAc2V0U3RhdGUgc29ydERpcmVjdGlvbjogbmV3U29ydCwgc29ydFR5cGU6IHR5cGVcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldFN0YXRlIHNvcnRGaWVsZDogc29ydCwgc29ydFR5cGU6IHR5cGVcblxuICBzb3J0OiAoYSwgYikgLT5cbiAgICBzd2l0Y2ggQHN0YXRlLnNvcnRUeXBlXG4gICAgICB3aGVuIFwiaW50ZWdlclwiXG4gICAgICAgIGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiXG4gICAgICAgICAgKHBhcnNlSW50KGJbQHN0YXRlLnNvcnRGaWVsZF0pIHx8IDApIC0gKHBhcnNlSW50KGFbQHN0YXRlLnNvcnRGaWVsZF0pIHx8IDApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAocGFyc2VJbnQoYVtAc3RhdGUuc29ydEZpZWxkXSkgfHwgMCkgLSAocGFyc2VJbnQoYltAc3RhdGUuc29ydEZpZWxkXSkgfHwgMClcbiAgICAgIHdoZW4gXCJmbG9hdFwiXG4gICAgICAgIGFWYWx1ZSA9IE51bWJlcihhW0BzdGF0ZS5zb3J0RmllbGRdLnJlcGxhY2UoXCIlXCIsXCJcIikucmVwbGFjZSgvXFwsfFxcOi8sXCIuXCIpKSBvciAwXG4gICAgICAgIGJWYWx1ZSA9IE51bWJlcihiW0BzdGF0ZS5zb3J0RmllbGRdLnJlcGxhY2UoXCIlXCIsXCJcIikucmVwbGFjZSgvXFwsfFxcOi8sXCIuXCIpKSBvciAwXG4gICAgICAgIGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiXG4gICAgICAgICAgYlZhbHVlIC0gYVZhbHVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhVmFsdWUgLSBiVmFsdWVcbiAgICAgIHdoZW4gXCJzdHJpbmdcIlxuICAgICAgICBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIlxuICAgICAgICAgIGlmIGJbQHN0YXRlLnNvcnRGaWVsZF0gPCBhW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAtMVxuICAgICAgICAgIGVsc2UgaWYgYltAc3RhdGUuc29ydEZpZWxkXSA+IGFbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgICAgIDFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBhW0BzdGF0ZS5zb3J0RmllbGRdIDwgYltAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgLTFcbiAgICAgICAgICBlbHNlIGlmIGFbQHN0YXRlLnNvcnRGaWVsZF0gPiBiW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAxXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgMFxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlU29ydE1peGluIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG57TmF2YmFyLCBOYXYsIE5hdkl0ZW0sIERyb3Bkb3duQnV0dG9uLCBNZW51SXRlbX0gPSByZXF1aXJlIFwicmVhY3QtYm9vdHN0cmFwXCJcblxuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbk5hdmlnYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBicmFuZCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogXCIvXCIsIFwiY2xhc3NOYW1lXCI6IFwibmF2YmFyLWJyYW5kXCJ9LCBcIkxpaWdhT3Bhc1wiKVxuXG4gICAgdGVhbXMgPVxuICAgICAgIyBkaXNhYmxlIGZvciBub3csIHJlYWN0IGJvb3RzdHJhcCBpcyBidWdneSBvbiBtb2JpbGVcbiAgICAgICMgPERyb3Bkb3duQnV0dG9uIHRpdGxlPVwiSm91a2t1ZWV0XCI+XG4gICAgICAjICAge09iamVjdC5rZXlzKFRlYW1zLm5hbWVzQW5kSWRzKS5tYXAgKG5hbWUpIC0+XG4gICAgICAjICAgICA8TWVudUl0ZW0ga2V5PXtUZWFtcy5uYW1lc0FuZElkc1tuYW1lXX0gaHJlZj1cIi9qb3Vra3VlZXQvI3tUZWFtcy5uYW1lc0FuZElkc1tuYW1lXX1cIj57bmFtZX08L01lbnVJdGVtPlxuICAgICAgIyAgIH1cbiAgICAgICMgPC9Ecm9wZG93bkJ1dHRvbj5cbiAgICAgIG51bGxcblxuICAgIGlmIEBwcm9wcy5pdGVtXG4gICAgICBpdGVtID0gUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IChAcHJvcHMuaXRlbS51cmwpfSwgKEBwcm9wcy5pdGVtLnRpdGxlKSlcblxuICAgIGlmIEBwcm9wcy5kcm9wZG93blxuICAgICAgZHJvcGRvd24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duQnV0dG9uLCB7XCJ0aXRsZVwiOiAoQHByb3BzLmRyb3Bkb3duLnRpdGxlKX0sXG4gICAgICAgIChAcHJvcHMuZHJvcGRvd24uaXRlbXMubWFwIChpdGVtKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHtcImtleVwiOiAoaXRlbS50aXRsZSksIFwiaHJlZlwiOiAoaXRlbS51cmwpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhciwge1wiYnJhbmRcIjogKGJyYW5kKSwgXCJmaXhlZFRvcFwiOiB0cnVlLCBcInRvZ2dsZU5hdktleVwiOiAoMCl9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImNsYXNzTmFtZVwiOiBcImJzLW5hdmJhci1jb2xsYXBzZVwiLCBcImV2ZW50S2V5XCI6ICgwKSwgXCJyb2xlXCI6IFwibmF2aWdhdGlvblwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3NhcmphdGF1bHVra29cIn0sIFwiU2FyamF0YXVsdWtrb1wiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3RpbGFzdG90XCJ9LCBcIlRpbGFzdG90XCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dFwifSwgXCJPdHRlbHV0XCIpLFxuICAgICAgICAodGVhbXMpLFxuICAgICAgICAoaXRlbSksXG4gICAgICAgIChkcm9wZG93bilcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG5QbGF5ZXIgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBwbGF5ZXIgPSBAcHJvcHMucGxheWVyXG4gICAgdGVhbSA9IEBwcm9wcy50ZWFtXG4gICAgaXRlbSA9XG4gICAgICB0aXRsZTogdGVhbS5pbmZvLm5hbWVcbiAgICAgIHVybDogdGVhbS5pbmZvLnVybFxuXG4gICAgcGxheWVycyA9XG4gICAgICB0aXRsZTogXCJQZWxhYWphdFwiLFxuICAgICAgaXRlbXM6IHRlYW0ucm9zdGVyLm1hcCAocGxheWVyKSA9PlxuICAgICAgICB0aXRsZTogXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgIHVybDogXCIvam91a2t1ZWV0LyN7dGVhbS5pbmZvLmlkfS8je3BsYXllci5pZH1cIlxuXG4gICAgc3RhdHNUeXBlID0gaWYgcGxheWVyLnBvc2l0aW9uIGlzIFwiTVZcIiB0aGVuIFwiZ29hbGllc1wiIGVsc2UgXCJwbGF5ZXJzXCJcbiAgICBzdGF0cyA9IHRlYW0uc3RhdHNbc3RhdHNUeXBlXS5maWx0ZXIoKHBsYXllcikgPT5cbiAgICAgIFtpZCwgc2x1Z10gPSBwbGF5ZXIuaWQuc3BsaXQoXCIvXCIpXG4gICAgICBpZCBpcyBAcHJvcHMuaWRcbiAgICApWzBdIG9yIHt9XG5cbiAgICBwb3NpdGlvbiA9IHN3aXRjaCBwbGF5ZXIucG9zaXRpb25cbiAgICAgIHdoZW4gXCJPTFwiIHRoZW4gXCJPaWtlYSBsYWl0YWh5w7Zra8Okw6Rqw6RcIlxuICAgICAgd2hlbiBcIlZMXCIgdGhlbiBcIlZhc2VuIGxhaXRhaHnDtmtrw6TDpGrDpFwiXG4gICAgICB3aGVuIFwiS0hcIiB0aGVuIFwiS2Vza3VzaHnDtmtrw6TDpGrDpFwiXG4gICAgICB3aGVuIFwiVlBcIiB0aGVuIFwiVmFzZW4gcHVvbHVzdGFqYVwiXG4gICAgICB3aGVuIFwiT1BcIiB0aGVuIFwiT2lrZWEgcHVvbHVzdGFqYVwiXG4gICAgICB3aGVuIFwiTVZcIiB0aGVuIFwiTWFhbGl2YWh0aVwiXG5cbiAgICBiaXJ0aGRheSA9IG1vbWVudChwbGF5ZXIuYmlydGhkYXkpXG4gICAgc2hvb3RzID0gaWYgcGxheWVyLnNob290cyBpcyBcIkxcIiB0aGVuIFwiVmFzZW1tYWx0YVwiIGVsc2UgXCJPaWtlYWx0YVwiXG5cbiAgICBzdGF0c1RhYmxlID0gc3dpdGNoIHN0YXRzVHlwZVxuICAgICAgd2hlbiBcImdvYWxpZXNcIlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGVcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUE9cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlZcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlRcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkhcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlRPXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJQTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTlBcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIktBXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJUJVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiU1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUlwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiViVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkFpa2FcIilcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZ2FtZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy53aW5zKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMudGllcykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLmxvc3NlcykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnNhdmVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZ29hbHNBbGxvd2VkKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuc2h1dG91dHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5nb2Fsc0F2ZXJhZ2UpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5zYXZpbmdQZXJjZW50YWdlKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZ29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5hc3Npc3RzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMucG9pbnRzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMucGVuYWx0aWVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMud2luUGVyY2VudGFnZSkpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLm1pbnV0ZXMpKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgd2hlbiBcInBsYXllcnNcIlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGVcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiT1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiU1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUlwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiK1xceDJGLVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiK1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiLVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiWVZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJBVk1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJMXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJMJVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiQVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiQSVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkFpa2FcIilcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZ2FtZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5nb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLmFzc2lzdHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wb2ludHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wZW5hbHRpZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wbHVzTWludXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wbHVzc2VzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMubWludXNlcykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnBvd2VyUGxheUdvYWxzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuc2hvcnRIYW5kZWRHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLndpbm5pbmdHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnNob3RzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuc2hvb3RpbmdQZXJjZW50YWdlKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZmFjZW9mZnMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5mYWNlb2ZmUGVyY2VudGFnZSkpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnBsYXlpbmdUaW1lQXZlcmFnZSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInBsYXllclwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwge1wiZHJvcGRvd25cIjogKHBsYXllcnMpLCBcIml0ZW1cIjogKGl0ZW0pfSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtLWxvZ28gI3t0ZWFtLmluZm8uaWR9XCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmluZm8uaWR9XCJ9KSwgXCIgI1wiLCAocGxheWVyLm51bWJlcikpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJQZWxpcGFpa2thXCIpLCBcIiBcIiwgKHBvc2l0aW9uKSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJTeW50eW55dFwiKSwgXCIgXCIsIChiaXJ0aGRheS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSwgXCIgKFwiLCAobW9tZW50KCkuZGlmZihwbGF5ZXIuYmlydGhkYXksIFwieWVhcnNcIikpLCBcIiB2dW90aWFzKVwiKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIlBpdHV1c1wiKSwgXCIgXCIsIChwbGF5ZXIuaGVpZ2h0KSwgXCIgY21cIiksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJQYWlub1wiKSwgXCIgXCIsIChwbGF5ZXIud2VpZ2h0KSwgXCIga2dcIiksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJMYXVrb29cIiksIFwiIFwiLCAoc2hvb3RzKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgKHN0YXRzVGFibGUpXG4gICAgICApXG5cbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRhYmxlU29ydE1peGluID0gcmVxdWlyZSAnLi9taXhpbnMvdGFibGVfc29ydCdcblxuUGxheWVyU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIG1peGluczogW1RhYmxlU29ydE1peGluXVxuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBzb3J0RmllbGQ6IFwicG9pbnRzXCJcbiAgICBzb3J0RGlyZWN0aW9uOiBcImRlc2NcIlxuICAgIHNvcnRUeXBlOiBcImludGVnZXJcIlxuXG4gIHJlbmRlcjogLT5cbiAgICBsaW1pdCA9IGlmIEBwcm9wcy5saW1pdCB0aGVuIEBwcm9wcy5saW1pdCBlbHNlIEBwcm9wcy5zdGF0cy5sZW5ndGhcbiAgICBwbGF5ZXJzID0gQHByb3BzLnN0YXRzLnNvcnQoQHNvcnQpLnNsaWNlKDAsIGxpbWl0KS5tYXAgKHBsYXllcikgPT5cbiAgICAgIHRlYW1JZCA9IEBwcm9wcy50ZWFtSWQgb3IgcGxheWVyLnRlYW1JZFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je3RlYW1JZH0vI3twbGF5ZXIuaWR9XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5nYW1lcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5hc3Npc3RzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnBvaW50cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucGx1c01pbnVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnBsdXNzZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIubWludXNlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wb3dlclBsYXlHb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5zaG9ydEhhbmRlZEdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLndpbm5pbmdHb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5zaG90cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5zaG9vdGluZ1BlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZmFjZW9mZnMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZmFjZW9mZlBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucGxheWluZ1RpbWVBdmVyYWdlKSlcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRlYW0tcm9zdGVyXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIHtcImNsYXNzTmFtZVwiOiBcInNvcnRhYmxlLXRoZWFkXCIsIFwib25DbGlja1wiOiAoQHNldFNvcnQpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImxhc3ROYW1lXCIsIFwiZGF0YS10eXBlXCI6IFwic3RyaW5nXCJ9LCBcIk5pbWlcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdhbWVzXCIsIFwiZGF0YS10eXBlXCI6IFwiaW50ZWdlclwifSwgXCJPXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiTVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiYXNzaXN0c1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiU1wiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicG9pbnRzXCIsIFwiZGF0YS10eXBlXCI6IFwiaW50ZWdlclwifSwgXCJQXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwZW5hbHRpZXNcIiwgXCJkYXRhLXR5cGVcIjogXCJpbnRlZ2VyXCJ9LCBcIlJcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBsdXNNaW51c1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiK1xceDJGLVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicGx1c3Nlc1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiK1wiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwibWludXNlc1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiLVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicG93ZXJQbGF5R29hbHNcIiwgXCJkYXRhLXR5cGVcIjogXCJpbnRlZ2VyXCJ9LCBcIllWTVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwic2hvcnRIYW5kZWRHb2Fsc1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiQVZNXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJ3aW5uaW5nR29hbHNcIiwgXCJkYXRhLXR5cGVcIjogXCJpbnRlZ2VyXCJ9LCBcIlZNXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJzaG90c1wiLCBcImRhdGEtdHlwZVwiOiBcImludGVnZXJcIn0sIFwiTFwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwic2hvb3RpbmdQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiTCVcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImZhY2VvZmZzXCIsIFwiZGF0YS10eXBlXCI6IFwiaW50ZWdlclwifSwgXCJBXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJmYWNlb2ZmUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkElXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwbGF5aW5nVGltZUF2ZXJhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJBaWthXCIpXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIiwgbnVsbCxcbiAgICAgICAgKHBsYXllcnMpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG57TGlzdEdyb3VwLCBMaXN0R3JvdXBJdGVtfSA9IHJlcXVpcmUgJ3JlYWN0LWJvb3RzdHJhcCdcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5tb21lbnQubG9jYWxlKCdmaSdcbiAgbW9udGhzIDogW1xuICAgIFwiVGFtbWlrdXVcIiwgXCJIZWxtaWt1dVwiLCBcIk1hYWxpc2t1dVwiLCBcIkh1aHRpa3V1XCIsIFwiVG91a29rdXVcIiwgXCJLZXPDpGt1dVwiLCBcIkhlaW7DpGt1dVwiLFxuICAgIFwiRWxva3V1XCIsIFwiU3l5c2t1dVwiLCBcIkxva2FrdXVcIiwgXCJNYXJyYXNrdXVcIiwgXCJKb3VsdWt1dVwiXG4gIF1cbilcbm1vbWVudC5sb2NhbGUoJ2ZpJylcblxuUmVjZW50U2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGdyb3VwZWQ6IC0+XG4gICAgY3VycmVudCA9IG1vbWVudCgpXG4gICAgZ3JvdXBzID0gXy5ncm91cEJ5KEBwcm9wcy5zY2hlZHVsZSwgKGdhbWUpIC0+XG4gICAgICBbaG91ciwgbWludXRlc10gPSBnYW1lLnRpbWUuc3BsaXQoXCI6XCIpXG4gICAgICBkYXRlVGltZSA9IG1vbWVudChnYW1lLmRhdGUpLnNldCgnaG91cicsIGhvdXIpLnNldCgnbWludXRlJywgbWludXRlcylcbiAgICAgIGRhdGVUaW1lRW5kID0gbW9tZW50KGRhdGVUaW1lKS5hZGQoMi41LCAnaG91cnMnKVxuICAgICAgaWYgY3VycmVudCA+IGRhdGVUaW1lXG4gICAgICAgIGlmIGN1cnJlbnQgPCBkYXRlVGltZUVuZFxuICAgICAgICAgIFwib25nb2luZ1wiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBcInBhc3RcIlxuICAgICAgZWxzZVxuICAgICAgICBcImZ1dHVyZVwiXG4gICAgKVxuICAgIGZpcnN0RnV0dXJlID0gZ3JvdXBzLmZ1dHVyZVswXVxuICAgIFsuLi4sIGxhc3RQYXN0XSA9IGdyb3Vwcy5wYXN0XG5cbiAgICBmdXR1cmU6IF8uZmlsdGVyKGdyb3Vwcy5mdXR1cmUsIChnYW1lKSAtPlxuICAgICAgZ2FtZS5kYXRlIGlzIGZpcnN0RnV0dXJlLmRhdGVcbiAgICApXG4gICAgcGFzdDogXy5maWx0ZXIoZ3JvdXBzLnBhc3QsIChnYW1lKSAtPlxuICAgICAgZ2FtZS5kYXRlIGlzIGxhc3RQYXN0LmRhdGVcbiAgICApXG4gICAgb25nb2luZzogZ3JvdXBzLm9uZ29pbmcgb3IgW11cblxuICByZW5kZXI6IC0+XG4gICAgZ3JvdXBlZCA9IEBncm91cGVkKClcbiAgICBvbmdvaW5nID0gaWYgZ3JvdXBlZC5vbmdvaW5nLmxlbmd0aFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJvbmdvaW5nXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDRcIiwgbnVsbCwgXCJLXFx1MDBlNHlubmlzc1xcdTAwZTRcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGlzdEdyb3VwLCBudWxsLFxuICAgICAgICAoZ3JvdXBlZC5vbmdvaW5nLm1hcCAoZ2FtZSkgLT5cbiAgICAgICAgICB0ZWFtcyA9IFwiI3tnYW1lLmhvbWV9IC0gI3tnYW1lLmF3YXl9XCJcbiAgICAgICAgICB1cmwgPSBcImh0dHA6Ly9saWlnYS5maS9vdHRlbHV0LzIwMTQtMjAxNS9ydW5rb3NhcmphLyN7Z2FtZS5pZH0vc2V1cmFudGEvXCJcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpc3RHcm91cEl0ZW0sIHtcImtleVwiOiAoZ2FtZS5pZCksIFwiaGVhZGVyXCI6ICh0ZWFtcyksIFwiaHJlZlwiOiAodXJsKX0sIFwib3R0ZWx1IGFsa2FudXQgXCIsIChnYW1lLnRpbWUpKVxuICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBudWxsXG5cbiAgICBwYXN0ID0gaWYgZ3JvdXBlZC5wYXN0XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInBhc3RcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNFwiLCBudWxsLCBcIkVkZWxsaXNldCAoXCIsIChtb21lbnQoZ3JvdXBlZC5wYXN0WzBdLmRhdGUpLmZvcm1hdChcIkRELk1NXCIpKSwgXCIpXCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpc3RHcm91cCwgbnVsbCxcbiAgICAgICAgKGdyb3VwZWQucGFzdC5tYXAgKGdhbWUpIC0+XG4gICAgICAgICAgc2NvcmUgPSBpZiBnYW1lLmhvbWVTY29yZSBhbmQgZ2FtZS5hd2F5U2NvcmUgdGhlbiBcIiN7Z2FtZS5ob21lU2NvcmV9LSN7Z2FtZS5hd2F5U2NvcmV9XCIgZWxzZSBcIlwiXG4gICAgICAgICAgdGVhbXMgPSBcIiN7Z2FtZS5ob21lfSAtICN7Z2FtZS5hd2F5fSAje3Njb3JlfVwiXG4gICAgICAgICAgdXJsID0gXCIvb3R0ZWx1dC8je2dhbWUuaWR9XCJcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpc3RHcm91cEl0ZW0sIHtcImtleVwiOiAoZ2FtZS5pZCksIFwiaGVhZGVyXCI6ICh0ZWFtcyksIFwiaHJlZlwiOiAodXJsKX0pXG4gICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIG51bGxcblxuICAgIGZ1dHVyZSA9IGlmIGdyb3VwZWQuZnV0dXJlXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcImZ1dHVyZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIG51bGwsIFwiU2V1cmFhdmF0IChcIiwgKG1vbWVudChncm91cGVkLmZ1dHVyZVswXS5kYXRlKS5mb3JtYXQoXCJERC5NTVwiKSksIFwiKVwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0R3JvdXAsIG51bGwsXG4gICAgICAgIChncm91cGVkLmZ1dHVyZS5tYXAgKGdhbWUpIC0+XG4gICAgICAgICAgdGVhbXMgPSBcIiN7Z2FtZS5ob21lfSAtICN7Z2FtZS5hd2F5fVwiXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0R3JvdXBJdGVtLCB7XCJrZXlcIjogKGdhbWUuaWQpLCBcImhlYWRlclwiOiAodGVhbXMpfSwgXCJvdHRlbHUgYWxrYWEgXCIsIChnYW1lLnRpbWUpKVxuICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBudWxsXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInJlY2VudC1zY2hlZHVsZVwifSxcbiAgICAgIChvbmdvaW5nKSxcbiAgICAgIChwYXN0KSxcbiAgICAgIChmdXR1cmUpXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY2VudFNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5TY2hlZHVsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIGZpcnN0RGF0ZTogbW9tZW50KCkuc3RhcnRPZihcIm1vbnRoXCIpXG4gICAgbGFzdERhdGU6IG1vbWVudCgpLmVuZE9mKFwibW9udGhcIilcbiAgICBwcmV2aW91c1Zpc2libGU6IGZhbHNlXG4gICAgbmV4dFZpc2libGU6IGZhbHNlXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICBtb250aFJhbmdlczogLT5cbiAgICBbZmlyc3RHYW1lLCAuLi4sIGxhc3RHYW1lXSA9IEBwcm9wcy5zY2hlZHVsZVxuICAgIFttb21lbnQoZmlyc3RHYW1lLmRhdGUpLnN0YXJ0T2YoXCJtb250aFwiKSwgbW9tZW50KGxhc3RHYW1lLmRhdGUpLmVuZE9mKFwibW9udGhcIildXG5cbiAgZ2FtZUxpbms6IChnYW1lKSAtPlxuICAgIGlmIG1vbWVudChnYW1lLmRhdGUpLmVuZE9mKFwiZGF5XCIpIDwgbW9tZW50KClcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je2dhbWUuaWR9XCJ9LCAoZ2FtZS5ob21lKSwgXCIgLSBcIiwgKGdhbWUuYXdheSkpXG4gICAgZWxzZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgKGdhbWUuaG9tZSksIFwiIC0gXCIsIChnYW1lLmF3YXkpKVxuXG4gIHNob3dQcmV2aW91czogLT5cbiAgICBpZiBub3QgQHN0YXRlLnByZXZpb3VzVmlzaWJsZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjbGFzc05hbWVcIjogXCJsb2FkLW1vcmVcIiwgXCJjb2xTcGFuXCI6IDQsIFwib25DbGlja1wiOiAoQGxvYWRQcmV2aW91cyl9LCBcIk5cXHUwMGU0eXRcXHUwMGU0IGVkZWxsaXNldCBrdXVrYXVkZXQuLi5cIilcbiAgICAgICAgKVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIG51bGxcblxuICBzaG93TmV4dDogLT5cbiAgICBpZiBub3QgQHN0YXRlLm5leHRWaXNpYmxlXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNsYXNzTmFtZVwiOiBcImxvYWQtbW9yZVwiLCBcImNvbFNwYW5cIjogNCwgXCJvbkNsaWNrXCI6IChAbG9hZE5leHQpfSwgXCJOXFx1MDBlNHl0XFx1MDBlNCBzZXVyYWF2YXQga3V1a2F1ZGV0Li4uXCIpXG4gICAgICAgIClcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBudWxsXG5cbiAgbG9hZFByZXZpb3VzOiAtPlxuICAgIFtmaXJzdERhdGVdID0gQG1vbnRoUmFuZ2VzKClcbiAgICBAc2V0U3RhdGUoZmlyc3REYXRlOiBmaXJzdERhdGUsIHByZXZpb3VzVmlzaWJsZTogdHJ1ZSlcblxuICBsb2FkTmV4dDogLT5cbiAgICBbLi4uLCBsYXN0RGF0ZV0gPSBAbW9udGhSYW5nZXMoKVxuICAgIEBzZXRTdGF0ZShsYXN0RGF0ZTogbGFzdERhdGUsIG5leHRWaXNpYmxlOiB0cnVlKVxuXG4gIGdyb3VwZWRTY2hlZHVsZTogLT5cbiAgICBfLmNoYWluKEBwcm9wcy5zY2hlZHVsZSkuZmlsdGVyIChnYW1lKSA9PlxuICAgICAgZ2FtZURhdGUgPSBtb21lbnQoZ2FtZS5kYXRlKVxuICAgICAgZ2FtZURhdGUgPj0gQHN0YXRlLmZpcnN0RGF0ZSBhbmQgZ2FtZURhdGUgPD0gQHN0YXRlLmxhc3REYXRlXG4gICAgLmdyb3VwQnkgKGdhbWUpIC0+XG4gICAgICBtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgbW9udGhseUdhbWVzOiAtPlxuICAgIEBncm91cGVkU2NoZWR1bGUoKS5tYXAgKGdhbWVzLCBtb250aCkgPT5cbiAgICAgIGRhdGVzV2l0aEdhbWVzID0gXy5jaGFpbihnYW1lcykuZ3JvdXBCeSAoZ2FtZSkgLT5cbiAgICAgICAgbW9tZW50KGdhbWUuZGF0ZSkuZm9ybWF0KFwiREQuTU0uWVlZWVwiKVxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IDR9LCAobW9tZW50KG1vbnRoLCBcIllZWVktTU1cIikuZm9ybWF0KFwiTU1NTVwiKSkpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICAoZGF0ZXNXaXRoR2FtZXMubWFwIChnYW1lcywgZ2FtZURhdGUpID0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNsYXNzTmFtZVwiOiBcImdhbWUtZGF0ZVwiLCBcImNvbFNwYW5cIjogNH0sIChnYW1lRGF0ZSkpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgKGdhbWVzLm1hcCAoZ2FtZSkgPT5cbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoZ2FtZS5pZCl9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZ2FtZS50aW1lKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChAZ2FtZUxpbmsoZ2FtZSkpKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGdhbWUuaG9tZVNjb3JlKSwgXCItXCIsIChnYW1lLmF3YXlTY29yZSkpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZ2FtZS5hdHRlbmRhbmNlKSlcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInNjaGVkdWxlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiT3R0ZWx1b2hqZWxtYVwiKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICAoQHNob3dQcmV2aW91cygpKSxcbiAgICAgICAgKEBtb250aGx5R2FtZXMoKSksXG4gICAgICAgIChAc2hvd05leHQoKSlcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU2NoZWR1bGUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblN0YW5kaW5nc1RhYmxlID0gcmVxdWlyZSAnLi9zdGFuZGluZ3NfdGFibGUnXG5cblN0YW5kaW5ncyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiU2FyamF0YXVsdWtrb1wiKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJzdGFuZGluZ3MgdGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTdGFuZGluZ3NUYWJsZSwge1wic3RhbmRpbmdzXCI6IChAcHJvcHMuc3RhbmRpbmdzKX0pXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YW5kaW5ncyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGFibGVTb3J0TWl4aW4gPSByZXF1aXJlICcuL21peGlucy90YWJsZV9zb3J0J1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cblN0YW5kaW5nc1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBtaXhpbnM6IFtUYWJsZVNvcnRNaXhpbl1cblxuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgc29ydEZpZWxkOiBcInBvaW50c1wiXG4gICAgc29ydERpcmVjdGlvbjogXCJkZXNjXCJcbiAgICBzb3J0VHlwZTogXCJpbnRlZ2VyXCJcblxuICByZW5kZXI6IC0+XG4gICAgc3RhbmRpbmdzID0gQHByb3BzLnN0YW5kaW5ncy5zb3J0KEBzb3J0KS5tYXAgKHRlYW0sIGkpIC0+XG4gICAgICByb3dDbGFzcyA9IHN3aXRjaFxuICAgICAgICB3aGVuIGkgaXMgNlxuICAgICAgICAgIFwiaW5cIlxuICAgICAgICB3aGVuIGkgaXMgMTBcbiAgICAgICAgICBcIm1heWJlXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFwiXCJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJjbGFzc05hbWVcIjogKHJvd0NsYXNzKSwgXCJrZXlcIjogKHRlYW0ubmFtZSl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0ucG9zaXRpb24pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7VGVhbXMubmFtZVRvSWQodGVhbS5uYW1lKX1cIn0sICh0ZWFtLm5hbWUpKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS5nYW1lcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0ud2lucykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0udGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0ubG9zZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLmV4dHJhUG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS5wb2ludHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtcImNsYXNzTmFtZVwiOiBcImhpZGUtb24tbW9iaWxlXCJ9LCAodGVhbS5nb2Fsc0ZvcikpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge1wiY2xhc3NOYW1lXCI6IFwiaGlkZS1vbi1tb2JpbGVcIn0sICh0ZWFtLmdvYWxzQWdhaW5zdCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge1wiY2xhc3NOYW1lXCI6IFwiaGlkZS1vbi1tb2JpbGVcIn0sICh0ZWFtLnBvd2VycGxheVBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtcImNsYXNzTmFtZVwiOiBcImhpZGUtb24tbW9iaWxlXCJ9LCAodGVhbS5zaG9ydGhhbmRQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7XCJjbGFzc05hbWVcIjogXCJoaWRlLW9uLW1vYmlsZVwifSwgKHRlYW0ucG9pbnRzUGVyR2FtZSkpXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCB7XCJjbGFzc05hbWVcIjogXCJzb3J0YWJsZS10aGVhZFwiLCBcIm9uQ2xpY2tcIjogKEBzZXRTb3J0KX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdhbWVzXCJ9LCBcIk9cIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcIndpbnNcIn0sIFwiVlwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwidGllc1wifSwgXCJUXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJsb3Nlc1wifSwgXCJIXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJleHRyYVBvaW50c1wifSwgXCJMUFwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicG9pbnRzXCJ9LCBcIlBcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNsYXNzTmFtZVwiOiBcImhpZGUtb24tbW9iaWxlXCIsIFwiZGF0YS1zb3J0XCI6IFwiZ29hbHNGb3JcIn0sIFwiVE1cIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNsYXNzTmFtZVwiOiBcImhpZGUtb24tbW9iaWxlXCIsIFwiZGF0YS1zb3J0XCI6IFwiZ29hbHNBZ2FpbnN0XCJ9LCBcIlBNXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjbGFzc05hbWVcIjogXCJoaWRlLW9uLW1vYmlsZVwiLCBcImRhdGEtc29ydFwiOiBcInBvd2VycGxheVBlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJZViVcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNsYXNzTmFtZVwiOiBcImhpZGUtb24tbW9iaWxlXCIsIFwiZGF0YS1zb3J0XCI6IFwic2hvcnRoYW5kUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkFWJVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiY2xhc3NOYW1lXCI6IFwiaGlkZS1vbi1tb2JpbGVcIiwgXCJkYXRhLXNvcnRcIjogXCJwb2ludHNQZXJHYW1lXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiUFxceDJGT1wiKVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsXG4gICAgICAgIChzdGFuZGluZ3MpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YW5kaW5nc1RhYmxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG57VGFiUGFuZSwgTmF2LCBOYXZJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuUGxheWVyU3RhdHMgPSByZXF1aXJlICcuL3BsYXllcl9zdGF0cydcbkdvYWxpZVN0YXRzID0gcmVxdWlyZSAnLi9nb2FsaWVfc3RhdHMnXG5cblN0YXRzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcIm1hYWxpdmFoZGl0XCIgdGhlbiBcImdvYWxpZXNcIlxuICAgICAgZWxzZSBcInBsYXllcnNcIlxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiVGlsYXN0b3RcIiksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3RpbGFzdG90XCIsIFwiZXZlbnRLZXlcIjogXCJwbGF5ZXJzXCJ9LCBcIktlbnR0XFx1MDBlNHBlbGFhamF0XCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi90aWxhc3RvdC9tYWFsaXZhaGRpdFwiLCBcImV2ZW50S2V5XCI6IFwiZ29hbGllc1wifSwgXCJNYWFsaXZhaGRpdFwiKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYi1jb250ZW50XCIsIFwicmVmXCI6IFwicGFuZXNcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJwbGF5ZXJzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJwbGF5ZXJzXCIpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIktlbnR0XFx1MDBlNHBlbGFhamF0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBsYXllclN0YXRzLCB7XCJzdGF0c1wiOiAoQHByb3BzLnN0YXRzLnNjb3JpbmdTdGF0cyksIFwibGltaXRcIjogKDEwMCl9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJnb2FsaWVzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJnb2FsaWVzXCIpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIk1hYWxpdmFoZGl0ICh5bGkgMjUlIHBlbGFubmVldClcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR29hbGllU3RhdHMsIHtcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMuZ29hbGllU3RhdHMpLCBcInBsYXllZEF0TGVhc3RcIjogKDI1KX0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5UZWFtU2NoZWR1bGUgPSByZXF1aXJlICcuL3RlYW1fc2NoZWR1bGUnXG5UZWFtU3RhdHMgPSByZXF1aXJlICcuL3RlYW1fc3RhdHMnXG5UZWFtUm9zdGVyID0gcmVxdWlyZSAnLi90ZWFtX3Jvc3Rlcidcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UZWFtcyA9IHJlcXVpcmUgJy4uL2xpYi90ZWFtcydcblxue1RhYlBhbmUsIEp1bWJvdHJvbiwgQnV0dG9uVG9vbGJhciwgQnV0dG9uLCBDb2wsIFJvdywgTmF2LCBOYXZJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuXG5UZWFtID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIGxvZ286IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XCJzcmNcIjogKFRlYW1zLmxvZ28oQHByb3BzLnRlYW0uaW5mby5uYW1lKSksIFwiYWx0XCI6IChAcHJvcHMudGVhbS5pbmZvLm5hbWUpfSlcblxuICByZW5kZXI6IC0+XG4gICAgYWN0aXZlS2V5ID0gc3dpdGNoIEBwcm9wcy5hY3RpdmVcbiAgICAgIHdoZW4gXCJwZWxhYWphdFwiIHRoZW4gXCJwbGF5ZXJzXCJcbiAgICAgIHdoZW4gXCJ0aWxhc3RvdFwiIHRoZW4gXCJzdGF0c1wiXG4gICAgICBlbHNlIFwic2NoZWR1bGVcIlxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEp1bWJvdHJvbiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoMTIpLCBcIm1kXCI6ICg2KX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCAoQGxvZ28oKSksIFwiIFwiLCAoQHByb3BzLnRlYW0uaW5mby5uYW1lKSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDEyKSwgXCJtZFwiOiAoNil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRlYW0tY29udGFpbmVyXCJ9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmxvbmdOYW1lKSksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8uYWRkcmVzcykpLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmVtYWlsKSlcbiAgICAgICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtcImJzU3R5bGVcIjogXCJwcmltYXJ5XCIsIFwiYnNTaXplXCI6IFwibGFyZ2VcIiwgXCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLnRpY2tldHNVcmwpfSwgXCJMaXB1dFwiKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7XCJic1N0eWxlXCI6IFwicHJpbWFyeVwiLCBcImJzU2l6ZVwiOiBcImxhcmdlXCIsIFwiaHJlZlwiOiAoQHByb3BzLnRlYW0uaW5mby5sb2NhdGlvblVybCl9LCBcIkhhbGxpbiBzaWphaW50aVwiKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLmlkfVwiLCBcImV2ZW50S2V5XCI6IFwic2NoZWR1bGVcIn0sIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMuaWR9L3RpbGFzdG90XCIsIFwiZXZlbnRLZXlcIjogXCJzdGF0c1wifSwgXCJUaWxhc3RvdFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMuaWR9L3BlbGFhamF0XCIsIFwiZXZlbnRLZXlcIjogXCJwbGF5ZXJzXCJ9LCBcIlBlbGFhamF0XCIpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYi1jb250ZW50XCIsIFwicmVmXCI6IFwicGFuZXNcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInNjaGVkdWxlXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJzY2hlZHVsZVwiKX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCBcIk90dGVsdXRcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVNjaGVkdWxlLCB7XCJ0ZWFtXCI6IChAcHJvcHMudGVhbSl9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic3RhdHNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInN0YXRzXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiVGlsYXN0b3RcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVN0YXRzLCB7XCJ0ZWFtSWRcIjogKEBwcm9wcy5pZCksIFwic3RhdHNcIjogKEBwcm9wcy50ZWFtLnN0YXRzKX0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJwbGF5ZXJzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJwbGF5ZXJzXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiUGVsYWFqYXRcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVJvc3Rlciwge1widGVhbUlkXCI6IChAcHJvcHMuaWQpLCBcInJvc3RlclwiOiAoQHByb3BzLnRlYW0ucm9zdGVyKX0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbVJvc3RlciA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZ3JvdXBlZFJvc3RlcjogLT5cbiAgICBfLmNoYWluKEBwcm9wcy5yb3N0ZXIpXG4gICAgLmdyb3VwQnkoKHBsYXllcikgLT4gcGxheWVyLnBvc2l0aW9uKVxuICAgIC5yZWR1Y2UoKHJlc3VsdCwgcGxheWVyLCBwb3NpdGlvbikgLT5cbiAgICAgIGdyb3VwID0gc3dpdGNoXG4gICAgICAgIHdoZW4gXy5pbmNsdWRlKFtcIktIXCIsIFwiT0xcIiwgXCJWTFwiXSwgcG9zaXRpb24pIHRoZW4gXCJIecO2a2vDpMOkasOkdFwiXG4gICAgICAgIHdoZW4gXy5pbmNsdWRlKFtcIk9QXCIsIFwiVlBcIl0sIHBvc2l0aW9uKSB0aGVuIFwiUHVvbHVzdGFqYXRcIlxuICAgICAgICB3aGVuIHBvc2l0aW9uIGlzIFwiTVZcIiB0aGVuIFwiTWFhbGl2YWhkaXRcIlxuICAgICAgcmVzdWx0W2dyb3VwXSB8fD0gW11cbiAgICAgIHJlc3VsdFtncm91cF0ucHVzaCBwbGF5ZXJcbiAgICAgIHJlc3VsdFxuICAgICwge30pXG5cbiAgcmVuZGVyOiAtPlxuICAgIGdyb3VwcyA9IEBncm91cGVkUm9zdGVyKCkubWFwIChwbGF5ZXJzLCBncm91cCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCB7XCJrZXlcIjogKGdyb3VwKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IDZ9LCAoZ3JvdXApKVxuICAgICAgICApLFxuICAgICAgICAoXy5jaGFpbihwbGF5ZXJzKS5mbGF0dGVuKCkubWFwIChwbGF5ZXIpID0+XG4gICAgICAgICAgdXJsID0gXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJcbiAgICAgICAgICB0aXRsZSA9IFwiI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogKHVybCl9LCAodGl0bGUpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCAocGxheWVyLm51bWJlcikpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmhlaWdodCkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIud2VpZ2h0KSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5zaG9vdHMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAobW9tZW50KCkuZGlmZihwbGF5ZXIuYmlydGhkYXksIFwieWVhcnNcIikpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtLXJvc3RlciB0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1yb3N0ZXJcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTmltaVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk51bWVyb1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlBpdHV1c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlBhaW5vXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiS1xcdTAwZTR0aXN5eXNcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJJa1xcdTAwZTRcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChncm91cHMpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1Sb3N0ZXIiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5tb21lbnQubG9jYWxlKCdmaSdcbiAgbW9udGhzIDogW1xuICAgIFwiVGFtbWlrdXVcIiwgXCJIZWxtaWt1dVwiLCBcIk1hYWxpc2t1dVwiLCBcIkh1aHRpa3V1XCIsIFwiVG91a29rdXVcIiwgXCJLZXPDpGt1dVwiLCBcIkhlaW7DpGt1dVwiLFxuICAgIFwiRWxva3V1XCIsIFwiU3l5c2t1dVwiLCBcIkxva2FrdXVcIiwgXCJNYXJyYXNrdXVcIiwgXCJKb3VsdWt1dVwiXG4gIF1cbilcbm1vbWVudC5sb2NhbGUoJ2ZpJylcblxuVGVhbVNjaGVkdWxlID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBnYW1lTGluazogKGdhbWUpIC0+XG4gICAgaWYgbW9tZW50KGdhbWUuZGF0ZSkgPCBtb21lbnQoKVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7Z2FtZS5pZH1cIn0sIChAdGl0bGVTdHlsZShnYW1lLmhvbWUpKSwgXCIgLSBcIiwgKEB0aXRsZVN0eWxlKGdhbWUuYXdheSkpKVxuICAgIGVsc2VcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIChAdGl0bGVTdHlsZShnYW1lLmhvbWUpKSwgXCIgLSBcIiwgKEB0aXRsZVN0eWxlKGdhbWUuYXdheSkpKVxuXG4gIHRpdGxlU3R5bGU6IChuYW1lKSAtPlxuICAgIGlmIEBwcm9wcy50ZWFtLmluZm8ubmFtZSBpcyBuYW1lXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIChuYW1lKSlcbiAgICBlbHNlXG4gICAgICBuYW1lXG5cbiAgbG9nbzogKG5hbWUpIC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XCJzcmNcIjogKFRlYW1zLmxvZ28obmFtZSkpLCBcImFsdFwiOiAobmFtZSl9KVxuXG4gIGdyb3VwZWRTY2hlZHVsZTogLT5cbiAgICBfLmNoYWluKEBwcm9wcy50ZWFtLnNjaGVkdWxlKS5ncm91cEJ5IChnYW1lKSAtPlxuICAgICAgbW9tZW50KGdhbWUuZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTVwiKVxuXG4gIHJlbmRlcjogLT5cbiAgICBhdHRlbmRhbmNlVGl0bGUgPSAobW9udGgpIC0+XG4gICAgICBpZiBtb21lbnQobW9udGgpLnN0YXJ0T2YoXCJtb250aFwiKSA8IG1vbWVudCgpXG4gICAgICAgIFwiWWxlaXPDtsOkXCJcbiAgICAgIGVsc2VcbiAgICAgICAgbnVsbFxuXG4gICAgbW9udGhseUdhbWVzID0gQGdyb3VwZWRTY2hlZHVsZSgpLm1hcCAoZ2FtZXMsIG1vbnRoKSA9PlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIHtcImtleVwiOiAobW9udGgpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImNsYXNzTmFtZVwiOiBcIm1vbnRoLXJvd1wifSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiY29sU3BhblwiOiAzfSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgKGF0dGVuZGFuY2VUaXRsZShtb250aCkpKVxuICAgICAgICApLFxuICAgICAgICAoZ2FtZXMubWFwIChnYW1lKSA9PlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKGdhbWUuaWQpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAobW9tZW50KGdhbWUuZGF0ZSkuZm9ybWF0KFwiREQuTU0uWVlZWVwiKSksIFwiIFwiLCAoZ2FtZS50aW1lKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKEBnYW1lTGluayhnYW1lKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChnYW1lLmhvbWVTY29yZSksIFwiLVwiLCAoZ2FtZS5hd2F5U2NvcmUpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZ2FtZS5hdHRlbmRhbmNlKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGVhbS1zY2hlZHVsZSB0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgICAgKG1vbnRobHlHYW1lcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblBsYXllclN0YXRzID0gcmVxdWlyZSAnLi9wbGF5ZXJfc3RhdHMnXG5Hb2FsaWVTdGF0cyA9IHJlcXVpcmUgJy4vZ29hbGllX3N0YXRzJ1xuXG5UZWFtU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBsYXllclN0YXRzLCB7XCJzdGF0c1wiOiAoQHByb3BzLnN0YXRzLnBsYXllcnMpfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdvYWxpZVN0YXRzLCB7XCJzdGF0c1wiOiAoQHByb3BzLnN0YXRzLmdvYWxpZXMpfSlcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRlYW1zTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwicm93XCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtcy12aWV3IGNvbC14cy0xMiBjb2wtc20tMTIgY29sLW1kLTEyIGNvbC1sZy0xMlwifSxcbiAgICAgICAgKFxuICAgICAgICAgIEBwcm9wcy50ZWFtcy5tYXAgKHRlYW0pIC0+XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJrZXlcIjogKHRlYW0uaWQpLCBcImNsYXNzTmFtZVwiOiBcInRlYW0tbG9nbyAje3RlYW0uaWR9XCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmlkfVwifSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtc0xpc3QiXX0=
