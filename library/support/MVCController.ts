/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class MVCController {

        elementControllers: { [name: string]: any; } = { };
        pageController:PageController;
        ids:{ [id:string] : ElementController } = {};

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
                var id = element.getAttribute("id");

                console.log("-- MVC instancing: " + controller_name);

                // look up the controller name, and instance if it exists:
                var controller;
                var class_ = this.elementControllers[controller_name];
                if(class_)
                    controller = <ElementController>(new class_(element, this.pageController));
                else
                    throw "MVC could not instancer unregistered controller class: " + controller_name;

                // if it has an ID, keep that for later use:
                if(id)
                    this.ids[id] = controller;
            }

            // run page controller:
            pageController.run();
        }

    }


    export var MVC = new MVCController();
}