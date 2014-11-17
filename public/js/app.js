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
  return React.renderComponent(options.component, appContainer);
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
var IndexView, MatchView, PlayerView, Q, ScheduleView, StandingsView, StatsView, TeamView;

Q = require('q');

IndexView = require('./views/index');

TeamView = require('./views/team');

PlayerView = require('./views/player');

MatchView = require('./views/match');

ScheduleView = require('./views/schedule');

StandingsView = require('./views/standings');

StatsView = require('./views/stats');

module.exports = {
  "/": function() {
    return Q.spread([this.store.fetch("standings"), this.store.fetch("teams"), this.store.fetch("stats")], function(standings, teamsList, statsList) {
      return {
        title: "Etusivu",
        component: IndexView({
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
        component: TeamView({
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
        component: PlayerView({
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
        component: ScheduleView({
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
      var match;
      match = schedule.find(function(game) {
        return game.id === id;
      });
      return {
        title: "Ottelu - " + (match.get("home")) + " vs " + (match.get("away")),
        component: MatchView({
          id: id,
          game: match.toJSON(),
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
        component: StandingsView({
          standings: standings.toJSON()
        })
      };
    });
  },
  "/tilastot/:active?": function(active) {
    return this.store.fetch("stats").then(function(stats) {
      return {
        title: "Tilastot",
        component: StatsView({
          stats: stats.toJSON(),
          active: active
        })
      };
    });
  }
};



},{"./views/index":"/Users/hoppula/repos/liiga_frontend/views/index.coffee","./views/match":"/Users/hoppula/repos/liiga_frontend/views/match.coffee","./views/player":"/Users/hoppula/repos/liiga_frontend/views/player.coffee","./views/schedule":"/Users/hoppula/repos/liiga_frontend/views/schedule.coffee","./views/standings":"/Users/hoppula/repos/liiga_frontend/views/standings.coffee","./views/stats":"/Users/hoppula/repos/liiga_frontend/views/stats.coffee","./views/team":"/Users/hoppula/repos/liiga_frontend/views/team.coffee","q":"q"}],"/Users/hoppula/repos/liiga_frontend/stores.coffee":[function(require,module,exports){
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



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/views/index.coffee":[function(require,module,exports){
var Index, Navigation, React, TeamsListView, TopScorersView;

React = require('react/addons');

Navigation = require('./navigation');

TeamsListView = require('./teams_list');

TopScorersView = require('./top_scorers');

Index = React.createClass({
  render: function() {
    return React.createElement(React.DOM.div, null, React.createElement(Navigation, null), React.createElement(React.DOM.div, {
      "className": "jumbotron"
    }, React.createElement(React.DOM.h1, null, "Liiga.pw"), React.createElement(React.DOM.p, null, "Liigan tilastot nopeasti ja vaivattomasti")), React.createElement(TeamsListView, {
      "teams": this.props.teams
    }), React.createElement(TopScorersView, {
      "stats": this.props.stats
    }));
  }
});

module.exports = Index;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./teams_list":"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee","./top_scorers":"/Users/hoppula/repos/liiga_frontend/views/top_scorers.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/match.coffee":[function(require,module,exports){
var Col, Match, Nav, NavItem, Navigation, React, Row, TabPane, _ref;

React = require('react/addons');

Navigation = require('./navigation');

_ref = require('react-bootstrap'), Row = _ref.Row, Col = _ref.Col, Nav = _ref.Nav, NavItem = _ref.NavItem, TabPane = _ref.TabPane;

Match = React.createClass({
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  event: function(event) {
    if (event.header) {
      return React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
        "colSpan": "3"
      }, event.header));
    } else {
      return React.createElement(React.DOM.tr, null, React.createElement(React.DOM.td, null, this.props.game[event.team]), React.createElement(React.DOM.td, null, event.time), React.createElement(React.DOM.td, null, event.text));
    }
  },
  render: function() {
    var activeKey, events;
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
    console.log("events", this.props.events);
    console.log("lineups", this.props.lineUps);
    console.log("stats", this.props.stats);
    console.log("game", this.props.game);
    events = Object.keys(this.props.events).reduce((function(_this) {
      return function(arr, key) {
        arr.push({
          header: key
        });
        arr = arr.concat(_this.props.events[key]);
        return arr;
      };
    })(this), []);
    return React.createElement(React.DOM.div, null, React.createElement(Navigation, null), React.createElement(Row, null, React.createElement(Col, {
      "xs": 4.,
      "md": 4.
    }, React.createElement(React.DOM.h1, null, this.props.game.home)), React.createElement(Col, {
      "xs": 4.,
      "md": 4.
    }, React.createElement(React.DOM.h1, null, this.props.game.homeScore, " - ", this.props.game.awayScore), React.createElement(React.DOM.div, null, "Yleis\u00f6\u00e4: ", this.props.game.attendance)), React.createElement(Col, {
      "xs": 4.,
      "md": 4.
    }, React.createElement(React.DOM.h1, null, this.props.game.away))), React.createElement(Nav, {
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, React.createElement(NavItem, {
      "href": "/ottelut/" + this.props.id,
      "key": "events"
    }, "Tapahtumat"), React.createElement(NavItem, {
      "href": "/ottelut/" + this.props.id + "/tilastot",
      "key": "stats"
    }, "Tilastot"), React.createElement(NavItem, {
      "href": "/ottelut/" + this.props.id + "/ketjut",
      "key": "lineUps"
    }, "Ketjut")), React.createElement(React.DOM.div, {
      "className": "tab-content",
      "ref": "panes"
    }, React.createElement(TabPane, {
      "key": "events",
      "active": activeKey === "events"
    }, React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped"
    }, events.map((function(_this) {
      return function(event) {
        return _this.event(event);
      };
    })(this))))), React.createElement(TabPane, {
      "key": "stats",
      "active": activeKey === "stats"
    }, React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped"
    }, this.props.stats.home.players.map(function(player) {
      return React.createElement(React.DOM.tr, null, React.createElement(React.DOM.td, null, player.firstName, " ", player.lastName));
    }), this.props.stats.home.goalies.map(function(goalie) {
      return React.createElement(React.DOM.tr, null, React.createElement(React.DOM.td, null, goalie.firstName, " ", goalie.lastName));
    })), React.createElement(React.DOM.table, {
      "className": "table table-striped"
    }, this.props.stats.away.players.map(function(player) {
      return React.createElement(React.DOM.tr, null, React.createElement(React.DOM.td, null, player.firstName, " ", player.lastName));
    }), this.props.stats.away.goalies.map(function(goalie) {
      return React.createElement(React.DOM.tr, null, React.createElement(React.DOM.td, null, goalie.firstName, " ", goalie.lastName));
    })))), React.createElement(TabPane, {
      "key": "lineUps",
      "active": activeKey === "lineUps"
    }, React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped"
    })))));
  }
});

module.exports = Match;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee":[function(require,module,exports){
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
    brand = React.createElement(React.DOM.a, {
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
    return React.createElement(React.DOM.div, {
      "className": "player"
    }, React.createElement(Navigation, {
      "dropdown": players,
      "item": item
    }), React.createElement(React.DOM.h1, null, player.firstName, " ", player.lastName), React.createElement(React.DOM.h2, null, "#", player.number, " ", player.position), React.createElement(React.DOM.h3, null, React.createElement(React.DOM.a, {
      "className": "team-logo " + team.info.id,
      "href": "/joukkueet/" + team.info.id
    }), " ", team.info.name), React.createElement(React.DOM.div, null, moment(player.birthday).format("DD.MM.YYYY")), React.createElement(React.DOM.div, null, player.height, " cm"), React.createElement(React.DOM.div, null, player.weight, " kg"), React.createElement(React.DOM.div, null, player.shoots), React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table"
    }, React.createElement(React.DOM.thead, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, null, "O"), React.createElement(React.DOM.th, null, "M"), React.createElement(React.DOM.th, null, "S"), React.createElement(React.DOM.th, null, "P"), React.createElement(React.DOM.th, null, "R"), React.createElement(React.DOM.th, null, "+\x2F-"), React.createElement(React.DOM.th, null, "+"), React.createElement(React.DOM.th, null, "-"), React.createElement(React.DOM.th, null, "YVM"), React.createElement(React.DOM.th, null, "AVM"), React.createElement(React.DOM.th, null, "VM"), React.createElement(React.DOM.th, null, "L"), React.createElement(React.DOM.th, null, "L%"), React.createElement(React.DOM.th, null, "A"), React.createElement(React.DOM.th, null, "A%"), React.createElement(React.DOM.th, null, "Aika"))), React.createElement(React.DOM.tbody, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.td, null, stats.games), React.createElement(React.DOM.td, null, stats.goals), React.createElement(React.DOM.td, null, stats.assists), React.createElement(React.DOM.td, null, stats.points), React.createElement(React.DOM.td, null, stats.penalties), React.createElement(React.DOM.td, null, stats.plusMinus), React.createElement(React.DOM.td, null, stats.plusses), React.createElement(React.DOM.td, null, stats.minuses), React.createElement(React.DOM.td, null, stats.powerPlayGoals), React.createElement(React.DOM.td, null, stats.shortHandedGoals), React.createElement(React.DOM.td, null, stats.winningGoals), React.createElement(React.DOM.td, null, stats.shots), React.createElement(React.DOM.td, null, stats.shootingPercentage), React.createElement(React.DOM.td, null, stats.faceoffs), React.createElement(React.DOM.td, null, stats.faceoffPercentage), React.createElement(React.DOM.td, null, stats.playingTimeAverage))))));
  }
});

module.exports = Player;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee":[function(require,module,exports){
var PlayerStats, React;

React = require('react/addons');

