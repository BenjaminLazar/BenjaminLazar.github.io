(function() {

  var isTouch = 'ontouchstart' in window,
    touchEvents = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend'
    },
    mouseEvents = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    evts = isTouch ? touchEvents : mouseEvents;

  function dispatchEvent (target, eventName, event) {
    var evt,
      touch = event;
    // Modern mobile browsers
    if (event.changedTouches) {
      touch = event.changedTouches[0];
    }
    // IE less than Edge
    else if (event.touches) {
      touch = event.touches[0];
    }
    // Modern browsers
    // try/catch is a Windows fix
    // https://github.com/davidtheclark/tap.js/commit/9d7638913be497278e173a4b14bea40f3891dbbd
    try {
      evt = new CustomEvent(eventName, {
        'detail': {
          'clientX': touch.clientX,
          'clientY': touch.clientY
        },
        cancelable: true,
        bubbles: true
      });
    } catch {
      evt = document.createEvent('MouseEvent');
      evt.initEvent(eventName, true, true);
    }
    target.dispatchEvent(evt);
  }

  function onStart (event) {
    var startTime = new Date().getTime(),
      touch = event,
      nrOfFingers = isTouch ? event.touches.length : 1,
      startX, startY;
    var hasMoved = false;

    // Modern mobile browsers
    if (event.changedTouches) {
      touch = event.changedTouches[0];
    }

    startX = touch.clientX;
    startY = touch.clientY;

    document.addEventListener(evts.move, onMove, false);
    document.addEventListener(evts.end, onEnd, false);

    function onMove (e) {
      if (!hasMoved) {
        hasMoved = true;
        nrOfFingers = isTouch ? e.touches.length : 1;
      }
      dispatchEvent(e.target, 'drag', e);
    }

    function onEnd (e) {
      var diffX, diffY, dirX, dirY, absDiffX, absDiffY,
        ele = e.target,
        changed = e,
        swipeEvent = 'swipe',
        endTime = new Date().getTime(),
        timeDiff = endTime - startTime;

      if (e.changedTouches) {
        changed = e.changedTouches[0];
      }

      if (hasMoved && nrOfFingers === 1 && timeDiff < 500) {
        diffX = changed.clientX-startX;
        diffY = changed.clientY-startY;
        dirX = diffX > 0 ? 'right' : 'left';
        dirY = diffY > 0 ? 'down' : 'up';
        absDiffX = Math.abs(diffX);
        absDiffY = Math.abs(diffY);

        // If moving finger far, it's not a swipe
        if ((absDiffX < 100 &&  absDiffX > 0) || (absDiffY < 100 &&  absDiffY > 0)) {
          if (absDiffX >= absDiffY) {
            swipeEvent += dirX;
          }
          else {
            swipeEvent += dirY;
          }
          dispatchEvent(ele, swipeEvent, e);
        }
      }

      document.removeEventListener(evts.move, onMove, false);
      document.removeEventListener(evts.end, onEnd, false);
    }
  }
  document.addEventListener(evts.start, onStart, false);

  // Return an object to access useful properties and methods
  window.touchy = {
    isTouch: isTouch,
    events: evts
  };
}());
