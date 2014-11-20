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



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/goalie_stats.coffee":[function(require,module,exports){
var GoalieStats, React, TableSortMixin;

React = require('react/addons');

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
    var goalies;
    goalies = this.props.stats.sort(this.sort).map((function(_this) {
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
    return React.createElement("table", {
      "className": "table table-striped team-roster"
    }, React.createElement("thead", {
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.createElement("tr", null, React.createElement("th", {
      "colSpan": 17
    }, "Maalivahdit")), React.createElement("tr", null, React.createElement("th", {
      "data-sort": "lastName",
      "data-type": "string"
    }, "Nimi"), React.createElement("th", {
      "data-sort": "games"
    }, "PO"), React.createElement("th", {
      "data-sort": "wins"
    }, "V"), React.createElement("th", {
      "data-sort": "ties"
    }, "T"), React.createElement("th", {
      "data-sort": "losses"
    }, "H"), React.createElement("th", {
      "data-sort": "saves"
    }, "TO"), React.createElement("th", {
      "data-sort": "goalsAllowed"
    }, "PM"), React.createElement("th", {
      "data-sort": "shutouts"
    }, "NP"), React.createElement("th", {
      "data-sort": "goalsAverage",
      "data-type": "float"
    }, "KA"), React.createElement("th", {
      "data-sort": "savingPercentage",
      "data-type": "float"
    }, "T%"), React.createElement("th", {
      "data-sort": "goals"
    }, "M"), React.createElement("th", {
      "data-sort": "assists"
    }, "S"), React.createElement("th", {
      "data-sort": "points"
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



},{"./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/index.coffee":[function(require,module,exports){
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
          "eventKey": item.title,
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
    var players;
    players = this.props.stats.sort(this.sort).map((function(_this) {
      return function(player) {
        return React.createElement("tr", {
          "key": player.id
        }, React.createElement("td", null, React.createElement("a", {
          "href": "/joukkueet/" + _this.props.teamId + "/" + player.id
        }, player.firstName, " ", player.lastName)), React.createElement("td", null, player.games), React.createElement("td", null, player.goals), React.createElement("td", null, player.assists), React.createElement("td", null, player.points), React.createElement("td", null, player.penalties), React.createElement("td", null, player.plusMinus), React.createElement("td", null, player.plusses), React.createElement("td", null, player.minuses), React.createElement("td", null, player.powerPlayGoals), React.createElement("td", null, player.shortHandedGoals), React.createElement("td", null, player.winningGoals), React.createElement("td", null, player.shots), React.createElement("td", null, player.shootingPercentage), React.createElement("td", null, player.faceoffs), React.createElement("td", null, player.faceoffPercentage), React.createElement("td", null, player.playingTimeAverage));
      };
    })(this));
    return React.createElement("table", {
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
    }, "Aika"))), React.createElement("tbody", null, players));
  }
});

module.exports = PlayerStats;



},{"./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/schedule.coffee":[function(require,module,exports){
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
    }, React.createElement("h2", null, "Kentt\u00e4pelaajat"), React.createElement(PlayerStats, {
      "stats": this.props.stats.scoringStats
    })), React.createElement(TabPane, {
      "key": "goalies",
      "animation": false,
      "active": activeKey === "goalies"
    }, React.createElement("h2", null, "Maalivahdit"), React.createElement(GoalieStats, {
      "stats": this.props.stats.goalieStats
    })))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY2xpZW50LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2NvbmZpZy9hcGktYnJvd3Nlci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9saWIvdGVhbXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3RjbGljay9saWIvZmFzdGNsaWNrLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvb3B0aW9ucy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9yb3V0ZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvZ2FtZV9saW5ldXBzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2xpbmV1cHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZV9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nb2FsaWVfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvaW5kZXguY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvbWl4aW5zL3RhYmxlX3NvcnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvbmF2aWdhdGlvbi5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvcGxheWVyX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3NjaGVkdWxlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3N0YW5kaW5ncy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1fcm9zdGVyLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1fc2NoZWR1bGUuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtc19saXN0LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RvcF9zY29yZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsd0RBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBQVIsQ0FBQTs7QUFBQSxVQUNBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FEYixDQUFBOztBQUFBLFNBRUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQUZaLENBQUE7O0FBQUEsT0FHQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQSxZQUtBLEdBQWUsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsT0FBTyxDQUFDLEtBQWhDLENBTGYsQ0FBQTs7QUFBQSxPQU9PLENBQUMsTUFBUixHQUFpQixTQUFDLE9BQUQsR0FBQTs7SUFBQyxVQUFRO0dBQ3hCO0FBQUEsRUFBQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsT0FBOUIsQ0FBdUMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUExQyxHQUF1RCxhQUFBLEdBQWEsT0FBTyxDQUFDLEtBQTVFLENBQUE7U0FDQSxLQUFLLENBQUMsTUFBTixDQUFhLE9BQU8sQ0FBQyxTQUFyQixFQUFnQyxZQUFoQyxFQUZlO0FBQUEsQ0FQakIsQ0FBQTs7QUFBQSxPQVdPLENBQUMsVUFBUixHQUFxQixTQUFDLE1BQUQsR0FBQTtTQUNuQixTQUFT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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3J6QkEsSUFBQSxjQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFB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cEIsRUFBMEIsSUFBMUIsRUFBZ0MsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsR0FBcEIsRUFBeUI7QUFBQSxRQUFDLE1BQUEsRUFBUyxhQUFBLEdBQWEsTUFBTSxDQUFDLE1BQXBCLEdBQTJCLEdBQTNCLEdBQThCLE1BQU0sQ0FBQyxFQUEvQztPQUF6QixFQUFnRixNQUFNLENBQUMsU0FBdkYsRUFBbUcsR0FBbkcsRUFBeUcsTUFBTSxDQUFDLFFBQWhILENBQWhDLENBREYsRUFFRSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFpQyxNQUFNLENBQUMsS0FBeEMsQ0FGRixFQUdFLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWlDLE1BQU0sQ0FBQyxLQUF4QyxDQUhGLEVBSUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBaUMsTUFBTSxDQUFDLE9BQXhDLENBSkYsRUFLRSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFpQyxNQUFNLENBQUMsTUFBeEMsQ0FMRixFQURHO0lBQUEsQ0FGSixDQVZILENBREYsRUFETTtFQUFBLENBQVI7Q0FGVyxDQUZiLENBQUE7O0FBQUEsTUE4Qk0sQ0FBQyxPQUFQLEdBQWlCLFVBOUJqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuY2VyZWJlbGx1bSA9IHJlcXVpcmUgJ2NlcmViZWxsdW0nXG5GYXN0Q2xpY2sgPSByZXF1aXJlICdmYXN0Y2xpY2snXG5vcHRpb25zID0gcmVxdWlyZSAnLi9vcHRpb25zJ1xuXG5hcHBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb25zLmFwcElkKVxuXG5vcHRpb25zLnJlbmRlciA9IChvcHRpb25zPXt9KSAtPlxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRpdGxlXCIpWzBdLmlubmVySFRNTCA9IFwiTGlpZ2EucHcgLSAje29wdGlvbnMudGl0bGV9XCJcbiAgUmVhY3QucmVuZGVyKG9wdGlvbnMuY29tcG9uZW50LCBhcHBDb250YWluZXIpXG5cbm9wdGlvbnMuaW5pdGlhbGl6ZSA9IChjbGllbnQpIC0+XG4gIEZhc3RDbGljay5hdHRhY2goZG9jdW1lbnQuYm9keSlcbiAgI1JlYWN0LmluaXRpYWxpemVUb3VjaEV2ZW50cyh0cnVlKVxuXG5hcHAgPSBjZXJlYmVsbHVtLmNsaWVudChvcHRpb25zKSIsIm1vZHVsZS5leHBvcnRzID1cbiAgdXJsOiBkb2N1bWVudC5sb2NhdGlvbi5vcmlnaW4ucmVwbGFjZShcIjQwMDBcIixcIjgwODBcIilcbiAgI3VybDogXCJodHRwOi8vbG9jYWxob3N0OjgwODBcIiIsIlRlYW1zID1cbiAgbmFtZXNBbmRJZHM6XG4gICAgXCLDhHNzw6R0XCI6IFwiYXNzYXRcIlxuICAgIFwiQmx1ZXNcIjogXCJibHVlc1wiXG4gICAgXCJISUZLXCI6IFwiaGlma1wiXG4gICAgXCJIUEtcIjogXCJocGtcIlxuICAgIFwiSWx2ZXNcIjogXCJpbHZlc1wiXG4gICAgXCJTcG9ydFwiOiBcInNwb3J0XCJcbiAgICBcIkpZUFwiOiBcImp5cFwiXG4gICAgXCJLYWxQYVwiOiBcImthbHBhXCJcbiAgICBcIkvDpHJww6R0XCI6IFwia2FycGF0XCJcbiAgICBcIkx1a2tvXCI6IFwibHVra29cIlxuICAgIFwiUGVsaWNhbnNcIjogXCJwZWxpY2Fuc1wiXG4gICAgXCJTYWlQYVwiOiBcInNhaXBhXCJcbiAgICBcIlRhcHBhcmFcIjogXCJ0YXBwYXJhXCJcbiAgICBcIlRQU1wiOiBcInRwc1wiXG5cbiAgbG9nbzogKG5hbWUpIC0+XG4gICAgXCIvc3ZnLyN7QG5hbWVzQW5kSWRzW25hbWVdfS5zdmdcIlxuXG4gIGlkVG9OYW1lOiAoaWQpIC0+XG4gICAgaWRzID0gT2JqZWN0LmtleXMoQG5hbWVzQW5kSWRzKS5yZWR1Y2UgKG9iaiwgbmFtZSkgPT5cbiAgICAgIG9ialtAbmFtZXNBbmRJZHNbbmFtZV1dID0gbmFtZVxuICAgICAgb2JqXG4gICAgLCB7fVxuICAgIGlkc1tpZF1cblxuICBuYW1lVG9JZDogKG5hbWUpIC0+XG4gICAgQG5hbWVzQW5kSWRzW25hbWVdXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbXMiLCIvKipcbiAqIEBwcmVzZXJ2ZSBGYXN0Q2xpY2s6IHBvbHlmaWxsIHRvIHJlbW92ZSBjbGljayBkZWxheXMgb24gYnJvd3NlcnMgd2l0aCB0b3VjaCBVSXMuXG4gKlxuICogQHZlcnNpb24gMS4wLjNcbiAqIEBjb2RpbmdzdGFuZGFyZCBmdGxhYnMtanN2MlxuICogQGNvcHlyaWdodCBUaGUgRmluYW5jaWFsIFRpbWVzIExpbWl0ZWQgW0FsbCBSaWdodHMgUmVzZXJ2ZWRdXG4gKiBAbGljZW5zZSBNSVQgTGljZW5zZSAoc2VlIExJQ0VOU0UudHh0KVxuICovXG5cbi8qanNsaW50IGJyb3dzZXI6dHJ1ZSwgbm9kZTp0cnVlKi9cbi8qZ2xvYmFsIGRlZmluZSwgRXZlbnQsIE5vZGUqL1xuXG5cbi8qKlxuICogSW5zdGFudGlhdGUgZmFzdC1jbGlja2luZyBsaXN0ZW5lcnMgb24gdGhlIHNwZWNpZmllZCBsYXllci5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7RWxlbWVudH0gbGF5ZXIgVGhlIGxheWVyIHRvIGxpc3RlbiBvblxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzXG4gKi9cbmZ1bmN0aW9uIEZhc3RDbGljayhsYXllciwgb3B0aW9ucykge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBvbGRPbkNsaWNrO1xuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIGEgY2xpY2sgaXMgY3VycmVudGx5IGJlaW5nIHRyYWNrZWQuXG5cdCAqXG5cdCAqIEB0eXBlIGJvb2xlYW5cblx0ICovXG5cdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXG5cblx0LyoqXG5cdCAqIFRpbWVzdGFtcCBmb3Igd2hlbiBjbGljayB0cmFja2luZyBzdGFydGVkLlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcblxuXG5cdC8qKlxuXHQgKiBUaGUgZWxlbWVudCBiZWluZyB0cmFja2VkIGZvciBhIGNsaWNrLlxuXHQgKlxuXHQgKiBAdHlwZSBFdmVudFRhcmdldFxuXHQgKi9cblx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblxuXG5cdC8qKlxuXHQgKiBYLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50b3VjaFN0YXJ0WCA9IDA7XG5cblxuXHQvKipcblx0ICogWS1jb29yZGluYXRlIG9mIHRvdWNoIHN0YXJ0IGV2ZW50LlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudG91Y2hTdGFydFkgPSAwO1xuXG5cblx0LyoqXG5cdCAqIElEIG9mIHRoZSBsYXN0IHRvdWNoLCByZXRyaWV2ZWQgZnJvbSBUb3VjaC5pZGVudGlmaWVyLlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMubGFzdFRvdWNoSWRlbnRpZmllciA9IDA7XG5cblxuXHQvKipcblx0ICogVG91Y2htb3ZlIGJvdW5kYXJ5LCBiZXlvbmQgd2hpY2ggYSBjbGljayB3aWxsIGJlIGNhbmNlbGxlZC5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRvdWNoQm91bmRhcnkgPSBvcHRpb25zLnRvdWNoQm91bmRhcnkgfHwgMTA7XG5cblxuXHQvKipcblx0ICogVGhlIEZhc3RDbGljayBsYXllci5cblx0ICpcblx0ICogQHR5cGUgRWxlbWVudFxuXHQgKi9cblx0dGhpcy5sYXllciA9IGxheWVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgbWluaW11bSB0aW1lIGJldHdlZW4gdGFwKHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kKSBldmVudHNcblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRhcERlbGF5ID0gb3B0aW9ucy50YXBEZWxheSB8fCAyMDA7XG5cblx0aWYgKEZhc3RDbGljay5ub3ROZWVkZWQobGF5ZXIpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gU29tZSBvbGQgdmVyc2lvbnMgb2YgQW5kcm9pZCBkb24ndCBoYXZlIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXG5cdGZ1bmN0aW9uIGJpbmQobWV0aG9kLCBjb250ZXh0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gbWV0aG9kLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7IH07XG5cdH1cblxuXG5cdHZhciBtZXRob2RzID0gWydvbk1vdXNlJywgJ29uQ2xpY2snLCAnb25Ub3VjaFN0YXJ0JywgJ29uVG91Y2hNb3ZlJywgJ29uVG91Y2hFbmQnLCAnb25Ub3VjaENhbmNlbCddO1xuXHR2YXIgY29udGV4dCA9IHRoaXM7XG5cdGZvciAodmFyIGkgPSAwLCBsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRjb250ZXh0W21ldGhvZHNbaV1dID0gYmluZChjb250ZXh0W21ldGhvZHNbaV1dLCBjb250ZXh0KTtcblx0fVxuXG5cdC8vIFNldCB1cCBldmVudCBoYW5kbGVycyBhcyByZXF1aXJlZFxuXHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHR9XG5cblx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQsIGZhbHNlKTtcblx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMub25Ub3VjaENhbmNlbCwgZmFsc2UpO1xuXG5cdC8vIEhhY2sgaXMgcmVxdWlyZWQgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxuXHQvLyB3aGljaCBpcyBob3cgRmFzdENsaWNrIG5vcm1hbGx5IHN0b3BzIGNsaWNrIGV2ZW50cyBidWJibGluZyB0byBjYWxsYmFja3MgcmVnaXN0ZXJlZCBvbiB0aGUgRmFzdENsaWNrXG5cdC8vIGxheWVyIHdoZW4gdGhleSBhcmUgY2FuY2VsbGVkLlxuXHRpZiAoIUV2ZW50LnByb3RvdHlwZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpIHtcblx0XHRcdHZhciBybXYgPSBOb2RlLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHRcdFx0aWYgKHR5cGUgPT09ICdjbGljaycpIHtcblx0XHRcdFx0cm12LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLmhpamFja2VkIHx8IGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJtdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0dmFyIGFkdiA9IE5vZGUucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xuXHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgKGNhbGxiYWNrLmhpamFja2VkID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoIWV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCkge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZXZlbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSksIGNhcHR1cmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWR2LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0Ly8gSWYgYSBoYW5kbGVyIGlzIGFscmVhZHkgZGVjbGFyZWQgaW4gdGhlIGVsZW1lbnQncyBvbmNsaWNrIGF0dHJpYnV0ZSwgaXQgd2lsbCBiZSBmaXJlZCBiZWZvcmVcblx0Ly8gRmFzdENsaWNrJ3Mgb25DbGljayBoYW5kbGVyLiBGaXggdGhpcyBieSBwdWxsaW5nIG91dCB0aGUgdXNlci1kZWZpbmVkIGhhbmRsZXIgZnVuY3Rpb24gYW5kXG5cdC8vIGFkZGluZyBpdCBhcyBsaXN0ZW5lci5cblx0aWYgKHR5cGVvZiBsYXllci5vbmNsaWNrID09PSAnZnVuY3Rpb24nKSB7XG5cblx0XHQvLyBBbmRyb2lkIGJyb3dzZXIgb24gYXQgbGVhc3QgMy4yIHJlcXVpcmVzIGEgbmV3IHJlZmVyZW5jZSB0byB0aGUgZnVuY3Rpb24gaW4gbGF5ZXIub25jbGlja1xuXHRcdC8vIC0gdGhlIG9sZCBvbmUgd29uJ3Qgd29yayBpZiBwYXNzZWQgdG8gYWRkRXZlbnRMaXN0ZW5lciBkaXJlY3RseS5cblx0XHRvbGRPbkNsaWNrID0gbGF5ZXIub25jbGljaztcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRvbGRPbkNsaWNrKGV2ZW50KTtcblx0XHR9LCBmYWxzZSk7XG5cdFx0bGF5ZXIub25jbGljayA9IG51bGw7XG5cdH1cbn1cblxuXG4vKipcbiAqIEFuZHJvaWQgcmVxdWlyZXMgZXhjZXB0aW9ucy5cbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0FuZHJvaWQgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0FuZHJvaWQnKSA+IDA7XG5cblxuLyoqXG4gKiBpT1MgcmVxdWlyZXMgZXhjZXB0aW9ucy5cbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0lPUyA9IC9pUChhZHxob25lfG9kKS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuXG4vKipcbiAqIGlPUyA0IHJlcXVpcmVzIGFuIGV4Y2VwdGlvbiBmb3Igc2VsZWN0IGVsZW1lbnRzLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzSU9TNCA9IGRldmljZUlzSU9TICYmICgvT1MgNF9cXGQoX1xcZCk/LykudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuXG4vKipcbiAqIGlPUyA2LjAoKz8pIHJlcXVpcmVzIHRoZSB0YXJnZXQgZWxlbWVudCB0byBiZSBtYW51YWxseSBkZXJpdmVkXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNJT1NXaXRoQmFkVGFyZ2V0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyAoWzYtOV18XFxkezJ9KV9cXGQvKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG4vKipcbiAqIEJsYWNrQmVycnkgcmVxdWlyZXMgZXhjZXB0aW9ucy5cbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0JsYWNrQmVycnkxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQkIxMCcpID4gMDtcblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBhIGdpdmVuIGVsZW1lbnQgcmVxdWlyZXMgYSBuYXRpdmUgY2xpY2suXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXQgVGFyZ2V0IERPTSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHRoZSBlbGVtZW50IG5lZWRzIGEgbmF0aXZlIGNsaWNrXG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUubmVlZHNDbGljayA9IGZ1bmN0aW9uKHRhcmdldCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHN3aXRjaCAodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcblxuXHQvLyBEb24ndCBzZW5kIGEgc3ludGhldGljIGNsaWNrIHRvIGRpc2FibGVkIGlucHV0cyAoaXNzdWUgIzYyKVxuXHRjYXNlICdidXR0b24nOlxuXHRjYXNlICdzZWxlY3QnOlxuXHRjYXNlICd0ZXh0YXJlYSc6XG5cdFx0aWYgKHRhcmdldC5kaXNhYmxlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0YnJlYWs7XG5cdGNhc2UgJ2lucHV0JzpcblxuXHRcdC8vIEZpbGUgaW5wdXRzIG5lZWQgcmVhbCBjbGlja3Mgb24gaU9TIDYgZHVlIHRvIGEgYnJvd3NlciBidWcgKGlzc3VlICM2OClcblx0XHRpZiAoKGRldmljZUlzSU9TICYmIHRhcmdldC50eXBlID09PSAnZmlsZScpIHx8IHRhcmdldC5kaXNhYmxlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0YnJlYWs7XG5cdGNhc2UgJ2xhYmVsJzpcblx0Y2FzZSAndmlkZW8nOlxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuICgvXFxibmVlZHNjbGlja1xcYi8pLnRlc3QodGFyZ2V0LmNsYXNzTmFtZSk7XG59O1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBnaXZlbiBlbGVtZW50IHJlcXVpcmVzIGEgY2FsbCB0byBmb2N1cyB0byBzaW11bGF0ZSBjbGljayBpbnRvIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXQgVGFyZ2V0IERPTSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHRoZSBlbGVtZW50IHJlcXVpcmVzIGEgY2FsbCB0byBmb2N1cyB0byBzaW11bGF0ZSBuYXRpdmUgY2xpY2suXG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUubmVlZHNGb2N1cyA9IGZ1bmN0aW9uKHRhcmdldCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHN3aXRjaCAodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcblx0Y2FzZSAndGV4dGFyZWEnOlxuXHRcdHJldHVybiB0cnVlO1xuXHRjYXNlICdzZWxlY3QnOlxuXHRcdHJldHVybiAhZGV2aWNlSXNBbmRyb2lkO1xuXHRjYXNlICdpbnB1dCc6XG5cdFx0c3dpdGNoICh0YXJnZXQudHlwZSkge1xuXHRcdGNhc2UgJ2J1dHRvbic6XG5cdFx0Y2FzZSAnY2hlY2tib3gnOlxuXHRcdGNhc2UgJ2ZpbGUnOlxuXHRcdGNhc2UgJ2ltYWdlJzpcblx0XHRjYXNlICdyYWRpbyc6XG5cdFx0Y2FzZSAnc3VibWl0Jzpcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBObyBwb2ludCBpbiBhdHRlbXB0aW5nIHRvIGZvY3VzIGRpc2FibGVkIGlucHV0c1xuXHRcdHJldHVybiAhdGFyZ2V0LmRpc2FibGVkICYmICF0YXJnZXQucmVhZE9ubHk7XG5cdGRlZmF1bHQ6XG5cdFx0cmV0dXJuICgvXFxibmVlZHNmb2N1c1xcYi8pLnRlc3QodGFyZ2V0LmNsYXNzTmFtZSk7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBTZW5kIGEgY2xpY2sgZXZlbnQgdG8gdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5zZW5kQ2xpY2sgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50LCBldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBjbGlja0V2ZW50LCB0b3VjaDtcblxuXHQvLyBPbiBzb21lIEFuZHJvaWQgZGV2aWNlcyBhY3RpdmVFbGVtZW50IG5lZWRzIHRvIGJlIGJsdXJyZWQgb3RoZXJ3aXNlIHRoZSBzeW50aGV0aWMgY2xpY2sgd2lsbCBoYXZlIG5vIGVmZmVjdCAoIzI0KVxuXHRpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0YXJnZXRFbGVtZW50KSB7XG5cdFx0ZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG5cdH1cblxuXHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdC8vIFN5bnRoZXNpc2UgYSBjbGljayBldmVudCwgd2l0aCBhbiBleHRyYSBhdHRyaWJ1dGUgc28gaXQgY2FuIGJlIHRyYWNrZWRcblx0Y2xpY2tFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50cycpO1xuXHRjbGlja0V2ZW50LmluaXRNb3VzZUV2ZW50KHRoaXMuZGV0ZXJtaW5lRXZlbnRUeXBlKHRhcmdldEVsZW1lbnQpLCB0cnVlLCB0cnVlLCB3aW5kb3csIDEsIHRvdWNoLnNjcmVlblgsIHRvdWNoLnNjcmVlblksIHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFksIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcblx0Y2xpY2tFdmVudC5mb3J3YXJkZWRUb3VjaEV2ZW50ID0gdHJ1ZTtcblx0dGFyZ2V0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGNsaWNrRXZlbnQpO1xufTtcblxuRmFzdENsaWNrLnByb3RvdHlwZS5kZXRlcm1pbmVFdmVudFR5cGUgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvL0lzc3VlICMxNTk6IEFuZHJvaWQgQ2hyb21lIFNlbGVjdCBCb3ggZG9lcyBub3Qgb3BlbiB3aXRoIGEgc3ludGhldGljIGNsaWNrIGV2ZW50XG5cdGlmIChkZXZpY2VJc0FuZHJvaWQgJiYgdGFyZ2V0RWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnKSB7XG5cdFx0cmV0dXJuICdtb3VzZWRvd24nO1xuXHR9XG5cblx0cmV0dXJuICdjbGljayc7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUuZm9jdXMgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGxlbmd0aDtcblxuXHQvLyBJc3N1ZSAjMTYwOiBvbiBpT1MgNywgc29tZSBpbnB1dCBlbGVtZW50cyAoZS5nLiBkYXRlIGRhdGV0aW1lKSB0aHJvdyBhIHZhZ3VlIFR5cGVFcnJvciBvbiBzZXRTZWxlY3Rpb25SYW5nZS4gVGhlc2UgZWxlbWVudHMgZG9uJ3QgaGF2ZSBhbiBpbnRlZ2VyIHZhbHVlIGZvciB0aGUgc2VsZWN0aW9uU3RhcnQgYW5kIHNlbGVjdGlvbkVuZCBwcm9wZXJ0aWVzLCBidXQgdW5mb3J0dW5hdGVseSB0aGF0IGNhbid0IGJlIHVzZWQgZm9yIGRldGVjdGlvbiBiZWNhdXNlIGFjY2Vzc2luZyB0aGUgcHJvcGVydGllcyBhbHNvIHRocm93cyBhIFR5cGVFcnJvci4gSnVzdCBjaGVjayB0aGUgdHlwZSBpbnN0ZWFkLiBGaWxlZCBhcyBBcHBsZSBidWcgIzE1MTIyNzI0LlxuXHRpZiAoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0RWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZSAmJiB0YXJnZXRFbGVtZW50LnR5cGUuaW5kZXhPZignZGF0ZScpICE9PSAwICYmIHRhcmdldEVsZW1lbnQudHlwZSAhPT0gJ3RpbWUnKSB7XG5cdFx0bGVuZ3RoID0gdGFyZ2V0RWxlbWVudC52YWx1ZS5sZW5ndGg7XG5cdFx0dGFyZ2V0RWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShsZW5ndGgsIGxlbmd0aCk7XG5cdH0gZWxzZSB7XG5cdFx0dGFyZ2V0RWxlbWVudC5mb2N1cygpO1xuXHR9XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdGFyZ2V0IGVsZW1lbnQgaXMgYSBjaGlsZCBvZiBhIHNjcm9sbGFibGUgbGF5ZXIgYW5kIGlmIHNvLCBzZXQgYSBmbGFnIG9uIGl0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLnVwZGF0ZVNjcm9sbFBhcmVudCA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgc2Nyb2xsUGFyZW50LCBwYXJlbnRFbGVtZW50O1xuXG5cdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXG5cdC8vIEF0dGVtcHQgdG8gZGlzY292ZXIgd2hldGhlciB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgY29udGFpbmVkIHdpdGhpbiBhIHNjcm9sbGFibGUgbGF5ZXIuIFJlLWNoZWNrIGlmIHRoZVxuXHQvLyB0YXJnZXQgZWxlbWVudCB3YXMgbW92ZWQgdG8gYW5vdGhlciBwYXJlbnQuXG5cdGlmICghc2Nyb2xsUGFyZW50IHx8ICFzY3JvbGxQYXJlbnQuY29udGFpbnModGFyZ2V0RWxlbWVudCkpIHtcblx0XHRwYXJlbnRFbGVtZW50ID0gdGFyZ2V0RWxlbWVudDtcblx0XHRkbyB7XG5cdFx0XHRpZiAocGFyZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCkge1xuXHRcdFx0XHRzY3JvbGxQYXJlbnQgPSBwYXJlbnRFbGVtZW50O1xuXHRcdFx0XHR0YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXHRcdH0gd2hpbGUgKHBhcmVudEVsZW1lbnQpO1xuXHR9XG5cblx0Ly8gQWx3YXlzIHVwZGF0ZSB0aGUgc2Nyb2xsIHRvcCB0cmFja2VyIGlmIHBvc3NpYmxlLlxuXHRpZiAoc2Nyb2xsUGFyZW50KSB7XG5cdFx0c2Nyb2xsUGFyZW50LmZhc3RDbGlja0xhc3RTY3JvbGxUb3AgPSBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wO1xuXHR9XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtFdmVudFRhcmdldH0gdGFyZ2V0RWxlbWVudFxuICogQHJldHVybnMge0VsZW1lbnR8RXZlbnRUYXJnZXR9XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUuZ2V0VGFyZ2V0RWxlbWVudEZyb21FdmVudFRhcmdldCA9IGZ1bmN0aW9uKGV2ZW50VGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBPbiBzb21lIG9sZGVyIGJyb3dzZXJzIChub3RhYmx5IFNhZmFyaSBvbiBpT1MgNC4xIC0gc2VlIGlzc3VlICM1NikgdGhlIGV2ZW50IHRhcmdldCBtYXkgYmUgYSB0ZXh0IG5vZGUuXG5cdGlmIChldmVudFRhcmdldC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcblx0XHRyZXR1cm4gZXZlbnRUYXJnZXQucGFyZW50Tm9kZTtcblx0fVxuXG5cdHJldHVybiBldmVudFRhcmdldDtcbn07XG5cblxuLyoqXG4gKiBPbiB0b3VjaCBzdGFydCwgcmVjb3JkIHRoZSBwb3NpdGlvbiBhbmQgc2Nyb2xsIG9mZnNldC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgdGFyZ2V0RWxlbWVudCwgdG91Y2gsIHNlbGVjdGlvbjtcblxuXHQvLyBJZ25vcmUgbXVsdGlwbGUgdG91Y2hlcywgb3RoZXJ3aXNlIHBpbmNoLXRvLXpvb20gaXMgcHJldmVudGVkIGlmIGJvdGggZmluZ2VycyBhcmUgb24gdGhlIEZhc3RDbGljayBlbGVtZW50IChpc3N1ZSAjMTExKS5cblx0aWYgKGV2ZW50LnRhcmdldFRvdWNoZXMubGVuZ3RoID4gMSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0dGFyZ2V0RWxlbWVudCA9IHRoaXMuZ2V0VGFyZ2V0RWxlbWVudEZyb21FdmVudFRhcmdldChldmVudC50YXJnZXQpO1xuXHR0b3VjaCA9IGV2ZW50LnRhcmdldFRvdWNoZXNbMF07XG5cblx0aWYgKGRldmljZUlzSU9TKSB7XG5cblx0XHQvLyBPbmx5IHRydXN0ZWQgZXZlbnRzIHdpbGwgZGVzZWxlY3QgdGV4dCBvbiBpT1MgKGlzc3VlICM0OSlcblx0XHRzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG5cdFx0aWYgKHNlbGVjdGlvbi5yYW5nZUNvdW50ICYmICFzZWxlY3Rpb24uaXNDb2xsYXBzZWQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICghZGV2aWNlSXNJT1M0KSB7XG5cblx0XHRcdC8vIFdlaXJkIHRoaW5ncyBoYXBwZW4gb24gaU9TIHdoZW4gYW4gYWxlcnQgb3IgY29uZmlybSBkaWFsb2cgaXMgb3BlbmVkIGZyb20gYSBjbGljayBldmVudCBjYWxsYmFjayAoaXNzdWUgIzIzKTpcblx0XHRcdC8vIHdoZW4gdGhlIHVzZXIgbmV4dCB0YXBzIGFueXdoZXJlIGVsc2Ugb24gdGhlIHBhZ2UsIG5ldyB0b3VjaHN0YXJ0IGFuZCB0b3VjaGVuZCBldmVudHMgYXJlIGRpc3BhdGNoZWRcblx0XHRcdC8vIHdpdGggdGhlIHNhbWUgaWRlbnRpZmllciBhcyB0aGUgdG91Y2ggZXZlbnQgdGhhdCBwcmV2aW91c2x5IHRyaWdnZXJlZCB0aGUgY2xpY2sgdGhhdCB0cmlnZ2VyZWQgdGhlIGFsZXJ0LlxuXHRcdFx0Ly8gU2FkbHksIHRoZXJlIGlzIGFuIGlzc3VlIG9uIGlPUyA0IHRoYXQgY2F1c2VzIHNvbWUgbm9ybWFsIHRvdWNoIGV2ZW50cyB0byBoYXZlIHRoZSBzYW1lIGlkZW50aWZpZXIgYXMgYW5cblx0XHRcdC8vIGltbWVkaWF0ZWx5IHByZWNlZWRpbmcgdG91Y2ggZXZlbnQgKGlzc3VlICM1MiksIHNvIHRoaXMgZml4IGlzIHVuYXZhaWxhYmxlIG9uIHRoYXQgcGxhdGZvcm0uXG5cdFx0XHQvLyBJc3N1ZSAxMjA6IHRvdWNoLmlkZW50aWZpZXIgaXMgMCB3aGVuIENocm9tZSBkZXYgdG9vbHMgJ0VtdWxhdGUgdG91Y2ggZXZlbnRzJyBpcyBzZXQgd2l0aCBhbiBpT1MgZGV2aWNlIFVBIHN0cmluZyxcblx0XHRcdC8vIHdoaWNoIGNhdXNlcyBhbGwgdG91Y2ggZXZlbnRzIHRvIGJlIGlnbm9yZWQuIEFzIHRoaXMgYmxvY2sgb25seSBhcHBsaWVzIHRvIGlPUywgYW5kIGlPUyBpZGVudGlmaWVycyBhcmUgYWx3YXlzIGxvbmcsXG5cdFx0XHQvLyByYW5kb20gaW50ZWdlcnMsIGl0J3Mgc2FmZSB0byB0byBjb250aW51ZSBpZiB0aGUgaWRlbnRpZmllciBpcyAwIGhlcmUuXG5cdFx0XHRpZiAodG91Y2guaWRlbnRpZmllciAmJiB0b3VjaC5pZGVudGlmaWVyID09PSB0aGlzLmxhc3RUb3VjaElkZW50aWZpZXIpIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmxhc3RUb3VjaElkZW50aWZpZXIgPSB0b3VjaC5pZGVudGlmaWVyO1xuXG5cdFx0XHQvLyBJZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgYSBjaGlsZCBvZiBhIHNjcm9sbGFibGUgbGF5ZXIgKHVzaW5nIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaCkgYW5kOlxuXHRcdFx0Ly8gMSkgdGhlIHVzZXIgZG9lcyBhIGZsaW5nIHNjcm9sbCBvbiB0aGUgc2Nyb2xsYWJsZSBsYXllclxuXHRcdFx0Ly8gMikgdGhlIHVzZXIgc3RvcHMgdGhlIGZsaW5nIHNjcm9sbCB3aXRoIGFub3RoZXIgdGFwXG5cdFx0XHQvLyB0aGVuIHRoZSBldmVudC50YXJnZXQgb2YgdGhlIGxhc3QgJ3RvdWNoZW5kJyBldmVudCB3aWxsIGJlIHRoZSBlbGVtZW50IHRoYXQgd2FzIHVuZGVyIHRoZSB1c2VyJ3MgZmluZ2VyXG5cdFx0XHQvLyB3aGVuIHRoZSBmbGluZyBzY3JvbGwgd2FzIHN0YXJ0ZWQsIGNhdXNpbmcgRmFzdENsaWNrIHRvIHNlbmQgYSBjbGljayBldmVudCB0byB0aGF0IGxheWVyIC0gdW5sZXNzIGEgY2hlY2tcblx0XHRcdC8vIGlzIG1hZGUgdG8gZW5zdXJlIHRoYXQgYSBwYXJlbnQgbGF5ZXIgd2FzIG5vdCBzY3JvbGxlZCBiZWZvcmUgc2VuZGluZyBhIHN5bnRoZXRpYyBjbGljayAoaXNzdWUgIzQyKS5cblx0XHRcdHRoaXMudXBkYXRlU2Nyb2xsUGFyZW50KHRhcmdldEVsZW1lbnQpO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMudHJhY2tpbmdDbGljayA9IHRydWU7XG5cdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gZXZlbnQudGltZVN0YW1wO1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXG5cdHRoaXMudG91Y2hTdGFydFggPSB0b3VjaC5wYWdlWDtcblx0dGhpcy50b3VjaFN0YXJ0WSA9IHRvdWNoLnBhZ2VZO1xuXG5cdC8vIFByZXZlbnQgcGhhbnRvbSBjbGlja3Mgb24gZmFzdCBkb3VibGUtdGFwIChpc3N1ZSAjMzYpXG5cdGlmICgoZXZlbnQudGltZVN0YW1wIC0gdGhpcy5sYXN0Q2xpY2tUaW1lKSA8IHRoaXMudGFwRGVsYXkpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59O1xuXG5cbi8qKlxuICogQmFzZWQgb24gYSB0b3VjaG1vdmUgZXZlbnQgb2JqZWN0LCBjaGVjayB3aGV0aGVyIHRoZSB0b3VjaCBoYXMgbW92ZWQgcGFzdCBhIGJvdW5kYXJ5IHNpbmNlIGl0IHN0YXJ0ZWQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLnRvdWNoSGFzTW92ZWQgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLCBib3VuZGFyeSA9IHRoaXMudG91Y2hCb3VuZGFyeTtcblxuXHRpZiAoTWF0aC5hYnModG91Y2gucGFnZVggLSB0aGlzLnRvdWNoU3RhcnRYKSA+IGJvdW5kYXJ5IHx8IE1hdGguYWJzKHRvdWNoLnBhZ2VZIC0gdGhpcy50b3VjaFN0YXJ0WSkgPiBib3VuZGFyeSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgbGFzdCBwb3NpdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaE1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICghdGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBJZiB0aGUgdG91Y2ggaGFzIG1vdmVkLCBjYW5jZWwgdGhlIGNsaWNrIHRyYWNraW5nXG5cdGlmICh0aGlzLnRhcmdldEVsZW1lbnQgIT09IHRoaXMuZ2V0VGFyZ2V0RWxlbWVudEZyb21FdmVudFRhcmdldChldmVudC50YXJnZXQpIHx8IHRoaXMudG91Y2hIYXNNb3ZlZChldmVudCkpIHtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59O1xuXG5cbi8qKlxuICogQXR0ZW1wdCB0byBmaW5kIHRoZSBsYWJlbGxlZCBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbGFiZWwgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEhUTUxMYWJlbEVsZW1lbnR9IGxhYmVsRWxlbWVudFxuICogQHJldHVybnMge0VsZW1lbnR8bnVsbH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5maW5kQ29udHJvbCA9IGZ1bmN0aW9uKGxhYmVsRWxlbWVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gRmFzdCBwYXRoIGZvciBuZXdlciBicm93c2VycyBzdXBwb3J0aW5nIHRoZSBIVE1MNSBjb250cm9sIGF0dHJpYnV0ZVxuXHRpZiAobGFiZWxFbGVtZW50LmNvbnRyb2wgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBsYWJlbEVsZW1lbnQuY29udHJvbDtcblx0fVxuXG5cdC8vIEFsbCBicm93c2VycyB1bmRlciB0ZXN0IHRoYXQgc3VwcG9ydCB0b3VjaCBldmVudHMgYWxzbyBzdXBwb3J0IHRoZSBIVE1MNSBodG1sRm9yIGF0dHJpYnV0ZVxuXHRpZiAobGFiZWxFbGVtZW50Lmh0bWxGb3IpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGFiZWxFbGVtZW50Lmh0bWxGb3IpO1xuXHR9XG5cblx0Ly8gSWYgbm8gZm9yIGF0dHJpYnV0ZSBleGlzdHMsIGF0dGVtcHQgdG8gcmV0cmlldmUgdGhlIGZpcnN0IGxhYmVsbGFibGUgZGVzY2VuZGFudCBlbGVtZW50XG5cdC8vIHRoZSBsaXN0IG9mIHdoaWNoIGlzIGRlZmluZWQgaGVyZTogaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNjYXRlZ29yeS1sYWJlbFxuXHRyZXR1cm4gbGFiZWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiwgaW5wdXQ6bm90KFt0eXBlPWhpZGRlbl0pLCBrZXlnZW4sIG1ldGVyLCBvdXRwdXQsIHByb2dyZXNzLCBzZWxlY3QsIHRleHRhcmVhJyk7XG59O1xuXG5cbi8qKlxuICogT24gdG91Y2ggZW5kLCBkZXRlcm1pbmUgd2hldGhlciB0byBzZW5kIGEgY2xpY2sgZXZlbnQgYXQgb25jZS5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaEVuZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGZvckVsZW1lbnQsIHRyYWNraW5nQ2xpY2tTdGFydCwgdGFyZ2V0VGFnTmFtZSwgc2Nyb2xsUGFyZW50LCB0b3VjaCwgdGFyZ2V0RWxlbWVudCA9IHRoaXMudGFyZ2V0RWxlbWVudDtcblxuXHRpZiAoIXRoaXMudHJhY2tpbmdDbGljaykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSkge1xuXHRcdHRoaXMuY2FuY2VsTmV4dENsaWNrID0gdHJ1ZTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFJlc2V0IHRvIHByZXZlbnQgd3JvbmcgY2xpY2sgY2FuY2VsIG9uIGlucHV0IChpc3N1ZSAjMTU2KS5cblx0dGhpcy5jYW5jZWxOZXh0Q2xpY2sgPSBmYWxzZTtcblxuXHR0aGlzLmxhc3RDbGlja1RpbWUgPSBldmVudC50aW1lU3RhbXA7XG5cblx0dHJhY2tpbmdDbGlja1N0YXJ0ID0gdGhpcy50cmFja2luZ0NsaWNrU3RhcnQ7XG5cdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IDA7XG5cblx0Ly8gT24gc29tZSBpT1MgZGV2aWNlcywgdGhlIHRhcmdldEVsZW1lbnQgc3VwcGxpZWQgd2l0aCB0aGUgZXZlbnQgaXMgaW52YWxpZCBpZiB0aGUgbGF5ZXJcblx0Ly8gaXMgcGVyZm9ybWluZyBhIHRyYW5zaXRpb24gb3Igc2Nyb2xsLCBhbmQgaGFzIHRvIGJlIHJlLWRldGVjdGVkIG1hbnVhbGx5LiBOb3RlIHRoYXRcblx0Ly8gZm9yIHRoaXMgdG8gZnVuY3Rpb24gY29ycmVjdGx5LCBpdCBtdXN0IGJlIGNhbGxlZCAqYWZ0ZXIqIHRoZSBldmVudCB0YXJnZXQgaXMgY2hlY2tlZCFcblx0Ly8gU2VlIGlzc3VlICM1NzsgYWxzbyBmaWxlZCBhcyByZGFyOi8vMTMwNDg1ODkgLlxuXHRpZiAoZGV2aWNlSXNJT1NXaXRoQmFkVGFyZ2V0KSB7XG5cdFx0dG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblxuXHRcdC8vIEluIGNlcnRhaW4gY2FzZXMgYXJndW1lbnRzIG9mIGVsZW1lbnRGcm9tUG9pbnQgY2FuIGJlIG5lZ2F0aXZlLCBzbyBwcmV2ZW50IHNldHRpbmcgdGFyZ2V0RWxlbWVudCB0byBudWxsXG5cdFx0dGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2gucGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQsIHRvdWNoLnBhZ2VZIC0gd2luZG93LnBhZ2VZT2Zmc2V0KSB8fCB0YXJnZXRFbGVtZW50O1xuXHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gdGhpcy50YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudDtcblx0fVxuXG5cdHRhcmdldFRhZ05hbWUgPSB0YXJnZXRFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0aWYgKHRhcmdldFRhZ05hbWUgPT09ICdsYWJlbCcpIHtcblx0XHRmb3JFbGVtZW50ID0gdGhpcy5maW5kQ29udHJvbCh0YXJnZXRFbGVtZW50KTtcblx0XHRpZiAoZm9yRWxlbWVudCkge1xuXHRcdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcblx0XHRcdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR0YXJnZXRFbGVtZW50ID0gZm9yRWxlbWVudDtcblx0XHR9XG5cdH0gZWxzZSBpZiAodGhpcy5uZWVkc0ZvY3VzKHRhcmdldEVsZW1lbnQpKSB7XG5cblx0XHQvLyBDYXNlIDE6IElmIHRoZSB0b3VjaCBzdGFydGVkIGEgd2hpbGUgYWdvIChiZXN0IGd1ZXNzIGlzIDEwMG1zIGJhc2VkIG9uIHRlc3RzIGZvciBpc3N1ZSAjMzYpIHRoZW4gZm9jdXMgd2lsbCBiZSB0cmlnZ2VyZWQgYW55d2F5LiBSZXR1cm4gZWFybHkgYW5kIHVuc2V0IHRoZSB0YXJnZXQgZWxlbWVudCByZWZlcmVuY2Ugc28gdGhhdCB0aGUgc3Vic2VxdWVudCBjbGljayB3aWxsIGJlIGFsbG93ZWQgdGhyb3VnaC5cblx0XHQvLyBDYXNlIDI6IFdpdGhvdXQgdGhpcyBleGNlcHRpb24gZm9yIGlucHV0IGVsZW1lbnRzIHRhcHBlZCB3aGVuIHRoZSBkb2N1bWVudCBpcyBjb250YWluZWQgaW4gYW4gaWZyYW1lLCB0aGVuIGFueSBpbnB1dHRlZCB0ZXh0IHdvbid0IGJlIHZpc2libGUgZXZlbiB0aG91Z2ggdGhlIHZhbHVlIGF0dHJpYnV0ZSBpcyB1cGRhdGVkIGFzIHRoZSB1c2VyIHR5cGVzIChpc3N1ZSAjMzcpLlxuXHRcdGlmICgoZXZlbnQudGltZVN0YW1wIC0gdHJhY2tpbmdDbGlja1N0YXJ0KSA+IDEwMCB8fCAoZGV2aWNlSXNJT1MgJiYgd2luZG93LnRvcCAhPT0gd2luZG93ICYmIHRhcmdldFRhZ05hbWUgPT09ICdpbnB1dCcpKSB7XG5cdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMuZm9jdXModGFyZ2V0RWxlbWVudCk7XG5cdFx0dGhpcy5zZW5kQ2xpY2sodGFyZ2V0RWxlbWVudCwgZXZlbnQpO1xuXG5cdFx0Ly8gU2VsZWN0IGVsZW1lbnRzIG5lZWQgdGhlIGV2ZW50IHRvIGdvIHRocm91Z2ggb24gaU9TIDQsIG90aGVyd2lzZSB0aGUgc2VsZWN0b3IgbWVudSB3b24ndCBvcGVuLlxuXHRcdC8vIEFsc28gdGhpcyBicmVha3Mgb3BlbmluZyBzZWxlY3RzIHdoZW4gVm9pY2VPdmVyIGlzIGFjdGl2ZSBvbiBpT1M2LCBpT1M3IChhbmQgcG9zc2libHkgb3RoZXJzKVxuXHRcdGlmICghZGV2aWNlSXNJT1MgfHwgdGFyZ2V0VGFnTmFtZSAhPT0gJ3NlbGVjdCcpIHtcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmIChkZXZpY2VJc0lPUyAmJiAhZGV2aWNlSXNJT1M0KSB7XG5cblx0XHQvLyBEb24ndCBzZW5kIGEgc3ludGhldGljIGNsaWNrIGV2ZW50IGlmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgcGFyZW50IGxheWVyIHRoYXQgd2FzIHNjcm9sbGVkXG5cdFx0Ly8gYW5kIHRoaXMgdGFwIGlzIGJlaW5nIHVzZWQgdG8gc3RvcCB0aGUgc2Nyb2xsaW5nICh1c3VhbGx5IGluaXRpYXRlZCBieSBhIGZsaW5nIC0gaXNzdWUgIzQyKS5cblx0XHRzY3JvbGxQYXJlbnQgPSB0YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudDtcblx0XHRpZiAoc2Nyb2xsUGFyZW50ICYmIHNjcm9sbFBhcmVudC5mYXN0Q2xpY2tMYXN0U2Nyb2xsVG9wICE9PSBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHQvLyBQcmV2ZW50IHRoZSBhY3R1YWwgY2xpY2sgZnJvbSBnb2luZyB0aG91Z2ggLSB1bmxlc3MgdGhlIHRhcmdldCBub2RlIGlzIG1hcmtlZCBhcyByZXF1aXJpbmdcblx0Ly8gcmVhbCBjbGlja3Mgb3IgaWYgaXQgaXMgaW4gdGhlIHdoaXRlbGlzdCBpbiB3aGljaCBjYXNlIG9ubHkgbm9uLXByb2dyYW1tYXRpYyBjbGlja3MgYXJlIHBlcm1pdHRlZC5cblx0aWYgKCF0aGlzLm5lZWRzQ2xpY2sodGFyZ2V0RWxlbWVudCkpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMuc2VuZENsaWNrKHRhcmdldEVsZW1lbnQsIGV2ZW50KTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBPbiB0b3VjaCBjYW5jZWwsIHN0b3AgdHJhY2tpbmcgdGhlIGNsaWNrLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hDYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgbW91c2UgZXZlbnRzIHdoaWNoIHNob3VsZCBiZSBwZXJtaXR0ZWQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLm9uTW91c2UgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gSWYgYSB0YXJnZXQgZWxlbWVudCB3YXMgbmV2ZXIgc2V0IChiZWNhdXNlIGEgdG91Y2ggZXZlbnQgd2FzIG5ldmVyIGZpcmVkKSBhbGxvdyB0aGUgZXZlbnRcblx0aWYgKCF0aGlzLnRhcmdldEVsZW1lbnQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGlmIChldmVudC5mb3J3YXJkZWRUb3VjaEV2ZW50KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBQcm9ncmFtbWF0aWNhbGx5IGdlbmVyYXRlZCBldmVudHMgdGFyZ2V0aW5nIGEgc3BlY2lmaWMgZWxlbWVudCBzaG91bGQgYmUgcGVybWl0dGVkXG5cdGlmICghZXZlbnQuY2FuY2VsYWJsZSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gRGVyaXZlIGFuZCBjaGVjayB0aGUgdGFyZ2V0IGVsZW1lbnQgdG8gc2VlIHdoZXRoZXIgdGhlIG1vdXNlIGV2ZW50IG5lZWRzIHRvIGJlIHBlcm1pdHRlZDtcblx0Ly8gdW5sZXNzIGV4cGxpY2l0bHkgZW5hYmxlZCwgcHJldmVudCBub24tdG91Y2ggY2xpY2sgZXZlbnRzIGZyb20gdHJpZ2dlcmluZyBhY3Rpb25zLFxuXHQvLyB0byBwcmV2ZW50IGdob3N0L2RvdWJsZWNsaWNrcy5cblx0aWYgKCF0aGlzLm5lZWRzQ2xpY2sodGhpcy50YXJnZXRFbGVtZW50KSB8fCB0aGlzLmNhbmNlbE5leHRDbGljaykge1xuXG5cdFx0Ly8gUHJldmVudCBhbnkgdXNlci1hZGRlZCBsaXN0ZW5lcnMgZGVjbGFyZWQgb24gRmFzdENsaWNrIGVsZW1lbnQgZnJvbSBiZWluZyBmaXJlZC5cblx0XHRpZiAoZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XG5cdFx0XHRldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBQYXJ0IG9mIHRoZSBoYWNrIGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgRXZlbnQjc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIChlLmcuIEFuZHJvaWQgMilcblx0XHRcdGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gQ2FuY2VsIHRoZSBldmVudFxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBJZiB0aGUgbW91c2UgZXZlbnQgaXMgcGVybWl0dGVkLCByZXR1cm4gdHJ1ZSBmb3IgdGhlIGFjdGlvbiB0byBnbyB0aHJvdWdoLlxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBPbiBhY3R1YWwgY2xpY2tzLCBkZXRlcm1pbmUgd2hldGhlciB0aGlzIGlzIGEgdG91Y2gtZ2VuZXJhdGVkIGNsaWNrLCBhIGNsaWNrIGFjdGlvbiBvY2N1cnJpbmdcbiAqIG5hdHVyYWxseSBhZnRlciBhIGRlbGF5IGFmdGVyIGEgdG91Y2ggKHdoaWNoIG5lZWRzIHRvIGJlIGNhbmNlbGxlZCB0byBhdm9pZCBkdXBsaWNhdGlvbiksIG9yXG4gKiBhbiBhY3R1YWwgY2xpY2sgd2hpY2ggc2hvdWxkIGJlIHBlcm1pdHRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHBlcm1pdHRlZDtcblxuXHQvLyBJdCdzIHBvc3NpYmxlIGZvciBhbm90aGVyIEZhc3RDbGljay1saWtlIGxpYnJhcnkgZGVsaXZlcmVkIHdpdGggdGhpcmQtcGFydHkgY29kZSB0byBmaXJlIGEgY2xpY2sgZXZlbnQgYmVmb3JlIEZhc3RDbGljayBkb2VzIChpc3N1ZSAjNDQpLiBJbiB0aGF0IGNhc2UsIHNldCB0aGUgY2xpY2stdHJhY2tpbmcgZmxhZyBiYWNrIHRvIGZhbHNlIGFuZCByZXR1cm4gZWFybHkuIFRoaXMgd2lsbCBjYXVzZSBvblRvdWNoRW5kIHRvIHJldHVybiBlYXJseS5cblx0aWYgKHRoaXMudHJhY2tpbmdDbGljaykge1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBWZXJ5IG9kZCBiZWhhdmlvdXIgb24gaU9TIChpc3N1ZSAjMTgpOiBpZiBhIHN1Ym1pdCBlbGVtZW50IGlzIHByZXNlbnQgaW5zaWRlIGEgZm9ybSBhbmQgdGhlIHVzZXIgaGl0cyBlbnRlciBpbiB0aGUgaU9TIHNpbXVsYXRvciBvciBjbGlja3MgdGhlIEdvIGJ1dHRvbiBvbiB0aGUgcG9wLXVwIE9TIGtleWJvYXJkIHRoZSBhIGtpbmQgb2YgJ2Zha2UnIGNsaWNrIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkIHdpdGggdGhlIHN1Ym1pdC10eXBlIGlucHV0IGVsZW1lbnQgYXMgdGhlIHRhcmdldC5cblx0aWYgKGV2ZW50LnRhcmdldC50eXBlID09PSAnc3VibWl0JyAmJiBldmVudC5kZXRhaWwgPT09IDApIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHBlcm1pdHRlZCA9IHRoaXMub25Nb3VzZShldmVudCk7XG5cblx0Ly8gT25seSB1bnNldCB0YXJnZXRFbGVtZW50IGlmIHRoZSBjbGljayBpcyBub3QgcGVybWl0dGVkLiBUaGlzIHdpbGwgZW5zdXJlIHRoYXQgdGhlIGNoZWNrIGZvciAhdGFyZ2V0RWxlbWVudCBpbiBvbk1vdXNlIGZhaWxzIGFuZCB0aGUgYnJvd3NlcidzIGNsaWNrIGRvZXNuJ3QgZ28gdGhyb3VnaC5cblx0aWYgKCFwZXJtaXR0ZWQpIHtcblx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXHR9XG5cblx0Ly8gSWYgY2xpY2tzIGFyZSBwZXJtaXR0ZWQsIHJldHVybiB0cnVlIGZvciB0aGUgYWN0aW9uIHRvIGdvIHRocm91Z2guXG5cdHJldHVybiBwZXJtaXR0ZWQ7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlIGFsbCBGYXN0Q2xpY2sncyBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBsYXllciA9IHRoaXMubGF5ZXI7XG5cblx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0fVxuXG5cdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrLCB0cnVlKTtcblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0LCBmYWxzZSk7XG5cdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUsIGZhbHNlKTtcblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQsIGZhbHNlKTtcblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLm9uVG91Y2hDYW5jZWwsIGZhbHNlKTtcbn07XG5cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIEZhc3RDbGljayBpcyBuZWVkZWQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKi9cbkZhc3RDbGljay5ub3ROZWVkZWQgPSBmdW5jdGlvbihsYXllcikge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBtZXRhVmlld3BvcnQ7XG5cdHZhciBjaHJvbWVWZXJzaW9uO1xuXHR2YXIgYmxhY2tiZXJyeVZlcnNpb247XG5cblx0Ly8gRGV2aWNlcyB0aGF0IGRvbid0IHN1cHBvcnQgdG91Y2ggZG9uJ3QgbmVlZCBGYXN0Q2xpY2tcblx0aWYgKHR5cGVvZiB3aW5kb3cub250b3VjaHN0YXJ0ID09PSAndW5kZWZpbmVkJykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gQ2hyb21lIHZlcnNpb24gLSB6ZXJvIGZvciBvdGhlciBicm93c2Vyc1xuXHRjaHJvbWVWZXJzaW9uID0gKygvQ2hyb21lXFwvKFswLTldKykvLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgWywwXSlbMV07XG5cblx0aWYgKGNocm9tZVZlcnNpb24pIHtcblxuXHRcdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcblxuXHRcdFx0aWYgKG1ldGFWaWV3cG9ydCkge1xuXHRcdFx0XHQvLyBDaHJvbWUgb24gQW5kcm9pZCB3aXRoIHVzZXItc2NhbGFibGU9XCJub1wiIGRvZXNuJ3QgbmVlZCBGYXN0Q2xpY2sgKGlzc3VlICM4OSlcblx0XHRcdFx0aWYgKG1ldGFWaWV3cG9ydC5jb250ZW50LmluZGV4T2YoJ3VzZXItc2NhbGFibGU9bm8nKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBDaHJvbWUgMzIgYW5kIGFib3ZlIHdpdGggd2lkdGg9ZGV2aWNlLXdpZHRoIG9yIGxlc3MgZG9uJ3QgbmVlZCBGYXN0Q2xpY2tcblx0XHRcdFx0aWYgKGNocm9tZVZlcnNpb24gPiAzMSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGggPD0gd2luZG93Lm91dGVyV2lkdGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0Ly8gQ2hyb21lIGRlc2t0b3AgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzE1KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRpZiAoZGV2aWNlSXNCbGFja0JlcnJ5MTApIHtcblx0XHRibGFja2JlcnJ5VmVyc2lvbiA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC8oWzAtOV0qKVxcLihbMC05XSopLyk7XG5cblx0XHQvLyBCbGFja0JlcnJ5IDEwLjMrIGRvZXMgbm90IHJlcXVpcmUgRmFzdGNsaWNrIGxpYnJhcnkuXG5cdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL2Z0bGFicy9mYXN0Y2xpY2svaXNzdWVzLzI1MVxuXHRcdGlmIChibGFja2JlcnJ5VmVyc2lvblsxXSA+PSAxMCAmJiBibGFja2JlcnJ5VmVyc2lvblsyXSA+PSAzKSB7XG5cdFx0XHRtZXRhVmlld3BvcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9dmlld3BvcnRdJyk7XG5cblx0XHRcdGlmIChtZXRhVmlld3BvcnQpIHtcblx0XHRcdFx0Ly8gdXNlci1zY2FsYWJsZT1ubyBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHdpZHRoPWRldmljZS13aWR0aCAob3IgbGVzcyB0aGFuIGRldmljZS13aWR0aCkgZWxpbWluYXRlcyBjbGljayBkZWxheS5cblx0XHRcdFx0aWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gSUUxMCB3aXRoIC1tcy10b3VjaC1hY3Rpb246IG5vbmUsIHdoaWNoIGRpc2FibGVzIGRvdWJsZS10YXAtdG8tem9vbSAoaXNzdWUgIzk3KVxuXHRpZiAobGF5ZXIuc3R5bGUubXNUb3VjaEFjdGlvbiA9PT0gJ25vbmUnKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qKlxuICogRmFjdG9yeSBtZXRob2QgZm9yIGNyZWF0aW5nIGEgRmFzdENsaWNrIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gbGF5ZXIgVGhlIGxheWVyIHRvIGxpc3RlbiBvblxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzXG4gKi9cbkZhc3RDbGljay5hdHRhY2ggPSBmdW5jdGlvbihsYXllciwgb3B0aW9ucykge1xuXHQndXNlIHN0cmljdCc7XG5cdHJldHVybiBuZXcgRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKTtcbn07XG5cblxuaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cblx0Ly8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXHRkZWZpbmUoZnVuY3Rpb24oKSB7XG5cdFx0J3VzZSBzdHJpY3QnO1xuXHRcdHJldHVybiBGYXN0Q2xpY2s7XG5cdH0pO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IEZhc3RDbGljay5hdHRhY2g7XG5cdG1vZHVsZS5leHBvcnRzLkZhc3RDbGljayA9IEZhc3RDbGljaztcbn0gZWxzZSB7XG5cdHdpbmRvdy5GYXN0Q2xpY2sgPSBGYXN0Q2xpY2s7XG59XG4iLCJzdG9yZXMgPSByZXF1aXJlICcuL3N0b3JlcydcbnJvdXRlcyA9IHJlcXVpcmUgJy4vcm91dGVzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHN0YXRpY0ZpbGVzOiBfX2Rpcm5hbWUrXCIvcHVibGljXCJcbiAgc3RvcmVJZDogXCJzdG9yZV9zdGF0ZV9mcm9tX3NlcnZlclwiXG4gIGFwcElkOiBcImFwcFwiXG4gIHJvdXRlczogcm91dGVzXG4gIHN0b3Jlczogc3RvcmVzIiwiUSA9IHJlcXVpcmUgJ3EnXG5SZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuSW5kZXhWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9pbmRleCdcblRlYW1WaWV3ID0gcmVxdWlyZSAnLi92aWV3cy90ZWFtJ1xuUGxheWVyVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvcGxheWVyJ1xuR2FtZVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2dhbWUnXG5TY2hlZHVsZVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3NjaGVkdWxlJ1xuU3RhbmRpbmdzVmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvc3RhbmRpbmdzJ1xuU3RhdHNWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9zdGF0cydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBcIi9cIjogLT5cbiAgICBRLnNwcmVhZCBbXG4gICAgICBAc3RvcmUuZmV0Y2goXCJzdGFuZGluZ3NcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcInRlYW1zXCIpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJzdGF0c1wiKVxuICAgIF0sIChzdGFuZGluZ3MsIHRlYW1zTGlzdCwgc3RhdHNMaXN0KSAtPlxuICAgICAgdGl0bGU6IFwiRXR1c2l2dVwiXG4gICAgICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUVsZW1lbnQgSW5kZXhWaWV3LFxuICAgICAgICBzdGFuZGluZ3M6IHN0YW5kaW5ncy50b0pTT04oKVxuICAgICAgICB0ZWFtczogdGVhbXNMaXN0LnRvSlNPTigpXG4gICAgICAgIHN0YXRzOiBzdGF0c0xpc3QudG9KU09OKClcblxuICBcIi9qb3Vra3VlZXQvOmlkLzphY3RpdmU/XCI6IChpZCwgYWN0aXZlKSAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKVxuICAgICAgQHN0b3JlLmZldGNoKFwidGVhbVwiLCBpZDogaWQpXG4gICAgXSwgKHN0YW5kaW5ncywgdGVhbSkgLT5cblxuICAgICAgc3ViVGl0bGUgPSBzd2l0Y2ggYWN0aXZlXG4gICAgICAgIHdoZW4gXCJwZWxhYWphdFwiIHRoZW4gXCJQZWxhYWphdFwiXG4gICAgICAgIHdoZW4gXCJ0aWxhc3RvdFwiIHRoZW4gXCJUaWxhc3RvdFwiXG4gICAgICAgIGVsc2UgXCJPdHRlbHVvaGplbG1hXCJcblxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0IC0gI3t0ZWFtLmdldChcImluZm9cIikubmFtZX0gLSAje3N1YlRpdGxlfVwiXG4gICAgICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUVsZW1lbnQgVGVhbVZpZXcsXG4gICAgICAgIGlkOiBpZFxuICAgICAgICBzdGFuZGluZ3M6IHN0YW5kaW5ncy50b0pTT04oKVxuICAgICAgICB0ZWFtOiB0ZWFtLnRvSlNPTigpXG4gICAgICAgIGFjdGl2ZTogYWN0aXZlXG5cbiAgXCIvam91a2t1ZWV0LzppZC86cGlkLzpzbHVnXCI6IChpZCwgcGlkLCBzbHVnKSAtPlxuICAgIEBzdG9yZS5mZXRjaChcInRlYW1cIiwgaWQ6IGlkKS50aGVuICh0ZWFtKSAtPlxuICAgICAgcGxheWVyID0gdGVhbS5nZXQoXCJyb3N0ZXJcIikuZmlsdGVyKChwbGF5ZXIpIC0+XG4gICAgICAgIHBsYXllci5pZCBpcyBcIiN7cGlkfS8je3NsdWd9XCJcbiAgICAgIClbMF1cbiAgICAgIHRpdGxlOiBcIlBlbGFhamF0IC0gI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVFbGVtZW50IFBsYXllclZpZXcsXG4gICAgICAgIGlkOiBwaWRcbiAgICAgICAgcGxheWVyOiBwbGF5ZXJcbiAgICAgICAgdGVhbTogdGVhbS50b0pTT04oKVxuXG4gIFwiL290dGVsdXRcIjogLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJzY2hlZHVsZVwiKS50aGVuIChzY2hlZHVsZSkgLT5cbiAgICAgIHRpdGxlOiBcIk90dGVsdW9oamVsbWFcIlxuICAgICAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVFbGVtZW50IFNjaGVkdWxlVmlldyxcbiAgICAgICAgc2NoZWR1bGU6IHNjaGVkdWxlLnRvSlNPTigpXG5cbiAgXCIvb3R0ZWx1dC86aWQvOmFjdGl2ZT9cIjogKGlkLCBhY3RpdmUpIC0+XG4gICAgUS5zcHJlYWQgW1xuICAgICAgQHN0b3JlLmZldGNoKFwic2NoZWR1bGVcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcImdhbWVFdmVudHNcIiwgaWQ6IGlkKVxuICAgICAgQHN0b3JlLmZldGNoKFwiZ2FtZUxpbmV1cHNcIiwgaWQ6IGlkKVxuICAgICAgQHN0b3JlLmZldGNoKFwiZ2FtZVN0YXRzXCIsIGlkOiBpZClcbiAgICBdLCAoc2NoZWR1bGUsIGV2ZW50cywgbGluZVVwcywgc3RhdHMpIC0+XG4gICAgICBnYW1lID0gc2NoZWR1bGUuZmluZCAoZykgLT5cbiAgICAgICAgZy5pZCBpcyBpZFxuXG4gICAgICB0aXRsZTogXCJPdHRlbHUgLSAje2dhbWUuZ2V0KFwiaG9tZVwiKX0gdnMgI3tnYW1lLmdldChcImF3YXlcIil9XCJcbiAgICAgIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlRWxlbWVudCBHYW1lVmlldyxcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIGdhbWU6IGdhbWUudG9KU09OKClcbiAgICAgICAgZXZlbnRzOiBldmVudHMudG9KU09OKClcbiAgICAgICAgbGluZVVwczogbGluZVVwcy50b0pTT04oKVxuICAgICAgICBzdGF0czogc3RhdHMudG9KU09OKClcbiAgICAgICAgYWN0aXZlOiBhY3RpdmVcblxuICBcIi9zYXJqYXRhdWx1a2tvXCI6IC0+XG4gICAgQHN0b3JlLmZldGNoKFwic3RhbmRpbmdzXCIpLnRoZW4gKHN0YW5kaW5ncykgLT5cbiAgICAgIHRpdGxlOiBcIlNhcmphdGF1bHVra29cIlxuICAgICAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVFbGVtZW50IFN0YW5kaW5nc1ZpZXcsXG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG5cbiAgXCIvdGlsYXN0b3QvOmFjdGl2ZT9cIjogKGFjdGl2ZSkgLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJzdGF0c1wiKS50aGVuIChzdGF0cykgLT5cbiAgICAgIHRpdGxlOiBcIlRpbGFzdG90XCJcbiAgICAgIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlRWxlbWVudCBTdGF0c1ZpZXcsXG4gICAgICAgIHN0YXRzOiBzdGF0cy50b0pTT04oKVxuICAgICAgICBhY3RpdmU6IGFjdGl2ZSIsIlRlYW1zQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vc3RvcmVzL3RlYW1zJ1xuU2NoZWR1bGVDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi9zdG9yZXMvc2NoZWR1bGUnXG5TdGFuZGluZ3NDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi9zdG9yZXMvc3RhbmRpbmdzJ1xuU3RhdHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL3N0YXRzJ1xuVGVhbU1vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvdGVhbSdcbkdhbWVFdmVudHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL2dhbWVfZXZlbnRzJ1xuR2FtZUxpbmV1cHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL2dhbWVfbGluZXVwcydcbkdhbWVTdGF0c01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvZ2FtZV9zdGF0cydcblxubW9kdWxlLmV4cG9ydHMgPVxuICB0ZWFtczogVGVhbXNDb2xsZWN0aW9uXG4gIHNjaGVkdWxlOiBTY2hlZHVsZUNvbGxlY3Rpb25cbiAgc3RhbmRpbmdzOiBTdGFuZGluZ3NDb2xsZWN0aW9uXG4gIHN0YXRzOiBTdGF0c01vZGVsXG4gIHRlYW06IFRlYW1Nb2RlbFxuICBnYW1lRXZlbnRzOiBHYW1lRXZlbnRzTW9kZWxcbiAgZ2FtZUxpbmV1cHM6IEdhbWVMaW5ldXBzTW9kZWxcbiAgZ2FtZVN0YXRzOiBHYW1lU3RhdHNNb2RlbCIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5HYW1lRXZlbnRzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwiZ2FtZXMvZXZlbnRzLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vZ2FtZXMvZXZlbnRzLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUV2ZW50cyIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5HYW1lTGluZXVwcyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcImdhbWVzL2xpbmV1cHMvI3tAc3RvcmVPcHRpb25zLmlkfVwiXG5cbiAgdXJsOiAtPlxuICAgIFwiI3thcGlDb25maWcudXJsfS9nYW1lcy9saW5ldXBzLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUxpbmV1cHMiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuR2FtZVN0YXRzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwiZ2FtZXMvc3RhdHMvI3tAc3RvcmVPcHRpb25zLmlkfVwiXG5cbiAgdXJsOiAtPlxuICAgIFwiI3thcGlDb25maWcudXJsfS9nYW1lcy9zdGF0cy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGF0cyIsIkNvbGxlY3Rpb24gPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuQ29sbGVjdGlvblxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuU2NoZWR1bGUgPSBDb2xsZWN0aW9uLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInNjaGVkdWxlXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS9zY2hlZHVsZS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlZHVsZSIsIkNvbGxlY3Rpb24gPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuQ29sbGVjdGlvblxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuU3RhbmRpbmdzID0gQ29sbGVjdGlvbi5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJzdGFuZGluZ3NcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3N0YW5kaW5ncy5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFuZGluZ3MiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuU3RhdHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJzdGF0c1wiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vc3RhdHMuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdHMiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuVGVhbSA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInRlYW1zLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vdGVhbXMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtIiwiQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Db2xsZWN0aW9uXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5UZWFtcyA9IENvbGxlY3Rpb24uZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwidGVhbXNcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3RlYW1zLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1zIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5cbntSb3csIENvbCwgTmF2LCBOYXZJdGVtLCBUYWJQYW5lfSA9IHJlcXVpcmUgJ3JlYWN0LWJvb3RzdHJhcCdcblxuR2FtZUV2ZW50cyA9IHJlcXVpcmUgJy4vZ2FtZV9ldmVudHMnXG5HYW1lTGluZXVwcyA9IHJlcXVpcmUgJy4vZ2FtZV9saW5ldXBzJ1xuR2FtZVN0YXRzID0gcmVxdWlyZSAnLi9nYW1lX3N0YXRzJ1xuXG5HYW1lID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcInN0YXRzXCJcbiAgICAgIHdoZW4gXCJrZXRqdXRcIiB0aGVuIFwibGluZVVwc1wiXG4gICAgICBlbHNlIFwiZXZlbnRzXCJcblxuICAgICMgY29uc29sZS5sb2cgXCJldmVudHNcIiwgQHByb3BzLmV2ZW50c1xuICAgICMgY29uc29sZS5sb2cgXCJsaW5ldXBzXCIsIEBwcm9wcy5saW5lVXBzXG4gICAgI2NvbnNvbGUubG9nIFwic3RhdHNcIiwgQHByb3BzLnN0YXRzXG4gICAgIyBjb25zb2xlLmxvZyBcImdhbWVcIiwgQHByb3BzLmdhbWVcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIChAcHJvcHMuZ2FtZS5ob21lKSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIChAcHJvcHMuZ2FtZS5ob21lU2NvcmUpLCBcIiAtIFwiLCAoQHByb3BzLmdhbWUuYXdheVNjb3JlKSksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcIllsZWlzXFx1MDBmNlxcdTAwZTQ6IFwiLCAoQHByb3BzLmdhbWUuYXR0ZW5kYW5jZSkpXG4gICAgICAgICksXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHtcInhzXCI6ICg0KSwgXCJtZFwiOiAoNCl9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCAoQHByb3BzLmdhbWUuYXdheSkpXG4gICAgICAgIClcbiAgICAgICksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2LCB7XCJic1N0eWxlXCI6IFwidGFic1wiLCBcImFjdGl2ZUtleVwiOiAoYWN0aXZlS2V5KSwgXCJyZWZcIjogXCJ0YWJzXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je0Bwcm9wcy5pZH1cIiwgXCJldmVudEtleVwiOiBcImV2ZW50c1wifSwgXCJUYXBhaHR1bWF0XCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je0Bwcm9wcy5pZH0vdGlsYXN0b3RcIiwgXCJldmVudEtleVwiOiBcInN0YXRzXCJ9LCBcIlRpbGFzdG90XCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je0Bwcm9wcy5pZH0va2V0anV0XCIsIFwiZXZlbnRLZXlcIjogXCJsaW5lVXBzXCJ9LCBcIktldGp1dFwiKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWItY29udGVudFwiLCBcInJlZlwiOiBcInBhbmVzXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcImV2ZW50c1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwiZXZlbnRzXCIpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdhbWVFdmVudHMsIHtcImV2ZW50c1wiOiAoQHByb3BzLmV2ZW50cyksIFwiZ2FtZVwiOiAoQHByb3BzLmdhbWUpfSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInN0YXRzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJzdGF0c1wiKX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHYW1lU3RhdHMsIHtcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMpfSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcImxpbmVVcHNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcImxpbmVVcHNcIil9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2FtZUxpbmV1cHMsIHtcImxpbmVVcHNcIjogKEBwcm9wcy5saW5lVXBzKX0pXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbiMge1JvdywgQ29sLCBOYXYsIE5hdkl0ZW0sIFRhYlBhbmV9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5HYW1lRXZlbnRzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBldmVudDogKGV2ZW50LCBpKSAtPlxuICAgIGlmIGV2ZW50LmhlYWRlclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoZXZlbnQuaGVhZGVyKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IFwiM1wifSwgKGV2ZW50LmhlYWRlcikpXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoaSl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKEBwcm9wcy5nYW1lW2V2ZW50LnRlYW1dKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZXZlbnQudGltZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGV2ZW50LnRleHQpKVxuICAgICAgKVxuXG4gIHJlbmRlcjogLT5cbiAgICBldmVudHMgPSBPYmplY3Qua2V5cyhAcHJvcHMuZXZlbnRzKS5yZWR1Y2UgKGFyciwga2V5KSA9PlxuICAgICAgYXJyLnB1c2ggaGVhZGVyOiBrZXlcbiAgICAgIGFyciA9IGFyci5jb25jYXQgQHByb3BzLmV2ZW50c1trZXldXG4gICAgICBhcnJcbiAgICAsIFtdXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgKGV2ZW50cy5tYXAgKGV2ZW50LCBpKSA9PlxuICAgICAgICAgIEBldmVudChldmVudCwgaSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lRXZlbnRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbiMge1JvdywgQ29sLCBOYXYsIE5hdkl0ZW0sIFRhYlBhbmV9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5HYW1lTGluZXVwcyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9XG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMaW5ldXBzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbiMge1JvdywgQ29sLCBOYXYsIE5hdkl0ZW0sIFRhYlBhbmV9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5HYW1lU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgKEBwcm9wcy5zdGF0cy5ob21lLnBsYXllcnMubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpXG4gICAgICAgICksXG5cbiAgICAgICAgKEBwcm9wcy5zdGF0cy5ob21lLmdvYWxpZXMubWFwIChnb2FsaWUpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoZ29hbGllLmlkKX0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoZ29hbGllLmZpcnN0TmFtZSksIFwiIFwiLCAoZ29hbGllLmxhc3ROYW1lKSkpXG4gICAgICAgIClcbiAgICAgICksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICAoQHByb3BzLnN0YXRzLmF3YXkucGxheWVycy5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSlcbiAgICAgICAgKSxcblxuICAgICAgICAoQHByb3BzLnN0YXRzLmF3YXkuZ29hbGllcy5tYXAgKGdvYWxpZSkgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge1wia2V5XCI6IChnb2FsaWUuaWQpfSwgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChnb2FsaWUuZmlyc3ROYW1lKSwgXCIgXCIsIChnb2FsaWUubGFzdE5hbWUpKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVGFibGVTb3J0TWl4aW4gPSByZXF1aXJlICcuL21peGlucy90YWJsZV9zb3J0J1xuXG5Hb2FsaWVTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgbWl4aW5zOiBbVGFibGVTb3J0TWl4aW5dXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHNvcnRGaWVsZDogXCJzYXZpbmdQZXJjZW50YWdlXCJcbiAgICBzb3J0RGlyZWN0aW9uOiBcImRlc2NcIlxuICAgIHNvcnRUeXBlOiBcImZsb2F0XCJcblxuICByZW5kZXI6IC0+XG4gICAgZ29hbGllcyA9IEBwcm9wcy5zdGF0cy5zb3J0KEBzb3J0KS5tYXAgKHBsYXllcikgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbUlkfS8je3BsYXllci5pZH1cIn0sIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLndpbnMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIudGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5sb3NzZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuc2F2ZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ29hbHNBbGxvd2VkKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnNodXRvdXRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmdvYWxzQXZlcmFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5zYXZpbmdQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmFzc2lzdHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnBlbmFsdGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci53aW5QZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7XCJjb2xTcGFuXCI6IDJ9LCAocGxheWVyLm1pbnV0ZXMpKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1yb3N0ZXJcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwge1wiY2xhc3NOYW1lXCI6IFwic29ydGFibGUtdGhlYWRcIiwgXCJvbkNsaWNrXCI6IChAc2V0U29ydCl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiY29sU3BhblwiOiAxN30sIFwiTWFhbGl2YWhkaXRcIilcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImxhc3ROYW1lXCIsIFwiZGF0YS10eXBlXCI6IFwic3RyaW5nXCJ9LCBcIk5pbWlcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdhbWVzXCJ9LCBcIlBPXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJ3aW5zXCJ9LCBcIlZcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInRpZXNcIn0sIFwiVFwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwibG9zc2VzXCJ9LCBcIkhcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInNhdmVzXCJ9LCBcIlRPXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0FsbG93ZWRcIn0sIFwiUE1cIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInNodXRvdXRzXCJ9LCBcIk5QXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0F2ZXJhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJLQVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwic2F2aW5nUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIlQlXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc1wifSwgXCJNXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJhc3Npc3RzXCJ9LCBcIlNcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBvaW50c1wifSwgXCJQXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwZW5hbHRpZXNcIn0sIFwiUlwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwid2luUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIlYlXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJtaW51dGVzXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIiwgXCJjb2xTcGFuXCI6IDJ9LCBcIkFpa2FcIilcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLFxuICAgICAgICAoZ29hbGllcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gR29hbGllU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UZWFtc0xpc3RWaWV3ID0gcmVxdWlyZSAnLi90ZWFtc19saXN0J1xuVG9wU2NvcmVyc1ZpZXcgPSByZXF1aXJlICcuL3RvcF9zY29yZXJzJ1xuXG5JbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJqdW1ib3Ryb25cIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCBcIkxpaWdhLnB3XCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBcIkxpaWdhbiB0aWxhc3RvdCBub3BlYXN0aSBqYSB2YWl2YXR0b21hc3RpXCIpXG4gICAgICApLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlYW1zTGlzdFZpZXcsIHtcInRlYW1zXCI6IChAcHJvcHMudGVhbXMpfSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9wU2NvcmVyc1ZpZXcsIHtcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMpfSlcblxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBJbmRleCIsIlRhYmxlU29ydE1peGluID1cbiAgc2V0U29ydDogKGV2ZW50KSAtPlxuICAgIHNvcnQgPSBldmVudC50YXJnZXQuZGF0YXNldC5zb3J0XG4gICAgaWYgc29ydFxuICAgICAgdHlwZSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnR5cGUgb3IgXCJpbnRlZ2VyXCJcbiAgICAgIGlmIEBzdGF0ZS5zb3J0RmllbGQgaXMgc29ydFxuICAgICAgICBuZXdTb3J0ID0gaWYgQHN0YXRlLnNvcnREaXJlY3Rpb24gaXMgXCJkZXNjXCIgdGhlbiBcImFzY1wiIGVsc2UgXCJkZXNjXCJcbiAgICAgICAgQHNldFN0YXRlIHNvcnREaXJlY3Rpb246IG5ld1NvcnQsIHNvcnRUeXBlOiB0eXBlXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRTdGF0ZSBzb3J0RmllbGQ6IHNvcnQsIHNvcnRUeXBlOiB0eXBlXG5cbiAgc29ydDogKGEsIGIpIC0+XG4gICAgc3dpdGNoIEBzdGF0ZS5zb3J0VHlwZVxuICAgICAgd2hlbiBcImludGVnZXJcIlxuICAgICAgICBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIlxuICAgICAgICAgIGJbQHN0YXRlLnNvcnRGaWVsZF0gLSBhW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhW0BzdGF0ZS5zb3J0RmllbGRdIC0gYltAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgd2hlbiBcImZsb2F0XCJcbiAgICAgICAgYVZhbHVlID0gTnVtYmVyKGFbQHN0YXRlLnNvcnRGaWVsZF0ucmVwbGFjZShcIiVcIixcIlwiKS5yZXBsYWNlKC9cXCx8XFw6LyxcIi5cIikpIG9yIDBcbiAgICAgICAgYlZhbHVlID0gTnVtYmVyKGJbQHN0YXRlLnNvcnRGaWVsZF0ucmVwbGFjZShcIiVcIixcIlwiKS5yZXBsYWNlKC9cXCx8XFw6LyxcIi5cIikpIG9yIDBcbiAgICAgICAgaWYgQHN0YXRlLnNvcnREaXJlY3Rpb24gaXMgXCJkZXNjXCJcbiAgICAgICAgICBiVmFsdWUgLSBhVmFsdWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFWYWx1ZSAtIGJWYWx1ZVxuICAgICAgd2hlbiBcInN0cmluZ1wiXG4gICAgICAgIGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiXG4gICAgICAgICAgaWYgYltAc3RhdGUuc29ydEZpZWxkXSA8IGFbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgICAgIC0xXG4gICAgICAgICAgZWxzZSBpZiBiW0BzdGF0ZS5zb3J0RmllbGRdID4gYVtAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgMVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIGFbQHN0YXRlLnNvcnRGaWVsZF0gPCBiW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAtMVxuICAgICAgICAgIGVsc2UgaWYgYVtAc3RhdGUuc29ydEZpZWxkXSA+IGJbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgICAgIDFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAwXG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVTb3J0TWl4aW4iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbntOYXZiYXIsIE5hdiwgTmF2SXRlbSwgRHJvcGRvd25CdXR0b24sIE1lbnVJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuXG5UZWFtcyA9IHJlcXVpcmUgJy4uL2xpYi90ZWFtcydcblxuTmF2aWdhdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIGJyYW5kID0gUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiBcIi9cIiwgXCJjbGFzc05hbWVcIjogXCJuYXZiYXItYnJhbmRcIn0sIFwiTGlpZ2FcIilcblxuICAgIHRlYW1zID1cbiAgICAgICMgZGlzYWJsZSBmb3Igbm93LCByZWFjdCBib290c3RyYXAgaXMgYnVnZ3kgb24gbW9iaWxlXG4gICAgICAjIDxEcm9wZG93bkJ1dHRvbiB0aXRsZT1cIkpvdWtrdWVldFwiPlxuICAgICAgIyAgIHtPYmplY3Qua2V5cyhUZWFtcy5uYW1lc0FuZElkcykubWFwIChuYW1lKSAtPlxuICAgICAgIyAgICAgPE1lbnVJdGVtIGtleT17VGVhbXMubmFtZXNBbmRJZHNbbmFtZV19IGhyZWY9XCIvam91a2t1ZWV0LyN7VGVhbXMubmFtZXNBbmRJZHNbbmFtZV19XCI+e25hbWV9PC9NZW51SXRlbT5cbiAgICAgICMgICB9XG4gICAgICAjIDwvRHJvcGRvd25CdXR0b24+XG4gICAgICBudWxsXG5cbiAgICBpZiBAcHJvcHMuaXRlbVxuICAgICAgaXRlbSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiAoQHByb3BzLml0ZW0udXJsKX0sIChAcHJvcHMuaXRlbS50aXRsZSkpXG5cbiAgICBpZiBAcHJvcHMuZHJvcGRvd25cbiAgICAgIGRyb3Bkb3duID0gUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wZG93bkJ1dHRvbiwge1widGl0bGVcIjogKEBwcm9wcy5kcm9wZG93bi50aXRsZSl9LFxuICAgICAgICAoQHByb3BzLmRyb3Bkb3duLml0ZW1zLm1hcCAoaXRlbSkgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lbnVJdGVtLCB7XCJldmVudEtleVwiOiAoaXRlbS50aXRsZSksIFwiaHJlZlwiOiAoaXRlbS51cmwpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhciwge1wiYnJhbmRcIjogKGJyYW5kKSwgXCJmaXhlZFRvcFwiOiB0cnVlLCBcInRvZ2dsZU5hdktleVwiOiAoMCl9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImNsYXNzTmFtZVwiOiBcImJzLW5hdmJhci1jb2xsYXBzZVwiLCBcImV2ZW50S2V5XCI6ICgwKSwgXCJyb2xlXCI6IFwibmF2aWdhdGlvblwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3NhcmphdGF1bHVra29cIn0sIFwiU2FyamF0YXVsdWtrb1wiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3RpbGFzdG90XCJ9LCBcIlRpbGFzdG90XCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dFwifSwgXCJPdHRlbHV0XCIpLFxuICAgICAgICAodGVhbXMpLFxuICAgICAgICAoaXRlbSksXG4gICAgICAgIChkcm9wZG93bilcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG5QbGF5ZXIgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBwbGF5ZXIgPSBAcHJvcHMucGxheWVyXG4gICAgdGVhbSA9IEBwcm9wcy50ZWFtXG5cbiAgICBwbGF5ZXJzID1cbiAgICAgIHRpdGxlOiBcIlBlbGFhamF0XCIsXG4gICAgICBpdGVtczogdGVhbS5yb3N0ZXIubWFwIChwbGF5ZXIpID0+XG4gICAgICAgIHRpdGxlOiBcIiN7cGxheWVyLmZpcnN0TmFtZX0gI3twbGF5ZXIubGFzdE5hbWV9XCJcbiAgICAgICAgdXJsOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmluZm8uaWR9LyN7cGxheWVyLmlkfVwiXG5cbiAgICAjIFRPRE86IGNoZWNrIHBvc2l0aW9uLCBLSCBPTCBWTCBQIHVzZSBwbGF5ZXJzLCBNViB1c2UgZ29hbGllc1xuICAgIHN0YXRzID0gdGVhbS5zdGF0cy5wbGF5ZXJzLmZpbHRlcigocGxheWVyKSA9PlxuICAgICAgW2lkLCBzbHVnXSA9IHBsYXllci5pZC5zcGxpdChcIi9cIilcbiAgICAgIGlkIGlzIEBwcm9wcy5pZFxuICAgIClbMF1cblxuICAgIGl0ZW0gPVxuICAgICAgdGl0bGU6IHRlYW0uaW5mby5uYW1lXG4gICAgICB1cmw6IHRlYW0uaW5mby51cmxcblxuICAgIGNvbnNvbGUubG9nIFwicGxheWVyXCIsIHBsYXllclxuICAgIGNvbnNvbGUubG9nIFwidGVhbVwiLCB0ZWFtXG4gICAgY29uc29sZS5sb2cgXCJzdGF0c1wiLCBzdGF0c1xuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJwbGF5ZXJcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIHtcImRyb3Bkb3duXCI6IChwbGF5ZXJzKSwgXCJpdGVtXCI6IChpdGVtKX0pLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwgbnVsbCwgXCIjXCIsIChwbGF5ZXIubnVtYmVyKSwgXCIgXCIsIChwbGF5ZXIucG9zaXRpb24pKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImNsYXNzTmFtZVwiOiBcInRlYW0tbG9nbyAje3RlYW0uaW5mby5pZH1cIiwgXCJocmVmXCI6IFwiL2pvdWtrdWVldC8je3RlYW0uaW5mby5pZH1cIn0pLCBcIiBcIiwgKHRlYW0uaW5mby5uYW1lKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgKG1vbWVudChwbGF5ZXIuYmlydGhkYXkpLmZvcm1hdChcIkRELk1NLllZWVlcIikpKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgKHBsYXllci5oZWlnaHQpLCBcIiBjbVwiKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgKHBsYXllci53ZWlnaHQpLCBcIiBrZ1wiKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgKHBsYXllci5zaG9vdHMpKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGVcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiT1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiU1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUlwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiK1xceDJGLVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiK1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiLVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiWVZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJBVk1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIlZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJMXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJMJVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiQVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiQSVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkFpa2FcIilcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZ2FtZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5nb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLmFzc2lzdHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wb2ludHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wZW5hbHRpZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wbHVzTWludXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5wbHVzc2VzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMubWludXNlcykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnBvd2VyUGxheUdvYWxzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuc2hvcnRIYW5kZWRHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLndpbm5pbmdHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnNob3RzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuc2hvb3RpbmdQZXJjZW50YWdlKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoc3RhdHMuZmFjZW9mZnMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChzdGF0cy5mYWNlb2ZmUGVyY2VudGFnZSkpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHN0YXRzLnBsYXlpbmdUaW1lQXZlcmFnZSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRhYmxlU29ydE1peGluID0gcmVxdWlyZSAnLi9taXhpbnMvdGFibGVfc29ydCdcblxuUGxheWVyU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIG1peGluczogW1RhYmxlU29ydE1peGluXVxuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBzb3J0RmllbGQ6IFwicG9pbnRzXCJcbiAgICBzb3J0RGlyZWN0aW9uOiBcImRlc2NcIlxuICAgIHNvcnRUeXBlOiBcImludGVnZXJcIlxuXG4gIHJlbmRlcjogLT5cbiAgICBwbGF5ZXJzID0gQHByb3BzLnN0YXRzLnNvcnQoQHNvcnQpLm1hcCAocGxheWVyKSA9PlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy50ZWFtSWR9LyN7cGxheWVyLmlkfVwifSwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ2FtZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ29hbHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wb2ludHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucGVuYWx0aWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnBsdXNNaW51cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wbHVzc2VzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLm1pbnVzZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIucG93ZXJQbGF5R29hbHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuc2hvcnRIYW5kZWRHb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci53aW5uaW5nR29hbHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuc2hvdHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuc2hvb3RpbmdQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmZhY2VvZmZzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmZhY2VvZmZQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnBsYXlpbmdUaW1lQXZlcmFnZSkpXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCB7XCJjbGFzc05hbWVcIjogXCJzb3J0YWJsZS10aGVhZFwiLCBcIm9uQ2xpY2tcIjogKEBzZXRTb3J0KX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IDE3fSwgXCJQZWxhYWphdFwiKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwibGFzdE5hbWVcIiwgXCJkYXRhLXR5cGVcIjogXCJzdHJpbmdcIn0sIFwiTmltaVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiZ2FtZXNcIn0sIFwiT1wiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiZ29hbHNcIn0sIFwiTVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiYXNzaXN0c1wifSwgXCJTXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwb2ludHNcIn0sIFwiUFwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicGVuYWx0aWVzXCJ9LCBcIlJcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBsdXNNaW51c1wifSwgXCIrXFx4MkYtXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJwbHVzc2VzXCJ9LCBcIitcIiksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcIm1pbnVzZXNcIn0sIFwiLVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicG93ZXJQbGF5R29hbHNcIn0sIFwiWVZNXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJzaG9ydEhhbmRlZEdvYWxzXCJ9LCBcIkFWTVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwid2lubmluZ0dvYWxzXCJ9LCBcIlZNXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJzaG90c1wifSwgXCJMXCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJzaG9vdGluZ1BlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJMJVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiZmFjZW9mZnNcIn0sIFwiQVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwiZmFjZW9mZlBlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJBJVwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicGxheWluZ1RpbWVBdmVyYWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiQWlrYVwiKVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsXG4gICAgICAgIChwbGF5ZXJzKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5tb21lbnQubG9jYWxlKCdmaSdcbiAgbW9udGhzIDogW1xuICAgIFwiVGFtbWlrdXVcIiwgXCJIZWxtaWt1dVwiLCBcIk1hYWxpc2t1dVwiLCBcIkh1aHRpa3V1XCIsIFwiVG91a29rdXVcIiwgXCJLZXPDpGt1dVwiLCBcIkhlaW7DpGt1dVwiLFxuICAgIFwiRWxva3V1XCIsIFwiU3l5c2t1dVwiLCBcIkxva2FrdXVcIiwgXCJNYXJyYXNrdXVcIiwgXCJKb3VsdWt1dVwiXG4gIF1cbilcbm1vbWVudC5sb2NhbGUoJ2ZpJylcblxuU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBmaXJzdERhdGU6IG1vbWVudCgpLnN0YXJ0T2YoXCJtb250aFwiKVxuICAgIGxhc3REYXRlOiBtb21lbnQoKS5lbmRPZihcIm1vbnRoXCIpXG4gICAgcHJldmlvdXNWaXNpYmxlOiBmYWxzZVxuICAgIG5leHRWaXNpYmxlOiBmYWxzZVxuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgbW9udGhSYW5nZXM6IC0+XG4gICAgW2ZpcnN0R2FtZSwgLi4uLCBsYXN0R2FtZV0gPSBAcHJvcHMuc2NoZWR1bGVcbiAgICBbbW9tZW50KGZpcnN0R2FtZS5kYXRlKS5zdGFydE9mKFwibW9udGhcIiksIG1vbWVudChsYXN0R2FtZS5kYXRlKS5lbmRPZihcIm1vbnRoXCIpXVxuXG4gIGdhbWVMaW5rOiAoZ2FtZSkgLT5cbiAgICBpZiBtb21lbnQoZ2FtZS5kYXRlKS5lbmRPZihcImRheVwiKSA8IG1vbWVudCgpXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJocmVmXCI6IFwiL290dGVsdXQvI3tnYW1lLmlkfVwifSwgKGdhbWUuaG9tZSksIFwiIC0gXCIsIChnYW1lLmF3YXkpKVxuICAgIGVsc2VcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIChnYW1lLmhvbWUpLCBcIiAtIFwiLCAoZ2FtZS5hd2F5KSlcblxuICBzaG93UHJldmlvdXM6IC0+XG4gICAgaWYgbm90IEBzdGF0ZS5wcmV2aW91c1Zpc2libGVcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiY2xhc3NOYW1lXCI6IFwibG9hZC1tb3JlXCIsIFwiY29sU3BhblwiOiA0LCBcIm9uQ2xpY2tcIjogKEBsb2FkUHJldmlvdXMpfSwgXCJOXFx1MDBlNHl0XFx1MDBlNCBlZGVsbGlzZXQga3V1a2F1ZGV0Li4uXCIpXG4gICAgICAgIClcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBudWxsXG5cbiAgc2hvd05leHQ6IC0+XG4gICAgaWYgbm90IEBzdGF0ZS5uZXh0VmlzaWJsZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjbGFzc05hbWVcIjogXCJsb2FkLW1vcmVcIiwgXCJjb2xTcGFuXCI6IDQsIFwib25DbGlja1wiOiAoQGxvYWROZXh0KX0sIFwiTlxcdTAwZTR5dFxcdTAwZTQgc2V1cmFhdmF0IGt1dWthdWRldC4uLlwiKVxuICAgICAgICApXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgbnVsbFxuXG4gIGxvYWRQcmV2aW91czogLT5cbiAgICBbZmlyc3REYXRlXSA9IEBtb250aFJhbmdlcygpXG4gICAgQHNldFN0YXRlKGZpcnN0RGF0ZTogZmlyc3REYXRlLCBwcmV2aW91c1Zpc2libGU6IHRydWUpXG5cbiAgbG9hZE5leHQ6IC0+XG4gICAgWy4uLiwgbGFzdERhdGVdID0gQG1vbnRoUmFuZ2VzKClcbiAgICBAc2V0U3RhdGUobGFzdERhdGU6IGxhc3REYXRlLCBuZXh0VmlzaWJsZTogdHJ1ZSlcblxuICBncm91cGVkU2NoZWR1bGU6IC0+XG4gICAgXy5jaGFpbihAcHJvcHMuc2NoZWR1bGUpLmZpbHRlciAoZ2FtZSkgPT5cbiAgICAgIGdhbWVEYXRlID0gbW9tZW50KGdhbWUuZGF0ZSlcbiAgICAgIGdhbWVEYXRlID49IEBzdGF0ZS5maXJzdERhdGUgYW5kIGdhbWVEYXRlIDw9IEBzdGF0ZS5sYXN0RGF0ZVxuICAgIC5ncm91cEJ5IChnYW1lKSAtPlxuICAgICAgbW9tZW50KGdhbWUuZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTVwiKVxuXG4gIG1vbnRobHlHYW1lczogLT5cbiAgICBAZ3JvdXBlZFNjaGVkdWxlKCkubWFwIChnYW1lcywgbW9udGgpID0+XG4gICAgICBkYXRlc1dpdGhHYW1lcyA9IF8uY2hhaW4oZ2FtZXMpLmdyb3VwQnkgKGdhbWUpIC0+XG4gICAgICAgIG1vbWVudChnYW1lLmRhdGUpLmZvcm1hdChcIkRELk1NLllZWVlcIilcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiY29sU3BhblwiOiA0fSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKGRhdGVzV2l0aEdhbWVzLm1hcCAoZ2FtZXMsIGdhbWVEYXRlKSA9PlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjbGFzc05hbWVcIjogXCJnYW1lLWRhdGVcIiwgXCJjb2xTcGFuXCI6IDR9LCAoZ2FtZURhdGUpKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIChnYW1lcy5tYXAgKGdhbWUpID0+XG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKGdhbWUuaWQpfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGdhbWUudGltZSkpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoQGdhbWVMaW5rKGdhbWUpKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChnYW1lLmhvbWVTY29yZSksIFwiLVwiLCAoZ2FtZS5hd2F5U2NvcmUpKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGdhbWUuYXR0ZW5kYW5jZSkpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJzY2hlZHVsZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCBcIk90dGVsdW9oamVsbWFcIiksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgKEBzaG93UHJldmlvdXMoKSksXG4gICAgICAgIChAbW9udGhseUdhbWVzKCkpLFxuICAgICAgICAoQHNob3dOZXh0KCkpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UYWJsZVNvcnRNaXhpbiA9IHJlcXVpcmUgJy4vbWl4aW5zL3RhYmxlX3NvcnQnXG5UZWFtcyA9IHJlcXVpcmUgJy4uL2xpYi90ZWFtcydcblxuU3RhbmRpbmdzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBtaXhpbnM6IFtUYWJsZVNvcnRNaXhpbl1cblxuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgc29ydEZpZWxkOiBcInBvaW50c1wiXG4gICAgc29ydERpcmVjdGlvbjogXCJkZXNjXCJcbiAgICBzb3J0VHlwZTogXCJpbnRlZ2VyXCJcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBzdGFuZGluZ3MgPSBAcHJvcHMuc3RhbmRpbmdzLnNvcnQoQHNvcnQpLm1hcCAodGVhbSkgLT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKHRlYW0ubmFtZSl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0ucG9zaXRpb24pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7VGVhbXMubmFtZVRvSWQodGVhbS5uYW1lKX1cIn0sICh0ZWFtLm5hbWUpKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS5nYW1lcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0ud2lucykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0udGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHRlYW0ubG9zZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLmV4dHJhUG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS5wb2ludHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLmdvYWxzRm9yKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAodGVhbS5nb2Fsc0FnYWluc3QpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLnBvd2VycGxheVBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLnNob3J0aGFuZFBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsICh0ZWFtLnBvaW50c1BlckdhbWUpKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiU2FyamF0YXVsdWtrb1wiKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCB7XCJjbGFzc05hbWVcIjogXCJzb3J0YWJsZS10aGVhZFwiLCBcIm9uQ2xpY2tcIjogKEBzZXRTb3J0KX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnYW1lc1wifSwgXCJPXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwid2luc1wifSwgXCJWXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwidGllc1wifSwgXCJUXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwibG9zZXNcIn0sIFwiSFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImV4dHJhUG9pbnRzXCJ9LCBcIkxQXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicG9pbnRzXCJ9LCBcIlBcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0ZvclwifSwgXCJUTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcImdvYWxzQWdhaW5zdFwifSwgXCJQTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImRhdGEtc29ydFwiOiBcInBvd2VycGxheVBlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJZViVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJkYXRhLXNvcnRcIjogXCJzaG9ydGhhbmRQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiQVYlXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge1wiZGF0YS1zb3J0XCI6IFwicG9pbnRzUGVyR2FtZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIlBcXHgyRk9cIilcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLFxuICAgICAgICAgICAgKHN0YW5kaW5ncylcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRpbmdzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG57VGFiUGFuZSwgTmF2LCBOYXZJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuUGxheWVyU3RhdHMgPSByZXF1aXJlICcuL3BsYXllcl9zdGF0cydcbkdvYWxpZVN0YXRzID0gcmVxdWlyZSAnLi9nb2FsaWVfc3RhdHMnXG5cblN0YXRzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcIm1hYWxpdmFoZGl0XCIgdGhlbiBcImdvYWxpZXNcIlxuICAgICAgZWxzZSBcInBsYXllcnNcIlxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiVGlsYXN0b3RcIiksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3RpbGFzdG90XCIsIFwiZXZlbnRLZXlcIjogXCJwbGF5ZXJzXCJ9LCBcIktlbnR0XFx1MDBlNHBlbGFhamF0XCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi90aWxhc3RvdC9tYWFsaXZhaGRpdFwiLCBcImV2ZW50S2V5XCI6IFwiZ29hbGllc1wifSwgXCJNYWFsaXZhaGRpdFwiKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYi1jb250ZW50XCIsIFwicmVmXCI6IFwicGFuZXNcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJwbGF5ZXJzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJwbGF5ZXJzXCIpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIktlbnR0XFx1MDBlNHBlbGFhamF0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQbGF5ZXJTdGF0cywge1wic3RhdHNcIjogKEBwcm9wcy5zdGF0cy5zY29yaW5nU3RhdHMpfSlcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwiZ29hbGllc1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwiZ29hbGllc1wiKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwgbnVsbCwgXCJNYWFsaXZhaGRpdFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR29hbGllU3RhdHMsIHtcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMuZ29hbGllU3RhdHMpfSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblRlYW1TY2hlZHVsZSA9IHJlcXVpcmUgJy4vdGVhbV9zY2hlZHVsZSdcblRlYW1TdGF0cyA9IHJlcXVpcmUgJy4vdGVhbV9zdGF0cydcblRlYW1Sb3N0ZXIgPSByZXF1aXJlICcuL3RlYW1fcm9zdGVyJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG57VGFiUGFuZSwgSnVtYm90cm9uLCBCdXR0b25Ub29sYmFyLCBCdXR0b24sIENvbCwgUm93LCBOYXYsIE5hdkl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgbG9nbzogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtcInNyY1wiOiAoVGVhbXMubG9nbyhAcHJvcHMudGVhbS5pbmZvLm5hbWUpKSwgXCJhbHRcIjogKEBwcm9wcy50ZWFtLmluZm8ubmFtZSl9KVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcInBlbGFhamF0XCIgdGhlbiBcInBsYXllcnNcIlxuICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcInN0YXRzXCJcbiAgICAgIGVsc2UgXCJzY2hlZHVsZVwiXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRlYW1cIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSnVtYm90cm9uLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHtcInhzXCI6ICgxMiksIFwibWRcIjogKDYpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIChAbG9nbygpKSwgXCIgXCIsIChAcHJvcHMudGVhbS5pbmZvLm5hbWUpKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoMTIpLCBcIm1kXCI6ICg2KX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGVhbS1jb250YWluZXJcIn0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8ubG9uZ05hbWUpKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCAoQHByb3BzLnRlYW0uaW5mby5hZGRyZXNzKSksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8uZW1haWwpKVxuICAgICAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwge1wiYnNTdHlsZVwiOiBcInByaW1hcnlcIiwgXCJic1NpemVcIjogXCJsYXJnZVwiLCBcImhyZWZcIjogKEBwcm9wcy50ZWFtLmluZm8udGlja2V0c1VybCl9LCBcIkxpcHV0XCIpLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtcImJzU3R5bGVcIjogXCJwcmltYXJ5XCIsIFwiYnNTaXplXCI6IFwibGFyZ2VcIiwgXCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLmxvY2F0aW9uVXJsKX0sIFwiSGFsbGluIHNpamFpbnRpXCIpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwge1wiYnNTdHlsZVwiOiBcInRhYnNcIiwgXCJhY3RpdmVLZXlcIjogKGFjdGl2ZUtleSksIFwicmVmXCI6IFwidGFic1wifSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMuaWR9XCIsIFwiZXZlbnRLZXlcIjogXCJzY2hlZHVsZVwifSwgXCJPdHRlbHV0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy5pZH0vdGlsYXN0b3RcIiwgXCJldmVudEtleVwiOiBcInN0YXRzXCJ9LCBcIlRpbGFzdG90XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy5pZH0vcGVsYWFqYXRcIiwgXCJldmVudEtleVwiOiBcInBsYXllcnNcIn0sIFwiUGVsYWFqYXRcIilcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFiLWNvbnRlbnRcIiwgXCJyZWZcIjogXCJwYW5lc1wifSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic2NoZWR1bGVcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInNjaGVkdWxlXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtU2NoZWR1bGUsIHtcInRlYW1cIjogKEBwcm9wcy50ZWFtKX0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJzdGF0c1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwic3RhdHNcIil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgXCJUaWxhc3RvdFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtU3RhdHMsIHtcInRlYW1JZFwiOiAoQHByb3BzLmlkKSwgXCJzdGF0c1wiOiAoQHByb3BzLnRlYW0uc3RhdHMpfSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInBsYXllcnNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInBsYXllcnNcIil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgXCJQZWxhYWphdFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtUm9zdGVyLCB7XCJ0ZWFtSWRcIjogKEBwcm9wcy5pZCksIFwicm9zdGVyXCI6IChAcHJvcHMudGVhbS5yb3N0ZXIpfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcblxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5UZWFtUm9zdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBncm91cGVkUm9zdGVyOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnJvc3RlcilcbiAgICAuZ3JvdXBCeSgocGxheWVyKSAtPiBwbGF5ZXIucG9zaXRpb24pXG4gICAgLnJlZHVjZSgocmVzdWx0LCBwbGF5ZXIsIHBvc2l0aW9uKSAtPlxuICAgICAgZ3JvdXAgPSBzd2l0Y2hcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiS0hcIiwgXCJPTFwiLCBcIlZMXCJdLCBwb3NpdGlvbikgdGhlbiBcIkh5w7Zra8Okw6Rqw6R0XCJcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiT1BcIiwgXCJWUFwiXSwgcG9zaXRpb24pIHRoZW4gXCJQdW9sdXN0YWphdFwiXG4gICAgICAgIHdoZW4gcG9zaXRpb24gaXMgXCJNVlwiIHRoZW4gXCJNYWFsaXZhaGRpdFwiXG4gICAgICByZXN1bHRbZ3JvdXBdIHx8PSBbXVxuICAgICAgcmVzdWx0W2dyb3VwXS5wdXNoIHBsYXllclxuICAgICAgcmVzdWx0XG4gICAgLCB7fSlcblxuICByZW5kZXI6IC0+XG4gICAgZ3JvdXBzID0gQGdyb3VwZWRSb3N0ZXIoKS5tYXAgKHBsYXllcnMsIGdyb3VwKSA9PlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIHtcImtleVwiOiAoZ3JvdXApfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtcImNvbFNwYW5cIjogNn0sIChncm91cCkpXG4gICAgICAgICksXG4gICAgICAgIChfLmNoYWluKHBsYXllcnMpLmZsYXR0ZW4oKS5tYXAgKHBsYXllcikgPT5cbiAgICAgICAgICB1cmwgPSBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbUlkfS8je3BsYXllci5pZH1cIlxuICAgICAgICAgIHRpdGxlID0gXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1wiaHJlZlwiOiAodXJsKX0sICh0aXRsZSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIChwbGF5ZXIubnVtYmVyKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuaGVpZ2h0KSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci53ZWlnaHQpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLnNob290cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChtb21lbnQoKS5kaWZmKHBsYXllci5iaXJ0aGRheSwgXCJ5ZWFyc1wiKSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJOaW1pXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTnVtZXJvXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUGl0dXVzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUGFpbm9cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJLXFx1MDBlNHRpc3l5c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIklrXFx1MDBlNFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKGdyb3VwcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVJvc3RlciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5UZWFtU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGdhbWVMaW5rOiAoZ2FtZSkgLT5cbiAgICBpZiBtb21lbnQoZ2FtZS5kYXRlKSA8IG1vbWVudCgpXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJocmVmXCI6IFwiL290dGVsdXQvI3tnYW1lLmlkfVwifSwgKEB0aXRsZVN0eWxlKGdhbWUuaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUoZ2FtZS5hd2F5KSkpXG4gICAgZWxzZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgKEB0aXRsZVN0eWxlKGdhbWUuaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUoZ2FtZS5hd2F5KSkpXG5cbiAgdGl0bGVTdHlsZTogKG5hbWUpIC0+XG4gICAgaWYgQHByb3BzLnRlYW0uaW5mby5uYW1lIGlzIG5hbWVcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgKG5hbWUpKVxuICAgIGVsc2VcbiAgICAgIG5hbWVcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtcInNyY1wiOiAoVGVhbXMubG9nbyhuYW1lKSksIFwiYWx0XCI6IChuYW1lKX0pXG5cbiAgZ3JvdXBlZFNjaGVkdWxlOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnRlYW0uc2NoZWR1bGUpLmdyb3VwQnkgKGdhbWUpIC0+XG4gICAgICBtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgcmVuZGVyOiAtPlxuICAgIG1vbnRobHlHYW1lcyA9IEBncm91cGVkU2NoZWR1bGUoKS5tYXAgKGdhbWVzLCBtb250aCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCB7XCJrZXlcIjogKG1vbnRoKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XCJjb2xTcGFuXCI6IDR9LCAobW9tZW50KG1vbnRoLCBcIllZWVktTU1cIikuZm9ybWF0KFwiTU1NTVwiKSkpXG4gICAgICAgICksXG4gICAgICAgIChnYW1lcy5tYXAgKGdhbWUpID0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtcImtleVwiOiAoZ2FtZS5pZCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSwgXCIgXCIsIChnYW1lLnRpbWUpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAoQGdhbWVMaW5rKGdhbWUpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKGdhbWUuaG9tZVNjb3JlKSwgXCItXCIsIChnYW1lLmF3YXlTY29yZSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChnYW1lLmF0dGVuZGFuY2UpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJQXFx1MDBlNGl2XFx1MDBlNG1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiSm91a2t1ZWV0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiVHVsb3NcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJZbGVpc1xcdTAwZjZtXFx1MDBlNFxcdTAwZTRyXFx1MDBlNFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKG1vbnRobHlHYW1lcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblBsYXllclN0YXRzID0gcmVxdWlyZSAnLi9wbGF5ZXJfc3RhdHMnXG5Hb2FsaWVTdGF0cyA9IHJlcXVpcmUgJy4vZ29hbGllX3N0YXRzJ1xuXG5UZWFtU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBsYXllclN0YXRzLCB7XCJzdGF0c1wiOiAoQHByb3BzLnN0YXRzLnBsYXllcnMpfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdvYWxpZVN0YXRzLCB7XCJzdGF0c1wiOiAoQHByb3BzLnN0YXRzLmdvYWxpZXMpfSlcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRlYW1zTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwicm93XCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtcy12aWV3IGNvbC14cy0xMiBjb2wtc20tMTIgY29sLW1kLTEyIGNvbC1sZy0xMlwifSxcbiAgICAgICAgKFxuICAgICAgICAgIEBwcm9wcy50ZWFtcy5tYXAgKHRlYW0pIC0+XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7XCJrZXlcIjogKHRlYW0uaWQpLCBcImNsYXNzTmFtZVwiOiBcInRlYW0tbG9nbyAje3RlYW0uaWR9XCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmlkfVwifSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtc0xpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVG9wU2NvcmVycyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk5pbWlcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJPdHRlbHV0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiTWFhbGl0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiU3lcXHUwMGY2dFxcdTAwZjZ0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUGlzdGVldFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKEBwcm9wcy5zdGF0cy5zY29yaW5nU3RhdHMuZmlsdGVyIChwbGF5ZXIsIGluZGV4KSAtPlxuICAgICAgICAgIGluZGV4IDwgMjBcbiAgICAgICAgLm1hcCAocGxheWVyKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7cGxheWVyLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIChwbGF5ZXIuZ2FtZXMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCAocGxheWVyLmdvYWxzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5hc3Npc3RzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgKHBsYXllci5wb2ludHMpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUb3BTY29yZXJzIl19
