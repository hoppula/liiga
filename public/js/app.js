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
  url: document.location.origin.replace("4000", "8080")
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
    return Q.spread([this.store.fetch("standings"), this.store.fetch("teams"), this.store.fetch("stats")], function(standings, teamsList, statsList) {
      return {
        title: "Etusivu",
        component: React.createElement(IndexView, {
          standings: standings.toJSON(),
          teams: teamsList.toJSON(),
          stats: statsList.toJSON()
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
        title: "Joukkueet - " + (team.get("info").name) + " - " + subTitle,
        component: React.createElement(TeamView, {
          id: id,
          standings: standings.toJSON(),
          team: team.toJSON(),
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
      player = team.get("roster").filter(function(player) {
        return player.id === ("" + pid + "/" + slug);
      })[0];
      return {
        title: "Pelaajat - " + player.firstName + " " + player.lastName,
        component: React.createElement(PlayerView, {
          id: pid,
          player: player,
          team: team.toJSON()
        })
      };
    });
  },
  "/ottelut": function() {
    return this.store.fetch("schedule").then(function(schedule) {
      return {
        title: "Otteluohjelma",
        component: React.createElement(ScheduleView, {
          schedule: schedule.toJSON()
        })
      };
    });
  },
  "/ottelut/:id/:active?": function(id, active) {
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
      game = schedule.find(function(g) {
        return g.id === id;
      });
      return {
        title: "Ottelu - " + (game.get("home")) + " vs " + (game.get("away")),
        component: React.createElement(GameView, {
          id: id,
          game: game.toJSON(),
          events: events.toJSON(),
          lineUps: lineUps.toJSON(),
          stats: stats.toJSON(),
          active: active
        })
      };
    });
  },
  "/sarjataulukko": function() {
    return this.store.fetch("standings").then(function(standings) {
      return {
        title: "Sarjataulukko",
        component: React.createElement(StandingsView, {
          standings: standings.toJSON()
        })
      };
    });
  },
  "/tilastot/:active?": function(active) {
    return this.store.fetch("stats").then(function(stats) {
      return {
        title: "Tilastot",
        component: React.createElement(StatsView, {
          stats: stats.toJSON(),
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
var Col, Game, GameEvents, GameLineups, GameStats, Nav, NavItem, Navigation, React, Row, TabPane, _ref;

React = require('react/addons');

Navigation = require('./navigation');

_ref = require('react-bootstrap'), Row = _ref.Row, Col = _ref.Col, Nav = _ref.Nav, NavItem = _ref.NavItem, TabPane = _ref.TabPane;

GameEvents = require('./game_events');

GameLineups = require('./game_lineups');

GameStats = require('./game_stats');

Game = React.createClass({
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  render: function() {
    var activeKey;
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
    return React.createElement("div", null, React.createElement(Navigation, null), React.createElement(Row, null, React.createElement(Col, {
      "xs": 4.,
      "md": 4.
    }, React.createElement("h1", null, this.props.game.home)), React.createElement(Col, {
      "xs": 4.,
      "md": 4.
    }, React.createElement("h1", null, this.props.game.homeScore, " - ", this.props.game.awayScore), React.createElement("div", null, "Yleis\u00f6\u00e4: ", this.props.game.attendance)), React.createElement(Col, {
      "xs": 4.,
      "md": 4.
    }, React.createElement("h1", null, this.props.game.away))), React.createElement(Nav, {
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
      "stats": this.props.stats
    })), React.createElement(TabPane, {
      "key": "lineUps",
      "animation": false,
      "active": activeKey === "lineUps"
    }, React.createElement(GameLineups, {
      "lineUps": this.props.lineUps
    }))));
  }
});

module.exports = Game;



},{"./game_events":"/Users/hoppula/repos/liiga_frontend/views/game_events.coffee","./game_lineups":"/Users/hoppula/repos/liiga_frontend/views/game_lineups.coffee","./game_stats":"/Users/hoppula/repos/liiga_frontend/views/game_stats.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/game_events.coffee":[function(require,module,exports){
var GameEvents, React;

React = require('react/addons');

GameEvents = React.createClass({
  event: function(event, i) {
    if (event.header) {
      return React.createElement("tr", {
        "key": event.header
      }, React.createElement("th", {
        "colSpan": "3"
      }, event.header));
    } else {
      return React.createElement("tr", {
        "key": i
      }, React.createElement("td", null, this.props.game[event.team]), React.createElement("td", null, event.time), React.createElement("td", null, event.text));
    }
  },
  render: function() {
    var events;
    events = Object.keys(this.props.events).reduce((function(_this) {
      return function(arr, key) {
        arr.push({
          header: key
        });
        arr = arr.concat(_this.props.events[key]);
        return arr;
      };
    })(this), []);
    return React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped"
    }, events.map((function(_this) {
      return function(event, i) {
        return _this.event(event, i);
      };
    })(this))));
  }
});

module.exports = GameEvents;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/game_lineups.coffee":[function(require,module,exports){
var GameLineups, React;

React = require('react/addons');

GameLineups = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped"
    }));
  }
});

module.exports = GameLineups;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/game_stats.coffee":[function(require,module,exports){
var GameStats, React;

React = require('react/addons');

GameStats = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped"
    }, this.props.stats.home.players.map(function(player) {
      return React.createElement("tr", {
        "key": player.id
      }, React.createElement("td", null, player.firstName, " ", player.lastName));
    }), this.props.stats.home.goalies.map(function(goalie) {
      return React.createElement("tr", {
        "key": goalie.id
      }, React.createElement("td", null, goalie.firstName, " ", goalie.lastName));
    })), React.createElement("table", {
      "className": "table table-striped"
    }, this.props.stats.away.players.map(function(player) {
      return React.createElement("tr", {
        "key": player.id
      }, React.createElement("td", null, player.firstName, " ", player.lastName));
    }), this.props.stats.away.goalies.map(function(goalie) {
      return React.createElement("tr", {
        "key": goalie.id
      }, React.createElement("td", null, goalie.firstName, " ", goalie.lastName));
    })));
  }
});

module.exports = GameStats;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/index.coffee":[function(require,module,exports){
var Index, Navigation, React, TeamsListView, TopScorersView;

React = require('react/addons');

Navigation = require('./navigation');

TeamsListView = require('./teams_list');

TopScorersView = require('./top_scorers');

Index = React.createClass({
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  render: function() {
    return React.createElement("div", null, React.createElement(Navigation, null), React.createElement("div", {
      "className": "jumbotron"
    }, React.createElement("h1", null, "Liiga.pw"), React.createElement("p", null, "Liigan tilastot nopeasti ja vaivattomasti")), React.createElement(TeamsListView, {
      "teams": this.props.teams
    }), React.createElement(TopScorersView, {
      "stats": this.props.stats
    }));
  }
});

module.exports = Index;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./teams_list":"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee","./top_scorers":"/Users/hoppula/repos/liiga_frontend/views/top_scorers.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee":[function(require,module,exports){
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
          return b[this.state.sortField] - a[this.state.sortField];
        } else {
          return a[this.state.sortField] - b[this.state.sortField];
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
    }, "Liiga");
    teams = React.createElement(DropdownButton, {
      "title": "Joukkueet"
    }, Object.keys(Teams.namesAndIds).map(function(name) {
      return React.createElement(MenuItem, {
        "key": Teams.namesAndIds[name],
        "href": "/joukkueet/" + Teams.namesAndIds[name]
      }, name);
    }));
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
      "key": 0.,
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
    var item, player, players, stats, team;
    player = this.props.player;
    team = this.props.team;
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
    stats = team.stats.players.filter((function(_this) {
      return function(player) {
        var id, slug, _ref;
        _ref = player.id.split("/"), id = _ref[0], slug = _ref[1];
        return id === _this.props.id;
      };
    })(this))[0];
    item = {
      title: team.info.name,
      url: team.info.url
    };
    console.log("player", player);
    console.log("team", team);
    console.log("stats", stats);
    return React.createElement("div", {
      "className": "player"
    }, React.createElement(Navigation, {
      "dropdown": players,
      "item": item
    }), React.createElement("h1", null, player.firstName, " ", player.lastName), React.createElement("h2", null, "#", player.number, " ", player.position), React.createElement("h3", null, React.createElement("a", {
      "className": "team-logo " + team.info.id,
      "href": "/joukkueet/" + team.info.id
    }), " ", team.info.name), React.createElement("div", null, moment(player.birthday).format("DD.MM.YYYY")), React.createElement("div", null, player.height, " cm"), React.createElement("div", null, player.weight, " kg"), React.createElement("div", null, player.shoots), React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table"
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "O"), React.createElement("th", null, "M"), React.createElement("th", null, "S"), React.createElement("th", null, "P"), React.createElement("th", null, "R"), React.createElement("th", null, "+\x2F-"), React.createElement("th", null, "+"), React.createElement("th", null, "-"), React.createElement("th", null, "YVM"), React.createElement("th", null, "AVM"), React.createElement("th", null, "VM"), React.createElement("th", null, "L"), React.createElement("th", null, "L%"), React.createElement("th", null, "A"), React.createElement("th", null, "A%"), React.createElement("th", null, "Aika"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, stats.games), React.createElement("td", null, stats.goals), React.createElement("td", null, stats.assists), React.createElement("td", null, stats.points), React.createElement("td", null, stats.penalties), React.createElement("td", null, stats.plusMinus), React.createElement("td", null, stats.plusses), React.createElement("td", null, stats.minuses), React.createElement("td", null, stats.powerPlayGoals), React.createElement("td", null, stats.shortHandedGoals), React.createElement("td", null, stats.winningGoals), React.createElement("td", null, stats.shots), React.createElement("td", null, stats.shootingPercentage), React.createElement("td", null, stats.faceoffs), React.createElement("td", null, stats.faceoffPercentage), React.createElement("td", null, stats.playingTimeAverage))))));
  }
});

module.exports = Player;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee":[function(require,module,exports){
var PlayerStats, React;

React = require('react/addons');

PlayerStats = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped"
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Name"), React.createElement("th", null, "Games"), React.createElement("th", null, "Goals"), React.createElement("th", null, "Assists"), React.createElement("th", null, "Points"), React.createElement("th", null, "Penalties"), React.createElement("th", null, "+\x2F-"))), this.props.stats.map(function(player) {
      return React.createElement("tr", {
        "key": player.id
      }, React.createElement("td", null, React.createElement("a", {
        "href": "/joukkueet/" + player.teamId + "/" + player.id
      }, player.firstName, " \x3E", player.lastName)), React.createElement("td", null, player.games), React.createElement("td", null, player.goals), React.createElement("td", null, player.assists), React.createElement("td", null, player.points), React.createElement("td", null, player.penalties), React.createElement("td", null, player.plusMinus));
    })));
  }
});

module.exports = PlayerStats;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/schedule.coffee":[function(require,module,exports){
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
var Navigation, React, Standings, TableSortMixin, Teams;

React = require('react/addons');

Navigation = require('./navigation');

TableSortMixin = require('./mixins/table_sort');

Teams = require('../lib/teams');

Standings = React.createClass({
  mixins: [TableSortMixin],
  getInitialState: function() {
    return {
      sortField: "points",
      sortDirection: "desc",
      sortType: "integer"
    };
  },
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  render: function() {
    var standings;
    standings = this.props.standings.sort(this.sort).map(function(team) {
      return React.createElement("tr", {
        "key": team.name
      }, React.createElement("td", null, team.position), React.createElement("td", null, React.createElement("a", {
        "href": "/joukkueet/" + (Teams.nameToId(team.name))
      }, team.name)), React.createElement("td", null, team.games), React.createElement("td", null, team.wins), React.createElement("td", null, team.ties), React.createElement("td", null, team.loses), React.createElement("td", null, team.extraPoints), React.createElement("td", null, team.points), React.createElement("td", null, team.goalsFor), React.createElement("td", null, team.goalsAgainst), React.createElement("td", null, team.powerplayPercentage), React.createElement("td", null, team.shorthandPercentage), React.createElement("td", null, team.pointsPerGame));
    });
    return React.createElement("div", null, React.createElement(Navigation, null), React.createElement("h1", null, "Sarjataulukko"), React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped team-schedule"
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
      "data-sort": "goalsFor"
    }, "TM"), React.createElement("th", {
      "data-sort": "goalsAgainst"
    }, "PM"), React.createElement("th", {
      "data-sort": "powerplayPercentage",
      "data-type": "float"
    }, "YV%"), React.createElement("th", {
      "data-sort": "shorthandPercentage",
      "data-type": "float"
    }, "AV%"), React.createElement("th", {
      "data-sort": "pointsPerGame",
      "data-type": "float"
    }, "P\x2FO"))), React.createElement("tbody", null, standings))));
  }
});

module.exports = Standings;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/stats.coffee":[function(require,module,exports){
var Nav, NavItem, Navigation, React, Stats, TabPane, _ref;

React = require('react/addons');

_ref = require("react-bootstrap"), TabPane = _ref.TabPane, Nav = _ref.Nav, NavItem = _ref.NavItem;

Navigation = require('./navigation');

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
    }, React.createElement("h2", null, "Kentt\u00e4pelaajat")), React.createElement(TabPane, {
      "key": "goalies",
      "animation": false,
      "active": activeKey === "goalies"
    }, React.createElement("h2", null, "Maalivahdit")))));
  }
});

module.exports = Stats;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team.coffee":[function(require,module,exports){
var Button, ButtonToolbar, Col, Jumbotron, Nav, NavItem, Navigation, PlayerStats, React, Row, TabPane, Team, TeamRoster, TeamSchedule, TeamStats, Teams, _ref;

React = require('react/addons');

PlayerStats = require('./player_stats');

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



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./player_stats":"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee","./team_roster":"/Users/hoppula/repos/liiga_frontend/views/team_roster.coffee","./team_schedule":"/Users/hoppula/repos/liiga_frontend/views/team_schedule.coffee","./team_stats":"/Users/hoppula/repos/liiga_frontend/views/team_stats.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_roster.coffee":[function(require,module,exports){
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
      "className": "table-responsive"
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
    var monthlyGames;
    monthlyGames = this.groupedSchedule().map((function(_this) {
      return function(games, month) {
        return React.createElement("tbody", {
          "key": month
        }, React.createElement("tr", null, React.createElement("th", {
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM"))), games.map(function(game) {
          return React.createElement("tr", {
            "key": game.id
          }, React.createElement("td", null, moment(game.date).format("DD.MM.YYYY"), " ", game.time), React.createElement("td", null, _this.gameLink(game)), React.createElement("td", null, game.homeScore, "-", game.awayScore), React.createElement("td", null, game.attendance));
        }));
      };
    })(this));
    return React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped team-schedule"
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "P\u00e4iv\u00e4m\u00e4\u00e4r\u00e4"), React.createElement("th", null, "Joukkueet"), React.createElement("th", null, "Tulos"), React.createElement("th", null, "Yleis\u00f6m\u00e4\u00e4r\u00e4"))), monthlyGames));
  }
});

