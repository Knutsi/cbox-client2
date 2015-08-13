/**
 * Created by knut on 8/8/2015.
 */

/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class SearchView extends ElementController{

        title:HTMLHeadingElement;
        searchField:HTMLInputElement;
        resultRoot:HTMLDivElement;
        needsSearchUpdate:boolean = false;
        private lastQuery:string;

        constructor(root, pc) {
            super(root, pc);

            // register our components:
            this.title = <HTMLHeadingElement>this.player("headline");
            this.searchField = <HTMLInputElement>this.player("input");
            this.resultRoot = <HTMLDivElement>this.player("results");

            // multiple changes that will trigger update, but only once for a change:
            this.searchField.onkeydown = () => { this.triggerUpdate() };
            this.searchField.onchange = () => { this.triggerUpdate() };
            (<PlayPageController>pc).game.pendingActions.onChange.subscribe( () => { this.triggerUpdate() });

            // start timer that checks if input update is needed:
            setInterval( () => {
                if(this.needsSearchUpdate) {
                    this.handleInput(this.searchField.value);
                    this.lastQuery = this.searchField.value;
                    this.needsSearchUpdate = false;
                }

            }, 300);
        }


        triggerUpdate() {
            this.needsSearchUpdate = true;
        }


        handleInput(input:string) {
            throw "SearchView handleInput not overridden";
        }

    }

    MVC.registerElementController("SearchView", SearchView);
}