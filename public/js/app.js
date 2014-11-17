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
    return React.DOM.div(null, Navigation(null), React.DOM.div({
      "className": "jumbotron"
    }, React.DOM.h1(null, "Liiga.pw"), React.DOM.p(null, "Liigan tilastot nopeasti ja vaivattomasti")), TeamsListView({
      "teams": this.props.teams
    }), TopScorersView({
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
      return React.DOM.tr(null, React.DOM.th({
        "colSpan": "3"
      }, event.header));
    } else {
      return React.DOM.tr(null, React.DOM.td(null, this.props.game[event.team]), React.DOM.td(null, event.time), React.DOM.td(null, event.text));
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
    return React.DOM.div(null, Navigation(null), Row(null, Col({
      "xs": 4.,
      "md": 4.
    }, React.DOM.h1(null, this.props.game.home)), Col({
      "xs": 4.,
      "md": 4.
    }, React.DOM.h1(null, this.props.game.homeScore, " - ", this.props.game.awayScore), React.DOM.div(null, "Yleis\u00f6\u00e4: ", this.props.game.attendance)), Col({
      "xs": 4.,
      "md": 4.
    }, React.DOM.h1(null, this.props.game.away))), Nav({
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, NavItem({
      "href": "/ottelut/" + this.props.id,
      "key": "events"
    }, "Tapahtumat"), NavItem({
      "href": "/ottelut/" + this.props.id + "/tilastot",
      "key": "stats"
    }, "Tilastot"), NavItem({
      "href": "/ottelut/" + this.props.id + "/ketjut",
      "key": "lineUps"
    }, "Ketjut")), React.DOM.div({
      "className": "tab-content",
      "ref": "panes"
    }, TabPane({
      "key": "events",
      "active": activeKey === "events"
    }, React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table table-striped"
    }, events.map((function(_this) {
      return function(event) {
        return _this.event(event);
      };
    })(this))))), TabPane({
      "key": "stats",
      "active": activeKey === "stats"
    }, React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table table-striped"
    }, this.props.stats.home.players.map(function(player) {
      return React.DOM.tr(null, React.DOM.td(null, player.firstName, " ", player.lastName));
    }), this.props.stats.home.goalies.map(function(goalie) {
      return React.DOM.tr(null, React.DOM.td(null, goalie.firstName, " ", goalie.lastName));
    })), React.DOM.table({
      "className": "table table-striped"
    }, this.props.stats.away.players.map(function(player) {
      return React.DOM.tr(null, React.DOM.td(null, player.firstName, " ", player.lastName));
    }), this.props.stats.away.goalies.map(function(goalie) {
      return React.DOM.tr(null, React.DOM.td(null, goalie.firstName, " ", goalie.lastName));
    })))), TabPane({
      "key": "lineUps",
      "active": activeKey === "lineUps"
    }, React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
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
    brand = React.DOM.a({
      "href": "/",
      "className": "navbar-brand"
    }, "Liiga");
    teams = DropdownButton({
      "title": "Joukkueet"
    }, Object.keys(Teams.namesAndIds).map(function(name) {
      return MenuItem({
        "key": Teams.namesAndIds[name],
        "href": "/joukkueet/" + Teams.namesAndIds[name]
      }, name);
    }));
    if (this.props.item) {
      item = NavItem({
        "href": this.props.item.url
      }, this.props.item.title);
    }
    if (this.props.dropdown) {
      dropdown = DropdownButton({
        "title": this.props.dropdown.title
      }, this.props.dropdown.items.map(function(item) {
        return MenuItem({
          "key": item.title,
          "href": item.url
        }, item.title);
      }));
    }
    return Navbar({
      "brand": brand,
      "fixedTop": true,
      "toggleNavKey": 0.
    }, Nav({
      "className": "bs-navbar-collapse",
      "key": 0.,
      "role": "navigation"
    }, NavItem({
      "href": "/sarjataulukko"
    }, "Sarjataulukko"), NavItem({
      "href": "/tilastot"
    }, "Tilastot"), NavItem({
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
    return React.DOM.div({
      "className": "player"
    }, Navigation({
      "dropdown": players,
      "item": item
    }), React.DOM.h1(null, player.firstName, " ", player.lastName), React.DOM.h2(null, "#", player.number, " ", player.position), React.DOM.h3(null, React.DOM.a({
      "className": "team-logo " + team.info.id,
      "href": "/joukkueet/" + team.info.id
    }), " ", team.info.name), React.DOM.div(null, moment(player.birthday).format("DD.MM.YYYY")), React.DOM.div(null, player.height, " cm"), React.DOM.div(null, player.weight, " kg"), React.DOM.div(null, player.shoots), React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "O"), React.DOM.th(null, "M"), React.DOM.th(null, "S"), React.DOM.th(null, "P"), React.DOM.th(null, "R"), React.DOM.th(null, "+\x2F-"), React.DOM.th(null, "+"), React.DOM.th(null, "-"), React.DOM.th(null, "YVM"), React.DOM.th(null, "AVM"), React.DOM.th(null, "VM"), React.DOM.th(null, "L"), React.DOM.th(null, "L%"), React.DOM.th(null, "A"), React.DOM.th(null, "A%"), React.DOM.th(null, "Aika"))), React.DOM.tbody(null, React.DOM.tr(null, React.DOM.td(null, stats.games), React.DOM.td(null, stats.goals), React.DOM.td(null, stats.assists), React.DOM.td(null, stats.points), React.DOM.td(null, stats.penalties), React.DOM.td(null, stats.plusMinus), React.DOM.td(null, stats.plusses), React.DOM.td(null, stats.minuses), React.DOM.td(null, stats.powerPlayGoals), React.DOM.td(null, stats.shortHandedGoals), React.DOM.td(null, stats.winningGoals), React.DOM.td(null, stats.shots), React.DOM.td(null, stats.shootingPercentage), React.DOM.td(null, stats.faceoffs), React.DOM.td(null, stats.faceoffPercentage), React.DOM.td(null, stats.playingTimeAverage))))));
  }
});

module.exports = Player;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee":[function(require,module,exports){
var PlayerStats, React;

React = require('react/addons');

PlayerStats = React.createClass({
  render: function() {
    return React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table table-striped"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Name"), React.DOM.th(null, "Games"), React.DOM.th(null, "Goals"), React.DOM.th(null, "Assists"), React.DOM.th(null, "Points"), React.DOM.th(null, "Penalties"), React.DOM.th(null, "+\x2F-"))), this.props.stats.map(function(player) {
      return React.DOM.tr({
        "key": player.id
      }, React.DOM.td(null, React.DOM.a({
        "href": "/joukkueet/" + player.teamId + "/" + player.id
      }, player.firstName, " \x3E", player.lastName)), React.DOM.td(null, player.games), React.DOM.td(null, player.goals), React.DOM.td(null, player.assists), React.DOM.td(null, player.points), React.DOM.td(null, player.penalties), React.DOM.td(null, player.plusMinus));
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
      return React.DOM.a({
        "href": "/ottelut/" + match.id
      }, match.home, " - ", match.away);
    } else {
      return React.DOM.span(null, match.home, " - ", match.away);
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
        return React.DOM.tbody(null, React.DOM.tr(null, React.DOM.th({
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM"))), matches.map(function(match) {
          return React.DOM.tr({
            "key": match.id
          }, React.DOM.td(null, moment(match.date).format("DD.MM.YYYY"), " ", match.time), React.DOM.td(null, _this.matchLink(match)), React.DOM.td(null, match.homeScore, "-", match.awayScore), React.DOM.td(null, match.attendance));
        }));
      };
    })(this));
    return React.DOM.div(null, Navigation(null), React.DOM.h1(null, "Otteluohjelma"), React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
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
      return React.DOM.tr({
        "key": team.name
      }, React.DOM.td(null, team.position), React.DOM.td(null, React.DOM.a({
        "href": "/joukkueet/" + (Teams.nameToId(team.name))
      }, team.name)), React.DOM.td(null, team.games), React.DOM.td(null, team.wins), React.DOM.td(null, team.ties), React.DOM.td(null, team.loses), React.DOM.td(null, team.extraPoints), React.DOM.td(null, team.points), React.DOM.td(null, team.goalsFor), React.DOM.td(null, team.goalsAgainst), React.DOM.td(null, team.powerplayPercentage), React.DOM.td(null, team.shorthandPercentage), React.DOM.td(null, team.pointsPerGame));
    });
    return React.DOM.div(null, Navigation(null), React.DOM.h1(null, "Sarjataulukko"), React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table table-striped team-schedule"
    }, React.DOM.thead({
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.DOM.tr(null, React.DOM.th(null), React.DOM.th(null), React.DOM.th({
      "data-sort": "games"
    }, "O"), React.DOM.th({
      "data-sort": "wins"
    }, "V"), React.DOM.th({
      "data-sort": "ties"
    }, "T"), React.DOM.th({
      "data-sort": "loses"
    }, "H"), React.DOM.th({
      "data-sort": "extraPoints"
    }, "LP"), React.DOM.th({
      "data-sort": "points"
    }, "P"), React.DOM.th({
      "data-sort": "goalsFor"
    }, "TM"), React.DOM.th({
      "data-sort": "goalsAgainst"
    }, "PM"), React.DOM.th({
      "data-sort": "powerplayPercentage",
      "data-type": "float"
    }, "YV%"), React.DOM.th({
      "data-sort": "shorthandPercentage",
      "data-type": "float"
    }, "AV%"), React.DOM.th({
      "data-sort": "pointsPerGame",
      "data-type": "float"
    }, "P\x2FO"))), React.DOM.tbody(null, standings))));
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
    return React.DOM.div(null, Navigation(null), React.DOM.h1(null, "Tilastot"), React.DOM.div(null, Nav({
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, NavItem({
      "href": "/tilastot",
      "key": "players"
    }, "Kentt\u00e4pelaajat"), NavItem({
      "href": "/tilastot/maalivahdit",
      "key": "goalies"
    }, "Maalivahdit")), React.DOM.div({
      "className": "tab-content",
      "ref": "panes"
    }, TabPane({
      "key": "players",
      "active": activeKey === "players"
    }, React.DOM.h2(null, "Kentt\u00e4pelaajat")), TabPane({
      "key": "goalies",
      "active": activeKey === "goalies"
    }, React.DOM.h2(null, "Maalivahdit")))));
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
    return React.DOM.img({
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
    return React.DOM.div(null, Navigation(null), React.DOM.div({
      "className": "team"
    }, Jumbotron(null, Row(null, Col({
      "xs": 12.,
      "md": 6.
    }, React.DOM.h1(null, this.logo(), " ", this.props.team.info.name)), Col({
      "xs": 12.,
      "md": 6.
    }, React.DOM.div({
      "className": "team-container"
    }, React.DOM.ul(null, React.DOM.li(null, this.props.team.info.longName), React.DOM.li(null, this.props.team.info.address), React.DOM.li(null, this.props.team.info.email)), ButtonToolbar(null, Button({
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.ticketsUrl
    }, "Liput"), Button({
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.locationUrl
    }, "Hallin sijainti")))))), React.DOM.div(null, Nav({
      "bsStyle": "tabs",
      "activeKey": activeKey,
      "ref": "tabs"
    }, NavItem({
      "href": "/joukkueet/" + this.props.id,
      "key": "schedule"
    }, "Ottelut"), NavItem({
      "href": "/joukkueet/" + this.props.id + "/tilastot",
      "key": "stats"
    }, "Tilastot"), NavItem({
      "href": "/joukkueet/" + this.props.id + "/pelaajat",
      "key": "players"
    }, "Pelaajat")), React.DOM.div({
      "className": "tab-content",
      "ref": "panes"
    }, TabPane({
      "key": "schedule",
      "active": activeKey === "schedule"
    }, React.DOM.h1(null, "Ottelut"), TeamSchedule({
      "team": this.props.team
    })), TabPane({
      "key": "stats",
      "active": activeKey === "stats"
    }, React.DOM.h1(null, "Tilastot"), TeamStats({
      "teamId": this.props.id,
      "stats": this.props.team.stats
    })), TabPane({
      "key": "players",
      "active": activeKey === "players"
    }, React.DOM.h1(null, "Pelaajat"), TeamRoster({
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
        return React.DOM.tbody({
          "key": group
        }, React.DOM.tr(null, React.DOM.th({
          "colSpan": 6
        }, group)), _.chain(players).flatten().map(function(player) {
          var title, url;
          url = "/joukkueet/" + _this.props.teamId + "/" + player.id;
          title = "" + player.firstName + " " + player.lastName;
          return React.DOM.tr({
            "key": player.id
          }, React.DOM.td(null, React.DOM.a({
            "href": url
          }, title)), React.DOM.td(null, React.DOM.strong(null, player.number)), React.DOM.td(null, player.height), React.DOM.td(null, player.weight), React.DOM.td(null, player.shoots), React.DOM.td(null, moment().diff(player.birthday, "years")));
        }));
      };
    })(this));
    return React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table table-striped team-roster"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Nimi"), React.DOM.th(null, "Numero"), React.DOM.th(null, "Pituus"), React.DOM.th(null, "Paino"), React.DOM.th(null, "K\u00e4tisyys"), React.DOM.th(null, "Ik\u00e4"))), groups));
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
      return React.DOM.a({
        "href": "/ottelut/" + match.id
      }, this.titleStyle(match.home), " - ", this.titleStyle(match.away));
    } else {
      return React.DOM.span(null, this.titleStyle(match.home), " - ", this.titleStyle(match.away));
    }
  },
  titleStyle: function(name) {
    if (this.props.team.info.name === name) {
      return React.DOM.strong(null, name);
    } else {
      return name;
    }
  },
  logo: function(name) {
    return React.DOM.img({
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
        return React.DOM.tbody({
          "key": month
        }, React.DOM.tr(null, React.DOM.th({
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM"))), matches.map(function(match) {
          return React.DOM.tr({
            "key": match.id
          }, React.DOM.td(null, moment(match.date).format("DD.MM.YYYY"), " ", match.time), React.DOM.td(null, _this.matchLink(match)), React.DOM.td(null, match.homeScore, "-", match.awayScore), React.DOM.td(null, match.attendance));
        }));
      };
    })(this));
    return React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table table-striped team-schedule"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "P\u00e4iv\u00e4m\u00e4\u00e4r\u00e4"), React.DOM.th(null, "Joukkueet"), React.DOM.th(null, "Tulos"), React.DOM.th(null, "Yleis\u00f6m\u00e4\u00e4r\u00e4"))), monthlyMatches));
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
        return React.DOM.tr({
          "key": player.id
        }, React.DOM.td(null, React.DOM.a({
          "href": "/joukkueet/" + _this.props.teamId + "/" + player.id
        }, player.firstName, " ", player.lastName)), React.DOM.td(null, player.games), React.DOM.td(null, player.goals), React.DOM.td(null, player.assists), React.DOM.td(null, player.points), React.DOM.td(null, player.penalties), React.DOM.td(null, player.plusMinus), React.DOM.td(null, player.plusses), React.DOM.td(null, player.minuses), React.DOM.td(null, player.powerPlayGoals), React.DOM.td(null, player.shortHandedGoals), React.DOM.td(null, player.winningGoals), React.DOM.td(null, player.shots), React.DOM.td(null, player.shootingPercentage), React.DOM.td(null, player.faceoffs), React.DOM.td(null, player.faceoffPercentage), React.DOM.td(null, player.playingTimeAverage));
      };
    })(this));
    goalies = this.props.stats.goalies.map((function(_this) {
      return function(player) {
        return React.DOM.tr({
          "key": player.id
        }, React.DOM.td(null, player.firstName, " ", player.lastName), React.DOM.td(null, player.games), React.DOM.td(null, player.wins), React.DOM.td(null, player.ties), React.DOM.td(null, player.losses), React.DOM.td(null, player.saves), React.DOM.td(null, player.goalsAllowed), React.DOM.td(null, player.shutouts), React.DOM.td(null, player.goalsAverage), React.DOM.td(null, player.savingPercentage), React.DOM.td(null, player.goals), React.DOM.td(null, player.assists), React.DOM.td(null, player.points), React.DOM.td(null, player.penalties), React.DOM.td(null, player.winPercentage), React.DOM.td({
          "colSpan": 2
        }, player.minutes));
      };
    })(this));
    return React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table table-striped team-roster"
    }, React.DOM.thead({
      "className": "sortable-thead",
      "onClick": this.setSort
    }, React.DOM.tr(null, React.DOM.th({
      "colSpan": 17
    }, "Pelaajat")), React.DOM.tr(null, React.DOM.th({
      "data-sort": "lastName",
      "data-type": "string"
    }, "Nimi"), React.DOM.th({
      "data-sort": "games"
    }, "O"), React.DOM.th({
      "data-sort": "goals"
    }, "M"), React.DOM.th({
      "data-sort": "assists"
    }, "S"), React.DOM.th({
      "data-sort": "points"
    }, "P"), React.DOM.th({
      "data-sort": "penalties"
    }, "R"), React.DOM.th({
      "data-sort": "plusMinus"
    }, "+\x2F-"), React.DOM.th({
      "data-sort": "plusses"
    }, "+"), React.DOM.th({
      "data-sort": "minuses"
    }, "-"), React.DOM.th({
      "data-sort": "powerPlayGoals"
    }, "YVM"), React.DOM.th({
      "data-sort": "shortHandedGoals"
    }, "AVM"), React.DOM.th({
      "data-sort": "winningGoals"
    }, "VM"), React.DOM.th({
      "data-sort": "shots"
    }, "L"), React.DOM.th({
      "data-sort": "shootingPercentage",
      "data-type": "float"
    }, "L%"), React.DOM.th({
      "data-sort": "faceoffs"
    }, "A"), React.DOM.th({
      "data-sort": "faceoffPercentage",
      "data-type": "float"
    }, "A%"), React.DOM.th({
      "data-sort": "playingTimeAverage",
      "data-type": "float"
    }, "Aika"))), React.DOM.tbody(null, players), React.DOM.thead(null, React.DOM.tr(null, React.DOM.th({
      "colSpan": 17
    }, "Maalivahdit")), React.DOM.tr(null, React.DOM.th(null, "Nimi"), React.DOM.th(null, "PO"), React.DOM.th(null, "V"), React.DOM.th(null, "T"), React.DOM.th(null, "H"), React.DOM.th(null, "TO"), React.DOM.th(null, "PM"), React.DOM.th(null, "NP"), React.DOM.th(null, "KA"), React.DOM.th(null, "T%"), React.DOM.th(null, "M"), React.DOM.th(null, "S"), React.DOM.th(null, "P"), React.DOM.th(null, "R"), React.DOM.th(null, "V%"), React.DOM.th({
      "colSpan": 2
    }, "Aika"))), React.DOM.tbody(null, goalies)));
  }
});

