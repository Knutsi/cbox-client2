/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class TodoView extends ElementController{

        noSelectedMessage:HTMLDivElement;
        listRoot:HTMLDivElement;
        commitButton:HTMLDivElement;
        clearButton:HTMLDivElement;


        constructor(root, pc) {
            super(root, pc);

            var controller = (<PlayPageController>pc);

            // get elements:
            this.noSelectedMessage = <HTMLDivElement>this.player("no-selected-message");
            this.listRoot = <HTMLDivElement>this.player("list");
            this.commitButton = <HTMLDivElement>this.player("commit");
            this.clearButton = <HTMLDivElement>this.player("clear");

            // EVENTS:

            // re-render whenever the pending list changes:
            controller.game.pendingActions.onChange.subscribe(() => {
                this.update(<PlayPageController>this.pageController);
            })

            // commit actions when asked:
            this.commitButton.onclick = () => {
                if(controller.game.pendingActions.length > 0)
                    controller.game.commitActions();
            }

            // remove selected actions when asked:
            this.clearButton.onclick = () => { controller.game.pendingActions.clearSelected(); }
        }


        update() {
            var controller = <PlayPageController>this.pageController;
            this.render(controller);
            this.updateButtons(controller);
        }


        render(controller:PlayPageController) {

            // clear old:
            this.listRoot.innerHTML = "";

            // render
            var pending = controller.game.pendingActions;
            pending.forEach((ap_pair, i, selected) => {
                var div = document.createElement("div");
                div.className = "clickable";

                var checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.checked = selected;

                var text_name = document.createTextNode(ap_pair.displayName);

                this.listRoot.appendChild(div);
                div.appendChild(checkbox);
                div.appendChild(text_name);

                var handleCheck = () => {
                    if(selected)
                        pending.deselect(ap_pair);
                    else
                        pending.select(ap_pair)

                    this.update();
                }

                // add event handlers:
                checkbox.onchange = handleCheck;
                div.onclick = handleCheck;
            })
        }


        updateButtons(controller:PlayPageController) {
            // if no pending, show message:
            if(controller.game.pendingActions.length <= 0) {
                this.noSelectedMessage.style.display = "block";
                this.commitButton.classList.add("disabled");
            } else {
                this.noSelectedMessage.style.display = "none";
                this.commitButton.classList.remove("disabled");
            }


            // update remove select buttons:
            if(controller.game.pendingActions.selected.length <= 0) {
                this.clearButton.classList.add("disabled");
            } else {
                this.clearButton.classList.remove("disabled");
            }
        }

    }

    MVC.registerElementController("TodoView", TodoView);
}