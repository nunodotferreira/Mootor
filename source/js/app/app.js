/**
 * @summary Mootor App plugin
 * @author Emilio Mariscal (emi420 [at] gmail.com)
 */

(function ($) {

    "use strict";

	// Constructors
	
    /**
     * App
     */  
    var App = function (options) {

        // Initialize instance
        App.init(options, this);

        return this;

    },
    
    View = function(options, appInstance) {
       
       var el = this.el = options.el,
           self = this,
           navItem;
                  
       if (options.el.id !== undefined) {
           this.id = options.el.id;
       }
       appInstance.views.push(this);
       
       // If a Nav object instance is passed
       // then get a navigation item by id and
       // define the onLoad method of that item
       // as a function that load this View instance
       if (options.nav !== undefined) {
           navItem = options.nav.get(this.id);
           navItem.onLoad = function() {
               if (self.cached === false) {
                   appInstance.load(this, {
                        nav: navItem
                   });
               }               
           }
       }
       
       this.cached = false;
        
       return this;
    };
          
    // Public instance prototypes
    
    /**
     * App
     */  
    App.prototype = {
    
        // Load a view
        load: function(view, options) {
        
          var callback = function() {},
              viewPath = "";
          
          if (options.callback !== undefined) {
              callback = options.callback; 

          } else {
 
              callback = function(response) {
             
                  if (view.cached !== true) {
                      view.cached = true;
    
                      // Load view into element

                      if (options.el !== undefined) {           
                          $(options.el).html(response);          
                      } else {                             
                          $(view.el).html(response);        
                      }
    
                  }
                 
                  // If a navItemInstance param is passed
                  // and that object has an onLoadCallback function
                  // then call that onLoadCallback function                     
                  if (options.nav !== undefined &&
                      typeof options.nav.onLoadCallback === "function") {                       
                      options.nav.onLoadCallback();                                     
                  }                           
              }

          }
          
          viewPath = this.path + "/" + view.id + "/" + view.id
                       
          // Template
          $.ajax({
                url: viewPath + ".html",
                callback: callback
          });
          
          // Controller
          $.require(viewPath + ".js");
        }
    };
      
    // Private static methods

    /**
     * App
     */     
    $.extend({
        _collection: [],
        
        init: function(options, self) {
            var i,
                moduleNamePosition,
                href = window.location.href,
                view,
                viewId,
                initView,
                appId;
                
                
            if (options.id !== undefined) {
                self.id = options.id;
            }
                            
            // Initialize path
            if (options.path !== undefined) {
                self.path = options.path;
            } else {
                self.path = "";
            }
                
            // Create views
            self.views = [];
            if (options.views !== undefined) {
                for (i = 0; i < options.views.length; i++) {
                    view = new View({
                        el: $("#" + options.views[i]).el,
                        id: options.views[i],
                        nav: options.nav
                    }, self);
                }
            }
            
            // Add to internal apps collection
            App._collection.push(self);
            
            // Load view by URL, example: /myapp/#myPanel2
            if ((moduleNamePosition = href.lastIndexOf("#")) > -1) {
                viewId = href.substring(moduleNamePosition, href.length).replace("#","");
                if (viewId !== undefined) {
                    options.nav.set(viewId);
                }               
            }
                    
        },
        
        get: function(id) {
            return App._collection.map(function(x) {
                if(x.id === id) { return x }
            })[0];
        }
        
    }, App);
    
    // Public constructors

    $.extend({
        app: function (options) {
            if (typeof options !== "object") {
                options = {};
            }
            options.el = this.el;
            
            switch (options.type) {
                default:
                    return new App(options);                
            }
        }
    }, $);
    
    $.extend({
        app: function(id) {
            return App.get(this.query);
        }
    });

}(Mootor));
