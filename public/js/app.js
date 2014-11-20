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
  componentDidMount: function() {
    return window.scrollTo(0, 0);
  },
  gameLink: function(game) {
    if (moment(game.date) < moment()) {
      return React.createElement(React.DOM.a, {
        "href": "/ottelut/" + game.id
      }, game.home, " - ", game.away);
    } else {
      return React.createElement(React.DOM.span, null, game.home, " - ", game.away);
    }
  },
  groupedSchedule: function() {
    return _.chain(this.props.schedule).groupBy(function(game) {
      return moment(game.date).format("YYYY-MM");
    });
  },
  render: function() {
    var monthlyGames;
    monthlyGames = this.groupedSchedule().map((function(_this) {
      return function(games, month) {
        return React.createElement(React.DOM.tbody, null, React.createElement(React.DOM.tr, null, React.createElement(React.DOM.th, {
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM"))), games.map(function(game) {
          return React.createElement(React.DOM.tr, {
            "key": game.id
          }, React.createElement(React.DOM.td, null, moment(game.date).format("DD.MM.YYYY"), " ", game.time), React.createElement(React.DOM.td, null, _this.gameLink(game)), React.createElement(React.DOM.td, null, game.homeScore, "-", game.awayScore), React.createElement(React.DOM.td, null, game.attendance));
        }));
      };
    })(this));
    return React.createElement(React.DOM.div, null, React.createElement(Navigation, null), React.createElement(React.DOM.h1, null, "Otteluohjelma"), React.createElement(React.DOM.div, {
      "className": "table-responsive"
    }, React.createElement(React.DOM.table, {
      "className": "table table-striped team-schedule"
    }, monthlyGames)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY2xpZW50LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2NvbmZpZy9hcGktYnJvd3Nlci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9saWIvdGVhbXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3RjbGljay9saWIvZmFzdGNsaWNrLmpzIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvb3B0aW9ucy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9yb3V0ZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvZ2FtZV9saW5ldXBzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9nYW1lX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2V2ZW50cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9nYW1lX2xpbmV1cHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvZ2FtZV9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9taXhpbnMvdGFibGVfc29ydC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9uYXZpZ2F0aW9uLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3BsYXllci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXJfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc2NoZWR1bGUuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3Mvc3RhbmRpbmdzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW0uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9yb3N0ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3N0YXRzLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1zX2xpc3QuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdG9wX3Njb3JlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSx3REFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FBUixDQUFBOztBQUFBLFVBQ0EsR0FBYSxPQUFBLENBQVEsWUFBUixDQURiLENBQUE7O0FBQUEsU0FFQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRlosQ0FBQTs7QUFBQSxPQUdBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLFlBS0EsR0FBZSxRQUFRLENBQUMsY0FBVCxDQUF3QixPQUFPLENBQUMsS0FBaEMsQ0FMZixDQUFBOztBQUFBLE9BT08sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsT0FBRCxHQUFBOztJQUFDLFVBQVE7R0FDeEI7QUFBQSxFQUFBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixPQUE5QixDQUF1QyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQTFDLEdBQXVELGFBQUEsR0FBYSxPQUFPLENBQUMsS0FBNUUsQ0FBQTtTQUNBLEtBQUssQ0FBQyxlQUFOLENBQXNCLE9BQU8sQ0FBQyxTQUE5QixFQUF5QyxZQUF6QyxFQUZlO0FBQUEsQ0FQakIsQ0FBQTs7QUFBQSxPQVdPLENBQUMsVUFBUixHQUFxQixTQUFDLE1BQUQsR0FBQTtTQUNuQixTQUFTLENBQUMsTUFBVixDQUFpQixRQUFRLENBQUMsSUFBMUIsRUFEbUI7QUFBQSxDQVhyQixDQUFBOztBQUFBLEdB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3J6QkEsSUFBQSxjQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsTUFDQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRFQsQ0FBQTs7QUFBQSxNQUdN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S0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxHQUF4QyxDQURGLEVBRUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxHQUF4QyxDQUZGLEVBR0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxHQUF4QyxDQUhGLEVBSUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxHQUF4QyxDQUpGLEVBS0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxHQUF4QyxDQUxGLEVBTUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxRQUF4QyxDQU5GLEVBT0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxHQUF4QyxDQVBGLEVBUUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxHQUF4QyxDQVJGLEVBU0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxLQUF4QyxDQVRGLEVBVUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxLQUF4QyxDQVZGLEVBV0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF3QyxJQUF4QyxDQVhGLEVBWUUsS0FBSyxDQUFD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QyxHQUFHLENBQUMsQ0FBOUIsRUFBaUM7QUFBQSxRQUFDLE1BQUEsRUFBUyxhQUFBLEdBQWEsTUFBTSxDQUFDLE1BQXBCLEdBQTJCLEdBQTNCLEdBQThCLE1BQU0sQ0FBQyxFQUEvQztPQUFqQyxFQUF3RixNQUFNLENBQUMsU0FBL0YsRUFBMkcsR0FBM0csRUFBaUgsTUFBTSxDQUFDLFFBQXhILENBQXhDLENBREYsRUFFRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXlDLE1BQU0sQ0FBQyxLQUFoRCxDQUZGLEVBR0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixFQUFrQyxJQUFsQyxFQUF5QyxNQUFNLENBQUMsS0FBaEQsQ0FIRixFQUlFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsRUFBa0MsSUFBbEMsRUFBeUMsTUFBTSxDQUFDLE9BQWhELENBSkYsRUFLRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLEVBQWtDLElBQWxDLEVBQXlDLE1BQU0sQ0FBQyxNQUFoRCxDQUxGLEVBREc7SUFBQSxDQUZKLENBVkgsQ0FERixFQURNO0VBQUEsQ0FBUjtDQUZXLENBRmIsQ0FBQTs7QUFBQSxNQThCTSxDQUFDLE9BQVAsR0FBaUIsVUE5QmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5jZXJlYmVsbHVtID0gcmVxdWlyZSAnY2VyZWJlbGx1bSdcbkZhc3RDbGljayA9IHJlcXVpcmUgJ2Zhc3RjbGljaydcbm9wdGlvbnMgPSByZXF1aXJlICcuL29wdGlvbnMnXG5cbmFwcENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuYXBwSWQpXG5cbm9wdGlvbnMucmVuZGVyID0gKG9wdGlvbnM9e30pIC0+XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gXCJMaWlnYS5wdyAtICN7b3B0aW9ucy50aXRsZX1cIlxuICBSZWFjdC5yZW5kZXJDb21wb25lbnQob3B0aW9ucy5jb21wb25lbnQsIGFwcENvbnRhaW5lcilcblxub3B0aW9ucy5pbml0aWFsaXplID0gKGNsaWVudCkgLT5cbiAgRmFzdENsaWNrLmF0dGFjaChkb2N1bWVudC5ib2R5KVxuICAjUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpXG5cbmFwcCA9IGNlcmViZWxsdW0uY2xpZW50KG9wdGlvbnMpIiwibW9kdWxlLmV4cG9ydHMgPVxuICB1cmw6IGRvY3VtZW50LmxvY2F0aW9uLm9yaWdpbi5yZXBsYWNlKFwiNDAwMFwiLFwiODA4MFwiKVxuICAjdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiIiwiVGVhbXMgPVxuICBuYW1lc0FuZElkczpcbiAgICBcIsOEc3PDpHRcIjogXCJhc3NhdFwiXG4gICAgXCJCbHVlc1wiOiBcImJsdWVzXCJcbiAgICBcIkhJRktcIjogXCJoaWZrXCJcbiAgICBcIkhQS1wiOiBcImhwa1wiXG4gICAgXCJJbHZlc1wiOiBcImlsdmVzXCJcbiAgICBcIlNwb3J0XCI6IFwic3BvcnRcIlxuICAgIFwiSllQXCI6IFwianlwXCJcbiAgICBcIkthbFBhXCI6IFwia2FscGFcIlxuICAgIFwiS8OkcnDDpHRcIjogXCJrYXJwYXRcIlxuICAgIFwiTHVra29cIjogXCJsdWtrb1wiXG4gICAgXCJQZWxpY2Fuc1wiOiBcInBlbGljYW5zXCJcbiAgICBcIlNhaVBhXCI6IFwic2FpcGFcIlxuICAgIFwiVGFwcGFyYVwiOiBcInRhcHBhcmFcIlxuICAgIFwiVFBTXCI6IFwidHBzXCJcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBcIi9zdmcvI3tAbmFtZXNBbmRJZHNbbmFtZV19LnN2Z1wiXG5cbiAgaWRUb05hbWU6IChpZCkgLT5cbiAgICBpZHMgPSBPYmplY3Qua2V5cyhAbmFtZXNBbmRJZHMpLnJlZHVjZSAob2JqLCBuYW1lKSA9PlxuICAgICAgb2JqW0BuYW1lc0FuZElkc1tuYW1lXV0gPSBuYW1lXG4gICAgICBvYmpcbiAgICAsIHt9XG4gICAgaWRzW2lkXVxuXG4gIG5hbWVUb0lkOiAobmFtZSkgLT5cbiAgICBAbmFtZXNBbmRJZHNbbmFtZV1cblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIi8qKlxuICogQHByZXNlcnZlIEZhc3RDbGljazogcG9seWZpbGwgdG8gcmVtb3ZlIGNsaWNrIGRlbGF5cyBvbiBicm93c2VycyB3aXRoIHRvdWNoIFVJcy5cbiAqXG4gKiBAdmVyc2lvbiAxLjAuM1xuICogQGNvZGluZ3N0YW5kYXJkIGZ0bGFicy1qc3YyXG4gKiBAY29weXJpZ2h0IFRoZSBGaW5hbmNpYWwgVGltZXMgTGltaXRlZCBbQWxsIFJpZ2h0cyBSZXNlcnZlZF1cbiAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlIChzZWUgTElDRU5TRS50eHQpXG4gKi9cblxuLypqc2xpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuLypnbG9iYWwgZGVmaW5lLCBFdmVudCwgTm9kZSovXG5cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBmYXN0LWNsaWNraW5nIGxpc3RlbmVycyBvbiB0aGUgc3BlY2lmaWVkIGxheWVyLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuZnVuY3Rpb24gRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG9sZE9uQ2xpY2s7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgYSBjbGljayBpcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlZC5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cblxuXHQvKipcblx0ICogVGltZXN0YW1wIGZvciB3aGVuIGNsaWNrIHRyYWNraW5nIHN0YXJ0ZWQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSAwO1xuXG5cblx0LyoqXG5cdCAqIFRoZSBlbGVtZW50IGJlaW5nIHRyYWNrZWQgZm9yIGEgY2xpY2suXG5cdCAqXG5cdCAqIEB0eXBlIEV2ZW50VGFyZ2V0XG5cdCAqL1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXG5cblx0LyoqXG5cdCAqIFgtY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cblx0ICpcblx0ICogQHR5cGUgbnVtYmVyXG5cdCAqL1xuXHR0aGlzLnRvdWNoU3RhcnRYID0gMDtcblxuXG5cdC8qKlxuXHQgKiBZLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy50b3VjaFN0YXJ0WSA9IDA7XG5cblxuXHQvKipcblx0ICogSUQgb2YgdGhlIGxhc3QgdG91Y2gsIHJldHJpZXZlZCBmcm9tIFRvdWNoLmlkZW50aWZpZXIuXG5cdCAqXG5cdCAqIEB0eXBlIG51bWJlclxuXHQgKi9cblx0dGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyID0gMDtcblxuXG5cdC8qKlxuXHQgKiBUb3VjaG1vdmUgYm91bmRhcnksIGJleW9uZCB3aGljaCBhIGNsaWNrIHdpbGwgYmUgY2FuY2VsbGVkLlxuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudG91Y2hCb3VuZGFyeSA9IG9wdGlvbnMudG91Y2hCb3VuZGFyeSB8fCAxMDtcblxuXG5cdC8qKlxuXHQgKiBUaGUgRmFzdENsaWNrIGxheWVyLlxuXHQgKlxuXHQgKiBAdHlwZSBFbGVtZW50XG5cdCAqL1xuXHR0aGlzLmxheWVyID0gbGF5ZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiB0YXAodG91Y2hzdGFydCBhbmQgdG91Y2hlbmQpIGV2ZW50c1xuXHQgKlxuXHQgKiBAdHlwZSBudW1iZXJcblx0ICovXG5cdHRoaXMudGFwRGVsYXkgPSBvcHRpb25zLnRhcERlbGF5IHx8IDIwMDtcblxuXHRpZiAoRmFzdENsaWNrLm5vdE5lZWRlZChsYXllcikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBBbmRyb2lkIGRvbid0IGhhdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcblx0ZnVuY3Rpb24gYmluZChtZXRob2QsIGNvbnRleHQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBtZXRob2QuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTsgfTtcblx0fVxuXG5cblx0dmFyIG1ldGhvZHMgPSBbJ29uTW91c2UnLCAnb25DbGljaycsICdvblRvdWNoU3RhcnQnLCAnb25Ub3VjaE1vdmUnLCAnb25Ub3VjaEVuZCcsICdvblRvdWNoQ2FuY2VsJ107XG5cdHZhciBjb250ZXh0ID0gdGhpcztcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGNvbnRleHRbbWV0aG9kc1tpXV0gPSBiaW5kKGNvbnRleHRbbWV0aG9kc1tpXV0sIGNvbnRleHQpO1xuXHR9XG5cblx0Ly8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzIGFzIHJlcXVpcmVkXG5cdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdH1cblxuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuXHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XG5cdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XG5cblx0Ly8gSGFjayBpcyByZXF1aXJlZCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IEV2ZW50I3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAoZS5nLiBBbmRyb2lkIDIpXG5cdC8vIHdoaWNoIGlzIGhvdyBGYXN0Q2xpY2sgbm9ybWFsbHkgc3RvcHMgY2xpY2sgZXZlbnRzIGJ1YmJsaW5nIHRvIGNhbGxiYWNrcyByZWdpc3RlcmVkIG9uIHRoZSBGYXN0Q2xpY2tcblx0Ly8gbGF5ZXIgd2hlbiB0aGV5IGFyZSBjYW5jZWxsZWQuXG5cdGlmICghRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0dmFyIHJtdiA9IE5vZGUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xuXHRcdFx0XHRybXYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cm12LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG5cdFx0XHR2YXIgYWR2ID0gTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0XHRcdGlmICh0eXBlID09PSAnY2xpY2snKSB7XG5cdFx0XHRcdGFkdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjay5oaWphY2tlZCB8fCAoY2FsbGJhY2suaGlqYWNrZWQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmICghZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSwgY2FwdHVyZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBJZiBhIGhhbmRsZXIgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGUgZWxlbWVudCdzIG9uY2xpY2sgYXR0cmlidXRlLCBpdCB3aWxsIGJlIGZpcmVkIGJlZm9yZVxuXHQvLyBGYXN0Q2xpY2sncyBvbkNsaWNrIGhhbmRsZXIuIEZpeCB0aGlzIGJ5IHB1bGxpbmcgb3V0IHRoZSB1c2VyLWRlZmluZWQgaGFuZGxlciBmdW5jdGlvbiBhbmRcblx0Ly8gYWRkaW5nIGl0IGFzIGxpc3RlbmVyLlxuXHRpZiAodHlwZW9mIGxheWVyLm9uY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdC8vIEFuZHJvaWQgYnJvd3NlciBvbiBhdCBsZWFzdCAzLjIgcmVxdWlyZXMgYSBuZXcgcmVmZXJlbmNlIHRvIHRoZSBmdW5jdGlvbiBpbiBsYXllci5vbmNsaWNrXG5cdFx0Ly8gLSB0aGUgb2xkIG9uZSB3b24ndCB3b3JrIGlmIHBhc3NlZCB0byBhZGRFdmVudExpc3RlbmVyIGRpcmVjdGx5LlxuXHRcdG9sZE9uQ2xpY2sgPSBsYXllci5vbmNsaWNrO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdG9sZE9uQ2xpY2soZXZlbnQpO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRsYXllci5vbmNsaWNrID0gbnVsbDtcblx0fVxufVxuXG5cbi8qKlxuICogQW5kcm9pZCByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQW5kcm9pZCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQW5kcm9pZCcpID4gMDtcblxuXG4vKipcbiAqIGlPUyByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzSU9TID0gL2lQKGFkfGhvbmV8b2QpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDQgcmVxdWlyZXMgYW4gZXhjZXB0aW9uIGZvciBzZWxlY3QgZWxlbWVudHMuXG4gKlxuICogQHR5cGUgYm9vbGVhblxuICovXG52YXIgZGV2aWNlSXNJT1M0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyA0X1xcZChfXFxkKT8vKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8qKlxuICogaU9TIDYuMCgrPykgcmVxdWlyZXMgdGhlIHRhcmdldCBlbGVtZW50IHRvIGJlIG1hbnVhbGx5IGRlcml2ZWRcbiAqXG4gKiBAdHlwZSBib29sZWFuXG4gKi9cbnZhciBkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQgPSBkZXZpY2VJc0lPUyAmJiAoL09TIChbNi05XXxcXGR7Mn0pX1xcZC8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbi8qKlxuICogQmxhY2tCZXJyeSByZXF1aXJlcyBleGNlcHRpb25zLlxuICpcbiAqIEB0eXBlIGJvb2xlYW5cbiAqL1xudmFyIGRldmljZUlzQmxhY2tCZXJyeTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdCQjEwJykgPiAwO1xuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIG5hdGl2ZSBjbGljay5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgbmVlZHMgYSBuYXRpdmUgY2xpY2tcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0NsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgdG8gZGlzYWJsZWQgaW5wdXRzIChpc3N1ZSAjNjIpXG5cdGNhc2UgJ2J1dHRvbic6XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdGNhc2UgJ3RleHRhcmVhJzpcblx0XHRpZiAodGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnaW5wdXQnOlxuXG5cdFx0Ly8gRmlsZSBpbnB1dHMgbmVlZCByZWFsIGNsaWNrcyBvbiBpT1MgNiBkdWUgdG8gYSBicm93c2VyIGJ1ZyAoaXNzdWUgIzY4KVxuXHRcdGlmICgoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0LnR5cGUgPT09ICdmaWxlJykgfHwgdGFyZ2V0LmRpc2FibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0Y2FzZSAnbGFiZWwnOlxuXHRjYXNlICd2aWRlbyc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gKC9cXGJuZWVkc2NsaWNrXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBhIGdpdmVuIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIGNsaWNrIGludG8gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIG5hdGl2ZSBjbGljay5cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0ZvY3VzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXHRjYXNlICd0ZXh0YXJlYSc6XG5cdFx0cmV0dXJuIHRydWU7XG5cdGNhc2UgJ3NlbGVjdCc6XG5cdFx0cmV0dXJuICFkZXZpY2VJc0FuZHJvaWQ7XG5cdGNhc2UgJ2lucHV0Jzpcblx0XHRzd2l0Y2ggKHRhcmdldC50eXBlKSB7XG5cdFx0Y2FzZSAnYnV0dG9uJzpcblx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0Y2FzZSAnZmlsZSc6XG5cdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdGNhc2UgJ3JhZGlvJzpcblx0XHRjYXNlICdzdWJtaXQnOlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdG8gZm9jdXMgZGlzYWJsZWQgaW5wdXRzXG5cdFx0cmV0dXJuICF0YXJnZXQuZGlzYWJsZWQgJiYgIXRhcmdldC5yZWFkT25seTtcblx0ZGVmYXVsdDpcblx0XHRyZXR1cm4gKC9cXGJuZWVkc2ZvY3VzXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcblx0fVxufTtcblxuXG4vKipcbiAqIFNlbmQgYSBjbGljayBldmVudCB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLnNlbmRDbGljayA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQsIGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGNsaWNrRXZlbnQsIHRvdWNoO1xuXG5cdC8vIE9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzIGFjdGl2ZUVsZW1lbnQgbmVlZHMgdG8gYmUgYmx1cnJlZCBvdGhlcndpc2UgdGhlIHN5bnRoZXRpYyBjbGljayB3aWxsIGhhdmUgbm8gZWZmZWN0ICgjMjQpXG5cdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRhcmdldEVsZW1lbnQpIHtcblx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0fVxuXG5cdHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cblx0Ly8gU3ludGhlc2lzZSBhIGNsaWNrIGV2ZW50LCB3aXRoIGFuIGV4dHJhIGF0dHJpYnV0ZSBzbyBpdCBjYW4gYmUgdHJhY2tlZFxuXHRjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnRzJyk7XG5cdGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQodGhpcy5kZXRlcm1pbmVFdmVudFR5cGUodGFyZ2V0RWxlbWVudCksIHRydWUsIHRydWUsIHdpbmRvdywgMSwgdG91Y2guc2NyZWVuWCwgdG91Y2guc2NyZWVuWSwgdG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXHRjbGlja0V2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQgPSB0cnVlO1xuXHR0YXJnZXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG59O1xuXG5GYXN0Q2xpY2sucHJvdG90eXBlLmRldGVybWluZUV2ZW50VHlwZSA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vSXNzdWUgIzE1OTogQW5kcm9pZCBDaHJvbWUgU2VsZWN0IEJveCBkb2VzIG5vdCBvcGVuIHdpdGggYSBzeW50aGV0aWMgY2xpY2sgZXZlbnRcblx0aWYgKGRldmljZUlzQW5kcm9pZCAmJiB0YXJnZXRFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcblx0XHRyZXR1cm4gJ21vdXNlZG93bic7XG5cdH1cblxuXHRyZXR1cm4gJ2NsaWNrJztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgbGVuZ3RoO1xuXG5cdC8vIElzc3VlICMxNjA6IG9uIGlPUyA3LCBzb21lIGlucHV0IGVsZW1lbnRzIChlLmcuIGRhdGUgZGF0ZXRpbWUpIHRocm93IGEgdmFndWUgVHlwZUVycm9yIG9uIHNldFNlbGVjdGlvblJhbmdlLiBUaGVzZSBlbGVtZW50cyBkb24ndCBoYXZlIGFuIGludGVnZXIgdmFsdWUgZm9yIHRoZSBzZWxlY3Rpb25TdGFydCBhbmQgc2VsZWN0aW9uRW5kIHByb3BlcnRpZXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IHRoYXQgY2FuJ3QgYmUgdXNlZCBmb3IgZGV0ZWN0aW9uIGJlY2F1c2UgYWNjZXNzaW5nIHRoZSBwcm9wZXJ0aWVzIGFsc28gdGhyb3dzIGEgVHlwZUVycm9yLiBKdXN0IGNoZWNrIHRoZSB0eXBlIGluc3RlYWQuIEZpbGVkIGFzIEFwcGxlIGJ1ZyAjMTUxMjI3MjQuXG5cdGlmIChkZXZpY2VJc0lPUyAmJiB0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlICYmIHRhcmdldEVsZW1lbnQudHlwZS5pbmRleE9mKCdkYXRlJykgIT09IDAgJiYgdGFyZ2V0RWxlbWVudC50eXBlICE9PSAndGltZScpIHtcblx0XHRsZW5ndGggPSB0YXJnZXRFbGVtZW50LnZhbHVlLmxlbmd0aDtcblx0XHR0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGxlbmd0aCwgbGVuZ3RoKTtcblx0fSBlbHNlIHtcblx0XHR0YXJnZXRFbGVtZW50LmZvY3VzKCk7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciBhbmQgaWYgc28sIHNldCBhIGZsYWcgb24gaXQuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudXBkYXRlU2Nyb2xsUGFyZW50ID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBzY3JvbGxQYXJlbnQsIHBhcmVudEVsZW1lbnQ7XG5cblx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cblx0Ly8gQXR0ZW1wdCB0byBkaXNjb3ZlciB3aGV0aGVyIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgc2Nyb2xsYWJsZSBsYXllci4gUmUtY2hlY2sgaWYgdGhlXG5cdC8vIHRhcmdldCBlbGVtZW50IHdhcyBtb3ZlZCB0byBhbm90aGVyIHBhcmVudC5cblx0aWYgKCFzY3JvbGxQYXJlbnQgfHwgIXNjcm9sbFBhcmVudC5jb250YWlucyh0YXJnZXRFbGVtZW50KSkge1xuXHRcdHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXHRcdGRvIHtcblx0XHRcdGlmIChwYXJlbnRFbGVtZW50LnNjcm9sbEhlaWdodCA+IHBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHRcdHNjcm9sbFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gcGFyZW50RWxlbWVudDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fSB3aGlsZSAocGFyZW50RWxlbWVudCk7XG5cdH1cblxuXHQvLyBBbHdheXMgdXBkYXRlIHRoZSBzY3JvbGwgdG9wIHRyYWNrZXIgaWYgcG9zc2libGUuXG5cdGlmIChzY3JvbGxQYXJlbnQpIHtcblx0XHRzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3A7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxFdmVudFRhcmdldH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0ID0gZnVuY3Rpb24oZXZlbnRUYXJnZXQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIE9uIHNvbWUgb2xkZXIgYnJvd3NlcnMgKG5vdGFibHkgU2FmYXJpIG9uIGlPUyA0LjEgLSBzZWUgaXNzdWUgIzU2KSB0aGUgZXZlbnQgdGFyZ2V0IG1heSBiZSBhIHRleHQgbm9kZS5cblx0aWYgKGV2ZW50VGFyZ2V0Lm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuXHRcdHJldHVybiBldmVudFRhcmdldC5wYXJlbnROb2RlO1xuXHR9XG5cblx0cmV0dXJuIGV2ZW50VGFyZ2V0O1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIHN0YXJ0LCByZWNvcmQgdGhlIHBvc2l0aW9uIGFuZCBzY3JvbGwgb2Zmc2V0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciB0YXJnZXRFbGVtZW50LCB0b3VjaCwgc2VsZWN0aW9uO1xuXG5cdC8vIElnbm9yZSBtdWx0aXBsZSB0b3VjaGVzLCBvdGhlcndpc2UgcGluY2gtdG8tem9vbSBpcyBwcmV2ZW50ZWQgaWYgYm90aCBmaW5nZXJzIGFyZSBvbiB0aGUgRmFzdENsaWNrIGVsZW1lbnQgKGlzc3VlICMxMTEpLlxuXHRpZiAoZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGggPiAxKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHR0YXJnZXRFbGVtZW50ID0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCk7XG5cdHRvdWNoID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXTtcblxuXHRpZiAoZGV2aWNlSXNJT1MpIHtcblxuXHRcdC8vIE9ubHkgdHJ1c3RlZCBldmVudHMgd2lsbCBkZXNlbGVjdCB0ZXh0IG9uIGlPUyAoaXNzdWUgIzQ5KVxuXHRcdHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcblx0XHRpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgJiYgIXNlbGVjdGlvbi5pc0NvbGxhcHNlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdFx0Ly8gV2VpcmQgdGhpbmdzIGhhcHBlbiBvbiBpT1Mgd2hlbiBhbiBhbGVydCBvciBjb25maXJtIGRpYWxvZyBpcyBvcGVuZWQgZnJvbSBhIGNsaWNrIGV2ZW50IGNhbGxiYWNrIChpc3N1ZSAjMjMpOlxuXHRcdFx0Ly8gd2hlbiB0aGUgdXNlciBuZXh0IHRhcHMgYW55d2hlcmUgZWxzZSBvbiB0aGUgcGFnZSwgbmV3IHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kIGV2ZW50cyBhcmUgZGlzcGF0Y2hlZFxuXHRcdFx0Ly8gd2l0aCB0aGUgc2FtZSBpZGVudGlmaWVyIGFzIHRoZSB0b3VjaCBldmVudCB0aGF0IHByZXZpb3VzbHkgdHJpZ2dlcmVkIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgYWxlcnQuXG5cdFx0XHQvLyBTYWRseSwgdGhlcmUgaXMgYW4gaXNzdWUgb24gaU9TIDQgdGhhdCBjYXVzZXMgc29tZSBub3JtYWwgdG91Y2ggZXZlbnRzIHRvIGhhdmUgdGhlIHNhbWUgaWRlbnRpZmllciBhcyBhblxuXHRcdFx0Ly8gaW1tZWRpYXRlbHkgcHJlY2VlZGluZyB0b3VjaCBldmVudCAoaXNzdWUgIzUyKSwgc28gdGhpcyBmaXggaXMgdW5hdmFpbGFibGUgb24gdGhhdCBwbGF0Zm9ybS5cblx0XHRcdC8vIElzc3VlIDEyMDogdG91Y2guaWRlbnRpZmllciBpcyAwIHdoZW4gQ2hyb21lIGRldiB0b29scyAnRW11bGF0ZSB0b3VjaCBldmVudHMnIGlzIHNldCB3aXRoIGFuIGlPUyBkZXZpY2UgVUEgc3RyaW5nLFxuXHRcdFx0Ly8gd2hpY2ggY2F1c2VzIGFsbCB0b3VjaCBldmVudHMgdG8gYmUgaWdub3JlZC4gQXMgdGhpcyBibG9jayBvbmx5IGFwcGxpZXMgdG8gaU9TLCBhbmQgaU9TIGlkZW50aWZpZXJzIGFyZSBhbHdheXMgbG9uZyxcblx0XHRcdC8vIHJhbmRvbSBpbnRlZ2VycywgaXQncyBzYWZlIHRvIHRvIGNvbnRpbnVlIGlmIHRoZSBpZGVudGlmaWVyIGlzIDAgaGVyZS5cblx0XHRcdGlmICh0b3VjaC5pZGVudGlmaWVyICYmIHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMubGFzdFRvdWNoSWRlbnRpZmllcikge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGFzdFRvdWNoSWRlbnRpZmllciA9IHRvdWNoLmlkZW50aWZpZXI7XG5cblx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciAodXNpbmcgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoKSBhbmQ6XG5cdFx0XHQvLyAxKSB0aGUgdXNlciBkb2VzIGEgZmxpbmcgc2Nyb2xsIG9uIHRoZSBzY3JvbGxhYmxlIGxheWVyXG5cdFx0XHQvLyAyKSB0aGUgdXNlciBzdG9wcyB0aGUgZmxpbmcgc2Nyb2xsIHdpdGggYW5vdGhlciB0YXBcblx0XHRcdC8vIHRoZW4gdGhlIGV2ZW50LnRhcmdldCBvZiB0aGUgbGFzdCAndG91Y2hlbmQnIGV2ZW50IHdpbGwgYmUgdGhlIGVsZW1lbnQgdGhhdCB3YXMgdW5kZXIgdGhlIHVzZXIncyBmaW5nZXJcblx0XHRcdC8vIHdoZW4gdGhlIGZsaW5nIHNjcm9sbCB3YXMgc3RhcnRlZCwgY2F1c2luZyBGYXN0Q2xpY2sgdG8gc2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoYXQgbGF5ZXIgLSB1bmxlc3MgYSBjaGVja1xuXHRcdFx0Ly8gaXMgbWFkZSB0byBlbnN1cmUgdGhhdCBhIHBhcmVudCBsYXllciB3YXMgbm90IHNjcm9sbGVkIGJlZm9yZSBzZW5kaW5nIGEgc3ludGhldGljIGNsaWNrIChpc3N1ZSAjNDIpLlxuXHRcdFx0dGhpcy51cGRhdGVTY3JvbGxQYXJlbnQodGFyZ2V0RWxlbWVudCk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy50cmFja2luZ0NsaWNrID0gdHJ1ZTtcblx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSBldmVudC50aW1lU3RhbXA7XG5cdHRoaXMudGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XG5cblx0dGhpcy50b3VjaFN0YXJ0WCA9IHRvdWNoLnBhZ2VYO1xuXHR0aGlzLnRvdWNoU3RhcnRZID0gdG91Y2gucGFnZVk7XG5cblx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBCYXNlZCBvbiBhIHRvdWNobW92ZSBldmVudCBvYmplY3QsIGNoZWNrIHdoZXRoZXIgdGhlIHRvdWNoIGhhcyBtb3ZlZCBwYXN0IGEgYm91bmRhcnkgc2luY2UgaXQgc3RhcnRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUudG91Y2hIYXNNb3ZlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sIGJvdW5kYXJ5ID0gdGhpcy50b3VjaEJvdW5kYXJ5O1xuXG5cdGlmIChNYXRoLmFicyh0b3VjaC5wYWdlWCAtIHRoaXMudG91Y2hTdGFydFgpID4gYm91bmRhcnkgfHwgTWF0aC5hYnModG91Y2gucGFnZVkgLSB0aGlzLnRvdWNoU3RhcnRZKSA+IGJvdW5kYXJ5KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qKlxuICogVXBkYXRlIHRoZSBsYXN0IHBvc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCF0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIElmIHRoZSB0b3VjaCBoYXMgbW92ZWQsIGNhbmNlbCB0aGUgY2xpY2sgdHJhY2tpbmdcblx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudCAhPT0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCkgfHwgdGhpcy50b3VjaEhhc01vdmVkKGV2ZW50KSkge1xuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGZpbmQgdGhlIGxhYmVsbGVkIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBsYWJlbCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8SFRNTExhYmVsRWxlbWVudH0gbGFiZWxFbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxuICovXG5GYXN0Q2xpY2sucHJvdG90eXBlLmZpbmRDb250cm9sID0gZnVuY3Rpb24obGFiZWxFbGVtZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBGYXN0IHBhdGggZm9yIG5ld2VyIGJyb3dzZXJzIHN1cHBvcnRpbmcgdGhlIEhUTUw1IGNvbnRyb2wgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuY29udHJvbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGxhYmVsRWxlbWVudC5jb250cm9sO1xuXHR9XG5cblx0Ly8gQWxsIGJyb3dzZXJzIHVuZGVyIHRlc3QgdGhhdCBzdXBwb3J0IHRvdWNoIGV2ZW50cyBhbHNvIHN1cHBvcnQgdGhlIEhUTUw1IGh0bWxGb3IgYXR0cmlidXRlXG5cdGlmIChsYWJlbEVsZW1lbnQuaHRtbEZvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYWJlbEVsZW1lbnQuaHRtbEZvcik7XG5cdH1cblxuXHQvLyBJZiBubyBmb3IgYXR0cmlidXRlIGV4aXN0cywgYXR0ZW1wdCB0byByZXRyaWV2ZSB0aGUgZmlyc3QgbGFiZWxsYWJsZSBkZXNjZW5kYW50IGVsZW1lbnRcblx0Ly8gdGhlIGxpc3Qgb2Ygd2hpY2ggaXMgZGVmaW5lZCBoZXJlOiBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxhYmVsXG5cdHJldHVybiBsYWJlbEVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSksIGtleWdlbiwgbWV0ZXIsIG91dHB1dCwgcHJvZ3Jlc3MsIHNlbGVjdCwgdGV4dGFyZWEnKTtcbn07XG5cblxuLyoqXG4gKiBPbiB0b3VjaCBlbmQsIGRldGVybWluZSB3aGV0aGVyIHRvIHNlbmQgYSBjbGljayBldmVudCBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZm9yRWxlbWVudCwgdHJhY2tpbmdDbGlja1N0YXJ0LCB0YXJnZXRUYWdOYW1lLCBzY3JvbGxQYXJlbnQsIHRvdWNoLCB0YXJnZXRFbGVtZW50ID0gdGhpcy50YXJnZXRFbGVtZW50O1xuXG5cdGlmICghdGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBQcmV2ZW50IHBoYW50b20gY2xpY2tzIG9uIGZhc3QgZG91YmxlLXRhcCAoaXNzdWUgIzM2KVxuXHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XG5cdFx0dGhpcy5jYW5jZWxOZXh0Q2xpY2sgPSB0cnVlO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gUmVzZXQgdG8gcHJldmVudCB3cm9uZyBjbGljayBjYW5jZWwgb24gaW5wdXQgKGlzc3VlICMxNTYpLlxuXHR0aGlzLmNhbmNlbE5leHRDbGljayA9IGZhbHNlO1xuXG5cdHRoaXMubGFzdENsaWNrVGltZSA9IGV2ZW50LnRpbWVTdGFtcDtcblxuXHR0cmFja2luZ0NsaWNrU3RhcnQgPSB0aGlzLnRyYWNraW5nQ2xpY2tTdGFydDtcblx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcblxuXHQvLyBPbiBzb21lIGlPUyBkZXZpY2VzLCB0aGUgdGFyZ2V0RWxlbWVudCBzdXBwbGllZCB3aXRoIHRoZSBldmVudCBpcyBpbnZhbGlkIGlmIHRoZSBsYXllclxuXHQvLyBpcyBwZXJmb3JtaW5nIGEgdHJhbnNpdGlvbiBvciBzY3JvbGwsIGFuZCBoYXMgdG8gYmUgcmUtZGV0ZWN0ZWQgbWFudWFsbHkuIE5vdGUgdGhhdFxuXHQvLyBmb3IgdGhpcyB0byBmdW5jdGlvbiBjb3JyZWN0bHksIGl0IG11c3QgYmUgY2FsbGVkICphZnRlciogdGhlIGV2ZW50IHRhcmdldCBpcyBjaGVja2VkIVxuXHQvLyBTZWUgaXNzdWUgIzU3OyBhbHNvIGZpbGVkIGFzIHJkYXI6Ly8xMzA0ODU4OSAuXG5cdGlmIChkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQpIHtcblx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0Ly8gSW4gY2VydGFpbiBjYXNlcyBhcmd1bWVudHMgb2YgZWxlbWVudEZyb21Qb2ludCBjYW4gYmUgbmVnYXRpdmUsIHNvIHByZXZlbnQgc2V0dGluZyB0YXJnZXRFbGVtZW50IHRvIG51bGxcblx0XHR0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaC5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgdG91Y2gucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpIHx8IHRhcmdldEVsZW1lbnQ7XG5cdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHR9XG5cblx0dGFyZ2V0VGFnTmFtZSA9IHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRpZiAodGFyZ2V0VGFnTmFtZSA9PT0gJ2xhYmVsJykge1xuXHRcdGZvckVsZW1lbnQgPSB0aGlzLmZpbmRDb250cm9sKHRhcmdldEVsZW1lbnQpO1xuXHRcdGlmIChmb3JFbGVtZW50KSB7XG5cdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xuXHRcdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRhcmdldEVsZW1lbnQgPSBmb3JFbGVtZW50O1xuXHRcdH1cblx0fSBlbHNlIGlmICh0aGlzLm5lZWRzRm9jdXModGFyZ2V0RWxlbWVudCkpIHtcblxuXHRcdC8vIENhc2UgMTogSWYgdGhlIHRvdWNoIHN0YXJ0ZWQgYSB3aGlsZSBhZ28gKGJlc3QgZ3Vlc3MgaXMgMTAwbXMgYmFzZWQgb24gdGVzdHMgZm9yIGlzc3VlICMzNikgdGhlbiBmb2N1cyB3aWxsIGJlIHRyaWdnZXJlZCBhbnl3YXkuIFJldHVybiBlYXJseSBhbmQgdW5zZXQgdGhlIHRhcmdldCBlbGVtZW50IHJlZmVyZW5jZSBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IGNsaWNrIHdpbGwgYmUgYWxsb3dlZCB0aHJvdWdoLlxuXHRcdC8vIENhc2UgMjogV2l0aG91dCB0aGlzIGV4Y2VwdGlvbiBmb3IgaW5wdXQgZWxlbWVudHMgdGFwcGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIGNvbnRhaW5lZCBpbiBhbiBpZnJhbWUsIHRoZW4gYW55IGlucHV0dGVkIHRleHQgd29uJ3QgYmUgdmlzaWJsZSBldmVuIHRob3VnaCB0aGUgdmFsdWUgYXR0cmlidXRlIGlzIHVwZGF0ZWQgYXMgdGhlIHVzZXIgdHlwZXMgKGlzc3VlICMzNykuXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0cmFja2luZ0NsaWNrU3RhcnQpID4gMTAwIHx8IChkZXZpY2VJc0lPUyAmJiB3aW5kb3cudG9wICE9PSB3aW5kb3cgJiYgdGFyZ2V0VGFnTmFtZSA9PT0gJ2lucHV0JykpIHtcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcblx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XG5cblx0XHQvLyBTZWxlY3QgZWxlbWVudHMgbmVlZCB0aGUgZXZlbnQgdG8gZ28gdGhyb3VnaCBvbiBpT1MgNCwgb3RoZXJ3aXNlIHRoZSBzZWxlY3RvciBtZW51IHdvbid0IG9wZW4uXG5cdFx0Ly8gQWxzbyB0aGlzIGJyZWFrcyBvcGVuaW5nIHNlbGVjdHMgd2hlbiBWb2ljZU92ZXIgaXMgYWN0aXZlIG9uIGlPUzYsIGlPUzcgKGFuZCBwb3NzaWJseSBvdGhlcnMpXG5cdFx0aWYgKCFkZXZpY2VJc0lPUyB8fCB0YXJnZXRUYWdOYW1lICE9PSAnc2VsZWN0Jykge1xuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKGRldmljZUlzSU9TICYmICFkZXZpY2VJc0lPUzQpIHtcblxuXHRcdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgaWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgbGF5ZXIgdGhhdCB3YXMgc2Nyb2xsZWRcblx0XHQvLyBhbmQgdGhpcyB0YXAgaXMgYmVpbmcgdXNlZCB0byBzdG9wIHRoZSBzY3JvbGxpbmcgKHVzdWFsbHkgaW5pdGlhdGVkIGJ5IGEgZmxpbmcgLSBpc3N1ZSAjNDIpLlxuXHRcdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHRcdGlmIChzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50LmZhc3RDbGlja0xhc3RTY3JvbGxUb3AgIT09IHNjcm9sbFBhcmVudC5zY3JvbGxUb3ApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdC8vIFByZXZlbnQgdGhlIGFjdHVhbCBjbGljayBmcm9tIGdvaW5nIHRob3VnaCAtIHVubGVzcyB0aGUgdGFyZ2V0IG5vZGUgaXMgbWFya2VkIGFzIHJlcXVpcmluZ1xuXHQvLyByZWFsIGNsaWNrcyBvciBpZiBpdCBpcyBpbiB0aGUgd2hpdGVsaXN0IGluIHdoaWNoIGNhc2Ugb25seSBub24tcHJvZ3JhbW1hdGljIGNsaWNrcyBhcmUgcGVybWl0dGVkLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0YXJnZXRFbGVtZW50KSkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5zZW5kQ2xpY2sodGFyZ2V0RWxlbWVudCwgZXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIE9uIHRvdWNoIGNhbmNlbCwgc3RvcCB0cmFja2luZyB0aGUgY2xpY2suXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xufTtcblxuXG4vKipcbiAqIERldGVybWluZSBtb3VzZSBldmVudHMgd2hpY2ggc2hvdWxkIGJlIHBlcm1pdHRlZC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkZhc3RDbGljay5wcm90b3R5cGUub25Nb3VzZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBJZiBhIHRhcmdldCBlbGVtZW50IHdhcyBuZXZlciBzZXQgKGJlY2F1c2UgYSB0b3VjaCBldmVudCB3YXMgbmV2ZXIgZmlyZWQpIGFsbG93IHRoZSBldmVudFxuXHRpZiAoIXRoaXMudGFyZ2V0RWxlbWVudCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKGV2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFByb2dyYW1tYXRpY2FsbHkgZ2VuZXJhdGVkIGV2ZW50cyB0YXJnZXRpbmcgYSBzcGVjaWZpYyBlbGVtZW50IHNob3VsZCBiZSBwZXJtaXR0ZWRcblx0aWYgKCFldmVudC5jYW5jZWxhYmxlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBEZXJpdmUgYW5kIGNoZWNrIHRoZSB0YXJnZXQgZWxlbWVudCB0byBzZWUgd2hldGhlciB0aGUgbW91c2UgZXZlbnQgbmVlZHMgdG8gYmUgcGVybWl0dGVkO1xuXHQvLyB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLCBwcmV2ZW50IG5vbi10b3VjaCBjbGljayBldmVudHMgZnJvbSB0cmlnZ2VyaW5nIGFjdGlvbnMsXG5cdC8vIHRvIHByZXZlbnQgZ2hvc3QvZG91YmxlY2xpY2tzLlxuXHRpZiAoIXRoaXMubmVlZHNDbGljayh0aGlzLnRhcmdldEVsZW1lbnQpIHx8IHRoaXMuY2FuY2VsTmV4dENsaWNrKSB7XG5cblx0XHQvLyBQcmV2ZW50IGFueSB1c2VyLWFkZGVkIGxpc3RlbmVycyBkZWNsYXJlZCBvbiBGYXN0Q2xpY2sgZWxlbWVudCBmcm9tIGJlaW5nIGZpcmVkLlxuXHRcdGlmIChldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcblx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFBhcnQgb2YgdGhlIGhhY2sgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxuXHRcdFx0ZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBDYW5jZWwgdGhlIGV2ZW50XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIElmIHRoZSBtb3VzZSBldmVudCBpcyBwZXJtaXR0ZWQsIHJldHVybiB0cnVlIGZvciB0aGUgYWN0aW9uIHRvIGdvIHRocm91Z2guXG5cdHJldHVybiB0cnVlO1xufTtcblxuXG4vKipcbiAqIE9uIGFjdHVhbCBjbGlja3MsIGRldGVybWluZSB3aGV0aGVyIHRoaXMgaXMgYSB0b3VjaC1nZW5lcmF0ZWQgY2xpY2ssIGEgY2xpY2sgYWN0aW9uIG9jY3VycmluZ1xuICogbmF0dXJhbGx5IGFmdGVyIGEgZGVsYXkgYWZ0ZXIgYSB0b3VjaCAod2hpY2ggbmVlZHMgdG8gYmUgY2FuY2VsbGVkIHRvIGF2b2lkIGR1cGxpY2F0aW9uKSwgb3JcbiAqIGFuIGFjdHVhbCBjbGljayB3aGljaCBzaG91bGQgYmUgcGVybWl0dGVkLlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgcGVybWl0dGVkO1xuXG5cdC8vIEl0J3MgcG9zc2libGUgZm9yIGFub3RoZXIgRmFzdENsaWNrLWxpa2UgbGlicmFyeSBkZWxpdmVyZWQgd2l0aCB0aGlyZC1wYXJ0eSBjb2RlIHRvIGZpcmUgYSBjbGljayBldmVudCBiZWZvcmUgRmFzdENsaWNrIGRvZXMgKGlzc3VlICM0NCkuIEluIHRoYXQgY2FzZSwgc2V0IHRoZSBjbGljay10cmFja2luZyBmbGFnIGJhY2sgdG8gZmFsc2UgYW5kIHJldHVybiBlYXJseS4gVGhpcyB3aWxsIGNhdXNlIG9uVG91Y2hFbmQgdG8gcmV0dXJuIGVhcmx5LlxuXHRpZiAodGhpcy50cmFja2luZ0NsaWNrKSB7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIFZlcnkgb2RkIGJlaGF2aW91ciBvbiBpT1MgKGlzc3VlICMxOCk6IGlmIGEgc3VibWl0IGVsZW1lbnQgaXMgcHJlc2VudCBpbnNpZGUgYSBmb3JtIGFuZCB0aGUgdXNlciBoaXRzIGVudGVyIGluIHRoZSBpT1Mgc2ltdWxhdG9yIG9yIGNsaWNrcyB0aGUgR28gYnV0dG9uIG9uIHRoZSBwb3AtdXAgT1Mga2V5Ym9hcmQgdGhlIGEga2luZCBvZiAnZmFrZScgY2xpY2sgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2l0aCB0aGUgc3VibWl0LXR5cGUgaW5wdXQgZWxlbWVudCBhcyB0aGUgdGFyZ2V0LlxuXHRpZiAoZXZlbnQudGFyZ2V0LnR5cGUgPT09ICdzdWJtaXQnICYmIGV2ZW50LmRldGFpbCA9PT0gMCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cGVybWl0dGVkID0gdGhpcy5vbk1vdXNlKGV2ZW50KTtcblxuXHQvLyBPbmx5IHVuc2V0IHRhcmdldEVsZW1lbnQgaWYgdGhlIGNsaWNrIGlzIG5vdCBwZXJtaXR0ZWQuIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCB0aGUgY2hlY2sgZm9yICF0YXJnZXRFbGVtZW50IGluIG9uTW91c2UgZmFpbHMgYW5kIHRoZSBicm93c2VyJ3MgY2xpY2sgZG9lc24ndCBnbyB0aHJvdWdoLlxuXHRpZiAoIXBlcm1pdHRlZCkge1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdH1cblxuXHQvLyBJZiBjbGlja3MgYXJlIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cblx0cmV0dXJuIHBlcm1pdHRlZDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYWxsIEZhc3RDbGljaydzIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFzdENsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGxheWVyID0gdGhpcy5sYXllcjtcblxuXHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHR9XG5cblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQsIGZhbHNlKTtcblx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xuXHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMub25Ub3VjaENhbmNlbCwgZmFsc2UpO1xufTtcblxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgRmFzdENsaWNrIGlzIG5lZWRlZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cbiAqL1xuRmFzdENsaWNrLm5vdE5lZWRlZCA9IGZ1bmN0aW9uKGxheWVyKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG1ldGFWaWV3cG9ydDtcblx0dmFyIGNocm9tZVZlcnNpb247XG5cdHZhciBibGFja2JlcnJ5VmVyc2lvbjtcblxuXHQvLyBEZXZpY2VzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0b3VjaCBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRpZiAodHlwZW9mIHdpbmRvdy5vbnRvdWNoc3RhcnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBDaHJvbWUgdmVyc2lvbiAtIHplcm8gZm9yIG90aGVyIGJyb3dzZXJzXG5cdGNocm9tZVZlcnNpb24gPSArKC9DaHJvbWVcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcblxuXHRpZiAoY2hyb21lVmVyc2lvbikge1xuXG5cdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xuXG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XG5cdFx0XHRcdC8vIENocm9tZSBvbiBBbmRyb2lkIHdpdGggdXNlci1zY2FsYWJsZT1cIm5vXCIgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzg5KVxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIENocm9tZSAzMiBhbmQgYWJvdmUgd2l0aCB3aWR0aD1kZXZpY2Utd2lkdGggb3IgbGVzcyBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRcdFx0XHRpZiAoY2hyb21lVmVyc2lvbiA+IDMxICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBDaHJvbWUgZGVza3RvcCBkb2Vzbid0IG5lZWQgRmFzdENsaWNrIChpc3N1ZSAjMTUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdGlmIChkZXZpY2VJc0JsYWNrQmVycnkxMCkge1xuXHRcdGJsYWNrYmVycnlWZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcLyhbMC05XSopXFwuKFswLTldKikvKTtcblxuXHRcdC8vIEJsYWNrQmVycnkgMTAuMysgZG9lcyBub3QgcmVxdWlyZSBGYXN0Y2xpY2sgbGlicmFyeS5cblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vZnRsYWJzL2Zhc3RjbGljay9pc3N1ZXMvMjUxXG5cdFx0aWYgKGJsYWNrYmVycnlWZXJzaW9uWzFdID49IDEwICYmIGJsYWNrYmVycnlWZXJzaW9uWzJdID49IDMpIHtcblx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcblxuXHRcdFx0aWYgKG1ldGFWaWV3cG9ydCkge1xuXHRcdFx0XHQvLyB1c2VyLXNjYWxhYmxlPW5vIGVsaW1pbmF0ZXMgY2xpY2sgZGVsYXkuXG5cdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gd2lkdGg9ZGV2aWNlLXdpZHRoIChvciBsZXNzIHRoYW4gZGV2aWNlLXdpZHRoKSBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBJRTEwIHdpdGggLW1zLXRvdWNoLWFjdGlvbjogbm9uZSwgd2hpY2ggZGlzYWJsZXMgZG91YmxlLXRhcC10by16b29tIChpc3N1ZSAjOTcpXG5cdGlmIChsYXllci5zdHlsZS5tc1RvdWNoQWN0aW9uID09PSAnbm9uZScpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBGYXN0Q2xpY2sgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcbiAqL1xuRmFzdENsaWNrLmF0dGFjaCA9IGZ1bmN0aW9uKGxheWVyLCBvcHRpb25zKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0cmV0dXJuIG5ldyBGYXN0Q2xpY2sobGF5ZXIsIG9wdGlvbnMpO1xufTtcblxuXG5pZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblxuXHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdGRlZmluZShmdW5jdGlvbigpIHtcblx0XHQndXNlIHN0cmljdCc7XG5cdFx0cmV0dXJuIEZhc3RDbGljaztcblx0fSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gRmFzdENsaWNrLmF0dGFjaDtcblx0bW9kdWxlLmV4cG9ydHMuRmFzdENsaWNrID0gRmFzdENsaWNrO1xufSBlbHNlIHtcblx0d2luZG93LkZhc3RDbGljayA9IEZhc3RDbGljaztcbn1cbiIsInN0b3JlcyA9IHJlcXVpcmUgJy4vc3RvcmVzJ1xucm91dGVzID0gcmVxdWlyZSAnLi9yb3V0ZXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3RhdGljRmlsZXM6IF9fZGlybmFtZStcIi9wdWJsaWNcIlxuICBzdG9yZUlkOiBcInN0b3JlX3N0YXRlX2Zyb21fc2VydmVyXCJcbiAgYXBwSWQ6IFwiYXBwXCJcbiAgcm91dGVzOiByb3V0ZXNcbiAgc3RvcmVzOiBzdG9yZXMiLCJRID0gcmVxdWlyZSAncSdcblxuSW5kZXhWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9pbmRleCdcblRlYW1WaWV3ID0gcmVxdWlyZSAnLi92aWV3cy90ZWFtJ1xuUGxheWVyVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvcGxheWVyJ1xuR2FtZVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2dhbWUnXG5TY2hlZHVsZVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3NjaGVkdWxlJ1xuU3RhbmRpbmdzVmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvc3RhbmRpbmdzJ1xuU3RhdHNWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9zdGF0cydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBcIi9cIjogLT5cbiAgICBRLnNwcmVhZCBbXG4gICAgICBAc3RvcmUuZmV0Y2goXCJzdGFuZGluZ3NcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcInRlYW1zXCIpXG4gICAgICBAc3RvcmUuZmV0Y2goXCJzdGF0c1wiKVxuICAgIF0sIChzdGFuZGluZ3MsIHRlYW1zTGlzdCwgc3RhdHNMaXN0KSAtPlxuICAgICAgdGl0bGU6IFwiRXR1c2l2dVwiXG4gICAgICBjb21wb25lbnQ6IEluZGV4Vmlld1xuICAgICAgICBzdGFuZGluZ3M6IHN0YW5kaW5ncy50b0pTT04oKVxuICAgICAgICB0ZWFtczogdGVhbXNMaXN0LnRvSlNPTigpXG4gICAgICAgIHN0YXRzOiBzdGF0c0xpc3QudG9KU09OKClcblxuICBcIi9qb3Vra3VlZXQvOmlkLzphY3RpdmU/XCI6IChpZCwgYWN0aXZlKSAtPlxuICAgIFEuc3ByZWFkIFtcbiAgICAgIEBzdG9yZS5mZXRjaChcInN0YW5kaW5nc1wiKVxuICAgICAgQHN0b3JlLmZldGNoKFwidGVhbVwiLCBpZDogaWQpXG4gICAgXSwgKHN0YW5kaW5ncywgdGVhbSkgLT5cblxuICAgICAgc3ViVGl0bGUgPSBzd2l0Y2ggYWN0aXZlXG4gICAgICAgIHdoZW4gXCJwZWxhYWphdFwiIHRoZW4gXCJQZWxhYWphdFwiXG4gICAgICAgIHdoZW4gXCJ0aWxhc3RvdFwiIHRoZW4gXCJUaWxhc3RvdFwiXG4gICAgICAgIGVsc2UgXCJPdHRlbHVvaGplbG1hXCJcblxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0IC0gI3t0ZWFtLmdldChcImluZm9cIikubmFtZX0gLSAje3N1YlRpdGxlfVwiXG4gICAgICBjb21wb25lbnQ6IFRlYW1WaWV3XG4gICAgICAgIGlkOiBpZFxuICAgICAgICBzdGFuZGluZ3M6IHN0YW5kaW5ncy50b0pTT04oKVxuICAgICAgICB0ZWFtOiB0ZWFtLnRvSlNPTigpXG4gICAgICAgIGFjdGl2ZTogYWN0aXZlXG5cbiAgXCIvam91a2t1ZWV0LzppZC86cGlkLzpzbHVnXCI6IChpZCwgcGlkLCBzbHVnKSAtPlxuICAgIEBzdG9yZS5mZXRjaChcInRlYW1cIiwgaWQ6IGlkKS50aGVuICh0ZWFtKSAtPlxuICAgICAgcGxheWVyID0gdGVhbS5nZXQoXCJyb3N0ZXJcIikuZmlsdGVyKChwbGF5ZXIpIC0+XG4gICAgICAgIHBsYXllci5pZCBpcyBcIiN7cGlkfS8je3NsdWd9XCJcbiAgICAgIClbMF1cbiAgICAgIHRpdGxlOiBcIlBlbGFhamF0IC0gI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgY29tcG9uZW50OiBQbGF5ZXJWaWV3XG4gICAgICAgIGlkOiBwaWRcbiAgICAgICAgcGxheWVyOiBwbGF5ZXJcbiAgICAgICAgdGVhbTogdGVhbS50b0pTT04oKVxuXG4gIFwiL290dGVsdXRcIjogLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJzY2hlZHVsZVwiKS50aGVuIChzY2hlZHVsZSkgLT5cbiAgICAgIHRpdGxlOiBcIk90dGVsdW9oamVsbWFcIlxuICAgICAgY29tcG9uZW50OiBTY2hlZHVsZVZpZXdcbiAgICAgICAgc2NoZWR1bGU6IHNjaGVkdWxlLnRvSlNPTigpXG5cbiAgXCIvb3R0ZWx1dC86aWQvOmFjdGl2ZT9cIjogKGlkLCBhY3RpdmUpIC0+XG4gICAgUS5zcHJlYWQgW1xuICAgICAgQHN0b3JlLmZldGNoKFwic2NoZWR1bGVcIilcbiAgICAgIEBzdG9yZS5mZXRjaChcImdhbWVFdmVudHNcIiwgaWQ6IGlkKVxuICAgICAgQHN0b3JlLmZldGNoKFwiZ2FtZUxpbmV1cHNcIiwgaWQ6IGlkKVxuICAgICAgQHN0b3JlLmZldGNoKFwiZ2FtZVN0YXRzXCIsIGlkOiBpZClcbiAgICBdLCAoc2NoZWR1bGUsIGV2ZW50cywgbGluZVVwcywgc3RhdHMpIC0+XG4gICAgICBnYW1lID0gc2NoZWR1bGUuZmluZCAoZykgLT5cbiAgICAgICAgZy5pZCBpcyBpZFxuXG4gICAgICB0aXRsZTogXCJPdHRlbHUgLSAje2dhbWUuZ2V0KFwiaG9tZVwiKX0gdnMgI3tnYW1lLmdldChcImF3YXlcIil9XCJcbiAgICAgIGNvbXBvbmVudDogR2FtZVZpZXdcbiAgICAgICAgaWQ6IGlkXG4gICAgICAgIGdhbWU6IGdhbWUudG9KU09OKClcbiAgICAgICAgZXZlbnRzOiBldmVudHMudG9KU09OKClcbiAgICAgICAgbGluZVVwczogbGluZVVwcy50b0pTT04oKVxuICAgICAgICBzdGF0czogc3RhdHMudG9KU09OKClcbiAgICAgICAgYWN0aXZlOiBhY3RpdmVcblxuICBcIi9zYXJqYXRhdWx1a2tvXCI6IC0+XG4gICAgQHN0b3JlLmZldGNoKFwic3RhbmRpbmdzXCIpLnRoZW4gKHN0YW5kaW5ncykgLT5cbiAgICAgIHRpdGxlOiBcIlNhcmphdGF1bHVra29cIlxuICAgICAgY29tcG9uZW50OiBTdGFuZGluZ3NWaWV3XG4gICAgICAgIHN0YW5kaW5nczogc3RhbmRpbmdzLnRvSlNPTigpXG5cbiAgXCIvdGlsYXN0b3QvOmFjdGl2ZT9cIjogKGFjdGl2ZSkgLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJzdGF0c1wiKS50aGVuIChzdGF0cykgLT5cbiAgICAgIHRpdGxlOiBcIlRpbGFzdG90XCJcbiAgICAgIGNvbXBvbmVudDogU3RhdHNWaWV3XG4gICAgICAgIHN0YXRzOiBzdGF0cy50b0pTT04oKVxuICAgICAgICBhY3RpdmU6IGFjdGl2ZSIsIlRlYW1zQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vc3RvcmVzL3RlYW1zJ1xuU2NoZWR1bGVDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi9zdG9yZXMvc2NoZWR1bGUnXG5TdGFuZGluZ3NDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi9zdG9yZXMvc3RhbmRpbmdzJ1xuU3RhdHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL3N0YXRzJ1xuVGVhbU1vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvdGVhbSdcbkdhbWVFdmVudHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL2dhbWVfZXZlbnRzJ1xuR2FtZUxpbmV1cHNNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL2dhbWVfbGluZXVwcydcbkdhbWVTdGF0c01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvZ2FtZV9zdGF0cydcblxubW9kdWxlLmV4cG9ydHMgPVxuICB0ZWFtczogVGVhbXNDb2xsZWN0aW9uXG4gIHNjaGVkdWxlOiBTY2hlZHVsZUNvbGxlY3Rpb25cbiAgc3RhbmRpbmdzOiBTdGFuZGluZ3NDb2xsZWN0aW9uXG4gIHN0YXRzOiBTdGF0c01vZGVsXG4gIHRlYW06IFRlYW1Nb2RlbFxuICBnYW1lRXZlbnRzOiBHYW1lRXZlbnRzTW9kZWxcbiAgZ2FtZUxpbmV1cHM6IEdhbWVMaW5ldXBzTW9kZWxcbiAgZ2FtZVN0YXRzOiBHYW1lU3RhdHNNb2RlbCIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5HYW1lRXZlbnRzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwiZ2FtZXMvZXZlbnRzLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vZ2FtZXMvZXZlbnRzLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUV2ZW50cyIsIk1vZGVsID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLk1vZGVsXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5HYW1lTGluZXVwcyA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcImdhbWVzL2xpbmV1cHMvI3tAc3RvcmVPcHRpb25zLmlkfVwiXG5cbiAgdXJsOiAtPlxuICAgIFwiI3thcGlDb25maWcudXJsfS9nYW1lcy9saW5ldXBzLyN7QHN0b3JlT3B0aW9ucy5pZH0uanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUxpbmV1cHMiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuR2FtZVN0YXRzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwiZ2FtZXMvc3RhdHMvI3tAc3RvcmVPcHRpb25zLmlkfVwiXG5cbiAgdXJsOiAtPlxuICAgIFwiI3thcGlDb25maWcudXJsfS9nYW1lcy9zdGF0cy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGF0cyIsIkNvbGxlY3Rpb24gPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuQ29sbGVjdGlvblxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuU2NoZWR1bGUgPSBDb2xsZWN0aW9uLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInNjaGVkdWxlXCJcblxuICB1cmw6IFwiI3thcGlDb25maWcudXJsfS9zY2hlZHVsZS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlZHVsZSIsIkNvbGxlY3Rpb24gPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuQ29sbGVjdGlvblxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuU3RhbmRpbmdzID0gQ29sbGVjdGlvbi5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJzdGFuZGluZ3NcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3N0YW5kaW5ncy5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFuZGluZ3MiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuU3RhdHMgPSBNb2RlbC5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJzdGF0c1wiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vc3RhdHMuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdHMiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuVGVhbSA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInRlYW1zLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vdGVhbXMvI3tAc3RvcmVPcHRpb25zLmlkfS5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtIiwiQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5Db2xsZWN0aW9uXG5hcGlDb25maWcgPSByZXF1aXJlICcuLi9jb25maWcvYXBpJ1xuXG5UZWFtcyA9IENvbGxlY3Rpb24uZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwidGVhbXNcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L3RlYW1zLmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1zIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5cbntSb3csIENvbCwgTmF2LCBOYXZJdGVtLCBUYWJQYW5lfSA9IHJlcXVpcmUgJ3JlYWN0LWJvb3RzdHJhcCdcblxuR2FtZUV2ZW50cyA9IHJlcXVpcmUgJy4vZ2FtZV9ldmVudHMnXG5HYW1lTGluZXVwcyA9IHJlcXVpcmUgJy4vZ2FtZV9saW5ldXBzJ1xuR2FtZVN0YXRzID0gcmVxdWlyZSAnLi9nYW1lX3N0YXRzJ1xuXG5HYW1lID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcInN0YXRzXCJcbiAgICAgIHdoZW4gXCJrZXRqdXRcIiB0aGVuIFwibGluZVVwc1wiXG4gICAgICBlbHNlIFwiZXZlbnRzXCJcblxuICAgICMgY29uc29sZS5sb2cgXCJldmVudHNcIiwgQHByb3BzLmV2ZW50c1xuICAgICMgY29uc29sZS5sb2cgXCJsaW5ldXBzXCIsIEBwcm9wcy5saW5lVXBzXG4gICAgI2NvbnNvbGUubG9nIFwic3RhdHNcIiwgQHByb3BzLnN0YXRzXG4gICAgIyBjb25zb2xlLmxvZyBcImdhbWVcIiwgQHByb3BzLmdhbWVcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIChAcHJvcHMuZ2FtZS5ob21lKSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwge1wieHNcIjogKDQpLCBcIm1kXCI6ICg0KX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIChAcHJvcHMuZ2FtZS5ob21lU2NvcmUpLCBcIiAtIFwiLCAoQHByb3BzLmdhbWUuYXdheVNjb3JlKSksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLCBcIllsZWlzXFx1MDBmNlxcdTAwZTQ6IFwiLCAoQHByb3BzLmdhbWUuYXR0ZW5kYW5jZSkpXG4gICAgICAgICksXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHtcInhzXCI6ICg0KSwgXCJtZFwiOiAoNCl9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCAoQHByb3BzLmdhbWUuYXdheSkpXG4gICAgICAgIClcbiAgICAgICksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2LCB7XCJic1N0eWxlXCI6IFwidGFic1wiLCBcImFjdGl2ZUtleVwiOiAoYWN0aXZlS2V5KSwgXCJyZWZcIjogXCJ0YWJzXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dC8je0Bwcm9wcy5pZH1cIiwgXCJrZXlcIjogXCJldmVudHNcIn0sIFwiVGFwYWh0dW1hdFwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL290dGVsdXQvI3tAcHJvcHMuaWR9L3RpbGFzdG90XCIsIFwia2V5XCI6IFwic3RhdHNcIn0sIFwiVGlsYXN0b3RcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7QHByb3BzLmlkfS9rZXRqdXRcIiwgXCJrZXlcIjogXCJsaW5lVXBzXCJ9LCBcIktldGp1dFwiKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWItY29udGVudFwiLCBcInJlZlwiOiBcInBhbmVzXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcImV2ZW50c1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwiZXZlbnRzXCIpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdhbWVFdmVudHMsIHtcImV2ZW50c1wiOiAoQHByb3BzLmV2ZW50cyksIFwiZ2FtZVwiOiAoQHByb3BzLmdhbWUpfSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInN0YXRzXCIsIFwiYW5pbWF0aW9uXCI6IChmYWxzZSksIFwiYWN0aXZlXCI6IChhY3RpdmVLZXkgaXMgXCJzdGF0c1wiKX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHYW1lU3RhdHMsIHtcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMpfSlcbiAgICAgICAgKSxcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcImxpbmVVcHNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcImxpbmVVcHNcIil9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2FtZUxpbmV1cHMsIHtcImxpbmVVcHNcIjogKEBwcm9wcy5saW5lVXBzKX0pXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbiMge1JvdywgQ29sLCBOYXYsIE5hdkl0ZW0sIFRhYlBhbmV9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5HYW1lRXZlbnRzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBldmVudDogKGV2ZW50LCBpKSAtPlxuICAgIGlmIGV2ZW50LmhlYWRlclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAoZXZlbnQuaGVhZGVyKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJjb2xTcGFuXCI6IFwiM1wifSwgKGV2ZW50LmhlYWRlcikpXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAoaSl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKEBwcm9wcy5nYW1lW2V2ZW50LnRlYW1dKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoZXZlbnQudGltZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKGV2ZW50LnRleHQpKVxuICAgICAgKVxuXG4gIHJlbmRlcjogLT5cbiAgICBldmVudHMgPSBPYmplY3Qua2V5cyhAcHJvcHMuZXZlbnRzKS5yZWR1Y2UgKGFyciwga2V5KSA9PlxuICAgICAgYXJyLnB1c2ggaGVhZGVyOiBrZXlcbiAgICAgIGFyciA9IGFyci5jb25jYXQgQHByb3BzLmV2ZW50c1trZXldXG4gICAgICBhcnJcbiAgICAsIFtdXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgKGV2ZW50cy5tYXAgKGV2ZW50LCBpKSA9PlxuICAgICAgICAgIEBldmVudChldmVudCwgaSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lRXZlbnRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbiMge1JvdywgQ29sLCBOYXYsIE5hdkl0ZW0sIFRhYlBhbmV9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5HYW1lTGluZXVwcyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9XG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMaW5ldXBzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbiMge1JvdywgQ29sLCBOYXYsIE5hdkl0ZW0sIFRhYlBhbmV9ID0gcmVxdWlyZSAncmVhY3QtYm9vdHN0cmFwJ1xuXG5HYW1lU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgKEBwcm9wcy5zdGF0cy5ob21lLnBsYXllcnMubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFwiLCAocGxheWVyLmxhc3ROYW1lKSkpXG4gICAgICAgICksXG5cbiAgICAgICAgKEBwcm9wcy5zdGF0cy5ob21lLmdvYWxpZXMubWFwIChnb2FsaWUpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAoZ29hbGllLmlkKX0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoZ29hbGllLmZpcnN0TmFtZSksIFwiIFwiLCAoZ29hbGllLmxhc3ROYW1lKSkpXG4gICAgICAgIClcbiAgICAgICksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRhYmxlLCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LFxuICAgICAgICAoQHByb3BzLnN0YXRzLmF3YXkucGxheWVycy5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSlcbiAgICAgICAgKSxcblxuICAgICAgICAoQHByb3BzLnN0YXRzLmF3YXkuZ29hbGllcy5tYXAgKGdvYWxpZSkgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChnb2FsaWUuaWQpfSwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChnb2FsaWUuZmlyc3ROYW1lKSwgXCIgXCIsIChnb2FsaWUubGFzdE5hbWUpKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UZWFtc0xpc3RWaWV3ID0gcmVxdWlyZSAnLi90ZWFtc19saXN0J1xuVG9wU2NvcmVyc1ZpZXcgPSByZXF1aXJlICcuL3RvcF9zY29yZXJzJ1xuXG5JbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwianVtYm90cm9uXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMSwgbnVsbCwgXCJMaWlnYS5wd1wiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00ucCwgbnVsbCwgXCJMaWlnYW4gdGlsYXN0b3Qgbm9wZWFzdGkgamEgdmFpdmF0dG9tYXN0aVwiKVxuICAgICAgKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtc0xpc3RWaWV3LCB7XCJ0ZWFtc1wiOiAoQHByb3BzLnRlYW1zKX0pLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRvcFNjb3JlcnNWaWV3LCB7XCJzdGF0c1wiOiAoQHByb3BzLnN0YXRzKX0pXG5cbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gSW5kZXgiLCJUYWJsZVNvcnRNaXhpbiA9XG4gIHNldFNvcnQ6IChldmVudCkgLT5cbiAgICBzb3J0ID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuc29ydFxuICAgIGlmIHNvcnRcbiAgICAgIHR5cGUgPSBldmVudC50YXJnZXQuZGF0YXNldC50eXBlIG9yIFwiaW50ZWdlclwiXG4gICAgICBpZiBAc3RhdGUuc29ydEZpZWxkIGlzIHNvcnRcbiAgICAgICAgbmV3U29ydCA9IGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiIHRoZW4gXCJhc2NcIiBlbHNlIFwiZGVzY1wiXG4gICAgICAgIEBzZXRTdGF0ZSBzb3J0RGlyZWN0aW9uOiBuZXdTb3J0LCBzb3J0VHlwZTogdHlwZVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0U3RhdGUgc29ydEZpZWxkOiBzb3J0LCBzb3J0VHlwZTogdHlwZVxuXG4gIHNvcnQ6IChhLCBiKSAtPlxuICAgIHN3aXRjaCBAc3RhdGUuc29ydFR5cGVcbiAgICAgIHdoZW4gXCJpbnRlZ2VyXCJcbiAgICAgICAgaWYgQHN0YXRlLnNvcnREaXJlY3Rpb24gaXMgXCJkZXNjXCJcbiAgICAgICAgICBiW0BzdGF0ZS5zb3J0RmllbGRdIC0gYVtAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYVtAc3RhdGUuc29ydEZpZWxkXSAtIGJbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgIHdoZW4gXCJmbG9hdFwiXG4gICAgICAgIGFWYWx1ZSA9IE51bWJlcihhW0BzdGF0ZS5zb3J0RmllbGRdLnJlcGxhY2UoXCIlXCIsXCJcIikucmVwbGFjZSgvXFwsfFxcOi8sXCIuXCIpKSBvciAwXG4gICAgICAgIGJWYWx1ZSA9IE51bWJlcihiW0BzdGF0ZS5zb3J0RmllbGRdLnJlcGxhY2UoXCIlXCIsXCJcIikucmVwbGFjZSgvXFwsfFxcOi8sXCIuXCIpKSBvciAwXG4gICAgICAgIGlmIEBzdGF0ZS5zb3J0RGlyZWN0aW9uIGlzIFwiZGVzY1wiXG4gICAgICAgICAgYlZhbHVlIC0gYVZhbHVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhVmFsdWUgLSBiVmFsdWVcbiAgICAgIHdoZW4gXCJzdHJpbmdcIlxuICAgICAgICBpZiBAc3RhdGUuc29ydERpcmVjdGlvbiBpcyBcImRlc2NcIlxuICAgICAgICAgIGlmIGJbQHN0YXRlLnNvcnRGaWVsZF0gPCBhW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAtMVxuICAgICAgICAgIGVsc2UgaWYgYltAc3RhdGUuc29ydEZpZWxkXSA+IGFbQHN0YXRlLnNvcnRGaWVsZF1cbiAgICAgICAgICAgIDFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBhW0BzdGF0ZS5zb3J0RmllbGRdIDwgYltAc3RhdGUuc29ydEZpZWxkXVxuICAgICAgICAgICAgLTFcbiAgICAgICAgICBlbHNlIGlmIGFbQHN0YXRlLnNvcnRGaWVsZF0gPiBiW0BzdGF0ZS5zb3J0RmllbGRdXG4gICAgICAgICAgICAxXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgMFxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlU29ydE1peGluIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG57TmF2YmFyLCBOYXYsIE5hdkl0ZW0sIERyb3Bkb3duQnV0dG9uLCBNZW51SXRlbX0gPSByZXF1aXJlIFwicmVhY3QtYm9vdHN0cmFwXCJcblxuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbk5hdmlnYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBicmFuZCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImhyZWZcIjogXCIvXCIsIFwiY2xhc3NOYW1lXCI6IFwibmF2YmFyLWJyYW5kXCJ9LCBcIkxpaWdhXCIpXG5cbiAgICB0ZWFtcyA9XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duQnV0dG9uLCB7XCJ0aXRsZVwiOiBcIkpvdWtrdWVldFwifSxcbiAgICAgICAgKE9iamVjdC5rZXlzKFRlYW1zLm5hbWVzQW5kSWRzKS5tYXAgKG5hbWUpIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZW51SXRlbSwge1wia2V5XCI6IChUZWFtcy5uYW1lc0FuZElkc1tuYW1lXSksIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tUZWFtcy5uYW1lc0FuZElkc1tuYW1lXX1cIn0sIChuYW1lKSlcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgaWYgQHByb3BzLml0ZW1cbiAgICAgIGl0ZW0gPSBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogKEBwcm9wcy5pdGVtLnVybCl9LCAoQHByb3BzLml0ZW0udGl0bGUpKVxuXG4gICAgaWYgQHByb3BzLmRyb3Bkb3duXG4gICAgICBkcm9wZG93biA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcGRvd25CdXR0b24sIHtcInRpdGxlXCI6IChAcHJvcHMuZHJvcGRvd24udGl0bGUpfSxcbiAgICAgICAgKEBwcm9wcy5kcm9wZG93bi5pdGVtcy5tYXAgKGl0ZW0pIC0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZW51SXRlbSwge1wia2V5XCI6IChpdGVtLnRpdGxlKSwgXCJocmVmXCI6IChpdGVtLnVybCl9LCAoaXRlbS50aXRsZSkpXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLCB7XCJicmFuZFwiOiAoYnJhbmQpLCBcImZpeGVkVG9wXCI6IHRydWUsIFwidG9nZ2xlTmF2S2V5XCI6ICgwKX0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwge1wiY2xhc3NOYW1lXCI6IFwiYnMtbmF2YmFyLWNvbGxhcHNlXCIsIFwia2V5XCI6ICgwKSwgXCJyb2xlXCI6IFwibmF2aWdhdGlvblwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3NhcmphdGF1bHVra29cIn0sIFwiU2FyamF0YXVsdWtrb1wiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZJdGVtLCB7XCJocmVmXCI6IFwiL3RpbGFzdG90XCJ9LCBcIlRpbGFzdG90XCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvb3R0ZWx1dFwifSwgXCJPdHRlbHV0XCIpLFxuICAgICAgICAodGVhbXMpLFxuICAgICAgICAoaXRlbSksXG4gICAgICAgIChkcm9wZG93bilcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG5QbGF5ZXIgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBwbGF5ZXIgPSBAcHJvcHMucGxheWVyXG4gICAgdGVhbSA9IEBwcm9wcy50ZWFtXG5cbiAgICBwbGF5ZXJzID1cbiAgICAgIHRpdGxlOiBcIlBlbGFhamF0XCIsXG4gICAgICBpdGVtczogdGVhbS5yb3N0ZXIubWFwIChwbGF5ZXIpID0+XG4gICAgICAgIHRpdGxlOiBcIiN7cGxheWVyLmZpcnN0TmFtZX0gI3twbGF5ZXIubGFzdE5hbWV9XCJcbiAgICAgICAgdXJsOiBcIi9qb3Vra3VlZXQvI3t0ZWFtLmluZm8uaWR9LyN7cGxheWVyLmlkfVwiXG5cbiAgICAjIFRPRE86IGNoZWNrIHBvc2l0aW9uLCBLSCBPTCBWTCBQIHVzZSBwbGF5ZXJzLCBNViB1c2UgZ29hbGllc1xuICAgIHN0YXRzID0gdGVhbS5zdGF0cy5wbGF5ZXJzLmZpbHRlcigocGxheWVyKSA9PlxuICAgICAgW2lkLCBzbHVnXSA9IHBsYXllci5pZC5zcGxpdChcIi9cIilcbiAgICAgIGlkIGlzIEBwcm9wcy5pZFxuICAgIClbMF1cblxuICAgIGl0ZW0gPVxuICAgICAgdGl0bGU6IHRlYW0uaW5mby5uYW1lXG4gICAgICB1cmw6IHRlYW0uaW5mby51cmxcblxuICAgIGNvbnNvbGUubG9nIFwicGxheWVyXCIsIHBsYXllclxuICAgIGNvbnNvbGUubG9nIFwidGVhbVwiLCB0ZWFtXG4gICAgY29uc29sZS5sb2cgXCJzdGF0c1wiLCBzdGF0c1xuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJwbGF5ZXJcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIHtcImRyb3Bkb3duXCI6IChwbGF5ZXJzKSwgXCJpdGVtXCI6IChpdGVtKX0pLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMSwgbnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMiwgbnVsbCwgXCIjXCIsIChwbGF5ZXIubnVtYmVyKSwgXCIgXCIsIChwbGF5ZXIucG9zaXRpb24pKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDMsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImNsYXNzTmFtZVwiOiBcInRlYW0tbG9nbyAje3RlYW0uaW5mby5pZH1cIiwgXCJocmVmXCI6IFwiL2pvdWtrdWVldC8je3RlYW0uaW5mby5pZH1cIn0pLCBcIiBcIiwgKHRlYW0uaW5mby5uYW1lKSksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCwgKG1vbWVudChwbGF5ZXIuYmlydGhkYXkpLmZvcm1hdChcIkRELk1NLllZWVlcIikpKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCwgKHBsYXllci5oZWlnaHQpLCBcIiBjbVwiKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCwgKHBsYXllci53ZWlnaHQpLCBcIiBrZ1wiKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCwgKHBsYXllci5zaG9vdHMpKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGVcIn0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGhlYWQsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiT1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiU1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUlwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiK1xceDJGLVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiK1wiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiLVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiWVZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJBVk1cIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlZNXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJMXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJMJVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiQVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiQSVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkFpa2FcIilcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMuZ2FtZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5nb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLmFzc2lzdHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5wb2ludHMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5wZW5hbHRpZXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5wbHVzTWludXMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5wbHVzc2VzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMubWludXNlcykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLnBvd2VyUGxheUdvYWxzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMuc2hvcnRIYW5kZWRHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLndpbm5pbmdHb2FscykpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLnNob3RzKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMuc2hvb3RpbmdQZXJjZW50YWdlKSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoc3RhdHMuZmFjZW9mZnMpKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChzdGF0cy5mYWNlb2ZmUGVyY2VudGFnZSkpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHN0YXRzLnBsYXlpbmdUaW1lQXZlcmFnZSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblBsYXllclN0YXRzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTmFtZVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIkdhbWVzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiR29hbHNcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJBc3Npc3RzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUG9pbnRzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUGVuYWx0aWVzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiK1xceDJGLVwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKEBwcm9wcy5zdGF0cy5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je3BsYXllci50ZWFtSWR9LyN7cGxheWVyLmlkfVwifSwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcXHgzRVwiLCAocGxheWVyLmxhc3ROYW1lKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZ2FtZXMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdvYWxzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5hc3Npc3RzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wb2ludHMpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBlbmFsdGllcykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucGx1c01pbnVzKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UZWFtcyA9IHJlcXVpcmUgJy4uL2xpYi90ZWFtcydcblxubW9tZW50LmxvY2FsZSgnZmknXG4gIG1vbnRocyA6IFtcbiAgICBcIlRhbW1pa3V1XCIsIFwiSGVsbWlrdXVcIiwgXCJNYWFsaXNrdXVcIiwgXCJIdWh0aWt1dVwiLCBcIlRvdWtva3V1XCIsIFwiS2Vzw6RrdXVcIiwgXCJIZWluw6RrdXVcIixcbiAgICBcIkVsb2t1dVwiLCBcIlN5eXNrdXVcIiwgXCJMb2tha3V1XCIsIFwiTWFycmFza3V1XCIsIFwiSm91bHVrdXVcIlxuICBdXG4pXG5tb21lbnQubG9jYWxlKCdmaScpXG5cblNjaGVkdWxlID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIGdhbWVMaW5rOiAoZ2FtZSkgLT5cbiAgICBpZiBtb21lbnQoZ2FtZS5kYXRlKSA8IG1vbWVudCgpXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL290dGVsdXQvI3tnYW1lLmlkfVwifSwgKGdhbWUuaG9tZSksIFwiIC0gXCIsIChnYW1lLmF3YXkpKVxuICAgIGVsc2VcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnNwYW4sIG51bGwsIChnYW1lLmhvbWUpLCBcIiAtIFwiLCAoZ2FtZS5hd2F5KSlcblxuICBncm91cGVkU2NoZWR1bGU6IC0+XG4gICAgXy5jaGFpbihAcHJvcHMuc2NoZWR1bGUpLmdyb3VwQnkgKGdhbWUpIC0+XG4gICAgICBtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgcmVuZGVyOiAtPlxuICAgIG1vbnRobHlHYW1lcyA9IEBncm91cGVkU2NoZWR1bGUoKS5tYXAgKGdhbWVzLCBtb250aCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY29sU3BhblwiOiA0fSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKVxuICAgICAgICApLFxuICAgICAgICAoZ2FtZXMubWFwIChnYW1lKSA9PlxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKGdhbWUuaWQpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAobW9tZW50KGdhbWUuZGF0ZSkuZm9ybWF0KFwiREQuTU0uWVlZWVwiKSksIFwiIFwiLCAoZ2FtZS50aW1lKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKEBnYW1lTGluayhnYW1lKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChnYW1lLmhvbWVTY29yZSksIFwiLVwiLCAoZ2FtZS5hd2F5U2NvcmUpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoZ2FtZS5hdHRlbmRhbmNlKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbiwgbnVsbCksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmgxLCBudWxsLCBcIk90dGVsdW9oamVsbWFcIiksXG5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUtcmVzcG9uc2l2ZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgICAgICAobW9udGhseUdhbWVzKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UYWJsZVNvcnRNaXhpbiA9IHJlcXVpcmUgJy4vbWl4aW5zL3RhYmxlX3NvcnQnXG5UZWFtcyA9IHJlcXVpcmUgJy4uL2xpYi90ZWFtcydcblxuU3RhbmRpbmdzID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBtaXhpbnM6IFtUYWJsZVNvcnRNaXhpbl1cblxuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgc29ydEZpZWxkOiBcInBvaW50c1wiXG4gICAgc29ydERpcmVjdGlvbjogXCJkZXNjXCJcbiAgICBzb3J0VHlwZTogXCJpbnRlZ2VyXCJcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuXG4gIHJlbmRlcjogLT5cbiAgICBzdGFuZGluZ3MgPSBAcHJvcHMuc3RhbmRpbmdzLnNvcnQoQHNvcnQpLm1hcCAodGVhbSkgLT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKHRlYW0ubmFtZSl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0ucG9zaXRpb24pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmEsIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7VGVhbXMubmFtZVRvSWQodGVhbS5uYW1lKX1cIn0sICh0ZWFtLm5hbWUpKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5nYW1lcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0ud2lucykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0udGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHRlYW0ubG9zZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLmV4dHJhUG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5wb2ludHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLmdvYWxzRm9yKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAodGVhbS5nb2Fsc0FnYWluc3QpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLnBvd2VycGxheVBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLnNob3J0aGFuZFBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsICh0ZWFtLnBvaW50c1BlckdhbWUpKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZpZ2F0aW9uLCBudWxsKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiU2FyamF0YXVsdWtrb1wiKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoZWFkLCB7XCJjbGFzc05hbWVcIjogXCJzb3J0YWJsZS10aGVhZFwiLCBcIm9uQ2xpY2tcIjogKEBzZXRTb3J0KX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJnYW1lc1wifSwgXCJPXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwid2luc1wifSwgXCJWXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwidGllc1wifSwgXCJUXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwibG9zZXNcIn0sIFwiSFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImV4dHJhUG9pbnRzXCJ9LCBcIkxQXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwicG9pbnRzXCJ9LCBcIlBcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJnb2Fsc0ZvclwifSwgXCJUTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImdvYWxzQWdhaW5zdFwifSwgXCJQTVwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBvd2VycGxheVBlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJZViVcIiksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJzaG9ydGhhbmRQZXJjZW50YWdlXCIsIFwiZGF0YS10eXBlXCI6IFwiZmxvYXRcIn0sIFwiQVYlXCIpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwicG9pbnRzUGVyR2FtZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIlBcXHgyRk9cIilcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCBudWxsLFxuICAgICAgICAgICAgKHN0YW5kaW5ncylcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRpbmdzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG57VGFiUGFuZSwgTmF2LCBOYXZJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgcmVuZGVyOiAtPlxuICAgIGFjdGl2ZUtleSA9IHN3aXRjaCBAcHJvcHMuYWN0aXZlXG4gICAgICB3aGVuIFwibWFhbGl2YWhkaXRcIiB0aGVuIFwiZ29hbGllc1wiXG4gICAgICBlbHNlIFwicGxheWVyc1wiXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMSwgbnVsbCwgXCJUaWxhc3RvdFwiKSxcblxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwge1wiYnNTdHlsZVwiOiBcInRhYnNcIiwgXCJhY3RpdmVLZXlcIjogKGFjdGl2ZUtleSksIFwicmVmXCI6IFwidGFic1wifSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvdGlsYXN0b3RcIiwgXCJrZXlcIjogXCJwbGF5ZXJzXCJ9LCBcIktlbnR0XFx1MDBlNHBlbGFhamF0XCIpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi90aWxhc3RvdC9tYWFsaXZhaGRpdFwiLCBcImtleVwiOiBcImdvYWxpZXNcIn0sIFwiTWFhbGl2YWhkaXRcIilcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWItY29udGVudFwiLCBcInJlZlwiOiBcInBhbmVzXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwicGxheWVyc1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwicGxheWVyc1wiKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMiwgbnVsbCwgXCJLZW50dFxcdTAwZTRwZWxhYWphdFwiKVxuXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcImdvYWxpZXNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcImdvYWxpZXNcIil9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDIsIG51bGwsIFwiTWFhbGl2YWhkaXRcIilcblxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuUGxheWVyU3RhdHMgPSByZXF1aXJlICcuL3BsYXllcl9zdGF0cydcblRlYW1TY2hlZHVsZSA9IHJlcXVpcmUgJy4vdGVhbV9zY2hlZHVsZSdcblRlYW1TdGF0cyA9IHJlcXVpcmUgJy4vdGVhbV9zdGF0cydcblRlYW1Sb3N0ZXIgPSByZXF1aXJlICcuL3RlYW1fcm9zdGVyJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG57VGFiUGFuZSwgSnVtYm90cm9uLCBCdXR0b25Ub29sYmFyLCBCdXR0b24sIENvbCwgUm93LCBOYXYsIE5hdkl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApXG5cbiAgbG9nbzogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5pbWcsIHtcInNyY1wiOiAoVGVhbXMubG9nbyhAcHJvcHMudGVhbS5pbmZvLm5hbWUpKSwgXCJhbHRcIjogKEBwcm9wcy50ZWFtLmluZm8ubmFtZSl9KVxuXG4gIHJlbmRlcjogLT5cbiAgICBhY3RpdmVLZXkgPSBzd2l0Y2ggQHByb3BzLmFjdGl2ZVxuICAgICAgd2hlbiBcInBlbGFhamF0XCIgdGhlbiBcInBsYXllcnNcIlxuICAgICAgd2hlbiBcInRpbGFzdG90XCIgdGhlbiBcInN0YXRzXCJcbiAgICAgIGVsc2UgXCJzY2hlZHVsZVwiXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmlnYXRpb24sIG51bGwpLFxuXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRlYW1cIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSnVtYm90cm9uLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHtcInhzXCI6ICgxMiksIFwibWRcIjogKDYpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIChAbG9nbygpKSwgXCIgXCIsIChAcHJvcHMudGVhbS5pbmZvLm5hbWUpKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7XCJ4c1wiOiAoMTIpLCBcIm1kXCI6ICg2KX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGVhbS1jb250YWluZXJcIn0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udWwsIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5saSwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8ubG9uZ05hbWUpKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmxpLCBudWxsLCAoQHByb3BzLnRlYW0uaW5mby5hZGRyZXNzKSksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5saSwgbnVsbCwgKEBwcm9wcy50ZWFtLmluZm8uZW1haWwpKVxuICAgICAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwge1wiYnNTdHlsZVwiOiBcInByaW1hcnlcIiwgXCJic1NpemVcIjogXCJsYXJnZVwiLCBcImhyZWZcIjogKEBwcm9wcy50ZWFtLmluZm8udGlja2V0c1VybCl9LCBcIkxpcHV0XCIpLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtcImJzU3R5bGVcIjogXCJwcmltYXJ5XCIsIFwiYnNTaXplXCI6IFwibGFyZ2VcIiwgXCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLmxvY2F0aW9uVXJsKX0sIFwiSGFsbGluIHNpamFpbnRpXCIpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwgbnVsbCxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwge1wiYnNTdHlsZVwiOiBcInRhYnNcIiwgXCJhY3RpdmVLZXlcIjogKGFjdGl2ZUtleSksIFwicmVmXCI6IFwidGFic1wifSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMuaWR9XCIsIFwia2V5XCI6IFwic2NoZWR1bGVcIn0sIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMuaWR9L3RpbGFzdG90XCIsIFwia2V5XCI6IFwic3RhdHNcIn0sIFwiVGlsYXN0b3RcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHtcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLmlkfS9wZWxhYWphdFwiLCBcImtleVwiOiBcInBsYXllcnNcIn0sIFwiUGVsYWFqYXRcIilcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGFiLWNvbnRlbnRcIiwgXCJyZWZcIjogXCJwYW5lc1wifSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiUGFuZSwge1wia2V5XCI6IFwic2NoZWR1bGVcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInNjaGVkdWxlXCIpfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uaDEsIG51bGwsIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtU2NoZWR1bGUsIHtcInRlYW1cIjogKEBwcm9wcy50ZWFtKX0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJQYW5lLCB7XCJrZXlcIjogXCJzdGF0c1wiLCBcImFuaW1hdGlvblwiOiAoZmFsc2UpLCBcImFjdGl2ZVwiOiAoYWN0aXZlS2V5IGlzIFwic3RhdHNcIil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMSwgbnVsbCwgXCJUaWxhc3RvdFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtU3RhdHMsIHtcInRlYW1JZFwiOiAoQHByb3BzLmlkKSwgXCJzdGF0c1wiOiAoQHByb3BzLnRlYW0uc3RhdHMpfSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYlBhbmUsIHtcImtleVwiOiBcInBsYXllcnNcIiwgXCJhbmltYXRpb25cIjogKGZhbHNlKSwgXCJhY3RpdmVcIjogKGFjdGl2ZUtleSBpcyBcInBsYXllcnNcIil9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5oMSwgbnVsbCwgXCJQZWxhYWphdFwiKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZWFtUm9zdGVyLCB7XCJ0ZWFtSWRcIjogKEBwcm9wcy5pZCksIFwicm9zdGVyXCI6IChAcHJvcHMudGVhbS5yb3N0ZXIpfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcblxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5UZWFtUm9zdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBncm91cGVkUm9zdGVyOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnJvc3RlcilcbiAgICAuZ3JvdXBCeSgocGxheWVyKSAtPiBwbGF5ZXIucG9zaXRpb24pXG4gICAgLnJlZHVjZSgocmVzdWx0LCBwbGF5ZXIsIHBvc2l0aW9uKSAtPlxuICAgICAgZ3JvdXAgPSBzd2l0Y2hcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiS0hcIiwgXCJPTFwiLCBcIlZMXCJdLCBwb3NpdGlvbikgdGhlbiBcIkh5w7Zra8Okw6Rqw6R0XCJcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiT1BcIiwgXCJWUFwiXSwgcG9zaXRpb24pIHRoZW4gXCJQdW9sdXN0YWphdFwiXG4gICAgICAgIHdoZW4gcG9zaXRpb24gaXMgXCJNVlwiIHRoZW4gXCJNYWFsaXZhaGRpdFwiXG4gICAgICByZXN1bHRbZ3JvdXBdIHx8PSBbXVxuICAgICAgcmVzdWx0W2dyb3VwXS5wdXNoIHBsYXllclxuICAgICAgcmVzdWx0XG4gICAgLCB7fSlcblxuICByZW5kZXI6IC0+XG4gICAgZ3JvdXBzID0gQGdyb3VwZWRSb3N0ZXIoKS5tYXAgKHBsYXllcnMsIGdyb3VwKSA9PlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGJvZHksIHtcImtleVwiOiAoZ3JvdXApfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImNvbFNwYW5cIjogNn0sIChncm91cCkpXG4gICAgICAgICksXG4gICAgICAgIChfLmNoYWluKHBsYXllcnMpLmZsYXR0ZW4oKS5tYXAgKHBsYXllcikgPT5cbiAgICAgICAgICB1cmwgPSBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbUlkfS8je3BsYXllci5pZH1cIlxuICAgICAgICAgIHRpdGxlID0gXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiAodXJsKX0sICh0aXRsZSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5zdHJvbmcsIG51bGwsIChwbGF5ZXIubnVtYmVyKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuaGVpZ2h0KSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci53ZWlnaHQpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnNob290cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChtb21lbnQoKS5kaWZmKHBsYXllci5iaXJ0aGRheSwgXCJ5ZWFyc1wiKSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGhlYWQsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJOaW1pXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTnVtZXJvXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUGl0dXVzXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUGFpbm9cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJLXFx1MDBlNHRpc3l5c1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIklrXFx1MDBlNFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKGdyb3VwcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVJvc3RlciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5UZWFtU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGdhbWVMaW5rOiAoZ2FtZSkgLT5cbiAgICBpZiBtb21lbnQoZ2FtZS5kYXRlKSA8IG1vbWVudCgpXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL290dGVsdXQvI3tnYW1lLmlkfVwifSwgKEB0aXRsZVN0eWxlKGdhbWUuaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUoZ2FtZS5hd2F5KSkpXG4gICAgZWxzZVxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uc3BhbiwgbnVsbCwgKEB0aXRsZVN0eWxlKGdhbWUuaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUoZ2FtZS5hd2F5KSkpXG5cbiAgdGl0bGVTdHlsZTogKG5hbWUpIC0+XG4gICAgaWYgQHByb3BzLnRlYW0uaW5mby5uYW1lIGlzIG5hbWVcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnN0cm9uZywgbnVsbCwgKG5hbWUpKVxuICAgIGVsc2VcbiAgICAgIG5hbWVcblxuICBsb2dvOiAobmFtZSkgLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5pbWcsIHtcInNyY1wiOiAoVGVhbXMubG9nbyhuYW1lKSksIFwiYWx0XCI6IChuYW1lKX0pXG5cbiAgZ3JvdXBlZFNjaGVkdWxlOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnRlYW0uc2NoZWR1bGUpLmdyb3VwQnkgKGdhbWUpIC0+XG4gICAgICBtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgcmVuZGVyOiAtPlxuICAgIG1vbnRobHlHYW1lcyA9IEBncm91cGVkU2NoZWR1bGUoKS5tYXAgKGdhbWVzLCBtb250aCkgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCB7XCJrZXlcIjogKG1vbnRoKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJjb2xTcGFuXCI6IDR9LCAobW9tZW50KG1vbnRoLCBcIllZWVktTU1cIikuZm9ybWF0KFwiTU1NTVwiKSkpXG4gICAgICAgICksXG4gICAgICAgIChnYW1lcy5tYXAgKGdhbWUpID0+XG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAoZ2FtZS5pZCl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChtb21lbnQoZ2FtZS5kYXRlKS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSwgXCIgXCIsIChnYW1lLnRpbWUpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAoQGdhbWVMaW5rKGdhbWUpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKGdhbWUuaG9tZVNjb3JlKSwgXCItXCIsIChnYW1lLmF3YXlTY29yZSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChnYW1lLmF0dGVuZGFuY2UpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uZGl2LCB7XCJjbGFzc05hbWVcIjogXCJ0YWJsZS1yZXNwb25zaXZlXCJ9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGFibGUsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGVhbS1zY2hlZHVsZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGhlYWQsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJQXFx1MDBlNGl2XFx1MDBlNG1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiSm91a2t1ZWV0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiVHVsb3NcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJZbGVpc1xcdTAwZjZtXFx1MDBlNFxcdTAwZTRyXFx1MDBlNFwiKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgKG1vbnRobHlHYW1lcylcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5UYWJsZVNvcnRNaXhpbiA9IHJlcXVpcmUgJy4vbWl4aW5zL3RhYmxlX3NvcnQnXG5cblRlYW1TdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgbWl4aW5zOiBbVGFibGVTb3J0TWl4aW5dXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHNvcnRGaWVsZDogXCJwb2ludHNcIlxuICAgIHNvcnREaXJlY3Rpb246IFwiZGVzY1wiXG4gICAgc29ydFR5cGU6IFwiaW50ZWdlclwiXG5cbiAgcmVuZGVyOiAtPlxuICAgIHBsYXllcnMgPSBAcHJvcHMuc3RhdHMucGxheWVycy5zb3J0KEBzb3J0KS5tYXAgKHBsYXllcikgPT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCB7XCJrZXlcIjogKHBsYXllci5pZCl9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbUlkfS8je3BsYXllci5pZH1cIn0sIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmFzc2lzdHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucG9pbnRzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBlbmFsdGllcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wbHVzTWludXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucGx1c3NlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5taW51c2VzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnBvd2VyUGxheUdvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnNob3J0SGFuZGVkR29hbHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIud2lubmluZ0dvYWxzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnNob3RzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnNob290aW5nUGVyY2VudGFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5mYWNlb2ZmcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5mYWNlb2ZmUGVyY2VudGFnZSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wbGF5aW5nVGltZUF2ZXJhZ2UpKVxuICAgICAgKVxuXG4gICAgZ29hbGllcyA9IEBwcm9wcy5zdGF0cy5nb2FsaWVzLm1hcCAocGxheWVyKSA9PlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIHtcImtleVwiOiAocGxheWVyLmlkKX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je0Bwcm9wcy50ZWFtSWR9LyN7cGxheWVyLmlkfVwifSwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZ2FtZXMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIud2lucykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci50aWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmxvc3NlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5zYXZlcykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nb2Fsc0FsbG93ZWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuc2h1dG91dHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZ29hbHNBdmVyYWdlKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLnNhdmluZ1BlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuZ29hbHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5wb2ludHMpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucGVuYWx0aWVzKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLndpblBlcmNlbnRhZ2UpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIHtcImNvbFNwYW5cIjogMn0sIChwbGF5ZXIubWludXRlcykpXG4gICAgICApXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGhlYWQsIHtcImNsYXNzTmFtZVwiOiBcInNvcnRhYmxlLXRoZWFkXCIsIFwib25DbGlja1wiOiAoQHNldFNvcnQpfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJjb2xTcGFuXCI6IDE3fSwgXCJQZWxhYWphdFwiKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwibGFzdE5hbWVcIiwgXCJkYXRhLXR5cGVcIjogXCJzdHJpbmdcIn0sIFwiTmltaVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJnYW1lc1wifSwgXCJPXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImdvYWxzXCJ9LCBcIk1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiYXNzaXN0c1wifSwgXCJTXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBvaW50c1wifSwgXCJQXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBlbmFsdGllc1wifSwgXCJSXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBsdXNNaW51c1wifSwgXCIrXFx4MkYtXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInBsdXNzZXNcIn0sIFwiK1wiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJtaW51c2VzXCJ9LCBcIi1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwicG93ZXJQbGF5R29hbHNcIn0sIFwiWVZNXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInNob3J0SGFuZGVkR29hbHNcIn0sIFwiQVZNXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcIndpbm5pbmdHb2Fsc1wifSwgXCJWTVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJzaG90c1wifSwgXCJMXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcInNob290aW5nUGVyY2VudGFnZVwiLCBcImRhdGEtdHlwZVwiOiBcImZsb2F0XCJ9LCBcIkwlXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIHtcImRhdGEtc29ydFwiOiBcImZhY2VvZmZzXCJ9LCBcIkFcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiZGF0YS1zb3J0XCI6IFwiZmFjZW9mZlBlcmNlbnRhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJBJVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJkYXRhLXNvcnRcIjogXCJwbGF5aW5nVGltZUF2ZXJhZ2VcIiwgXCJkYXRhLXR5cGVcIjogXCJmbG9hdFwifSwgXCJBaWthXCIpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50Ym9keSwgbnVsbCxcbiAgICAgICAgICAocGxheWVycylcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGhlYWQsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwge1wiY29sU3BhblwiOiAxN30sIFwiTWFhbGl2YWhkaXRcIilcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRyLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiTmltaVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBPXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiVlwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlRcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJIXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiVE9cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJQTVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk5QXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiS0FcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJUJVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk1cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJTXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiUFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlJcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJWJVwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCB7XCJjb2xTcGFuXCI6IDJ9LCBcIkFpa2FcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRib2R5LCBudWxsLFxuICAgICAgICAgIChnb2FsaWVzKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1TdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5UZWFtc0xpc3QgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInJvd1wifSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLmRpdiwge1wiY2xhc3NOYW1lXCI6IFwidGVhbXMtdmlldyBjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMiBjb2wtbGctMTJcIn0sXG4gICAgICAgIChcbiAgICAgICAgICBAcHJvcHMudGVhbXMubWFwICh0ZWFtKSAtPlxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00uYSwge1wia2V5XCI6ICh0ZWFtLmlkKSwgXCJjbGFzc05hbWVcIjogXCJ0ZWFtLWxvZ28gI3t0ZWFtLmlkfVwiLCBcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7dGVhbS5pZH1cIn0pXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbXNMaXN0IiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRvcFNjb3JlcnMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5kaXYsIHtcImNsYXNzTmFtZVwiOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50YWJsZSwge1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGhlYWQsIG51bGwsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udHIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50aCwgbnVsbCwgXCJOaW1pXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGgsIG51bGwsIFwiT3R0ZWx1dFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIk1hYWxpdFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlN5XFx1MDBmNnRcXHUwMGY2dFwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRoLCBudWxsLCBcIlBpc3RlZXRcIilcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIChAcHJvcHMuc3RhdHMuc2NvcmluZ1N0YXRzLmZpbHRlciAocGxheWVyLCBpbmRleCkgLT5cbiAgICAgICAgICBpbmRleCA8IDIwXG4gICAgICAgIC5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ciwge1wia2V5XCI6IChwbGF5ZXIuaWQpfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS5hLCB7XCJocmVmXCI6IFwiL2pvdWtrdWVldC8je3BsYXllci50ZWFtSWR9LyN7cGxheWVyLmlkfVwifSwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRE9NLnRkLCBudWxsLCAocGxheWVyLmdhbWVzKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkRPTS50ZCwgbnVsbCwgKHBsYXllci5nb2FscykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5ET00udGQsIG51bGwsIChwbGF5ZXIucG9pbnRzKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVG9wU2NvcmVycyJdfQ==
