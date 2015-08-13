/**
 * Created by knut on 8/12/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class ActionSearchView extends SearchView {

        currentResults:ActionProblemPair[] = [];

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

            // find all actions matching the name:
            this.currentResults = [];
            pc.storage.actions.forEach( (action) => {

                // match query with title:
                if(action.title.toLowerCase().indexOf(input.toLowerCase()) != -1){

                    // create the action once for each problem it applies to:
                    pc.game.case_.problems.forEach( (existing_prob) => {

                        if(action.appliesTo(existing_prob))
                            this.currentResults.push(new ActionProblemPair(action, existing_prob));
                    } )

                }
            });

            this.render();
        }


        render() {
            var pc = <PlayPageController>this.pageController;

            // render:
            this.resultRoot.innerHTML = "";
            this.currentResults.forEach( (ap_pair) => {

                // elements:
                var div = document.createElement("div");
                var checkbox = document.createElement("input");
                var text_title = document.createTextNode(ap_pair.action.title);
                var text_problem = document.createTextNode(" (" + ap_pair.problem.title + ") ");
                div.className = "searchresult";
                checkbox.setAttribute("type", "checkbox");

                div.appendChild(checkbox);
                div.appendChild(text_title);

                if(ap_pair.problem.ident != "_root")
                    div.appendChild(text_problem);

                this.resultRoot.appendChild(div);

                // set checkbox state:
                checkbox.checked = pc.game.hasPending(ap_pair);

                // add checkbox events:
                checkbox.onchange = () => {
                    pc.game.togglePending(ap_pair);
                    checkbox.checked = pc.game.hasPending(ap_pair);
                }



            });
        }
    }

    MVC.registerElementController("ActionSearchView", ActionSearchView);

}