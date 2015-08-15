/**
 * Created by knut on 8/15/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class ReactiveBackButton extends ElementController{

        buttonTextDiv:HTMLDivElement;
        targetScreen:string;

        constructor(root:HTMLDivElement, pc:PlayPageController) {
            super(root, pc);

            var screenManager = (<PlayPageController>this.pageController).screenManager;

            // grab target screen:
            this.targetScreen = this.root.getAttribute("data-cbox-target-screen");
            if(!this.targetScreen)
                throw "ReactiveBackButton missing attribute 'data-cbox-target-screen' on root element";

            // grab UI-elements:
            this.buttonTextDiv = this.player("button-text");

            // register events:
            this.root.onclick = () => { screenManager.activate(this.targetScreen) };
            screenManager.onSavedSignaled.subscribe( () => { this.handleDataSaved() } );
            screenManager.onDataChangeSignaled.subscribe( () => { this.handleDataChanged() } );
        }


        handleDataSaved() {
            this.buttonTextDiv.textContent = "Tilbake";
            this.root.classList.remove("data_changed_mark");

        }


        handleDataChanged() {
            this.buttonTextDiv.textContent = "OK";
            this.root.classList.add("data_changed_mark");
        }

    }

    MVC.registerElementController("ReactiveBackButton", ReactiveBackButton);
}