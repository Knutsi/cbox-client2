/**
 * Created by knut on 8/12/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class ActionSearchView extends SearchView {

        constructor(root, pc) {
            super(root, pc);

        }

        handleInput(input:string) {
            // for short string we just clear the results:
            if(input.length < 2) {
                this.resultRoot.innerHTML = "";
                return;
            }

            // get current storage:
            var pc = <PlayPageController>this.pageController;
            var storage = pc.storage;

            // get input:


            // find all actions matching the name:
            var found:Action[] = [];
            storage.actions.forEach( (action) => {

                // FIXME this should work on problem basis!

                // match query with title:
                if(action.title.toLowerCase().indexOf(input.toLowerCase()) != -1){

                    found.push(action);
                }
            });


            // render:
            this.resultRoot.innerHTML = "";
            found.forEach( (action) => {
                var div = document.createElement("div");
                var checkbox = document.createElement("input");
                var text = document.createTextNode(action.title);
                div.className = "searchresult";
                checkbox.setAttribute("type", "checkbox");

                div.appendChild(checkbox);
                div.appendChild(text);
                this.resultRoot.appendChild(div);
            });
        }
    }

    MVC.registerElementController("ActionSearchView", ActionSearchView);

}