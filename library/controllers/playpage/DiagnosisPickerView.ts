/**
 * Created by knut on 8/8/2015.
 */

/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {


    export class DiagnosisPickerView extends ElementController{

        listRoot:HTMLDivElement;
        clearButton:HTMLDivElement;

        constructor(root, pc) {
            super(root, pc);

            var pendingList = (<PlayPageController>this.pageController).game.pendingDiagnosis;

            this.listRoot = this.player("list");
            this.clearButton = this.player("clear");

            // events:
            pendingList.onChange.subscribe(() => { this.update() })

            this.clearButton.onclick = () => {
                pendingList.clearSelected();
            }
        }


        update() {
            var pendingList = (<PlayPageController>this.pageController).game.pendingDiagnosis;

            this.render(pendingList);
            this.updateButtons(pendingList);
        }


        render(pendingList:BindingList<Diagnosis>) {
            this.listRoot.innerHTML = "";

            pendingList.forEach((dx) => {
                var div = <HTMLDivElement>document.createElement("div");
                var checkbox = document.createElement("input");
                var text = document.createTextNode(dx.displayName);

                div.className = "searchresult";
                checkbox.setAttribute("type", "checkbox");

                checkbox.checked = pendingList.selected.indexOf(dx) != -1;

                div.onclick = () => {
                    if(pendingList.selected.indexOf(dx) == -1)
                        pendingList.select(dx);
                    else
                        pendingList.deselect(dx);
                }


                this.listRoot.appendChild(div);
                div.appendChild(checkbox);
                div.appendChild(text);
            });



        }


        updateButtons(pendingList:BindingList<Diagnosis>) {
            if(pendingList.selected.length <= 0)
                this.clearButton.classList.add("disabled");
            else
                this.clearButton.classList.remove("disabled");

        }

    }

    MVC.registerElementController("DiagnosisPickerView", DiagnosisPickerView);
}