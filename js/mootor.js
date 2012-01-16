(function(window) {

/* 
 *  Mootor Core (coded by emi420@gmail.com)
 */
 

// Main function, re-defines itself
var Mootor = (function(){  

	// Return new Mootor instance
	Mootor = function(query) {
		return new Mootor.fn(query);	
	}
	
	// All reusable functions must be in
	// the prototype
	Mootor.prototype = {
		
		// On element ready
        ready: function(callback) {
            Mootor.ready(callback, this.el);
        },

	}

	// On element ready
	Mootor.ready = function(fn, el) {
        if(el === window || el === window.document ) { 
            var ready = false;
            
            // Handler to check if the dom is full loaded
            handler = function(e) {                
                if (ready) {return;}
                if (e.type === "readystatechange" && window.document.readyState !== "complete") {return;}
                    fn.call(window.document);
                    ready = true;                        
            };
    
            // Add listeners for all common load events
            if (el.addEventListener) {
                el.addEventListener("DOM-ContentLoaded", handler, false);
                el.addEventListener("readystatechange", handler, false);
                el.addEventListener("load", handler, false);                            
            } // IE8 needs attachEvent() support
        } else {
            el.onload = fn;        
        }	
	}

	// Main constructor
    Mootor.fn = function(query) {
					
	        var q_type = typeof query;                    
	
	        if( q_type === "string" || q_type === "object" ) {
	        
	            var el; 
	            
	            // Get object from query
	                
	            switch(q_type) {
	    
	            case "string":
	
	                //console.log("FIXME CHECK: Query to the Dom *** EXPENSIVE")
	
	                if( query.indexOf('#') > -1 ) {
	                    query = query.replace("#","");
	                    el = document.getElementById(query);                
	                } else if( query.indexOf(".") > -1) {
	                    query = query.replace(".","");
	                    el = document.getElementsByClassName(query);   
	                }
	                break;
	    
	            case "object":
	                el = query;
	                break;
	            }             
	        }

			// Private element & query properties

			this.el = (function() { 
				return el 
			}()) ;

			this.query = (function() { 
				return query 
			}()) ;


			return this;		

		}	
	
	// Inheritance by copying properties
	Mootor.extend = function(obj) {
		for( i in obj ) {
			if( obj.hasOwnProperty(i) ) {
				Mootor.prototype[i] = obj[i];				
			}			
		}
	}
	
	// Prototypal inheritance	
	Mootor.fn.prototype = Mootor.prototype;
		
	return Mootor
	
}());




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

/* 
 *  Mootor Visual FX (coded by emi420@gmail.com)
 */
 
// Module dependencies
var Event = Mootor.Event;

// Max and Min font sizes
var max_font_size=105,
min_font_size=20;

Mootor.Fx = {

    // Show an element
    show: function(e) {
        //console.log(this)
        if( typeof e === "object") {
            e.style.display = "block";
        } else {
            this.el.style.display = "block";
        }
    },
    
    // Hide an element
    hide: function(e) {
        //console.log(this)
        if( typeof e === "object") {
            e.style.display = "block";
        } else {
            this.el.style.display = "none";
        }
    },
                    
    // Adjust font size relative to viewport size
    dynamicType: function() {

        // Update viewport font-size
       var updateSize = function() {               

            // This calc can be optimized
            var font_size = window.innerWidth / 10 + (window.innerHeight / 40);
            
            if( typeof(document.body) !== null) {
                if(font_size < max_font_size && font_size > min_font_size) {
                  document.body.style.fontSize=font_size + "%";                  
                } else if(font_size >= max_font_size) {
                  document.body.style.fontSize=max_font_size + "%";                  
                } else if(font_size <= min_font_size) {
                  document.body.style.fontSize=min_font_size + "%";                  
                }
            }

        };    

        // Add event listeners to update font size when user 
        // rotate device or resize window
        Event.bind(window, "orientationChange", updateSize);
        Event.bind(window, "resize", updateSize);
        
        // Initialize font-size
        updateSize();
 
     }  
}

Mootor.extend(Mootor.Fx);


/*
 * Mootor Navigation (coded by emi420@gmail.com)
 */

/*
 *  TODO: despues de actualizar Event tambien hay que
 *  actualizar Nav con el disenio de 
 *  http://code.google.com/intl/es-419/mobile/articles/webapp_fixed_ui.html
 */


/*
 * Module dependencies
 */ 

var Fx = Mootor.Fx,        
Event = Mootor.Event;

Mootor.Nav = {        
   
    panels: function() {

        /*
         * Navigation panels
         * 
         * TODO: 
         *       - if onDragEnd reach certain limit, load new content 
         *         in blank panel
         */

        var i = 0,
        clientWidth = 0,
        clientHeight = 0,
        panelCount = 0,
        panelsX = 0,
        blankPanel,
        first,
        current,
        panels,
        divPanels;            
        
        // All panels
        divPanels = this.el;        
        
        //console.log("FIXME CHECK: Query to the Dom *** EXPENSIVE");
                
        panels = divPanels.getElementsByClassName("panel");
        
        // First panel
        first = panels[0];
        current = 0;
        
        // Viewport sizes
        clientHeight = document.documentElement.clientHeight;
        clientWidth = document.documentElement.clientWidth;
        
        document.body.style.overflow = "hidden";

        // Create new panel
        var create = function(options) {

            var panel;                    
            var id = options.id;
                                
            // Create a div
            panel = document.createElement('div');
            panel.id = id;
            
            // Add viewport size to div
            panel.style.width = clientWidth + "px";
            panel.style.height = clientHeight + "px";               
            
            // Add panel to panels div
            divPanels.appendChild(panel);
            return panel;                    
        },
        
        // Hide all panels
        hideAll = function() {
            panelCount = panels.length;
            for(; i < panelCount ; i += 1) {
                Fx.hide(panels[i]);
                if(clientHeight > panels[i].style.height) {
                    panels[i].style.height = clientHeight + "px";
                }
            }
        },
        
        // Reset panel width size 
        resetWidth = function(panel) {
            panel.style.width = clientWidth + "px";                    
        },

        // Reset panel height size 
        resetHeight = function(panel) {
            panel.style.height = clientHeight + "px";                    
        },

        // Reset panel left position 
        resetLeft = function(panel) {
            panel.style.left = (clientWidth + 40) + "px";
        },

        // Reset panels container size and position
        resetContainer = function() {
            divPanels.style.width = (clientWidth * 2) + "px"; 
            divPanels.style.height = clientHeight + "px";
            divPanels.style.left = (clientWidth * (-1) - 40) + "px";                    
        },
        
        // Reset panel size and position
        resetPanel = function(panel) {

            var width = clientWidth,
            height = resetHeight;

            resetWidth( panel );
            resetHeight( panel );

            if( panel === blankPanel) {
                panel.style.left = "0px";              
            } else {
                panel.style.left = (clientWidth + 40) + "px";
            }
        },
        
        // Move screen horizontally 
        moveScreenH = function(distance) {
            
             //console.log(distance);

             // New horizontal position
             panelsX = panelsX + distance;  
                            
             // Apply 3d transform when its available
             // or use default CSS 'left' property
             divPanels.style.transitionProperty = "webkit-transform";
             if( divPanels.style.webkitTransform != "undefined" ) {
                 divPanels.style.webkitTransform = "translate3d(" + panelsX + "px,0, 0)";    
             } else {
                 divPanels.style.left = panelsX + "px";                                                      
             }
        },

        // Load panel
        load = function(index) {
            console.log("load " + index);                    
        },              

        // DragEnd event handler
        checkMove = function(distance) {
            
            var maxdist = ( clientHeight / 4 ) * 3;
            if( distance > maxdist ) {
                load(current + 1 );
            } else if (distance < -maxdist ) {
                if( current > 0 ) {
                    load( current - 1 );                        
                }
            }
            moveScreenH(distance);                                            
            
        },
        
        // Reset panels sizes and positions
        resetAll = function() {                    
                                
            // Current viewport
            clientHeight = document.documentElement.clientHeight;
            clientWidth = document.documentElement.clientWidth;
            
            // Reset current and blank panels
            resetPanel(panels[current]);
            resetPanel(blankPanel);                 

            // Reset panels container
            resetContainer();

        };
        
        /*
         *  Initialize panels
         */
           
        // Set document styles    
        document.body.style.overflow = "hidden";

        // Create a blank panel for load content
        blankPanel = create({
            id: "blank_panel"                    
        });
        
        // Reset and hide all panels
        resetAll();
        hideAll();                
                      
        // Custom events listeners
        Event.bind(document.body, "drag", moveScreenH);
        Event.bind(document.body, "dragEnd", checkMove);
        Event.bind(window, "orientationChange", resetAll);
        
        // Show first panel   
        Fx.show(first);  
           
    }
};   

Mootor.extend(Mootor.Nav);

// Go public!
window.$ = Mootor;

}(window));