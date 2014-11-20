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
var GameView, IndexView, PlayerView, Q, ScheduleView, StandingsView, StatsView, TeamView;

Q = require('q');

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
      var game;
      game = schedule.find(function(g) {
        return g.id === id;
      });
      return {
        title: "Ottelu - " + (game.get("home")) + " vs " + (game.get("away")),
        component: GameView({
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



},{"./views/game":"/Users/hoppula/repos/liiga_frontend/views/game.coffee","./views/index":"/Users/hoppula/repos/liiga_frontend/views/index.coffee","./views/player":"/Users/hoppula/repos/liiga_frontend/views/player.coffee","./views/schedule":"/Users/hoppula/repos/liiga_frontend/views/schedule.coffee","./views/standings":"/Users/hoppula/repos/liiga_frontend/views/standings.coffee","./views/stats":"/Users/hoppula/repos/liiga_frontend/views/stats.coffee","./views/team":"/Users/hoppula/repos/liiga_frontend/views/team.coffee","q":"q"}],"/Users/hoppula/repos/liiga_frontend/stores.coffee":[function(require,module,exports){
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
      return React.createElement(React.DOM.tr, {
        "key": event.header
      }, React.createElement(React.DOM.th, {
        "colSpan": "3"
      }, event.header));
    } else {
      return React.createElement(React.DOM.tr, {
        "key": i
      }, React.createElement(React.DOM.td, null, this.props.game[event.team]), React.createElement(React.DOM.td, null, event.time), React.createElement(React.DOM.td, null, event.text));
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
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
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
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
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
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped"
    }, this.props.stats.home.players.map(function(player) {
      return React.createElement(React.DOM.tr, {
        "key": player.id
      }, React.createElement(React.DOM.td, null, player.firstName, " ", player.lastName));
    }), this.props.stats.home.goalies.map(function(goalie) {
      return React.createElement(React.DOM.tr, {
        "key": goalie.id
      }, React.createElement(React.DOM.td, null, goalie.firstName, " ", goalie.lastName));
    })), React.createElement(React.DOM.table, {
      "className": "table table-striped"
    }, this.props.stats.away.players.map(function(player) {
      return React.createElement(React.DOM.tr, {
        "key": player.id
      }, React.createElement(React.DOM.td, null, player.firstName, " ", player.lastName));
    }), this.props.stats.away.goalies.map(function(goalie) {
      return React.createElement(React.DOM.tr, {
        "key": goalie.id
      }, React.createElement(React.DOM.td, null, goalie.firstName, " ", goalie.lastName));
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
  getInitialState: function() {
    return {
      firstDate: moment().startOf("month"),
      lastDate: moment().endOf("month"),
      showPrevious: false,
      showNext: false
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
      return React.createElement(React.DOM.a, {
        "href": "/ottelut/" + game.id
      }, game.home, " - ", game.away);
    } else {
      return React.createElement(React.DOM.span, null, game.home, " - ", game.away);
    }
  },
  showPrevious: function() {
    var firstDate;
    firstDate = this.monthRanges()[0];
    if (!this.state.firstDate.isSame(firstDate)) {
      return React.createElement(React.DOM.table, {
        "className": "table table-striped"
      }, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
        "className": "load-more",
        "colSpan": 4,
        "onClick": this.loadPrevious
      }, "N\u00e4yt\u00e4 edelliset kuukaudet...")));
    } else {
      return null;
    }
  },
  showNext: function() {
    var lastDate, _ref;
    _ref = this.monthRanges(), lastDate = _ref[_ref.length - 1];
    if (!this.state.lastDate.isSame(lastDate)) {
      return React.createElement(React.DOM.table, {
        "className": "table table-striped"
      }, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
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
      firstDate: firstDate
    });
  },
  loadNext: function() {
    var lastDate, _ref;
    _ref = this.monthRanges(), lastDate = _ref[_ref.length - 1];
    return this.setState({
      lastDate: lastDate
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
        return React.createElement(React.DOM.table, {
          "className": "table table-striped team-schedule"
        }, React.createElement(React.DOM.tbody, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM")))), datesWithGames.map(function(games, gameDate) {
          return React.createElement(React.DOM.tbody, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
            "className": "game-date",
            "colSpan": 4
          }, gameDate)), games.map(function(game) {
            return React.createElement(React.DOM.tr, {
              "key": game.id
            }, React.createElement(React.DOM.td, null, game.time), React.createElement(React.DOM.td, null, _this.gameLink(game)), React.createElement(React.DOM.td, null, game.homeScore, "-", game.awayScore), React.createElement(React.DOM.td, null, game.attendance));
          }));
        }));
      };
    })(this));
  },
  render: function() {
    return React.createElement(React.DOM.div, {
      "className": "schedule"
    }, React.createElement(Navigation, null), React.createElement(React.DOM.h1, null, "Otteluohjelma"), React.createElement(React.DOM.div, {
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
      "animation": false,
      "active": activeKey === "players"
    }, React.createElement(React.DOM.h2, null, "Kentt\u00e4pelaajat")), React.createElement(TabPane, {
      "key": "goalies",
      "animation": false,
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
      "animation": false,
      "active": activeKey === "schedule"
    }, React.createElement(React.DOM.h1, null, "Ottelut"), React.createElement(TeamSchedule, {
      "team": this.props.team
    })), React.createElement(TabPane, {
      "key": "stats",
      "animation": false,
      "active": activeKey === "stats"
    }, React.createElement(React.DOM.h1, null, "Tilastot"), React.createElement(TeamStats, {
      "teamId": this.props.id,
      "stats": this.props.team.stats
    })), React.createElement(TabPane, {
      "key": "players",
      "animation": false,
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
  gameLink: function(game) {
    if (moment(game.date) < moment()) {
      return React.createElement(React.DOM.a, {
        "href": "/ottelut/" + game.id
      }, this.titleStyle(game.home), " - ", this.titleStyle(game.away));
    } else {
      return React.createElement(React.DOM.span, null, this.titleStyle(game.home), " - ", this.titleStyle(game.away));
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
    return _.chain(this.props.team.schedule).groupBy(function(game) {
      return moment(game.date).format("YYYY-MM");
    });
  },
  render: function() {
    var monthlyGames;
    monthlyGames = this.groupedSchedule().map((function(_this) {
      return function(games, month) {
        return React.createElement(React.DOM.tbody, {
          "key": month
        }, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM"))), games.map(function(game) {
          return React.createElement(React.DOM.tr, {
            "key": game.id
          }, React.createElement(React.DOM.td, null, moment(game.date).format("DD.MM.YYYY"), " ", game.time), React.createElement(React.DOM.td, null, _this.gameLink(game)), React.createElement(React.DOM.td, null, game.homeScore, "-", game.awayScore), React.createElement(React.DOM.td, null, game.attendance));
        }));
      };
    })(this));
    return React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped team-schedule"
    }, React.createElement(React.DOM.thead, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, null, "P\u00e4iv\u00e4m\u00e4\u00e4r\u00e4"), React.createElement(React.DOM.th, null, "Joukkueet"), React.createElement(React.DOM.th, null, "Tulos"), React.createElement(React.DOM.th, null, "Yleis\u00f6m\u00e4\u00e4r\u00e4"))), monthlyGames));
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
        }, React.createElement(React.DOM.td, null, React.createElement(React.DOM.a, {
          "href": "/joukkueet/" + _this.props.teamId + "/" + player.id
        }, player.firstName, " ", player.lastName)), React.createElement(React.DOM.td, null, player.games), React.createElement(React.DOM.td, null, player.wins), React.createElement(React.DOM.td, null, player.ties), React.createElement(React.DOM.td, null, player.losses), React.createElement(React.DOM.td, null, player.saves), React.createElement(React.DOM.td, null, player.goalsAllowed), React.createElement(React.DOM.td, null, player.shutouts), React.createElement(React.DOM.td, null, player.goalsAverage), React.createElement(React.DOM.td, null, player.savingPercentage), React.createElement(React.DOM.td, null, player.goals), React.createElement(React.DOM.td, null, player.assists), React.createElement(React.DOM.td, null, player.points), React.createElement(React.DOM.td, null, player.penalties), React.createElement(React.DOM.td, null, player.winPercentage), React.createElement(React.DOM.td, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY2xpZW50LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2NvbmZpZy9hcGktYnJvd3Nlci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9saWIvdGVhbXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3RjbGljay9saWIvZmFzdGNsaWNrLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvb3B0aW9ucy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9yb3V0ZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvZ2FtZV9saW5ldXBzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2xpbmV1cHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZV9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9taXhpbnMvdGFibGVfc29ydC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9uYXZpZ2F0aW9uLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3BsYXllci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXJfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc2NoZWR1bGUuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW0uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9yb3N0ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1zX2xpc3QuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdG9wX3Njb3JlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSx3REFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FBUixDQUFBOztBQUFBLFVBQ0EsR0FBYSxPQUFBLENBQVEsWUFBUixDQURiLENBQUE7O0FBQUEsU0FFQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRlosQ0FBQTs7QUFBQSxPQUdBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLFlBS0EsR0FBZSxRQUFRLENBQUMsY0FBVCxDQUF3QixPQUFPLENBQUMsS0FBaEMsQ0FMZixDQUFBOztBQUFBLE9BT08sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsT0FBRCxHQUFBOztJQUFDLFVBQVE7R0FDeEI7QUFBQSxFQUFBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixPQUE5QixDQUF1QyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQTFDLEdBQXVELGFBQUEsR0FBYSxPQUFPLENBQUMsS0FBNUUsQ0FBQTtTQUNBLEtBQUssQ0FBQyxlQUFOLENBQXNCLE9BQU8sQ0FBQyxTQUE5QixFQUF5QyxZQUF6QyxFQUZlO0FBQUEsQ0FQakIsQ0FBQTs7QUFBQSxPQVdPLENBQUMsVUFBUixHQUFxQixTQUFDLE1BQUQsR0FBQTtTQUNuQixTQUFTLENBQUMsTUFBVixDQUFpQixRQUFRLENBQUMsSUFBMUIsRUFEbUI7QUFBQSxDQVhyQixDQUFBOztBQUFBLEdB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3J6QkEsSUFBQSxjQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsTUFDQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRFQsQ0FBQTs7QUFBQSxNQUdN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QUE5QixFQUFrQztBQUFBLFFBQUMsS0FBQSxFQUFRLE1BQU0sQ0FBQyxFQUFoQjtPQUFsQyxFQUNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBd0MsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUE5QixFQUFpQztBQUFBLFFBQUMsTUFBQSxFQUFTLGFBQUEsR0FBYSxNQUFNLENBQUMsTUFBcEIsR0FBMkIsR0FBM0IsR0FBOEIsTUFBTSxDQUFDLEVBQS9DO09BQWpDLEVBQXdGLE1BQU0sQ0FBQyxTQUEvRixFQUEyRyxHQUEzRyxFQUFpSCxNQUFNLENBQUMsUUFBeEgsQ0FBeEMsQ0FERixFQUVFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBeUMsTUFBTSxDQUFDLEtBQWhELENBRkYsRUFHRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXlDLE1BQU0sQ0FBQyxLQUFoRCxDQUhGLEVBSUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF5QyxNQUFNLENBQUMsT0FBaEQsQ0FKRixFQUtFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBeUMsTUFBTSxDQUFDLE1BQWhELENBTEYsRUFERztJQUFBLENBRkosQ0FWSCxDQURGLEVBRE07RUFBQSxDQUFSO0NBRlcsQ0FGYixDQUFBOztBQUFBLE1BOEJNLENBQUMsT0FBUCxHQUFpQixVQTlCakIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbmNlcmViZWxsdW0gPSByZXF1aXJlICdjZXJlYmVsbHVtJ1xuRmFzdENsaWNrID0gcmVxdWlyZSAnZmFzdGNsaWNrJ1xub3B0aW9ucyA9IHJlcXVpcmUgJy4vb3B0aW9ucydcblxuYXBwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0aW9ucy5hcHBJZClcblxub3B0aW9ucy5yZW5kZXIgPSAob3B0aW9ucz17fSkgLT5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0aXRsZVwiKVswXS5pbm5lckhUTUwgPSBcIkxpaWdhLnB3IC0gI3tvcHRpb25zLnRpdGxlfVwiXG4gIFJlYWN0LnJlbmRlckNvbXBvbmVudChvcHRpb25zLmNvbXBvbmVudCwgYXBwQ29udGFpbmVyKVxuXG5vcHRpb25zLmluaXRpYWxpemUgPSAoY2xpZW50KSAtPlxuICBGYXN0Q2xpY2suYXR0YWNoKGRvY3VtZW50LmJvZHkpXG4gICNSZWFjdC5pbml0aWFsaXplVG91Y2hFdmVudHModHJ1ZSlcblxuYXBwID0gY2VyZWJlbGx1bS5jbGllbnQob3B0aW9ucykiLCJtb2R1bGUuZXhwb3J0cyA9XG4gIHVybDogZG9jdW1lbnQubG9jYXRpb24ub3JpZ2luLnJlcGxhY2UoXCI0MDAwXCIsXCI4MDgwXCIpXG4gICN1cmw6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwXCIiLCJUZWFtcyA9XG4gIG5hbWVzQW5kSWRzOlxuICAgIFwiw4Rzc8OkdFwiOiBcImFzc2F0XCJcbiAgICBcIkJsdWVzXCI6IFwiYmx1ZXNcIlxuICAgIFwiSElGS1wiOiBcImhpZmtcIlxuICAgIFwiSFBLXCI6IFwiaHBrXCJcbiAgICBcIklsdmVzXCI6IFwiaWx2ZXNcIlxuICAgIFwiU3BvcnRcIjogXCJzcG9ydFwiXG4gICAgXCJKWVBcIjogXCJqeXBcIlxuICAgIFwiS2FsUGFcIjogXCJrYWxwYVwiXG4gICAgXCJLw6RycMOkdFwiOiBcImthcnBhdFwiXG4gICAgXCJMdWtrb1wiOiBcImx1a2tvXCJcbiAgICBcIlBlbGljYW5zXCI6IFwicGVsaWNhbnNcIlxuICAgIFwiU2FpUGFcIjogXCJzYWlwYVwiXG4gICAgXCJUYXBwYXJhXCI6IFwidGFwcGFyYVwiXG4gICAgXCJUUFNcIjogXCJ0cHNcIlxuXG4gIGxvZ286IChuYW1lKSAtPlxuICAgIFwiL3N2Zy8je0BuYW1lc0FuZElkc1tuYW1lXX0uc3ZnXCJcblxuICBpZFRvTmFtZTogKGlkKSAtPlxuICAgIGlkcyA9IE9iamVjdC5rZXlzKEBuYW1lc0FuZElkcykucmVkdWNlIChvYmosIG5hbWUpID0+XG4gICAgICBvYmpbQG5hbWVzQW5kSWRzW25hbWVdXSA9IG5hbWVcbiAgICAgIG9ialxuICAgICwge31cbiAgICBpZHNbaWRdXG5cbiAgbmFtZVRvSWQ6IChuYW1lKSAtPlxuICAgIEBuYW1lc0FuZElkc1tuYW1lXVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1zIiwiLyoqXG4gKiBAcHJlc2VydmUgRmFzdENsaWNrOiBwb2x5ZmlsbCB0byByZW1vdmUgY2xpY2sgZGVsYXlzIG9uIGJyb3dzZXJzIHdpdGggdG91Y2ggVUlzLlxuICpcbiAqIEB2ZXJzaW9uIDEuMC4zXG4gKiBAY29kaW5nc3RhbmRhcmQgZnRsYWJzLWpzdjJcbiAqIEBjb3B5cmlnaHQgVGhlIEZpbmFuY2lhbCBUaW1lcyBMaW1pdGVkIFtBbGwgUmlnaHRzIFJlc2VydmVkXVxuICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UgKHNlZSBMSUNFTlNFLnR4dClcbiAqL1xuXG4vKmpzbGludCBicm93c2VyOnRydWUsIG5vZGU6dHJ1ZSovXG4vKmdsb2JhbCBkZWZpbmUsIEV2ZW50LCBOb2RlKi9cblxuXG4vKipcbiAqIEluc3RhbnRpYXRlIGZhc3QtY2xpY2tpbmcgbGlzdGVuZXJzIG9uIHRoZSBzcGVjaWZpZWQgbGF5ZXIuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0c1xuICovXG5mdW5jdGlvbiBGYXN0Q2xpY2sobGF5ZXIsIG9wdGlvbnMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgb2xkT25DbGljaztcblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHQvKipcblx0ICogV2hldGhlciBhIGNsaWNrIGlzIGN1cnJlbnRseSBiZWluZyB0cmFja2VkLlxuXHQgKlxuXHQgKiBAdHlwZSBib29sZWFuXG5cdCAqL1xuXHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblxuXG5cdC8qKlxuXHQgKiBUaW1lc3RhbXAgZm9yIHdoZW4gY2xpY2sgdHJhY2tpbmcgc3RhcnRlZC5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IDA7XG5cblxuXHQvKipcblx0ICogVGhlIGVsZW1lbnQgYmVpbmcgdHJhY2tlZCBmb3IgYSBjbGljay5cblx0ICpcblx0ICogQHR5cGUgRXZlbnRUYXJnZXRcblx0ICovXG5cdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cblxuXHQvKipcblx0ICogWC1jb29yZGluYXRlIG9mIHRvdWNoIHN0YXJ0IGV2ZW50LlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudG91Y2hTdGFydFggPSAwO1xuXG5cblx0LyoqXG5cdCAqIFktY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRvdWNoU3RhcnRZID0gMDtcblxuXG5cdC8qKlxuXHQgKiBJRCBvZiB0aGUgbGFzdCB0b3VjaCwgcmV0cmlldmVkIGZyb20gVG91Y2guaWRlbnRpZmllci5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLmxhc3RUb3VjaElkZW50aWZpZXIgPSAwO1xuXG5cblx0LyoqXG5cdCAqIFRvdWNobW92ZSBib3VuZGFyeSwgYmV5b25kIHdoaWNoIGEgY2xpY2sgd2lsbCBiZSBjYW5jZWxsZWQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50b3VjaEJvdW5kYXJ5ID0gb3B0aW9ucy50b3VjaEJvdW5kYXJ5IHx8IDEwO1xuXG5cblx0LyoqXG5cdCAqIFRoZSBGYXN0Q2xpY2sgbGF5ZXIuXG5cdCAqXG5cdCAqIEB0eXBlIEVsZW1lbnRcblx0ICovXG5cdHRoaXMubGF5ZXIgPSBsYXllcjtcblxuXHQvKipcblx0ICogVGhlIG1pbmltdW0gdGltZSBiZXR3ZWVuIHRhcCh0b3VjaHN0YXJ0IGFuZCB0b3VjaGVuZCkgZXZlbnRzXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50YXBEZWxheSA9IG9wdGlvbnMudGFwRGVsYXkgfHwgMjAwO1xuXG5cdGlmIChGYXN0Q2xpY2subm90TmVlZGVkKGxheWVyKSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIFNvbWUgb2xkIHZlcnNpb25zIG9mIEFuZHJvaWQgZG9uJ3QgaGF2ZSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuXHRmdW5jdGlvbiBiaW5kKG1ldGhvZCwgY29udGV4dCkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ldGhvZC5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpOyB9O1xuXHR9XG5cblxuXHR2YXIgbWV0aG9kcyA9IFsnb25Nb3VzZScsICdvbkNsaWNrJywgJ29uVG91Y2hTdGFydCcsICdvblRvdWNoTW92ZScsICdvblRvdWNoRW5kJywgJ29uVG91Y2hDYW5jZWwnXTtcblx0dmFyIGNvbnRleHQgPSB0aGlzO1xuXHRmb3IgKHZhciBpID0gMCwgbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0Y29udGV4dFttZXRob2RzW2ldXSA9IGJpbmQoY29udGV4dFttZXRob2RzW2ldXSwgY29udGV4dCk7XG5cdH1cblxuXHQvLyBTZXQgdXAgZXZlbnQgaGFuZGxlcnMgYXMgcmVxdWlyZWRcblx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0fVxuXG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrLCB0cnVlKTtcblx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0LCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUsIGZhbHNlKTtcblx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQsIGZhbHNlKTtcblx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLm9uVG91Y2hDYW5jZWwsIGZhbHNlKTtcblxuXHQvLyBIYWNrIGlzIHJlcXVpcmVkIGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgRXZlbnQjc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIChlLmcuIEFuZHJvaWQgMilcblx0Ly8gd2hpY2ggaXMgaG93IEZhc3RDbGljayBub3JtYWxseSBzdG9wcyBjbGljayBldmVudHMgYnViYmxpbmcgdG8gY2FsbGJhY2tzIHJlZ2lzdGVyZWQgb24gdGhlIEZhc3RDbGlja1xuXHQvLyBsYXllciB3aGVuIHRoZXkgYXJlIGNhbmNlbGxlZC5cblx0aWYgKCFFdmVudC5wcm90b3R5cGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG5cdFx0XHR2YXIgcm12ID0gTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblx0XHRcdGlmICh0eXBlID09PSAnY2xpY2snKSB7XG5cdFx0XHRcdHJtdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjay5oaWphY2tlZCB8fCBjYWxsYmFjaywgY2FwdHVyZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRybXYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpIHtcblx0XHRcdHZhciBhZHYgPSBOb2RlLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXHRcdFx0aWYgKHR5cGUgPT09ICdjbGljaycpIHtcblx0XHRcdFx0YWR2LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLmhpamFja2VkIHx8IChjYWxsYmFjay5oaWphY2tlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKCFldmVudC5wcm9wYWdhdGlvblN0b3BwZWQpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pLCBjYXB0dXJlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFkdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8vIElmIGEgaGFuZGxlciBpcyBhbHJlYWR5IGRlY2xhcmVkIGluIHRoZSBlbGVtZW50J3Mgb25jbGljayBhdHRyaWJ1dGUsIGl0IHdpbGwgYmUgZmlyZWQgYmVmb3JlXG5cdC8vIEZhc3RDbGljaydzIG9uQ2xpY2sgaGFuZGxlci4gRml4IHRoaXMgYnkgcHVsbGluZyBvdXQgdGhlIHVzZXItZGVmaW5lZCBoYW5kbGVyIGZ1bmN0aW9uIGFuZFxuXHQvLyBhZGRpbmcgaXQgYXMgbGlzdGVuZXIuXG5cdGlmICh0eXBlb2YgbGF5ZXIub25jbGljayA9PT0gJ2Z1bmN0aW9uJykge1xuXG5cdFx0Ly8gQW5kcm9pZCBicm93c2VyIG9uIGF0IGxlYXN0IDMuMiByZXF1aXJlcyBhIG5ldyByZWZlcmVuY2UgdG8gdGhlIGZ1bmN0aW9uIGluIGxheWVyLm9uY2xpY2tcblx0XHQvLyAtIHRoZSBvbGQgb25lIHdvbid0IHdvcmsgaWYgcGFzc2VkIHRvIGFkZEV2ZW50TGlzdGVuZXIgZGlyZWN0bHkuXG5cdFx0b2xkT25DbGljayA9IGxheWVyLm9uY2xpY2s7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0b2xkT25DbGljayhldmVudCk7XG5cdFx0fSwgZmFsc2UpO1xuXHRcdGxheWVyLm9uY2xpY2sgPSBudWxsO1xuXHR9XG59XG5cblxuLyoqXG4gKiBBbmRyb2lkIHJlcXVpcmVzIGV4Y2VwdGlvbnMuXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNBbmRyb2lkID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdBbmRyb2lkJykgPiAwO1xuXG5cbi8qKlxuICogaU9TIHJlcXVpcmVzIGV4Y2VwdGlvbnMuXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNJT1MgPSAvaVAoYWR8aG9uZXxvZCkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cblxuLyoqXG4gKiBpT1MgNCByZXF1aXJlcyBhbiBleGNlcHRpb24gZm9yIHNlbGVjdCBlbGVtZW50cy5cbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0lPUzQgPSBkZXZpY2VJc0lPUyAmJiAoL09TIDRfXFxkKF9cXGQpPy8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cblxuLyoqXG4gKiBpT1MgNi4wKCs/KSByZXF1aXJlcyB0aGUgdGFyZ2V0IGVsZW1lbnQgdG8gYmUgbWFudWFsbHkgZGVyaXZlZFxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzSU9TV2l0aEJhZFRhcmdldCA9IGRldmljZUlzSU9TICYmICgvT1MgKFs2LTldfFxcZHsyfSlfXFxkLykudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuLyoqXG4gKiBCbGFja0JlcnJ5IHJlcXVpcmVzIGV4Y2VwdGlvbnMuXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNCbGFja0JlcnJ5MTAgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0JCMTAnKSA+IDA7XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBnaXZlbiBlbGVtZW50IHJlcXVpcmVzIGEgbmF0aXZlIGNsaWNrLlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0IFRhcmdldCBET00gZWxlbWVudFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgZWxlbWVudCBuZWVkcyBhIG5hdGl2ZSBjbGlja1xuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLm5lZWRzQ2xpY2sgPSBmdW5jdGlvbih0YXJnZXQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRzd2l0Y2ggKHRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG5cblx0Ly8gRG9uJ3Qgc2VuZCBhIHN5bnRoZXRpYyBjbGljayB0byBkaXNhYmxlZCBpbnB1dHMgKGlzc3VlICM2Milcblx0Y2FzZSAnYnV0dG9uJzpcblx0Y2FzZSAnc2VsZWN0Jzpcblx0Y2FzZSAndGV4dGFyZWEnOlxuXHRcdGlmICh0YXJnZXQuZGlzYWJsZWQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGJyZWFrO1xuXHRjYXNlICdpbnB1dCc6XG5cblx0XHQvLyBGaWxlIGlucHV0cyBuZWVkIHJlYWwgY2xpY2tzIG9uIGlPUyA2IGR1ZSB0byBhIGJyb3dzZXIgYnVnIChpc3N1ZSAjNjgpXG5cdFx0aWYgKChkZXZpY2VJc0lPUyAmJiB0YXJnZXQudHlwZSA9PT0gJ2ZpbGUnKSB8fCB0YXJnZXQuZGlzYWJsZWQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGJyZWFrO1xuXHRjYXNlICdsYWJlbCc6XG5cdGNhc2UgJ3ZpZGVvJzpcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiAoL1xcYm5lZWRzY2xpY2tcXGIvKS50ZXN0KHRhcmdldC5jbGFzc05hbWUpO1xufTtcblxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIGNhbGwgdG8gZm9jdXMgdG8gc2ltdWxhdGUgY2xpY2sgaW50byBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0IFRhcmdldCBET00gZWxlbWVudFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgZWxlbWVudCByZXF1aXJlcyBhIGNhbGwgdG8gZm9jdXMgdG8gc2ltdWxhdGUgbmF0aXZlIGNsaWNrLlxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLm5lZWRzRm9jdXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRzd2l0Y2ggKHRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG5cdGNhc2UgJ3RleHRhcmVhJzpcblx0XHRyZXR1cm4gdHJ1ZTtcblx0Y2FzZSAnc2VsZWN0Jzpcblx0XHRyZXR1cm4gIWRldmljZUlzQW5kcm9pZDtcblx0Y2FzZSAnaW5wdXQnOlxuXHRcdHN3aXRjaCAodGFyZ2V0LnR5cGUpIHtcblx0XHRjYXNlICdidXR0b24nOlxuXHRcdGNhc2UgJ2NoZWNrYm94Jzpcblx0XHRjYXNlICdmaWxlJzpcblx0XHRjYXNlICdpbWFnZSc6XG5cdFx0Y2FzZSAncmFkaW8nOlxuXHRcdGNhc2UgJ3N1Ym1pdCc6XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gTm8gcG9pbnQgaW4gYXR0ZW1wdGluZyB0byBmb2N1cyBkaXNhYmxlZCBpbnB1dHNcblx0XHRyZXR1cm4gIXRhcmdldC5kaXNhYmxlZCAmJiAhdGFyZ2V0LnJlYWRPbmx5O1xuXHRkZWZhdWx0OlxuXHRcdHJldHVybiAoL1xcYm5lZWRzZm9jdXNcXGIvKS50ZXN0KHRhcmdldC5jbGFzc05hbWUpO1xuXHR9XG59O1xuXG5cbi8qKlxuICogU2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUuc2VuZENsaWNrID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCwgZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgY2xpY2tFdmVudCwgdG91Y2g7XG5cblx0Ly8gT24gc29tZSBBbmRyb2lkIGRldmljZXMgYWN0aXZlRWxlbWVudCBuZWVkcyB0byBiZSBibHVycmVkIG90aGVyd2lzZSB0aGUgc3ludGhldGljIGNsaWNrIHdpbGwgaGF2ZSBubyBlZmZlY3QgKCMyNClcblx0aWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGFyZ2V0RWxlbWVudCkge1xuXHRcdGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXHR9XG5cblx0dG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblxuXHQvLyBTeW50aGVzaXNlIGEgY2xpY2sgZXZlbnQsIHdpdGggYW4gZXh0cmEgYXR0cmlidXRlIHNvIGl0IGNhbiBiZSB0cmFja2VkXG5cdGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudHMnKTtcblx0Y2xpY2tFdmVudC5pbml0TW91c2VFdmVudCh0aGlzLmRldGVybWluZUV2ZW50VHlwZSh0YXJnZXRFbGVtZW50KSwgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAxLCB0b3VjaC5zY3JlZW5YLCB0b3VjaC5zY3JlZW5ZLCB0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgMCwgbnVsbCk7XG5cdGNsaWNrRXZlbnQuZm9yd2FyZGVkVG91Y2hFdmVudCA9IHRydWU7XG5cdHRhcmdldEVsZW1lbnQuZGlzcGF0Y2hFdmVudChjbGlja0V2ZW50KTtcbn07XG5cbkZhc3RDbGljay5wcm90b3R5cGUuZGV0ZXJtaW5lRXZlbnRUeXBlID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0Ly9Jc3N1ZSAjMTU5OiBBbmRyb2lkIENocm9tZSBTZWxlY3QgQm94IGRvZXMgbm90IG9wZW4gd2l0aCBhIHN5bnRoZXRpYyBjbGljayBldmVudFxuXHRpZiAoZGV2aWNlSXNBbmRyb2lkICYmIHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0Jykge1xuXHRcdHJldHVybiAnbW91c2Vkb3duJztcblx0fVxuXG5cdHJldHVybiAnY2xpY2snO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLmZvY3VzID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBsZW5ndGg7XG5cblx0Ly8gSXNzdWUgIzE2MDogb24gaU9TIDcsIHNvbWUgaW5wdXQgZWxlbWVudHMgKGUuZy4gZGF0ZSBkYXRldGltZSkgdGhyb3cgYSB2YWd1ZSBUeXBlRXJyb3Igb24gc2V0U2VsZWN0aW9uUmFuZ2UuIFRoZXNlIGVsZW1lbnRzIGRvbid0IGhhdmUgYW4gaW50ZWdlciB2YWx1ZSBmb3IgdGhlIHNlbGVjdGlvblN0YXJ0IGFuZCBzZWxlY3Rpb25FbmQgcHJvcGVydGllcywgYnV0IHVuZm9ydHVuYXRlbHkgdGhhdCBjYW4ndCBiZSB1c2VkIGZvciBkZXRlY3Rpb24gYmVjYXVzZSBhY2Nlc3NpbmcgdGhlIHByb3BlcnRpZXMgYWxzbyB0aHJvd3MgYSBUeXBlRXJyb3IuIEp1c3QgY2hlY2sgdGhlIHR5cGUgaW5zdGVhZC4gRmlsZWQgYXMgQXBwbGUgYnVnICMxNTEyMjcyNC5cblx0aWYgKGRldmljZUlzSU9TICYmIHRhcmdldEVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UgJiYgdGFyZ2V0RWxlbWVudC50eXBlLmluZGV4T2YoJ2RhdGUnKSAhPT0gMCAmJiB0YXJnZXRFbGVtZW50LnR5cGUgIT09ICd0aW1lJykge1xuXHRcdGxlbmd0aCA9IHRhcmdldEVsZW1lbnQudmFsdWUubGVuZ3RoO1xuXHRcdHRhcmdldEVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UobGVuZ3RoLCBsZW5ndGgpO1xuXHR9IGVsc2Uge1xuXHRcdHRhcmdldEVsZW1lbnQuZm9jdXMoKTtcblx0fVxufTtcblxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHRhcmdldCBlbGVtZW50IGlzIGEgY2hpbGQgb2YgYSBzY3JvbGxhYmxlIGxheWVyIGFuZCBpZiBzbywgc2V0IGEgZmxhZyBvbiBpdC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS51cGRhdGVTY3JvbGxQYXJlbnQgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHNjcm9sbFBhcmVudCwgcGFyZW50RWxlbWVudDtcblxuXHRzY3JvbGxQYXJlbnQgPSB0YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudDtcblxuXHQvLyBBdHRlbXB0IHRvIGRpc2NvdmVyIHdoZXRoZXIgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gYSBzY3JvbGxhYmxlIGxheWVyLiBSZS1jaGVjayBpZiB0aGVcblx0Ly8gdGFyZ2V0IGVsZW1lbnQgd2FzIG1vdmVkIHRvIGFub3RoZXIgcGFyZW50LlxuXHRpZiAoIXNjcm9sbFBhcmVudCB8fCAhc2Nyb2xsUGFyZW50LmNvbnRhaW5zKHRhcmdldEVsZW1lbnQpKSB7XG5cdFx0cGFyZW50RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XG5cdFx0ZG8ge1xuXHRcdFx0aWYgKHBhcmVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gcGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQpIHtcblx0XHRcdFx0c2Nyb2xsUGFyZW50ID0gcGFyZW50RWxlbWVudDtcblx0XHRcdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSBwYXJlbnRFbGVtZW50O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0cGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHR9IHdoaWxlIChwYXJlbnRFbGVtZW50KTtcblx0fVxuXG5cdC8vIEFsd2F5cyB1cGRhdGUgdGhlIHNjcm9sbCB0b3AgdHJhY2tlciBpZiBwb3NzaWJsZS5cblx0aWYgKHNjcm9sbFBhcmVudCkge1xuXHRcdHNjcm9sbFBhcmVudC5mYXN0Q2xpY2tMYXN0U2Nyb2xsVG9wID0gc2Nyb2xsUGFyZW50LnNjcm9sbFRvcDtcblx0fVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldEVsZW1lbnRcbiAqIEByZXR1cm5zIHtFbGVtZW50fEV2ZW50VGFyZ2V0fVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQgPSBmdW5jdGlvbihldmVudFRhcmdldCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gT24gc29tZSBvbGRlciBicm93c2VycyAobm90YWJseSBTYWZhcmkgb24gaU9TIDQuMSAtIHNlZSBpc3N1ZSAjNTYpIHRoZSBldmVudCB0YXJnZXQgbWF5IGJlIGEgdGV4dCBub2RlLlxuXHRpZiAoZXZlbnRUYXJnZXQubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG5cdFx0cmV0dXJuIGV2ZW50VGFyZ2V0LnBhcmVudE5vZGU7XG5cdH1cblxuXHRyZXR1cm4gZXZlbnRUYXJnZXQ7XG59O1xuXG5cbi8qKlxuICogT24gdG91Y2ggc3RhcnQsIHJlY29yZCB0aGUgcG9zaXRpb24gYW5kIHNjcm9sbCBvZmZzZXQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hTdGFydCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHRhcmdldEVsZW1lbnQsIHRvdWNoLCBzZWxlY3Rpb247XG5cblx0Ly8gSWdub3JlIG11bHRpcGxlIHRvdWNoZXMsIG90aGVyd2lzZSBwaW5jaC10by16b29tIGlzIHByZXZlbnRlZCBpZiBib3RoIGZpbmdlcnMgYXJlIG9uIHRoZSBGYXN0Q2xpY2sgZWxlbWVudCAoaXNzdWUgIzExMSkuXG5cdGlmIChldmVudC50YXJnZXRUb3VjaGVzLmxlbmd0aCA+IDEpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHRhcmdldEVsZW1lbnQgPSB0aGlzLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQoZXZlbnQudGFyZ2V0KTtcblx0dG91Y2ggPSBldmVudC50YXJnZXRUb3VjaGVzWzBdO1xuXG5cdGlmIChkZXZpY2VJc0lPUykge1xuXG5cdFx0Ly8gT25seSB0cnVzdGVkIGV2ZW50cyB3aWxsIGRlc2VsZWN0IHRleHQgb24gaU9TIChpc3N1ZSAjNDkpXG5cdFx0c2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuXHRcdGlmIChzZWxlY3Rpb24ucmFuZ2VDb3VudCAmJiAhc2VsZWN0aW9uLmlzQ29sbGFwc2VkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoIWRldmljZUlzSU9TNCkge1xuXG5cdFx0XHQvLyBXZWlyZCB0aGluZ3MgaGFwcGVuIG9uIGlPUyB3aGVuIGFuIGFsZXJ0IG9yIGNvbmZpcm0gZGlhbG9nIGlzIG9wZW5lZCBmcm9tIGEgY2xpY2sgZXZlbnQgY2FsbGJhY2sgKGlzc3VlICMyMyk6XG5cdFx0XHQvLyB3aGVuIHRoZSB1c2VyIG5leHQgdGFwcyBhbnl3aGVyZSBlbHNlIG9uIHRoZSBwYWdlLCBuZXcgdG91Y2hzdGFydCBhbmQgdG91Y2hlbmQgZXZlbnRzIGFyZSBkaXNwYXRjaGVkXG5cdFx0XHQvLyB3aXRoIHRoZSBzYW1lIGlkZW50aWZpZXIgYXMgdGhlIHRvdWNoIGV2ZW50IHRoYXQgcHJldmlvdXNseSB0cmlnZ2VyZWQgdGhlIGNsaWNrIHRoYXQgdHJpZ2dlcmVkIHRoZSBhbGVydC5cblx0XHRcdC8vIFNhZGx5LCB0aGVyZSBpcyBhbiBpc3N1ZSBvbiBpT1MgNCB0aGF0IGNhdXNlcyBzb21lIG5vcm1hbCB0b3VjaCBldmVudHMgdG8gaGF2ZSB0aGUgc2FtZSBpZGVudGlmaWVyIGFzIGFuXG5cdFx0XHQvLyBpbW1lZGlhdGVseSBwcmVjZWVkaW5nIHRvdWNoIGV2ZW50IChpc3N1ZSAjNTIpLCBzbyB0aGlzIGZpeCBpcyB1bmF2YWlsYWJsZSBvbiB0aGF0IHBsYXRmb3JtLlxuXHRcdFx0Ly8gSXNzdWUgMTIwOiB0b3VjaC5pZGVudGlmaWVyIGlzIDAgd2hlbiBDaHJvbWUgZGV2IHRvb2xzICdFbXVsYXRlIHRvdWNoIGV2ZW50cycgaXMgc2V0IHdpdGggYW4gaU9TIGRldmljZSBVQSBzdHJpbmcsXG5cdFx0XHQvLyB3aGljaCBjYXVzZXMgYWxsIHRvdWNoIGV2ZW50cyB0byBiZSBpZ25vcmVkLiBBcyB0aGlzIGJsb2NrIG9ubHkgYXBwbGllcyB0byBpT1MsIGFuZCBpT1MgaWRlbnRpZmllcnMgYXJlIGFsd2F5cyBsb25nLFxuXHRcdFx0Ly8gcmFuZG9tIGludGVnZXJzLCBpdCdzIHNhZmUgdG8gdG8gY29udGludWUgaWYgdGhlIGlkZW50aWZpZXIgaXMgMCBoZXJlLlxuXHRcdFx0aWYgKHRvdWNoLmlkZW50aWZpZXIgJiYgdG91Y2guaWRlbnRpZmllciA9PT0gdGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyID0gdG91Y2guaWRlbnRpZmllcjtcblxuXHRcdFx0Ly8gSWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGEgY2hpbGQgb2YgYSBzY3JvbGxhYmxlIGxheWVyICh1c2luZyAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2gpIGFuZDpcblx0XHRcdC8vIDEpIHRoZSB1c2VyIGRvZXMgYSBmbGluZyBzY3JvbGwgb24gdGhlIHNjcm9sbGFibGUgbGF5ZXJcblx0XHRcdC8vIDIpIHRoZSB1c2VyIHN0b3BzIHRoZSBmbGluZyBzY3JvbGwgd2l0aCBhbm90aGVyIHRhcFxuXHRcdFx0Ly8gdGhlbiB0aGUgZXZlbnQudGFyZ2V0IG9mIHRoZSBsYXN0ICd0b3VjaGVuZCcgZXZlbnQgd2lsbCBiZSB0aGUgZWxlbWVudCB0aGF0IHdhcyB1bmRlciB0aGUgdXNlcidzIGZpbmdlclxuXHRcdFx0Ly8gd2hlbiB0aGUgZmxpbmcgc2Nyb2xsIHdhcyBzdGFydGVkLCBjYXVzaW5nIEZhc3RDbGljayB0byBzZW5kIGEgY2xpY2sgZXZlbnQgdG8gdGhhdCBsYXllciAtIHVubGVzcyBhIGNoZWNrXG5cdFx0XHQvLyBpcyBtYWRlIHRvIGVuc3VyZSB0aGF0IGEgcGFyZW50IGxheWVyIHdhcyBub3Qgc2Nyb2xsZWQgYmVmb3JlIHNlbmRpbmcgYSBzeW50aGV0aWMgY2xpY2sgKGlzc3VlICM0MikuXG5cdFx0XHR0aGlzLnVwZGF0ZVNjcm9sbFBhcmVudCh0YXJnZXRFbGVtZW50KTtcblx0XHR9XG5cdH1cblxuXHR0aGlzLnRyYWNraW5nQ2xpY2sgPSB0cnVlO1xuXHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IGV2ZW50LnRpbWVTdGFtcDtcblx0dGhpcy50YXJnZXRFbGVtZW50ID0gdGFyZ2V0RWxlbWVudDtcblxuXHR0aGlzLnRvdWNoU3RhcnRYID0gdG91Y2gucGFnZVg7XG5cdHRoaXMudG91Y2hTdGFydFkgPSB0b3VjaC5wYWdlWTtcblxuXHQvLyBQcmV2ZW50IHBoYW50b20gY2xpY2tzIG9uIGZhc3QgZG91YmxlLXRhcCAoaXNzdWUgIzM2KVxuXHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fVxuXG5cdHJldHVybiB0cnVlO1xufTtcblxuXG4vKipcbiAqIEJhc2VkIG9uIGEgdG91Y2htb3ZlIGV2ZW50IG9iamVjdCwgY2hlY2sgd2hldGhlciB0aGUgdG91Y2ggaGFzIG1vdmVkIHBhc3QgYSBib3VuZGFyeSBzaW5jZSBpdCBzdGFydGVkLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS50b3VjaEhhc01vdmVkID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgdG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSwgYm91bmRhcnkgPSB0aGlzLnRvdWNoQm91bmRhcnk7XG5cblx0aWYgKE1hdGguYWJzKHRvdWNoLnBhZ2VYIC0gdGhpcy50b3VjaFN0YXJ0WCkgPiBib3VuZGFyeSB8fCBNYXRoLmFicyh0b3VjaC5wYWdlWSAtIHRoaXMudG91Y2hTdGFydFkpID4gYm91bmRhcnkpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBVcGRhdGUgdGhlIGxhc3QgcG9zaXRpb24uXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIXRoaXMudHJhY2tpbmdDbGljaykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gSWYgdGhlIHRvdWNoIGhhcyBtb3ZlZCwgY2FuY2VsIHRoZSBjbGljayB0cmFja2luZ1xuXHRpZiAodGhpcy50YXJnZXRFbGVtZW50ICE9PSB0aGlzLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQoZXZlbnQudGFyZ2V0KSB8fCB0aGlzLnRvdWNoSGFzTW92ZWQoZXZlbnQpKSB7XG5cdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0fVxuXG5cdHJldHVybiB0cnVlO1xufTtcblxuXG4vKipcbiAqIEF0dGVtcHQgdG8gZmluZCB0aGUgbGFiZWxsZWQgY29udHJvbCBmb3IgdGhlIGdpdmVuIGxhYmVsIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxIVE1MTGFiZWxFbGVtZW50fSBsYWJlbEVsZW1lbnRcbiAqIEByZXR1cm5zIHtFbGVtZW50fG51bGx9XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUuZmluZENvbnRyb2wgPSBmdW5jdGlvbihsYWJlbEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIEZhc3QgcGF0aCBmb3IgbmV3ZXIgYnJvd3NlcnMgc3VwcG9ydGluZyB0aGUgSFRNTDUgY29udHJvbCBhdHRyaWJ1dGVcblx0aWYgKGxhYmVsRWxlbWVudC5jb250cm9sICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gbGFiZWxFbGVtZW50LmNvbnRyb2w7XG5cdH1cblxuXHQvLyBBbGwgYnJvd3NlcnMgdW5kZXIgdGVzdCB0aGF0IHN1cHBvcnQgdG91Y2ggZXZlbnRzIGFsc28gc3VwcG9ydCB0aGUgSFRNTDUgaHRtbEZvciBhdHRyaWJ1dGVcblx0aWYgKGxhYmVsRWxlbWVudC5odG1sRm9yKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxhYmVsRWxlbWVudC5odG1sRm9yKTtcblx0fVxuXG5cdC8vIElmIG5vIGZvciBhdHRyaWJ1dGUgZXhpc3RzLCBhdHRlbXB0IHRvIHJldHJpZXZlIHRoZSBmaXJzdCBsYWJlbGxhYmxlIGRlc2NlbmRhbnQgZWxlbWVudFxuXHQvLyB0aGUgbGlzdCBvZiB3aGljaCBpcyBkZWZpbmVkIGhlcmU6IGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjY2F0ZWdvcnktbGFiZWxcblx0cmV0dXJuIGxhYmVsRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24sIGlucHV0Om5vdChbdHlwZT1oaWRkZW5dKSwga2V5Z2VuLCBtZXRlciwgb3V0cHV0LCBwcm9ncmVzcywgc2VsZWN0LCB0ZXh0YXJlYScpO1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIGVuZCwgZGV0ZXJtaW5lIHdoZXRoZXIgdG8gc2VuZCBhIGNsaWNrIGV2ZW50IGF0IG9uY2UuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hFbmQgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBmb3JFbGVtZW50LCB0cmFja2luZ0NsaWNrU3RhcnQsIHRhcmdldFRhZ05hbWUsIHNjcm9sbFBhcmVudCwgdG91Y2gsIHRhcmdldEVsZW1lbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQ7XG5cblx0aWYgKCF0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFByZXZlbnQgcGhhbnRvbSBjbGlja3Mgb24gZmFzdCBkb3VibGUtdGFwIChpc3N1ZSAjMzYpXG5cdGlmICgoZXZlbnQudGltZVN0YW1wIC0gdGhpcy5sYXN0Q2xpY2tUaW1lKSA8IHRoaXMudGFwRGVsYXkpIHtcblx0XHR0aGlzLmNhbmNlbE5leHRDbGljayA9IHRydWU7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBSZXNldCB0byBwcmV2ZW50IHdyb25nIGNsaWNrIGNhbmNlbCBvbiBpbnB1dCAoaXNzdWUgIzE1NikuXG5cdHRoaXMuY2FuY2VsTmV4dENsaWNrID0gZmFsc2U7XG5cblx0dGhpcy5sYXN0Q2xpY2tUaW1lID0gZXZlbnQudGltZVN0YW1wO1xuXG5cdHRyYWNraW5nQ2xpY2tTdGFydCA9IHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0O1xuXHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSAwO1xuXG5cdC8vIE9uIHNvbWUgaU9TIGRldmljZXMsIHRoZSB0YXJnZXRFbGVtZW50IHN1cHBsaWVkIHdpdGggdGhlIGV2ZW50IGlzIGludmFsaWQgaWYgdGhlIGxheWVyXG5cdC8vIGlzIHBlcmZvcm1pbmcgYSB0cmFuc2l0aW9uIG9yIHNjcm9sbCwgYW5kIGhhcyB0byBiZSByZS1kZXRlY3RlZCBtYW51YWxseS4gTm90ZSB0aGF0XG5cdC8vIGZvciB0aGlzIHRvIGZ1bmN0aW9uIGNvcnJlY3RseSwgaXQgbXVzdCBiZSBjYWxsZWQgKmFmdGVyKiB0aGUgZXZlbnQgdGFyZ2V0IGlzIGNoZWNrZWQhXG5cdC8vIFNlZSBpc3N1ZSAjNTc7IGFsc28gZmlsZWQgYXMgcmRhcjovLzEzMDQ4NTg5IC5cblx0aWYgKGRldmljZUlzSU9TV2l0aEJhZFRhcmdldCkge1xuXHRcdHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cblx0XHQvLyBJbiBjZXJ0YWluIGNhc2VzIGFyZ3VtZW50cyBvZiBlbGVtZW50RnJvbVBvaW50IGNhbiBiZSBuZWdhdGl2ZSwgc28gcHJldmVudCBzZXR0aW5nIHRhcmdldEVsZW1lbnQgdG8gbnVsbFxuXHRcdHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHRvdWNoLnBhZ2VYIC0gd2luZG93LnBhZ2VYT2Zmc2V0LCB0b3VjaC5wYWdlWSAtIHdpbmRvdy5wYWdlWU9mZnNldCkgfHwgdGFyZ2V0RWxlbWVudDtcblx0XHR0YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudCA9IHRoaXMudGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cdH1cblxuXHR0YXJnZXRUYWdOYW1lID0gdGFyZ2V0RWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdGlmICh0YXJnZXRUYWdOYW1lID09PSAnbGFiZWwnKSB7XG5cdFx0Zm9yRWxlbWVudCA9IHRoaXMuZmluZENvbnRyb2wodGFyZ2V0RWxlbWVudCk7XG5cdFx0aWYgKGZvckVsZW1lbnQpIHtcblx0XHRcdHRoaXMuZm9jdXModGFyZ2V0RWxlbWVudCk7XG5cdFx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dGFyZ2V0RWxlbWVudCA9IGZvckVsZW1lbnQ7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHRoaXMubmVlZHNGb2N1cyh0YXJnZXRFbGVtZW50KSkge1xuXG5cdFx0Ly8gQ2FzZSAxOiBJZiB0aGUgdG91Y2ggc3RhcnRlZCBhIHdoaWxlIGFnbyAoYmVzdCBndWVzcyBpcyAxMDBtcyBiYXNlZCBvbiB0ZXN0cyBmb3IgaXNzdWUgIzM2KSB0aGVuIGZvY3VzIHdpbGwgYmUgdHJpZ2dlcmVkIGFueXdheS4gUmV0dXJuIGVhcmx5IGFuZCB1bnNldCB0aGUgdGFyZ2V0IGVsZW1lbnQgcmVmZXJlbmNlIHNvIHRoYXQgdGhlIHN1YnNlcXVlbnQgY2xpY2sgd2lsbCBiZSBhbGxvd2VkIHRocm91Z2guXG5cdFx0Ly8gQ2FzZSAyOiBXaXRob3V0IHRoaXMgZXhjZXB0aW9uIGZvciBpbnB1dCBlbGVtZW50cyB0YXBwZWQgd2hlbiB0aGUgZG9jdW1lbnQgaXMgY29udGFpbmVkIGluIGFuIGlmcmFtZSwgdGhlbiBhbnkgaW5wdXR0ZWQgdGV4dCB3b24ndCBiZSB2aXNpYmxlIGV2ZW4gdGhvdWdoIHRoZSB2YWx1ZSBhdHRyaWJ1dGUgaXMgdXBkYXRlZCBhcyB0aGUgdXNlciB0eXBlcyAoaXNzdWUgIzM3KS5cblx0XHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRyYWNraW5nQ2xpY2tTdGFydCkgPiAxMDAgfHwgKGRldmljZUlzSU9TICYmIHdpbmRvdy50b3AgIT09IHdpbmRvdyAmJiB0YXJnZXRUYWdOYW1lID09PSAnaW5wdXQnKSkge1xuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xuXHRcdHRoaXMuc2VuZENsaWNrKHRhcmdldEVsZW1lbnQsIGV2ZW50KTtcblxuXHRcdC8vIFNlbGVjdCBlbGVtZW50cyBuZWVkIHRoZSBldmVudCB0byBnbyB0aHJvdWdoIG9uIGlPUyA0LCBvdGhlcndpc2UgdGhlIHNlbGVjdG9yIG1lbnUgd29uJ3Qgb3Blbi5cblx0XHQvLyBBbHNvIHRoaXMgYnJlYWtzIG9wZW5pbmcgc2VsZWN0cyB3aGVuIFZvaWNlT3ZlciBpcyBhY3RpdmUgb24gaU9TNiwgaU9TNyAoYW5kIHBvc3NpYmx5IG90aGVycylcblx0XHRpZiAoIWRldmljZUlzSU9TIHx8IHRhcmdldFRhZ05hbWUgIT09ICdzZWxlY3QnKSB7XG5cdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpZiAoZGV2aWNlSXNJT1MgJiYgIWRldmljZUlzSU9TNCkge1xuXG5cdFx0Ly8gRG9uJ3Qgc2VuZCBhIHN5bnRoZXRpYyBjbGljayBldmVudCBpZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgY29udGFpbmVkIHdpdGhpbiBhIHBhcmVudCBsYXllciB0aGF0IHdhcyBzY3JvbGxlZFxuXHRcdC8vIGFuZCB0aGlzIHRhcCBpcyBiZWluZyB1c2VkIHRvIHN0b3AgdGhlIHNjcm9sbGluZyAodXN1YWxseSBpbml0aWF0ZWQgYnkgYSBmbGluZyAtIGlzc3VlICM0MikuXG5cdFx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cdFx0aWYgKHNjcm9sbFBhcmVudCAmJiBzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCAhPT0gc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUHJldmVudCB0aGUgYWN0dWFsIGNsaWNrIGZyb20gZ29pbmcgdGhvdWdoIC0gdW5sZXNzIHRoZSB0YXJnZXQgbm9kZSBpcyBtYXJrZWQgYXMgcmVxdWlyaW5nXG5cdC8vIHJlYWwgY2xpY2tzIG9yIGlmIGl0IGlzIGluIHRoZSB3aGl0ZWxpc3QgaW4gd2hpY2ggY2FzZSBvbmx5IG5vbi1wcm9ncmFtbWF0aWMgY2xpY2tzIGFyZSBwZXJtaXR0ZWQuXG5cdGlmICghdGhpcy5uZWVkc0NsaWNrKHRhcmdldEVsZW1lbnQpKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qKlxuICogT24gdG91Y2ggY2FuY2VsLCBzdG9wIHRyYWNraW5nIHRoZSBjbGljay5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoQ2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG59O1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lIG1vdXNlIGV2ZW50cyB3aGljaCBzaG91bGQgYmUgcGVybWl0dGVkLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vbk1vdXNlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIElmIGEgdGFyZ2V0IGVsZW1lbnQgd2FzIG5ldmVyIHNldCAoYmVjYXVzZSBhIHRvdWNoIGV2ZW50IHdhcyBuZXZlciBmaXJlZCkgYWxsb3cgdGhlIGV2ZW50XG5cdGlmICghdGhpcy50YXJnZXRFbGVtZW50KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAoZXZlbnQuZm9yd2FyZGVkVG91Y2hFdmVudCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gUHJvZ3JhbW1hdGljYWxseSBnZW5lcmF0ZWQgZXZlbnRzIHRhcmdldGluZyBhIHNwZWNpZmljIGVsZW1lbnQgc2hvdWxkIGJlIHBlcm1pdHRlZFxuXHRpZiAoIWV2ZW50LmNhbmNlbGFibGUpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIERlcml2ZSBhbmQgY2hlY2sgdGhlIHRhcmdldCBlbGVtZW50IHRvIHNlZSB3aGV0aGVyIHRoZSBtb3VzZSBldmVudCBuZWVkcyB0byBiZSBwZXJtaXR0ZWQ7XG5cdC8vIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQsIHByZXZlbnQgbm9uLXRvdWNoIGNsaWNrIGV2ZW50cyBmcm9tIHRyaWdnZXJpbmcgYWN0aW9ucyxcblx0Ly8gdG8gcHJldmVudCBnaG9zdC9kb3VibGVjbGlja3MuXG5cdGlmICghdGhpcy5uZWVkc0NsaWNrKHRoaXMudGFyZ2V0RWxlbWVudCkgfHwgdGhpcy5jYW5jZWxOZXh0Q2xpY2spIHtcblxuXHRcdC8vIFByZXZlbnQgYW55IHVzZXItYWRkZWQgbGlzdGVuZXJzIGRlY2xhcmVkIG9uIEZhc3RDbGljayBlbGVtZW50IGZyb20gYmVpbmcgZmlyZWQuXG5cdFx0aWYgKGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuXHRcdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gUGFydCBvZiB0aGUgaGFjayBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IEV2ZW50I3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAoZS5nLiBBbmRyb2lkIDIpXG5cdFx0XHRldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIENhbmNlbCB0aGUgZXZlbnRcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gSWYgdGhlIG1vdXNlIGV2ZW50IGlzIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cblx0cmV0dXJuIHRydWU7XG59O1xuXG5cbi8qKlxuICogT24gYWN0dWFsIGNsaWNrcywgZGV0ZXJtaW5lIHdoZXRoZXIgdGhpcyBpcyBhIHRvdWNoLWdlbmVyYXRlZCBjbGljaywgYSBjbGljayBhY3Rpb24gb2NjdXJyaW5nXG4gKiBuYXR1cmFsbHkgYWZ0ZXIgYSBkZWxheSBhZnRlciBhIHRvdWNoICh3aGljaCBuZWVkcyB0byBiZSBjYW5jZWxsZWQgdG8gYXZvaWQgZHVwbGljYXRpb24pLCBvclxuICogYW4gYWN0dWFsIGNsaWNrIHdoaWNoIHNob3VsZCBiZSBwZXJtaXR0ZWQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLm9uQ2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBwZXJtaXR0ZWQ7XG5cblx0Ly8gSXQncyBwb3NzaWJsZSBmb3IgYW5vdGhlciBGYXN0Q2xpY2stbGlrZSBsaWJyYXJ5IGRlbGl2ZXJlZCB3aXRoIHRoaXJkLXBhcnR5IGNvZGUgdG8gZmlyZSBhIGNsaWNrIGV2ZW50IGJlZm9yZSBGYXN0Q2xpY2sgZG9lcyAoaXNzdWUgIzQ0KS4gSW4gdGhhdCBjYXNlLCBzZXQgdGhlIGNsaWNrLXRyYWNraW5nIGZsYWcgYmFjayB0byBmYWxzZSBhbmQgcmV0dXJuIGVhcmx5LiBUaGlzIHdpbGwgY2F1c2Ugb25Ub3VjaEVuZCB0byByZXR1cm4gZWFybHkuXG5cdGlmICh0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gVmVyeSBvZGQgYmVoYXZpb3VyIG9uIGlPUyAoaXNzdWUgIzE4KTogaWYgYSBzdWJtaXQgZWxlbWVudCBpcyBwcmVzZW50IGluc2lkZSBhIGZvcm0gYW5kIHRoZSB1c2VyIGhpdHMgZW50ZXIgaW4gdGhlIGlPUyBzaW11bGF0b3Igb3IgY2xpY2tzIHRoZSBHbyBidXR0b24gb24gdGhlIHBvcC11cCBPUyBrZXlib2FyZCB0aGUgYSBraW5kIG9mICdmYWtlJyBjbGljayBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCB3aXRoIHRoZSBzdWJtaXQtdHlwZSBpbnB1dCBlbGVtZW50IGFzIHRoZSB0YXJnZXQuXG5cdGlmIChldmVudC50YXJnZXQudHlwZSA9PT0gJ3N1Ym1pdCcgJiYgZXZlbnQuZGV0YWlsID09PSAwKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRwZXJtaXR0ZWQgPSB0aGlzLm9uTW91c2UoZXZlbnQpO1xuXG5cdC8vIE9ubHkgdW5zZXQgdGFyZ2V0RWxlbWVudCBpZiB0aGUgY2xpY2sgaXMgbm90IHBlcm1pdHRlZC4gVGhpcyB3aWxsIGVuc3VyZSB0aGF0IHRoZSBjaGVjayBmb3IgIXRhcmdldEVsZW1lbnQgaW4gb25Nb3VzZSBmYWlscyBhbmQgdGhlIGJyb3dzZXIncyBjbGljayBkb2Vzbid0IGdvIHRocm91Z2guXG5cdGlmICghcGVybWl0dGVkKSB7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0fVxuXG5cdC8vIElmIGNsaWNrcyBhcmUgcGVybWl0dGVkLCByZXR1cm4gdHJ1ZSBmb3IgdGhlIGFjdGlvbiB0byBnbyB0aHJvdWdoLlxuXHRyZXR1cm4gcGVybWl0dGVkO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZSBhbGwgRmFzdENsaWNrJ3MgZXZlbnQgbGlzdGVuZXJzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgbGF5ZXIgPSB0aGlzLmxheWVyO1xuXG5cdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdH1cblxuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XG5cdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLCBmYWxzZSk7XG5cdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XG5cdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBGYXN0Q2xpY2sgaXMgbmVlZGVkLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gbGF5ZXIgVGhlIGxheWVyIHRvIGxpc3RlbiBvblxuICovXG5GYXN0Q2xpY2subm90TmVlZGVkID0gZnVuY3Rpb24obGF5ZXIpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgbWV0YVZpZXdwb3J0O1xuXHR2YXIgY2hyb21lVmVyc2lvbjtcblx0dmFyIGJsYWNrYmVycnlWZXJzaW9uO1xuXG5cdC8vIERldmljZXMgdGhhdCBkb24ndCBzdXBwb3J0IHRvdWNoIGRvbid0IG5lZWQgRmFzdENsaWNrXG5cdGlmICh0eXBlb2Ygd2luZG93Lm9udG91Y2hzdGFydCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIENocm9tZSB2ZXJzaW9uIC0gemVybyBmb3Igb3RoZXIgYnJvd3NlcnNcblx0Y2hyb21lVmVyc2lvbiA9ICsoL0Nocm9tZVxcLyhbMC05XSspLy5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IFssMF0pWzFdO1xuXG5cdGlmIChjaHJvbWVWZXJzaW9uKSB7XG5cblx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0XHRtZXRhVmlld3BvcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9dmlld3BvcnRdJyk7XG5cblx0XHRcdGlmIChtZXRhVmlld3BvcnQpIHtcblx0XHRcdFx0Ly8gQ2hyb21lIG9uIEFuZHJvaWQgd2l0aCB1c2VyLXNjYWxhYmxlPVwibm9cIiBkb2Vzbid0IG5lZWQgRmFzdENsaWNrIChpc3N1ZSAjODkpXG5cdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gQ2hyb21lIDMyIGFuZCBhYm92ZSB3aXRoIHdpZHRoPWRldmljZS13aWR0aCBvciBsZXNzIGRvbid0IG5lZWQgRmFzdENsaWNrXG5cdFx0XHRcdGlmIChjaHJvbWVWZXJzaW9uID4gMzEgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIENocm9tZSBkZXNrdG9wIGRvZXNuJ3QgbmVlZCBGYXN0Q2xpY2sgKGlzc3VlICMxNSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGRldmljZUlzQmxhY2tCZXJyeTEwKSB7XG5cdFx0YmxhY2tiZXJyeVZlcnNpb24gPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvKFswLTldKilcXC4oWzAtOV0qKS8pO1xuXG5cdFx0Ly8gQmxhY2tCZXJyeSAxMC4zKyBkb2VzIG5vdCByZXF1aXJlIEZhc3RjbGljayBsaWJyYXJ5LlxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mdGxhYnMvZmFzdGNsaWNrL2lzc3Vlcy8yNTFcblx0XHRpZiAoYmxhY2tiZXJyeVZlcnNpb25bMV0gPj0gMTAgJiYgYmxhY2tiZXJyeVZlcnNpb25bMl0gPj0gMykge1xuXHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xuXG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XG5cdFx0XHRcdC8vIHVzZXItc2NhbGFibGU9bm8gZWxpbWluYXRlcyBjbGljayBkZWxheS5cblx0XHRcdFx0aWYgKG1ldGFWaWV3cG9ydC5jb250ZW50LmluZGV4T2YoJ3VzZXItc2NhbGFibGU9bm8nKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyB3aWR0aD1kZXZpY2Utd2lkdGggKG9yIGxlc3MgdGhhbiBkZXZpY2Utd2lkdGgpIGVsaW1pbmF0ZXMgY2xpY2sgZGVsYXkuXG5cdFx0XHRcdGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGggPD0gd2luZG93Lm91dGVyV2lkdGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIElFMTAgd2l0aCAtbXMtdG91Y2gtYWN0aW9uOiBub25lLCB3aGljaCBkaXNhYmxlcyBkb3VibGUtdGFwLXRvLXpvb20gKGlzc3VlICM5Nylcblx0aWYgKGxheWVyLnN0eWxlLm1zVG91Y2hBY3Rpb24gPT09ICdub25lJykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIGZvciBjcmVhdGluZyBhIEZhc3RDbGljayBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0c1xuICovXG5GYXN0Q2xpY2suYXR0YWNoID0gZnVuY3Rpb24obGF5ZXIsIG9wdGlvbnMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRyZXR1cm4gbmV3IEZhc3RDbGljayhsYXllciwgb3B0aW9ucyk7XG59O1xuXG5cbmlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXG5cdC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cblx0ZGVmaW5lKGZ1bmN0aW9uKCkge1xuXHRcdCd1c2Ugc3RyaWN0Jztcblx0XHRyZXR1cm4gRmFzdENsaWNrO1xuXHR9KTtcbn0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBGYXN0Q2xpY2suYXR0YWNoO1xuXHRtb2R1bGUuZXhwb3J0cy5GYXN0Q2xpY2sgPSBGYXN0Q2xpY2s7XG59IGVsc2Uge1xuXHR3aW5kb3cuRmFzdENsaWNrID0gRmFzdENsaWNrO1xufVxuIiwic3RvcmVzID0gcmVxdWlyZSAnLi9zdG9yZXMnXG5yb3V0ZXMgPSByZXF1aXJlICcuL3JvdXRlcydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzdGF0aWNGaWxlczogX19kaXJuYW1lK1wiL3B1YmxpY1wiXG4gIHN0b3JlSWQ6IFwic3RvcmVfc3RhdGVfZnJvbV9zZXJ2ZXJcIlxuICBhcHBJZDogXCJhcHBcIlxuICByb3V0ZXM6IHJvdXRlc1xuICBzdG9yZXM6IHN0b3JlcyIsIlEgPSByZXF1aXJlICdxJ1xuXG5JbmRleFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2luZGV4J1xuVGVhbVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3RlYW0nXG5QbGF5ZXJWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9wbGF5ZXInXG5HYW1lVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvZ2FtZSdcblNjaGVkdWxlVmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvc2NoZWR1bGUnXG5TdGFuZGluZ3NWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9zdGFuZGluZ3MnXG5TdGF0c1ZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3N0YXRzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIFwiL1wiOiAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKVxuICAgICAgQHN0b3JlLmZldGNoKFwidGVhbXNcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YXRzXCIpXG4gICAgXSwgKHN0YW5kaW5ncywgdGVhbXNMaXN0LCBzdGF0c0xpc3QpIC0+XG4gICAgICB0aXRsZTogXCJFdHVzaXZ1XCJcbiAgICAgIGNvbXBvbmVudDogSW5kZXhWaWV3XG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG4gICAgICAgIHRlYW1zOiB0ZWFtc0xpc3QudG9KU09OKClcbiAgICAgICAgc3RhdHM6IHN0YXRzTGlzdC50b0pTT04oKVxuXG4gIFwiL2pvdWtrdWVldC86aWQvOmFjdGl2ZT9cIjogKGlkLCBhY3RpdmUpIC0+XG4gICAgUS5zcHJlYWQgW1xuICAgICAgQHN0b3JlLmZldGNoKFwic3RhbmRpbmdzXCIpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJ0ZWFtXCIsIGlkOiBpZClcbiAgICBdLCAoc3RhbmRpbmdzLCB0ZWFtKSAtPlxuXG4gICAgICBzdWJUaXRsZSA9IHN3aXRjaCBhY3RpdmVcbiAgICAgICAgd2hlbiBcInBlbGFhamF0XCIgdGhlbiBcIlBlbGFhamF0XCJcbiAgICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcIlRpbGFzdG90XCJcbiAgICAgICAgZWxzZSBcIk90dGVsdW9oamVsbWFcIlxuXG4gICAgICB0aXRsZTogXCJKb3Vra3VlZXQgLSAje3RlYW0uZ2V0KFwiaW5mb1wiKS5uYW1lfSAtICN7c3ViVGl0bGV9XCJcbiAgICAgIGNvbXBvbmVudDogVGVhbVZpZXdcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG4gICAgICAgIHRlYW06IHRlYW0udG9KU09OKClcbiAgICAgICAgYWN0aXZlOiBhY3RpdmVcblxuICBcIi9qb3Vra3VlZXQvOmlkLzpwaWQvOnNsdWdcIjogKGlkLCBwaWQsIHNsdWcpIC0+XG4gICAgQHN0b3JlLmZldGNoKFwidGVhbVwiLCBpZDogaWQpLnRoZW4gKHRlYW0pIC0+XG4gICAgICBwbGF5ZXIgPSB0ZWFtLmdldChcInJvc3RlclwiKS5maWx0ZXIoKHBsYXllcikgLT5cbiAgICAgICAgcGxheWVyLmlkIGlzIFwiI3twaWR9LyN7c2x1Z31cIlxuICAgICAgKVswXVxuICAgICAgdGl0bGU6IFwiUGVsYWFqYXQgLSAje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICBjb21wb25lbnQ6IFBsYXllclZpZXdcbiAgICAgICAgaWQ6IHBpZFxuICAgICAgICBwbGF5ZXI6IHBsYXllclxuICAgICAgICB0ZWFtOiB0ZWFtLnRvSlNPTigpXG5cbiAgXCIvb3R0ZWx1dFwiOiAtPlxuICAgIEBzdG9yZS5mZXRjaChcInNjaGVkdWxlXCIpLnRoZW4gKHNjaGVkdWxlKSAtPlxuICAgICAgdGl0bGU6IFwiT3R0ZWx1b2hqZWxtYVwiXG4gICAgICBjb21wb25lbnQ6IFNjaGVkdWxlVmlld1xuICAgICAgICBzY2hlZHVsZTogc2NoZWR1bGUudG9KU09OKClcblxuICBcIi9vdHRlbHV0LzppZC86YWN0aXZlP1wiOiAoaWQsIGFjdGl2ZSkgLT5cbiAgICBRLnNwcmVhZCBbXG4gICAgICBAc3RvcmUuZmV0Y2goXCJzY2hlZHVsZVwiKVxuICAgICAgQHN0b3JlLmZldGNoKFwiZ2FtZUV2ZW50c1wiLCBpZDogaWQpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lTGluZXVwc1wiLCBpZDogaWQpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lU3RhdHNcIiwgaWQ6IGlkKVxuICAgIF0sIChzY2hlZHVsZSwgZXZlbnRzLCBsaW5lVXBzLCBzdGF0cykgLT5cbiAgICAgIGdhbWUgPSBzY2hlZHVsZS5maW5kIChnKSAtPlxuICAgICAgICBnLmlkIGlzIGlkXG5cbiAgICAgIHRpdGxlOiBcIk90dGVsdSAtICN7Z2FtZS5nZXQoXCJob21lXCIpfSB2cyAje2dhbWUuZ2V0KFwiYXdheVwiKX1cIlxuICAgICAgY29tcG9uZW50OiBHYW1lVmlld1xuICAgICAgICBpZDogaWRcbiAgICAgICAgZ2FtZTogZ2FtZS50b0pTT04oKVxuICAgICAgICBldmVudHM6IGV2ZW50cy50b0pTT04oKVxuICAgICAgICBsaW5lVXBzOiBsaW5lVXBzLnRvSlNPTigpXG4gICAgICAgIHN0YXRzOiBzdGF0cy50b0pTT04oKVxuICAgICAgICBhY3RpdmU6IGFjdGl2ZVxuXG4gIFwiL3NhcmphdGF1bHVra29cIjogLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJzdGFuZGluZ3NcIikudGhlbiAoc3RhbmRpbmdzKSAtPlxuICAgICAgdGl0bGU6IFwiU2FyamF0YXVsdWtrb1wiXG4gICAgICBjb21wb25lbnQ6IFN0YW5kaW5nc1ZpZXdcbiAgICAgICAgc3RhbmRpbmdzOiBzdGFuZGluZ3MudG9KU09OKClcblxuICBcIi90aWxhc3RvdC86YWN0aXZlP1wiOiAoYWN0aXZlKSAtPlxuICAgIEBzdG9yZS5mZXRjaChcInN0YXRzXCIpLnRoZW4gKHN0YXRzKSAtPlxuICAgICAgdGl0bGU6IFwiVGlsYXN0b3RcIlxuICAgICAgY29tcG9uZW50OiBTdGF0c1ZpZXdcbiAgICAgICAgc3RhdHM6IHN0YXRzLnRvSlNPTigpXG4gICAgICAgIGFjdGl2ZTogYWN0aXZlIiwiVGVhbXNDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi9zdG9yZXMvdGVhbXMnXG5TY2hlZHVsZUNvbGxlY3Rpb24gPSByZXF1aXJlICcuL3N0b3Jlcy9zY2hlZHVsZSdcblN0YW5kaW5nc0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL3N0b3Jlcy9zdGFuZGluZ3MnXG5TdGF0c01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvc3RhdHMnXG5UZWFtTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy90ZWFtJ1xuR2FtZUV2ZW50c01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvZ2FtZV9ldmVudHMnXG5HYW1lTGluZXVwc01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvZ2FtZV9saW5ldXBzJ1xuR2FtZVN0YXRzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9nYW1lX3N0YXRzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHRlYW1zOiBUZWFtc0NvbGxlY3Rpb25cbiAgc2NoZWR1bGU6IFNjaGVkdWxlQ29sbGVjdGlvblxuICBzdGFuZGluZ3M6IFN0YW5kaW5nc0NvbGxlY3Rpb25cbiAgc3RhdHM6IFN0YXRzTW9kZWxcbiAgdGVhbTogVGVhbU1vZGVsXG4gIGdhbWVFdmVudHM6IEdhbWVFdmVudHNNb2RlbFxuICBnYW1lTGluZXVwczogR2FtZUxpbmV1cHNNb2RlbFxuICBnYW1lU3RhdHM6IEdhbWVTdGF0c01vZGVsIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cbkdhbWVFdmVudHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJnYW1lcy9ldmVudHMvI3tAc3RvcmVPcHRpb25zLmlkfVwiXG5cbiAgdXJsOiAtPlxuICAgIFwiI3thcGlDb25maWcudXJsfS9nYW1lcy9ldmVudHMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lRXZlbnRzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cbkdhbWVMaW5ldXBzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwiZ2FtZXMvbGluZXVwcy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L2dhbWVzL2xpbmV1cHMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lTGluZXVwcyIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5HYW1lU3RhdHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJnYW1lcy9zdGF0cy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L2dhbWVzL3N0YXRzLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVN0YXRzIiwiQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Db2xsZWN0aW9uXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5TY2hlZHVsZSA9IENvbGxlY3Rpb24uZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic2NoZWR1bGVcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3NjaGVkdWxlLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVkdWxlIiwiQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Db2xsZWN0aW9uXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5TdGFuZGluZ3MgPSBDb2xsZWN0aW9uLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInN0YW5kaW5nc1wiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vc3RhbmRpbmdzLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YW5kaW5ncyIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5TdGF0cyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInN0YXRzXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS9zdGF0cy5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0cyIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5UZWFtID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwidGVhbXMvI3tAc3RvcmVPcHRpb25zLmlkfVwiXG5cbiAgdXJsOiAtPlxuICAgIFwiI3thcGlDb25maWcudXJsfS90ZWFtcy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW0iLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblRlYW1zID0gQ29sbGVjdGlvbi5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJ0ZWFtc1wiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vdGVhbXMuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbXMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxue1JvdywgQ29sLCBOYXYsIE5hdkl0ZW0sIFRhYlBhbmV9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5HYW1lRXZlbnRzID0gcmVxdWlyZSAnLi9nYW1lX2V2ZW50cydcbkdhbWVMaW5ldXBzID0gcmVxdWlyZSAnLi9nYW1lX2xpbmV1cHMnXG5HYW1lU3RhdHMgPSByZXF1aXJlICcuL2dhbWVfc3RhdHMnXG5cbkdhbWUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgcmVuZGVyOiAtPlxuICAgIGFjdGl2ZUtleSA9IHN3aXRjaCBAcHJvcHMuYWN0aXZlXG4gICAgICB3aGVuIFwidGlsYXN0b3RcIiB0aGVuIFwic3RhdHNcIlxuICAgICAgd2hlbiBcImtldGp1dFwiIHRoZW4gXCJsaW5lVXBzXCJcbiAgICAgIGVsc2UgXCJldmVudHNcIlxuXG4gICAgIyBjb25zb2xlLmxvZyBcImV2ZW50c1wiLCBAcHJvcHMuZXZlbnRzXG4gICAgIyBjb25zb2xlLmxvZyBcImxpbmV1cHNcIiwgQHByb3BzLmxpbmVVcHNcbiAgICAjY29uc29sZS5sb2cgXCJzdGF0c1wiLCBAcHJvcHMuc3RhdHNcbiAgICAjIGNvbnNvbGUubG9nIFwiZ2FtZVwiLCBAcHJvcHMuZ2FtZVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoNCksIFwibWRcIjogKDQpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMSwgbnVsbCwgKEBwcm9wcy5nYW1lLmhvbWUpKVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoNCksIFwibWRcIjogKDQpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMSwgbnVsbCwgKEBwcm9wcy5nYW1lLmhvbWVTY29yZSksIFwiIC0gXCIsIChAcHJvcHMuZ2FtZS5hd2F5U2NvcmUpKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIFwiWWxlaXNcXHUwMGY2XFx1MDBlNDogXCIsIChAcHJvcHMuZ2FtZS5hdHRlbmRhbmNlKSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIChAcHJvcHMuZ2FtZS5hd2F5KSlcbiAgICAgICAgKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfVwiLCBcImtleVwiOiBcImV2ZW50c1wifSwgXCJUYXBhaHR1bWF0XCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je0Bwcm9wcy5pZH0vdGlsYXN0b3RcIiwgXCJrZXlcIjogXCJzdGF0c1wifSwgXCJUaWxhc3RvdFwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL290dGVsdXQvI3tAcHJvcHMuaWR9L2tldGp1dFwiLCBcImtleVwiOiBcImxpbmVVcHNcIn0sIFwiS2V0anV0XCIpXG4gICAgICApLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYi1jb250ZW50XCIsIFwicmVmXCI6IFwicGFuZXNcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwiZXZlbnRzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJldmVudHNcIil9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2FtZUV2ZW50cywge1wiZXZlbnRzXCI6IChAcHJvcHMuZXZlbnRzKSwgXCJnYW1lXCI6IChAcHJvcHMuZ2FtZSl9KVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic3RhdHNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInN0YXRzXCIpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdhbWVTdGF0cywge1wic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwibGluZVVwc1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwibGluZVVwc1wiKX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHYW1lTGluZXVwcywge1wibGluZVVwc1wiOiAoQHByb3BzLmxpbmVVcHMpfSlcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuIyB7Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbkdhbWVFdmVudHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGV2ZW50OiAoZXZlbnQsIGkpIC0+XG4gICAgaWYgZXZlbnQuaGVhZGVyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChldmVudC5oZWFkZXIpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImNvbFNwYW5cIjogXCIzXCJ9LCAoZXZlbnQuaGVhZGVyKSlcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChpKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoQHByb3BzLmdhbWVbZXZlbnQudGVhbV0pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChldmVudC50aW1lKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoZXZlbnQudGV4dCkpXG4gICAgICApXG5cbiAgcmVuZGVyOiAtPlxuICAgIGV2ZW50cyA9IE9iamVjdC5rZXlzKEBwcm9wcy5ldmVudHMpLnJlZHVjZSAoYXJyLCBrZXkpID0+XG4gICAgICBhcnIucHVzaCBoZWFkZXI6IGtleVxuICAgICAgYXJyID0gYXJyLmNvbmNhdCBAcHJvcHMuZXZlbnRzW2tleV1cbiAgICAgIGFyclxuICAgICwgW11cblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICAoZXZlbnRzLm1hcCAoZXZlbnQsIGkpID0+XG4gICAgICAgICAgQGV2ZW50KGV2ZW50LCBpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVFdmVudHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuIyB7Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbkdhbWVMaW5ldXBzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn1cbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUxpbmV1cHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuIyB7Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbkdhbWVTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICAoQHByb3BzLnN0YXRzLmhvbWUucGxheWVycy5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSlcbiAgICAgICAgKSxcblxuICAgICAgICAoQHByb3BzLnN0YXRzLmhvbWUuZ29hbGllcy5tYXAgKGdvYWxpZSkgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChnb2FsaWUuaWQpfSwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChnb2FsaWUuZmlyc3ROYW1lKSwgXCIgXCIsIChnb2FsaWUubGFzdE5hbWUpKSlcbiAgICAgICAgKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sXG4gICAgICAgIChAcHJvcHMuc3RhdHMuYXdheS5wbGF5ZXJzLm1hcCAocGxheWVyKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKVxuICAgICAgICApLFxuXG4gICAgICAgIChAcHJvcHMuc3RhdHMuYXdheS5nb2FsaWVzLm1hcCAoZ29hbGllKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKGdvYWxpZS5pZCl9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKGdvYWxpZS5maXJzdE5hbWUpLCBcIiBcIiwgKGdvYWxpZS5sYXN0TmFtZSkpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zTGlzdFZpZXcgPSByZXF1aXJlICcuL3RlYW1zX2xpc3QnXG5Ub3BTY29yZXJzVmlldyA9IHJlcXVpcmUgJy4vdG9wX3Njb3JlcnMnXG5cbkluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcImp1bWJvdHJvblwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiTGlpZ2EucHdcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnAsIG51bGwsIFwiTGlpZ2FuIHRpbGFzdG90IG5vcGVhc3RpIGphIHZhaXZhdHRvbWFzdGlcIilcbiAgICAgICksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbXNMaXN0Vmlldywge1widGVhbXNcIjogKEBwcm9wcy50ZWFtcyl9KSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUb3BTY29yZXJzVmlldywge1wic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4IiwiVGFibGVTb3J0TWl4aW4gPVxuICBzZXRTb3J0OiAoZXZlbnQpIC0+XG4gICAgc29ydCA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnNvcnRcbiAgICBpZiBzb3J0XG4gICAgICB0eXBlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQudHlwZSBvciBcImludGVnZXJcIlxuICAgICAgaWYgQHN0YXRlLnNvcnRGaWVsZCBpcyBzb3J0XG4gICAgICAgIG5ld1NvcnQgPSBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIiB0aGVuIFwiYXNjXCIgZWxzZSBcImRlc2NcIlxuICAgICAgICBAc2V0U3RhdGUgc29ydERpcmVjdGlvbjogbmV3U29ydCwgc29ydFR5cGU6IHR5cGVcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldFN0YXRlIHNvcnRGaWVsZDogc29ydCwgc29ydFR5cGU6IHR5cGVcblxuICBzb3J0OiAoYSwgYikgLT5cbiAgICBzd2l0Y2ggQHN0YXRlLnNvcnRUeXBlXG4gICAgICB3aGVuIFwiaW50ZWdlclwiXG4gICAgICAgIGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiXG4gICAgICAgICAgYltAc3RhdGUuc29ydEZpZWxkXSAtIGFbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFbQHN0YXRlLnNvcnRGaWVsZF0gLSBiW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICB3aGVuIFwiZmxvYXRcIlxuICAgICAgICBhVmFsdWUgPSBOdW1iZXIoYVtAc3RhdGUuc29ydEZpZWxkXS5yZXBsYWNlKFwiJVwiLFwiXCIpLnJlcGxhY2UoL1xcLHxcXDovLFwiLlwiKSkgb3IgMFxuICAgICAgICBiVmFsdWUgPSBOdW1iZXIoYltAc3RhdGUuc29ydEZpZWxkXS5yZXBsYWNlKFwiJVwiLFwiXCIpLnJlcGxhY2UoL1xcLHxcXDovLFwiLlwiKSkgb3IgMFxuICAgICAgICBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIlxuICAgICAgICAgIGJWYWx1ZSAtIGFWYWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYVZhbHVlIC0gYlZhbHVlXG4gICAgICB3aGVuIFwic3RyaW5nXCJcbiAgICAgICAgaWYgQHN0YXRlLnNvcnREaXJlY3Rpb24gaXMgXCJkZXNjXCJcbiAgICAgICAgICBpZiBiW0BzdGF0ZS5zb3J0RmllbGRdIDwgYVtAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgLTFcbiAgICAgICAgICBlbHNlIGlmIGJbQHN0YXRlLnNvcnRGaWVsZF0gPiBhW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAxXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgYVtAc3RhdGUuc29ydEZpZWxkXSA8IGJbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgICAgIC0xXG4gICAgICAgICAgZWxzZSBpZiBhW0BzdGF0ZS5zb3J0RmllbGRdID4gYltAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgMVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIDBcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZVNvcnRNaXhpbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xue05hdmJhciwgTmF2LCBOYXZJdGVtLCBEcm9wZG93bkJ1dHRvbiwgTWVudUl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5OYXZpZ2F0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgYnJhbmQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL1wiLCBcImNsYXNzTmFtZVwiOiBcIm5hdmJhci1icmFuZFwifSwgXCJMaWlnYVwiKVxuXG4gICAgdGVhbXMgPVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wZG93bkJ1dHRvbiwge1widGl0bGVcIjogXCJKb3Vra3VlZXRcIn0sXG4gICAgICAgIChPYmplY3Qua2V5cyhUZWFtcy5uYW1lc0FuZElkcykubWFwIChuYW1lKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHtcImtleVwiOiAoVGVhbXMubmFtZXNBbmRJZHNbbmFtZV0pLCBcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7VGVhbXMubmFtZXNBbmRJZHNbbmFtZV19XCJ9LCAobmFtZSkpXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIGlmIEBwcm9wcy5pdGVtXG4gICAgICBpdGVtID0gUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IChAcHJvcHMuaXRlbS51cmwpfSwgKEBwcm9wcy5pdGVtLnRpdGxlKSlcblxuICAgIGlmIEBwcm9wcy5kcm9wZG93blxuICAgICAgZHJvcGRvd24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duQnV0dG9uLCB7XCJ0aXRsZVwiOiAoQHByb3BzLmRyb3Bkb3duLnRpdGxlKX0sXG4gICAgICAgIChAcHJvcHMuZHJvcGRvd24uaXRlbXMubWFwIChpdGVtKSAtPlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHtcImtleVwiOiAoaXRlbS50aXRsZSksIFwiaHJlZlwiOiAoaXRlbS51cmwpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhciwge1wiYnJhbmRcIjogKGJyYW5kKSwgXCJmaXhlZFRvcFwiOiB0cnVlLCBcInRvZ2dsZU5hdktleVwiOiAoMCl9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImNsYXNzTmFtZVwiOiBcImJzLW5hdmJhci1jb2xsYXBzZVwiLCBcImtleVwiOiAoMCksIFwicm9sZVwiOiBcIm5hdmlnYXRpb25cIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9zYXJqYXRhdWx1a2tvXCJ9LCBcIlNhcmphdGF1bHVra29cIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi90aWxhc3RvdFwifSwgXCJUaWxhc3RvdFwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL290dGVsdXRcIn0sIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgKHRlYW1zKSxcbiAgICAgICAgKGl0ZW0pLFxuICAgICAgICAoZHJvcGRvd24pXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmlnYXRpb24iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuUGxheWVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgcGxheWVyID0gQHByb3BzLnBsYXllclxuICAgIHRlYW0gPSBAcHJvcHMudGVhbVxuXG4gICAgcGxheWVycyA9XG4gICAgICB0aXRsZTogXCJQZWxhYWphdFwiLFxuICAgICAgaXRlbXM6IHRlYW0ucm9zdGVyLm1hcCAocGxheWVyKSA9PlxuICAgICAgICB0aXRsZTogXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgIHVybDogXCIvam91a2t1ZWV0LyN7dGVhbS5pbmZvLmlkfS8je3BsYXllci5pZH1cIlxuXG4gICAgIyBUT0RPOiBjaGVjayBwb3NpdGlvbiwgS0ggT0wgVkwgUCB1c2UgcGxheWVycywgTVYgdXNlIGdvYWxpZXNcbiAgICBzdGF0cyA9IHRlYW0uc3RhdHMucGxheWVycy5maWx0ZXIoKHBsYXllcikgPT5cbiAgICAgIFtpZCwgc2x1Z10gPSBwbGF5ZXIuaWQuc3BsaXQoXCIvXCIpXG4gICAgICBpZCBpcyBAcHJvcHMuaWRcbiAgICApWzBdXG5cbiAgICBpdGVtID1cbiAgICAgIHRpdGxlOiB0ZWFtLmluZm8ubmFtZVxuICAgICAgdXJsOiB0ZWFtLmluZm8udXJsXG5cbiAgICBjb25zb2xlLmxvZyBcInBsYXllclwiLCBwbGF5ZXJcbiAgICBjb25zb2xlLmxvZyBcInRlYW1cIiwgdGVhbVxuICAgIGNvbnNvbGUubG9nIFwic3RhdHNcIiwgc3RhdHNcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwicGxheWVyXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCB7XCJkcm9wZG93blwiOiAocGxheWVycyksIFwiaXRlbVwiOiAoaXRlbSl9KSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDIsIG51bGwsIFwiI1wiLCAocGxheWVyLm51bWJlciksIFwiIFwiLCAocGxheWVyLnBvc2l0aW9uKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgzLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtLWxvZ28gI3t0ZWFtLmluZm8uaWR9XCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmluZm8uaWR9XCJ9KSwgXCIgXCIsICh0ZWFtLmluZm8ubmFtZSkpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIChtb21lbnQocGxheWVyLmJpcnRoZGF5KS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIChwbGF5ZXIuaGVpZ2h0KSwgXCIgY21cIiksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIChwbGF5ZXIud2VpZ2h0KSwgXCIga2dcIiksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsIChwbGF5ZXIuc2hvb3RzKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk9cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlNcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlJcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIitcXHgyRi1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIitcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIi1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIllWTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiQVZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJWTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTCVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkFcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkElXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJBaWthXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50Ym9keSwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLmdhbWVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMuZ29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5hc3Npc3RzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMucG9pbnRzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMucGVuYWx0aWVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMucGx1c01pbnVzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMucGx1c3NlcykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLm1pbnVzZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5wb3dlclBsYXlHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLnNob3J0SGFuZGVkR29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy53aW5uaW5nR29hbHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5zaG90cykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLnNob290aW5nUGVyY2VudGFnZSkpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLmZhY2VvZmZzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMuZmFjZW9mZlBlcmNlbnRhZ2UpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5wbGF5aW5nVGltZUF2ZXJhZ2UpKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5QbGF5ZXJTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aGVhZCwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk5hbWVcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJHYW1lc1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkdvYWxzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiQXNzaXN0c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBvaW50c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBlbmFsdGllc1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIitcXHgyRi1cIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChAcHJvcHMuc3RhdHMubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3twbGF5ZXIudGVhbUlkfS8je3BsYXllci5pZH1cIn0sIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXFx4M0VcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucG9pbnRzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBsdXNNaW51cykpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5TY2hlZHVsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIGZpcnN0RGF0ZTogbW9tZW50KCkuc3RhcnRPZihcIm1vbnRoXCIpXG4gICAgbGFzdERhdGU6IG1vbWVudCgpLmVuZE9mKFwibW9udGhcIilcbiAgICBzaG93UHJldmlvdXM6IGZhbHNlXG4gICAgc2hvd05leHQ6IGZhbHNlXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICBtb250aFJhbmdlczogLT5cbiAgICBbZmlyc3RHYW1lLCAuLi4sIGxhc3RHYW1lXSA9IEBwcm9wcy5zY2hlZHVsZVxuICAgIFttb21lbnQoZmlyc3RHYW1lLmRhdGUpLnN0YXJ0T2YoXCJtb250aFwiKSwgbW9tZW50KGxhc3RHYW1lLmRhdGUpLmVuZE9mKFwibW9udGhcIildXG5cbiAgZ2FtZUxpbms6IChnYW1lKSAtPlxuICAgIGlmIG1vbWVudChnYW1lLmRhdGUpLmVuZE9mKFwiZGF5XCIpIDwgbW9tZW50KClcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je2dhbWUuaWR9XCJ9LCAoZ2FtZS5ob21lKSwgXCIgLSBcIiwgKGdhbWUuYXdheSkpXG4gICAgZWxzZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uc3BhbiwgbnVsbCwgKGdhbWUuaG9tZSksIFwiIC0gXCIsIChnYW1lLmF3YXkpKVxuXG4gIHNob3dQcmV2aW91czogLT5cbiAgICBbZmlyc3REYXRlXSA9IEBtb250aFJhbmdlcygpXG4gICAgaWYgbm90IEBzdGF0ZS5maXJzdERhdGUuaXNTYW1lKGZpcnN0RGF0ZSlcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY2xhc3NOYW1lXCI6IFwibG9hZC1tb3JlXCIsIFwiY29sU3BhblwiOiA0LCBcIm9uQ2xpY2tcIjogKEBsb2FkUHJldmlvdXMpfSwgXCJOXFx1MDBlNHl0XFx1MDBlNCBlZGVsbGlzZXQga3V1a2F1ZGV0Li4uXCIpXG4gICAgICAgIClcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBudWxsXG5cbiAgc2hvd05leHQ6IC0+XG4gICAgWy4uLiwgbGFzdERhdGVdID0gQG1vbnRoUmFuZ2VzKClcbiAgICBpZiBub3QgQHN0YXRlLmxhc3REYXRlLmlzU2FtZShsYXN0RGF0ZSlcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY2xhc3NOYW1lXCI6IFwibG9hZC1tb3JlXCIsIFwiY29sU3BhblwiOiA0LCBcIm9uQ2xpY2tcIjogKEBsb2FkTmV4dCl9LCBcIk5cXHUwMGU0eXRcXHUwMGU0IHNldXJhYXZhdCBrdXVrYXVkZXQuLi5cIilcbiAgICAgICAgKVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIG51bGxcblxuICBsb2FkUHJldmlvdXM6IC0+XG4gICAgW2ZpcnN0RGF0ZV0gPSBAbW9udGhSYW5nZXMoKVxuICAgIEBzZXRTdGF0ZShmaXJzdERhdGU6IGZpcnN0RGF0ZSlcblxuICBsb2FkTmV4dDogLT5cbiAgICBbLi4uLCBsYXN0RGF0ZV0gPSBAbW9udGhSYW5nZXMoKVxuICAgIEBzZXRTdGF0ZShsYXN0RGF0ZTogbGFzdERhdGUpXG5cbiAgZ3JvdXBlZFNjaGVkdWxlOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnNjaGVkdWxlKS5maWx0ZXIgKGdhbWUpID0+XG4gICAgICBnYW1lRGF0ZSA9IG1vbWVudChnYW1lLmRhdGUpXG4gICAgICBnYW1lRGF0ZSA+PSBAc3RhdGUuZmlyc3REYXRlIGFuZCBnYW1lRGF0ZSA8PSBAc3RhdGUubGFzdERhdGVcbiAgICAuZ3JvdXBCeSAoZ2FtZSkgLT5cbiAgICAgIG1vbWVudChnYW1lLmRhdGUpLmZvcm1hdChcIllZWVktTU1cIilcblxuICBtb250aGx5R2FtZXM6IC0+XG4gICAgQGdyb3VwZWRTY2hlZHVsZSgpLm1hcCAoZ2FtZXMsIG1vbnRoKSA9PlxuICAgICAgZGF0ZXNXaXRoR2FtZXMgPSBfLmNoYWluKGdhbWVzKS5ncm91cEJ5IChnYW1lKSAtPlxuICAgICAgICBtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRlYW0tc2NoZWR1bGVcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImNvbFNwYW5cIjogNH0sIChtb21lbnQobW9udGgsIFwiWVlZWS1NTVwiKS5mb3JtYXQoXCJNTU1NXCIpKSlcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChkYXRlc1dpdGhHYW1lcy5tYXAgKGdhbWVzLCBnYW1lRGF0ZSkgPT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50Ym9keSwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY2xhc3NOYW1lXCI6IFwiZ2FtZS1kYXRlXCIsIFwiY29sU3BhblwiOiA0fSwgKGdhbWVEYXRlKSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAoZ2FtZXMubWFwIChnYW1lKSA9PlxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChnYW1lLmlkKX0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChnYW1lLnRpbWUpKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKEBnYW1lTGluayhnYW1lKSkpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoZ2FtZS5ob21lU2NvcmUpLCBcIi1cIiwgKGdhbWUuYXdheVNjb3JlKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChnYW1lLmF0dGVuZGFuY2UpKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwic2NoZWR1bGVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMSwgbnVsbCwgXCJPdHRlbHVvaGplbG1hXCIpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICAgIChAc2hvd1ByZXZpb3VzKCkpLFxuICAgICAgICAoQG1vbnRobHlHYW1lcygpKSxcbiAgICAgICAgKEBzaG93TmV4dCgpKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlZHVsZSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGFibGVTb3J0TWl4aW4gPSByZXF1aXJlICcuL21peGlucy90YWJsZV9zb3J0J1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cblN0YW5kaW5ncyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgbWl4aW5zOiBbVGFibGVTb3J0TWl4aW5dXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHNvcnRGaWVsZDogXCJwb2ludHNcIlxuICAgIHNvcnREaXJlY3Rpb246IFwiZGVzY1wiXG4gICAgc29ydFR5cGU6IFwiaW50ZWdlclwiXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICByZW5kZXI6IC0+XG4gICAgc3RhbmRpbmdzID0gQHByb3BzLnN0YW5kaW5ncy5zb3J0KEBzb3J0KS5tYXAgKHRlYW0pIC0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6ICh0ZWFtLm5hbWUpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLnBvc2l0aW9uKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je1RlYW1zLm5hbWVUb0lkKHRlYW0ubmFtZSl9XCJ9LCAodGVhbS5uYW1lKSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0uZ2FtZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLndpbnMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLnRpZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLmxvc2VzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5leHRyYVBvaW50cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0ucG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5nb2Fsc0ZvcikpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0uZ29hbHNBZ2FpbnN0KSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5wb3dlcnBsYXlQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5zaG9ydGhhbmRQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5wb2ludHNQZXJHYW1lKSlcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCBcIlNhcmphdGF1bHVra29cIiksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aGVhZCwge1wiY2xhc3NOYW1lXCI6IFwic29ydGFibGUtdGhlYWRcIiwgXCJvbkNsaWNrXCI6IChAc2V0U29ydCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiZ2FtZXNcIn0sIFwiT1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcIndpbnNcIn0sIFwiVlwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInRpZXNcIn0sIFwiVFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImxvc2VzXCJ9LCBcIkhcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJleHRyYVBvaW50c1wifSwgXCJMUFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBvaW50c1wifSwgXCJQXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiZ29hbHNGb3JcIn0sIFwiVE1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0FnYWluc3RcIn0sIFwiUE1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJwb3dlcnBsYXlQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiWVYlXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwic2hvcnRoYW5kUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkFWJVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBvaW50c1BlckdhbWVcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJQXFx4MkZPXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50Ym9keSwgbnVsbCxcbiAgICAgICAgICAgIChzdGFuZGluZ3MpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YW5kaW5ncyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xue1RhYlBhbmUsIE5hdiwgTmF2SXRlbX0gPSByZXF1aXJlIFwicmVhY3QtYm9vdHN0cmFwXCJcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5cblN0YXRzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcIm1hYWxpdmFoZGl0XCIgdGhlbiBcImdvYWxpZXNcIlxuICAgICAgZWxzZSBcInBsYXllcnNcIlxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiVGlsYXN0b3RcIiksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3RpbGFzdG90XCIsIFwia2V5XCI6IFwicGxheWVyc1wifSwgXCJLZW50dFxcdTAwZTRwZWxhYWphdFwiKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvdGlsYXN0b3QvbWFhbGl2YWhkaXRcIiwgXCJrZXlcIjogXCJnb2FsaWVzXCJ9LCBcIk1hYWxpdmFoZGl0XCIpXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFiLWNvbnRlbnRcIiwgXCJyZWZcIjogXCJwYW5lc1wifSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInBsYXllcnNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInBsYXllcnNcIil9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDIsIG51bGwsIFwiS2VudHRcXHUwMGU0cGVsYWFqYXRcIilcblxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJnb2FsaWVzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJnb2FsaWVzXCIpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgyLCBudWxsLCBcIk1hYWxpdmFoZGl0XCIpXG5cbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblBsYXllclN0YXRzID0gcmVxdWlyZSAnLi9wbGF5ZXJfc3RhdHMnXG5UZWFtU2NoZWR1bGUgPSByZXF1aXJlICcuL3RlYW1fc2NoZWR1bGUnXG5UZWFtU3RhdHMgPSByZXF1aXJlICcuL3RlYW1fc3RhdHMnXG5UZWFtUm9zdGVyID0gcmVxdWlyZSAnLi90ZWFtX3Jvc3Rlcidcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UZWFtcyA9IHJlcXVpcmUgJy4uL2xpYi90ZWFtcydcblxue1RhYlBhbmUsIEp1bWJvdHJvbiwgQnV0dG9uVG9vbGJhciwgQnV0dG9uLCBDb2wsIFJvdywgTmF2LCBOYXZJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuXG5UZWFtID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIGxvZ286IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaW1nLCB7XCJzcmNcIjogKFRlYW1zLmxvZ28oQHByb3BzLnRlYW0uaW5mby5uYW1lKSksIFwiYWx0XCI6IChAcHJvcHMudGVhbS5pbmZvLm5hbWUpfSlcblxuICByZW5kZXI6IC0+XG4gICAgYWN0aXZlS2V5ID0gc3dpdGNoIEBwcm9wcy5hY3RpdmVcbiAgICAgIHdoZW4gXCJwZWxhYWphdFwiIHRoZW4gXCJwbGF5ZXJzXCJcbiAgICAgIHdoZW4gXCJ0aWxhc3RvdFwiIHRoZW4gXCJzdGF0c1wiXG4gICAgICBlbHNlIFwic2NoZWR1bGVcIlxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0ZWFtXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEp1bWJvdHJvbiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoMTIpLCBcIm1kXCI6ICg2KX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCAoQGxvZ28oKSksIFwiIFwiLCAoQHByb3BzLnRlYW0uaW5mby5uYW1lKSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDEyKSwgXCJtZFwiOiAoNil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRlYW0tY29udGFpbmVyXCJ9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnVsLCBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00ubGksIG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmxvbmdOYW1lKSksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5saSwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8uYWRkcmVzcykpLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00ubGksIG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmVtYWlsKSlcbiAgICAgICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtcImJzU3R5bGVcIjogXCJwcmltYXJ5XCIsIFwiYnNTaXplXCI6IFwibGFyZ2VcIiwgXCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLnRpY2tldHNVcmwpfSwgXCJMaXB1dFwiKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7XCJic1N0eWxlXCI6IFwicHJpbWFyeVwiLCBcImJzU2l6ZVwiOiBcImxhcmdlXCIsIFwiaHJlZlwiOiAoQHByb3BzLnRlYW0uaW5mby5sb2NhdGlvblVybCl9LCBcIkhhbGxpbiBzaWphaW50aVwiKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLmlkfVwiLCBcImtleVwiOiBcInNjaGVkdWxlXCJ9LCBcIk90dGVsdXRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLmlkfS90aWxhc3RvdFwiLCBcImtleVwiOiBcInN0YXRzXCJ9LCBcIlRpbGFzdG90XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy5pZH0vcGVsYWFqYXRcIiwgXCJrZXlcIjogXCJwbGF5ZXJzXCJ9LCBcIlBlbGFhamF0XCIpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYi1jb250ZW50XCIsIFwicmVmXCI6IFwicGFuZXNcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInNjaGVkdWxlXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJzY2hlZHVsZVwiKX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCBcIk90dGVsdXRcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVNjaGVkdWxlLCB7XCJ0ZWFtXCI6IChAcHJvcHMudGVhbSl9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic3RhdHNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInN0YXRzXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiVGlsYXN0b3RcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVN0YXRzLCB7XCJ0ZWFtSWRcIjogKEBwcm9wcy5pZCksIFwic3RhdHNcIjogKEBwcm9wcy50ZWFtLnN0YXRzKX0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJwbGF5ZXJzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJwbGF5ZXJzXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiUGVsYWFqYXRcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVhbVJvc3Rlciwge1widGVhbUlkXCI6IChAcHJvcHMuaWQpLCBcInJvc3RlclwiOiAoQHByb3BzLnRlYW0ucm9zdGVyKX0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbVJvc3RlciA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZ3JvdXBlZFJvc3RlcjogLT5cbiAgICBfLmNoYWluKEBwcm9wcy5yb3N0ZXIpXG4gICAgLmdyb3VwQnkoKHBsYXllcikgLT4gcGxheWVyLnBvc2l0aW9uKVxuICAgIC5yZWR1Y2UoKHJlc3VsdCwgcGxheWVyLCBwb3NpdGlvbikgLT5cbiAgICAgIGdyb3VwID0gc3dpdGNoXG4gICAgICAgIHdoZW4gXy5pbmNsdWRlKFtcIktIXCIsIFwiT0xcIiwgXCJWTFwiXSwgcG9zaXRpb24pIHRoZW4gXCJIecO2a2vDpMOkasOkdFwiXG4gICAgICAgIHdoZW4gXy5pbmNsdWRlKFtcIk9QXCIsIFwiVlBcIl0sIHBvc2l0aW9uKSB0aGVuIFwiUHVvbHVzdGFqYXRcIlxuICAgICAgICB3aGVuIHBvc2l0aW9uIGlzIFwiTVZcIiB0aGVuIFwiTWFhbGl2YWhkaXRcIlxuICAgICAgcmVzdWx0W2dyb3VwXSB8fD0gW11cbiAgICAgIHJlc3VsdFtncm91cF0ucHVzaCBwbGF5ZXJcbiAgICAgIHJlc3VsdFxuICAgICwge30pXG5cbiAgcmVuZGVyOiAtPlxuICAgIGdyb3VwcyA9IEBncm91cGVkUm9zdGVyKCkubWFwIChwbGF5ZXJzLCBncm91cCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCB7XCJrZXlcIjogKGdyb3VwKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJjb2xTcGFuXCI6IDZ9LCAoZ3JvdXApKVxuICAgICAgICApLFxuICAgICAgICAoXy5jaGFpbihwbGF5ZXJzKS5mbGF0dGVuKCkubWFwIChwbGF5ZXIpID0+XG4gICAgICAgICAgdXJsID0gXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJcbiAgICAgICAgICB0aXRsZSA9IFwiI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImhyZWZcIjogKHVybCl9LCAodGl0bGUpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uc3Ryb25nLCBudWxsLCAocGxheWVyLm51bWJlcikpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmhlaWdodCkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIud2VpZ2h0KSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaG9vdHMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAobW9tZW50KCkuZGlmZihwbGF5ZXIuYmlydGhkYXksIFwieWVhcnNcIikpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1yb3N0ZXJcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTmltaVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk51bWVyb1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBpdHV1c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBhaW5vXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiS1xcdTAwZTR0aXN5eXNcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJJa1xcdTAwZTRcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChncm91cHMpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1Sb3N0ZXIiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5tb21lbnQubG9jYWxlKCdmaSdcbiAgbW9udGhzIDogW1xuICAgIFwiVGFtbWlrdXVcIiwgXCJIZWxtaWt1dVwiLCBcIk1hYWxpc2t1dVwiLCBcIkh1aHRpa3V1XCIsIFwiVG91a29rdXVcIiwgXCJLZXPDpGt1dVwiLCBcIkhlaW7DpGt1dVwiLFxuICAgIFwiRWxva3V1XCIsIFwiU3l5c2t1dVwiLCBcIkxva2FrdXVcIiwgXCJNYXJyYXNrdXVcIiwgXCJKb3VsdWt1dVwiXG4gIF1cbilcbm1vbWVudC5sb2NhbGUoJ2ZpJylcblxuVGVhbVNjaGVkdWxlID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBnYW1lTGluazogKGdhbWUpIC0+XG4gICAgaWYgbW9tZW50KGdhbWUuZGF0ZSkgPCBtb21lbnQoKVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7Z2FtZS5pZH1cIn0sIChAdGl0bGVTdHlsZShnYW1lLmhvbWUpKSwgXCIgLSBcIiwgKEB0aXRsZVN0eWxlKGdhbWUuYXdheSkpKVxuICAgIGVsc2VcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnNwYW4sIG51bGwsIChAdGl0bGVTdHlsZShnYW1lLmhvbWUpKSwgXCIgLSBcIiwgKEB0aXRsZVN0eWxlKGdhbWUuYXdheSkpKVxuXG4gIHRpdGxlU3R5bGU6IChuYW1lKSAtPlxuICAgIGlmIEBwcm9wcy50ZWFtLmluZm8ubmFtZSBpcyBuYW1lXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5zdHJvbmcsIG51bGwsIChuYW1lKSlcbiAgICBlbHNlXG4gICAgICBuYW1lXG5cbiAgbG9nbzogKG5hbWUpIC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaW1nLCB7XCJzcmNcIjogKFRlYW1zLmxvZ28obmFtZSkpLCBcImFsdFwiOiAobmFtZSl9KVxuXG4gIGdyb3VwZWRTY2hlZHVsZTogLT5cbiAgICBfLmNoYWluKEBwcm9wcy50ZWFtLnNjaGVkdWxlKS5ncm91cEJ5IChnYW1lKSAtPlxuICAgICAgbW9tZW50KGdhbWUuZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTVwiKVxuXG4gIHJlbmRlcjogLT5cbiAgICBtb250aGx5R2FtZXMgPSBAZ3JvdXBlZFNjaGVkdWxlKCkubWFwIChnYW1lcywgbW9udGgpID0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50Ym9keSwge1wia2V5XCI6IChtb250aCl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY29sU3BhblwiOiA0fSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKVxuICAgICAgICApLFxuICAgICAgICAoZ2FtZXMubWFwIChnYW1lKSA9PlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKGdhbWUuaWQpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAobW9tZW50KGdhbWUuZGF0ZSkuZm9ybWF0KFwiREQuTU0uWVlZWVwiKSksIFwiIFwiLCAoZ2FtZS50aW1lKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKEBnYW1lTGluayhnYW1lKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChnYW1lLmhvbWVTY29yZSksIFwiLVwiLCAoZ2FtZS5hd2F5U2NvcmUpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoZ2FtZS5hdHRlbmRhbmNlKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRlYW0tc2NoZWR1bGVcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUFxcdTAwZTRpdlxcdTAwZTRtXFx1MDBlNFxcdTAwZTRyXFx1MDBlNFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkpvdWtrdWVldFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlR1bG9zXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiWWxlaXNcXHUwMGY2bVxcdTAwZTRcXHUwMGU0clxcdTAwZTRcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChtb250aGx5R2FtZXMpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1TY2hlZHVsZSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGFibGVTb3J0TWl4aW4gPSByZXF1aXJlICcuL21peGlucy90YWJsZV9zb3J0J1xuXG5UZWFtU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIG1peGluczogW1RhYmxlU29ydE1peGluXVxuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBzb3J0RmllbGQ6IFwicG9pbnRzXCJcbiAgICBzb3J0RGlyZWN0aW9uOiBcImRlc2NcIlxuICAgIHNvcnRUeXBlOiBcImludGVnZXJcIlxuXG4gIHJlbmRlcjogLT5cbiAgICBwbGF5ZXJzID0gQHByb3BzLnN0YXRzLnBsYXllcnMuc29ydChAc29ydCkubWFwIChwbGF5ZXIpID0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nYW1lcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5hc3Npc3RzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBvaW50cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucGx1c01pbnVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBsdXNzZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIubWludXNlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wb3dlclBsYXlHb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaG9ydEhhbmRlZEdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLndpbm5pbmdHb2FscykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaG90cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zaG9vdGluZ1BlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZmFjZW9mZnMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZmFjZW9mZlBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucGxheWluZ1RpbWVBdmVyYWdlKSlcbiAgICAgIClcblxuICAgIGdvYWxpZXMgPSBAcHJvcHMuc3RhdHMuZ29hbGllcy5tYXAgKHBsYXllcikgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbUlkfS8je3BsYXllci5pZH1cIn0sIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLndpbnMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIudGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5sb3NzZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuc2F2ZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZ29hbHNBbGxvd2VkKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnNodXRvdXRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdvYWxzQXZlcmFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zYXZpbmdQZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmFzc2lzdHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBlbmFsdGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci53aW5QZXJjZW50YWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCB7XCJjb2xTcGFuXCI6IDJ9LCAocGxheWVyLm1pbnV0ZXMpKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1yb3N0ZXJcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCB7XCJjbGFzc05hbWVcIjogXCJzb3J0YWJsZS10aGVhZFwiLCBcIm9uQ2xpY2tcIjogKEBzZXRTb3J0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY29sU3BhblwiOiAxN30sIFwiUGVsYWFqYXRcIilcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImxhc3ROYW1lXCIsIFwiZGF0YS10eXBlXCI6IFwic3RyaW5nXCJ9LCBcIk5pbWlcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiZ2FtZXNcIn0sIFwiT1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc1wifSwgXCJNXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImFzc2lzdHNcIn0sIFwiU1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJwb2ludHNcIn0sIFwiUFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJwZW5hbHRpZXNcIn0sIFwiUlwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJwbHVzTWludXNcIn0sIFwiK1xceDJGLVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJwbHVzc2VzXCJ9LCBcIitcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwibWludXNlc1wifSwgXCItXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBvd2VyUGxheUdvYWxzXCJ9LCBcIllWTVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJzaG9ydEhhbmRlZEdvYWxzXCJ9LCBcIkFWTVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJ3aW5uaW5nR29hbHNcIn0sIFwiVk1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwic2hvdHNcIn0sIFwiTFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJzaG9vdGluZ1BlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJMJVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJmYWNlb2Zmc1wifSwgXCJBXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImZhY2VvZmZQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiQSVcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwicGxheWluZ1RpbWVBdmVyYWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiQWlrYVwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGJvZHksIG51bGwsXG4gICAgICAgICAgKHBsYXllcnMpXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImNvbFNwYW5cIjogMTd9LCBcIk1hYWxpdmFoZGl0XCIpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk5pbWlcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJQT1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlZcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJUXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiSFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlRPXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUE1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJOUFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIktBXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiVCVcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJNXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiU1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJSXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiViVcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY29sU3BhblwiOiAyfSwgXCJBaWthXCIpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50Ym9keSwgbnVsbCxcbiAgICAgICAgICAoZ29hbGllcylcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVGVhbXNMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJyb3dcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRlYW1zLXZpZXcgY29sLXhzLTEyIGNvbC1zbS0xMiBjb2wtbWQtMTIgY29sLWxnLTEyXCJ9LFxuICAgICAgICAoXG4gICAgICAgICAgQHByb3BzLnRlYW1zLm1hcCAodGVhbSkgLT5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImtleVwiOiAodGVhbS5pZCksIFwiY2xhc3NOYW1lXCI6IFwidGVhbS1sb2dvICN7dGVhbS5pZH1cIiwgXCJocmVmXCI6IFwiL2pvdWtrdWVldC8je3RlYW0uaWR9XCJ9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1zTGlzdCIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5Ub3BTY29yZXJzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTmltaVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk90dGVsdXRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJNYWFsaXRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJTeVxcdTAwZjZ0XFx1MDBmNnRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJQaXN0ZWV0XCIpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICAoQHByb3BzLnN0YXRzLnNjb3JpbmdTdGF0cy5maWx0ZXIgKHBsYXllciwgaW5kZXgpIC0+XG4gICAgICAgICAgaW5kZXggPCAyMFxuICAgICAgICAubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3twbGF5ZXIudGVhbUlkfS8je3BsYXllci5pZH1cIn0sIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nYW1lcykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZ29hbHMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmFzc2lzdHMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBvaW50cykpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcFNjb3JlcnMiXX0=
