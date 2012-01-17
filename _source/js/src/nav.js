/*
 * Mootor Navigation (coded by emi420@gmail.com)
 */

(function (Mootor) {

    "use strict";

    /*
     * Module dependencies
     */

    var Fx = Mootor.Fx,
        Event = Mootor.Event;

    Mootor.Nav = {

        panels: function () {

            /*
             * Navigation panels
             * 
             */

            var i = 0,
                clientWidth = Mootor.init_client_width,
                clientHeight =  Mootor.init_client_height,
                thresholdX =  (clientHeight / 4) * 3,
                panelCount = 0,
                panelsX = 0,
                blankPanel,
                current = 0,
                divPanels = this.el,
                panels = divPanels.getElementsByClassName("panel"),
                first = panels[0],

                // Create new panel
                create = function (options) {

                    var panel,
                        id = options.id;

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
                hideAll = function () {
                    panelCount = panels.length;
                    for (; i < panelCount; i += 1) {
                        Fx.hide(panels[i]);
                        if (clientHeight > panels[i].style.height) {
                            panels[i].style.height = clientHeight + "px";
                        }
                    }
                },

                // Reset panel width size 
                resetWidth = function (panel) {
                    panel.style.width = clientWidth + "px";
                },

                // Reset panel height size 
                resetHeight = function (panel) {
                    panel.style.height = clientHeight + "px";
                },

                // Reset panel left position 
                resetLeft = function (panel) {
                    panel.style.left = (clientWidth + 40) + "px";
                },

                // Reset panels container size and position
                resetContainer = function () {
                    divPanels.style.width = (clientWidth * 2) + "px";
                    divPanels.style.height = clientHeight + "px";
                    divPanels.style.left = (clientWidth * (-1) - 40) + "px";
                },

                // Reset panel size and position
                resetPanel = function (panel) {

                    resetWidth(panel);
                    resetHeight(panel);

                    if (panel === blankPanel) {

                        // right
                        //panel.style.left = 0 + "px";              
                        // left
                        panel.style.left = clientWidth * 2 + 80 + "px";

                    } else {
                        panel.style.left = clientWidth + 40 + "px";
                    }
                },

                // Move screen horizontally 
                moveScreenH = function (e) {

                    var distance = e.distance,
                        distanceFromOrigin = e.distanceFromOrigin;

                    // If position reach certain threshold,
                    // load new panel
                    if (distanceFromOrigin > thresholdX) {
                        console.log("Load panel!");
                    }

                     // New horizontal position
                    panelsX = panelsX + distance;
                    Fx.translateX(divPanels, panelsX);

                },

                // Load panel
                load = function (index) {

                    var panel = panels[current];

                    if (index < panels.length && index > -1) {

                        // hide current           
                        Fx.hide(panel);
                        current = index;

                        // set new current 
                        panel = panels[current];

                        // reset size, position
                        resetWidth(panel);
                        resetLeft(panel);

                        // show panel
                        Fx.show(panel);

                    }
                },

                // DragEnd event handler
                checkMove = function (distance) {

                    var maxdist = thresholdX;

                    if (distance > maxdist) {
                        load(current + 1);
                    } else if (distance < (-maxdist)) {
                        if (current > 0) {
                            load(current - 1);
                        }
                    }

                    moveScreenH({
                        distance: distance
                    });

                },

                // Reset panels sizes and positions
                resetAll = function () {

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

}(Mootor));