PlayerStats = React.createClass({
  render: function() {
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped"
    }, React.createElement(React.DOM.thead, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, null, "Name"), React.createElement(React.DOM.th, null, "Games"), React.createElement(React.DOM.th, null, "Goals"), React.createElement(React.DOM.th, null, "Assists"), React.createElement(React.DOM.th, null, "Points"), React.createElement(React.DOM.th, null, "Penalties"), React.createElement(React.DOM.th, null, "+\x2F-"))), this.props.stats.map(function(player) {
      return React.createElement(React.DOM.tr, {
        "key": player.id
      }, React.createElement(React.DOM.td, null, React.createElement(React.DOM.a, {
        "href": "/joukkueet/" + player.teamId + "/" + player.id
      }, player.firstName, " \x3E", player.lastName)), React.createElement(React.DOM.td, null, player.games), React.createElement(React.DOM.td, null, player.goals), React.createElement(React.DOM.td, null, player.assists), React.createElement(React.DOM.td, null, player.points), React.createElement(React.DOM.td, null, player.penalties), React.createElement(React.DOM.td, null, player.plusMinus));
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
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  matchLink: function(match) {
    if (moment(match.date) < moment()) {
      return React.createElement(React.DOM.a, {
        "href": "/ottelut/" + match.id
      }, match.home, " - ", match.away);
    } else {
      return React.createElement(React.DOM.span, null, match.home, " - ", match.away);
    }
  },
  groupedSchedule: function() {
    return _.chain(this.props.schedule).groupBy(function(match) {
      return moment(match.date).format("YYYY-MM");
    });
  },
  render: function() {
    var monthlyMatches;
    monthlyMatches = this.groupedSchedule().map((function(_this) {
      return function(matches, month) {
        return React.createElement(React.DOM.tbody, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM"))), matches.map(function(match) {
          return React.createElement(React.DOM.tr, {
            "key": match.id
          }, React.createElement(React.DOM.td, null, moment(match.date).format("DD.MM.YYYY"), " ", match.time), React.createElement(React.DOM.td, null, _this.matchLink(match)), React.createElement(React.DOM.td, null, match.homeScore, "-", match.awayScore), React.createElement(React.DOM.td, null, match.attendance));
        }));
      };
    })(this));
    return React.createElement(React.DOM.div, null, React.createElement(Navigation, null), React.createElement(React.DOM.h1, null, "Otteluohjelma"), React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped team-schedule"
    }, monthlyMatches)));
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
      return React.createElement(React.DOM.tr, {
        "key": team.name
      }, React.createElement(React.DOM.td, null, team.position), React.createElement(React.DOM.td, null, React.createElement(React.DOM.a, {
        "href": "/joukkueet/" + (Teams.nameToId(team.name))
      }, team.name)), React.createElement(React.DOM.td, null, team.games), React.createElement(React.DOM.td, null, team.wins), React.createElement(React.DOM.td, null, team.ties), React.createElement(React.DOM.td, null, team.loses), React.createElement(React.DOM.td, null, team.extraPoints), React.createElement(React.DOM.td, null, team.points), React.createElement(React.DOM.td, null, team.goalsFor), React.createElement(React.DOM.td, null, team.goalsAgainst), React.createElement(React.DOM.td, null, team.powerplayPercentage), React.createElement(React.DOM.td, null, team.shorthandPercentage), React.createElement(React.DOM.td, null, team.pointsPerGame));
    });
    return React.createElement(React.DOM.div, null, React.createElement(Navigation, null), React.createElement(React.DOM.h1, null, "Sarjataulukko"), React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped team-schedule"
    }, React.createElement(React.DOM.thead, {
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, null), React.createElement(React.DOM.th, null), React.createElement(React.DOM.th, {
      "data-sort": "games"
    }, "O"), React.createElement(React.DOM.th, {
      "data-sort": "wins"
    }, "V"), React.createElement(React.DOM.th, {
      "data-sort": "ties"
    }, "T"), React.createElement(React.DOM.th, {
      "data-sort": "loses"
    }, "H"), React.createElement(React.DOM.th, {
      "data-sort": "extraPoints"
    }, "LP"), React.createElement(React.DOM.th, {
      "data-sort": "points"
    }, "P"), React.createElement(React.DOM.th, {
      "data-sort": "goalsFor"
    }, "TM"), React.createElement(React.DOM.th, {
      "data-sort": "goalsAgainst"
    }, "PM"), React.createElement(React.DOM.th, {
      "data-sort": "powerplayPercentage",
      "data-type": "float"
    }, "YV%"), React.createElement(React.DOM.th, {
      "data-sort": "shorthandPercentage",
      "data-type": "float"
    }, "AV%"), React.createElement(React.DOM.th, {
      "data-sort": "pointsPerGame",
      "data-type": "float"
    }, "P\x2FO"))), React.createElement(React.DOM.tbody, null, standings))));
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
    return React.createElement(React.DOM.div, null, React.createElement(Navigation, null), React.createElement(React.DOM.h1, null, "Tilastot"), React.createElement(React.DOM.div, null, React.createElement(Nav, {
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, React.createElement(NavItem, {
      "href": "/tilastot",
      "key": "players"
    }, "Kentt\u00e4pelaajat"), React.createElement(NavItem, {
      "href": "/tilastot/maalivahdit",
      "key": "goalies"
    }, "Maalivahdit")), React.createElement(React.DOM.div, {
      "className": "tab-content",
      "ref": "panes"
    }, React.createElement(TabPane, {
      "key": "players",
      "active": activeKey === "players"
    }, React.createElement(React.DOM.h2, null, "Kentt\u00e4pelaajat")), React.createElement(TabPane, {
      "key": "goalies",
      "active": activeKey === "goalies"
    }, React.createElement(React.DOM.h2, null, "Maalivahdit")))));
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
    return React.createElement(React.DOM.img, {
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
    return React.createElement(React.DOM.div, null, React.createElement(Navigation, null), React.createElement(React.DOM.div, {
      "className": "team"
    }, React.createElement(Jumbotron, null, React.createElement(Row, null, React.createElement(Col, {
      "xs": 12.,
      "md": 6.
    }, React.createElement(React.DOM.h1, null, this.logo(), " ", this.props.team.info.name)), React.createElement(Col, {
      "xs": 12.,
      "md": 6.
    }, React.createElement(React.DOM.div, {
      "className": "team-container"
    }, React.createElement(React.DOM.ul, null, React.createElement(React.DOM.li, null, this.props.team.info.longName), React.createElement(React.DOM.li, null, this.props.team.info.address), React.createElement(React.DOM.li, null, this.props.team.info.email)), React.createElement(ButtonToolbar, null, React.createElement(Button, {
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.ticketsUrl
    }, "Liput"), React.createElement(Button, {
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.locationUrl
    }, "Hallin sijainti")))))), React.createElement(React.DOM.div, null, React.createElement(Nav, {
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, React.createElement(NavItem, {
      "href": "/joukkueet/" + this.props.id,
      "key": "schedule"
    }, "Ottelut"), React.createElement(NavItem, {
      "href": "/joukkueet/" + this.props.id + "/tilastot",
      "key": "stats"
    }, "Tilastot"), React.createElement(NavItem, {
      "href": "/joukkueet/" + this.props.id + "/pelaajat",
      "key": "players"
    }, "Pelaajat")), React.createElement(React.DOM.div, {
      "className": "tab-content",
      "ref": "panes"
    }, React.createElement(TabPane, {
      "key": "schedule",
      "active": activeKey === "schedule"
    }, React.createElement(React.DOM.h1, null, "Ottelut"), React.createElement(TeamSchedule, {
      "team": this.props.team
    })), React.createElement(TabPane, {
      "key": "stats",
      "active": activeKey === "stats"
    }, React.createElement(React.DOM.h1, null, "Tilastot"), React.createElement(TeamStats, {
      "teamId": this.props.id,
      "stats": this.props.team.stats
    })), React.createElement(TabPane, {
      "key": "players",
      "active": activeKey === "players"
    }, React.createElement(React.DOM.h1, null, "Pelaajat"), React.createElement(TeamRoster, {
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
        return React.createElement(React.DOM.tbody, {
          "key": group
        }, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
          "colSpan": 6
        }, group)), _.chain(players).flatten().map(function(player) {
          var title, url;
          url = "/joukkueet/" + _this.props.teamId + "/" + player.id;
          title = "" + player.firstName + " " + player.lastName;
          return React.createElement(React.DOM.tr, {
            "key": player.id
          }, React.createElement(React.DOM.td, null, React.createElement(React.DOM.a, {
            "href": url
          }, title)), React.createElement(React.DOM.td, null, React.createElement(React.DOM.strong, null, player.number)), React.createElement(React.DOM.td, null, player.height), React.createElement(React.DOM.td, null, player.weight), React.createElement(React.DOM.td, null, player.shoots), React.createElement(React.DOM.td, null, moment().diff(player.birthday, "years")));
        }));
      };
    })(this));
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped team-roster"
    }, React.createElement(React.DOM.thead, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, null, "Nimi"), React.createElement(React.DOM.th, null, "Numero"), React.createElement(React.DOM.th, null, "Pituus"), React.createElement(React.DOM.th, null, "Paino"), React.createElement(React.DOM.th, null, "K\u00e4tisyys"), React.createElement(React.DOM.th, null, "Ik\u00e4"))), groups));
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
  matchLink: function(match) {
    if (moment(match.date) < moment()) {
      return React.createElement(React.DOM.a, {
        "href": "/ottelut/" + match.id
      }, this.titleStyle(match.home), " - ", this.titleStyle(match.away));
    } else {
      return React.createElement(React.DOM.span, null, this.titleStyle(match.home), " - ", this.titleStyle(match.away));
    }
  },
  titleStyle: function(name) {
    if (this.props.team.info.name === name) {
      return React.createElement(React.DOM.strong, null, name);
    } else {
      return name;
    }
  },
  logo: function(name) {
    return React.createElement(React.DOM.img, {
      "src": Teams.logo(name),
      "alt": name
    });
  },
  groupedSchedule: function() {
    return _.chain(this.props.team.schedule).groupBy(function(match) {
      return moment(match.date).format("YYYY-MM");
    });
  },
  render: function() {
    var monthlyMatches;
    monthlyMatches = this.groupedSchedule().map((function(_this) {
      return function(matches, month) {
        return React.createElement(React.DOM.tbody, {
          "key": month
        }, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM"))), matches.map(function(match) {
          return React.createElement(React.DOM.tr, {
            "key": match.id
          }, React.createElement(React.DOM.td, null, moment(match.date).format("DD.MM.YYYY"), " ", match.time), React.createElement(React.DOM.td, null, _this.matchLink(match)), React.createElement(React.DOM.td, null, match.homeScore, "-", match.awayScore), React.createElement(React.DOM.td, null, match.attendance));
        }));
      };
    })(this));
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped team-schedule"
    }, React.createElement(React.DOM.thead, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, null, "P\u00e4iv\u00e4m\u00e4\u00e4r\u00e4"), React.createElement(React.DOM.th, null, "Joukkueet"), React.createElement(React.DOM.th, null, "Tulos"), React.createElement(React.DOM.th, null, "Yleis\u00f6m\u00e4\u00e4r\u00e4"))), monthlyMatches));
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
        return React.createElement(React.DOM.tr, {
          "key": player.id
        }, React.createElement(React.DOM.td, null, React.createElement(React.DOM.a, {
          "href": "/joukkueet/" + _this.props.teamId + "/" + player.id
        }, player.firstName, " ", player.lastName)), React.createElement(React.DOM.td, null, player.games), React.createElement(React.DOM.td, null, player.goals), React.createElement(React.DOM.td, null, player.assists), React.createElement(React.DOM.td, null, player.points), React.createElement(React.DOM.td, null, player.penalties), React.createElement(React.DOM.td, null, player.plusMinus), React.createElement(React.DOM.td, null, player.plusses), React.createElement(React.DOM.td, null, player.minuses), React.createElement(React.DOM.td, null, player.powerPlayGoals), React.createElement(React.DOM.td, null, player.shortHandedGoals), React.createElement(React.DOM.td, null, player.winningGoals), React.createElement(React.DOM.td, null, player.shots), React.createElement(React.DOM.td, null, player.shootingPercentage), React.createElement(React.DOM.td, null, player.faceoffs), React.createElement(React.DOM.td, null, player.faceoffPercentage), React.createElement(React.DOM.td, null, player.playingTimeAverage));
      };
    })(this));
    goalies = this.props.stats.goalies.map((function(_this) {
      return function(player) {
        return React.createElement(React.DOM.tr, {
          "key": player.id
        }, React.createElement(React.DOM.td, null, player.firstName, " ", player.lastName), React.createElement(React.DOM.td, null, player.games), React.createElement(React.DOM.td, null, player.wins), React.createElement(React.DOM.td, null, player.ties), React.createElement(React.DOM.td, null, player.losses), React.createElement(React.DOM.td, null, player.saves), React.createElement(React.DOM.td, null, player.goalsAllowed), React.createElement(React.DOM.td, null, player.shutouts), React.createElement(React.DOM.td, null, player.goalsAverage), React.createElement(React.DOM.td, null, player.savingPercentage), React.createElement(React.DOM.td, null, player.goals), React.createElement(React.DOM.td, null, player.assists), React.createElement(React.DOM.td, null, player.points), React.createElement(React.DOM.td, null, player.penalties), React.createElement(React.DOM.td, null, player.winPercentage), React.createElement(React.DOM.td, {
          "colSpan": 2
        }, player.minutes));
      };
    })(this));
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped team-roster"
    }, React.createElement(React.DOM.thead, {
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
      "colSpan": 17
    }, "Pelaajat")), React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
      "data-sort": "lastName",
      "data-type": "string"
    }, "Nimi"), React.createElement(React.DOM.th, {
      "data-sort": "games"
    }, "O"), React.createElement(React.DOM.th, {
      "data-sort": "goals"
    }, "M"), React.createElement(React.DOM.th, {
      "data-sort": "assists"
    }, "S"), React.createElement(React.DOM.th, {
      "data-sort": "points"
    }, "P"), React.createElement(React.DOM.th, {
      "data-sort": "penalties"
    }, "R"), React.createElement(React.DOM.th, {
      "data-sort": "plusMinus"
    }, "+\x2F-"), React.createElement(React.DOM.th, {
      "data-sort": "plusses"
    }, "+"), React.createElement(React.DOM.th, {
      "data-sort": "minuses"
    }, "-"), React.createElement(React.DOM.th, {
      "data-sort": "powerPlayGoals"
    }, "YVM"), React.createElement(React.DOM.th, {
      "data-sort": "shortHandedGoals"
    }, "AVM"), React.createElement(React.DOM.th, {
      "data-sort": "winningGoals"
    }, "VM"), React.createElement(React.DOM.th, {
      "data-sort": "shots"
    }, "L"), React.createElement(React.DOM.th, {
      "data-sort": "shootingPercentage",
      "data-type": "float"
    }, "L%"), React.createElement(React.DOM.th, {
      "data-sort": "faceoffs"
    }, "A"), React.createElement(React.DOM.th, {
      "data-sort": "faceoffPercentage",
      "data-type": "float"
    }, "A%"), React.createElement(React.DOM.th, {
      "data-sort": "playingTimeAverage",
      "data-type": "float"
    }, "Aika"))), React.createElement(React.DOM.tbody, null, players), React.createElement(React.DOM.thead, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
      "colSpan": 17
    }, "Maalivahdit")), React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, null, "Nimi"), React.createElement(React.DOM.th, null, "PO"), React.createElement(React.DOM.th, null, "V"), React.createElement(React.DOM.th, null, "T"), React.createElement(React.DOM.th, null, "H"), React.createElement(React.DOM.th, null, "TO"), React.createElement(React.DOM.th, null, "PM"), React.createElement(React.DOM.th, null, "NP"), React.createElement(React.DOM.th, null, "KA"), React.createElement(React.DOM.th, null, "T%"), React.createElement(React.DOM.th, null, "M"), React.createElement(React.DOM.th, null, "S"), React.createElement(React.DOM.th, null, "P"), React.createElement(React.DOM.th, null, "R"), React.createElement(React.DOM.th, null, "V%"), React.createElement(React.DOM.th, {
      "colSpan": 2
    }, "Aika"))), React.createElement(React.DOM.tbody, null, goalies)));
  }
});