module.exports = TeamStats;



},{"./mixins/table_sort":"/Users/hoppula/repos/liiga_frontend/views/mixins/table_sort.coffee","lodash":"lodash","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee":[function(require,module,exports){
var React, TeamsList;

React = require('react/addons');

TeamsList = React.createClass({
  render: function() {
    return React.DOM.div({
      "className": "row"
    }, React.DOM.div({
      "className": "teams-view col-xs-12 col-sm-12 col-md-12 col-lg-12"
    }, this.props.teams.map(function(team) {
      return React.DOM.a({
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
    return React.DOM.div({
      "className": "table-responsive"
    }, React.DOM.table({
      "className": "table table-striped"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Nimi"), React.DOM.th(null, "Ottelut"), React.DOM.th(null, "Maalit"), React.DOM.th(null, "Sy\u00f6t\u00f6t"), React.DOM.th(null, "Pisteet"))), this.props.stats.scoringStats.filter(function(player, index) {
      return index < 20;
    }).map(function(player) {
      return React.DOM.tr({
        "key": player.id
      }, React.DOM.td(null, React.DOM.a({
        "href": "/joukkueet/" + player.teamId + "/" + player.id
      }, player.firstName, " ", player.lastName)), React.DOM.td(null, player.games), React.DOM.td(null, player.goals), React.DOM.td(null, player.assists), React.DOM.td(null, player.points));
    })));
  }
});

module.exports = TopScorers;



},{"react/addons":"react/addons"}]},{},["/Users/hoppula/repos/liiga_frontend/client.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9jbGllbnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY29uZmlnL2FwaS1icm93c2VyLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2xpYi90ZWFtcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9ub2RlX21vZHVsZXMvZmFzdGNsaWNrL2xpYi9mYXN0Y2xpY2suanMiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9vcHRpb25zLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3JvdXRlcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzL2dhbWVfZXZlbnRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX2xpbmV1cHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzL2dhbWVfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzL3NjaGVkdWxlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zdGFuZGluZ3MuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzL3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy90ZWFtLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy90ZWFtcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9tYXRjaC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9taXhpbnMvdGFibGVfc29ydC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9uYXZpZ2F0aW9uLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3BsYXllci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXJfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc2NoZWR1bGUuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW0uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9yb3N0ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1zX2xpc3QuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdG9wX3Njb3JlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSx3REFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FBUixDQUFBOztBQUFBLFVBQ0EsR0FBYSxPQUFBLENBQVEsWUFBUixDQURiLENBQUE7O0FBQUEsU0FFQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRlosQ0FBQTs7QUFBQSxPQUdBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLFlBS0EsR0FBZSxRQUFRLENBQUMsY0FBVCxDQUF3QixPQUFPLENBQUMsS0FBaEMsQ0FMZixDQUFBOztBQUFBLE9BT08sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsT0FBRCxHQUFBOztJQUFDLFVBQVE7R0FDeEI7QUFBQSxFQUFBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixPQUE5QixDQUF1QyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQTFDLEdBQXVELGFBQUEsR0FBYSxPQUFPLENBQUMsS0FBNUUsQ0FBQTtTQUNBLEtBQUssQ0FBQyxlQUFOLENBQXNCLE9BQU8sQ0FBQyxTQUE5QixFQUF5QyxZQUF6QyxFQUZlO0FBQUEsQ0FQakIsQ0FBQTs7QUFBQSxPQVdPLENBQUMsVUFBUixHQUFxQixTQUFDLE1BQUQsR0FBQTtTQUNuQixTQUFTLENBQUMsTUFBVixDQUFpQixRQUFRLENBQUMsSUFBMUIsRUFEbUI7QUFBQSxDQVhyQixDQUFBOztBQUFBLEdBZUEsR0FBTSxVQUFVLENBQUMsTUFBWCxDQUFrQixPQUFsQixDQWZOLENBQUE7Ozs7O0FDQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsR0FBQSxFQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQXpCLENBQWlDLE1BQWpDLEVBQXdDLE1BQXhDLENBQUw7Q0FERixDQUFBOzs7OztBQ0FBLElBQUEsS0FBQTs7QUFBQSxLQUFBLEdBQ0U7QUFBQSxFQUFBLFdBQUEsRUFDRTtBQUFBLElBQUEsT0FBQSxFQUFTLE9BQVQ7QUFBQSxJQUNBLE9BQUEsRUFBUyxPQURUO0FBQUEsSUFFQSxNQUFBLEVBQVEsTUFGUjtBQUFBLElBR0EsS0FBQSxFQUFPLEtBSFA7QUFBQSxJQUlBLE9BQUEsRUFBUyxPQUpUO0FBQUEsSUFLQSxPQUFBLEVBQVMsT0FMVDtBQUFBLElBTUEsS0FBQSxFQUFPLEtBTlA7QUFBQSxJQU9BLE9BQUEsRUFBUyxPQVBUO0FBQUEsSUFRQSxRQUFBLEVBQVUsUUFSVjtBQUFBLElBU0EsT0FBQSxFQUFTLE9BVFQ7QUFBQSxJQVVBLFVBQUEsRUFBWSxVQVZaO0FBQUEsSUFXQSxPQUFBLEVBQVMsT0FYVDtBQUFBLElBWUEsU0FBQSxFQUFXLFNBWlg7QUFBQSxJQWFBLEtBQUEsRUFBTyxLQWJQO0dBREY7QUFBQSxFQWdCQSxJQUFBLEVBQU0sU0FBQyxJQUFELEdBQUE7V0FDSCxPQUFBLEdBQU8sSUFBQyxDQUFBLFdBQVksQ0FBQSxJQUFBLENBQXBCLEdBQTBCLE9BRHZCO0VBQUEsQ0FoQk47QUFBQSxFQW1CQSxRQUFBLEVBQVUsU0FBQyxFQUFELEdBQUE7QUFDUixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQUMsQ0FBQSxXQUFiLENBQXlCLENBQUMsTUFBMUIsQ0FBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsR0FBRCxFQUFNLElBQU4sR0FBQTtBQUNyQyxRQUFBLEdBQUksQ0FBQSxLQUFDLENBQUEsV0FBWSxDQUFBLElBQUEsQ0FBYixDQUFKLEdBQTBCLElBQTFCLENBQUE7ZUFDQSxJQUZxQztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDLEVBR0osRUFISSxDQUFOLENBQUE7V0FJQSxHQUFJLENBQUEsRUFBQSxFQUxJO0VBQUEsQ0FuQlY7QUFBQSxFQTBCQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7V0FDUixJQUFDLENBQUEsV0FBWSxDQUFBLElBQUEsRUFETDtFQUFBLENBMUJWO0NBREYsQ0FBQTs7QUFBQSxNQThCTSxDQUFDLE9BQVAsR0FBaUIsS0E5QmpCLENBQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3J6QkEsSUFBQSxjQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsTUFDQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRFQsQ0FBQTs7QUFBQSxNQUdNLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxXQUFBLEVBQWEsU0FBQSxHQUFVLFNBQXZCO0FBQUEsRUFDQSxPQUFBLEVBQVMseUJBRFQ7QUFBQSxFQUVBLEtBQUEsRUFBTyxLQUZQO0FBQUEsRUFHQSxNQUFBLEVBQVEsTUFIUjtBQUFBLEVBSUEs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QUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixHQUFuQixDQUpGLEVBS0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixHQUFuQixDQUxGLEVBTUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixRQUFuQixDQU5GLEVBT0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixHQUFuQixDQVBGLEVBUUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixHQUFuQixDQVJGLEVBU0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixLQUFuQixDQVRGLEVBVUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixLQUFuQixDQVZGLEVBV0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixJQUFuQixDQVhGLEVBWUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixHQUFuQixDQVpGLEVBYUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixJQUFuQixDQWJGLEVBY0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixHQUFuQixDQWRGLEVBZUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFtQixJQUFuQixDQWZGLEVBZ0JFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVixDQUFhLElBQWIsRUFBbUIsTUFBbkIsQ0FoQkYsQ0FERixDQURGLEVBcUJFLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBVixDQUFnQixJQUFoQixFQUNFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVixDQUFhLElBQWIsRUFDRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW9CLEtBQUssQ0FBQyxLQUExQixDQURGLEVBRUUsS0FB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LElBQWIsRUFDRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLE1BQW5CLENBREYsRUFFRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBRkYsRUFHRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBSEYsRUFJRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBSkYsRUFLRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBTEYsRUFNRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBTkYsRUFPRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBUEYsRUFRRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBUkYsRUFTRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBVEYsRUFVRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBVkYsRUFXRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBWEYsRUFZRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBWkYsRUFhRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBYkYsRUFjRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBZEYsRUFlRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBZkYsRUFnQkUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWE7QUFB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QUFtRSxNQUFNLENBQUMsU0FBMUUsRUFBc0YsR0FBdEYsRUFBNEYsTUFBTSxDQUFDLFFBQW5HLENBQW5CLENBREYsRUFFRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW9CLE1BQU0sQ0FBQyxLQUEzQixDQUZGLEVBR0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsSUFBYixFQUFvQixNQUFNLENBQUMsS0FBM0IsQ0FIRixFQUlFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVixDQUFhLElBQWIsRUFBb0IsTUFBTSxDQUFDLE9BQTNCLENBSkYsRUFLRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW9CLE1BQU0sQ0FBQyxNQUEzQixDQUxGLEVBREc7SUFBQSxDQUZKLENBVkgsQ0FERixFQURNO0VBQUEsQ0FBUjtDQUZXLENBRmIsQ0FBQTs7QUFBQSxNQThCTSxDQUFDLE9BQVAsR0FBaUIsVUE5QmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5jZXJlYmVsbHVtID0gcmVxdWlyZSAnY2VyZWJlbGx1bSdcbkZhc3RDbGljayA9IHJlcXVpcmUgJ2Zhc3RjbGljaydcbm9wdGlvbnMgPSByZXF1aXJlICcuL29wdGlvbnMnXG5cbmFwcENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuYXBwSWQpXG5cbm9wdGlvbnMucmVuZGVyID0gKG9wdGlvbnM9e30pIC0+XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gXCJMaWlnYS5wdyAtICN7b3B0aW9ucy50aXRsZX1cIlxuICBSZWFjdC5yZW5kZXJDb21wb25lbnQob3B0aW9ucy5jb21wb25lbnQsIGFwcENvbnRhaW5lcilcblxub3B0aW9ucy5pbml0aWFsaXplID0gKGNsaWVudCkgLT5cbiAgRmFzdENsaWNrLmF0dGFjaChkb2N1bWVudC5ib2R5KVxuICAjUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpXG5cbmFwcCA9IGNlcmViZWxsdW0uY2xpZW50KG9wdGlvbnMpIiwibW9kdWxlLmV4cG9ydHMgPVxuICB1cmw6IGRvY3VtZW50LmxvY2F0aW9uLm9yaWdpbi5yZXBsYWNlKFwiNDAwMFwiLFwiODA4MFwiKVxuICAjdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiIiwiVGVhbXMgPVxuICBuYW1lc0FuZElkczpcbiAgICBcIsOEc3PDpHRcIjogXCJhc3NhdFwiXG4gICAgXCJCbHVlc1wiOiBcImJsdWVzXCJcbiAgICBcIkhJRktcIjogXCJoaWZrXCJcbiAgICBcIkhQS1wiOiBcImhwa1wiXG4gICAgXCJJbHZlc1wiOiBcImlsdmVzXCJcbiAgICBcIlNwb3J0XCI6IFwic3BvcnRcIlxuICAgIFwiSllQXCI6IFwianlwXCJcbiAgICBcIkthbFBhXCI6IFwia2FscGFcIlxuICAgIFwiS8OkcnDDpHRcIjogXCJrYXJwYXRcIlxuICAgIFwiTHVra29cIjogXCJsdWtrb1wiXG4gICAgXCJQZWxpY2Fuc1wiOiBcInBlbGljYW5zXCJcbiAgICBcIlNhaVBhXCI6IFwic2FpcGFcIlxuICAgIFwiVGFwcGFyYVwiOiBcInRhcHBhcmFcIlxuICAgIFwiVFBTXCI6IFwidHBzXCJcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBcIi9zdmcvI3tAbmFtZXNBbmRJZHNbbmFtZV19LnN2Z1wiXG5cbiAgaWRUb05hbWU6IChpZCkgLT5cbiAgICBpZHMgPSBPYmplY3Qua2V5cyhAbmFtZXNBbmRJZHMpLnJlZHVjZSAob2JqLCBuYW1lKSA9PlxuICAgICAgb2JqW0BuYW1lc0FuZElkc1tuYW1lXV0gPSBuYW1lXG4gICAgICBvYmpcbiAgICAsIHt9XG4gICAgaWRzW2lkXVxuXG4gIG5hbWVUb0lkOiAobmFtZSkgLT5cbiAgICBAbmFtZXNBbmRJZHNbbmFtZV1cblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIi8qKlxuICogQHByZXNlcnZlIEZhc3RDbGljazogcG9seWZpbGwgdG8gcmVtb3ZlIGNsaWNrIGRlbGF5cyBvbiBicm93c2VycyB3aXRoIHRvdWNoIFVJcy5cbiAqXG4gKiBAdmVyc2lvbiAxLjAuM1xuICogQGNvZGluZ3N0YW5kYXJkIGZ0bGFicy1qc3YyXG4gKiBAY29weXJpZ2h0IFRoZSBGaW5hbmNpYWwgVGltZXMgTGltaXRlZCBbQWxsIFJpZ2h0cyBSZXNlcnZlZF1cbiAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlIChzZWUgTElDRU5TRS50eHQpXG4gKi9cblxuLypqc2xpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuLypnbG9iYWwgZGVmaW5lLCBFdmVudCwgTm9kZSovXG5cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBmYXN0LWNsaWNraW5nIGxpc3RlbmVycyBvbiB0aGUgc3BlY2lmaWVkIGxheWVyLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuZnVuY3Rpb24gRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG9sZE9uQ2xpY2s7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgYSBjbGljayBpcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlZC5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cblxuXHQvKipcblx0ICogVGltZXN0YW1wIGZvciB3aGVuIGNsaWNrIHRyYWNraW5nIHN0YXJ0ZWQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSAwO1xuXG5cblx0LyoqXG5cdCAqIFRoZSBlbGVtZW50IGJlaW5nIHRyYWNrZWQgZm9yIGEgY2xpY2suXG5cdCAqXG5cdCAqIEB0eXBlIEV2ZW50VGFyZ2V0XG5cdCAqL1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXG5cblx0LyoqXG5cdCAqIFgtY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRvdWNoU3RhcnRYID0gMDtcblxuXG5cdC8qKlxuXHQgKiBZLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50b3VjaFN0YXJ0WSA9IDA7XG5cblxuXHQvKipcblx0ICogSUQgb2YgdGhlIGxhc3QgdG91Y2gsIHJldHJpZXZlZCBmcm9tIFRvdWNoLmlkZW50aWZpZXIuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyID0gMDtcblxuXG5cdC8qKlxuXHQgKiBUb3VjaG1vdmUgYm91bmRhcnksIGJleW9uZCB3aGljaCBhIGNsaWNrIHdpbGwgYmUgY2FuY2VsbGVkLlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudG91Y2hCb3VuZGFyeSA9IG9wdGlvbnMudG91Y2hCb3VuZGFyeSB8fCAxMDtcblxuXG5cdC8qKlxuXHQgKiBUaGUgRmFzdENsaWNrIGxheWVyLlxuXHQgKlxuXHQgKiBAdHlwZSBFbGVtZW50XG5cdCAqL1xuXHR0aGlzLmxheWVyID0gbGF5ZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiB0YXAodG91Y2hzdGFydCBhbmQgdG91Y2hlbmQpIGV2ZW50c1xuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudGFwRGVsYXkgPSBvcHRpb25zLnRhcERlbGF5IHx8IDIwMDtcblxuXHRpZiAoRmFzdENsaWNrLm5vdE5lZWRlZChsYXllcikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBBbmRyb2lkIGRvbid0IGhhdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcblx0ZnVuY3Rpb24gYmluZChtZXRob2QsIGNvbnRleHQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBtZXRob2QuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTsgfTtcblx0fVxuXG5cblx0dmFyIG1ldGhvZHMgPSBbJ29uTW91c2UnLCAnb25DbGljaycsICdvblRvdWNoU3RhcnQnLCAnb25Ub3VjaE1vdmUnLCAnb25Ub3VjaEVuZCcsICdvblRvdWNoQ2FuY2VsJ107XG5cdHZhciBjb250ZXh0ID0gdGhpcztcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGNvbnRleHRbbWV0aG9kc1tpXV0gPSBiaW5kKGNvbnRleHRbbWV0aG9kc1tpXV0sIGNvbnRleHQpO1xuXHR9XG5cblx0Ly8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzIGFzIHJlcXVpcmVkXG5cdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdH1cblxuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XG5cblx0Ly8gSGFjayBpcyByZXF1aXJlZCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IEV2ZW50I3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAoZS5nLiBBbmRyb2lkIDIpXG5cdC8vIHdoaWNoIGlzIGhvdyBGYXN0Q2xpY2sgbm9ybWFsbHkgc3RvcHMgY2xpY2sgZXZlbnRzIGJ1YmJsaW5nIHRvIGNhbGxiYWNrcyByZWdpc3RlcmVkIG9uIHRoZSBGYXN0Q2xpY2tcblx0Ly8gbGF5ZXIgd2hlbiB0aGV5IGFyZSBjYW5jZWxsZWQuXG5cdGlmICghRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0dmFyIHJtdiA9IE5vZGUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xuXHRcdFx0XHRybXYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cm12LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG5cdFx0XHR2YXIgYWR2ID0gTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0XHRcdGlmICh0eXBlID09PSAnY2xpY2snKSB7XG5cdFx0XHRcdGFkdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjay5oaWphY2tlZCB8fCAoY2FsbGJhY2suaGlqYWNrZWQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmICghZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSwgY2FwdHVyZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBJZiBhIGhhbmRsZXIgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGUgZWxlbWVudCdzIG9uY2xpY2sgYXR0cmlidXRlLCBpdCB3aWxsIGJlIGZpcmVkIGJlZm9yZVxuXHQvLyBGYXN0Q2xpY2sncyBvbkNsaWNrIGhhbmRsZXIuIEZpeCB0aGlzIGJ5IHB1bGxpbmcgb3V0IHRoZSB1c2VyLWRlZmluZWQgaGFuZGxlciBmdW5jdGlvbiBhbmRcblx0Ly8gYWRkaW5nIGl0IGFzIGxpc3RlbmVyLlxuXHRpZiAodHlwZW9mIGxheWVyLm9uY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdC8vIEFuZHJvaWQgYnJvd3NlciBvbiBhdCBsZWFzdCAzLjIgcmVxdWlyZXMgYSBuZXcgcmVmZXJlbmNlIHRvIHRoZSBmdW5jdGlvbiBpbiBsYXllci5vbmNsaWNrXG5cdFx0Ly8gLSB0aGUgb2xkIG9uZSB3b24ndCB3b3JrIGlmIHBhc3NlZCB0byBhZGRFdmVudExpc3RlbmVyIGRpcmVjdGx5LlxuXHRcdG9sZE9uQ2xpY2sgPSBsYXllci5vbmNsaWNrO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdG9sZE9uQ2xpY2soZXZlbnQpO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRsYXllci5vbmNsaWNrID0gbnVsbDtcblx0fVxufVxuXG5cbi8qKlxuICogQW5kcm9pZCByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQW5kcm9pZCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQW5kcm9pZCcpID4gMDtcblxuXG4vKipcbiAqIGlPUyByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzSU9TID0gL2lQKGFkfGhvbmV8b2QpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDQgcmVxdWlyZXMgYW4gZXhjZXB0aW9uIGZvciBzZWxlY3QgZWxlbWVudHMuXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNJT1M0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyA0X1xcZChfXFxkKT8vKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDYuMCgrPykgcmVxdWlyZXMgdGhlIHRhcmdldCBlbGVtZW50IHRvIGJlIG1hbnVhbGx5IGRlcml2ZWRcbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQgPSBkZXZpY2VJc0lPUyAmJiAoL09TIChbNi05XXxcXGR7Mn0pX1xcZC8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbi8qKlxuICogQmxhY2tCZXJyeSByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQmxhY2tCZXJyeTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdCQjEwJykgPiAwO1xuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIG5hdGl2ZSBjbGljay5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgbmVlZHMgYSBuYXRpdmUgY2xpY2tcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0NsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgdG8gZGlzYWJsZWQgaW5wdXRzIChpc3N1ZSAjNjIpXG5cdGNhc2UgJ2J1dHRvbic6XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdGNhc2UgJ3RleHRhcmVhJzpcblx0XHRpZiAodGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnaW5wdXQnOlxuXG5cdFx0Ly8gRmlsZSBpbnB1dHMgbmVlZCByZWFsIGNsaWNrcyBvbiBpT1MgNiBkdWUgdG8gYSBicm93c2VyIGJ1ZyAoaXNzdWUgIzY4KVxuXHRcdGlmICgoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0LnR5cGUgPT09ICdmaWxlJykgfHwgdGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnbGFiZWwnOlxuXHRjYXNlICd2aWRlbyc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gKC9cXGJuZWVkc2NsaWNrXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBhIGdpdmVuIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIGNsaWNrIGludG8gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIG5hdGl2ZSBjbGljay5cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0ZvY3VzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXHRjYXNlICd0ZXh0YXJlYSc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdFx0cmV0dXJuICFkZXZpY2VJc0FuZHJvaWQ7XG5cdGNhc2UgJ2lucHV0Jzpcblx0XHRzd2l0Y2ggKHRhcmdldC50eXBlKSB7XG5cdFx0Y2FzZSAnYnV0dG9uJzpcblx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0Y2FzZSAnZmlsZSc6XG5cdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdGNhc2UgJ3JhZGlvJzpcblx0XHRjYXNlICdzdWJtaXQnOlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdG8gZm9jdXMgZGlzYWJsZWQgaW5wdXRzXG5cdFx0cmV0dXJuICF0YXJnZXQuZGlzYWJsZWQgJiYgIXRhcmdldC5yZWFkT25seTtcblx0ZGVmYXVsdDpcblx0XHRyZXR1cm4gKC9cXGJuZWVkc2ZvY3VzXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcblx0fVxufTtcblxuXG4vKipcbiAqIFNlbmQgYSBjbGljayBldmVudCB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLnNlbmRDbGljayA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQsIGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGNsaWNrRXZlbnQsIHRvdWNoO1xuXG5cdC8vIE9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzIGFjdGl2ZUVsZW1lbnQgbmVlZHMgdG8gYmUgYmx1cnJlZCBvdGhlcndpc2UgdGhlIHN5bnRoZXRpYyBjbGljayB3aWxsIGhhdmUgbm8gZWZmZWN0ICgjMjQpXG5cdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRhcmdldEVsZW1lbnQpIHtcblx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0fVxuXG5cdHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cblx0Ly8gU3ludGhlc2lzZSBhIGNsaWNrIGV2ZW50LCB3aXRoIGFuIGV4dHJhIGF0dHJpYnV0ZSBzbyBpdCBjYW4gYmUgdHJhY2tlZFxuXHRjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnRzJyk7XG5cdGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQodGhpcy5kZXRlcm1pbmVFdmVudFR5cGUodGFyZ2V0RWxlbWVudCksIHRydWUsIHRydWUsIHdpbmRvdywgMSwgdG91Y2guc2NyZWVuWCwgdG91Y2guc2NyZWVuWSwgdG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXHRjbGlja0V2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQgPSB0cnVlO1xuXHR0YXJnZXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG59O1xuXG5GYXN0Q2xpY2sucHJvdG90eXBlLmRldGVybWluZUV2ZW50VHlwZSA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vSXNzdWUgIzE1OTogQW5kcm9pZCBDaHJvbWUgU2VsZWN0IEJveCBkb2VzIG5vdCBvcGVuIHdpdGggYSBzeW50aGV0aWMgY2xpY2sgZXZlbnRcblx0aWYgKGRldmljZUlzQW5kcm9pZCAmJiB0YXJnZXRFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcblx0XHRyZXR1cm4gJ21vdXNlZG93bic7XG5cdH1cblxuXHRyZXR1cm4gJ2NsaWNrJztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgbGVuZ3RoO1xuXG5cdC8vIElzc3VlICMxNjA6IG9uIGlPUyA3LCBzb21lIGlucHV0IGVsZW1lbnRzIChlLmcuIGRhdGUgZGF0ZXRpbWUpIHRocm93IGEgdmFndWUgVHlwZUVycm9yIG9uIHNldFNlbGVjdGlvblJhbmdlLiBUaGVzZSBlbGVtZW50cyBkb24ndCBoYXZlIGFuIGludGVnZXIgdmFsdWUgZm9yIHRoZSBzZWxlY3Rpb25TdGFydCBhbmQgc2VsZWN0aW9uRW5kIHByb3BlcnRpZXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IHRoYXQgY2FuJ3QgYmUgdXNlZCBmb3IgZGV0ZWN0aW9uIGJlY2F1c2UgYWNjZXNzaW5nIHRoZSBwcm9wZXJ0aWVzIGFsc28gdGhyb3dzIGEgVHlwZUVycm9yLiBKdXN0IGNoZWNrIHRoZSB0eXBlIGluc3RlYWQuIEZpbGVkIGFzIEFwcGxlIGJ1ZyAjMTUxMjI3MjQuXG5cdGlmIChkZXZpY2VJc0lPUyAmJiB0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlICYmIHRhcmdldEVsZW1lbnQudHlwZS5pbmRleE9mKCdkYXRlJykgIT09IDAgJiYgdGFyZ2V0RWxlbWVudC50eXBlICE9PSAndGltZScpIHtcblx0XHRsZW5ndGggPSB0YXJnZXRFbGVtZW50LnZhbHVlLmxlbmd0aDtcblx0XHR0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGxlbmd0aCwgbGVuZ3RoKTtcblx0fSBlbHNlIHtcblx0XHR0YXJnZXRFbGVtZW50LmZvY3VzKCk7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciBhbmQgaWYgc28sIHNldCBhIGZsYWcgb24gaXQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudXBkYXRlU2Nyb2xsUGFyZW50ID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBzY3JvbGxQYXJlbnQsIHBhcmVudEVsZW1lbnQ7XG5cblx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cblx0Ly8gQXR0ZW1wdCB0byBkaXNjb3ZlciB3aGV0aGVyIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgc2Nyb2xsYWJsZSBsYXllci4gUmUtY2hlY2sgaWYgdGhlXG5cdC8vIHRhcmdldCBlbGVtZW50IHdhcyBtb3ZlZCB0byBhbm90aGVyIHBhcmVudC5cblx0aWYgKCFzY3JvbGxQYXJlbnQgfHwgIXNjcm9sbFBhcmVudC5jb250YWlucyh0YXJnZXRFbGVtZW50KSkge1xuXHRcdHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXHRcdGRvIHtcblx0XHRcdGlmIChwYXJlbnRFbGVtZW50LnNjcm9sbEhlaWdodCA+IHBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHRcdHNjcm9sbFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gcGFyZW50RWxlbWVudDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fSB3aGlsZSAocGFyZW50RWxlbWVudCk7XG5cdH1cblxuXHQvLyBBbHdheXMgdXBkYXRlIHRoZSBzY3JvbGwgdG9wIHRyYWNrZXIgaWYgcG9zc2libGUuXG5cdGlmIChzY3JvbGxQYXJlbnQpIHtcblx0XHRzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3A7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxFdmVudFRhcmdldH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0ID0gZnVuY3Rpb24oZXZlbnRUYXJnZXQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIE9uIHNvbWUgb2xkZXIgYnJvd3NlcnMgKG5vdGFibHkgU2FmYXJpIG9uIGlPUyA0LjEgLSBzZWUgaXNzdWUgIzU2KSB0aGUgZXZlbnQgdGFyZ2V0IG1heSBiZSBhIHRleHQgbm9kZS5cblx0aWYgKGV2ZW50VGFyZ2V0Lm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuXHRcdHJldHVybiBldmVudFRhcmdldC5wYXJlbnROb2RlO1xuXHR9XG5cblx0cmV0dXJuIGV2ZW50VGFyZ2V0O1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIHN0YXJ0LCByZWNvcmQgdGhlIHBvc2l0aW9uIGFuZCBzY3JvbGwgb2Zmc2V0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciB0YXJnZXRFbGVtZW50LCB0b3VjaCwgc2VsZWN0aW9uO1xuXG5cdC8vIElnbm9yZSBtdWx0aXBsZSB0b3VjaGVzLCBvdGhlcndpc2UgcGluY2gtdG8tem9vbSBpcyBwcmV2ZW50ZWQgaWYgYm90aCBmaW5nZXJzIGFyZSBvbiB0aGUgRmFzdENsaWNrIGVsZW1lbnQgKGlzc3VlICMxMTEpLlxuXHRpZiAoZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGggPiAxKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHR0YXJnZXRFbGVtZW50ID0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCk7XG5cdHRvdWNoID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXTtcblxuXHRpZiAoZGV2aWNlSXNJT1MpIHtcblxuXHRcdC8vIE9ubHkgdHJ1c3RlZCBldmVudHMgd2lsbCBkZXNlbGVjdCB0ZXh0IG9uIGlPUyAoaXNzdWUgIzQ5KVxuXHRcdHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcblx0XHRpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgJiYgIXNlbGVjdGlvbi5pc0NvbGxhcHNlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdFx0Ly8gV2VpcmQgdGhpbmdzIGhhcHBlbiBvbiBpT1Mgd2hlbiBhbiBhbGVydCBvciBjb25maXJtIGRpYWxvZyBpcyBvcGVuZWQgZnJvbSBhIGNsaWNrIGV2ZW50IGNhbGxiYWNrIChpc3N1ZSAjMjMpOlxuXHRcdFx0Ly8gd2hlbiB0aGUgdXNlciBuZXh0IHRhcHMgYW55d2hlcmUgZWxzZSBvbiB0aGUgcGFnZSwgbmV3IHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kIGV2ZW50cyBhcmUgZGlzcGF0Y2hlZFxuXHRcdFx0Ly8gd2l0aCB0aGUgc2FtZSBpZGVudGlmaWVyIGFzIHRoZSB0b3VjaCBldmVudCB0aGF0IHByZXZpb3VzbHkgdHJpZ2dlcmVkIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgYWxlcnQuXG5cdFx0XHQvLyBTYWRseSwgdGhlcmUgaXMgYW4gaXNzdWUgb24gaU9TIDQgdGhhdCBjYXVzZXMgc29tZSBub3JtYWwgdG91Y2ggZXZlbnRzIHRvIGhhdmUgdGhlIHNhbWUgaWRlbnRpZmllciBhcyBhblxuXHRcdFx0Ly8gaW1tZWRpYXRlbHkgcHJlY2VlZGluZyB0b3VjaCBldmVudCAoaXNzdWUgIzUyKSwgc28gdGhpcyBmaXggaXMgdW5hdmFpbGFibGUgb24gdGhhdCBwbGF0Zm9ybS5cblx0XHRcdC8vIElzc3VlIDEyMDogdG91Y2guaWRlbnRpZmllciBpcyAwIHdoZW4gQ2hyb21lIGRldiB0b29scyAnRW11bGF0ZSB0b3VjaCBldmVudHMnIGlzIHNldCB3aXRoIGFuIGlPUyBkZXZpY2UgVUEgc3RyaW5nLFxuXHRcdFx0Ly8gd2hpY2ggY2F1c2VzIGFsbCB0b3VjaCBldmVudHMgdG8gYmUgaWdub3JlZC4gQXMgdGhpcyBibG9jayBvbmx5IGFwcGxpZXMgdG8gaU9TLCBhbmQgaU9TIGlkZW50aWZpZXJzIGFyZSBhbHdheXMgbG9uZyxcblx0XHRcdC8vIHJhbmRvbSBpbnRlZ2VycywgaXQncyBzYWZlIHRvIHRvIGNvbnRpbnVlIGlmIHRoZSBpZGVudGlmaWVyIGlzIDAgaGVyZS5cblx0XHRcdGlmICh0b3VjaC5pZGVudGlmaWVyICYmIHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMubGFzdFRvdWNoSWRlbnRpZmllcikge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGFzdFRvdWNoSWRlbnRpZmllciA9IHRvdWNoLmlkZW50aWZpZXI7XG5cblx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciAodXNpbmcgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoKSBhbmQ6XG5cdFx0XHQvLyAxKSB0aGUgdXNlciBkb2VzIGEgZmxpbmcgc2Nyb2xsIG9uIHRoZSBzY3JvbGxhYmxlIGxheWVyXG5cdFx0XHQvLyAyKSB0aGUgdXNlciBzdG9wcyB0aGUgZmxpbmcgc2Nyb2xsIHdpdGggYW5vdGhlciB0YXBcblx0XHRcdC8vIHRoZW4gdGhlIGV2ZW50LnRhcmdldCBvZiB0aGUgbGFzdCAndG91Y2hlbmQnIGV2ZW50IHdpbGwgYmUgdGhlIGVsZW1lbnQgdGhhdCB3YXMgdW5kZXIgdGhlIHVzZXIncyBmaW5nZXJcblx0XHRcdC8vIHdoZW4gdGhlIGZsaW5nIHNjcm9sbCB3YXMgc3RhcnRlZCwgY2F1c2luZyBGYXN0Q2xpY2sgdG8gc2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoYXQgbGF5ZXIgLSB1bmxlc3MgYSBjaGVja1xuXHRcdFx0Ly8gaXMgbWFkZSB0byBlbnN1cmUgdGhhdCBhIHBhcmVudCBsYXllciB3YXMgbm90IHNjcm9sbGVkIGJlZm9yZSBzZW5kaW5nIGEgc3ludGhldGljIGNsaWNrIChpc3N1ZSAjNDIpLlxuXHRcdFx0dGhpcy51cGRhdGVTY3JvbGxQYXJlbnQodGFyZ2V0RWxlbWVudCk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy50cmFja2luZ0NsaWNrID0gdHJ1ZTtcblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSBldmVudC50aW1lU3RhbXA7XG5cdHRoaXMudGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XG5cblx0dGhpcy50b3VjaFN0YXJ0WCA9IHRvdWNoLnBhZ2VYO1xuXHR0aGlzLnRvdWNoU3RhcnRZID0gdG91Y2gucGFnZVk7XG5cblx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBCYXNlZCBvbiBhIHRvdWNobW92ZSBldmVudCBvYmplY3QsIGNoZWNrIHdoZXRoZXIgdGhlIHRvdWNoIGhhcyBtb3ZlZCBwYXN0IGEgYm91bmRhcnkgc2luY2UgaXQgc3RhcnRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudG91Y2hIYXNNb3ZlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sIGJvdW5kYXJ5ID0gdGhpcy50b3VjaEJvdW5kYXJ5O1xuXG5cdGlmIChNYXRoLmFicyh0b3VjaC5wYWdlWCAtIHRoaXMudG91Y2hTdGFydFgpID4gYm91bmRhcnkgfHwgTWF0aC5hYnModG91Y2gucGFnZVkgLSB0aGlzLnRvdWNoU3RhcnRZKSA+IGJvdW5kYXJ5KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qKlxuICogVXBkYXRlIHRoZSBsYXN0IHBvc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCF0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIElmIHRoZSB0b3VjaCBoYXMgbW92ZWQsIGNhbmNlbCB0aGUgY2xpY2sgdHJhY2tpbmdcblx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudCAhPT0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCkgfHwgdGhpcy50b3VjaEhhc01vdmVkKGV2ZW50KSkge1xuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGZpbmQgdGhlIGxhYmVsbGVkIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBsYWJlbCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8SFRNTExhYmVsRWxlbWVudH0gbGFiZWxFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLmZpbmRDb250cm9sID0gZnVuY3Rpb24obGFiZWxFbGVtZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBGYXN0IHBhdGggZm9yIG5ld2VyIGJyb3dzZXJzIHN1cHBvcnRpbmcgdGhlIEhUTUw1IGNvbnRyb2wgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuY29udHJvbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGxhYmVsRWxlbWVudC5jb250cm9sO1xuXHR9XG5cblx0Ly8gQWxsIGJyb3dzZXJzIHVuZGVyIHRlc3QgdGhhdCBzdXBwb3J0IHRvdWNoIGV2ZW50cyBhbHNvIHN1cHBvcnQgdGhlIEhUTUw1IGh0bWxGb3IgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuaHRtbEZvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYWJlbEVsZW1lbnQuaHRtbEZvcik7XG5cdH1cblxuXHQvLyBJZiBubyBmb3IgYXR0cmlidXRlIGV4aXN0cywgYXR0ZW1wdCB0byByZXRyaWV2ZSB0aGUgZmlyc3QgbGFiZWxsYWJsZSBkZXNjZW5kYW50IGVsZW1lbnRcblx0Ly8gdGhlIGxpc3Qgb2Ygd2hpY2ggaXMgZGVmaW5lZCBoZXJlOiBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxhYmVsXG5cdHJldHVybiBsYWJlbEVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSksIGtleWdlbiwgbWV0ZXIsIG91dHB1dCwgcHJvZ3Jlc3MsIHNlbGVjdCwgdGV4dGFyZWEnKTtcbn07XG5cblxuLyoqXG4gKiBPbiB0b3VjaCBlbmQsIGRldGVybWluZSB3aGV0aGVyIHRvIHNlbmQgYSBjbGljayBldmVudCBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZm9yRWxlbWVudCwgdHJhY2tpbmdDbGlja1N0YXJ0LCB0YXJnZXRUYWdOYW1lLCBzY3JvbGxQYXJlbnQsIHRvdWNoLCB0YXJnZXRFbGVtZW50ID0gdGhpcy50YXJnZXRFbGVtZW50O1xuXG5cdGlmICghdGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBQcmV2ZW50IHBoYW50b20gY2xpY2tzIG9uIGZhc3QgZG91YmxlLXRhcCAoaXNzdWUgIzM2KVxuXHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XG5cdFx0dGhpcy5jYW5jZWxOZXh0Q2xpY2sgPSB0cnVlO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gUmVzZXQgdG8gcHJldmVudCB3cm9uZyBjbGljayBjYW5jZWwgb24gaW5wdXQgKGlzc3VlICMxNTYpLlxuXHR0aGlzLmNhbmNlbE5leHRDbGljayA9IGZhbHNlO1xuXG5cdHRoaXMubGFzdENsaWNrVGltZSA9IGV2ZW50LnRpbWVTdGFtcDtcblxuXHR0cmFja2luZ0NsaWNrU3RhcnQgPSB0aGlzLnRyYWNraW5nQ2xpY2tTdGFydDtcblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcblxuXHQvLyBPbiBzb21lIGlPUyBkZXZpY2VzLCB0aGUgdGFyZ2V0RWxlbWVudCBzdXBwbGllZCB3aXRoIHRoZSBldmVudCBpcyBpbnZhbGlkIGlmIHRoZSBsYXllclxuXHQvLyBpcyBwZXJmb3JtaW5nIGEgdHJhbnNpdGlvbiBvciBzY3JvbGwsIGFuZCBoYXMgdG8gYmUgcmUtZGV0ZWN0ZWQgbWFudWFsbHkuIE5vdGUgdGhhdFxuXHQvLyBmb3IgdGhpcyB0byBmdW5jdGlvbiBjb3JyZWN0bHksIGl0IG11c3QgYmUgY2FsbGVkICphZnRlciogdGhlIGV2ZW50IHRhcmdldCBpcyBjaGVja2VkIVxuXHQvLyBTZWUgaXNzdWUgIzU3OyBhbHNvIGZpbGVkIGFzIHJkYXI6Ly8xMzA0ODU4OSAuXG5cdGlmIChkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQpIHtcblx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0Ly8gSW4gY2VydGFpbiBjYXNlcyBhcmd1bWVudHMgb2YgZWxlbWVudEZyb21Qb2ludCBjYW4gYmUgbmVnYXRpdmUsIHNvIHByZXZlbnQgc2V0dGluZyB0YXJnZXRFbGVtZW50IHRvIG51bGxcblx0XHR0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaC5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgdG91Y2gucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpIHx8IHRhcmdldEVsZW1lbnQ7XG5cdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHR9XG5cblx0dGFyZ2V0VGFnTmFtZSA9IHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRpZiAodGFyZ2V0VGFnTmFtZSA9PT0gJ2xhYmVsJykge1xuXHRcdGZvckVsZW1lbnQgPSB0aGlzLmZpbmRDb250cm9sKHRhcmdldEVsZW1lbnQpO1xuXHRcdGlmIChmb3JFbGVtZW50KSB7XG5cdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xuXHRcdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRhcmdldEVsZW1lbnQgPSBmb3JFbGVtZW50O1xuXHRcdH1cblx0fSBlbHNlIGlmICh0aGlzLm5lZWRzRm9jdXModGFyZ2V0RWxlbWVudCkpIHtcblxuXHRcdC8vIENhc2UgMTogSWYgdGhlIHRvdWNoIHN0YXJ0ZWQgYSB3aGlsZSBhZ28gKGJlc3QgZ3Vlc3MgaXMgMTAwbXMgYmFzZWQgb24gdGVzdHMgZm9yIGlzc3VlICMzNikgdGhlbiBmb2N1cyB3aWxsIGJlIHRyaWdnZXJlZCBhbnl3YXkuIFJldHVybiBlYXJseSBhbmQgdW5zZXQgdGhlIHRhcmdldCBlbGVtZW50IHJlZmVyZW5jZSBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IGNsaWNrIHdpbGwgYmUgYWxsb3dlZCB0aHJvdWdoLlxuXHRcdC8vIENhc2UgMjogV2l0aG91dCB0aGlzIGV4Y2VwdGlvbiBmb3IgaW5wdXQgZWxlbWVudHMgdGFwcGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIGNvbnRhaW5lZCBpbiBhbiBpZnJhbWUsIHRoZW4gYW55IGlucHV0dGVkIHRleHQgd29uJ3QgYmUgdmlzaWJsZSBldmVuIHRob3VnaCB0aGUgdmFsdWUgYXR0cmlidXRlIGlzIHVwZGF0ZWQgYXMgdGhlIHVzZXIgdHlwZXMgKGlzc3VlICMzNykuXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0cmFja2luZ0NsaWNrU3RhcnQpID4gMTAwIHx8IChkZXZpY2VJc0lPUyAmJiB3aW5kb3cudG9wICE9PSB3aW5kb3cgJiYgdGFyZ2V0VGFnTmFtZSA9PT0gJ2lucHV0JykpIHtcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcblx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XG5cblx0XHQvLyBTZWxlY3QgZWxlbWVudHMgbmVlZCB0aGUgZXZlbnQgdG8gZ28gdGhyb3VnaCBvbiBpT1MgNCwgb3RoZXJ3aXNlIHRoZSBzZWxlY3RvciBtZW51IHdvbid0IG9wZW4uXG5cdFx0Ly8gQWxzbyB0aGlzIGJyZWFrcyBvcGVuaW5nIHNlbGVjdHMgd2hlbiBWb2ljZU92ZXIgaXMgYWN0aXZlIG9uIGlPUzYsIGlPUzcgKGFuZCBwb3NzaWJseSBvdGhlcnMpXG5cdFx0aWYgKCFkZXZpY2VJc0lPUyB8fCB0YXJnZXRUYWdOYW1lICE9PSAnc2VsZWN0Jykge1xuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKGRldmljZUlzSU9TICYmICFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgaWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgbGF5ZXIgdGhhdCB3YXMgc2Nyb2xsZWRcblx0XHQvLyBhbmQgdGhpcyB0YXAgaXMgYmVpbmcgdXNlZCB0byBzdG9wIHRoZSBzY3JvbGxpbmcgKHVzdWFsbHkgaW5pdGlhdGVkIGJ5IGEgZmxpbmcgLSBpc3N1ZSAjNDIpLlxuXHRcdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHRcdGlmIChzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50LmZhc3RDbGlja0xhc3RTY3JvbGxUb3AgIT09IHNjcm9sbFBhcmVudC5zY3JvbGxUb3ApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdC8vIFByZXZlbnQgdGhlIGFjdHVhbCBjbGljayBmcm9tIGdvaW5nIHRob3VnaCAtIHVubGVzcyB0aGUgdGFyZ2V0IG5vZGUgaXMgbWFya2VkIGFzIHJlcXVpcmluZ1xuXHQvLyByZWFsIGNsaWNrcyBvciBpZiBpdCBpcyBpbiB0aGUgd2hpdGVsaXN0IGluIHdoaWNoIGNhc2Ugb25seSBub24tcHJvZ3JhbW1hdGljIGNsaWNrcyBhcmUgcGVybWl0dGVkLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0YXJnZXRFbGVtZW50KSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5zZW5kQ2xpY2sodGFyZ2V0RWxlbWVudCwgZXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIGNhbmNlbCwgc3RvcCB0cmFja2luZyB0aGUgY2xpY2suXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xufTtcblxuXG4vKipcbiAqIERldGVybWluZSBtb3VzZSBldmVudHMgd2hpY2ggc2hvdWxkIGJlIHBlcm1pdHRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Nb3VzZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBJZiBhIHRhcmdldCBlbGVtZW50IHdhcyBuZXZlciBzZXQgKGJlY2F1c2UgYSB0b3VjaCBldmVudCB3YXMgbmV2ZXIgZmlyZWQpIGFsbG93IHRoZSBldmVudFxuXHRpZiAoIXRoaXMudGFyZ2V0RWxlbWVudCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKGV2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFByb2dyYW1tYXRpY2FsbHkgZ2VuZXJhdGVkIGV2ZW50cyB0YXJnZXRpbmcgYSBzcGVjaWZpYyBlbGVtZW50IHNob3VsZCBiZSBwZXJtaXR0ZWRcblx0aWYgKCFldmVudC5jYW5jZWxhYmxlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBEZXJpdmUgYW5kIGNoZWNrIHRoZSB0YXJnZXQgZWxlbWVudCB0byBzZWUgd2hldGhlciB0aGUgbW91c2UgZXZlbnQgbmVlZHMgdG8gYmUgcGVybWl0dGVkO1xuXHQvLyB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLCBwcmV2ZW50IG5vbi10b3VjaCBjbGljayBldmVudHMgZnJvbSB0cmlnZ2VyaW5nIGFjdGlvbnMsXG5cdC8vIHRvIHByZXZlbnQgZ2hvc3QvZG91YmxlY2xpY2tzLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0aGlzLnRhcmdldEVsZW1lbnQpIHx8IHRoaXMuY2FuY2VsTmV4dENsaWNrKSB7XG5cblx0XHQvLyBQcmV2ZW50IGFueSB1c2VyLWFkZGVkIGxpc3RlbmVycyBkZWNsYXJlZCBvbiBGYXN0Q2xpY2sgZWxlbWVudCBmcm9tIGJlaW5nIGZpcmVkLlxuXHRcdGlmIChldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcblx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFBhcnQgb2YgdGhlIGhhY2sgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxuXHRcdFx0ZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBDYW5jZWwgdGhlIGV2ZW50XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIElmIHRoZSBtb3VzZSBldmVudCBpcyBwZXJtaXR0ZWQsIHJldHVybiB0cnVlIGZvciB0aGUgYWN0aW9uIHRvIGdvIHRocm91Z2guXG5cdHJldHVybiB0cnVlO1xufTtcblxuXG4vKipcbiAqIE9uIGFjdHVhbCBjbGlja3MsIGRldGVybWluZSB3aGV0aGVyIHRoaXMgaXMgYSB0b3VjaC1nZW5lcmF0ZWQgY2xpY2ssIGEgY2xpY2sgYWN0aW9uIG9jY3VycmluZ1xuICogbmF0dXJhbGx5IGFmdGVyIGEgZGVsYXkgYWZ0ZXIgYSB0b3VjaCAod2hpY2ggbmVlZHMgdG8gYmUgY2FuY2VsbGVkIHRvIGF2b2lkIGR1cGxpY2F0aW9uKSwgb3JcbiAqIGFuIGFjdHVhbCBjbGljayB3aGljaCBzaG91bGQgYmUgcGVybWl0dGVkLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgcGVybWl0dGVkO1xuXG5cdC8vIEl0J3MgcG9zc2libGUgZm9yIGFub3RoZXIgRmFzdENsaWNrLWxpa2UgbGlicmFyeSBkZWxpdmVyZWQgd2l0aCB0aGlyZC1wYXJ0eSBjb2RlIHRvIGZpcmUgYSBjbGljayBldmVudCBiZWZvcmUgRmFzdENsaWNrIGRvZXMgKGlzc3VlICM0NCkuIEluIHRoYXQgY2FzZSwgc2V0IHRoZSBjbGljay10cmFja2luZyBmbGFnIGJhY2sgdG8gZmFsc2UgYW5kIHJldHVybiBlYXJseS4gVGhpcyB3aWxsIGNhdXNlIG9uVG91Y2hFbmQgdG8gcmV0dXJuIGVhcmx5LlxuXHRpZiAodGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFZlcnkgb2RkIGJlaGF2aW91ciBvbiBpT1MgKGlzc3VlICMxOCk6IGlmIGEgc3VibWl0IGVsZW1lbnQgaXMgcHJlc2VudCBpbnNpZGUgYSBmb3JtIGFuZCB0aGUgdXNlciBoaXRzIGVudGVyIGluIHRoZSBpT1Mgc2ltdWxhdG9yIG9yIGNsaWNrcyB0aGUgR28gYnV0dG9uIG9uIHRoZSBwb3AtdXAgT1Mga2V5Ym9hcmQgdGhlIGEga2luZCBvZiAnZmFrZScgY2xpY2sgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2l0aCB0aGUgc3VibWl0LXR5cGUgaW5wdXQgZWxlbWVudCBhcyB0aGUgdGFyZ2V0LlxuXHRpZiAoZXZlbnQudGFyZ2V0LnR5cGUgPT09ICdzdWJtaXQnICYmIGV2ZW50LmRldGFpbCA9PT0gMCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cGVybWl0dGVkID0gdGhpcy5vbk1vdXNlKGV2ZW50KTtcblxuXHQvLyBPbmx5IHVuc2V0IHRhcmdldEVsZW1lbnQgaWYgdGhlIGNsaWNrIGlzIG5vdCBwZXJtaXR0ZWQuIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCB0aGUgY2hlY2sgZm9yICF0YXJnZXRFbGVtZW50IGluIG9uTW91c2UgZmFpbHMgYW5kIHRoZSBicm93c2VyJ3MgY2xpY2sgZG9lc24ndCBnbyB0aHJvdWdoLlxuXHRpZiAoIXBlcm1pdHRlZCkge1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHQvLyBJZiBjbGlja3MgYXJlIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cblx0cmV0dXJuIHBlcm1pdHRlZDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYWxsIEZhc3RDbGljaydzIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGxheWVyID0gdGhpcy5sYXllcjtcblxuXHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHR9XG5cblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQsIGZhbHNlKTtcblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMub25Ub3VjaENhbmNlbCwgZmFsc2UpO1xufTtcblxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgRmFzdENsaWNrIGlzIG5lZWRlZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cbiAqL1xuRmFzdENsaWNrLm5vdE5lZWRlZCA9IGZ1bmN0aW9uKGxheWVyKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG1ldGFWaWV3cG9ydDtcblx0dmFyIGNocm9tZVZlcnNpb247XG5cdHZhciBibGFja2JlcnJ5VmVyc2lvbjtcblxuXHQvLyBEZXZpY2VzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0b3VjaCBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRpZiAodHlwZW9mIHdpbmRvdy5vbnRvdWNoc3RhcnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBDaHJvbWUgdmVyc2lvbiAtIHplcm8gZm9yIG90aGVyIGJyb3dzZXJzXG5cdGNocm9tZVZlcnNpb24gPSArKC9DaHJvbWVcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcblxuXHRpZiAoY2hyb21lVmVyc2lvbikge1xuXG5cdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xuXG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XG5cdFx0XHRcdC8vIENocm9tZSBvbiBBbmRyb2lkIHdpdGggdXNlci1zY2FsYWJsZT1cIm5vXCIgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzg5KVxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIENocm9tZSAzMiBhbmQgYWJvdmUgd2l0aCB3aWR0aD1kZXZpY2Utd2lkdGggb3IgbGVzcyBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRcdFx0XHRpZiAoY2hyb21lVmVyc2lvbiA+IDMxICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBDaHJvbWUgZGVza3RvcCBkb2Vzbid0IG5lZWQgRmFzdENsaWNrIChpc3N1ZSAjMTUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdGlmIChkZXZpY2VJc0JsYWNrQmVycnkxMCkge1xuXHRcdGJsYWNrYmVycnlWZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcLyhbMC05XSopXFwuKFswLTldKikvKTtcblxuXHRcdC8vIEJsYWNrQmVycnkgMTAuMysgZG9lcyBub3QgcmVxdWlyZSBGYXN0Y2xpY2sgbGlicmFyeS5cblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vZnRsYWJzL2Zhc3RjbGljay9pc3N1ZXMvMjUxXG5cdFx0aWYgKGJsYWNrYmVycnlWZXJzaW9uWzFdID49IDEwICYmIGJsYWNrYmVycnlWZXJzaW9uWzJdID49IDMpIHtcblx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcblxuXHRcdFx0aWYgKG1ldGFWaWV3cG9ydCkge1xuXHRcdFx0XHQvLyB1c2VyLXNjYWxhYmxlPW5vIGVsaW1pbmF0ZXMgY2xpY2sgZGVsYXkuXG5cdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gd2lkdGg9ZGV2aWNlLXdpZHRoIChvciBsZXNzIHRoYW4gZGV2aWNlLXdpZHRoKSBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBJRTEwIHdpdGggLW1zLXRvdWNoLWFjdGlvbjogbm9uZSwgd2hpY2ggZGlzYWJsZXMgZG91YmxlLXRhcC10by16b29tIChpc3N1ZSAjOTcpXG5cdGlmIChsYXllci5zdHlsZS5tc1RvdWNoQWN0aW9uID09PSAnbm9uZScpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBGYXN0Q2xpY2sgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuRmFzdENsaWNrLmF0dGFjaCA9IGZ1bmN0aW9uKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0cmV0dXJuIG5ldyBGYXN0Q2xpY2sobGF5ZXIsIG9wdGlvbnMpO1xufTtcblxuXG5pZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblxuXHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdGRlZmluZShmdW5jdGlvbigpIHtcblx0XHQndXNlIHN0cmljdCc7XG5cdFx0cmV0dXJuIEZhc3RDbGljaztcblx0fSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gRmFzdENsaWNrLmF0dGFjaDtcblx0bW9kdWxlLmV4cG9ydHMuRmFzdENsaWNrID0gRmFzdENsaWNrO1xufSBlbHNlIHtcblx0d2luZG93LkZhc3RDbGljayA9IEZhc3RDbGljaztcbn1cbiIsInN0b3JlcyA9IHJlcXVpcmUgJy4vc3RvcmVzJ1xucm91dGVzID0gcmVxdWlyZSAnLi9yb3V0ZXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3RhdGljRmlsZXM6IF9fZGlybmFtZStcIi9wdWJsaWNcIlxuICBzdG9yZUlkOiBcInN0b3JlX3N0YXRlX2Zyb21fc2VydmVyXCJcbiAgYXBwSWQ6IFwiYXBwXCJcbiAgcm91dGVzOiByb3V0ZXNcbiAgc3RvcmVzOiBzdG9yZXMiLCJRID0gcmVxdWlyZSAncSdcblxuSW5kZXhWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9pbmRleCdcblRlYW1WaWV3ID0gcmVxdWlyZSAnLi92aWV3cy90ZWFtJ1xuUGxheWVyVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvcGxheWVyJ1xuTWF0Y2hWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9tYXRjaCdcblNjaGVkdWxlVmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvc2NoZWR1bGUnXG5TdGFuZGluZ3NWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9zdGFuZGluZ3MnXG5TdGF0c1ZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3N0YXRzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIFwiL1wiOiAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKVxuICAgICAgQHN0b3JlLmZldGNoKFwidGVhbXNcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YXRzXCIpXG4gICAgXSwgKHN0YW5kaW5ncywgdGVhbXNMaXN0LCBzdGF0c0xpc3QpIC0+XG4gICAgICB0aXRsZTogXCJFdHVzaXZ1XCJcbiAgICAgIGNvbXBvbmVudDogSW5kZXhWaWV3XG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG4gICAgICAgIHRlYW1zOiB0ZWFtc0xpc3QudG9KU09OKClcbiAgICAgICAgc3RhdHM6IHN0YXRzTGlzdC50b0pTT04oKVxuXG4gIFwiL2pvdWtrdWVldC86aWQvOmFjdGl2ZT9cIjogKGlkLCBhY3RpdmUpIC0+XG4gICAgUS5zcHJlYWQgW1xuICAgICAgQHN0b3JlLmZldGNoKFwic3RhbmRpbmdzXCIpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJ0ZWFtXCIsIGlkOiBpZClcbiAgICBdLCAoc3RhbmRpbmdzLCB0ZWFtKSAtPlxuXG4gICAgICBzdWJUaXRsZSA9IHN3aXRjaCBhY3RpdmVcbiAgICAgICAgd2hlbiBcInBlbGFhamF0XCIgdGhlbiBcIlBlbGFhamF0XCJcbiAgICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcIlRpbGFzdG90XCJcbiAgICAgICAgZWxzZSBcIk90dGVsdW9oamVsbWFcIlxuXG4gICAgICB0aXRsZTogXCJKb3Vra3VlZXQgLSAje3RlYW0uZ2V0KFwiaW5mb1wiKS5uYW1lfSAtICN7c3ViVGl0bGV9XCJcbiAgICAgIGNvbXBvbmVudDogVGVhbVZpZXdcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG4gICAgICAgIHRlYW06IHRlYW0udG9KU09OKClcbiAgICAgICAgYWN0aXZlOiBhY3RpdmVcblxuICBcIi9qb3Vra3VlZXQvOmlkLzpwaWQvOnNsdWdcIjogKGlkLCBwaWQsIHNsdWcpIC0+XG4gICAgQHN0b3JlLmZldGNoKFwidGVhbVwiLCBpZDogaWQpLnRoZW4gKHRlYW0pIC0+XG4gICAgICBwbGF5ZXIgPSB0ZWFtLmdldChcInJvc3RlclwiKS5maWx0ZXIoKHBsYXllcikgLT5cbiAgICAgICAgcGxheWVyLmlkIGlzIFwiI3twaWR9LyN7c2x1Z31cIlxuICAgICAgKVswXVxuICAgICAgdGl0bGU6IFwiUGVsYWFqYXQgLSAje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICBjb21wb25lbnQ6IFBsYXllclZpZXdcbiAgICAgICAgaWQ6IHBpZFxuICAgICAgICBwbGF5ZXI6IHBsYXllclxuICAgICAgICB0ZWFtOiB0ZWFtLnRvSlNPTigpXG5cbiAgXCIvb3R0ZWx1dFwiOiAtPlxuICAgIEBzdG9yZS5mZXRjaChcInNjaGVkdWxlXCIpLnRoZW4gKHNjaGVkdWxlKSAtPlxuICAgICAgdGl0bGU6IFwiT3R0ZWx1b2hqZWxtYVwiXG4gICAgICBjb21wb25lbnQ6IFNjaGVkdWxlVmlld1xuICAgICAgICBzY2hlZHVsZTogc2NoZWR1bGUudG9KU09OKClcblxuICBcIi9vdHRlbHV0LzppZC86YWN0aXZlP1wiOiAoaWQsIGFjdGl2ZSkgLT5cbiAgICBRLnNwcmVhZCBbXG4gICAgICBAc3RvcmUuZmV0Y2goXCJzY2hlZHVsZVwiKVxuICAgICAgQHN0b3JlLmZldGNoKFwiZ2FtZUV2ZW50c1wiLCBpZDogaWQpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lTGluZXVwc1wiLCBpZDogaWQpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJnYW1lU3RhdHNcIiwgaWQ6IGlkKVxuICAgIF0sIChzY2hlZHVsZSwgZXZlbnRzLCBsaW5lVXBzLCBzdGF0cykgLT5cbiAgICAgIG1hdGNoID0gc2NoZWR1bGUuZmluZCAoZ2FtZSkgLT5cbiAgICAgICAgZ2FtZS5pZCBpcyBpZFxuXG4gICAgICB0aXRsZTogXCJPdHRlbHUgLSAje21hdGNoLmdldChcImhvbWVcIil9IHZzICN7bWF0Y2guZ2V0KFwiYXdheVwiKX1cIlxuICAgICAgY29tcG9uZW50OiBNYXRjaFZpZXdcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIGdhbWU6IG1hdGNoLnRvSlNPTigpXG4gICAgICAgIGV2ZW50czogZXZlbnRzLnRvSlNPTigpXG4gICAgICAgIGxpbmVVcHM6IGxpbmVVcHMudG9KU09OKClcbiAgICAgICAgc3RhdHM6IHN0YXRzLnRvSlNPTigpXG4gICAgICAgIGFjdGl2ZTogYWN0aXZlXG5cbiAgXCIvc2FyamF0YXVsdWtrb1wiOiAtPlxuICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKS50aGVuIChzdGFuZGluZ3MpIC0+XG4gICAgICB0aXRsZTogXCJTYXJqYXRhdWx1a2tvXCJcbiAgICAgIGNvbXBvbmVudDogU3RhbmRpbmdzVmlld1xuICAgICAgICBzdGFuZGluZ3M6IHN0YW5kaW5ncy50b0pTT04oKVxuXG4gIFwiL3RpbGFzdG90LzphY3RpdmU/XCI6IChhY3RpdmUpIC0+XG4gICAgQHN0b3JlLmZldGNoKFwic3RhdHNcIikudGhlbiAoc3RhdHMpIC0+XG4gICAgICB0aXRsZTogXCJUaWxhc3RvdFwiXG4gICAgICBjb21wb25lbnQ6IFN0YXRzVmlld1xuICAgICAgICBzdGF0czogc3RhdHMudG9KU09OKClcbiAgICAgICAgYWN0aXZlOiBhY3RpdmUiLCJUZWFtc0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL3N0b3Jlcy90ZWFtcydcblNjaGVkdWxlQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vc3RvcmVzL3NjaGVkdWxlJ1xuU3RhbmRpbmdzQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vc3RvcmVzL3N0YW5kaW5ncydcblN0YXRzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9zdGF0cydcblRlYW1Nb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL3RlYW0nXG5HYW1lRXZlbnRzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9nYW1lX2V2ZW50cydcbkdhbWVMaW5ldXBzTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy9nYW1lX2xpbmV1cHMnXG5HYW1lU3RhdHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL2dhbWVfc3RhdHMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgdGVhbXM6IFRlYW1zQ29sbGVjdGlvblxuICBzY2hlZHVsZTogU2NoZWR1bGVDb2xsZWN0aW9uXG4gIHN0YW5kaW5nczogU3RhbmRpbmdzQ29sbGVjdGlvblxuICBzdGF0czogU3RhdHNNb2RlbFxuICB0ZWFtOiBUZWFtTW9kZWxcbiAgZ2FtZUV2ZW50czogR2FtZUV2ZW50c01vZGVsXG4gIGdhbWVMaW5ldXBzOiBHYW1lTGluZXVwc01vZGVsXG4gIGdhbWVTdGF0czogR2FtZVN0YXRzTW9kZWwiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuR2FtZUV2ZW50cyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcImdhbWVzL2V2ZW50cy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L2dhbWVzL2V2ZW50cy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVFdmVudHMiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuR2FtZUxpbmV1cHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJnYW1lcy9saW5ldXBzLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vZ2FtZXMvbGluZXVwcy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMaW5ldXBzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cbkdhbWVTdGF0cyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcImdhbWVzL3N0YXRzLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vZ2FtZXMvc3RhdHMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdHMiLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblNjaGVkdWxlID0gQ29sbGVjdGlvbi5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJzY2hlZHVsZVwiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vc2NoZWR1bGUuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU2NoZWR1bGUiLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblN0YW5kaW5ncyA9IENvbGxlY3Rpb24uZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic3RhbmRpbmdzXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS9zdGFuZGluZ3MuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRpbmdzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblN0YXRzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic3RhdHNcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3N0YXRzLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRzIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblRlYW0gPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJ0ZWFtcy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L3RlYW1zLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbSIsIkNvbGxlY3Rpb24gPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuQ29sbGVjdGlvblxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuVGVhbXMgPSBDb2xsZWN0aW9uLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInRlYW1zXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS90ZWFtcy5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zTGlzdFZpZXcgPSByZXF1aXJlICcuL3RlYW1zX2xpc3QnXG5Ub3BTY29yZXJzVmlldyA9IHJlcXVpcmUgJy4vdG9wX3Njb3JlcnMnXG5cbkluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgIE5hdmlnYXRpb24obnVsbCksIFxuXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcImp1bWJvdHJvblwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIkxpaWdhLnB3XCIpLCBcbiAgICAgICAgUmVhY3QuRE9NLnAobnVsbCwgXCJMaWlnYW4gdGlsYXN0b3Qgbm9wZWFzdGkgamEgdmFpdmF0dG9tYXN0aVwiKVxuICAgICAgKSwgXG5cbiAgICAgIFRlYW1zTGlzdFZpZXcoe1widGVhbXNcIjogKEBwcm9wcy50ZWFtcyl9KSwgXG5cbiAgICAgIFRvcFNjb3JlcnNWaWV3KHtcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMpfSlcblxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBJbmRleCIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG57Um93LCBDb2wsIE5hdiwgTmF2SXRlbSwgVGFiUGFuZX0gPSByZXF1aXJlICdyZWFjdC1ib290c3RyYXAnXG5cbk1hdGNoID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIGV2ZW50OiAoZXZlbnQpIC0+XG4gICAgaWYgZXZlbnQuaGVhZGVyXG4gICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50aCh7XCJjb2xTcGFuXCI6IFwiM1wifSwgKGV2ZW50LmhlYWRlcikpXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKEBwcm9wcy5nYW1lW2V2ZW50LnRlYW1dKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKGV2ZW50LnRpbWUpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAoZXZlbnQudGV4dCkpXG4gICAgICApXG5cbiAgcmVuZGVyOiAtPlxuICAgIGFjdGl2ZUtleSA9IHN3aXRjaCBAcHJvcHMuYWN0aXZlXG4gICAgICB3aGVuIFwidGlsYXN0b3RcIiB0aGVuIFwic3RhdHNcIlxuICAgICAgd2hlbiBcImtldGp1dFwiIHRoZW4gXCJsaW5lVXBzXCJcbiAgICAgIGVsc2UgXCJldmVudHNcIlxuXG4gICAgY29uc29sZS5sb2cgXCJldmVudHNcIiwgQHByb3BzLmV2ZW50c1xuICAgIGNvbnNvbGUubG9nIFwibGluZXVwc1wiLCBAcHJvcHMubGluZVVwc1xuICAgIGNvbnNvbGUubG9nIFwic3RhdHNcIiwgQHByb3BzLnN0YXRzXG4gICAgY29uc29sZS5sb2cgXCJnYW1lXCIsIEBwcm9wcy5nYW1lXG5cbiAgICBldmVudHMgPSBPYmplY3Qua2V5cyhAcHJvcHMuZXZlbnRzKS5yZWR1Y2UgKGFyciwga2V5KSA9PlxuICAgICAgYXJyLnB1c2ggaGVhZGVyOiBrZXlcbiAgICAgIGFyciA9IGFyci5jb25jYXQgQHByb3BzLmV2ZW50c1trZXldXG4gICAgICBhcnJcbiAgICAsIFtdXG5cbiAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgTmF2aWdhdGlvbihudWxsKSwgXG5cbiAgICAgIFJvdyhudWxsLCBcbiAgICAgICAgQ29sKHtcInhzXCI6ICg0KSwgXCJtZFwiOiAoNCl9LCBcbiAgICAgICAgICBSZWFjdC5ET00uaDEobnVsbCwgKEBwcm9wcy5nYW1lLmhvbWUpKVxuICAgICAgICApLCBcblxuICAgICAgICBDb2woe1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCAoQHByb3BzLmdhbWUuaG9tZVNjb3JlKSwgXCIgLSBcIiwgKEBwcm9wcy5nYW1lLmF3YXlTY29yZSkpLCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFwiWWxlaXNcXHUwMGY2XFx1MDBlNDogXCIsIChAcHJvcHMuZ2FtZS5hdHRlbmRhbmNlKSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgQ29sKHtcInhzXCI6ICg0KSwgXCJtZFwiOiAoNCl9LCBcbiAgICAgICAgICBSZWFjdC5ET00uaDEobnVsbCwgKEBwcm9wcy5nYW1lLmF3YXkpKVxuICAgICAgICApXG4gICAgICApLCBcblxuICAgICAgTmF2KHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sIFxuICAgICAgICBOYXZJdGVtKHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je0Bwcm9wcy5pZH1cIiwgXCJrZXlcIjogXCJldmVudHNcIn0sIFwiVGFwYWh0dW1hdFwiKSwgXG4gICAgICAgIE5hdkl0ZW0oe1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfS90aWxhc3RvdFwiLCBcImtleVwiOiBcInN0YXRzXCJ9LCBcIlRpbGFzdG90XCIpLCBcbiAgICAgICAgTmF2SXRlbSh7XCJocmVmXCI6IFwiL290dGVsdXQvI3tAcHJvcHMuaWR9L2tldGp1dFwiLCBcImtleVwiOiBcImxpbmVVcHNcIn0sIFwiS2V0anV0XCIpXG4gICAgICApLCBcblxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0YWItY29udGVudFwiLCBcInJlZlwiOiBcInBhbmVzXCJ9LCBcbiAgICAgICAgVGFiUGFuZSh7XCJrZXlcIjogXCJldmVudHNcIiwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcImV2ZW50c1wiKX0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSwgXG4gICAgICAgICAgICAgIChldmVudHMubWFwIChldmVudCkgPT5cbiAgICAgICAgICAgICAgICBAZXZlbnQoZXZlbnQpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksIFxuXG4gICAgICAgIFRhYlBhbmUoe1wia2V5XCI6IFwic3RhdHNcIiwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInN0YXRzXCIpfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LCBcbiAgICAgICAgICAgICAgKEBwcm9wcy5zdGF0cy5ob21lLnBsYXllcnMubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpXG4gICAgICAgICAgICAgICksIFxuXG4gICAgICAgICAgICAgIChAcHJvcHMuc3RhdHMuaG9tZS5nb2FsaWVzLm1hcCAoZ29hbGllKSAtPlxuICAgICAgICAgICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBSZWFjdC5ET00udGQobnVsbCwgKGdvYWxpZS5maXJzdE5hbWUpLCBcIiBcIiwgKGdvYWxpZS5sYXN0TmFtZSkpKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLCBcblxuICAgICAgICAgICAgUmVhY3QuRE9NLnRhYmxlKHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sIFxuICAgICAgICAgICAgICAoQHByb3BzLnN0YXRzLmF3YXkucGxheWVycy5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSlcbiAgICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgICAgKEBwcm9wcy5zdGF0cy5hd2F5LmdvYWxpZXMubWFwIChnb2FsaWUpIC0+XG4gICAgICAgICAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFJlYWN0LkRPTS50ZChudWxsLCAoZ29hbGllLmZpcnN0TmFtZSksIFwiIFwiLCAoZ29hbGllLmxhc3ROYW1lKSkpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksIFxuXG4gICAgICAgIFRhYlBhbmUoe1wia2V5XCI6IFwibGluZVVwc1wiLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwibGluZVVwc1wiKX0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoIiwiVGFibGVTb3J0TWl4aW4gPVxuICBzZXRTb3J0OiAoZXZlbnQpIC0+XG4gICAgc29ydCA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnNvcnRcbiAgICBpZiBzb3J0XG4gICAgICB0eXBlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQudHlwZSBvciBcImludGVnZXJcIlxuICAgICAgaWYgQHN0YXRlLnNvcnRGaWVsZCBpcyBzb3J0XG4gICAgICAgIG5ld1NvcnQgPSBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIiB0aGVuIFwiYXNjXCIgZWxzZSBcImRlc2NcIlxuICAgICAgICBAc2V0U3RhdGUgc29ydERpcmVjdGlvbjogbmV3U29ydCwgc29ydFR5cGU6IHR5cGVcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldFN0YXRlIHNvcnRGaWVsZDogc29ydCwgc29ydFR5cGU6IHR5cGVcblxuICBzb3J0OiAoYSwgYikgLT5cbiAgICBzd2l0Y2ggQHN0YXRlLnNvcnRUeXBlXG4gICAgICB3aGVuIFwiaW50ZWdlclwiXG4gICAgICAgIGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiXG4gICAgICAgICAgYltAc3RhdGUuc29ydEZpZWxkXSAtIGFbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFbQHN0YXRlLnNvcnRGaWVsZF0gLSBiW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICB3aGVuIFwiZmxvYXRcIlxuICAgICAgICBhVmFsdWUgPSBOdW1iZXIoYVtAc3RhdGUuc29ydEZpZWxkXS5yZXBsYWNlKFwiJVwiLFwiXCIpLnJlcGxhY2UoL1xcLHxcXDovLFwiLlwiKSkgb3IgMFxuICAgICAgICBiVmFsdWUgPSBOdW1iZXIoYltAc3RhdGUuc29ydEZpZWxkXS5yZXBsYWNlKFwiJVwiLFwiXCIpLnJlcGxhY2UoL1xcLHxcXDovLFwiLlwiKSkgb3IgMFxuICAgICAgICBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIlxuICAgICAgICAgIGJWYWx1ZSAtIGFWYWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYVZhbHVlIC0gYlZhbHVlXG4gICAgICB3aGVuIFwic3RyaW5nXCJcbiAgICAgICAgaWYgQHN0YXRlLnNvcnREaXJlY3Rpb24gaXMgXCJkZXNjXCJcbiAgICAgICAgICBpZiBiW0BzdGF0ZS5zb3J0RmllbGRdIDwgYVtAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgLTFcbiAgICAgICAgICBlbHNlIGlmIGJbQHN0YXRlLnNvcnRGaWVsZF0gPiBhW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAxXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgYVtAc3RhdGUuc29ydEZpZWxkXSA8IGJbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgICAgIC0xXG4gICAgICAgICAgZWxzZSBpZiBhW0BzdGF0ZS5zb3J0RmllbGRdID4gYltAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgMVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIDBcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZVNvcnRNaXhpbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xue05hdmJhciwgTmF2LCBOYXZJdGVtLCBEcm9wZG93bkJ1dHRvbiwgTWVudUl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5OYXZpZ2F0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgYnJhbmQgPSBSZWFjdC5ET00uYSh7XCJocmVmXCI6IFwiL1wiLCBcImNsYXNzTmFtZVwiOiBcIm5hdmJhci1icmFuZFwifSwgXCJMaWlnYVwiKVxuXG4gICAgdGVhbXMgPVxuICAgICAgRHJvcGRvd25CdXR0b24oe1widGl0bGVcIjogXCJKb3Vra3VlZXRcIn0sIFxuICAgICAgICAoT2JqZWN0LmtleXMoVGVhbXMubmFtZXNBbmRJZHMpLm1hcCAobmFtZSkgLT5cbiAgICAgICAgICBNZW51SXRlbSh7XCJrZXlcIjogKFRlYW1zLm5hbWVzQW5kSWRzW25hbWVdKSwgXCJocmVmXCI6IFwiL2pvdWtrdWVldC8je1RlYW1zLm5hbWVzQW5kSWRzW25hbWVdfVwifSwgKG5hbWUpKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBpZiBAcHJvcHMuaXRlbVxuICAgICAgaXRlbSA9IE5hdkl0ZW0oe1wiaHJlZlwiOiAoQHByb3BzLml0ZW0udXJsKX0sIChAcHJvcHMuaXRlbS50aXRsZSkpXG5cbiAgICBpZiBAcHJvcHMuZHJvcGRvd25cbiAgICAgIGRyb3Bkb3duID0gRHJvcGRvd25CdXR0b24oe1widGl0bGVcIjogKEBwcm9wcy5kcm9wZG93bi50aXRsZSl9LCBcbiAgICAgICAgKEBwcm9wcy5kcm9wZG93bi5pdGVtcy5tYXAgKGl0ZW0pIC0+XG4gICAgICAgICAgTWVudUl0ZW0oe1wia2V5XCI6IChpdGVtLnRpdGxlKSwgXCJocmVmXCI6IChpdGVtLnVybCl9LCAoaXRlbS50aXRsZSkpXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIE5hdmJhcih7XCJicmFuZFwiOiAoYnJhbmQpLCBcImZpeGVkVG9wXCI6IHRydWUsIFwidG9nZ2xlTmF2S2V5XCI6ICgwKX0sIFxuICAgICAgTmF2KHtcImNsYXNzTmFtZVwiOiBcImJzLW5hdmJhci1jb2xsYXBzZVwiLCBcImtleVwiOiAoMCksIFwicm9sZVwiOiBcIm5hdmlnYXRpb25cIn0sIFxuICAgICAgICBOYXZJdGVtKHtcImhyZWZcIjogXCIvc2FyamF0YXVsdWtrb1wifSwgXCJTYXJqYXRhdWx1a2tvXCIpLCBcbiAgICAgICAgTmF2SXRlbSh7XCJocmVmXCI6IFwiL3RpbGFzdG90XCJ9LCBcIlRpbGFzdG90XCIpLCBcbiAgICAgICAgTmF2SXRlbSh7XCJocmVmXCI6IFwiL290dGVsdXRcIn0sIFwiT3R0ZWx1dFwiKSwgXG4gICAgICAgICh0ZWFtcyksIFxuICAgICAgICAoaXRlbSksIFxuICAgICAgICAoZHJvcGRvd24pXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmlnYXRpb24iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuUGxheWVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgcGxheWVyID0gQHByb3BzLnBsYXllclxuICAgIHRlYW0gPSBAcHJvcHMudGVhbVxuXG4gICAgcGxheWVycyA9XG4gICAgICB0aXRsZTogXCJQZWxhYWphdFwiLFxuICAgICAgaXRlbXM6IHRlYW0ucm9zdGVyLm1hcCAocGxheWVyKSA9PlxuICAgICAgICB0aXRsZTogXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgIHVybDogXCIvam91a2t1ZWV0LyN7dGVhbS5pbmZvLmlkfS8je3BsYXllci5pZH1cIlxuXG4gICAgIyBUT0RPOiBjaGVjayBwb3NpdGlvbiwgS0ggT0wgVkwgUCB1c2UgcGxheWVycywgTVYgdXNlIGdvYWxpZXNcbiAgICBzdGF0cyA9IHRlYW0uc3RhdHMucGxheWVycy5maWx0ZXIoKHBsYXllcikgPT5cbiAgICAgIFtpZCwgc2x1Z10gPSBwbGF5ZXIuaWQuc3BsaXQoXCIvXCIpXG4gICAgICBpZCBpcyBAcHJvcHMuaWRcbiAgICApWzBdXG5cbiAgICBpdGVtID1cbiAgICAgIHRpdGxlOiB0ZWFtLmluZm8ubmFtZVxuICAgICAgdXJsOiB0ZWFtLmluZm8udXJsXG5cbiAgICBjb25zb2xlLmxvZyBcInBsYXllclwiLCBwbGF5ZXJcbiAgICBjb25zb2xlLmxvZyBcInRlYW1cIiwgdGVhbVxuICAgIGNvbnNvbGUubG9nIFwic3RhdHNcIiwgc3RhdHNcblxuICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwicGxheWVyXCJ9LCBcbiAgICAgIE5hdmlnYXRpb24oe1wiZHJvcGRvd25cIjogKHBsYXllcnMpLCBcIml0ZW1cIjogKGl0ZW0pfSksIFxuXG4gICAgICBSZWFjdC5ET00uaDEobnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpLCBcblxuICAgICAgUmVhY3QuRE9NLmgyKG51bGwsIFwiI1wiLCAocGxheWVyLm51bWJlciksIFwiIFwiLCAocGxheWVyLnBvc2l0aW9uKSksIFxuXG4gICAgICBSZWFjdC5ET00uaDMobnVsbCwgUmVhY3QuRE9NLmEoe1wiY2xhc3NOYW1lXCI6IFwidGVhbS1sb2dvICN7dGVhbS5pbmZvLmlkfVwiLCBcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7dGVhbS5pbmZvLmlkfVwifSksIFwiIFwiLCAodGVhbS5pbmZvLm5hbWUpKSwgXG5cbiAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgKG1vbWVudChwbGF5ZXIuYmlydGhkYXkpLmZvcm1hdChcIkRELk1NLllZWVlcIikpKSwgXG4gICAgICBSZWFjdC5ET00uZGl2KG51bGwsIChwbGF5ZXIuaGVpZ2h0KSwgXCIgY21cIiksIFxuICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCAocGxheWVyLndlaWdodCksIFwiIGtnXCIpLCBcbiAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgKHBsYXllci5zaG9vdHMpKSwgXG5cbiAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSwgXG4gICAgICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZVwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoZWFkKG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJPXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiTVwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlNcIiksIFxuICAgICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUlwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIitcXHgyRi1cIiksIFxuICAgICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCIrXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiLVwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIllWTVwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkFWTVwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlZNXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiTFwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkwlXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiQVwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkElXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiQWlrYVwiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksIFxuICAgICAgICAgIFJlYWN0LkRPTS50Ym9keShudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChzdGF0cy5nYW1lcykpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChzdGF0cy5nb2FscykpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChzdGF0cy5hc3Npc3RzKSksIFxuICAgICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHN0YXRzLnBvaW50cykpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChzdGF0cy5wZW5hbHRpZXMpKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAoc3RhdHMucGx1c01pbnVzKSksIFxuICAgICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHN0YXRzLnBsdXNzZXMpKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAoc3RhdHMubWludXNlcykpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChzdGF0cy5wb3dlclBsYXlHb2FscykpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChzdGF0cy5zaG9ydEhhbmRlZEdvYWxzKSksIFxuICAgICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHN0YXRzLndpbm5pbmdHb2FscykpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChzdGF0cy5zaG90cykpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChzdGF0cy5zaG9vdGluZ1BlcmNlbnRhZ2UpKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAoc3RhdHMuZmFjZW9mZnMpKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAoc3RhdHMuZmFjZW9mZlBlcmNlbnRhZ2UpKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAoc3RhdHMucGxheWluZ1RpbWVBdmVyYWdlKSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXIiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuUGxheWVyU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sIFxuICAgICAgUmVhY3QuRE9NLnRhYmxlKHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sIFxuICAgICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiTmFtZVwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJHYW1lc1wiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJHb2Fsc1wiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJBc3Npc3RzXCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBvaW50c1wiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQZW5hbHRpZXNcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiK1xceDJGLVwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG4gICAgICAgIChAcHJvcHMuc3RhdHMubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgUmVhY3QuRE9NLnRyKHtcImtleVwiOiAocGxheWVyLmlkKX0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIFJlYWN0LkRPTS5hKHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7cGxheWVyLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFxceDNFXCIsIChwbGF5ZXIubGFzdE5hbWUpKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ2FtZXMpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nb2FscykpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmFzc2lzdHMpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wb2ludHMpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wbHVzTWludXMpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5tb21lbnQubG9jYWxlKCdmaSdcbiAgbW9udGhzIDogW1xuICAgIFwiVGFtbWlrdXVcIiwgXCJIZWxtaWt1dVwiLCBcIk1hYWxpc2t1dVwiLCBcIkh1aHRpa3V1XCIsIFwiVG91a29rdXVcIiwgXCJLZXPDpGt1dVwiLCBcIkhlaW7DpGt1dVwiLFxuICAgIFwiRWxva3V1XCIsIFwiU3l5c2t1dVwiLCBcIkxva2FrdXVcIiwgXCJNYXJyYXNrdXVcIiwgXCJKb3VsdWt1dVwiXG4gIF1cbilcbm1vbWVudC5sb2NhbGUoJ2ZpJylcblxuU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgbWF0Y2hMaW5rOiAobWF0Y2gpIC0+XG4gICAgaWYgbW9tZW50KG1hdGNoLmRhdGUpIDwgbW9tZW50KClcbiAgICAgIFJlYWN0LkRPTS5hKHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je21hdGNoLmlkfVwifSwgKG1hdGNoLmhvbWUpLCBcIiAtIFwiLCAobWF0Y2guYXdheSkpXG4gICAgZWxzZVxuICAgICAgUmVhY3QuRE9NLnNwYW4obnVsbCwgKG1hdGNoLmhvbWUpLCBcIiAtIFwiLCAobWF0Y2guYXdheSkpXG5cbiAgZ3JvdXBlZFNjaGVkdWxlOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnNjaGVkdWxlKS5ncm91cEJ5IChtYXRjaCkgLT5cbiAgICAgIG1vbWVudChtYXRjaC5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgcmVuZGVyOiAtPlxuICAgIG1vbnRobHlNYXRjaGVzID0gQGdyb3VwZWRTY2hlZHVsZSgpLm1hcCAobWF0Y2hlcywgbW9udGgpID0+XG4gICAgICBSZWFjdC5ET00udGJvZHkobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgoe1wiY29sU3BhblwiOiA0fSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKVxuICAgICAgICApLCBcbiAgICAgICAgKG1hdGNoZXMubWFwIChtYXRjaCkgPT5cbiAgICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChtYXRjaC5pZCl9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobW9tZW50KG1hdGNoLmRhdGUpLmZvcm1hdChcIkRELk1NLllZWVlcIikpLCBcIiBcIiwgKG1hdGNoLnRpbWUpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKEBtYXRjaExpbmsobWF0Y2gpKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChtYXRjaC5ob21lU2NvcmUpLCBcIi1cIiwgKG1hdGNoLmF3YXlTY29yZSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobWF0Y2guYXR0ZW5kYW5jZSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgTmF2aWdhdGlvbihudWxsKSwgXG5cbiAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIk90dGVsdW9oamVsbWFcIiksIFxuXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sIFxuICAgICAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LCBcbiAgICAgICAgICAobW9udGhseU1hdGNoZXMpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU2NoZWR1bGUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRhYmxlU29ydE1peGluID0gcmVxdWlyZSAnLi9taXhpbnMvdGFibGVfc29ydCdcblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG5TdGFuZGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIG1peGluczogW1RhYmxlU29ydE1peGluXVxuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBzb3J0RmllbGQ6IFwicG9pbnRzXCJcbiAgICBzb3J0RGlyZWN0aW9uOiBcImRlc2NcIlxuICAgIHNvcnRUeXBlOiBcImludGVnZXJcIlxuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgcmVuZGVyOiAtPlxuICAgIHN0YW5kaW5ncyA9IEBwcm9wcy5zdGFuZGluZ3Muc29ydChAc29ydCkubWFwICh0ZWFtKSAtPlxuICAgICAgUmVhY3QuRE9NLnRyKHtcImtleVwiOiAodGVhbS5uYW1lKX0sIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHRlYW0ucG9zaXRpb24pKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBSZWFjdC5ET00uYSh7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je1RlYW1zLm5hbWVUb0lkKHRlYW0ubmFtZSl9XCJ9LCAodGVhbS5uYW1lKSkpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsICh0ZWFtLmdhbWVzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHRlYW0ud2lucykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsICh0ZWFtLnRpZXMpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAodGVhbS5sb3NlcykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsICh0ZWFtLmV4dHJhUG9pbnRzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHRlYW0ucG9pbnRzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHRlYW0uZ29hbHNGb3IpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAodGVhbS5nb2Fsc0FnYWluc3QpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAodGVhbS5wb3dlcnBsYXlQZXJjZW50YWdlKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHRlYW0uc2hvcnRoYW5kUGVyY2VudGFnZSkpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsICh0ZWFtLnBvaW50c1BlckdhbWUpKVxuICAgICAgKVxuXG4gICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgIE5hdmlnYXRpb24obnVsbCksIFxuXG4gICAgICBSZWFjdC5ET00uaDEobnVsbCwgXCJTYXJqYXRhdWx1a2tvXCIpLCBcblxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRhYmxlKHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoZWFkKHtcImNsYXNzTmFtZVwiOiBcInNvcnRhYmxlLXRoZWFkXCIsIFwib25DbGlja1wiOiAoQHNldFNvcnQpfSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJnYW1lc1wifSwgXCJPXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcIndpbnNcIn0sIFwiVlwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJ0aWVzXCJ9LCBcIlRcIiksIFxuICAgICAgICAgICAgICBSZWFjdC5ET00udGgoe1wiZGF0YS1zb3J0XCI6IFwibG9zZXNcIn0sIFwiSFwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJleHRyYVBvaW50c1wifSwgXCJMUFwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJwb2ludHNcIn0sIFwiUFwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0ZvclwifSwgXCJUTVwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0FnYWluc3RcIn0sIFwiUE1cIiksIFxuICAgICAgICAgICAgICBSZWFjdC5ET00udGgoe1wiZGF0YS1zb3J0XCI6IFwicG93ZXJwbGF5UGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIllWJVwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJzaG9ydGhhbmRQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiQVYlXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcInBvaW50c1BlckdhbWVcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJQXFx4MkZPXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRib2R5KG51bGwsIFxuICAgICAgICAgICAgKHN0YW5kaW5ncylcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRpbmdzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG57VGFiUGFuZSwgTmF2LCBOYXZJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgcmVuZGVyOiAtPlxuICAgIGFjdGl2ZUtleSA9IHN3aXRjaCBAcHJvcHMuYWN0aXZlXG4gICAgICB3aGVuIFwibWFhbGl2YWhkaXRcIiB0aGVuIFwiZ29hbGllc1wiXG4gICAgICBlbHNlIFwicGxheWVyc1wiXG5cbiAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgTmF2aWdhdGlvbihudWxsKSwgXG5cbiAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIlRpbGFzdG90XCIpLCBcblxuICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgICAgTmF2KHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sIFxuICAgICAgICAgIE5hdkl0ZW0oe1wiaHJlZlwiOiBcIi90aWxhc3RvdFwiLCBcImtleVwiOiBcInBsYXllcnNcIn0sIFwiS2VudHRcXHUwMGU0cGVsYWFqYXRcIiksIFxuICAgICAgICAgIE5hdkl0ZW0oe1wiaHJlZlwiOiBcIi90aWxhc3RvdC9tYWFsaXZhaGRpdFwiLCBcImtleVwiOiBcImdvYWxpZXNcIn0sIFwiTWFhbGl2YWhkaXRcIilcbiAgICAgICAgKSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGFiLWNvbnRlbnRcIiwgXCJyZWZcIjogXCJwYW5lc1wifSwgXG4gICAgICAgICAgVGFiUGFuZSh7XCJrZXlcIjogXCJwbGF5ZXJzXCIsIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJwbGF5ZXJzXCIpfSwgXG4gICAgICAgICAgICBSZWFjdC5ET00uaDIobnVsbCwgXCJLZW50dFxcdTAwZTRwZWxhYWphdFwiKVxuXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgVGFiUGFuZSh7XCJrZXlcIjogXCJnb2FsaWVzXCIsIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJnb2FsaWVzXCIpfSwgXG4gICAgICAgICAgICBSZWFjdC5ET00uaDIobnVsbCwgXCJNYWFsaXZhaGRpdFwiKVxuXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5QbGF5ZXJTdGF0cyA9IHJlcXVpcmUgJy4vcGxheWVyX3N0YXRzJ1xuVGVhbVNjaGVkdWxlID0gcmVxdWlyZSAnLi90ZWFtX3NjaGVkdWxlJ1xuVGVhbVN0YXRzID0gcmVxdWlyZSAnLi90ZWFtX3N0YXRzJ1xuVGVhbVJvc3RlciA9IHJlcXVpcmUgJy4vdGVhbV9yb3N0ZXInXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbntUYWJQYW5lLCBKdW1ib3Ryb24sIEJ1dHRvblRvb2xiYXIsIEJ1dHRvbiwgQ29sLCBSb3csIE5hdiwgTmF2SXRlbX0gPSByZXF1aXJlIFwicmVhY3QtYm9vdHN0cmFwXCJcblxuVGVhbSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgd2luZG93LnNjcm9sbFRvKDAsMClcblxuICBsb2dvOiAtPlxuICAgIFJlYWN0LkRPTS5pbWcoe1wic3JjXCI6IChUZWFtcy5sb2dvKEBwcm9wcy50ZWFtLmluZm8ubmFtZSkpLCBcImFsdFwiOiAoQHByb3BzLnRlYW0uaW5mby5uYW1lKX0pXG5cbiAgcmVuZGVyOiAtPlxuICAgIGFjdGl2ZUtleSA9IHN3aXRjaCBAcHJvcHMuYWN0aXZlXG4gICAgICB3aGVuIFwicGVsYWFqYXRcIiB0aGVuIFwicGxheWVyc1wiXG4gICAgICB3aGVuIFwidGlsYXN0b3RcIiB0aGVuIFwic3RhdHNcIlxuICAgICAgZWxzZSBcInNjaGVkdWxlXCJcblxuICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICBOYXZpZ2F0aW9uKG51bGwpLCBcblxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0ZWFtXCJ9LCBcbiAgICAgICAgSnVtYm90cm9uKG51bGwsIFxuICAgICAgICAgIFJvdyhudWxsLCBcbiAgICAgICAgICAgIENvbCh7XCJ4c1wiOiAoMTIpLCBcIm1kXCI6ICg2KX0sIFxuICAgICAgICAgICAgICBSZWFjdC5ET00uaDEobnVsbCwgKEBsb2dvKCkpLCBcIiBcIiwgKEBwcm9wcy50ZWFtLmluZm8ubmFtZSkpXG4gICAgICAgICAgICApLCBcbiAgICAgICAgICAgIENvbCh7XCJ4c1wiOiAoMTIpLCBcIm1kXCI6ICg2KX0sIFxuICAgICAgICAgICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcInRlYW0tY29udGFpbmVyXCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5ET00udWwobnVsbCwgXG4gICAgICAgICAgICAgICAgICBSZWFjdC5ET00ubGkobnVsbCwgKEBwcm9wcy50ZWFtLmluZm8ubG9uZ05hbWUpKSwgXG4gICAgICAgICAgICAgICAgICBSZWFjdC5ET00ubGkobnVsbCwgKEBwcm9wcy50ZWFtLmluZm8uYWRkcmVzcykpLCBcbiAgICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCAoQHByb3BzLnRlYW0uaW5mby5lbWFpbCkpXG4gICAgICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgICAgICBCdXR0b25Ub29sYmFyKG51bGwsIFxuICAgICAgICAgICAgICAgICAgQnV0dG9uKHtcImJzU3R5bGVcIjogXCJwcmltYXJ5XCIsIFwiYnNTaXplXCI6IFwibGFyZ2VcIiwgXCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLnRpY2tldHNVcmwpfSwgXCJMaXB1dFwiKSwgXG4gICAgICAgICAgICAgICAgICBCdXR0b24oe1wiYnNTdHlsZVwiOiBcInByaW1hcnlcIiwgXCJic1NpemVcIjogXCJsYXJnZVwiLCBcImhyZWZcIjogKEBwcm9wcy50ZWFtLmluZm8ubG9jYXRpb25VcmwpfSwgXCJIYWxsaW4gc2lqYWludGlcIilcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICAgICAgTmF2KHtcImJzU3R5bGVcIjogXCJ0YWJzXCIsIFwiYWN0aXZlS2V5XCI6IChhY3RpdmVLZXkpLCBcInJlZlwiOiBcInRhYnNcIn0sIFxuICAgICAgICAgICAgTmF2SXRlbSh7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy5pZH1cIiwgXCJrZXlcIjogXCJzY2hlZHVsZVwifSwgXCJPdHRlbHV0XCIpLCBcbiAgICAgICAgICAgIE5hdkl0ZW0oe1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMuaWR9L3RpbGFzdG90XCIsIFwia2V5XCI6IFwic3RhdHNcIn0sIFwiVGlsYXN0b3RcIiksIFxuICAgICAgICAgICAgTmF2SXRlbSh7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy5pZH0vcGVsYWFqYXRcIiwgXCJrZXlcIjogXCJwbGF5ZXJzXCJ9LCBcIlBlbGFhamF0XCIpXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0YWItY29udGVudFwiLCBcInJlZlwiOiBcInBhbmVzXCJ9LCBcbiAgICAgICAgICAgIFRhYlBhbmUoe1wia2V5XCI6IFwic2NoZWR1bGVcIiwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInNjaGVkdWxlXCIpfSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIk90dGVsdXRcIiksIFxuICAgICAgICAgICAgICBUZWFtU2NoZWR1bGUoe1widGVhbVwiOiAoQHByb3BzLnRlYW0pfSlcbiAgICAgICAgICAgICksIFxuICAgICAgICAgICAgVGFiUGFuZSh7XCJrZXlcIjogXCJzdGF0c1wiLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwic3RhdHNcIil9LCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIFwiVGlsYXN0b3RcIiksIFxuICAgICAgICAgICAgICBUZWFtU3RhdHMoe1widGVhbUlkXCI6IChAcHJvcHMuaWQpLCBcInN0YXRzXCI6IChAcHJvcHMudGVhbS5zdGF0cyl9KVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBUYWJQYW5lKHtcImtleVwiOiBcInBsYXllcnNcIiwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInBsYXllcnNcIil9LCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIFwiUGVsYWFqYXRcIiksIFxuICAgICAgICAgICAgICBUZWFtUm9zdGVyKHtcInRlYW1JZFwiOiAoQHByb3BzLmlkKSwgXCJyb3N0ZXJcIjogKEBwcm9wcy50ZWFtLnJvc3Rlcil9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW0iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cblRlYW1Sb3N0ZXIgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGdyb3VwZWRSb3N0ZXI6IC0+XG4gICAgXy5jaGFpbihAcHJvcHMucm9zdGVyKVxuICAgIC5ncm91cEJ5KChwbGF5ZXIpIC0+IHBsYXllci5wb3NpdGlvbilcbiAgICAucmVkdWNlKChyZXN1bHQsIHBsYXllciwgcG9zaXRpb24pIC0+XG4gICAgICBncm91cCA9IHN3aXRjaFxuICAgICAgICB3aGVuIF8uaW5jbHVkZShbXCJLSFwiLCBcIk9MXCIsIFwiVkxcIl0sIHBvc2l0aW9uKSB0aGVuIFwiSHnDtmtrw6TDpGrDpHRcIlxuICAgICAgICB3aGVuIF8uaW5jbHVkZShbXCJPUFwiLCBcIlZQXCJdLCBwb3NpdGlvbikgdGhlbiBcIlB1b2x1c3RhamF0XCJcbiAgICAgICAgd2hlbiBwb3NpdGlvbiBpcyBcIk1WXCIgdGhlbiBcIk1hYWxpdmFoZGl0XCJcbiAgICAgIHJlc3VsdFtncm91cF0gfHw9IFtdXG4gICAgICByZXN1bHRbZ3JvdXBdLnB1c2ggcGxheWVyXG4gICAgICByZXN1bHRcbiAgICAsIHt9KVxuXG4gIHJlbmRlcjogLT5cbiAgICBncm91cHMgPSBAZ3JvdXBlZFJvc3RlcigpLm1hcCAocGxheWVycywgZ3JvdXApID0+XG4gICAgICBSZWFjdC5ET00udGJvZHkoe1wia2V5XCI6IChncm91cCl9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJjb2xTcGFuXCI6IDZ9LCAoZ3JvdXApKVxuICAgICAgICApLCBcbiAgICAgICAgKF8uY2hhaW4ocGxheWVycykuZmxhdHRlbigpLm1hcCAocGxheWVyKSA9PlxuICAgICAgICAgIHVybCA9IFwiL2pvdWtrdWVldC8je0Bwcm9wcy50ZWFtSWR9LyN7cGxheWVyLmlkfVwiXG4gICAgICAgICAgdGl0bGUgPSBcIiN7cGxheWVyLmZpcnN0TmFtZX0gI3twbGF5ZXIubGFzdE5hbWV9XCJcbiAgICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLmEoe1wiaHJlZlwiOiAodXJsKX0sICh0aXRsZSkpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLnN0cm9uZyhudWxsLCAocGxheWVyLm51bWJlcikpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5oZWlnaHQpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci53ZWlnaHQpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5zaG9vdHMpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKG1vbWVudCgpLmRpZmYocGxheWVyLmJpcnRoZGF5LCBcInllYXJzXCIpKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSwgXG4gICAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSwgXG4gICAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOaW1pXCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk51bWVyb1wiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQaXR1dXNcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUGFpbm9cIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiS1xcdTAwZTR0aXN5eXNcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiSWtcXHUwMGU0XCIpXG4gICAgICAgICAgKVxuICAgICAgICApLCBcbiAgICAgICAgKGdyb3VwcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVJvc3RlciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5UZWFtU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIG1hdGNoTGluazogKG1hdGNoKSAtPlxuICAgIGlmIG1vbWVudChtYXRjaC5kYXRlKSA8IG1vbWVudCgpXG4gICAgICBSZWFjdC5ET00uYSh7XCJocmVmXCI6IFwiL290dGVsdXQvI3ttYXRjaC5pZH1cIn0sIChAdGl0bGVTdHlsZShtYXRjaC5ob21lKSksIFwiIC0gXCIsIChAdGl0bGVTdHlsZShtYXRjaC5hd2F5KSkpXG4gICAgZWxzZVxuICAgICAgUmVhY3QuRE9NLnNwYW4obnVsbCwgKEB0aXRsZVN0eWxlKG1hdGNoLmhvbWUpKSwgXCIgLSBcIiwgKEB0aXRsZVN0eWxlKG1hdGNoLmF3YXkpKSlcblxuICB0aXRsZVN0eWxlOiAobmFtZSkgLT5cbiAgICBpZiBAcHJvcHMudGVhbS5pbmZvLm5hbWUgaXMgbmFtZVxuICAgICAgUmVhY3QuRE9NLnN0cm9uZyhudWxsLCAobmFtZSkpXG4gICAgZWxzZVxuICAgICAgbmFtZVxuXG4gIGxvZ286IChuYW1lKSAtPlxuICAgIFJlYWN0LkRPTS5pbWcoe1wic3JjXCI6IChUZWFtcy5sb2dvKG5hbWUpKSwgXCJhbHRcIjogKG5hbWUpfSlcblxuICBncm91cGVkU2NoZWR1bGU6IC0+XG4gICAgXy5jaGFpbihAcHJvcHMudGVhbS5zY2hlZHVsZSkuZ3JvdXBCeSAobWF0Y2gpIC0+XG4gICAgICBtb21lbnQobWF0Y2guZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTVwiKVxuXG4gIHJlbmRlcjogLT5cbiAgICBtb250aGx5TWF0Y2hlcyA9IEBncm91cGVkU2NoZWR1bGUoKS5tYXAgKG1hdGNoZXMsIG1vbnRoKSA9PlxuICAgICAgUmVhY3QuRE9NLnRib2R5KHtcImtleVwiOiAobW9udGgpfSwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgoe1wiY29sU3BhblwiOiA0fSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKVxuICAgICAgICApLCBcbiAgICAgICAgKG1hdGNoZXMubWFwIChtYXRjaCkgPT5cbiAgICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChtYXRjaC5pZCl9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobW9tZW50KG1hdGNoLmRhdGUpLmZvcm1hdChcIkRELk1NLllZWVlcIikpLCBcIiBcIiwgKG1hdGNoLnRpbWUpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKEBtYXRjaExpbmsobWF0Y2gpKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChtYXRjaC5ob21lU2NvcmUpLCBcIi1cIiwgKG1hdGNoLmF3YXlTY29yZSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobWF0Y2guYXR0ZW5kYW5jZSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sIFxuICAgICAgUmVhY3QuRE9NLnRhYmxlKHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSwgXG4gICAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQXFx1MDBlNGl2XFx1MDBlNG1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkpvdWtrdWVldFwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJUdWxvc1wiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJZbGVpc1xcdTAwZjZtXFx1MDBlNFxcdTAwZTRyXFx1MDBlNFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG4gICAgICAgIChtb250aGx5TWF0Y2hlcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5UYWJsZVNvcnRNaXhpbiA9IHJlcXVpcmUgJy4vbWl4aW5zL3RhYmxlX3NvcnQnXG5cblRlYW1TdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgbWl4aW5zOiBbVGFibGVTb3J0TWl4aW5dXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHNvcnRGaWVsZDogXCJwb2ludHNcIlxuICAgIHNvcnREaXJlY3Rpb246IFwiZGVzY1wiXG4gICAgc29ydFR5cGU6IFwiaW50ZWdlclwiXG5cbiAgcmVuZGVyOiAtPlxuICAgIHBsYXllcnMgPSBAcHJvcHMuc3RhdHMucGxheWVycy5zb3J0KEBzb3J0KS5tYXAgKHBsYXllcikgPT5cbiAgICAgIFJlYWN0LkRPTS50cih7XCJrZXlcIjogKHBsYXllci5pZCl9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIFJlYWN0LkRPTS5hKHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ2FtZXMpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmdvYWxzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5hc3Npc3RzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wb2ludHMpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBlbmFsdGllcykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIucGx1c01pbnVzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wbHVzc2VzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5taW51c2VzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wb3dlclBsYXlHb2FscykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuc2hvcnRIYW5kZWRHb2FscykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIud2lubmluZ0dvYWxzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5zaG90cykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuc2hvb3RpbmdQZXJjZW50YWdlKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5mYWNlb2ZmcykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZmFjZW9mZlBlcmNlbnRhZ2UpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBsYXlpbmdUaW1lQXZlcmFnZSkpXG4gICAgICApXG5cbiAgICBnb2FsaWVzID0gQHByb3BzLnN0YXRzLmdvYWxpZXMubWFwIChwbGF5ZXIpID0+XG4gICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nYW1lcykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIud2lucykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIudGllcykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIubG9zc2VzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5zYXZlcykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ29hbHNBbGxvd2VkKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5zaHV0b3V0cykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ29hbHNBdmVyYWdlKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5zYXZpbmdQZXJjZW50YWdlKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nb2FscykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLCBcbiAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIucG9pbnRzKSksIFxuICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLndpblBlcmNlbnRhZ2UpKSwgXG4gICAgICAgIFJlYWN0LkRPTS50ZCh7XCJjb2xTcGFuXCI6IDJ9LCAocGxheWVyLm1pbnV0ZXMpKVxuICAgICAgKVxuXG4gICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRlYW0tcm9zdGVyXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRoZWFkKHtcImNsYXNzTmFtZVwiOiBcInNvcnRhYmxlLXRoZWFkXCIsIFwib25DbGlja1wiOiAoQHNldFNvcnQpfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImNvbFNwYW5cIjogMTd9LCBcIlBlbGFhamF0XCIpXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcImxhc3ROYW1lXCIsIFwiZGF0YS10eXBlXCI6IFwic3RyaW5nXCJ9LCBcIk5pbWlcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcImdhbWVzXCJ9LCBcIk9cIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcImdvYWxzXCJ9LCBcIk1cIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcImFzc2lzdHNcIn0sIFwiU1wiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgoe1wiZGF0YS1zb3J0XCI6IFwicG9pbnRzXCJ9LCBcIlBcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcInBlbmFsdGllc1wifSwgXCJSXCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJwbHVzTWludXNcIn0sIFwiK1xceDJGLVwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgoe1wiZGF0YS1zb3J0XCI6IFwicGx1c3Nlc1wifSwgXCIrXCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJkYXRhLXNvcnRcIjogXCJtaW51c2VzXCJ9LCBcIi1cIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcInBvd2VyUGxheUdvYWxzXCJ9LCBcIllWTVwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgoe1wiZGF0YS1zb3J0XCI6IFwic2hvcnRIYW5kZWRHb2Fsc1wifSwgXCJBVk1cIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcIndpbm5pbmdHb2Fsc1wifSwgXCJWTVwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgoe1wiZGF0YS1zb3J0XCI6IFwic2hvdHNcIn0sIFwiTFwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgoe1wiZGF0YS1zb3J0XCI6IFwic2hvb3RpbmdQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiTCVcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcImZhY2VvZmZzXCJ9LCBcIkFcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcImZhY2VvZmZQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiQSVcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImRhdGEtc29ydFwiOiBcInBsYXlpbmdUaW1lQXZlcmFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkFpa2FcIilcbiAgICAgICAgICApXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5ET00udGJvZHkobnVsbCwgXG4gICAgICAgICAgKHBsYXllcnMpXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImNvbFNwYW5cIjogMTd9LCBcIk1hYWxpdmFoZGl0XCIpXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiTmltaVwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQT1wiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJWXCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlRcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiSFwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJUT1wiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQTVwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOUFwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJLQVwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJUJVwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJNXCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlNcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUFwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJSXCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlYlXCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aCh7XCJjb2xTcGFuXCI6IDJ9LCBcIkFpa2FcIilcbiAgICAgICAgICApXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5ET00udGJvZHkobnVsbCwgXG4gICAgICAgICAgKGdvYWxpZXMpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRlYW1zTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwicm93XCJ9LCBcbiAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGVhbXMtdmlldyBjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMiBjb2wtbGctMTJcIn0sIFxuICAgICAgICAoXG4gICAgICAgICAgQHByb3BzLnRlYW1zLm1hcCAodGVhbSkgLT5cbiAgICAgICAgICAgIFJlYWN0LkRPTS5hKHtcImtleVwiOiAodGVhbS5pZCksIFwiY2xhc3NOYW1lXCI6IFwidGVhbS1sb2dvICN7dGVhbS5pZH1cIiwgXCJocmVmXCI6IFwiL2pvdWtrdWVldC8je3RlYW0uaWR9XCJ9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1zTGlzdCIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5Ub3BTY29yZXJzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRoZWFkKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk5pbWlcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiT3R0ZWx1dFwiKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJNYWFsaXRcIiksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiU3lcXHUwMGY2dFxcdTAwZjZ0XCIpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBpc3RlZXRcIilcbiAgICAgICAgICApXG4gICAgICAgICksIFxuICAgICAgICAoQHByb3BzLnN0YXRzLnNjb3JpbmdTdGF0cy5maWx0ZXIgKHBsYXllciwgaW5kZXgpIC0+XG4gICAgICAgICAgaW5kZXggPCAyMFxuICAgICAgICAubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgUmVhY3QuRE9NLnRyKHtcImtleVwiOiAocGxheWVyLmlkKX0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIFJlYWN0LkRPTS5hKHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7cGxheWVyLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmdhbWVzKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ29hbHMpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5hc3Npc3RzKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIucG9pbnRzKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVG9wU2NvcmVycyJdfQ==