module.exports = TeamSchedule;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","lodash":"lodash","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_stats.coffee":[function(require,module,exports){
var React, TableSortMixin, TeamStats, _;

React = require('react/addons');

_ = require('lodash');

TableSortMixin = require('./mixins/table_sort');

TeamStats = React.createClass({
  mixins: [TableSortMixin],
  getInitialState: function() {
    return {
      sortField: "points",
      sortDirection: "desc",
      sortType: "integer"
    };
  },
  render: function() {
    var goalies, players;
    players = this.props.stats.players.sort(this.sort).map((function(_this) {
      return function(player) {
        return React.createElement("tr", {
          "key": player.id
        }, React.createElement("td", null, React.createElement("a", {
          "href": "/joukkueet/" + _this.props.teamId + "/" + player.id
        }, player.firstName, " ", player.lastName)), React.createElement("td", null, player.games), React.createElement("td", null, player.goals), React.createElement("td", null, player.assists), React.createElement("td", null, player.points), React.createElement("td", null, player.penalties), React.createElement("td", null, player.plusMinus), React.createElement("td", null, player.plusses), React.createElement("td", null, player.minuses), React.createElement("td", null, player.powerPlayGoals), React.createElement("td", null, player.shortHandedGoals), React.createElement("td", null, player.winningGoals), React.createElement("td", null, player.shots), React.createElement("td", null, player.shootingPercentage), React.createElement("td", null, player.faceoffs), React.createElement("td", null, player.faceoffPercentage), React.createElement("td", null, player.playingTimeAverage));
      };
    })(this));
    goalies = this.props.stats.goalies.map((function(_this) {
      return function(player) {
        return React.createElement("tr", {
          "key": player.id
        }, React.createElement("td", null, React.createElement("a", {
          "href": "/joukkueet/" + _this.props.teamId + "/" + player.id
        }, player.firstName, " ", player.lastName)), React.createElement("td", null, player.games), React.createElement("td", null, player.wins), React.createElement("td", null, player.ties), React.createElement("td", null, player.losses), React.createElement("td", null, player.saves), React.createElement("td", null, player.goalsAllowed), React.createElement("td", null, player.shutouts), React.createElement("td", null, player.goalsAverage), React.createElement("td", null, player.savingPercentage), React.createElement("td", null, player.goals), React.createElement("td", null, player.assists), React.createElement("td", null, player.points), React.createElement("td", null, player.penalties), React.createElement("td", null, player.winPercentage), React.createElement("td", {
          "colSpan": 2
        }, player.minutes));
      };
    })(this));
    return React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped team-roster"
    }, React.createElement("thead", {
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.createElement("tr", null, React.createElement("th", {
      "colSpan": 17
    }, "Pelaajat")), React.createElement("tr", null, React.createElement("th", {
      "data-sort": "lastName",
      "data-type": "string"
    }, "Nimi"), React.createElement("th", {
      "data-sort": "games"
    }, "O"), React.createElement("th", {
      "data-sort": "goals"
    }, "M"), React.createElement("th", {
      "data-sort": "assists"
    }, "S"), React.createElement("th", {
      "data-sort": "points"
    }, "P"), React.createElement("th", {
      "data-sort": "penalties"
    }, "R"), React.createElement("th", {
      "data-sort": "plusMinus"
    }, "+\x2F-"), React.createElement("th", {
      "data-sort": "plusses"
    }, "+"), React.createElement("th", {
      "data-sort": "minuses"
    }, "-"), React.createElement("th", {
      "data-sort": "powerPlayGoals"
    }, "YVM"), React.createElement("th", {
      "data-sort": "shortHandedGoals"
    }, "AVM"), React.createElement("th", {
      "data-sort": "winningGoals"
    }, "VM"), React.createElement("th", {
      "data-sort": "shots"
    }, "L"), React.createElement("th", {
      "data-sort": "shootingPercentage",
      "data-type": "float"
    }, "L%"), React.createElement("th", {
      "data-sort": "faceoffs"
    }, "A"), React.createElement("th", {
      "data-sort": "faceoffPercentage",
      "data-type": "float"
    }, "A%"), React.createElement("th", {
      "data-sort": "playingTimeAverage",
      "data-type": "float"
    }, "Aika"))), React.createElement("tbody", null, players), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
      "colSpan": 17
    }, "Maalivahdit")), React.createElement("tr", null, React.createElement("th", null, "Nimi"), React.createElement("th", null, "PO"), React.createElement("th", null, "V"), React.createElement("th", null, "T"), React.createElement("th", null, "H"), React.createElement("th", null, "TO"), React.createElement("th", null, "PM"), React.createElement("th", null, "NP"), React.createElement("th", null, "KA"), React.createElement("th", null, "T%"), React.createElement("th", null, "M"), React.createElement("th", null, "S"), React.createElement("th", null, "P"), React.createElement("th", null, "R"), React.createElement("th", null, "V%"), React.createElement("th", {
      "colSpan": 2
    }, "Aika"))), React.createElement("tbody", null, goalies)));
  }
});

module.exports = TeamStats;



},{"./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","lodash":"lodash","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee":[function(require,module,exports){
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



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/top_scorers.coffee":[function(require,module,exports){
var React, TopScorers;

React = require('react/addons');

TopScorers = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "table-responsive"
    }, React.createElement("table", {
      "className": "table table-striped"
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Nimi"), React.createElement("th", null, "Ottelut"), React.createElement("th", null, "Maalit"), React.createElement("th", null, "Sy\u00f6t\u00f6t"), React.createElement("th", null, "Pisteet"))), this.props.stats.scoringStats.filter(function(player, index) {
      return index < 20;
    }).map(function(player) {
      return React.createElement("tr", {
        "key": player.id
      }, React.createElement("td", null, React.createElement("a", {
        "href": "/joukkueet/" + player.teamId + "/" + player.id
      }, player.firstName, " ", player.lastName)), React.createElement("td", null, player.games), React.createElement("td", null, player.goals), React.createElement("td", null, player.assists), React.createElement("td", null, player.points));
    })));
  }
});

