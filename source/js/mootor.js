/**
* The Mootor module handles the creation of App and Namespaces
*
* @module Mootor
* @author Emilio Mariscal (emi420 [at] gmail.com)
* @author Martín Szyszlican (martinsz [at] gmail.com)
*/

(function () {

    "use strict";
    
    var Mootor,
        Event,
        Context,
        m;

    Mootor = {
        // code here
    };
    
    /**
    * The Event class defines and manage events
    *
    * @class Event
    * @private
    *  @module Mootor
    */
    Event = Mootor.Event = {
        
        /**
        * Events collection
        * @private
        */
        _collection: {},

        /**
        * Add event to collection
        * @private
        */
        on: function(event, callback) {
            if (Event._collection[event] === undefined) {
                Event._collection[event] = [];
            } 
            Event._collection[event].push(callback);
        },
        
        /**
        * Dispatch event
        * @private
        */
        dispatch: function(event, instance) {
            var i,
                count = 0,
                callbacks = Event._collection[event],
                callback;
                
            if (callbacks !== undefined) {
                count = callbacks.length ;
            }
            for (i = 0; i < count; i++) {
                (function(callback) {
                    window.setTimeout(function() {
                        callback(instance);
                    }, 1)
                }(callbacks[i]));
            }
        }

    };

    Context = Mootor.Context = function() {
        /**
        * Information about the context of the application (ej: device's viewport)
        * @class Context
        * @return object
        * @static
        */
        return ({

            /**
            * Browser info
            * @property browser
            * @type string
            */            
            browser: navigator.userAgent.toLowerCase(),

            /**
            * Viewport info
            * @property viewport
            * @type object
            */            
            viewport: {},

            /**
            * Device info
            * @property device 
            * @type object
            */            
            device: {
                /**
                * Vendor info
                * @property vendor
                * @type string
                */            
                vendor: navigator.vendor.toLowerCase(),
                
            },
            
            cordova: (window.Cordova !== undefined),
            phonegap: (window.PhoneGap !== undefined),

        });
    };

    // Static global objects
    
    m = {
        /**
        * m public global object
        * @class window.m
        * @static
        */
        
        /**
        * @property context
        * @type Context
        */
        context: new Context()
        
    };

    // Make it public!
    
    window.Mootor = Mootor;
    window.m = m;

}());
