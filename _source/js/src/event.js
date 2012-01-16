/*
 * Mootor Events (coded by emi420@gmail.com)
 */

// Drag 

var Drag = function(element, callback, eventtype) {
    this.element = this;      
    this.startTouchX = 0;
    this.endTouchX = 0;
    this.lastTouchX = 0;
    this.callback = callback;
    element.addEventListener('touchstart', this, false);   
    element.addEventListener('touchmove', this, false);   
    element.addEventListener('touchend', this, false);   
}

Drag.prototype.handleEvent = function(e) {
    switch (e.type) {
        case 'touchstart':
            this.onTouchStart(e);
            break;
        case 'touchmove':
            this.onTouchMove(e);
            break;
        case 'touchend':
            this.onTouchEnd(e);
            break;
    }
}

Drag.prototype.onTouchStart = function(e) {
    this.lastTouchX = this.startTouchX = e.touches[0].clientX;
}

Drag.prototype.onTouchMove = function(e) {
    var distance = e.touches[0].clientX- this.lastTouchX; 
    this.lastTouchX = e.touches[0].clientX ;
    this.callback(distance);
}

Drag.prototype.onTouchEnd = function(e) {
    var distance = this.startTouchX - this.lastTouchX; 
    this.onDragEnd(distance);
}

// Orientation

var Orientation = function(element, callback) {    
    this.callback = callback;
    this.element = this;
    element.addEventListener("orientationchange", this, false);    
}

Orientation.prototype.handleEvent = function(e) {
    switch (e.type) {
        case 'orientationchange':
            this.onOrientationChange(e);
            break;
    }
}

Orientation.prototype.onOrientationChange = function() {
    this.callback();
}

Mootor.Event = {
    bind: function(el, eventtype, callback) {
        var fn = function() {};
        switch( eventtype ) {

            case 'drag':
                el.addEventListener('touchmove', function(e) { e.preventDefault() }, false);
                Mootor.listeners[el] = new Drag(el, callback) ;
                break;

            case 'dragEnd':
                Mootor.listeners[el].onDragEnd = callback;                
                //el.addEventListener('touchend', callback, false);
                break;

            case "orientationChange":
                new Orientation(el, callback);
                break;
        }
    }
}

Mootor.extend(Mootor.Event);

/*
 * Private
 */
 
Mootor.listeners = [];

Mootor.init_client_width = (function() { 
    return document.documentElement.clientWidth;    
}());

