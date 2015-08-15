/**
 * Created by knut on 8/8/2015.
 */

/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {


    export class TreatmentPickerView extends ElementController{

        listRoot:HTMLDivElement;
        clearButton:HTMLDivElement;

        constructor(root, pc) {
            super(root, pc);

            var pendingList = (<PlayPageController>this.pageController).game.pendingTreatments;

            this.listRoot = this.player("list");
            this.clearButton = this.player("clear");

            // events:
            pendingList.onChange.subscribe(() => { this.update() })

            this.clearButton.onclick = () => {
                pendingList.clearSelected();
            }
        }


        update() {
            var pendingList = (<PlayPageController>this.pageController).game.pendingTreatments;

            this.render(pendingList);
            this.updateButtons(pendingList);
        }


        render(pendingList:BindingList<TreatmentChoice>) {
            this.listRoot.innerHTML = "";

            pendingList.forEach((rx) => {
                var div = <HTMLDivElement>document.createElement("div");
                var checkbox = document.createElement("input");
                var modifier = <HTMLDivElement>document.createElement("div");
                var text = document.createTextNode(rx.displayName);

                div.className = "searchresult";
                modifier.className = "dosetoggle";
                checkbox.setAttribute("type", "checkbox");
                checkbox.checked = pendingList.selected.indexOf(rx) != -1;
                div.appendChild(checkbox);

                div.onclick = () => {
                    if(pendingList.selected.indexOf(rx) == -1)
                        pendingList.select(rx);
                    else
                        pendingList.deselect(rx);
                }

                // add modifiers:
                if(rx.treatment.modifiers) {
                    div.appendChild(modifier);
                    modifier.innerText = rx.modifier;

                    // add modifier toggle dynamics:
                    modifier.onclick = (ev) => {
                        rx.nextModifier();
                        modifier.innerText = rx.modifier;
                        ev.stopPropagation();
                    }
                }

                this.listRoot.appendChild(div);
                div.appendChild(text);
            });



        }


        updateButtons(pendingList:BindingList<TreatmentChoice>) {
            if(pendingList.selected.length <= 0)
                this.clearButton.classList.add("disabled");
            else
                this.clearButton.classList.remove("disabled");

        }

    }

    MVC.registerElementController("TreatmentPickerView", TreatmentPickerView);
}