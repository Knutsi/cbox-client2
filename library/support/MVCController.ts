/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class MVCController {

        elementControllers: { [name: string]: any; } = { };
        pageController:PageController;

        constructor() {
            console.log("MVC controller created");
        }

        /*
         * Registers a controller that can be instanced from the class.
         * */
        registerElementController(name, controller) {

            this.elementControllers[name] = controller;
        }

        /**
         * Loads and instances elements from a HTML page.  This should be called from the
         * onload event to ensure most elements have been loaded.
         * */
        load(pageController:PageController) {
            console.log("MVC loading");

            // instance the page controller:
            this.pageController = pageController;
            window['PageController'] = this.pageController; // also add to window

            /// instance all elements:
            var elements = document.querySelectorAll("[data-cbox-controller]");
            for(var i in elements) {
                var element = <HTMLDivElement>elements.item(i);
                var controller_name = element.getAttribute("data-cbox-controller");

                console.log("-- MVC instancing: " + controller_name);

                var class_ = this.elementControllers[controller_name];
                if(class_)
                    var controller = <ElementController>(new class_(element, this.pageController));
                else
                    throw "MVC could not instancer unregistered controller class: " + controller_name;

            }

            // run page controller:
            pageController.run();
        }

    }


    export var MVC = new MVCController();
}