module.exports = TeamStats;



},{"./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","lodash":"lodash","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee":[function(require,module,exports){
var React, TeamsList;

React = require('react/addons');

TeamsList = React.createClass({
  render: function() {
    return React.createElement(React.DOM.div, {
      "className": "row"
    }, React.createElement(React.DOM.div, {
      "className": "teams-view col-xs-12 col-sm-12 col-md-12 col-lg-12"
    }, this.props.teams.map(function(team) {
      return React.createElement(React.DOM.a, {
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
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped"
    }, React.createElement(React.DOM.thead, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, null, "Nimi"), React.createElement(React.DOM.th, null, "Ottelut"), React.createElement(React.DOM.th, null, "Maalit"), React.createElement(React.DOM.th, null, "Sy\u00f6t\u00f6t"), React.createElement(React.DOM.th, null, "Pisteet"))), this.props.stats.scoringStats.filter(function(player, index) {
      return index < 20;
    }).map(function(player) {
      return React.createElement(React.DOM.tr, {
        "key": player.id
      }, React.createElement(React.DOM.td, null, React.createElement(React.DOM.a, {
        "href": "/joukkueet/" + player.teamId + "/" + player.id
      }, player.firstName, " ", player.lastName)), React.createElement(React.DOM.td, null, player.games), React.createElement(React.DOM.td, null, player.goals), React.createElement(React.DOM.td, null, player.assists), React.createElement(React.DOM.td, null, player.points));
    })));
  }
});

module.exports = TopScorers;



},{"react/addons":"react/addons"}]},{},["/Users/hoppula/repos/liiga_frontend/client.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY2xpZW50LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2NvbmZpZy9hcGktYnJvd3Nlci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9saWIvdGVhbXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3RjbGljay9saWIvZmFzdGNsaWNrLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvb3B0aW9ucy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9yb3V0ZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvZ2FtZV9saW5ldXBzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvaW5kZXguY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvbWF0Y2guY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvbWl4aW5zL3RhYmxlX3NvcnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvbmF2aWdhdGlvbi5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvcGxheWVyX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3NjaGVkdWxlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3N0YW5kaW5ncy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1fcm9zdGVyLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1fc2NoZWR1bGUuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtc19saXN0LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RvcF9zY29yZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsd0RBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBQVIsQ0FBQTs7QUFBQSxVQUNBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FEYixDQUFBOztBQUFBLFNBRUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQUZaLENBQUE7O0FBQUEsT0FHQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQSxZQUtBLEdBQWUsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsT0FBTyxDQUFDLEtBQWhDLENBTGYsQ0FBQTs7QUFBQSxPQU9PLENBQUMsTUFBUixHQUFpQixTQUFDLE9BQUQsR0FBQTs7SUFBQyxVQUFRO0dBQ3hCO0FBQUEsRUFBQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsT0FBOUIsQ0FBdUMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUExQyxHQUF1RCxhQUFBLEdBQWEsT0FBTyxDQUFDLEtBQTVFLENBQUE7U0FDQSxLQUFLLENBQUMsZUFBTixDQUFzQixPQUFPLENBQUMsU0FBOUIsRUFBeUMsWUFBekMsRUFGZTtBQUFBLENBUGpCLENBQUE7O0FBQUEsT0FXTyxDQUFDLFVBQVIsR0FBcUIsU0FBQyxNQUFELEdBQUE7U0FDbkIsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsUUFBUSxDQUFDLElBQTFCLEVBRG1CO0FBQUEsQ0FYckIsQ0FBQTs7QUFBQSxHQWVBLEdBQU0sVUFBVSxDQUFDLE1BQVgsQ0FBa0IsT0FBbEIsQ0FmTixDQUFBOzs7OztBQ0FBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLEdBQUEsRUFBSyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUF6QixDQUFpQyxNQUFqQyxFQUF3QyxNQUF4QyxDQUFMO0NBREYsQ0FBQTs7Ozs7QUNBQSxJQUFBLEtBQUE7O0FBQUEsS0FBQSxHQUNFO0FBQUEsRUFBQSxXQUFBLEVBQ0U7QUFBQSxJQUFBLE9BQUEsRUFBUyxPQUFUO0FBQUEsSUFDQSxPQUFBLEVBQVMsT0FEVDtBQUFBLElBRUEsTUFBQSxFQUFRLE1BRlI7QUFBQSxJQUdBLEtBQUEsRUFBTyxLQUhQO0FBQUEsSUFJQSxPQUFBLEVBQVMsT0FKVDtBQUFBLElBS0EsT0FBQSxFQUFTLE9BTFQ7QUFBQSxJQU1BLEtBQUEsRUFBTyxLQU5QO0FBQUEsSUFPQSxPQUFBLEVBQVMsT0FQVDtBQUFBLElBUUEsUUFBQSxFQUFVLFFBUlY7QUFBQSxJQVNBLE9BQUEsRUFBUyxPQVRUO0FBQUEsSUFVQSxVQUFBLEVBQVksVUFWWjtBQUFBLElBV0EsT0FBQSxFQUFTLE9BWFQ7QUFBQSxJQVlBLFNBQUEsRUFBVyxTQVpYO0FBQUEsSUFhQSxLQUFBLEVBQU8sS0FiUDtHQURGO0FBQUEsRUFnQkEsSUFBQSxFQUFNLFNBQUMsSUFBRCxHQUFBO1dBQ0gsT0FBQSxHQUFPLElBQUMsQ0FBQSxXQUFZLENBQUEsSUFBQSxDQUFwQixHQUEwQixPQUR2QjtFQUFBLENBaEJOO0FBQUEsRUFtQkEsUUFBQSxFQUFVLFNBQUMsRUFBRCxHQUFBO0FBQ1IsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFDLENBQUEsV0FBYixDQUF5QixDQUFDLE1BQTFCLENBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLEdBQUQsRUFBTSxJQUFOLEdBQUE7QUFDckMsUUFBQSxHQUFJLENBQUEsS0FBQyxDQUFBLFdBQVksQ0FBQSxJQUFBLENBQWIsQ0FBSixHQUEwQixJQUExQixDQUFBO2VBQ0EsSUFGcUM7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQUdKLEVBSEksQ0FBTixDQUFBO1dBSUEsR0FBSSxDQUFBLEVBQUEsRUFMSTtFQUFBLENBbkJWO0FBQUEsRUEwQkEsUUFBQSxFQUFVLFNBQUMsSUFBRCxHQUFBO1dBQ1IsSUFBQyxDQUFBLFdBQVksQ0FBQSxJQUFBLEVBREw7RUFBQSxDQTFCVjtDQURGLENBQUE7O0FBQUEsTUE4Qk0sQ0FBQyxPQUFQLEdBQWlCLEtBOUJqQixDQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsR0FBeEMsQ0FMRixFQU1FLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsUUFBeEMsQ0FORixFQU9FLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsR0FBeEMsQ0FQRixFQVFFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsR0FBeEMsQ0FSRixFQVNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsS0FBeEMsQ0FURixFQVVFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsS0FBeEMsQ0FWRixFQVdFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsQ0FYRixFQVlFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsR0FBeEMsQ0FaRixFQWFFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsQ0FiRixFQWNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsR0FBeEMsQ0FkRixFQWVFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsQ0FmRixFQWdCRSxLQUFLLENBQUMsYUFBTixDQUFv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QTlCLEVBQWtDLElBQWxDLEVBQXdDLEdBQXhDLENBTEYsRUFNRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLENBTkYsRUFPRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLENBUEYsRUFRRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLENBUkYsRUFTRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLENBVEYsRUFVRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLENBVkYsRUFXRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLEdBQXhDLENBWEYsRUFZRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLEdBQXhDLENBWkYsRUFhRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLEdBQXhDLENBYkYsRUFjRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLEdBQXhDLENBZEYsRUFlRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLENBZkYsRUFnQkUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFr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QmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5jZXJlYmVsbHVtID0gcmVxdWlyZSAnY2VyZWJlbGx1bSdcbkZhc3RDbGljayA9IHJlcXVpcmUgJ2Zhc3RjbGljaydcbm9wdGlvbnMgPSByZXF1aXJlICcuL29wdGlvbnMnXG5cbmFwcENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuYXBwSWQpXG5cbm9wdGlvbnMucmVuZGVyID0gKG9wdGlvbnM9e30pIC0+XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gXCJMaWlnYS5wdyAtICN7b3B0aW9ucy50aXRsZX1cIlxuICBSZWFjdC5yZW5kZXJDb21wb25lbnQob3B0aW9ucy5jb21wb25lbnQsIGFwcENvbnRhaW5lcilcblxub3B0aW9ucy5pbml0aWFsaXplID0gKGNsaWVudCkgLT5cbiAgRmFzdENsaWNrLmF0dGFjaChkb2N1bWVudC5ib2R5KVxuICAjUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpXG5cbmFwcCA9IGNlcmViZWxsdW0uY2xpZW50KG9wdGlvbnMpIiwibW9kdWxlLmV4cG9ydHMgPVxuICB1cmw6IGRvY3VtZW50LmxvY2F0aW9uLm9yaWdpbi5yZXBsYWNlKFwiNDAwMFwiLFwiODA4MFwiKVxuICAjdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiIiwiVGVhbXMgPVxuICBuYW1lc0FuZElkczpcbiAgICBcIsOEc3PDpHRcIjogXCJhc3NhdFwiXG4gICAgXCJCbHVlc1wiOiBcImJsdWVzXCJcbiAgICBcIkhJRktcIjogXCJoaWZrXCJcbiAgICBcIkhQS1wiOiBcImhwa1wiXG4gICAgXCJJbHZlc1wiOiBcImlsdmVzXCJcbiAgICBcIlNwb3J0XCI6IFwic3BvcnRcIlxuICAgIFwiSllQXCI6IFwianlwXCJcbiAgICBcIkthbFBhXCI6IFwia2FscGFcIlxuICAgIFwiS8OkcnDDpHRcIjogXCJrYXJwYXRcIlxuICAgIFwiTHVra29cIjogXCJsdWtrb1wiXG4gICAgXCJQZWxpY2Fuc1wiOiBcInBlbGljYW5zXCJcbiAgICBcIlNhaVBhXCI6IFwic2FpcGFcIlxuICAgIFwiVGFwcGFyYVwiOiBcInRhcHBhcmFcIlxuICAgIFwiVFBTXCI6IFwidHBzXCJcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBcIi9zdmcvI3tAbmFtZXNBbmRJZHNbbmFtZV19LnN2Z1wiXG5cbiAgaWRUb05hbWU6IChpZCkgLT5cbiAgICBpZHMgPSBPYmplY3Qua2V5cyhAbmFtZXNBbmRJZHMpLnJlZHVjZSAob2JqLCBuYW1lKSA9PlxuICAgICAgb2JqW0BuYW1lc0FuZElkc1tuYW1lXV0gPSBuYW1lXG4gICAgICBvYmpcbiAgICAsIHt9XG4gICAgaWRzW2lkXVxuXG4gIG5hbWVUb0lkOiAobmFtZSkgLT5cbiAgICBAbmFtZXNBbmRJZHNbbmFtZV1cblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIi8qKlxuICogQHByZXNlcnZlIEZhc3RDbGljazogcG9seWZpbGwgdG8gcmVtb3ZlIGNsaWNrIGRlbGF5cyBvbiBicm93c2VycyB3aXRoIHRvdWNoIFVJcy5cbiAqXG4gKiBAdmVyc2lvbiAxLjAuM1xuICogQGNvZGluZ3N0YW5kYXJkIGZ0bGFicy1qc3YyXG4gKiBAY29weXJpZ2h0IFRoZSBGaW5hbmNpYWwgVGltZXMgTGltaXRlZCBbQWxsIFJpZ2h0cyBSZXNlcnZlZF1cbiAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlIChzZWUgTElDRU5TRS50eHQpXG4gKi9cblxuLypqc2xpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuLypnbG9iYWwgZGVmaW5lLCBFdmVudCwgTm9kZSovXG5cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBmYXN0LWNsaWNraW5nIGxpc3RlbmVycyBvbiB0aGUgc3BlY2lmaWVkIGxheWVyLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuZnVuY3Rpb24gRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG9sZE9uQ2xpY2s7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgYSBjbGljayBpcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlZC5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cblxuXHQvKipcblx0ICogVGltZXN0YW1wIGZvciB3aGVuIGNsaWNrIHRyYWNraW5nIHN0YXJ0ZWQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSAwO1xuXG5cblx0LyoqXG5cdCAqIFRoZSBlbGVtZW50IGJlaW5nIHRyYWNrZWQgZm9yIGEgY2xpY2suXG5cdCAqXG5cdCAqIEB0eXBlIEV2ZW50VGFyZ2V0XG5cdCAqL1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXG5cblx0LyoqXG5cdCAqIFgtY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRvdWNoU3RhcnRYID0gMDtcblxuXG5cdC8qKlxuXHQgKiBZLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50b3VjaFN0YXJ0WSA9IDA7XG5cblxuXHQvKipcblx0ICogSUQgb2YgdGhlIGxhc3QgdG91Y2gsIHJldHJpZXZlZCBmcm9tIFRvdWNoLmlkZW50aWZpZXIuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyID0gMDtcblxuXG5cdC8qKlxuXHQgKiBUb3VjaG1vdmUgYm91bmRhcnksIGJleW9uZCB3aGljaCBhIGNsaWNrIHdpbGwgYmUgY2FuY2VsbGVkLlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudG91Y2hCb3VuZGFyeSA9IG9wdGlvbnMudG91Y2hCb3VuZGFyeSB8fCAxMDtcblxuXG5cdC8qKlxuXHQgKiBUaGUgRmFzdENsaWNrIGxheWVyLlxuXHQgKlxuXHQgKiBAdHlwZSBFbGVtZW50XG5cdCAqL1xuXHR0aGlzLmxheWVyID0gbGF5ZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiB0YXAodG91Y2hzdGFydCBhbmQgdG91Y2hlbmQpIGV2ZW50c1xuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudGFwRGVsYXkgPSBvcHRpb25zLnRhcERlbGF5IHx8IDIwMDtcblxuXHRpZiAoRmFzdENsaWNrLm5vdE5lZWRlZChsYXllcikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBBbmRyb2lkIGRvbid0IGhhdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcblx0ZnVuY3Rpb24gYmluZChtZXRob2QsIGNvbnRleHQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBtZXRob2QuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTsgfTtcblx0fVxuXG5cblx0dmFyIG1ldGhvZHMgPSBbJ29uTW91c2UnLCAnb25DbGljaycsICdvblRvdWNoU3RhcnQnLCAnb25Ub3VjaE1vdmUnLCAnb25Ub3VjaEVuZCcsICdvblRvdWNoQ2FuY2VsJ107XG5cdHZhciBjb250ZXh0ID0gdGhpcztcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGNvbnRleHRbbWV0aG9kc1tpXV0gPSBiaW5kKGNvbnRleHRbbWV0aG9kc1tpXV0sIGNvbnRleHQpO1xuXHR9XG5cblx0Ly8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzIGFzIHJlcXVpcmVkXG5cdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdH1cblxuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XG5cblx0Ly8gSGFjayBpcyByZXF1aXJlZCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IEV2ZW50I3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAoZS5nLiBBbmRyb2lkIDIpXG5cdC8vIHdoaWNoIGlzIGhvdyBGYXN0Q2xpY2sgbm9ybWFsbHkgc3RvcHMgY2xpY2sgZXZlbnRzIGJ1YmJsaW5nIHRvIGNhbGxiYWNrcyByZWdpc3RlcmVkIG9uIHRoZSBGYXN0Q2xpY2tcblx0Ly8gbGF5ZXIgd2hlbiB0aGV5IGFyZSBjYW5jZWxsZWQuXG5cdGlmICghRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0dmFyIHJtdiA9IE5vZGUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xuXHRcdFx0XHRybXYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cm12LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG5cdFx0XHR2YXIgYWR2ID0gTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0XHRcdGlmICh0eXBlID09PSAnY2xpY2snKSB7XG5cdFx0XHRcdGFkdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjay5oaWphY2tlZCB8fCAoY2FsbGJhY2suaGlqYWNrZWQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmICghZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSwgY2FwdHVyZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBJZiBhIGhhbmRsZXIgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGUgZWxlbWVudCdzIG9uY2xpY2sgYXR0cmlidXRlLCBpdCB3aWxsIGJlIGZpcmVkIGJlZm9yZVxuXHQvLyBGYXN0Q2xpY2sncyBvbkNsaWNrIGhhbmRsZXIuIEZpeCB0aGlzIGJ5IHB1bGxpbmcgb3V0IHRoZSB1c2VyLWRlZmluZWQgaGFuZGxlciBmdW5jdGlvbiBhbmRcblx0Ly8gYWRkaW5nIGl0IGFzIGxpc3RlbmVyLlxuXHRpZiAodHlwZW9mIGxheWVyLm9uY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdC8vIEFuZHJvaWQgYnJvd3NlciBvbiBhdCBsZWFzdCAzLjIgcmVxdWlyZXMgYSBuZXcgcmVmZXJlbmNlIHRvIHRoZSBmdW5jdGlvbiBpbiBsYXllci5vbmNsaWNrXG5cdFx0Ly8gLSB0aGUgb2xkIG9uZSB3b24ndCB3b3JrIGlmIHBhc3NlZCB0byBhZGRFdmVudExpc3RlbmVyIGRpcmVjdGx5LlxuXHRcdG9sZE9uQ2xpY2sgPSBsYXllci5vbmNsaWNrO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdG9sZE9uQ2xpY2soZXZlbnQpO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRsYXllci5vbmNsaWNrID0gbnVsbDtcblx0fVxufVxuXG5cbi8qKlxuICogQW5kcm9pZCByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQW5kcm9pZCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQW5kcm9pZCcpID4gMDtcblxuXG4vKipcbiAqIGlPUyByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzSU9TID0gL2lQKGFkfGhvbmV8b2QpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDQgcmVxdWlyZXMgYW4gZXhjZXB0aW9uIGZvciBzZWxlY3QgZWxlbWVudHMuXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNJT1M0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyA0X1xcZChfXFxkKT8vKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDYuMCgrPykgcmVxdWlyZXMgdGhlIHRhcmdldCBlbGVtZW50IHRvIGJlIG1hbnVhbGx5IGRlcml2ZWRcbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQgPSBkZXZpY2VJc0lPUyAmJiAoL09TIChbNi05XXxcXGR7Mn0pX1xcZC8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbi8qKlxuICogQmxhY2tCZXJyeSByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQmxhY2tCZXJyeTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdCQjEwJykgPiAwO1xuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIG5hdGl2ZSBjbGljay5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgbmVlZHMgYSBuYXRpdmUgY2xpY2tcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0NsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgdG8gZGlzYWJsZWQgaW5wdXRzIChpc3N1ZSAjNjIpXG5cdGNhc2UgJ2J1dHRvbic6XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdGNhc2UgJ3RleHRhcmVhJzpcblx0XHRpZiAodGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnaW5wdXQnOlxuXG5cdFx0Ly8gRmlsZSBpbnB1dHMgbmVlZCByZWFsIGNsaWNrcyBvbiBpT1MgNiBkdWUgdG8gYSBicm93c2VyIGJ1ZyAoaXNzdWUgIzY4KVxuXHRcdGlmICgoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0LnR5cGUgPT09ICdmaWxlJykgfHwgdGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnbGFiZWwnOlxuXHRjYXNlICd2aWRlbyc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gKC9cXGJuZWVkc2NsaWNrXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBhIGdpdmVuIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIGNsaWNrIGludG8gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIG5hdGl2ZSBjbGljay5cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0ZvY3VzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXHRjYXNlICd0ZXh0YXJlYSc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdFx0cmV0dXJuICFkZXZpY2VJc0FuZHJvaWQ7XG5cdGNhc2UgJ2lucHV0Jzpcblx0XHRzd2l0Y2ggKHRhcmdldC50eXBlKSB7XG5cdFx0Y2FzZSAnYnV0dG9uJzpcblx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0Y2FzZSAnZmlsZSc6XG5cdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdGNhc2UgJ3JhZGlvJzpcblx0XHRjYXNlICdzdWJtaXQnOlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdG8gZm9jdXMgZGlzYWJsZWQgaW5wdXRzXG5cdFx0cmV0dXJuICF0YXJnZXQuZGlzYWJsZWQgJiYgIXRhcmdldC5yZWFkT25seTtcblx0ZGVmYXVsdDpcblx0XHRyZXR1cm4gKC9cXGJuZWVkc2ZvY3VzXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcblx0fVxufTtcblxuXG4vKipcbiAqIFNlbmQgYSBjbGljayBldmVudCB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLnNlbmRDbGljayA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQsIGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGNsaWNrRXZlbnQsIHRvdWNoO1xuXG5cdC8vIE9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzIGFjdGl2ZUVsZW1lbnQgbmVlZHMgdG8gYmUgYmx1cnJlZCBvdGhlcndpc2UgdGhlIHN5bnRoZXRpYyBjbGljayB3aWxsIGhhdmUgbm8gZWZmZWN0ICgjMjQpXG5cdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRhcmdldEVsZW1lbnQpIHtcblx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0fVxuXG5cdHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cblx0Ly8gU3ludGhlc2lzZSBhIGNsaWNrIGV2ZW50LCB3aXRoIGFuIGV4dHJhIGF0dHJpYnV0ZSBzbyBpdCBjYW4gYmUgdHJhY2tlZFxuXHRjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnRzJyk7XG5cdGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQodGhpcy5kZXRlcm1pbmVFdmVudFR5cGUodGFyZ2V0RWxlbWVudCksIHRydWUsIHRydWUsIHdpbmRvdywgMSwgdG91Y2guc2NyZWVuWCwgdG91Y2guc2NyZWVuWSwgdG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXHRjbGlja0V2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQgPSB0cnVlO1xuXHR0YXJnZXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG59O1xuXG5GYXN0Q2xpY2sucHJvdG90eXBlLmRldGVybWluZUV2ZW50VHlwZSA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vSXNzdWUgIzE1OTogQW5kcm9pZCBDaHJvbWUgU2VsZWN0IEJveCBkb2VzIG5vdCBvcGVuIHdpdGggYSBzeW50aGV0aWMgY2xpY2sgZXZlbnRcblx0aWYgKGRldmljZUlzQW5kcm9pZCAmJiB0YXJnZXRFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcblx0XHRyZXR1cm4gJ21vdXNlZG93bic7XG5cdH1cblxuXHRyZXR1cm4gJ2NsaWNrJztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgbGVuZ3RoO1xuXG5cdC8vIElzc3VlICMxNjA6IG9uIGlPUyA3LCBzb21lIGlucHV0IGVsZW1lbnRzIChlLmcuIGRhdGUgZGF0ZXRpbWUpIHRocm93IGEgdmFndWUgVHlwZUVycm9yIG9uIHNldFNlbGVjdGlvblJhbmdlLiBUaGVzZSBlbGVtZW50cyBkb24ndCBoYXZlIGFuIGludGVnZXIgdmFsdWUgZm9yIHRoZSBzZWxlY3Rpb25TdGFydCBhbmQgc2VsZWN0aW9uRW5kIHByb3BlcnRpZXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IHRoYXQgY2FuJ3QgYmUgdXNlZCBmb3IgZGV0ZWN0aW9uIGJlY2F1c2UgYWNjZXNzaW5nIHRoZSBwcm9wZXJ0aWVzIGFsc28gdGhyb3dzIGEgVHlwZUVycm9yLiBKdXN0IGNoZWNrIHRoZSB0eXBlIGluc3RlYWQuIEZpbGVkIGFzIEFwcGxlIGJ1ZyAjMTUxMjI3MjQuXG5cdGlmIChkZXZpY2VJc0lPUyAmJiB0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlICYmIHRhcmdldEVsZW1lbnQudHlwZS5pbmRleE9mKCdkYXRlJykgIT09IDAgJiYgdGFyZ2V0RWxlbWVudC50eXBlICE9PSAndGltZScpIHtcblx0XHRsZW5ndGggPSB0YXJnZXRFbGVtZW50LnZhbHVlLmxlbmd0aDtcblx0XHR0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGxlbmd0aCwgbGVuZ3RoKTtcblx0fSBlbHNlIHtcblx0XHR0YXJnZXRFbGVtZW50LmZvY3VzKCk7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciBhbmQgaWYgc28sIHNldCBhIGZsYWcgb24gaXQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudXBkYXRlU2Nyb2xsUGFyZW50ID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBzY3JvbGxQYXJlbnQsIHBhcmVudEVsZW1lbnQ7XG5cblx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cblx0Ly8gQXR0ZW1wdCB0byBkaXNjb3ZlciB3aGV0aGVyIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgc2Nyb2xsYWJsZSBsYXllci4gUmUtY2hlY2sgaWYgdGhlXG5cdC8vIHRhcmdldCBlbGVtZW50IHdhcyBtb3ZlZCB0byBhbm90aGVyIHBhcmVudC5cblx0aWYgKCFzY3JvbGxQYXJlbnQgfHwgIXNjcm9sbFBhcmVudC5jb250YWlucyh0YXJnZXRFbGVtZW50KSkge1xuXHRcdHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXHRcdGRvIHtcblx0XHRcdGlmIChwYXJlbnRFbGVtZW50LnNjcm9sbEhlaWdodCA+IHBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHRcdHNjcm9sbFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gcGFyZW50RWxlbWVudDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fSB3aGlsZSAocGFyZW50RWxlbWVudCk7XG5cdH1cblxuXHQvLyBBbHdheXMgdXBkYXRlIHRoZSBzY3JvbGwgdG9wIHRyYWNrZXIgaWYgcG9zc2libGUuXG5cdGlmIChzY3JvbGxQYXJlbnQpIHtcblx0XHRzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3A7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxFdmVudFRhcmdldH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0ID0gZnVuY3Rpb24oZXZlbnRUYXJnZXQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIE9uIHNvbWUgb2xkZXIgYnJvd3NlcnMgKG5vdGFibHkgU2FmYXJpIG9uIGlPUyA0LjEgLSBzZWUgaXNzdWUgIzU2KSB0aGUgZXZlbnQgdGFyZ2V0IG1heSBiZSBhIHRleHQgbm9kZS5cblx0aWYgKGV2ZW50VGFyZ2V0Lm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuXHRcdHJldHVybiBldmVudFRhcmdldC5wYXJlbnROb2RlO1xuXHR9XG5cblx0cmV0dXJuIGV2ZW50VGFyZ2V0O1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIHN0YXJ0LCByZWNvcmQgdGhlIHBvc2l0aW9uIGFuZCBzY3JvbGwgb2Zmc2V0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciB0YXJnZXRFbGVtZW50LCB0b3VjaCwgc2VsZWN0aW9uO1xuXG5cdC8vIElnbm9yZSBtdWx0aXBsZSB0b3VjaGVzLCBvdGhlcndpc2UgcGluY2gtdG8tem9vbSBpcyBwcmV2ZW50ZWQgaWYgYm90aCBmaW5nZXJzIGFyZSBvbiB0aGUgRmFzdENsaWNrIGVsZW1lbnQgKGlzc3VlICMxMTEpLlxuXHRpZiAoZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGggPiAxKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHR0YXJnZXRFbGVtZW50ID0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCk7XG5cdHRvdWNoID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXTtcblxuXHRpZiAoZGV2aWNlSXNJT1MpIHtcblxuXHRcdC8vIE9ubHkgdHJ1c3RlZCBldmVudHMgd2lsbCBkZXNlbGVjdCB0ZXh0IG9uIGlPUyAoaXNzdWUgIzQ5KVxuXHRcdHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcblx0XHRpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgJiYgIXNlbGVjdGlvbi5pc0NvbGxhcHNlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdFx0Ly8gV2VpcmQgdGhpbmdzIGhhcHBlbiBvbiBpT1Mgd2hlbiBhbiBhbGVydCBvciBjb25maXJtIGRpYWxvZyBpcyBvcGVuZWQgZnJvbSBhIGNsaWNrIGV2ZW50IGNhbGxiYWNrIChpc3N1ZSAjMjMpOlxuXHRcdFx0Ly8gd2hlbiB0aGUgdXNlciBuZXh0IHRhcHMgYW55d2hlcmUgZWxzZSBvbiB0aGUgcGFnZSwgbmV3IHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kIGV2ZW50cyBhcmUgZGlzcGF0Y2hlZFxuXHRcdFx0Ly8gd2l0aCB0aGUgc2FtZSBpZGVudGlmaWVyIGFzIHRoZSB0b3VjaCBldmVudCB0aGF0IHByZXZpb3VzbHkgdHJpZ2dlcmVkIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgYWxlcnQuXG5cdFx0XHQvLyBTYWRseSwgdGhlcmUgaXMgYW4gaXNzdWUgb24gaU9TIDQgdGhhdCBjYXVzZXMgc29tZSBub3JtYWwgdG91Y2ggZXZlbnRzIHRvIGhhdmUgdGhlIHNhbWUgaWRlbnRpZmllciBhcyBhblxuXHRcdFx0Ly8gaW1tZWRpYXRlbHkgcHJlY2VlZGluZyB0b3VjaCBldmVudCAoaXNzdWUgIzUyKSwgc28gdGhpcyBmaXggaXMgdW5hdmFpbGFibGUgb24gdGhhdCBwbGF0Zm9ybS5cblx0XHRcdC8vIElzc3VlIDEyMDogdG91Y2guaWRlbnRpZmllciBpcyAwIHdoZW4gQ2hyb21lIGRldiB0b29scyAnRW11bGF0ZSB0b3VjaCBldmVudHMnIGlzIHNldCB3aXRoIGFuIGlPUyBkZXZpY2UgVUEgc3RyaW5nLFxuXHRcdFx0Ly8gd2hpY2ggY2F1c2VzIGFsbCB0b3VjaCBldmVudHMgdG8gYmUgaWdub3JlZC4gQXMgdGhpcyBibG9jayBvbmx5IGFwcGxpZXMgdG8gaU9TLCBhbmQgaU9TIGlkZW50aWZpZXJzIGFyZSBhbHdheXMgbG9uZyxcblx0XHRcdC8vIHJhbmRvbSBpbnRlZ2VycywgaXQncyBzYWZlIHRvIHRvIGNvbnRpbnVlIGlmIHRoZSBpZGVudGlmaWVyIGlzIDAgaGVyZS5cblx0XHRcdGlmICh0b3VjaC5pZGVudGlmaWVyICYmIHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMubGFzdFRvdWNoSWRlbnRpZmllcikge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGFzdFRvdWNoSWRlbnRpZmllciA9IHRvdWNoLmlkZW50aWZpZXI7XG5cblx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciAodXNpbmcgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoKSBhbmQ6XG5cdFx0XHQvLyAxKSB0aGUgdXNlciBkb2VzIGEgZmxpbmcgc2Nyb2xsIG9uIHRoZSBzY3JvbGxhYmxlIGxheWVyXG5cdFx0XHQvLyAyKSB0aGUgdXNlciBzdG9wcyB0aGUgZmxpbmcgc2Nyb2xsIHdpdGggYW5vdGhlciB0YXBcblx0XHRcdC8vIHRoZW4gdGhlIGV2ZW50LnRhcmdldCBvZiB0aGUgbGFzdCAndG91Y2hlbmQnIGV2ZW50IHdpbGwgYmUgdGhlIGVsZW1lbnQgdGhhdCB3YXMgdW5kZXIgdGhlIHVzZXIncyBmaW5nZXJcblx0XHRcdC8vIHdoZW4gdGhlIGZsaW5nIHNjcm9sbCB3YXMgc3RhcnRlZCwgY2F1c2luZyBGYXN0Q2xpY2sgdG8gc2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoYXQgbGF5ZXIgLSB1bmxlc3MgYSBjaGVja1xuXHRcdFx0Ly8gaXMgbWFkZSB0byBlbnN1cmUgdGhhdCBhIHBhcmVudCBsYXllciB3YXMgbm90IHNjcm9sbGVkIGJlZm9yZSBzZW5kaW5nIGEgc3ludGhldGljIGNsaWNrIChpc3N1ZSAjNDIpLlxuXHRcdFx0dGhpcy51cGRhdGVTY3JvbGxQYXJlbnQodGFyZ2V0RWxlbWVudCk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy50cmFja2luZ0NsaWNrID0gdHJ1ZTtcblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSBldmVudC50aW1lU3RhbXA7XG5cdHRoaXMudGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XG5cblx0dGhpcy50b3VjaFN0YXJ0WCA9IHRvdWNoLnBhZ2VYO1xuXHR0aGlzLnRvdWNoU3RhcnRZID0gdG91Y2gucGFnZVk7XG5cblx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBCYXNlZCBvbiBhIHRvdWNobW92ZSBldmVudCBvYmplY3QsIGNoZWNrIHdoZXRoZXIgdGhlIHRvdWNoIGhhcyBtb3ZlZCBwYXN0IGEgYm91bmRhcnkgc2luY2UgaXQgc3RhcnRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudG91Y2hIYXNNb3ZlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sIGJvdW5kYXJ5ID0gdGhpcy50b3VjaEJvdW5kYXJ5O1xuXG5cdGlmIChNYXRoLmFicyh0b3VjaC5wYWdlWCAtIHRoaXMudG91Y2hTdGFydFgpID4gYm91bmRhcnkgfHwgTWF0aC5hYnModG91Y2gucGFnZVkgLSB0aGlzLnRvdWNoU3RhcnRZKSA+IGJvdW5kYXJ5KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qKlxuICogVXBkYXRlIHRoZSBsYXN0IHBvc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCF0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIElmIHRoZSB0b3VjaCBoYXMgbW92ZWQsIGNhbmNlbCB0aGUgY2xpY2sgdHJhY2tpbmdcblx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudCAhPT0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCkgfHwgdGhpcy50b3VjaEhhc01vdmVkKGV2ZW50KSkge1xuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGZpbmQgdGhlIGxhYmVsbGVkIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBsYWJlbCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8SFRNTExhYmVsRWxlbWVudH0gbGFiZWxFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLmZpbmRDb250cm9sID0gZnVuY3Rpb24obGFiZWxFbGVtZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBGYXN0IHBhdGggZm9yIG5ld2VyIGJyb3dzZXJzIHN1cHBvcnRpbmcgdGhlIEhUTUw1IGNvbnRyb2wgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuY29udHJvbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGxhYmVsRWxlbWVudC5jb250cm9sO1xuXHR9XG5cblx0Ly8gQWxsIGJyb3dzZXJzIHVuZGVyIHRlc3QgdGhhdCBzdXBwb3J0IHRvdWNoIGV2ZW50cyBhbHNvIHN1cHBvcnQgdGhlIEhUTUw1IGh0bWxGb3IgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuaHRtbEZvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYWJlbEVsZW1lbnQuaHRtbEZvcik7XG5cdH1cblxuXHQvLyBJZiBubyBmb3IgYXR0cmlidXRlIGV4aXN0cywgYXR0ZW1wdCB0byByZXRyaWV2ZSB0aGUgZmlyc3QgbGFiZWxsYWJsZSBkZXNjZW5kYW50IGVsZW1lbnRcblx0Ly8gdGhlIGxpc3Qgb2Ygd2hpY2ggaXMgZGVmaW5lZCBoZXJlOiBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxhYmVsXG5cdHJldHVybiBsYWJlbEVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSksIGtleWdlbiwgbWV0ZXIsIG91dHB1dCwgcHJvZ3Jlc3MsIHNlbGVjdCwgdGV4dGFyZWEnKTtcbn07XG5cblxuLyoqXG4gKiBPbiB0b3VjaCBlbmQsIGRldGVybWluZSB3aGV0aGVyIHRvIHNlbmQgYSBjbGljayBldmVudCBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZm9yRWxlbWVudCwgdHJhY2tpbmdDbGlja1N0YXJ0LCB0YXJnZXRUYWdOYW1lLCBzY3JvbGxQYXJlbnQsIHRvdWNoLCB0YXJnZXRFbGVtZW50ID0gdGhpcy50YXJnZXRFbGVtZW50O1xuXG5cdGlmICghdGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBQcmV2ZW50IHBoYW50b20gY2xpY2tzIG9uIGZhc3QgZG91YmxlLXRhcCAoaXNzdWUgIzM2KVxuXHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XG5cdFx0dGhpcy5jYW5jZWxOZXh0Q2xpY2sgPSB0cnVlO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gUmVzZXQgdG8gcHJldmVudCB3cm9uZyBjbGljayBjYW5jZWwgb24gaW5wdXQgKGlzc3VlICMxNTYpLlxuXHR0aGlzLmNhbmNlbE5leHRDbGljayA9IGZhbHNlO1xuXG5cdHRoaXMubGFzdENsaWNrVGltZSA9IGV2ZW50LnRpbWVTdGFtcDtcblxuXHR0cmFja2luZ0NsaWNrU3RhcnQgPSB0aGlzLnRyYWNraW5nQ2xpY2tTdGFydDtcblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcblxuXHQvLyBPbiBzb21lIGlPUyBkZXZpY2VzLCB0aGUgdGFyZ2V0RWxlbWVudCBzdXBwbGllZCB3aXRoIHRoZSBldmVudCBpcyBpbnZhbGlkIGlmIHRoZSBsYXllclxuXHQvLyBpcyBwZXJmb3JtaW5nIGEgdHJhbnNpdGlvbiBvciBzY3JvbGwsIGFuZCBoYXMgdG8gYmUgcmUtZGV0ZWN0ZWQgbWFudWFsbHkuIE5vdGUgdGhhdFxuXHQvLyBmb3IgdGhpcyB0byBmdW5jdGlvbiBjb3JyZWN0bHksIGl0IG11c3QgYmUgY2FsbGVkICphZnRlciogdGhlIGV2ZW50IHRhcmdldCBpcyBjaGVja2VkIVxuXHQvLyBTZWUgaXNzdWUgIzU3OyBhbHNvIGZpbGVkIGFzIHJkYXI6Ly8xMzA0ODU4OSAuXG5cdGlmIChkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQpIHtcblx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0Ly8gSW4gY2VydGFpbiBjYXNlcyBhcmd1bWVudHMgb2YgZWxlbWVudEZyb21Qb2ludCBjYW4gYmUgbmVnYXRpdmUsIHNvIHByZXZlbnQgc2V0dGluZyB0YXJnZXRFbGVtZW50IHRvIG51bGxcblx0XHR0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaC5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgdG91Y2gucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpIHx8IHRhcmdldEVsZW1lbnQ7XG5cdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHR9XG5cblx0dGFyZ2V0VGFnTmFtZSA9IHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRpZiAodGFyZ2V0VGFnTmFtZSA9PT0gJ2xhYmVsJykge1xuXHRcdGZvckVsZW1lbnQgPSB0aGlzLmZpbmRDb250cm9sKHRhcmdldEVsZW1lbnQpO1xuXHRcdGlmIChmb3JFbGVtZW50KSB7XG5cdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xuXHRcdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRhcmdldEVsZW1lbnQgPSBmb3JFbGVtZW50O1xuXHRcdH1cblx0fSBlbHNlIGlmICh0aGlzLm5lZWRzRm9jdXModGFyZ2V0RWxlbWVudCkpIHtcblxuXHRcdC8vIENhc2UgMTogSWYgdGhlIHRvdWNoIHN0YXJ0ZWQgYSB3aGlsZSBhZ28gKGJlc3QgZ3Vlc3MgaXMgMTAwbXMgYmFzZWQgb24gdGVzdHMgZm9yIGlzc3VlICMzNikgdGhlbiBmb2N1cyB3aWxsIGJlIHRyaWdnZXJlZCBhbnl3YXkuIFJldHVybiBlYXJseSBhbmQgdW5zZXQgdGhlIHRhcmdldCBlbGVtZW50IHJlZmVyZW5jZSBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IGNsaWNrIHdpbGwgYmUgYWxsb3dlZCB0aHJvdWdoLlxuXHRcdC8vIENhc2UgMjogV2l0aG91dCB0aGlzIGV4Y2VwdGlvbiBmb3IgaW5wdXQgZWxlbWVudHMgdGFwcGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIGNvbnRhaW5lZCBpbiBhbiBpZnJhbWUsIHRoZW4gYW55IGlucHV0dGVkIHRleHQgd29uJ3QgYmUgdmlzaWJsZSBldmVuIHRob3VnaCB0aGUgdmFsdWUgYXR0cmlidXRlIGlzIHVwZGF0ZWQgYXMgdGhlIHVzZXIgdHlwZXMgKGlzc3VlICMzNykuXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0cmFja2luZ0NsaWNrU3RhcnQpID4gMTAwIHx8IChkZXZpY2VJc0lPUyAmJiB3aW5kb3cudG9wICE9PSB3aW5kb3cgJiYgdGFyZ2V0VGFnTmFtZSA9PT0gJ2lucHV0JykpIHtcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcblx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XG5cblx0XHQvLyBTZWxlY3QgZWxlbWVudHMgbmVlZCB0aGUgZXZlbnQgdG8gZ28gdGhyb3VnaCBvbiBpT1MgNCwgb3RoZXJ3aXNlIHRoZSBzZWxlY3RvciBtZW51IHdvbid0IG9wZW4uXG5cdFx0Ly8gQWxzbyB0aGlzIGJyZWFrcyBvcGVuaW5nIHNlbGVjdHMgd2hlbiBWb2ljZU92ZXIgaXMgYWN0aXZlIG9uIGlPUzYsIGlPUzcgKGFuZCBwb3NzaWJseSBvdGhlcnMpXG5cdFx0aWYgKCFkZXZpY2VJc0lPUyB8fCB0YXJnZXRUYWdOYW1lICE9PSAnc2VsZWN0Jykge1xuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKGRldmljZUlzSU9TICYmICFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgaWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgbGF5ZXIgdGhhdCB3YXMgc2Nyb2xsZWRcblx0XHQvLyBhbmQgdGhpcyB0YXAgaXMgYmVpbmcgdXNlZCB0byBzdG9wIHRoZSBzY3JvbGxpbmcgKHVzdWFsbHkgaW5pdGlhdGVkIGJ5IGEgZmxpbmcgLSBpc3N1ZSAjNDIpLlxuXHRcdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHRcdGlmIChzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50LmZhc3RDbGlja0xhc3RTY3JvbGxUb3AgIT09IHNjcm9sbFBhcmVudC5zY3JvbGxUb3ApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdC8vIFByZXZlbnQgdGhlIGFjdHVhbCBjbGljayBmcm9tIGdvaW5nIHRob3VnaCAtIHVubGVzcyB0aGUgdGFyZ2V0IG5vZGUgaXMgbWFya2VkIGFzIHJlcXVpcmluZ1xuXHQvLyByZWFsIGNsaWNrcyBvciBpZiBpdCBpcyBpbiB0aGUgd2hpdGVsaXN0IGluIHdoaWNoIGNhc2Ugb25seSBub24tcHJvZ3JhbW1hdGljIGNsaWNrcyBhcmUgcGVybWl0dGVkLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0YXJnZXRFbGVtZW50KSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5zZW5kQ2xpY2sodGFyZ2V0RWxlbWVudCwgZXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIGNhbmNlbCwgc3RvcCB0cmFja2luZyB0aGUgY2xpY2suXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xufTtcblxuXG4vKipcbiAqIERldGVybWluZSBtb3VzZSBldmVudHMgd2hpY2ggc2hvdWxkIGJlIHBlcm1pdHRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Nb3VzZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBJZiBhIHRhcmdldCBlbGVtZW50IHdhcyBuZXZlciBzZXQgKGJlY2F1c2UgYSB0b3VjaCBldmVudCB3YXMgbmV2ZXIgZmlyZWQpIGFsbG93IHRoZSBldmVudFxuXHRpZiAoIXRoaXMudGFyZ2V0RWxlbWVudCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKGV2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFByb2dyYW1tYXRpY2FsbHkgZ2VuZXJhdGVkIGV2ZW50cyB0YXJnZXRpbmcgYSBzcGVjaWZpYyBlbGVtZW50IHNob3VsZCBiZSBwZXJtaXR0ZWRcblx0aWYgKCFldmVudC5jYW5jZWxhYmxlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBEZXJpdmUgYW5kIGNoZWNrIHRoZSB0YXJnZXQgZWxlbWVudCB0byBzZWUgd2hldGhlciB0aGUgbW91c2UgZXZlbnQgbmVlZHMgdG8gYmUgcGVybWl0dGVkO1xuXHQvLyB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLCBwcmV2ZW50IG5vbi10b3VjaCBjbGljayBldmVudHMgZnJvbSB0cmlnZ2VyaW5nIGFjdGlvbnMsXG5cdC8vIHRvIHByZXZlbnQgZ2hvc3QvZG91YmxlY2xpY2tzLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0aGlzLnRhcmdldEVsZW1lbnQpIHx8IHRoaXMuY2FuY2VsTmV4dENsaWNrKSB7XG5cblx0XHQvLyBQcmV2ZW50IGFueSB1c2VyLWFkZGVkIGxpc3RlbmVycyBkZWNsYXJlZCBvbiBGYXN0Q2xpY2sgZWxlbWVudCBmcm9tIGJlaW5nIGZpcmVkLlxuXHRcdGlmIChldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcblx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFBhcnQgb2YgdGhlIGhhY2sgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxuXHRcdFx0ZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBDYW5jZWwgdGhlIGV2ZW50XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIElmIHRoZSBtb3VzZSBldmVudCBpcyBwZXJtaXR0ZWQsIHJldHVybiB0cnVlIGZvciB0aGUgYWN0aW9uIHRvIGdvIHRocm91Z2guXG5cdHJldHVybiB0cnVlO1xufTtcblxuXG4vKipcbiAqIE9uIGFjdHVhbCBjbGlja3MsIGRldGVybWluZSB3aGV0aGVyIHRoaXMgaXMgYSB0b3VjaC1nZW5lcmF0ZWQgY2xpY2ssIGEgY2xpY2sgYWN0aW9uIG9jY3VycmluZ1xuICogbmF0dXJhbGx5IGFmdGVyIGEgZGVsYXkgYWZ0ZXIgYSB0b3VjaCAod2hpY2ggbmVlZHMgdG8gYmUgY2FuY2VsbGVkIHRvIGF2b2lkIGR1cGxpY2F0aW9uKSwgb3JcbiAqIGFuIGFjdHVhbCBjbGljayB3aGljaCBzaG91bGQgYmUgcGVybWl0dGVkLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgcGVybWl0dGVkO1xuXG5cdC8vIEl0J3MgcG9zc2libGUgZm9yIGFub3RoZXIgRmFzdENsaWNrLWxpa2UgbGlicmFyeSBkZWxpdmVyZWQgd2l0aCB0aGlyZC1wYXJ0eSBjb2RlIHRvIGZpcmUgYSBjbGljayBldmVudCBiZWZvcmUgRmFzdENsaWNrIGRvZXMgKGlzc3VlICM0NCkuIEluIHRoYXQgY2FzZSwgc2V0IHRoZSBjbGljay10cmFja2luZyBmbGFnIGJhY2sgdG8gZmFsc2UgYW5kIHJldHVybiBlYXJseS4gVGhpcyB3aWxsIGNhdXNlIG9uVG91Y2hFbmQgdG8gcmV0dXJuIGVhcmx5LlxuXHRpZiAodGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFZlcnkgb2RkIGJlaGF2aW91ciBvbiBpT1MgKGlzc3VlICMxOCk6IGlmIGEgc3VibWl0IGVsZW1lbnQgaXMgcHJlc2VudCBpbnNpZGUgYSBmb3JtIGFuZCB0aGUgdXNlciBoaXRzIGVudGVyIGluIHRoZSBpT1Mgc2ltdWxhdG9yIG9yIGNsaWNrcyB0aGUgR28gYnV0dG9uIG9uIHRoZSBwb3AtdXAgT1Mga2V5Ym9hcmQgdGhlIGEga2luZCBvZiAnZmFrZScgY2xpY2sgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2l0aCB0aGUgc3VibWl0LXR5cGUgaW5wdXQgZWxlbWVudCBhcyB0aGUgdGFyZ2V0LlxuXHRpZiAoZXZlbnQudGFyZ2V0LnR5cGUgPT09ICdzdWJtaXQnICYmIGV2ZW50LmRldGFpbCA9PT0gMCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cGVybWl0dGVkID0gdGhpcy5vbk1vdXNlKGV2ZW50KTtcblxuXHQvLyBPbmx5IHVuc2V0IHRhcmdldEVsZW1lbnQgaWYgdGhlIGNsaWNrIGlzIG5vdCBwZXJtaXR0ZWQuIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCB0aGUgY2hlY2sgZm9yICF0YXJnZXRFbGVtZW50IGluIG9uTW91c2UgZmFpbHMgYW5kIHRoZSBicm93c2VyJ3MgY2xpY2sgZG9lc24ndCBnbyB0aHJvdWdoLlxuXHRpZiAoIXBlcm1pdHRlZCkge1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHQvLyBJZiBjbGlja3MgYXJlIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cblx0cmV0dXJuIHBlcm1pdHRlZDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYWxsIEZhc3RDbGljaydzIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGxheWVyID0gdGhpcy5sYXllcjtcblxuXHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHR9XG5cblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQsIGZhbHNlKTtcblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMub25Ub3VjaENhbmNlbCwgZmFsc2UpO1xufTtcblxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgRmFzdENsaWNrIGlzIG5lZWRlZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cbiAqL1xuRmFzdENsaWNrLm5vdE5lZWRlZCA9IGZ1bmN0aW9uKGxheWVyKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG1ldGFWaWV3cG9ydDtcblx0dmFyIGNocm9tZVZlcnNpb247XG5cdHZhciBibGFja2JlcnJ5VmVyc2lvbjtcblxuXHQvLyBEZXZpY2VzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0b3VjaCBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRpZiAodHlwZW9mIHdpbmRvdy5vbnRvdWNoc3RhcnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBDaHJvbWUgdmVyc2lvbiAtIHplcm8gZm9yIG90aGVyIGJyb3dzZXJzXG5cdGNocm9tZVZlcnNpb24gPSArKC9DaHJvbWVcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcblxuXHRpZiAoY2hyb21lVmVyc2lvbikge1xuXG5cdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xuXG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XG5cdFx0XHRcdC8vIENocm9tZSBvbiBBbmRyb2lkIHdpdGggdXNlci1zY2FsYWJsZT1cIm5vXCIgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzg5KVxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIENocm9tZSAzMiBhbmQgYWJvdmUgd2l0aCB3aWR0aD1kZXZpY2Utd2lkdGggb3IgbGVzcyBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRcdFx0XHRpZiAoY2hyb21lVmVyc2lvbiA+IDMxICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBDaHJvbWUgZGVza3RvcCBkb2Vzbid0IG5lZWQgRmFzdENsaWNrIChpc3N1ZSAjMTUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdGlmIChkZXZpY2VJc0JsYWNrQmVycnkxMCkge1xuXHRcdGJsYWNrYmVycnlWZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcLyhbMC05XSopXFwuKFswLTldKikvKTtcblxuXHRcdC8vIEJsYWNrQmVycnkgMTAuMysgZG9lcyBub3QgcmVxdWlyZSBGYXN0Y2xpY2sgbGlicmFyeS5cblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vZnRsYWJzL2Zhc3RjbGljay9pc3N1ZXMvMjUxXG5cdFx0aWYgKGJsYWNrYmVycnlWZXJzaW9uWzFdID49IDEwICYmIGJsYWNrYmVycnlWZXJzaW9uWzJdID49IDMpIHtcblx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcblxuXHRcdFx0aWYgKG1ldGFWaWV3cG9ydCkge1xuXHRcdFx0XHQvLyB1c2VyLXNjYWxhYmxlPW5vIGVsaW1pbmF0ZXMgY2xpY2sgZGVsYXkuXG5cdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gd2lkdGg9ZGV2aWNlLXdpZHRoIChvciBsZXNzIHRoYW4gZGV2aWNlLXdpZHRoKSBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBJRTEwIHdpdGggLW1zLXRvdWNoLWFjdGlvbjogbm9uZSwgd2hpY2ggZGlzYWJsZXMgZG91YmxlLXRhcC10by16b29tIChpc3N1ZSAjOTcpXG5cdGlmIChsYXllci5zdHlsZS5tc1RvdWNoQWN0aW9uID09PSAnbm9uZScpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBGYXN0Q2xpY2sgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuRmFzdENsaWNrLmF0dGFjaCA9IGZ1bmN0aW9uKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0cmV0dXJuIG5ldyBGYXN0Q2xpY2sobGF5ZXIsIG9wdGlvbnMpO1xufTtcblxuXG5pZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblxuXHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdGRlZmluZShmdW5jdGlvbigpIHtcblx0XHQndXNlIHN0cmljdCc7XG5cdFx0cmV0dXJuIEZhc3RDbGljaztcblx0fSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gRmFzdENsaWNrLmF0dGFjaDtcblx0bW9kdWxlLmV4cG9ydHMuRmFzdENsaWNrID0gRmFzdENsaWNrO1xufSBlbHNlIHtcblx0d2luZG93LkZhc3RDbGljayA9IEZhc3RDbGljaztcbn1cbiIsInN0b3JlcyA9IHJlcXVpcmUgJy4vc3RvcmVzJ1xucm91dGVzID0gcmVxdWlyZSAnLi9yb3V0ZXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3RhdGljRmlsZXM6IF9fZGlybmFtZStcIi9wdWJsaWNcIlxuICBzdG9yZUlkOiBcInN0b3JlX3N0YXRlX2Zyb21fc2VydmVyXCJcbiAgYXBwSWQ6IFwiYXBwXCJcbiAgcm91dGVzOiByb3V0ZXNcbiAgc3RvcmVzOiBzdG9yZXMiLCJRID0gcmVxdWlyZSAncSdcblxuSW5kZXhWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9pbmRleCdcblRlYW1WaWV3ID0gcmVxdWlyZSAnLi92aWV3cy90ZWFtJ1xuUGxheWVyVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvcGxheWVyJ1xuTWF0Y2hWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9tYXRjaCdcblNjaGVkdWxlVmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvc2NoZWR1bGUnXG5TdGFuZGluZ3NWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9zdGFuZGluZ3MnXG5TdGF0c1ZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3N0YXRzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIFwiL1wiOiAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKVxuICAgICAgQHN0b3JlLmZldGNoKFwidGVhbXNcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YXRzXCIpXG4gICAgXSwgKHN0YW5kaW5ncywgdGVhbXNMaXN0LCBzdGF0c0xpc3QpIC0+XG4gICAgICB0aXRsZTogXCJFdHVzaXZ1XCJcbiAgICAgIGNvbXBvbmVudDogSW5kZXhWaWV3XG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG4gICAgICAgIHRlYW1zOiB0ZWFtc0xpc3QudG9KU09OKClcbiAgICAgICAgc3RhdHM6IHN0YXRzTGlzdC50b0pTT04oKVxuXG4gIFwiL2pvdWtrdWVldC86aWQvOmFjdGl2ZT9cIjogKGlkLCBhY3RpdmUpIC0+XG4gICAgUS5zcHJlYWQgW1xuICAgICAgQHN0b3JlLmZldGNoKFwic3RhbmRpbmdzXCIpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJ0ZWFtXCIsIGlkOiBpZClcbiAgICBdLCAoc3RhbmRpbmdzLCB0ZWFtKSAtPlxuXG4gICAgICBzdWJUaXRsZSA9IHN3aXRjaCBhY3RpdmVcbiAgICAgICAgd2hlbiBcInBlbGFhamF0XCIgdGhlbiBcIlBlbGFhamF0XCJcbiAgICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcIlRpbGFzdG90XCJcbiAgICAgICAgZWxzZSBcIk90dGVsdW9oamVsbWFcIlxuXG4gICAgICB0aXRsZTogXCJKb3Vra3VlZXQgLSAje3RlYW0uZ2V0KFwiaW5mb1wiKS5uYW1lfSAtICN7c3ViVGl0bGV9XCJcbiAgICAgIGNvbXBvbmVudDogVGVhbVZpZXdcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG4gICAgICAgIHRlYW06IHRlYW0udG9KU09OKClcbiAgICAgICAgYWN0aXZlOiBhY3RpdmVcblxuICBcIi9qb3Vra3VlZXQvOmlkLzpwaWQvOnNsdWdcIjogKGlkLCBwaWQsIHNsdWcpIC0+XG4gICAgQHN0b3JlLmZldGNoKFwidGVhbVwiLCBpZDogaWQpLnRoZW4gKHRlYW0pIC0+XG4gICAgICBwbGF5ZXIgPSB0ZWFtLmdldChcInJvc3RlclwiKS5maWx0ZXIoKHBsYXllcikgLT5cbiAgICAgICAgcGxheWVyLmlkIGlzIFwiI3twaWR9LyN7c2x1Z31cIlxuICAgICAgKVswXVxuICAgICAgdGl0bGU6IFwiUGVsYWFqYXQgLSAje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICBjb21wb25lbnQ6IFBsYXllclZpZXdcbiAgICAgICAgaWQ6IHBpZFxuICAgICAgICBwbGF5ZXI6IHBsYXllclxuICAgICAgICB0ZWFtOiB0ZWFtLnRvSlNPTigpXG5cbiAgXCIvb3R0ZWx1dFwiOiAtPlxuICAgIEBzdG9yZS5mZXRjaChcInNjaGVkdWxlXCIpLnRoZW4gKHNjaGVkdWxlKSAtPlxuICAgICAgdGl0bGU6IFwiT3R0ZWx1b2hqZWxtYVwiXG4gICAgICBjb21wb25lbnQ6IFNjaGVkdWxlVmlld1xuICAgICAgICBzY2hlZHVsZTogc2NoZWR1bGUudG9KU09OKClcblxuICBcIi9vdHRlbHV0LzppZC86YWN0aXZlP1wiOiAoaWQsIGFjdGl2ZSkgLT5cbiAgICBRLnNwcmVhZCBbXG4gICAgICBAc3RvcmUuZmV0Y2goXCJzY2hlZHVsZVwiKVxuICAgICAgQHN0b3JlLmZldGNoKFwiZ2FtZUV2ZW50c1wiLCBpZDogaWQpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lTGluZXVwc1wiLCBpZDogaWQpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lU3RhdHNcIiwgaWQ6IGlkKVxuICAgIF0sIChzY2hlZHVsZSwgZXZlbnRzLCBsaW5lVXBzLCBzdGF0cykgLT5cbiAgICAgIG1hdGNoID0gc2NoZWR1bGUuZmluZCAoZ2FtZSkgLT5cbiAgICAgICAgZ2FtZS5pZCBpcyBpZFxuXG4gICAgICB0aXRsZTogXCJPdHRlbHUgLSAje21hdGNoLmdldChcImhvbWVcIil9IHZzICN7bWF0Y2guZ2V0KFwiYXdheVwiKX1cIlxuICAgICAgY29tcG9uZW50OiBNYXRjaFZpZXdcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIGdhbWU6IG1hdGNoLnRvSlNPTigpXG4gICAgICAgIGV2ZW50czogZXZlbnRzLnRvSlNPTigpXG4gICAgICAgIGxpbmVVcHM6IGxpbmVVcHMudG9KU09OKClcbiAgICAgICAgc3RhdHM6IHN0YXRzLnRvSlNPTigpXG4gICAgICAgIGFjdGl2ZTogYWN0aXZlXG5cbiAgXCIvc2FyamF0YXVsdWtrb1wiOiAtPlxuICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKS50aGVuIChzdGFuZGluZ3MpIC0+XG4gICAgICB0aXRsZTogXCJTYXJqYXRhdWx1a2tvXCJcbiAgICAgIGNvbXBvbmVudDogU3RhbmRpbmdzVmlld1xuICAgICAgICBzdGFuZGluZ3M6IHN0YW5kaW5ncy50b0pTT04oKVxuXG4gIFwiL3RpbGFzdG90LzphY3RpdmU/XCI6IChhY3RpdmUpIC0+XG4gICAgQHN0b3JlLmZldGNoKFwic3RhdHNcIikudGhlbiAoc3RhdHMpIC0+XG4gICAgICB0aXRsZTogXCJUaWxhc3RvdFwiXG4gICAgICBjb21wb25lbnQ6IFN0YXRzVmlld1xuICAgICAgICBzdGF0czogc3RhdHMudG9KU09OKClcbiAgICAgICAgYWN0aXZlOiBhY3RpdmUiLCJUZWFtc0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL3N0b3Jlcy90ZWFtcydcblNjaGVkdWxlQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vc3RvcmVzL3NjaGVkdWxlJ1xuU3RhbmRpbmdzQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vc3RvcmVzL3N0YW5kaW5ncydcblN0YXRzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9zdGF0cydcblRlYW1Nb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL3RlYW0nXG5HYW1lRXZlbnRzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9nYW1lX2V2ZW50cydcbkdhbWVMaW5ldXBzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9nYW1lX2xpbmV1cHMnXG5HYW1lU3RhdHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL2dhbWVfc3RhdHMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgdGVhbXM6IFRlYW1zQ29sbGVjdGlvblxuICBzY2hlZHVsZTogU2NoZWR1bGVDb2xsZWN0aW9uXG4gIHN0YW5kaW5nczogU3RhbmRpbmdzQ29sbGVjdGlvblxuICBzdGF0czogU3RhdHNNb2RlbFxuICB0ZWFtOiBUZWFtTW9kZWxcbiAgZ2FtZUV2ZW50czogR2FtZUV2ZW50c01vZGVsXG4gIGdhbWVMaW5ldXBzOiBHYW1lTGluZXVwc01vZGVsXG4gIGdhbWVTdGF0czogR2FtZVN0YXRzTW9kZWwiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuR2FtZUV2ZW50cyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcImdhbWVzL2V2ZW50cy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L2dhbWVzL2V2ZW50cy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVFdmVudHMiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuR2FtZUxpbmV1cHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJnYW1lcy9saW5ldXBzLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vZ2FtZXMvbGluZXVwcy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMaW5ldXBzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cbkdhbWVTdGF0cyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcImdhbWVzL3N0YXRzLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vZ2FtZXMvc3RhdHMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdHMiLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblNjaGVkdWxlID0gQ29sbGVjdGlvbi5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJzY2hlZHVsZVwiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vc2NoZWR1bGUuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU2NoZWR1bGUiLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblN0YW5kaW5ncyA9IENvbGxlY3Rpb24uZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic3RhbmRpbmdzXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS9zdGFuZGluZ3MuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRpbmdzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblN0YXRzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic3RhdHNcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3N0YXRzLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblRlYW0gPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJ0ZWFtcy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L3RlYW1zLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbSIsIkNvbGxlY3Rpb24gPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuQ29sbGVjdGlvblxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuVGVhbXMgPSBDb2xsZWN0aW9uLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInRlYW1zXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS90ZWFtcy5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zTGlzdFZpZXcgPSByZXF1aXJlICcuL3RlYW1zX2xpc3QnXG5Ub3BTY29yZXJzVmlldyA9IHJlcXVpcmUgJy4vdG9wX3Njb3JlcnMnXG5cbkluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJqdW1ib3Ryb25cIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCBcIkxpaWdhLnB3XCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5wLCBudWxsLCBcIkxpaWdhbiB0aWxhc3RvdCBub3BlYXN0aSBqYSB2YWl2YXR0b21hc3RpXCIpXG4gICAgICApLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlYW1zTGlzdFZpZXcsIHtcInRlYW1zXCI6IChAcHJvcHMudGVhbXMpfSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9wU2NvcmVyc1ZpZXcsIHtcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMpfSlcblxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBJbmRleCIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG57Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbk1hdGNoID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIGV2ZW50OiAoZXZlbnQpIC0+XG4gICAgaWYgZXZlbnQuaGVhZGVyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImNvbFNwYW5cIjogXCIzXCJ9LCAoZXZlbnQuaGVhZGVyKSlcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChAcHJvcHMuZ2FtZVtldmVudC50ZWFtXSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKGV2ZW50LnRpbWUpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChldmVudC50ZXh0KSlcbiAgICAgIClcblxuICByZW5kZXI6IC0+XG4gICAgYWN0aXZlS2V5ID0gc3dpdGNoIEBwcm9wcy5hY3RpdmVcbiAgICAgIHdoZW4gXCJ0aWxhc3RvdFwiIHRoZW4gXCJzdGF0c1wiXG4gICAgICB3aGVuIFwia2V0anV0XCIgdGhlbiBcImxpbmVVcHNcIlxuICAgICAgZWxzZSBcImV2ZW50c1wiXG5cbiAgICBjb25zb2xlLmxvZyBcImV2ZW50c1wiLCBAcHJvcHMuZXZlbnRzXG4gICAgY29uc29sZS5sb2cgXCJsaW5ldXBzXCIsIEBwcm9wcy5saW5lVXBzXG4gICAgY29uc29sZS5sb2cgXCJzdGF0c1wiLCBAcHJvcHMuc3RhdHNcbiAgICBjb25zb2xlLmxvZyBcImdhbWVcIiwgQHByb3BzLmdhbWVcblxuICAgIGV2ZW50cyA9IE9iamVjdC5rZXlzKEBwcm9wcy5ldmVudHMpLnJlZHVjZSAoYXJyLCBrZXkpID0+XG4gICAgICBhcnIucHVzaCBoZWFkZXI6IGtleVxuICAgICAgYXJyID0gYXJyLmNvbmNhdCBAcHJvcHMuZXZlbnRzW2tleV1cbiAgICAgIGFyclxuICAgICwgW11cblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIChAcHJvcHMuZ2FtZS5ob21lKSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIChAcHJvcHMuZ2FtZS5ob21lU2NvcmUpLCBcIiAtIFwiLCAoQHByb3BzLmdhbWUuYXdheVNjb3JlKSksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLCBcIllsZWlzXFx1MDBmNlxcdTAwZTQ6IFwiLCAoQHByb3BzLmdhbWUuYXR0ZW5kYW5jZSkpXG4gICAgICAgICksXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHtcInhzXCI6ICg0KSwgXCJtZFwiOiAoNCl9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCAoQHByb3BzLmdhbWUuYXdheSkpXG4gICAgICAgIClcbiAgICAgICksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2LCB7XCJic1N0eWxlXCI6IFwidGFic1wiLCBcImFjdGl2ZUtleVwiOiAoYWN0aXZlS2V5KSwgXCJyZWZcIjogXCJ0YWJzXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je0Bwcm9wcy5pZH1cIiwgXCJrZXlcIjogXCJldmVudHNcIn0sIFwiVGFwYWh0dW1hdFwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL290dGVsdXQvI3tAcHJvcHMuaWR9L3RpbGFzdG90XCIsIFwia2V5XCI6IFwic3RhdHNcIn0sIFwiVGlsYXN0b3RcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfS9rZXRqdXRcIiwgXCJrZXlcIjogXCJsaW5lVXBzXCJ9LCBcIktldGp1dFwiKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWItY29udGVudFwiLCBcInJlZlwiOiBcInBhbmVzXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcImV2ZW50c1wiLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwiZXZlbnRzXCIpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgICAgICAgKGV2ZW50cy5tYXAgKGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIEBldmVudChldmVudClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInN0YXRzXCIsIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJzdGF0c1wiKX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sXG4gICAgICAgICAgICAgIChAcHJvcHMuc3RhdHMuaG9tZS5wbGF5ZXJzLm1hcCAocGxheWVyKSAtPlxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKVxuICAgICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAgIChAcHJvcHMuc3RhdHMuaG9tZS5nb2FsaWVzLm1hcCAoZ29hbGllKSAtPlxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKGdvYWxpZS5maXJzdE5hbWUpLCBcIiBcIiwgKGdvYWxpZS5sYXN0TmFtZSkpKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgICAgICAgKEBwcm9wcy5zdGF0cy5hd2F5LnBsYXllcnMubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpXG4gICAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgICAgKEBwcm9wcy5zdGF0cy5hd2F5LmdvYWxpZXMubWFwIChnb2FsaWUpIC0+XG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoZ29hbGllLmZpcnN0TmFtZSksIFwiIFwiLCAoZ29hbGllLmxhc3ROYW1lKSkpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJsaW5lVXBzXCIsIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJsaW5lVXBzXCIpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoIiwiVGFibGVTb3J0TWl4aW4gPVxuICBzZXRTb3J0OiAoZXZlbnQpIC0+XG4gICAgc29ydCA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnNvcnRcbiAgICBpZiBzb3J0XG4gICAgICB0eXBlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQudHlwZSBvciBcImludGVnZXJcIlxuICAgICAgaWYgQHN0YXRlLnNvcnRGaWVsZCBpcyBzb3J0XG4gICAgICAgIG5ld1NvcnQgPSBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIiB0aGVuIFwiYXNjXCIgZWxzZSBcImRlc2NcIlxuICAgICAgICBAc2V0U3RhdGUgc29ydERpcmVjdGlvbjogbmV3U29ydCwgc29ydFR5cGU6IHR5cGVcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldFN0YXRlIHNvcnRGaWVsZDogc29ydCwgc29ydFR5cGU6IHR5cGVcblxuICBzb3J0OiAoYSwgYikgLT5cbiAgICBzd2l0Y2ggQHN0YXRlLnNvcnRUeXBlXG4gICAgICB3aGVuIFwiaW50ZWdlclwiXG4gICAgICAgIGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiXG4gICAgICAgICAgYltAc3RhdGUuc29ydEZpZWxkXSAtIGFbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFbQHN0YXRlLnNvcnRGaWVsZF0gLSBiW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICB3aGVuIFwiZmxvYXRcIlxuICAgICAgICBhVmFsdWUgPSBOdW1iZXIoYVtAc3RhdGUuc29ydEZpZWxkXS5yZXBsYWNlKFwiJVwiLFwiXCIpLnJlcGxhY2UoL1xcLHxcXDovLFwiLlwiKSkgb3IgMFxuICAgICAgICBiVmFsdWUgPSBOdW1iZXIoYltAc3RhdGUuc29ydEZpZWxkXS5yZXBsYWNlKFwiJVwiLFwiXCIpLnJlcGxhY2UoL1xcLHxcXDovLFwiLlwiKSkgb3IgMFxuICAgICAgICBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIlxuICAgICAgICAgIGJWYWx1ZSAtIGFWYWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYVZhbHVlIC0gYlZhbHVlXG4gICAgICB3aGVuIFwic3RyaW5nXCJcbiAgICAgICAgaWYgQHN0YXRlLnNvcnREaXJlY3Rpb24gaXMgXCJkZXNjXCJcbiAgICAgICAgICBpZiBiW0BzdGF0ZS5zb3J0RmllbGRdIDwgYVtAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgLTFcbiAgICAgICAgICBlbHNlIGlmIGJbQHN0YXRlLnNvcnRGaWVsZF0gPiBhW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAxXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgYVtAc3RhdGUuc29ydEZpZWxkXSA8IGJbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgICAgIC0xXG4gICAgICAgICAgZWxzZSBpZiBhW0BzdGF0ZS5zb3J0RmllbGRdID4gYltAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgMVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIDBcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZVNvcnRNaXhpbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xue05hdmJhciwgTmF2LCBOYXZJdGVtLCBEcm9wZG93bkJ1dHRvbiwgTWVudUl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5OYXZpZ2F0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgYnJhbmQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL1wiLCBcImNsYXNzTmFtZVwiOiBcIm5hdmJhci1icmFuZFwifSwgXCJMaWlnYVwiKVxuXG4gICAgdGVhbXMgPVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wZG93bkJ1dHRvbiwge1widGl0bGVcIjogXCJKb3Vra3VlZXRcIn0sXG4gICAgICAgIChPYmplY3Qua2V5cyhUZWFtcy5uYW1lc0FuZElkcykubWFwIChuYW1lKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHtcImtleVwiOiAoVGVhbXMubmFtZXNBbmRJZHNbbmFtZV0pLCBcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7VGVhbXMubmFtZXNBbmRJZHNbbmFtZV19XCJ9LCAobmFtZSkpXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIGlmIEBwcm9wcy5pdGVtXG4gICAgICBpdGVtID0gUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IChAcHJvcHMuaXRlbS51cmwpfSwgKEBwcm9wcy5pdGVtLnRpdGxlKSlcblxuICAgIGlmIEBwcm9wcy5kcm9wZG93blxuICAgICAgZHJvcGRvd24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duQnV0dG9uLCB7XCJ0aXRsZVwiOiAoQHByb3BzLmRyb3Bkb3duLnRpdGxlKX0sXG4gICAgICAgIChAcHJvcHMuZHJvcGRvd24uaXRlbXMubWFwIChpdGVtKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHtcImtleVwiOiAoaXRlbS50aXRsZSksIFwiaHJlZlwiOiAoaXRlbS51cmwpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhciwge1wiYnJhbmRcIjogKGJyYW5kKSwgXCJmaXhlZFRvcFwiOiB0cnVlLCBcInRvZ2dsZU5hdktleVwiOiAoMCl9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImNsYXNzTmFtZVwiOiBcImJzLW5hdmJhci1jb2xsYXBzZVwiLCBcImtleVwiOiAoMCksIFwicm9sZVwiOiBcIm5hdmlnYXRpb25cIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9zYXJqYXRhdWx1a2tvXCJ9LCBcIlNhcmphdGF1bHVra29cIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi90aWxhc3RvdFwifSwgXCJUaWxhc3RvdFwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL290dGVsdXRcIn0sIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgKHRlYW1zKSxcbiAgICAgICAgKGl0ZW0pLFxuICAgICAgICAoZHJvcGRvd24pXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmlnYXRpb24iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuUGxheWVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgcGxheWVyID0gQHByb3BzLnBsYXllclxuICAgIHRlYW0gPSBAcHJvcHMudGVhbVxuXG4gICAgcGxheWVycyA9XG4gICAgICB0aXRsZTogXCJQZWxhYWphdFwiLFxuICAgICAgaXRlbXM6IHRlYW0ucm9zdGVyLm1hcCAocGxheWVyKSA9PlxuICAgICAgICB0aXRsZTogXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgIHVybDogXCIvam91a2t1ZWV0LyN7dGVhbS5pbmZvLmlkfS8je3BsYXllci5pZH1cIlxuXG4gICAgIyBUT0RPOiBjaGVjayBwb3NpdGlvbiwgS0ggT0wgVkwgUCB1c2UgcGxheWVycywgTVYgdXNlIGdvYWxpZXNcbiAgICBzdGF0cyA9IHRlYW0uc3RhdHMucGxheWVycy5maWx0ZXIoKHBsYXllcikgPT5cbiAgICAgIFtpZCwgc2x1Z10gPSBwbGF5ZXIuaWQuc3BsaXQoXCIvXCIpXG4gICAgICBpZCBpcyBAcHJvcHMuaWRcbiAgICApWzBdXG5cbiAgICBpdGVtID1cbiAgICAgIHRpdGxlOiB0ZWFtLmluZm8ubmFtZVxuICAgICAgdXJsOiB0ZWFtLmluZm8udXJsXG5cbiAgICBjb25zb2xlLmxvZyBcInBsYXllclwiLCBwbGF5ZXJcbiAgICBjb25zb2xlLmxvZyBcInRlYW1cIiwgdGVhbVxuICAgIGNvbnNvbGUubG9nIFwic3RhdHNcIiwgc3RhdHNcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwicGxheWVyXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCB7XCJkcm9wZG93blwiOiAocGxheWVycyksIFwiaXRlbVwiOiAoaXRlbSl9KSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDIsIG51bGwsIFwiI1wiLCAocGxheWVyLm51bWJlciksIFwiIFwiLCAocGxheWVyLnBvc2l0aW9uKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgzLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtLWxvZ28gI3t0ZWFtLmluZm8uaWR9XCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmluZm8uaWR9XCJ9KSwgXCIgXCIsICh0ZWFtLmluZm8ubmFtZSkpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIChtb21lbnQocGxheWVyLmJpcnRoZGF5KS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIChwbGF5ZXIuaGVpZ2h0KSwgXCIgY21cIiksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIChwbGF5ZXIud2VpZ2h0KSwgXCIga2dcIiksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIChwbGF5ZXIuc2hvb3RzKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk9cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlNcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlJcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIitcXHgyRi1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIitcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIi1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIllWTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiQVZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJWTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTCVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkFcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkElXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJBaWthXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50Ym9keSwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLmdhbWVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMuZ29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5hc3Npc3RzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMucG9pbnRzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMucGVuYWx0aWVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMucGx1c01pbnVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMucGx1c3NlcykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLm1pbnVzZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5wb3dlclBsYXlHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLnNob3J0SGFuZGVkR29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy53aW5uaW5nR29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5zaG90cykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLnNob290aW5nUGVyY2VudGFnZSkpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLmZhY2VvZmZzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMuZmFjZW9mZlBlcmNlbnRhZ2UpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5wbGF5aW5nVGltZUF2ZXJhZ2UpKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5QbGF5ZXJTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aGVhZCwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk5hbWVcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJHYW1lc1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkdvYWxzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiQXNzaXN0c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBvaW50c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBlbmFsdGllc1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIitcXHgyRi1cIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChAcHJvcHMuc3RhdHMubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3twbGF5ZXIudGVhbUlkfS8je3BsYXllci5pZH1cIn0sIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXFx4M0VcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucG9pbnRzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBsdXNNaW51cykpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5TY2hlZHVsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICBtYXRjaExpbms6IChtYXRjaCkgLT5cbiAgICBpZiBtb21lbnQobWF0Y2guZGF0ZSkgPCBtb21lbnQoKVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7bWF0Y2guaWR9XCJ9LCAobWF0Y2guaG9tZSksIFwiIC0gXCIsIChtYXRjaC5hd2F5KSlcbiAgICBlbHNlXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5zcGFuLCBudWxsLCAobWF0Y2guaG9tZSksIFwiIC0gXCIsIChtYXRjaC5hd2F5KSlcblxuICBncm91cGVkU2NoZWR1bGU6IC0+XG4gICAgXy5jaGFpbihAcHJvcHMuc2NoZWR1bGUpLmdyb3VwQnkgKG1hdGNoKSAtPlxuICAgICAgbW9tZW50KG1hdGNoLmRhdGUpLmZvcm1hdChcIllZWVktTU1cIilcblxuICByZW5kZXI6IC0+XG4gICAgbW9udGhseU1hdGNoZXMgPSBAZ3JvdXBlZFNjaGVkdWxlKCkubWFwIChtYXRjaGVzLCBtb250aCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY29sU3BhblwiOiA0fSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKVxuICAgICAgICApLFxuICAgICAgICAobWF0Y2hlcy5tYXAgKG1hdGNoKSA9PlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKG1hdGNoLmlkKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKG1vbWVudChtYXRjaC5kYXRlKS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSwgXCIgXCIsIChtYXRjaC50aW1lKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKEBtYXRjaExpbmsobWF0Y2gpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKG1hdGNoLmhvbWVTY29yZSksIFwiLVwiLCAobWF0Y2guYXdheVNjb3JlKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKG1hdGNoLmF0dGVuZGFuY2UpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiT3R0ZWx1b2hqZWxtYVwiKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LFxuICAgICAgICAgIChtb250aGx5TWF0Y2hlcylcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlZHVsZSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGFibGVTb3J0TWl4aW4gPSByZXF1aXJlICcuL21peGlucy90YWJsZV9zb3J0J1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cblN0YW5kaW5ncyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgbWl4aW5zOiBbVGFibGVTb3J0TWl4aW5dXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHNvcnRGaWVsZDogXCJwb2ludHNcIlxuICAgIHNvcnREaXJlY3Rpb246IFwiZGVzY1wiXG4gICAgc29ydFR5cGU6IFwiaW50ZWdlclwiXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICByZW5kZXI6IC0+XG4gICAgc3RhbmRpbmdzID0gQHByb3BzLnN0YW5kaW5ncy5zb3J0KEBzb3J0KS5tYXAgKHRlYW0pIC0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6ICh0ZWFtLm5hbWUpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLnBvc2l0aW9uKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je1RlYW1zLm5hbWVUb0lkKHRlYW0ubmFtZSl9XCJ9LCAodGVhbS5uYW1lKSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0uZ2FtZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLndpbnMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLnRpZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLmxvc2VzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5leHRyYVBvaW50cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0ucG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5nb2Fsc0ZvcikpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0uZ29hbHNBZ2FpbnN0KSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5wb3dlcnBsYXlQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5zaG9ydGhhbmRQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5wb2ludHNQZXJHYW1lKSlcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCBcIlNhcmphdGF1bHVra29cIiksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aGVhZCwge1wiY2xhc3NOYW1lXCI6IFwic29ydGFibGUtdGhlYWRcIiwgXCJvbkNsaWNrXCI6IChAc2V0U29ydCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiZ2FtZXNcIn0sIFwiT1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcIndpbnNcIn0sIFwiVlwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInRpZXNcIn0sIFwiVFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImxvc2VzXCJ9LCBcIkhcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJleHRyYVBvaW50c1wifSwgXCJMUFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBvaW50c1wifSwgXCJQXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiZ29hbHNGb3JcIn0sIFwiVE1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0FnYWluc3RcIn0sIFwiUE1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJwb3dlcnBsYXlQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiWVYlXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwic2hvcnRoYW5kUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkFWJVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBvaW50c1BlckdhbWVcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJQXFx4MkZPXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50Ym9keSwgbnVsbCxcbiAgICAgICAgICAgIChzdGFuZGluZ3MpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YW5kaW5ncyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xue1RhYlBhbmUsIE5hdiwgTmF2SXRlbX0gPSByZXF1aXJlIFwicmVhY3QtYm9vdHN0cmFwXCJcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5cblN0YXRzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcIm1hYWxpdmFoZGl0XCIgdGhlbiBcImdvYWxpZXNcIlxuICAgICAgZWxzZSBcInBsYXllcnNcIlxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiVGlsYXN0b3RcIiksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3RpbGFzdG90XCIsIFwia2V5XCI6IFwicGxheWVyc1wifSwgXCJLZW50dFxcdTAwZTRwZWxhYWphdFwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvdGlsYXN0b3QvbWFhbGl2YWhkaXRcIiwgXCJrZXlcIjogXCJnb2FsaWVzXCJ9LCBcIk1hYWxpdmFoZGl0XCIpXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFiLWNvbnRlbnRcIiwgXCJyZWZcIjogXCJwYW5lc1wifSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInBsYXllcnNcIiwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInBsYXllcnNcIil9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDIsIG51bGwsIFwiS2VudHRcXHUwMGU0cGVsYWFqYXRcIilcblxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJnb2FsaWVzXCIsIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJnb2FsaWVzXCIpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgyLCBudWxsLCBcIk1hYWxpdmFoZGl0XCIpXG5cbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblBsYXllclN0YXRzID0gcmVxdWlyZSAnLi9wbGF5ZXJfc3RhdHMnXG5UZWFtU2NoZWR1bGUgPSByZXF1aXJlICcuL3RlYW1fc2NoZWR1bGUnXG5UZWFtU3RhdHMgPSByZXF1aXJlICcuL3RlYW1fc3RhdHMnXG5UZWFtUm9zdGVyID0gcmVxdWlyZSAnLi90ZWFtX3Jvc3Rlcidcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UZWFtcyA9IHJlcXVpcmUgJy4uL2xpYi90ZWFtcydcblxue1RhYlBhbmUsIEp1bWJvdHJvbiwgQnV0dG9uVG9vbGJhciwgQnV0dG9uLCBDb2wsIFJvdywgTmF2LCBOYXZJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuXG5UZWFtID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIGxvZ286IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaW1nLCB7XCJzcmNcIjogKFRlYW1zLmxvZ28oQHByb3BzLnRlYW0uaW5mby5uYW1lKSksIFwiYWx0XCI6IChAcHJvcHMudGVhbS5pbmZvLm5hbWUpfSlcblxuICByZW5kZXI6IC0+XG4gICAgYWN0aXZlS2V5ID0gc3dpdGNoIEBwcm9wcy5hY3RpdmVcbiAgICAgIHdoZW4gXCJwZWxhYWphdFwiIHRoZW4gXCJwbGF5ZXJzXCJcbiAgICAgIHdoZW4gXCJ0aWxhc3RvdFwiIHRoZW4gXCJzdGF0c1wiXG4gICAgICBlbHNlIFwic2NoZWR1bGVcIlxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEp1bWJvdHJvbiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoMTIpLCBcIm1kXCI6ICg2KX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCAoQGxvZ28oKSksIFwiIFwiLCAoQHByb3BzLnRlYW0uaW5mby5uYW1lKSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDEyKSwgXCJtZFwiOiAoNil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRlYW0tY29udGFpbmVyXCJ9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnVsLCBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00ubGksIG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmxvbmdOYW1lKSksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5saSwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8uYWRkcmVzcykpLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00ubGksIG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmVtYWlsKSlcbiAgICAgICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtcImJzU3R5bGVcIjogXCJwcmltYXJ5XCIsIFwiYnNTaXplXCI6IFwibGFyZ2VcIiwgXCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLnRpY2tldHNVcmwpfSwgXCJMaXB1dFwiKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7XCJic1N0eWxlXCI6IFwicHJpbWFyeVwiLCBcImJzU2l6ZVwiOiBcImxhcmdlXCIsIFwiaHJlZlwiOiAoQHByb3BzLnRlYW0uaW5mby5sb2NhdGlvblVybCl9LCBcIkhhbGxpbiBzaWphaW50aVwiKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLmlkfVwiLCBcImtleVwiOiBcInNjaGVkdWxlXCJ9LCBcIk90dGVsdXRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLmlkfS90aWxhc3RvdFwiLCBcImtleVwiOiBcInN0YXRzXCJ9LCBcIlRpbGFzdG90XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy5pZH0vcGVsYWFqYXRcIiwgXCJrZXlcIjogXCJwbGF5ZXJzXCJ9LCBcIlBlbGFhamF0XCIpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYi1jb250ZW50XCIsIFwicmVmXCI6IFwicGFuZXNcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInNjaGVkdWxlXCIsIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJzY2hlZHVsZVwiKX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCBcIk90dGVsdXRcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVNjaGVkdWxlLCB7XCJ0ZWFtXCI6IChAcHJvcHMudGVhbSl9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic3RhdHNcIiwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInN0YXRzXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiVGlsYXN0b3RcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVN0YXRzLCB7XCJ0ZWFtSWRcIjogKEBwcm9wcy5pZCksIFwic3RhdHNcIjogKEBwcm9wcy50ZWFtLnN0YXRzKX0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJwbGF5ZXJzXCIsIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJwbGF5ZXJzXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiUGVsYWFqYXRcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVJvc3Rlciwge1widGVhbUlkXCI6IChAcHJvcHMuaWQpLCBcInJvc3RlclwiOiAoQHByb3BzLnRlYW0ucm9zdGVyKX0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbVJvc3RlciA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZ3JvdXBlZFJvc3RlcjogLT5cbiAgICBfLmNoYWluKEBwcm9wcy5yb3N0ZXIpXG4gICAgLmdyb3VwQnkoKHBsYXllcikgLT4gcGxheWVyLnBvc2l0aW9uKVxuICAgIC5yZWR1Y2UoKHJlc3VsdCwgcGxheWVyLCBwb3NpdGlvbikgLT5cbiAgICAgIGdyb3VwID0gc3dpdGNoXG4gICAgICAgIHdoZW4gXy5pbmNsdWRlKFtcIktIXCIsIFwiT0xcIiwgXCJWTFwiXSwgcG9zaXRpb24pIHRoZW4gXCJIecO2a2vDpMOkasOkdFwiXG4gICAgICAgIHdoZW4gXy5pbmNsdWRlKFtcIk9QXCIsIFwiVlBcIl0sIHBvc2l0aW9uKSB0aGVuIFwiUHVvbHVzdGFqYXRcIlxuICAgICAgICB3aGVuIHBvc2l0aW9uIGlzIFwiTVZcIiB0aGVuIFwiTWFhbGl2YWhkaXRcIlxuICAgICAgcmVzdWx0W2dyb3VwXSB8fD0gW11cbiAgICAgIHJlc3VsdFtncm91cF0ucHVzaCBwbGF5ZXJcbiAgICAgIHJlc3VsdFxuICAgICwge30pXG5cbiAgcmVuZGVyOiAtPlxuICAgIGdyb3VwcyA9IEBncm91cGVkUm9zdGVyKCkubWFwIChwbGF5ZXJzLCBncm91cCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCB7XCJrZXlcIjogKGdyb3VwKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJjb2xTcGFuXCI6IDZ9LCAoZ3JvdXApKVxuICAgICAgICApLFxuICAgICAgICAoXy5jaGFpbihwbGF5ZXJzKS5mbGF0dGVuKCkubWFwIChwbGF5ZXIpID0+XG4gICAgICAgICAgdXJsID0gXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJcbiAgICAgICAgICB0aXRsZSA9IFwiI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImhyZWZcIjogKHVybCl9LCAodGl0bGUpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uc3Ryb25nLCBudWxsLCAocGxheWVyLm51bWJlcikpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmhlaWdodCkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIud2VpZ2h0KSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaG9vdHMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAobW9tZW50KCkuZGlmZihwbGF5ZXIuYmlydGhkYXksIFwieWVhcnNcIikpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1yb3N0ZXJcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTmltaVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk51bWVyb1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBpdHV1c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBhaW5vXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiS1xcdTAwZTR0aXN5eXNcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJJa1xcdTAwZTRcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChncm91cHMpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1Sb3N0ZXIiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5tb21lbnQubG9jYWxlKCdmaSdcbiAgbW9udGhzIDogW1xuICAgIFwiVGFtbWlrdXVcIiwgXCJIZWxtaWt1dVwiLCBcIk1hYWxpc2t1dVwiLCBcIkh1aHRpa3V1XCIsIFwiVG91a29rdXVcIiwgXCJLZXPDpGt1dVwiLCBcIkhlaW7DpGt1dVwiLFxuICAgIFwiRWxva3V1XCIsIFwiU3l5c2t1dVwiLCBcIkxva2FrdXVcIiwgXCJNYXJyYXNrdXVcIiwgXCJKb3VsdWt1dVwiXG4gIF1cbilcbm1vbWVudC5sb2NhbGUoJ2ZpJylcblxuVGVhbVNjaGVkdWxlID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBtYXRjaExpbms6IChtYXRjaCkgLT5cbiAgICBpZiBtb21lbnQobWF0Y2guZGF0ZSkgPCBtb21lbnQoKVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7bWF0Y2guaWR9XCJ9LCAoQHRpdGxlU3R5bGUobWF0Y2guaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUobWF0Y2guYXdheSkpKVxuICAgIGVsc2VcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnNwYW4sIG51bGwsIChAdGl0bGVTdHlsZShtYXRjaC5ob21lKSksIFwiIC0gXCIsIChAdGl0bGVTdHlsZShtYXRjaC5hd2F5KSkpXG5cbiAgdGl0bGVTdHlsZTogKG5hbWUpIC0+XG4gICAgaWYgQHByb3BzLnRlYW0uaW5mby5uYW1lIGlzIG5hbWVcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnN0cm9uZywgbnVsbCwgKG5hbWUpKVxuICAgIGVsc2VcbiAgICAgIG5hbWVcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5pbWcsIHtcInNyY1wiOiAoVGVhbXMubG9nbyhuYW1lKSksIFwiYWx0XCI6IChuYW1lKX0pXG5cbiAgZ3JvdXBlZFNjaGVkdWxlOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnRlYW0uc2NoZWR1bGUpLmdyb3VwQnkgKG1hdGNoKSAtPlxuICAgICAgbW9tZW50KG1hdGNoLmRhdGUpLmZvcm1hdChcIllZWVktTU1cIilcblxuICByZW5kZXI6IC0+XG4gICAgbW9udGhseU1hdGNoZXMgPSBAZ3JvdXBlZFNjaGVkdWxlKCkubWFwIChtYXRjaGVzLCBtb250aCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCB7XCJrZXlcIjogKG1vbnRoKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJjb2xTcGFuXCI6IDR9LCAobW9tZW50KG1vbnRoLCBcIllZWVktTU1cIikuZm9ybWF0KFwiTU1NTVwiKSkpXG4gICAgICAgICksXG4gICAgICAgIChtYXRjaGVzLm1hcCAobWF0Y2gpID0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAobWF0Y2guaWQpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAobW9tZW50KG1hdGNoLmRhdGUpLmZvcm1hdChcIkRELk1NLllZWVlcIikpLCBcIiBcIiwgKG1hdGNoLnRpbWUpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoQG1hdGNoTGluayhtYXRjaCkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAobWF0Y2guaG9tZVNjb3JlKSwgXCItXCIsIChtYXRjaC5hd2F5U2NvcmUpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAobWF0Y2guYXR0ZW5kYW5jZSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aGVhZCwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBcXHUwMGU0aXZcXHUwMGU0bVxcdTAwZTRcXHUwMGU0clxcdTAwZTRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJKb3Vra3VlZXRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJUdWxvc1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIllsZWlzXFx1MDBmNm1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICAobW9udGhseU1hdGNoZXMpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1TY2hlZHVsZSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGFibGVTb3J0TWl4aW4gPSByZXF1aXJlICcuL21peGlucy90YWJsZV9zb3J0J1xuXG5UZWFtU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIG1peGluczogW1RhYmxlU29ydE1peGluXVxuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBzb3J0RmllbGQ6IFwicG9pbnRzXCJcbiAgICBzb3J0RGlyZWN0aW9uOiBcImRlc2NcIlxuICAgIHNvcnRUeXBlOiBcImludGVnZXJcIlxuXG4gIHJlbmRlcjogLT5cbiAgICBwbGF5ZXJzID0gQHByb3BzLnN0YXRzLnBsYXllcnMuc29ydChAc29ydCkubWFwIChwbGF5ZXIpID0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nYW1lcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5hc3Npc3RzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBvaW50cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucGx1c01pbnVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBsdXNzZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIubWludXNlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wb3dlclBsYXlHb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaG9ydEhhbmRlZEdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLndpbm5pbmdHb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaG90cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaG9vdGluZ1BlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZmFjZW9mZnMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZmFjZW9mZlBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucGxheWluZ1RpbWVBdmVyYWdlKSlcbiAgICAgIClcblxuICAgIGdvYWxpZXMgPSBAcHJvcHMuc3RhdHMuZ29hbGllcy5tYXAgKHBsYXllcikgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nYW1lcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci53aW5zKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnRpZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIubG9zc2VzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnNhdmVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdvYWxzQWxsb3dlZCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaHV0b3V0cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nb2Fsc0F2ZXJhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuc2F2aW5nUGVyY2VudGFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5hc3Npc3RzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBvaW50cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIud2luUGVyY2VudGFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwge1wiY29sU3BhblwiOiAyfSwgKHBsYXllci5taW51dGVzKSlcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRlYW0tcm9zdGVyXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aGVhZCwge1wiY2xhc3NOYW1lXCI6IFwic29ydGFibGUtdGhlYWRcIiwgXCJvbkNsaWNrXCI6IChAc2V0U29ydCl9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImNvbFNwYW5cIjogMTd9LCBcIlBlbGFhamF0XCIpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJsYXN0TmFtZVwiLCBcImRhdGEtdHlwZVwiOiBcInN0cmluZ1wifSwgXCJOaW1pXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImdhbWVzXCJ9LCBcIk9cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiZ29hbHNcIn0sIFwiTVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJhc3Npc3RzXCJ9LCBcIlNcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwicG9pbnRzXCJ9LCBcIlBcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwicGVuYWx0aWVzXCJ9LCBcIlJcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwicGx1c01pbnVzXCJ9LCBcIitcXHgyRi1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwicGx1c3Nlc1wifSwgXCIrXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcIm1pbnVzZXNcIn0sIFwiLVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJwb3dlclBsYXlHb2Fsc1wifSwgXCJZVk1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwic2hvcnRIYW5kZWRHb2Fsc1wifSwgXCJBVk1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwid2lubmluZ0dvYWxzXCJ9LCBcIlZNXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInNob3RzXCJ9LCBcIkxcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwic2hvb3RpbmdQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiTCVcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiZmFjZW9mZnNcIn0sIFwiQVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJmYWNlb2ZmUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkElXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBsYXlpbmdUaW1lQXZlcmFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkFpa2FcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCBudWxsLFxuICAgICAgICAgIChwbGF5ZXJzKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aGVhZCwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJjb2xTcGFuXCI6IDE3fSwgXCJNYWFsaXZhaGRpdFwiKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJOaW1pXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUE9cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJWXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiVFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkhcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJUT1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBNXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTlBcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJLQVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlQlXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlNcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJQXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUlwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlYlXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImNvbFNwYW5cIjogMn0sIFwiQWlrYVwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGJvZHksIG51bGwsXG4gICAgICAgICAgKGdvYWxpZXMpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRlYW1zTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwicm93XCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtcy12aWV3IGNvbC14cy0xMiBjb2wtc20tMTIgY29sLW1kLTEyIGNvbC1sZy0xMlwifSxcbiAgICAgICAgKFxuICAgICAgICAgIEBwcm9wcy50ZWFtcy5tYXAgKHRlYW0pIC0+XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJrZXlcIjogKHRlYW0uaWQpLCBcImNsYXNzTmFtZVwiOiBcInRlYW0tbG9nbyAje3RlYW0uaWR9XCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmlkfVwifSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtc0xpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVG9wU2NvcmVycyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aGVhZCwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk5pbWlcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJPdHRlbHV0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTWFhbGl0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiU3lcXHUwMGY2dFxcdTAwZjZ0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUGlzdGVldFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKEBwcm9wcy5zdGF0cy5zY29yaW5nU3RhdHMuZmlsdGVyIChwbGF5ZXIsIGluZGV4KSAtPlxuICAgICAgICAgIGluZGV4IDwgMjBcbiAgICAgICAgLm1hcCAocGxheWVyKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7cGxheWVyLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZ2FtZXMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdvYWxzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5hc3Npc3RzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wb2ludHMpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUb3BTY29yZXJzIl19
