/**
 * @summary User Interface Mootor plugin
 */
 
/** 
 * @class
 * @name $ 
 */
 
(function ($) {

 "use strict";
 
    var Overlay = function() {

    },
    
    Tooltip = function(options) {
        var self = this;
        self.html = options.html;
        self.el = options.el;

        self.div = document.createElement("div");
        $(self.div).hide();
        $(self.div).setClass("moo_tooltip");
        $(self.div).html(this.html);
        
        document.body.appendChild(self.div)

        $(self.el).onTapEnd(function(event) {
            $(self.div).translateFx({
                x: event.e.clientX,
                y: event.e.clientY,
            }, {});
            $(self.div).show();
        })
        return self;
    },

     /**
     * Checkbox instance object
     *
     * @class
     * @name Checkbox
     * @return {Object} Checkbox object
     * @param {Object} options  Configuration options
     * @property {element} el Container element
     */
    Checkbox = function(options) {
        var check,
            input;
            
        this.el = options.el;
        this.el.innerHTML += "<b></b>";
        input = this.el.getElementsByTagName('input')[0];
        this.input = input;
        $(input).hide();

        check = $(this.el);
        check.setClass("moo_checkbox");
        check.onTapEnd(this);

        this.toggle(input.value);       

        this.init();        
        return this;
    },
    
    Select = function(options) {
        this.el = options.el;              
        this.init();        
        // TODO        
    },
    
    Input = function() {
        
    };
    
    // Prototype for all controls
    Input.prototype = {
        init: function() {
            this.stopEventPropagationAndPreventDefault();    
        },
        
        stopEventPropagationAndPreventDefault: function() {
            var callback = function(gesture) {
                gesture.e.stopPropagation();
                gesture.e.preventDefault();
            }
            $(this.el).onDragMove(callback);
            $(this.el).onDragEnd(callback);
            $(this.el).onTapEnd(callback);
        },
        
    }

    Checkbox.prototype = {
        /**
        * Toggle control
        *
        * @this {Checkbox}
        * @example var myCheck =  $("#checkbox1").checkbox();
        * myCheck.toggle();
        */
        toggle: function (value) {
            var el = $(this.el);

            if (value !== undefined) {
                this.value = parseInt(value);
            } else {
                if (this.value === 0) {
                    this.value = 1;
                } else {
                    this.value = 0;
                }                                
            }
            
            if (this.value === 0) {
                el.removeClass("on");
                el.setClass("off");                
            } else {
                el.removeClass("off");
                el.setClass("on");                
            }
            
            this.input.value = this.value;
        }, 
        handleGesture: function (gesture) {
            this.toggle();
        }
    };
    
    Overlay.prototype = {
        show: function() {
            $(this.el).show();
        },
        hide: function() {
            $(this.el).hide();
        },
    }
    
    Tooltip.prototype = {}

    $.extend(Overlay.prototype, Tooltip.prototype);
    $.extend(Input.prototype, Select.prototype);
    $.extend(Input.prototype, Checkbox.prototype);
    
    $.extend({
    
         ui: function(options) {
             options.el = this.el;
             switch (options.type) {
                 case "Checkbox":
                    return new Checkbox(options);
                    break;
                 case "Tooltip":
                    return new Tooltip(options);
                    break;
                 case "Select":
                    return new Select(options);
                    break;
             }
         }
    });
    

}($));