module.exports = TopScorers;



},{"react/addons":"react/addons"}]},{},["/Users/hoppula/repos/liiga_frontend/client.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY2xpZW50LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2NvbmZpZy9hcGktYnJvd3Nlci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9saWIvdGVhbXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3RjbGljay9saWIvZmFzdGNsaWNrLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvb3B0aW9ucy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9yb3V0ZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvZ2FtZV9saW5ldXBzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2xpbmV1cHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZV9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9taXhpbnMvdGFibGVfc29ydC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9uYXZpZ2F0aW9uLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3BsYXllci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXJfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc2NoZWR1bGUuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW0uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9yb3N0ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1zX2xpc3QuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdG9wX3Njb3JlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSx3REFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FBUixDQUFBOztBQUFBLFVBQ0EsR0FBYSxPQUFBLENBQVEsWUFBUixDQURiLENBQUE7O0FBQUEsU0FFQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRlosQ0FBQTs7QUFBQSxPQUdBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLFlBS0EsR0FBZSxRQUFRLENBQUMsY0FBVCxDQUF3QixPQUFPLENBQUMsS0FBaEMsQ0FMZixDQUFBOztBQUFBLE9BT08sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsT0FBRCxHQUFBOztJQUFDLFVBQVE7R0FDeEI7QUFBQSxFQUFBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixPQUE5QixDQUF1QyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQTFDLEdBQXVELGFBQUEsR0FBYSxPQUFPLENBQUMsS0FBNUUsQ0FBQTtTQUNBLEtBQUssQ0FBQyxNQUFOLENBQWEsT0FBTyxDQUFDLFNBQXJCLEVBQWdDLFlBQWhDLEVBRmU7QUFBQSxDQVBqQixDQUFBOztBQUFBLE9BV08sQ0FBQyxVQUFSLEdBQXFCLFNBQUMsTUFBRCxHQUFBO1NBQ25CLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFFBQVEsQ0FBQyxJQUExQixFQURtQjtBQUFBLENBWHJCLENBQUE7O0FBQUEsR0Fl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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcnpCQSxJQUFBLGNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxNQUNBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FEVCxDQUFBOztBQUFBLE1BR00s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QVEsR0FEd0I7SUFBQSxDQUFqQyxDQUVELENBQUMsR0FGQSxDQUVJLFNBQUMsTUFBRCxHQUFBO2FBQ0gsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBcEIsRUFBMEI7QUFBQSxRQUFDLEtBQUEsRUFBUSxNQUFNLENBQUMsRUFBaEI7T0FBMUIsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFnQyxLQUFLLENBQUMsYUFBTixDQUFvQixHQUFwQixFQUF5QjtBQUFBLFFBQUMsTUFBQSxFQUFTLGFBQUEsR0FBYSxNQUFNLENBQUMsTUFBcEIsR0FBMkIsR0FBM0IsR0FBOEIsTUFBTSxDQUFDLEVBQS9DO09BQXpCLEVBQWdGLE1BQU0sQ0FBQyxTQUF2RixFQUFtRyxHQUFuRyxFQUF5RyxNQUFNLENBQUMsUUFBaEgsQ0FBaEMsQ0FERixFQUVFLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWlDLE1BQU0sQ0FBQyxLQUF4QyxDQUZGLEVBR0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBaUMsTUFBTSxDQUFDLEtBQXhDLENBSEYsRUFJRSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFpQyxNQUFNLENBQUMsT0FBeEMsQ0FKRixFQUtFLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWlDLE1BQU0sQ0FBQyxNQUF4QyxDQUxGLEVBREc7SUFBQSxDQUZKLENBVkgsQ0FERixFQURNO0VBQUEsQ0FBUjtDQUZXLENBRmIsQ0FBQTs7QUFBQSxNQThCTSxDQUFDLE9BQVAsR0FBaUIsVUE5QmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5jZXJlYmVsbHVtID0gcmVxdWlyZSAnY2VyZWJlbGx1bSdcbkZhc3RDbGljayA9IHJlcXVpcmUgJ2Zhc3RjbGljaydcbm9wdGlvbnMgPSByZXF1aXJlICcuL29wdGlvbnMnXG5cbmFwcENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuYXBwSWQpXG5cbm9wdGlvbnMucmVuZGVyID0gKG9wdGlvbnM9e30pIC0+XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gXCJMaWlnYS5wdyAtICN7b3B0aW9ucy50aXRsZX1cIlxuICBSZWFjdC5yZW5kZXIob3B0aW9ucy5jb21wb25lbnQsIGFwcENvbnRhaW5lcilcblxub3B0aW9ucy5pbml0aWFsaXplID0gKGNsaWVudCkgLT5cbiAgRmFzdENsaWNrLmF0dGFjaChkb2N1bWVudC5ib2R5KVxuICAjUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpXG5cbmFwcCA9IGNlcmViZWxsdW0uY2xpZW50KG9wdGlvbnMpIiwibW9kdWxlLmV4cG9ydHMgPVxuICB1cmw6IGRvY3VtZW50LmxvY2F0aW9uLm9yaWdpbi5yZXBsYWNlKFwiNDAwMFwiLFwiODA4MFwiKVxuICAjdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiIiwiVGVhbXMgPVxuICBuYW1lc0FuZElkczpcbiAgICBcIsOEc3PDpHRcIjogXCJhc3NhdFwiXG4gICAgXCJCbHVlc1wiOiBcImJsdWVzXCJcbiAgICBcIkhJRktcIjogXCJoaWZrXCJcbiAgICBcIkhQS1wiOiBcImhwa1wiXG4gICAgXCJJbHZlc1wiOiBcImlsdmVzXCJcbiAgICBcIlNwb3J0XCI6IFwic3BvcnRcIlxuICAgIFwiSllQXCI6IFwianlwXCJcbiAgICBcIkthbFBhXCI6IFwia2FscGFcIlxuICAgIFwiS8OkcnDDpHRcIjogXCJrYXJwYXRcIlxuICAgIFwiTHVra29cIjogXCJsdWtrb1wiXG4gICAgXCJQZWxpY2Fuc1wiOiBcInBlbGljYW5zXCJcbiAgICBcIlNhaVBhXCI6IFwic2FpcGFcIlxuICAgIFwiVGFwcGFyYVwiOiBcInRhcHBhcmFcIlxuICAgIFwiVFBTXCI6IFwidHBzXCJcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBcIi9zdmcvI3tAbmFtZXNBbmRJZHNbbmFtZV19LnN2Z1wiXG5cbiAgaWRUb05hbWU6IChpZCkgLT5cbiAgICBpZHMgPSBPYmplY3Qua2V5cyhAbmFtZXNBbmRJZHMpLnJlZHVjZSAob2JqLCBuYW1lKSA9PlxuICAgICAgb2JqW0BuYW1lc0FuZElkc1tuYW1lXV0gPSBuYW1lXG4gICAgICBvYmpcbiAgICAsIHt9XG4gICAgaWRzW2lkXVxuXG4gIG5hbWVUb0lkOiAobmFtZSkgLT5cbiAgICBAbmFtZXNBbmRJZHNbbmFtZV1cblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIi8qKlxuICogQHByZXNlcnZlIEZhc3RDbGljazogcG9seWZpbGwgdG8gcmVtb3ZlIGNsaWNrIGRlbGF5cyBvbiBicm93c2VycyB3aXRoIHRvdWNoIFVJcy5cbiAqXG4gKiBAdmVyc2lvbiAxLjAuM1xuICogQGNvZGluZ3N0YW5kYXJkIGZ0bGFicy1qc3YyXG4gKiBAY29weXJpZ2h0IFRoZSBGaW5hbmNpYWwgVGltZXMgTGltaXRlZCBbQWxsIFJpZ2h0cyBSZXNlcnZlZF1cbiAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlIChzZWUgTElDRU5TRS50eHQpXG4gKi9cblxuLypqc2xpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuLypnbG9iYWwgZGVmaW5lLCBFdmVudCwgTm9kZSovXG5cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBmYXN0LWNsaWNraW5nIGxpc3RlbmVycyBvbiB0aGUgc3BlY2lmaWVkIGxheWVyLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuZnVuY3Rpb24gRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG9sZE9uQ2xpY2s7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgYSBjbGljayBpcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlZC5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cblxuXHQvKipcblx0ICogVGltZXN0YW1wIGZvciB3aGVuIGNsaWNrIHRyYWNraW5nIHN0YXJ0ZWQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSAwO1xuXG5cblx0LyoqXG5cdCAqIFRoZSBlbGVtZW50IGJlaW5nIHRyYWNrZWQgZm9yIGEgY2xpY2suXG5cdCAqXG5cdCAqIEB0eXBlIEV2ZW50VGFyZ2V0XG5cdCAqL1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXG5cblx0LyoqXG5cdCAqIFgtY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRvdWNoU3RhcnRYID0gMDtcblxuXG5cdC8qKlxuXHQgKiBZLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50b3VjaFN0YXJ0WSA9IDA7XG5cblxuXHQvKipcblx0ICogSUQgb2YgdGhlIGxhc3QgdG91Y2gsIHJldHJpZXZlZCBmcm9tIFRvdWNoLmlkZW50aWZpZXIuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyID0gMDtcblxuXG5cdC8qKlxuXHQgKiBUb3VjaG1vdmUgYm91bmRhcnksIGJleW9uZCB3aGljaCBhIGNsaWNrIHdpbGwgYmUgY2FuY2VsbGVkLlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudG91Y2hCb3VuZGFyeSA9IG9wdGlvbnMudG91Y2hCb3VuZGFyeSB8fCAxMDtcblxuXG5cdC8qKlxuXHQgKiBUaGUgRmFzdENsaWNrIGxheWVyLlxuXHQgKlxuXHQgKiBAdHlwZSBFbGVtZW50XG5cdCAqL1xuXHR0aGlzLmxheWVyID0gbGF5ZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiB0YXAodG91Y2hzdGFydCBhbmQgdG91Y2hlbmQpIGV2ZW50c1xuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudGFwRGVsYXkgPSBvcHRpb25zLnRhcERlbGF5IHx8IDIwMDtcblxuXHRpZiAoRmFzdENsaWNrLm5vdE5lZWRlZChsYXllcikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBBbmRyb2lkIGRvbid0IGhhdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcblx0ZnVuY3Rpb24gYmluZChtZXRob2QsIGNvbnRleHQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBtZXRob2QuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTsgfTtcblx0fVxuXG5cblx0dmFyIG1ldGhvZHMgPSBbJ29uTW91c2UnLCAnb25DbGljaycsICdvblRvdWNoU3RhcnQnLCAnb25Ub3VjaE1vdmUnLCAnb25Ub3VjaEVuZCcsICdvblRvdWNoQ2FuY2VsJ107XG5cdHZhciBjb250ZXh0ID0gdGhpcztcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGNvbnRleHRbbWV0aG9kc1tpXV0gPSBiaW5kKGNvbnRleHRbbWV0aG9kc1tpXV0sIGNvbnRleHQpO1xuXHR9XG5cblx0Ly8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzIGFzIHJlcXVpcmVkXG5cdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdH1cblxuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XG5cblx0Ly8gSGFjayBpcyByZXF1aXJlZCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IEV2ZW50I3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAoZS5nLiBBbmRyb2lkIDIpXG5cdC8vIHdoaWNoIGlzIGhvdyBGYXN0Q2xpY2sgbm9ybWFsbHkgc3RvcHMgY2xpY2sgZXZlbnRzIGJ1YmJsaW5nIHRvIGNhbGxiYWNrcyByZWdpc3RlcmVkIG9uIHRoZSBGYXN0Q2xpY2tcblx0Ly8gbGF5ZXIgd2hlbiB0aGV5IGFyZSBjYW5jZWxsZWQuXG5cdGlmICghRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0dmFyIHJtdiA9IE5vZGUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xuXHRcdFx0XHRybXYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cm12LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG5cdFx0XHR2YXIgYWR2ID0gTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0XHRcdGlmICh0eXBlID09PSAnY2xpY2snKSB7XG5cdFx0XHRcdGFkdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjay5oaWphY2tlZCB8fCAoY2FsbGJhY2suaGlqYWNrZWQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmICghZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSwgY2FwdHVyZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBJZiBhIGhhbmRsZXIgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGUgZWxlbWVudCdzIG9uY2xpY2sgYXR0cmlidXRlLCBpdCB3aWxsIGJlIGZpcmVkIGJlZm9yZVxuXHQvLyBGYXN0Q2xpY2sncyBvbkNsaWNrIGhhbmRsZXIuIEZpeCB0aGlzIGJ5IHB1bGxpbmcgb3V0IHRoZSB1c2VyLWRlZmluZWQgaGFuZGxlciBmdW5jdGlvbiBhbmRcblx0Ly8gYWRkaW5nIGl0IGFzIGxpc3RlbmVyLlxuXHRpZiAodHlwZW9mIGxheWVyLm9uY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdC8vIEFuZHJvaWQgYnJvd3NlciBvbiBhdCBsZWFzdCAzLjIgcmVxdWlyZXMgYSBuZXcgcmVmZXJlbmNlIHRvIHRoZSBmdW5jdGlvbiBpbiBsYXllci5vbmNsaWNrXG5cdFx0Ly8gLSB0aGUgb2xkIG9uZSB3b24ndCB3b3JrIGlmIHBhc3NlZCB0byBhZGRFdmVudExpc3RlbmVyIGRpcmVjdGx5LlxuXHRcdG9sZE9uQ2xpY2sgPSBsYXllci5vbmNsaWNrO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdG9sZE9uQ2xpY2soZXZlbnQpO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRsYXllci5vbmNsaWNrID0gbnVsbDtcblx0fVxufVxuXG5cbi8qKlxuICogQW5kcm9pZCByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQW5kcm9pZCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQW5kcm9pZCcpID4gMDtcblxuXG4vKipcbiAqIGlPUyByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzSU9TID0gL2lQKGFkfGhvbmV8b2QpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDQgcmVxdWlyZXMgYW4gZXhjZXB0aW9uIGZvciBzZWxlY3QgZWxlbWVudHMuXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNJT1M0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyA0X1xcZChfXFxkKT8vKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDYuMCgrPykgcmVxdWlyZXMgdGhlIHRhcmdldCBlbGVtZW50IHRvIGJlIG1hbnVhbGx5IGRlcml2ZWRcbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQgPSBkZXZpY2VJc0lPUyAmJiAoL09TIChbNi05XXxcXGR7Mn0pX1xcZC8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbi8qKlxuICogQmxhY2tCZXJyeSByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQmxhY2tCZXJyeTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdCQjEwJykgPiAwO1xuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIG5hdGl2ZSBjbGljay5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgbmVlZHMgYSBuYXRpdmUgY2xpY2tcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0NsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgdG8gZGlzYWJsZWQgaW5wdXRzIChpc3N1ZSAjNjIpXG5cdGNhc2UgJ2J1dHRvbic6XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdGNhc2UgJ3RleHRhcmVhJzpcblx0XHRpZiAodGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnaW5wdXQnOlxuXG5cdFx0Ly8gRmlsZSBpbnB1dHMgbmVlZCByZWFsIGNsaWNrcyBvbiBpT1MgNiBkdWUgdG8gYSBicm93c2VyIGJ1ZyAoaXNzdWUgIzY4KVxuXHRcdGlmICgoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0LnR5cGUgPT09ICdmaWxlJykgfHwgdGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnbGFiZWwnOlxuXHRjYXNlICd2aWRlbyc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gKC9cXGJuZWVkc2NsaWNrXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBhIGdpdmVuIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIGNsaWNrIGludG8gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIG5hdGl2ZSBjbGljay5cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0ZvY3VzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXHRjYXNlICd0ZXh0YXJlYSc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdFx0cmV0dXJuICFkZXZpY2VJc0FuZHJvaWQ7XG5cdGNhc2UgJ2lucHV0Jzpcblx0XHRzd2l0Y2ggKHRhcmdldC50eXBlKSB7XG5cdFx0Y2FzZSAnYnV0dG9uJzpcblx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0Y2FzZSAnZmlsZSc6XG5cdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdGNhc2UgJ3JhZGlvJzpcblx0XHRjYXNlICdzdWJtaXQnOlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdG8gZm9jdXMgZGlzYWJsZWQgaW5wdXRzXG5cdFx0cmV0dXJuICF0YXJnZXQuZGlzYWJsZWQgJiYgIXRhcmdldC5yZWFkT25seTtcblx0ZGVmYXVsdDpcblx0XHRyZXR1cm4gKC9cXGJuZWVkc2ZvY3VzXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcblx0fVxufTtcblxuXG4vKipcbiAqIFNlbmQgYSBjbGljayBldmVudCB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLnNlbmRDbGljayA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQsIGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGNsaWNrRXZlbnQsIHRvdWNoO1xuXG5cdC8vIE9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzIGFjdGl2ZUVsZW1lbnQgbmVlZHMgdG8gYmUgYmx1cnJlZCBvdGhlcndpc2UgdGhlIHN5bnRoZXRpYyBjbGljayB3aWxsIGhhdmUgbm8gZWZmZWN0ICgjMjQpXG5cdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRhcmdldEVsZW1lbnQpIHtcblx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0fVxuXG5cdHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cblx0Ly8gU3ludGhlc2lzZSBhIGNsaWNrIGV2ZW50LCB3aXRoIGFuIGV4dHJhIGF0dHJpYnV0ZSBzbyBpdCBjYW4gYmUgdHJhY2tlZFxuXHRjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnRzJyk7XG5cdGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQodGhpcy5kZXRlcm1pbmVFdmVudFR5cGUodGFyZ2V0RWxlbWVudCksIHRydWUsIHRydWUsIHdpbmRvdywgMSwgdG91Y2guc2NyZWVuWCwgdG91Y2guc2NyZWVuWSwgdG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXHRjbGlja0V2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQgPSB0cnVlO1xuXHR0YXJnZXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG59O1xuXG5GYXN0Q2xpY2sucHJvdG90eXBlLmRldGVybWluZUV2ZW50VHlwZSA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vSXNzdWUgIzE1OTogQW5kcm9pZCBDaHJvbWUgU2VsZWN0IEJveCBkb2VzIG5vdCBvcGVuIHdpdGggYSBzeW50aGV0aWMgY2xpY2sgZXZlbnRcblx0aWYgKGRldmljZUlzQW5kcm9pZCAmJiB0YXJnZXRFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcblx0XHRyZXR1cm4gJ21vdXNlZG93bic7XG5cdH1cblxuXHRyZXR1cm4gJ2NsaWNrJztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgbGVuZ3RoO1xuXG5cdC8vIElzc3VlICMxNjA6IG9uIGlPUyA3LCBzb21lIGlucHV0IGVsZW1lbnRzIChlLmcuIGRhdGUgZGF0ZXRpbWUpIHRocm93IGEgdmFndWUgVHlwZUVycm9yIG9uIHNldFNlbGVjdGlvblJhbmdlLiBUaGVzZSBlbGVtZW50cyBkb24ndCBoYXZlIGFuIGludGVnZXIgdmFsdWUgZm9yIHRoZSBzZWxlY3Rpb25TdGFydCBhbmQgc2VsZWN0aW9uRW5kIHByb3BlcnRpZXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IHRoYXQgY2FuJ3QgYmUgdXNlZCBmb3IgZGV0ZWN0aW9uIGJlY2F1c2UgYWNjZXNzaW5nIHRoZSBwcm9wZXJ0aWVzIGFsc28gdGhyb3dzIGEgVHlwZUVycm9yLiBKdXN0IGNoZWNrIHRoZSB0eXBlIGluc3RlYWQuIEZpbGVkIGFzIEFwcGxlIGJ1ZyAjMTUxMjI3MjQuXG5cdGlmIChkZXZpY2VJc0lPUyAmJiB0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlICYmIHRhcmdldEVsZW1lbnQudHlwZS5pbmRleE9mKCdkYXRlJykgIT09IDAgJiYgdGFyZ2V0RWxlbWVudC50eXBlICE9PSAndGltZScpIHtcblx0XHRsZW5ndGggPSB0YXJnZXRFbGVtZW50LnZhbHVlLmxlbmd0aDtcblx0XHR0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGxlbmd0aCwgbGVuZ3RoKTtcblx0fSBlbHNlIHtcblx0XHR0YXJnZXRFbGVtZW50LmZvY3VzKCk7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciBhbmQgaWYgc28sIHNldCBhIGZsYWcgb24gaXQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudXBkYXRlU2Nyb2xsUGFyZW50ID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBzY3JvbGxQYXJlbnQsIHBhcmVudEVsZW1lbnQ7XG5cblx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cblx0Ly8gQXR0ZW1wdCB0byBkaXNjb3ZlciB3aGV0aGVyIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgc2Nyb2xsYWJsZSBsYXllci4gUmUtY2hlY2sgaWYgdGhlXG5cdC8vIHRhcmdldCBlbGVtZW50IHdhcyBtb3ZlZCB0byBhbm90aGVyIHBhcmVudC5cblx0aWYgKCFzY3JvbGxQYXJlbnQgfHwgIXNjcm9sbFBhcmVudC5jb250YWlucyh0YXJnZXRFbGVtZW50KSkge1xuXHRcdHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXHRcdGRvIHtcblx0XHRcdGlmIChwYXJlbnRFbGVtZW50LnNjcm9sbEhlaWdodCA+IHBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHRcdHNjcm9sbFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gcGFyZW50RWxlbWVudDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fSB3aGlsZSAocGFyZW50RWxlbWVudCk7XG5cdH1cblxuXHQvLyBBbHdheXMgdXBkYXRlIHRoZSBzY3JvbGwgdG9wIHRyYWNrZXIgaWYgcG9zc2libGUuXG5cdGlmIChzY3JvbGxQYXJlbnQpIHtcblx0XHRzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3A7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxFdmVudFRhcmdldH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0ID0gZnVuY3Rpb24oZXZlbnRUYXJnZXQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIE9uIHNvbWUgb2xkZXIgYnJvd3NlcnMgKG5vdGFibHkgU2FmYXJpIG9uIGlPUyA0LjEgLSBzZWUgaXNzdWUgIzU2KSB0aGUgZXZlbnQgdGFyZ2V0IG1heSBiZSBhIHRleHQgbm9kZS5cblx0aWYgKGV2ZW50VGFyZ2V0Lm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuXHRcdHJldHVybiBldmVudFRhcmdldC5wYXJlbnROb2RlO1xuXHR9XG5cblx0cmV0dXJuIGV2ZW50VGFyZ2V0O1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIHN0YXJ0LCByZWNvcmQgdGhlIHBvc2l0aW9uIGFuZCBzY3JvbGwgb2Zmc2V0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciB0YXJnZXRFbGVtZW50LCB0b3VjaCwgc2VsZWN0aW9uO1xuXG5cdC8vIElnbm9yZSBtdWx0aXBsZSB0b3VjaGVzLCBvdGhlcndpc2UgcGluY2gtdG8tem9vbSBpcyBwcmV2ZW50ZWQgaWYgYm90aCBmaW5nZXJzIGFyZSBvbiB0aGUgRmFzdENsaWNrIGVsZW1lbnQgKGlzc3VlICMxMTEpLlxuXHRpZiAoZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGggPiAxKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHR0YXJnZXRFbGVtZW50ID0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCk7XG5cdHRvdWNoID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXTtcblxuXHRpZiAoZGV2aWNlSXNJT1MpIHtcblxuXHRcdC8vIE9ubHkgdHJ1c3RlZCBldmVudHMgd2lsbCBkZXNlbGVjdCB0ZXh0IG9uIGlPUyAoaXNzdWUgIzQ5KVxuXHRcdHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcblx0XHRpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgJiYgIXNlbGVjdGlvbi5pc0NvbGxhcHNlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdFx0Ly8gV2VpcmQgdGhpbmdzIGhhcHBlbiBvbiBpT1Mgd2hlbiBhbiBhbGVydCBvciBjb25maXJtIGRpYWxvZyBpcyBvcGVuZWQgZnJvbSBhIGNsaWNrIGV2ZW50IGNhbGxiYWNrIChpc3N1ZSAjMjMpOlxuXHRcdFx0Ly8gd2hlbiB0aGUgdXNlciBuZXh0IHRhcHMgYW55d2hlcmUgZWxzZSBvbiB0aGUgcGFnZSwgbmV3IHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kIGV2ZW50cyBhcmUgZGlzcGF0Y2hlZFxuXHRcdFx0Ly8gd2l0aCB0aGUgc2FtZSBpZGVudGlmaWVyIGFzIHRoZSB0b3VjaCBldmVudCB0aGF0IHByZXZpb3VzbHkgdHJpZ2dlcmVkIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgYWxlcnQuXG5cdFx0XHQvLyBTYWRseSwgdGhlcmUgaXMgYW4gaXNzdWUgb24gaU9TIDQgdGhhdCBjYXVzZXMgc29tZSBub3JtYWwgdG91Y2ggZXZlbnRzIHRvIGhhdmUgdGhlIHNhbWUgaWRlbnRpZmllciBhcyBhblxuXHRcdFx0Ly8gaW1tZWRpYXRlbHkgcHJlY2VlZGluZyB0b3VjaCBldmVudCAoaXNzdWUgIzUyKSwgc28gdGhpcyBmaXggaXMgdW5hdmFpbGFibGUgb24gdGhhdCBwbGF0Zm9ybS5cblx0XHRcdC8vIElzc3VlIDEyMDogdG91Y2guaWRlbnRpZmllciBpcyAwIHdoZW4gQ2hyb21lIGRldiB0b29scyAnRW11bGF0ZSB0b3VjaCBldmVudHMnIGlzIHNldCB3aXRoIGFuIGlPUyBkZXZpY2UgVUEgc3RyaW5nLFxuXHRcdFx0Ly8gd2hpY2ggY2F1c2VzIGFsbCB0b3VjaCBldmVudHMgdG8gYmUgaWdub3JlZC4gQXMgdGhpcyBibG9jayBvbmx5IGFwcGxpZXMgdG8gaU9TLCBhbmQgaU9TIGlkZW50aWZpZXJzIGFyZSBhbHdheXMgbG9uZyxcblx0XHRcdC8vIHJhbmRvbSBpbnRlZ2VycywgaXQncyBzYWZlIHRvIHRvIGNvbnRpbnVlIGlmIHRoZSBpZGVudGlmaWVyIGlzIDAgaGVyZS5cblx0XHRcdGlmICh0b3VjaC5pZGVudGlmaWVyICYmIHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMubGFzdFRvdWNoSWRlbnRpZmllcikge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGFzdFRvdWNoSWRlbnRpZmllciA9IHRvdWNoLmlkZW50aWZpZXI7XG5cblx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciAodXNpbmcgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoKSBhbmQ6XG5cdFx0XHQvLyAxKSB0aGUgdXNlciBkb2VzIGEgZmxpbmcgc2Nyb2xsIG9uIHRoZSBzY3JvbGxhYmxlIGxheWVyXG5cdFx0XHQvLyAyKSB0aGUgdXNlciBzdG9wcyB0aGUgZmxpbmcgc2Nyb2xsIHdpdGggYW5vdGhlciB0YXBcblx0XHRcdC8vIHRoZW4gdGhlIGV2ZW50LnRhcmdldCBvZiB0aGUgbGFzdCAndG91Y2hlbmQnIGV2ZW50IHdpbGwgYmUgdGhlIGVsZW1lbnQgdGhhdCB3YXMgdW5kZXIgdGhlIHVzZXIncyBmaW5nZXJcblx0XHRcdC8vIHdoZW4gdGhlIGZsaW5nIHNjcm9sbCB3YXMgc3RhcnRlZCwgY2F1c2luZyBGYXN0Q2xpY2sgdG8gc2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoYXQgbGF5ZXIgLSB1bmxlc3MgYSBjaGVja1xuXHRcdFx0Ly8gaXMgbWFkZSB0byBlbnN1cmUgdGhhdCBhIHBhcmVudCBsYXllciB3YXMgbm90IHNjcm9sbGVkIGJlZm9yZSBzZW5kaW5nIGEgc3ludGhldGljIGNsaWNrIChpc3N1ZSAjNDIpLlxuXHRcdFx0dGhpcy51cGRhdGVTY3JvbGxQYXJlbnQodGFyZ2V0RWxlbWVudCk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy50cmFja2luZ0NsaWNrID0gdHJ1ZTtcblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSBldmVudC50aW1lU3RhbXA7XG5cdHRoaXMudGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XG5cblx0dGhpcy50b3VjaFN0YXJ0WCA9IHRvdWNoLnBhZ2VYO1xuXHR0aGlzLnRvdWNoU3RhcnRZID0gdG91Y2gucGFnZVk7XG5cblx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBCYXNlZCBvbiBhIHRvdWNobW92ZSBldmVudCBvYmplY3QsIGNoZWNrIHdoZXRoZXIgdGhlIHRvdWNoIGhhcyBtb3ZlZCBwYXN0IGEgYm91bmRhcnkgc2luY2UgaXQgc3RhcnRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudG91Y2hIYXNNb3ZlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sIGJvdW5kYXJ5ID0gdGhpcy50b3VjaEJvdW5kYXJ5O1xuXG5cdGlmIChNYXRoLmFicyh0b3VjaC5wYWdlWCAtIHRoaXMudG91Y2hTdGFydFgpID4gYm91bmRhcnkgfHwgTWF0aC5hYnModG91Y2gucGFnZVkgLSB0aGlzLnRvdWNoU3RhcnRZKSA+IGJvdW5kYXJ5KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qKlxuICogVXBkYXRlIHRoZSBsYXN0IHBvc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCF0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIElmIHRoZSB0b3VjaCBoYXMgbW92ZWQsIGNhbmNlbCB0aGUgY2xpY2sgdHJhY2tpbmdcblx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudCAhPT0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCkgfHwgdGhpcy50b3VjaEhhc01vdmVkKGV2ZW50KSkge1xuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGZpbmQgdGhlIGxhYmVsbGVkIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBsYWJlbCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8SFRNTExhYmVsRWxlbWVudH0gbGFiZWxFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLmZpbmRDb250cm9sID0gZnVuY3Rpb24obGFiZWxFbGVtZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBGYXN0IHBhdGggZm9yIG5ld2VyIGJyb3dzZXJzIHN1cHBvcnRpbmcgdGhlIEhUTUw1IGNvbnRyb2wgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuY29udHJvbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGxhYmVsRWxlbWVudC5jb250cm9sO1xuXHR9XG5cblx0Ly8gQWxsIGJyb3dzZXJzIHVuZGVyIHRlc3QgdGhhdCBzdXBwb3J0IHRvdWNoIGV2ZW50cyBhbHNvIHN1cHBvcnQgdGhlIEhUTUw1IGh0bWxGb3IgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuaHRtbEZvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYWJlbEVsZW1lbnQuaHRtbEZvcik7XG5cdH1cblxuXHQvLyBJZiBubyBmb3IgYXR0cmlidXRlIGV4aXN0cywgYXR0ZW1wdCB0byByZXRyaWV2ZSB0aGUgZmlyc3QgbGFiZWxsYWJsZSBkZXNjZW5kYW50IGVsZW1lbnRcblx0Ly8gdGhlIGxpc3Qgb2Ygd2hpY2ggaXMgZGVmaW5lZCBoZXJlOiBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxhYmVsXG5cdHJldHVybiBsYWJlbEVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSksIGtleWdlbiwgbWV0ZXIsIG91dHB1dCwgcHJvZ3Jlc3MsIHNlbGVjdCwgdGV4dGFyZWEnKTtcbn07XG5cblxuLyoqXG4gKiBPbiB0b3VjaCBlbmQsIGRldGVybWluZSB3aGV0aGVyIHRvIHNlbmQgYSBjbGljayBldmVudCBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZm9yRWxlbWVudCwgdHJhY2tpbmdDbGlja1N0YXJ0LCB0YXJnZXRUYWdOYW1lLCBzY3JvbGxQYXJlbnQsIHRvdWNoLCB0YXJnZXRFbGVtZW50ID0gdGhpcy50YXJnZXRFbGVtZW50O1xuXG5cdGlmICghdGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBQcmV2ZW50IHBoYW50b20gY2xpY2tzIG9uIGZhc3QgZG91YmxlLXRhcCAoaXNzdWUgIzM2KVxuXHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XG5cdFx0dGhpcy5jYW5jZWxOZXh0Q2xpY2sgPSB0cnVlO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gUmVzZXQgdG8gcHJldmVudCB3cm9uZyBjbGljayBjYW5jZWwgb24gaW5wdXQgKGlzc3VlICMxNTYpLlxuXHR0aGlzLmNhbmNlbE5leHRDbGljayA9IGZhbHNlO1xuXG5cdHRoaXMubGFzdENsaWNrVGltZSA9IGV2ZW50LnRpbWVTdGFtcDtcblxuXHR0cmFja2luZ0NsaWNrU3RhcnQgPSB0aGlzLnRyYWNraW5nQ2xpY2tTdGFydDtcblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcblxuXHQvLyBPbiBzb21lIGlPUyBkZXZpY2VzLCB0aGUgdGFyZ2V0RWxlbWVudCBzdXBwbGllZCB3aXRoIHRoZSBldmVudCBpcyBpbnZhbGlkIGlmIHRoZSBsYXllclxuXHQvLyBpcyBwZXJmb3JtaW5nIGEgdHJhbnNpdGlvbiBvciBzY3JvbGwsIGFuZCBoYXMgdG8gYmUgcmUtZGV0ZWN0ZWQgbWFudWFsbHkuIE5vdGUgdGhhdFxuXHQvLyBmb3IgdGhpcyB0byBmdW5jdGlvbiBjb3JyZWN0bHksIGl0IG11c3QgYmUgY2FsbGVkICphZnRlciogdGhlIGV2ZW50IHRhcmdldCBpcyBjaGVja2VkIVxuXHQvLyBTZWUgaXNzdWUgIzU3OyBhbHNvIGZpbGVkIGFzIHJkYXI6Ly8xMzA0ODU4OSAuXG5cdGlmIChkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQpIHtcblx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0Ly8gSW4gY2VydGFpbiBjYXNlcyBhcmd1bWVudHMgb2YgZWxlbWVudEZyb21Qb2ludCBjYW4gYmUgbmVnYXRpdmUsIHNvIHByZXZlbnQgc2V0dGluZyB0YXJnZXRFbGVtZW50IHRvIG51bGxcblx0XHR0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaC5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgdG91Y2gucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpIHx8IHRhcmdldEVsZW1lbnQ7XG5cdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHR9XG5cblx0dGFyZ2V0VGFnTmFtZSA9IHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRpZiAodGFyZ2V0VGFnTmFtZSA9PT0gJ2xhYmVsJykge1xuXHRcdGZvckVsZW1lbnQgPSB0aGlzLmZpbmRDb250cm9sKHRhcmdldEVsZW1lbnQpO1xuXHRcdGlmIChmb3JFbGVtZW50KSB7XG5cdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xuXHRcdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRhcmdldEVsZW1lbnQgPSBmb3JFbGVtZW50O1xuXHRcdH1cblx0fSBlbHNlIGlmICh0aGlzLm5lZWRzRm9jdXModGFyZ2V0RWxlbWVudCkpIHtcblxuXHRcdC8vIENhc2UgMTogSWYgdGhlIHRvdWNoIHN0YXJ0ZWQgYSB3aGlsZSBhZ28gKGJlc3QgZ3Vlc3MgaXMgMTAwbXMgYmFzZWQgb24gdGVzdHMgZm9yIGlzc3VlICMzNikgdGhlbiBmb2N1cyB3aWxsIGJlIHRyaWdnZXJlZCBhbnl3YXkuIFJldHVybiBlYXJseSBhbmQgdW5zZXQgdGhlIHRhcmdldCBlbGVtZW50IHJlZmVyZW5jZSBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IGNsaWNrIHdpbGwgYmUgYWxsb3dlZCB0aHJvdWdoLlxuXHRcdC8vIENhc2UgMjogV2l0aG91dCB0aGlzIGV4Y2VwdGlvbiBmb3IgaW5wdXQgZWxlbWVudHMgdGFwcGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIGNvbnRhaW5lZCBpbiBhbiBpZnJhbWUsIHRoZW4gYW55IGlucHV0dGVkIHRleHQgd29uJ3QgYmUgdmlzaWJsZSBldmVuIHRob3VnaCB0aGUgdmFsdWUgYXR0cmlidXRlIGlzIHVwZGF0ZWQgYXMgdGhlIHVzZXIgdHlwZXMgKGlzc3VlICMzNykuXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0cmFja2luZ0NsaWNrU3RhcnQpID4gMTAwIHx8IChkZXZpY2VJc0lPUyAmJiB3aW5kb3cudG9wICE9PSB3aW5kb3cgJiYgdGFyZ2V0VGFnTmFtZSA9PT0gJ2lucHV0JykpIHtcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcblx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XG5cblx0XHQvLyBTZWxlY3QgZWxlbWVudHMgbmVlZCB0aGUgZXZlbnQgdG8gZ28gdGhyb3VnaCBvbiBpT1MgNCwgb3RoZXJ3aXNlIHRoZSBzZWxlY3RvciBtZW51IHdvbid0IG9wZW4uXG5cdFx0Ly8gQWxzbyB0aGlzIGJyZWFrcyBvcGVuaW5nIHNlbGVjdHMgd2hlbiBWb2ljZU92ZXIgaXMgYWN0aXZlIG9uIGlPUzYsIGlPUzcgKGFuZCBwb3NzaWJseSBvdGhlcnMpXG5cdFx0aWYgKCFkZXZpY2VJc0lPUyB8fCB0YXJnZXRUYWdOYW1lICE9PSAnc2VsZWN0Jykge1xuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKGRldmljZUlzSU9TICYmICFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgaWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgbGF5ZXIgdGhhdCB3YXMgc2Nyb2xsZWRcblx0XHQvLyBhbmQgdGhpcyB0YXAgaXMgYmVpbmcgdXNlZCB0byBzdG9wIHRoZSBzY3JvbGxpbmcgKHVzdWFsbHkgaW5pdGlhdGVkIGJ5IGEgZmxpbmcgLSBpc3N1ZSAjNDIpLlxuXHRcdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHRcdGlmIChzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50LmZhc3RDbGlja0xhc3RTY3JvbGxUb3AgIT09IHNjcm9sbFBhcmVudC5zY3JvbGxUb3ApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdC8vIFByZXZlbnQgdGhlIGFjdHVhbCBjbGljayBmcm9tIGdvaW5nIHRob3VnaCAtIHVubGVzcyB0aGUgdGFyZ2V0IG5vZGUgaXMgbWFya2VkIGFzIHJlcXVpcmluZ1xuXHQvLyByZWFsIGNsaWNrcyBvciBpZiBpdCBpcyBpbiB0aGUgd2hpdGVsaXN0IGluIHdoaWNoIGNhc2Ugb25seSBub24tcHJvZ3JhbW1hdGljIGNsaWNrcyBhcmUgcGVybWl0dGVkLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0YXJnZXRFbGVtZW50KSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5zZW5kQ2xpY2sodGFyZ2V0RWxlbWVudCwgZXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIGNhbmNlbCwgc3RvcCB0cmFja2luZyB0aGUgY2xpY2suXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xufTtcblxuXG4vKipcbiAqIERldGVybWluZSBtb3VzZSBldmVudHMgd2hpY2ggc2hvdWxkIGJlIHBlcm1pdHRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Nb3VzZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBJZiBhIHRhcmdldCBlbGVtZW50IHdhcyBuZXZlciBzZXQgKGJlY2F1c2UgYSB0b3VjaCBldmVudCB3YXMgbmV2ZXIgZmlyZWQpIGFsbG93IHRoZSBldmVudFxuXHRpZiAoIXRoaXMudGFyZ2V0RWxlbWVudCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKGV2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFByb2dyYW1tYXRpY2FsbHkgZ2VuZXJhdGVkIGV2ZW50cyB0YXJnZXRpbmcgYSBzcGVjaWZpYyBlbGVtZW50IHNob3VsZCBiZSBwZXJtaXR0ZWRcblx0aWYgKCFldmVudC5jYW5jZWxhYmxlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBEZXJpdmUgYW5kIGNoZWNrIHRoZSB0YXJnZXQgZWxlbWVudCB0byBzZWUgd2hldGhlciB0aGUgbW91c2UgZXZlbnQgbmVlZHMgdG8gYmUgcGVybWl0dGVkO1xuXHQvLyB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLCBwcmV2ZW50IG5vbi10b3VjaCBjbGljayBldmVudHMgZnJvbSB0cmlnZ2VyaW5nIGFjdGlvbnMsXG5cdC8vIHRvIHByZXZlbnQgZ2hvc3QvZG91YmxlY2xpY2tzLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0aGlzLnRhcmdldEVsZW1lbnQpIHx8IHRoaXMuY2FuY2VsTmV4dENsaWNrKSB7XG5cblx0XHQvLyBQcmV2ZW50IGFueSB1c2VyLWFkZGVkIGxpc3RlbmVycyBkZWNsYXJlZCBvbiBGYXN0Q2xpY2sgZWxlbWVudCBmcm9tIGJlaW5nIGZpcmVkLlxuXHRcdGlmIChldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcblx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFBhcnQgb2YgdGhlIGhhY2sgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxuXHRcdFx0ZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBDYW5jZWwgdGhlIGV2ZW50XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIElmIHRoZSBtb3VzZSBldmVudCBpcyBwZXJtaXR0ZWQsIHJldHVybiB0cnVlIGZvciB0aGUgYWN0aW9uIHRvIGdvIHRocm91Z2guXG5cdHJldHVybiB0cnVlO1xufTtcblxuXG4vKipcbiAqIE9uIGFjdHVhbCBjbGlja3MsIGRldGVybWluZSB3aGV0aGVyIHRoaXMgaXMgYSB0b3VjaC1nZW5lcmF0ZWQgY2xpY2ssIGEgY2xpY2sgYWN0aW9uIG9jY3VycmluZ1xuICogbmF0dXJhbGx5IGFmdGVyIGEgZGVsYXkgYWZ0ZXIgYSB0b3VjaCAod2hpY2ggbmVlZHMgdG8gYmUgY2FuY2VsbGVkIHRvIGF2b2lkIGR1cGxpY2F0aW9uKSwgb3JcbiAqIGFuIGFjdHVhbCBjbGljayB3aGljaCBzaG91bGQgYmUgcGVybWl0dGVkLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgcGVybWl0dGVkO1xuXG5cdC8vIEl0J3MgcG9zc2libGUgZm9yIGFub3RoZXIgRmFzdENsaWNrLWxpa2UgbGlicmFyeSBkZWxpdmVyZWQgd2l0aCB0aGlyZC1wYXJ0eSBjb2RlIHRvIGZpcmUgYSBjbGljayBldmVudCBiZWZvcmUgRmFzdENsaWNrIGRvZXMgKGlzc3VlICM0NCkuIEluIHRoYXQgY2FzZSwgc2V0IHRoZSBjbGljay10cmFja2luZyBmbGFnIGJhY2sgdG8gZmFsc2UgYW5kIHJldHVybiBlYXJseS4gVGhpcyB3aWxsIGNhdXNlIG9uVG91Y2hFbmQgdG8gcmV0dXJuIGVhcmx5LlxuXHRpZiAodGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFZlcnkgb2RkIGJlaGF2aW91ciBvbiBpT1MgKGlzc3VlICMxOCk6IGlmIGEgc3VibWl0IGVsZW1lbnQgaXMgcHJlc2VudCBpbnNpZGUgYSBmb3JtIGFuZCB0aGUgdXNlciBoaXRzIGVudGVyIGluIHRoZSBpT1Mgc2ltdWxhdG9yIG9yIGNsaWNrcyB0aGUgR28gYnV0dG9uIG9uIHRoZSBwb3AtdXAgT1Mga2V5Ym9hcmQgdGhlIGEga2luZCBvZiAnZmFrZScgY2xpY2sgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2l0aCB0aGUgc3VibWl0LXR5cGUgaW5wdXQgZWxlbWVudCBhcyB0aGUgdGFyZ2V0LlxuXHRpZiAoZXZlbnQudGFyZ2V0LnR5cGUgPT09ICdzdWJtaXQnICYmIGV2ZW50LmRldGFpbCA9PT0gMCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cGVybWl0dGVkID0gdGhpcy5vbk1vdXNlKGV2ZW50KTtcblxuXHQvLyBPbmx5IHVuc2V0IHRhcmdldEVsZW1lbnQgaWYgdGhlIGNsaWNrIGlzIG5vdCBwZXJtaXR0ZWQuIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCB0aGUgY2hlY2sgZm9yICF0YXJnZXRFbGVtZW50IGluIG9uTW91c2UgZmFpbHMgYW5kIHRoZSBicm93c2VyJ3MgY2xpY2sgZG9lc24ndCBnbyB0aHJvdWdoLlxuXHRpZiAoIXBlcm1pdHRlZCkge1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHQvLyBJZiBjbGlja3MgYXJlIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cblx0cmV0dXJuIHBlcm1pdHRlZDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYWxsIEZhc3RDbGljaydzIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGxheWVyID0gdGhpcy5sYXllcjtcblxuXHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHR9XG5cblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQsIGZhbHNlKTtcblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMub25Ub3VjaENhbmNlbCwgZmFsc2UpO1xufTtcblxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgRmFzdENsaWNrIGlzIG5lZWRlZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cbiAqL1xuRmFzdENsaWNrLm5vdE5lZWRlZCA9IGZ1bmN0aW9uKGxheWVyKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG1ldGFWaWV3cG9ydDtcblx0dmFyIGNocm9tZVZlcnNpb247XG5cdHZhciBibGFja2JlcnJ5VmVyc2lvbjtcblxuXHQvLyBEZXZpY2VzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0b3VjaCBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRpZiAodHlwZW9mIHdpbmRvdy5vbnRvdWNoc3RhcnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBDaHJvbWUgdmVyc2lvbiAtIHplcm8gZm9yIG90aGVyIGJyb3dzZXJzXG5cdGNocm9tZVZlcnNpb24gPSArKC9DaHJvbWVcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcblxuXHRpZiAoY2hyb21lVmVyc2lvbikge1xuXG5cdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xuXG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XG5cdFx0XHRcdC8vIENocm9tZSBvbiBBbmRyb2lkIHdpdGggdXNlci1zY2FsYWJsZT1cIm5vXCIgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzg5KVxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIENocm9tZSAzMiBhbmQgYWJvdmUgd2l0aCB3aWR0aD1kZXZpY2Utd2lkdGggb3IgbGVzcyBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRcdFx0XHRpZiAoY2hyb21lVmVyc2lvbiA+IDMxICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBDaHJvbWUgZGVza3RvcCBkb2Vzbid0IG5lZWQgRmFzdENsaWNrIChpc3N1ZSAjMTUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdGlmIChkZXZpY2VJc0JsYWNrQmVycnkxMCkge1xuXHRcdGJsYWNrYmVycnlWZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcLyhbMC05XSopXFwuKFswLTldKikvKTtcblxuXHRcdC8vIEJsYWNrQmVycnkgMTAuMysgZG9lcyBub3QgcmVxdWlyZSBGYXN0Y2xpY2sgbGlicmFyeS5cblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vZnRsYWJzL2Zhc3RjbGljay9pc3N1ZXMvMjUxXG5cdFx0aWYgKGJsYWNrYmVycnlWZXJzaW9uWzFdID49IDEwICYmIGJsYWNrYmVycnlWZXJzaW9uWzJdID49IDMpIHtcblx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcblxuXHRcdFx0aWYgKG1ldGFWaWV3cG9ydCkge1xuXHRcdFx0XHQvLyB1c2VyLXNjYWxhYmxlPW5vIGVsaW1pbmF0ZXMgY2xpY2sgZGVsYXkuXG5cdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gd2lkdGg9ZGV2aWNlLXdpZHRoIChvciBsZXNzIHRoYW4gZGV2aWNlLXdpZHRoKSBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBJRTEwIHdpdGggLW1zLXRvdWNoLWFjdGlvbjogbm9uZSwgd2hpY2ggZGlzYWJsZXMgZG91YmxlLXRhcC10by16b29tIChpc3N1ZSAjOTcpXG5cdGlmIChsYXllci5zdHlsZS5tc1RvdWNoQWN0aW9uID09PSAnbm9uZScpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBGYXN0Q2xpY2sgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuRmFzdENsaWNrLmF0dGFjaCA9IGZ1bmN0aW9uKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0cmV0dXJuIG5ldyBGYXN0Q2xpY2sobGF5ZXIsIG9wdGlvbnMpO1xufTtcblxuXG5pZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblxuXHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdGRlZmluZShmdW5jdGlvbigpIHtcblx0XHQndXNlIHN0cmljdCc7XG5cdFx0cmV0dXJuIEZhc3RDbGljaztcblx0fSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gRmFzdENsaWNrLmF0dGFjaDtcblx0bW9kdWxlLmV4cG9ydHMuRmFzdENsaWNrID0gRmFzdENsaWNrO1xufSBlbHNlIHtcblx0d2luZG93LkZhc3RDbGljayA9IEZhc3RDbGljaztcbn1cbiIsInN0b3JlcyA9IHJlcXVpcmUgJy4vc3RvcmVzJ1xucm91dGVzID0gcmVxdWlyZSAnLi9yb3V0ZXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3RhdGljRmlsZXM6IF9fZGlybmFtZStcIi9wdWJsaWNcIlxuICBzdG9yZUlkOiBcInN0b3JlX3N0YXRlX2Zyb21fc2VydmVyXCJcbiAgYXBwSWQ6IFwiYXBwXCJcbiAgcm91dGVzOiByb3V0ZXNcbiAgc3RvcmVzOiBzdG9yZXMiLCJRID0gcmVxdWlyZSAncSdcblJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5JbmRleFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2luZGV4J1xuVGVhbVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3RlYW0nXG5QbGF5ZXJWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9wbGF5ZXInXG5HYW1lVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvZ2FtZSdcblNjaGVkdWxlVmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvc2NoZWR1bGUnXG5TdGFuZGluZ3NWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9zdGFuZGluZ3MnXG5TdGF0c1ZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3N0YXRzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIFwiL1wiOiAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKVxuICAgICAgQHN0b3JlLmZldGNoKFwidGVhbXNcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YXRzXCIpXG4gICAgXSwgKHN0YW5kaW5ncywgdGVhbXNMaXN0LCBzdGF0c0xpc3QpIC0+XG4gICAgICB0aXRsZTogXCJFdHVzaXZ1XCJcbiAgICAgIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlRWxlbWVudCBJbmRleFZpZXcsXG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG4gICAgICAgIHRlYW1zOiB0ZWFtc0xpc3QudG9KU09OKClcbiAgICAgICAgc3RhdHM6IHN0YXRzTGlzdC50b0pTT04oKVxuXG4gIFwiL2pvdWtrdWVldC86aWQvOmFjdGl2ZT9cIjogKGlkLCBhY3RpdmUpIC0+XG4gICAgUS5zcHJlYWQgW1xuICAgICAgQHN0b3JlLmZldGNoKFwic3RhbmRpbmdzXCIpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJ0ZWFtXCIsIGlkOiBpZClcbiAgICBdLCAoc3RhbmRpbmdzLCB0ZWFtKSAtPlxuXG4gICAgICBzdWJUaXRsZSA9IHN3aXRjaCBhY3RpdmVcbiAgICAgICAgd2hlbiBcInBlbGFhamF0XCIgdGhlbiBcIlBlbGFhamF0XCJcbiAgICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcIlRpbGFzdG90XCJcbiAgICAgICAgZWxzZSBcIk90dGVsdW9oamVsbWFcIlxuXG4gICAgICB0aXRsZTogXCJKb3Vra3VlZXQgLSAje3RlYW0uZ2V0KFwiaW5mb1wiKS5uYW1lfSAtICN7c3ViVGl0bGV9XCJcbiAgICAgIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlRWxlbWVudCBUZWFtVmlldyxcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG4gICAgICAgIHRlYW06IHRlYW0udG9KU09OKClcbiAgICAgICAgYWN0aXZlOiBhY3RpdmVcblxuICBcIi9qb3Vra3VlZXQvOmlkLzpwaWQvOnNsdWdcIjogKGlkLCBwaWQsIHNsdWcpIC0+XG4gICAgQHN0b3JlLmZldGNoKFwidGVhbVwiLCBpZDogaWQpLnRoZW4gKHRlYW0pIC0+XG4gICAgICBwbGF5ZXIgPSB0ZWFtLmdldChcInJvc3RlclwiKS5maWx0ZXIoKHBsYXllcikgLT5cbiAgICAgICAgcGxheWVyLmlkIGlzIFwiI3twaWR9LyN7c2x1Z31cIlxuICAgICAgKVswXVxuICAgICAgdGl0bGU6IFwiUGVsYWFqYXQgLSAje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUVsZW1lbnQgUGxheWVyVmlldyxcbiAgICAgICAgaWQ6IHBpZFxuICAgICAgICBwbGF5ZXI6IHBsYXllclxuICAgICAgICB0ZWFtOiB0ZWFtLnRvSlNPTigpXG5cbiAgXCIvb3R0ZWx1dFwiOiAtPlxuICAgIEBzdG9yZS5mZXRjaChcInNjaGVkdWxlXCIpLnRoZW4gKHNjaGVkdWxlKSAtPlxuICAgICAgdGl0bGU6IFwiT3R0ZWx1b2hqZWxtYVwiXG4gICAgICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUVsZW1lbnQgU2NoZWR1bGVWaWV3LFxuICAgICAgICBzY2hlZHVsZTogc2NoZWR1bGUudG9KU09OKClcblxuICBcIi9vdHRlbHV0LzppZC86YWN0aXZlP1wiOiAoaWQsIGFjdGl2ZSkgLT5cbiAgICBRLnNwcmVhZCBbXG4gICAgICBAc3RvcmUuZmV0Y2goXCJzY2hlZHVsZVwiKVxuICAgICAgQHN0b3JlLmZldGNoKFwiZ2FtZUV2ZW50c1wiLCBpZDogaWQpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lTGluZXVwc1wiLCBpZDogaWQpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lU3RhdHNcIiwgaWQ6IGlkKVxuICAgIF0sIChzY2hlZHVsZSwgZXZlbnRzLCBsaW5lVXBzLCBzdGF0cykgLT5cbiAgICAgIGdhbWUgPSBzY2hlZHVsZS5maW5kIChnKSAtPlxuICAgICAgICBnLmlkIGlzIGlkXG5cbiAgICAgIHRpdGxlOiBcIk90dGVsdSAtICN7Z2FtZS5nZXQoXCJob21lXCIpfSB2cyAje2dhbWUuZ2V0KFwiYXdheVwiKX1cIlxuICAgICAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVFbGVtZW50IEdhbWVWaWV3LFxuICAgICAgICBpZDogaWRcbiAgICAgICAgZ2FtZTogZ2FtZS50b0pTT04oKVxuICAgICAgICBldmVudHM6IGV2ZW50cy50b0pTT04oKVxuICAgICAgICBsaW5lVXBzOiBsaW5lVXBzLnRvSlNPTigpXG4gICAgICAgIHN0YXRzOiBzdGF0cy50b0pTT04oKVxuICAgICAgICBhY3RpdmU6IGFjdGl2ZVxuXG4gIFwiL3NhcmphdGF1bHVra29cIjogLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJzdGFuZGluZ3NcIikudGhlbiAoc3RhbmRpbmdzKSAtPlxuICAgICAgdGl0bGU6IFwiU2FyamF0YXVsdWtrb1wiXG4gICAgICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUVsZW1lbnQgU3RhbmRpbmdzVmlldyxcbiAgICAgICAgc3RhbmRpbmdzOiBzdGFuZGluZ3MudG9KU09OKClcblxuICBcIi90aWxhc3RvdC86YWN0aXZlP1wiOiAoYWN0aXZlKSAtPlxuICAgIEBzdG9yZS5mZXRjaChcInN0YXRzXCIpLnRoZW4gKHN0YXRzKSAtPlxuICAgICAgdGl0bGU6IFwiVGlsYXN0b3RcIlxuICAgICAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVFbGVtZW50IFN0YXRzVmlldyxcbiAgICAgICAgc3RhdHM6IHN0YXRzLnRvSlNPTigpXG4gICAgICAgIGFjdGl2ZTogYWN0aXZlIiwiVGVhbXNDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi9zdG9yZXMvdGVhbXMnXG5TY2hlZHVsZUNvbGxlY3Rpb24gPSByZXF1aXJlICcuL3N0b3Jlcy9zY2hlZHVsZSdcblN0YW5kaW5nc0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL3N0b3Jlcy9zdGFuZGluZ3MnXG5TdGF0c01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvc3RhdHMnXG5UZWFtTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy90ZWFtJ1xuR2FtZUV2ZW50c01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvZ2FtZV9ldmVudHMnXG5HYW1lTGluZXVwc01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvZ2FtZV9saW5ldXBzJ1xuR2FtZVN0YXRzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9nYW1lX3N0YXRzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHRlYW1zOiBUZWFtc0NvbGxlY3Rpb25cbiAgc2NoZWR1bGU6IFNjaGVkdWxlQ29sbGVjdGlvblxuICBzdGFuZGluZ3M6IFN0YW5kaW5nc0NvbGxlY3Rpb25cbiAgc3RhdHM6IFN0YXRzTW9kZWxcbiAgdGVhbTogVGVhbU1vZGVsXG4gIGdhbWVFdmVudHM6IEdhbWVFdmVudHNNb2RlbFxuICBnYW1lTGluZXVwczogR2FtZUxpbmV1cHNNb2RlbFxuICBnYW1lU3RhdHM6IEdhbWVTdGF0c01vZGVsIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cbkdhbWVFdmVudHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJnYW1lcy9ldmVudHMvI3tAc3RvcmVPcHRpb25zLmlkfVwiXG5cbiAgdXJsOiAtPlxuICAgIFwiI3thcGlDb25maWcudXJsfS9nYW1lcy9ldmVudHMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lRXZlbnRzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cbkdhbWVMaW5ldXBzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwiZ2FtZXMvbGluZXVwcy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L2dhbWVzL2xpbmV1cHMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lTGluZXVwcyIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5HYW1lU3RhdHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJnYW1lcy9zdGF0cy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L2dhbWVzL3N0YXRzLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVN0YXRzIiwiQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Db2xsZWN0aW9uXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5TY2hlZHVsZSA9IENvbGxlY3Rpb24uZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic2NoZWR1bGVcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3NjaGVkdWxlLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVkdWxlIiwiQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Db2xsZWN0aW9uXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5TdGFuZGluZ3MgPSBDb2xsZWN0aW9uLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInN0YW5kaW5nc1wiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vc3RhbmRpbmdzLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YW5kaW5ncyIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5TdGF0cyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInN0YXRzXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS9zdGF0cy5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0cyIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5UZWFtID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwidGVhbXMvI3tAc3RvcmVPcHRpb25zLmlkfVwiXG5cbiAgdXJsOiAtPlxuICAgIFwiI3thcGlDb25maWcudXJsfS90ZWFtcy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW0iLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblRlYW1zID0gQ29sbGVjdGlvbi5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJ0ZWFtc1wiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vdGVhbXMuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbXMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxue1JvdywgQ29sLCBOYXYsIE5hdkl0ZW0sIFRhYlBhbmV9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5HYW1lRXZlbnRzID0gcmVxdWlyZSAnLi9nYW1lX2V2ZW50cydcbkdhbWVMaW5ldXBzID0gcmVxdWlyZSAnLi9nYW1lX2xpbmV1cHMnXG5HYW1lU3RhdHMgPSByZXF1aXJlICcuL2dhbWVfc3RhdHMnXG5cbkdhbWUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgcmVuZGVyOiAtPlxuICAgIGFjdGl2ZUtleSA9IHN3aXRjaCBAcHJvcHMuYWN0aXZlXG4gICAgICB3aGVuIFwidGlsYXN0b3RcIiB0aGVuIFwic3RhdHNcIlxuICAgICAgd2hlbiBcImtldGp1dFwiIHRoZW4gXCJsaW5lVXBzXCJcbiAgICAgIGVsc2UgXCJldmVudHNcIlxuXG4gICAgIyBjb25zb2xlLmxvZyBcImV2ZW50c1wiLCBAcHJvcHMuZXZlbnRzXG4gICAgIyBjb25zb2xlLmxvZyBcImxpbmV1cHNcIiwgQHByb3BzLmxpbmVVcHNcbiAgICAjY29uc29sZS5sb2cgXCJzdGF0c1wiLCBAcHJvcHMuc3RhdHNcbiAgICAjIGNvbnNvbGUubG9nIFwiZ2FtZVwiLCBAcHJvcHMuZ2FtZVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoNCksIFwibWRcIjogKDQpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgKEBwcm9wcy5nYW1lLmhvbWUpKVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoNCksIFwibWRcIjogKDQpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgKEBwcm9wcy5nYW1lLmhvbWVTY29yZSksIFwiIC0gXCIsIChAcHJvcHMuZ2FtZS5hd2F5U2NvcmUpKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiWWxlaXNcXHUwMGY2XFx1MDBlNDogXCIsIChAcHJvcHMuZ2FtZS5hdHRlbmRhbmNlKSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIChAcHJvcHMuZ2FtZS5hd2F5KSlcbiAgICAgICAgKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfVwiLCBcImV2ZW50S2V5XCI6IFwiZXZlbnRzXCJ9LCBcIlRhcGFodHVtYXRcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfS90aWxhc3RvdFwiLCBcImV2ZW50S2V5XCI6IFwic3RhdHNcIn0sIFwiVGlsYXN0b3RcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfS9rZXRqdXRcIiwgXCJldmVudEtleVwiOiBcImxpbmVVcHNcIn0sIFwiS2V0anV0XCIpXG4gICAgICApLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYi1jb250ZW50XCIsIFwicmVmXCI6IFwicGFuZXNcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwiZXZlbnRzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJldmVudHNcIil9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2FtZUV2ZW50cywge1wiZXZlbnRzXCI6IChAcHJvcHMuZXZlbnRzKSwgXCJnYW1lXCI6IChAcHJvcHMuZ2FtZSl9KVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic3RhdHNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInN0YXRzXCIpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdhbWVTdGF0cywge1wic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwibGluZVVwc1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwibGluZVVwc1wiKX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHYW1lTGluZXVwcywge1wibGluZVVwc1wiOiAoQHByb3BzLmxpbmVVcHMpfSlcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuIyB7Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbkdhbWVFdmVudHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGV2ZW50OiAoZXZlbnQsIGkpIC0+XG4gICAgaWYgZXZlbnQuaGVhZGVyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge1wia2V5XCI6IChldmVudC5oZWFkZXIpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNvbFNwYW5cIjogXCIzXCJ9LCAoZXZlbnQuaGVhZGVyKSlcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge1wia2V5XCI6IChpKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoQHByb3BzLmdhbWVbZXZlbnQudGVhbV0pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChldmVudC50aW1lKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZXZlbnQudGV4dCkpXG4gICAgICApXG5cbiAgcmVuZGVyOiAtPlxuICAgIGV2ZW50cyA9IE9iamVjdC5rZXlzKEBwcm9wcy5ldmVudHMpLnJlZHVjZSAoYXJyLCBrZXkpID0+XG4gICAgICBhcnIucHVzaCBoZWFkZXI6IGtleVxuICAgICAgYXJyID0gYXJyLmNvbmNhdCBAcHJvcHMuZXZlbnRzW2tleV1cbiAgICAgIGFyclxuICAgICwgW11cblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICAoZXZlbnRzLm1hcCAoZXZlbnQsIGkpID0+XG4gICAgICAgICAgQGV2ZW50KGV2ZW50LCBpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVFdmVudHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuIyB7Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbkdhbWVMaW5ldXBzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn1cbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUxpbmV1cHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuIyB7Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbkdhbWVTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICAoQHByb3BzLnN0YXRzLmhvbWUucGxheWVycy5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSlcbiAgICAgICAgKSxcblxuICAgICAgICAoQHByb3BzLnN0YXRzLmhvbWUuZ29hbGllcy5tYXAgKGdvYWxpZSkgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge1wia2V5XCI6IChnb2FsaWUuaWQpfSwgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChnb2FsaWUuZmlyc3ROYW1lKSwgXCIgXCIsIChnb2FsaWUubGFzdE5hbWUpKSlcbiAgICAgICAgKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sXG4gICAgICAgIChAcHJvcHMuc3RhdHMuYXdheS5wbGF5ZXJzLm1hcCAocGxheWVyKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKVxuICAgICAgICApLFxuXG4gICAgICAgIChAcHJvcHMuc3RhdHMuYXdheS5nb2FsaWVzLm1hcCAoZ29hbGllKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKGdvYWxpZS5pZCl9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGdvYWxpZS5maXJzdE5hbWUpLCBcIiBcIiwgKGdvYWxpZS5sYXN0TmFtZSkpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zTGlzdFZpZXcgPSByZXF1aXJlICcuL3RlYW1zX2xpc3QnXG5Ub3BTY29yZXJzVmlldyA9IHJlcXVpcmUgJy4vdG9wX3Njb3JlcnMnXG5cbkluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcImp1bWJvdHJvblwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiTGlpZ2EucHdcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIFwiTGlpZ2FuIHRpbGFzdG90IG5vcGVhc3RpIGphIHZhaXZhdHRvbWFzdGlcIilcbiAgICAgICksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbXNMaXN0Vmlldywge1widGVhbXNcIjogKEBwcm9wcy50ZWFtcyl9KSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUb3BTY29yZXJzVmlldywge1wic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4IiwiVGFibGVTb3J0TWl4aW4gPVxuICBzZXRTb3J0OiAoZXZlbnQpIC0+XG4gICAgc29ydCA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnNvcnRcbiAgICBpZiBzb3J0XG4gICAgICB0eXBlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQudHlwZSBvciBcImludGVnZXJcIlxuICAgICAgaWYgQHN0YXRlLnNvcnRGaWVsZCBpcyBzb3J0XG4gICAgICAgIG5ld1NvcnQgPSBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIiB0aGVuIFwiYXNjXCIgZWxzZSBcImRlc2NcIlxuICAgICAgICBAc2V0U3RhdGUgc29ydERpcmVjdGlvbjogbmV3U29ydCwgc29ydFR5cGU6IHR5cGVcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldFN0YXRlIHNvcnRGaWVsZDogc29ydCwgc29ydFR5cGU6IHR5cGVcblxuICBzb3J0OiAoYSwgYikgLT5cbiAgICBzd2l0Y2ggQHN0YXRlLnNvcnRUeXBlXG4gICAgICB3aGVuIFwiaW50ZWdlclwiXG4gICAgICAgIGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiXG4gICAgICAgICAgYltAc3RhdGUuc29ydEZpZWxkXSAtIGFbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFbQHN0YXRlLnNvcnRGaWVsZF0gLSBiW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICB3aGVuIFwiZmxvYXRcIlxuICAgICAgICBhVmFsdWUgPSBOdW1iZXIoYVtAc3RhdGUuc29ydEZpZWxkXS5yZXBsYWNlKFwiJVwiLFwiXCIpLnJlcGxhY2UoL1xcLHxcXDovLFwiLlwiKSkgb3IgMFxuICAgICAgICBiVmFsdWUgPSBOdW1iZXIoYltAc3RhdGUuc29ydEZpZWxkXS5yZXBsYWNlKFwiJVwiLFwiXCIpLnJlcGxhY2UoL1xcLHxcXDovLFwiLlwiKSkgb3IgMFxuICAgICAgICBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIlxuICAgICAgICAgIGJWYWx1ZSAtIGFWYWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYVZhbHVlIC0gYlZhbHVlXG4gICAgICB3aGVuIFwic3RyaW5nXCJcbiAgICAgICAgaWYgQHN0YXRlLnNvcnREaXJlY3Rpb24gaXMgXCJkZXNjXCJcbiAgICAgICAgICBpZiBiW0BzdGF0ZS5zb3J0RmllbGRdIDwgYVtAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgLTFcbiAgICAgICAgICBlbHNlIGlmIGJbQHN0YXRlLnNvcnRGaWVsZF0gPiBhW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAxXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgYVtAc3RhdGUuc29ydEZpZWxkXSA8IGJbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgICAgIC0xXG4gICAgICAgICAgZWxzZSBpZiBhW0BzdGF0ZS5zb3J0RmllbGRdID4gYltAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgMVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIDBcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZVNvcnRNaXhpbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xue05hdmJhciwgTmF2LCBOYXZJdGVtLCBEcm9wZG93bkJ1dHRvbiwgTWVudUl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5OYXZpZ2F0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgYnJhbmQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJocmVmXCI6IFwiL1wiLCBcImNsYXNzTmFtZVwiOiBcIm5hdmJhci1icmFuZFwifSwgXCJMaWlnYVwiKVxuXG4gICAgdGVhbXMgPVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wZG93bkJ1dHRvbiwge1widGl0bGVcIjogXCJKb3Vra3VlZXRcIn0sXG4gICAgICAgIChPYmplY3Qua2V5cyhUZWFtcy5uYW1lc0FuZElkcykubWFwIChuYW1lKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHtcImtleVwiOiAoVGVhbXMubmFtZXNBbmRJZHNbbmFtZV0pLCBcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7VGVhbXMubmFtZXNBbmRJZHNbbmFtZV19XCJ9LCAobmFtZSkpXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIGlmIEBwcm9wcy5pdGVtXG4gICAgICBpdGVtID0gUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IChAcHJvcHMuaXRlbS51cmwpfSwgKEBwcm9wcy5pdGVtLnRpdGxlKSlcblxuICAgIGlmIEBwcm9wcy5kcm9wZG93blxuICAgICAgZHJvcGRvd24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duQnV0dG9uLCB7XCJ0aXRsZVwiOiAoQHByb3BzLmRyb3Bkb3duLnRpdGxlKX0sXG4gICAgICAgIChAcHJvcHMuZHJvcGRvd24uaXRlbXMubWFwIChpdGVtKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHtcImtleVwiOiAoaXRlbS50aXRsZSksIFwiaHJlZlwiOiAoaXRlbS51cmwpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhciwge1wiYnJhbmRcIjogKGJyYW5kKSwgXCJmaXhlZFRvcFwiOiB0cnVlLCBcInRvZ2dsZU5hdktleVwiOiAoMCl9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImNsYXNzTmFtZVwiOiBcImJzLW5hdmJhci1jb2xsYXBzZVwiLCBcImtleVwiOiAoMCksIFwicm9sZVwiOiBcIm5hdmlnYXRpb25cIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9zYXJqYXRhdWx1a2tvXCJ9LCBcIlNhcmphdGF1bHVra29cIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi90aWxhc3RvdFwifSwgXCJUaWxhc3RvdFwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL290dGVsdXRcIn0sIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgKHRlYW1zKSxcbiAgICAgICAgKGl0ZW0pLFxuICAgICAgICAoZHJvcGRvd24pXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmlnYXRpb24iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuUGxheWVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgcGxheWVyID0gQHByb3BzLnBsYXllclxuICAgIHRlYW0gPSBAcHJvcHMudGVhbVxuXG4gICAgcGxheWVycyA9XG4gICAgICB0aXRsZTogXCJQZWxhYWphdFwiLFxuICAgICAgaXRlbXM6IHRlYW0ucm9zdGVyLm1hcCAocGxheWVyKSA9PlxuICAgICAgICB0aXRsZTogXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgIHVybDogXCIvam91a2t1ZWV0LyN7dGVhbS5pbmZvLmlkfS8je3BsYXllci5pZH1cIlxuXG4gICAgIyBUT0RPOiBjaGVjayBwb3NpdGlvbiwgS0ggT0wgVkwgUCB1c2UgcGxheWVycywgTVYgdXNlIGdvYWxpZXNcbiAgICBzdGF0cyA9IHRlYW0uc3RhdHMucGxheWVycy5maWx0ZXIoKHBsYXllcikgPT5cbiAgICAgIFtpZCwgc2x1Z10gPSBwbGF5ZXIuaWQuc3BsaXQoXCIvXCIpXG4gICAgICBpZCBpcyBAcHJvcHMuaWRcbiAgICApWzBdXG5cbiAgICBpdGVtID1cbiAgICAgIHRpdGxlOiB0ZWFtLmluZm8ubmFtZVxuICAgICAgdXJsOiB0ZWFtLmluZm8udXJsXG5cbiAgICBjb25zb2xlLmxvZyBcInBsYXllclwiLCBwbGF5ZXJcbiAgICBjb25zb2xlLmxvZyBcInRlYW1cIiwgdGVhbVxuICAgIGNvbnNvbGUubG9nIFwic3RhdHNcIiwgc3RhdHNcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwicGxheWVyXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCB7XCJkcm9wZG93blwiOiAocGxheWVycyksIFwiaXRlbVwiOiAoaXRlbSl9KSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIG51bGwsIFwiI1wiLCAocGxheWVyLm51bWJlciksIFwiIFwiLCAocGxheWVyLnBvc2l0aW9uKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtLWxvZ28gI3t0ZWFtLmluZm8uaWR9XCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmluZm8uaWR9XCJ9KSwgXCIgXCIsICh0ZWFtLmluZm8ubmFtZSkpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIChtb21lbnQocGxheWVyLmJpcnRoZGF5KS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIChwbGF5ZXIuaGVpZ2h0KSwgXCIgY21cIiksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIChwbGF5ZXIud2VpZ2h0KSwgXCIga2dcIiksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIChwbGF5ZXIuc2hvb3RzKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk9cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlNcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlBcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlJcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIitcXHgyRi1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIitcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIi1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIllWTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiQVZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJWTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTCVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkFcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkElXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJBaWthXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIiwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLmdhbWVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZ29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5hc3Npc3RzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMucG9pbnRzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMucGVuYWx0aWVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMucGx1c01pbnVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMucGx1c3NlcykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLm1pbnVzZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wb3dlclBsYXlHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnNob3J0SGFuZGVkR29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy53aW5uaW5nR29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5zaG90cykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnNob290aW5nUGVyY2VudGFnZSkpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLmZhY2VvZmZzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZmFjZW9mZlBlcmNlbnRhZ2UpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wbGF5aW5nVGltZUF2ZXJhZ2UpKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5QbGF5ZXJTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk5hbWVcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJHYW1lc1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkdvYWxzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiQXNzaXN0c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlBvaW50c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlBlbmFsdGllc1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIitcXHgyRi1cIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChAcHJvcHMuc3RhdHMubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3twbGF5ZXIudGVhbUlkfS8je3BsYXllci5pZH1cIn0sIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXFx4M0VcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucG9pbnRzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnBsdXNNaW51cykpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5TY2hlZHVsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIGZpcnN0RGF0ZTogbW9tZW50KCkuc3RhcnRPZihcIm1vbnRoXCIpXG4gICAgbGFzdERhdGU6IG1vbWVudCgpLmVuZE9mKFwibW9udGhcIilcbiAgICBwcmV2aW91c1Zpc2libGU6IGZhbHNlXG4gICAgbmV4dFZpc2libGU6IGZhbHNlXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICBtb250aFJhbmdlczogLT5cbiAgICBbZmlyc3RHYW1lLCAuLi4sIGxhc3RHYW1lXSA9IEBwcm9wcy5zY2hlZHVsZVxuICAgIFttb21lbnQoZmlyc3RHYW1lLmRhdGUpLnN0YXJ0T2YoXCJtb250aFwiKSwgbW9tZW50KGxhc3RHYW1lLmRhdGUpLmVuZE9mKFwibW9udGhcIildXG5cbiAgZ2FtZUxpbms6IChnYW1lKSAtPlxuICAgIGlmIG1vbWVudChnYW1lLmRhdGUpLmVuZE9mKFwiZGF5XCIpIDwgbW9tZW50KClcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je2dhbWUuaWR9XCJ9LCAoZ2FtZS5ob21lKSwgXCIgLSBcIiwgKGdhbWUuYXdheSkpXG4gICAgZWxzZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgKGdhbWUuaG9tZSksIFwiIC0gXCIsIChnYW1lLmF3YXkpKVxuXG4gIHNob3dQcmV2aW91czogLT5cbiAgICBpZiBub3QgQHN0YXRlLnByZXZpb3VzVmlzaWJsZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjbGFzc05hbWVcIjogXCJsb2FkLW1vcmVcIiwgXCJjb2xTcGFuXCI6IDQsIFwib25DbGlja1wiOiAoQGxvYWRQcmV2aW91cyl9LCBcIk5cXHUwMGU0eXRcXHUwMGU0IGVkZWxsaXNldCBrdXVrYXVkZXQuLi5cIilcbiAgICAgICAgKVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIG51bGxcblxuICBzaG93TmV4dDogLT5cbiAgICBpZiBub3QgQHN0YXRlLm5leHRWaXNpYmxlXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNsYXNzTmFtZVwiOiBcImxvYWQtbW9yZVwiLCBcImNvbFNwYW5cIjogNCwgXCJvbkNsaWNrXCI6IChAbG9hZE5leHQpfSwgXCJOXFx1MDBlNHl0XFx1MDBlNCBzZXVyYWF2YXQga3V1a2F1ZGV0Li4uXCIpXG4gICAgICAgIClcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBudWxsXG5cbiAgbG9hZFByZXZpb3VzOiAtPlxuICAgIFtmaXJzdERhdGVdID0gQG1vbnRoUmFuZ2VzKClcbiAgICBAc2V0U3RhdGUoZmlyc3REYXRlOiBmaXJzdERhdGUsIHByZXZpb3VzVmlzaWJsZTogdHJ1ZSlcblxuICBsb2FkTmV4dDogLT5cbiAgICBbLi4uLCBsYXN0RGF0ZV0gPSBAbW9udGhSYW5nZXMoKVxuICAgIEBzZXRTdGF0ZShsYXN0RGF0ZTogbGFzdERhdGUsIG5leHRWaXNpYmxlOiB0cnVlKVxuXG4gIGdyb3VwZWRTY2hlZHVsZTogLT5cbiAgICBfLmNoYWluKEBwcm9wcy5zY2hlZHVsZSkuZmlsdGVyIChnYW1lKSA9PlxuICAgICAgZ2FtZURhdGUgPSBtb21lbnQoZ2FtZS5kYXRlKVxuICAgICAgZ2FtZURhdGUgPj0gQHN0YXRlLmZpcnN0RGF0ZSBhbmQgZ2FtZURhdGUgPD0gQHN0YXRlLmxhc3REYXRlXG4gICAgLmdyb3VwQnkgKGdhbWUpIC0+XG4gICAgICBtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgbW9udGhseUdhbWVzOiAtPlxuICAgIEBncm91cGVkU2NoZWR1bGUoKS5tYXAgKGdhbWVzLCBtb250aCkgPT5cbiAgICAgIGRhdGVzV2l0aEdhbWVzID0gXy5jaGFpbihnYW1lcykuZ3JvdXBCeSAoZ2FtZSkgLT5cbiAgICAgICAgbW9tZW50KGdhbWUuZGF0ZSkuZm9ybWF0KFwiREQuTU0uWVlZWVwiKVxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IDR9LCAobW9tZW50KG1vbnRoLCBcIllZWVktTU1cIikuZm9ybWF0KFwiTU1NTVwiKSkpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICAoZGF0ZXNXaXRoR2FtZXMubWFwIChnYW1lcywgZ2FtZURhdGUpID0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNsYXNzTmFtZVwiOiBcImdhbWUtZGF0ZVwiLCBcImNvbFNwYW5cIjogNH0sIChnYW1lRGF0ZSkpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgKGdhbWVzLm1hcCAoZ2FtZSkgPT5cbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoZ2FtZS5pZCl9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZ2FtZS50aW1lKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChAZ2FtZUxpbmsoZ2FtZSkpKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGdhbWUuaG9tZVNjb3JlKSwgXCItXCIsIChnYW1lLmF3YXlTY29yZSkpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZ2FtZS5hdHRlbmRhbmNlKSlcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInNjaGVkdWxlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiT3R0ZWx1b2hqZWxtYVwiKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICAoQHNob3dQcmV2aW91cygpKSxcbiAgICAgICAgKEBtb250aGx5R2FtZXMoKSksXG4gICAgICAgIChAc2hvd05leHQoKSlcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU2NoZWR1bGUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRhYmxlU29ydE1peGluID0gcmVxdWlyZSAnLi9taXhpbnMvdGFibGVfc29ydCdcblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5TdGFuZGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIG1peGluczogW1RhYmxlU29ydE1peGluXVxuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBzb3J0RmllbGQ6IFwicG9pbnRzXCJcbiAgICBzb3J0RGlyZWN0aW9uOiBcImRlc2NcIlxuICAgIHNvcnRUeXBlOiBcImludGVnZXJcIlxuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgcmVuZGVyOiAtPlxuICAgIHN0YW5kaW5ncyA9IEBwcm9wcy5zdGFuZGluZ3Muc29ydChAc29ydCkubWFwICh0ZWFtKSAtPlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAodGVhbS5uYW1lKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS5wb3NpdGlvbikpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tUZWFtcy5uYW1lVG9JZCh0ZWFtLm5hbWUpfVwifSwgKHRlYW0ubmFtZSkpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLmdhbWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS53aW5zKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS50aWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS5sb3NlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0uZXh0cmFQb2ludHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLnBvaW50cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0uZ29hbHNGb3IpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLmdvYWxzQWdhaW5zdCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0ucG93ZXJwbGF5UGVyY2VudGFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0uc2hvcnRoYW5kUGVyY2VudGFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0ucG9pbnRzUGVyR2FtZSkpXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgXCJTYXJqYXRhdWx1a2tvXCIpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRlYW0tc2NoZWR1bGVcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIHtcImNsYXNzTmFtZVwiOiBcInNvcnRhYmxlLXRoZWFkXCIsIFwib25DbGlja1wiOiAoQHNldFNvcnQpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdhbWVzXCJ9LCBcIk9cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJ3aW5zXCJ9LCBcIlZcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJ0aWVzXCJ9LCBcIlRcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJsb3Nlc1wifSwgXCJIXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiZXh0cmFQb2ludHNcIn0sIFwiTFBcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwb2ludHNcIn0sIFwiUFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdvYWxzRm9yXCJ9LCBcIlRNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiZ29hbHNBZ2FpbnN0XCJ9LCBcIlBNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicG93ZXJwbGF5UGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIllWJVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInNob3J0aGFuZFBlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJBViVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwb2ludHNQZXJHYW1lXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiUFxceDJGT1wiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsXG4gICAgICAgICAgICAoc3RhbmRpbmdzKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFuZGluZ3MiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbntUYWJQYW5lLCBOYXYsIE5hdkl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG5TdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICByZW5kZXI6IC0+XG4gICAgYWN0aXZlS2V5ID0gc3dpdGNoIEBwcm9wcy5hY3RpdmVcbiAgICAgIHdoZW4gXCJtYWFsaXZhaGRpdFwiIHRoZW4gXCJnb2FsaWVzXCJcbiAgICAgIGVsc2UgXCJwbGF5ZXJzXCJcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCBcIlRpbGFzdG90XCIpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2LCB7XCJic1N0eWxlXCI6IFwidGFic1wiLCBcImFjdGl2ZUtleVwiOiAoYWN0aXZlS2V5KSwgXCJyZWZcIjogXCJ0YWJzXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi90aWxhc3RvdFwiLCBcImV2ZW50S2V5XCI6IFwicGxheWVyc1wifSwgXCJLZW50dFxcdTAwZTRwZWxhYWphdFwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvdGlsYXN0b3QvbWFhbGl2YWhkaXRcIiwgXCJldmVudEtleVwiOiBcImdvYWxpZXNcIn0sIFwiTWFhbGl2YWhkaXRcIilcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWItY29udGVudFwiLCBcInJlZlwiOiBcInBhbmVzXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwicGxheWVyc1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwicGxheWVyc1wiKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwgbnVsbCwgXCJLZW50dFxcdTAwZTRwZWxhYWphdFwiKVxuXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcImdvYWxpZXNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcImdvYWxpZXNcIil9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIG51bGwsIFwiTWFhbGl2YWhkaXRcIilcblxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuUGxheWVyU3RhdHMgPSByZXF1aXJlICcuL3BsYXllcl9zdGF0cydcblRlYW1TY2hlZHVsZSA9IHJlcXVpcmUgJy4vdGVhbV9zY2hlZHVsZSdcblRlYW1TdGF0cyA9IHJlcXVpcmUgJy4vdGVhbV9zdGF0cydcblRlYW1Sb3N0ZXIgPSByZXF1aXJlICcuL3RlYW1fcm9zdGVyJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG57VGFiUGFuZSwgSnVtYm90cm9uLCBCdXR0b25Ub29sYmFyLCBCdXR0b24sIENvbCwgUm93LCBOYXYsIE5hdkl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgbG9nbzogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtcInNyY1wiOiAoVGVhbXMubG9nbyhAcHJvcHMudGVhbS5pbmZvLm5hbWUpKSwgXCJhbHRcIjogKEBwcm9wcy50ZWFtLmluZm8ubmFtZSl9KVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcInBlbGFhamF0XCIgdGhlbiBcInBsYXllcnNcIlxuICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcInN0YXRzXCJcbiAgICAgIGVsc2UgXCJzY2hlZHVsZVwiXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRlYW1cIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSnVtYm90cm9uLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHtcInhzXCI6ICgxMiksIFwibWRcIjogKDYpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIChAbG9nbygpKSwgXCIgXCIsIChAcHJvcHMudGVhbS5pbmZvLm5hbWUpKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoMTIpLCBcIm1kXCI6ICg2KX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGVhbS1jb250YWluZXJcIn0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8ubG9uZ05hbWUpKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCAoQHByb3BzLnRlYW0uaW5mby5hZGRyZXNzKSksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8uZW1haWwpKVxuICAgICAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwge1wiYnNTdHlsZVwiOiBcInByaW1hcnlcIiwgXCJic1NpemVcIjogXCJsYXJnZVwiLCBcImhyZWZcIjogKEBwcm9wcy50ZWFtLmluZm8udGlja2V0c1VybCl9LCBcIkxpcHV0XCIpLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtcImJzU3R5bGVcIjogXCJwcmltYXJ5XCIsIFwiYnNTaXplXCI6IFwibGFyZ2VcIiwgXCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLmxvY2F0aW9uVXJsKX0sIFwiSGFsbGluIHNpamFpbnRpXCIpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwge1wiYnNTdHlsZVwiOiBcInRhYnNcIiwgXCJhY3RpdmVLZXlcIjogKGFjdGl2ZUtleSksIFwicmVmXCI6IFwidGFic1wifSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMuaWR9XCIsIFwiZXZlbnRLZXlcIjogXCJzY2hlZHVsZVwifSwgXCJPdHRlbHV0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy5pZH0vdGlsYXN0b3RcIiwgXCJldmVudEtleVwiOiBcInN0YXRzXCJ9LCBcIlRpbGFzdG90XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy5pZH0vcGVsYWFqYXRcIiwgXCJldmVudEtleVwiOiBcInBsYXllcnNcIn0sIFwiUGVsYWFqYXRcIilcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFiLWNvbnRlbnRcIiwgXCJyZWZcIjogXCJwYW5lc1wifSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic2NoZWR1bGVcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInNjaGVkdWxlXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtU2NoZWR1bGUsIHtcInRlYW1cIjogKEBwcm9wcy50ZWFtKX0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJzdGF0c1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwic3RhdHNcIil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgXCJUaWxhc3RvdFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtU3RhdHMsIHtcInRlYW1JZFwiOiAoQHByb3BzLmlkKSwgXCJzdGF0c1wiOiAoQHByb3BzLnRlYW0uc3RhdHMpfSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInBsYXllcnNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInBsYXllcnNcIil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgXCJQZWxhYWphdFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtUm9zdGVyLCB7XCJ0ZWFtSWRcIjogKEBwcm9wcy5pZCksIFwicm9zdGVyXCI6IChAcHJvcHMudGVhbS5yb3N0ZXIpfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcblxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5UZWFtUm9zdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBncm91cGVkUm9zdGVyOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnJvc3RlcilcbiAgICAuZ3JvdXBCeSgocGxheWVyKSAtPiBwbGF5ZXIucG9zaXRpb24pXG4gICAgLnJlZHVjZSgocmVzdWx0LCBwbGF5ZXIsIHBvc2l0aW9uKSAtPlxuICAgICAgZ3JvdXAgPSBzd2l0Y2hcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiS0hcIiwgXCJPTFwiLCBcIlZMXCJdLCBwb3NpdGlvbikgdGhlbiBcIkh5w7Zra8Okw6Rqw6R0XCJcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiT1BcIiwgXCJWUFwiXSwgcG9zaXRpb24pIHRoZW4gXCJQdW9sdXN0YWphdFwiXG4gICAgICAgIHdoZW4gcG9zaXRpb24gaXMgXCJNVlwiIHRoZW4gXCJNYWFsaXZhaGRpdFwiXG4gICAgICByZXN1bHRbZ3JvdXBdIHx8PSBbXVxuICAgICAgcmVzdWx0W2dyb3VwXS5wdXNoIHBsYXllclxuICAgICAgcmVzdWx0XG4gICAgLCB7fSlcblxuICByZW5kZXI6IC0+XG4gICAgZ3JvdXBzID0gQGdyb3VwZWRSb3N0ZXIoKS5tYXAgKHBsYXllcnMsIGdyb3VwKSA9PlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIHtcImtleVwiOiAoZ3JvdXApfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNvbFNwYW5cIjogNn0sIChncm91cCkpXG4gICAgICAgICksXG4gICAgICAgIChfLmNoYWluKHBsYXllcnMpLmZsYXR0ZW4oKS5tYXAgKHBsYXllcikgPT5cbiAgICAgICAgICB1cmwgPSBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbUlkfS8je3BsYXllci5pZH1cIlxuICAgICAgICAgIHRpdGxlID0gXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiAodXJsKX0sICh0aXRsZSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIChwbGF5ZXIubnVtYmVyKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuaGVpZ2h0KSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci53ZWlnaHQpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnNob290cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChtb21lbnQoKS5kaWZmKHBsYXllci5iaXJ0aGRheSwgXCJ5ZWFyc1wiKSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJOaW1pXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTnVtZXJvXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUGl0dXVzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUGFpbm9cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJLXFx1MDBlNHRpc3l5c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIklrXFx1MDBlNFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKGdyb3VwcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVJvc3RlciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5UZWFtU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGdhbWVMaW5rOiAoZ2FtZSkgLT5cbiAgICBpZiBtb21lbnQoZ2FtZS5kYXRlKSA8IG1vbWVudCgpXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJocmVmXCI6IFwiL290dGVsdXQvI3tnYW1lLmlkfVwifSwgKEB0aXRsZVN0eWxlKGdhbWUuaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUoZ2FtZS5hd2F5KSkpXG4gICAgZWxzZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgKEB0aXRsZVN0eWxlKGdhbWUuaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUoZ2FtZS5hd2F5KSkpXG5cbiAgdGl0bGVTdHlsZTogKG5hbWUpIC0+XG4gICAgaWYgQHByb3BzLnRlYW0uaW5mby5uYW1lIGlzIG5hbWVcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgKG5hbWUpKVxuICAgIGVsc2VcbiAgICAgIG5hbWVcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtcInNyY1wiOiAoVGVhbXMubG9nbyhuYW1lKSksIFwiYWx0XCI6IChuYW1lKX0pXG5cbiAgZ3JvdXBlZFNjaGVkdWxlOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnRlYW0uc2NoZWR1bGUpLmdyb3VwQnkgKGdhbWUpIC0+XG4gICAgICBtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgcmVuZGVyOiAtPlxuICAgIG1vbnRobHlHYW1lcyA9IEBncm91cGVkU2NoZWR1bGUoKS5tYXAgKGdhbWVzLCBtb250aCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCB7XCJrZXlcIjogKG1vbnRoKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IDR9LCAobW9tZW50KG1vbnRoLCBcIllZWVktTU1cIikuZm9ybWF0KFwiTU1NTVwiKSkpXG4gICAgICAgICksXG4gICAgICAgIChnYW1lcy5tYXAgKGdhbWUpID0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoZ2FtZS5pZCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSwgXCIgXCIsIChnYW1lLnRpbWUpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoQGdhbWVMaW5rKGdhbWUpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGdhbWUuaG9tZVNjb3JlKSwgXCItXCIsIChnYW1lLmF3YXlTY29yZSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChnYW1lLmF0dGVuZGFuY2UpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJQXFx1MDBlNGl2XFx1MDBlNG1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiSm91a2t1ZWV0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiVHVsb3NcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJZbGVpc1xcdTAwZjZtXFx1MDBlNFxcdTAwZTRyXFx1MDBlNFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKG1vbnRobHlHYW1lcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5UYWJsZVNvcnRNaXhpbiA9IHJlcXVpcmUgJy4vbWl4aW5zL3RhYmxlX3NvcnQnXG5cblRlYW1TdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgbWl4aW5zOiBbVGFibGVTb3J0TWl4aW5dXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHNvcnRGaWVsZDogXCJwb2ludHNcIlxuICAgIHNvcnREaXJlY3Rpb246IFwiZGVzY1wiXG4gICAgc29ydFR5cGU6IFwiaW50ZWdlclwiXG5cbiAgcmVuZGVyOiAtPlxuICAgIHBsYXllcnMgPSBAcHJvcHMuc3RhdHMucGxheWVycy5zb3J0KEBzb3J0KS5tYXAgKHBsYXllcikgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbUlkfS8je3BsYXllci5pZH1cIn0sIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmFzc2lzdHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnBlbmFsdGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wbHVzTWludXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucGx1c3NlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5taW51c2VzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnBvd2VyUGxheUdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnNob3J0SGFuZGVkR29hbHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIud2lubmluZ0dvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnNob3RzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnNob290aW5nUGVyY2VudGFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5mYWNlb2ZmcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5mYWNlb2ZmUGVyY2VudGFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wbGF5aW5nVGltZUF2ZXJhZ2UpKVxuICAgICAgKVxuXG4gICAgZ29hbGllcyA9IEBwcm9wcy5zdGF0cy5nb2FsaWVzLm1hcCAocGxheWVyKSA9PlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy50ZWFtSWR9LyN7cGxheWVyLmlkfVwifSwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ2FtZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIud2lucykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci50aWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmxvc3NlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5zYXZlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5nb2Fsc0FsbG93ZWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuc2h1dG91dHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ29hbHNBdmVyYWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnNhdmluZ1BlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ29hbHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wb2ludHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucGVuYWx0aWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLndpblBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtcImNvbFNwYW5cIjogMn0sIChwbGF5ZXIubWludXRlcykpXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIHtcImNsYXNzTmFtZVwiOiBcInNvcnRhYmxlLXRoZWFkXCIsIFwib25DbGlja1wiOiAoQHNldFNvcnQpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IDE3fSwgXCJQZWxhYWphdFwiKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwibGFzdE5hbWVcIiwgXCJkYXRhLXR5cGVcIjogXCJzdHJpbmdcIn0sIFwiTmltaVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnYW1lc1wifSwgXCJPXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdvYWxzXCJ9LCBcIk1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiYXNzaXN0c1wifSwgXCJTXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBvaW50c1wifSwgXCJQXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBlbmFsdGllc1wifSwgXCJSXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBsdXNNaW51c1wifSwgXCIrXFx4MkYtXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBsdXNzZXNcIn0sIFwiK1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJtaW51c2VzXCJ9LCBcIi1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicG93ZXJQbGF5R29hbHNcIn0sIFwiWVZNXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInNob3J0SGFuZGVkR29hbHNcIn0sIFwiQVZNXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcIndpbm5pbmdHb2Fsc1wifSwgXCJWTVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJzaG90c1wifSwgXCJMXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInNob290aW5nUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkwlXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImZhY2VvZmZzXCJ9LCBcIkFcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiZmFjZW9mZlBlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJBJVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwbGF5aW5nVGltZUF2ZXJhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJBaWthXCIpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIiwgbnVsbCxcbiAgICAgICAgICAocGxheWVycylcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiY29sU3BhblwiOiAxN30sIFwiTWFhbGl2YWhkaXRcIilcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTmltaVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlBPXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiVlwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJIXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiVE9cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJQTVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk5QXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiS0FcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJUJVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJTXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlJcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJWJVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IDJ9LCBcIkFpa2FcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLFxuICAgICAgICAgIChnb2FsaWVzKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1TdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5UZWFtc0xpc3QgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInJvd1wifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGVhbXMtdmlldyBjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMiBjb2wtbGctMTJcIn0sXG4gICAgICAgIChcbiAgICAgICAgICBAcHJvcHMudGVhbXMubWFwICh0ZWFtKSAtPlxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wia2V5XCI6ICh0ZWFtLmlkKSwgXCJjbGFzc05hbWVcIjogXCJ0ZWFtLWxvZ28gI3t0ZWFtLmlkfVwiLCBcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7dGVhbS5pZH1cIn0pXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbXNMaXN0IiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRvcFNjb3JlcnMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJOaW1pXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk1hYWxpdFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlN5XFx1MDBmNnRcXHUwMGY2dFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlBpc3RlZXRcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChAcHJvcHMuc3RhdHMuc2NvcmluZ1N0YXRzLmZpbHRlciAocGxheWVyLCBpbmRleCkgLT5cbiAgICAgICAgICBpbmRleCA8IDIwXG4gICAgICAgIC5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je3BsYXllci50ZWFtSWR9LyN7cGxheWVyLmlkfVwifSwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucG9pbnRzKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVG9wU2NvcmVycyJdfQ==
