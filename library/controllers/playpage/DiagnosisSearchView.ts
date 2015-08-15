/**
 * Created by knut on 8/12/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class DiagnosisSearchView extends SearchView {

        currentResults:Diagnosis[] = [];

        constructor(root, pc) {
            super(root, pc);

        }

        focus() {
            this.searchField.focus();
            this.searchField.value = "";
            this.render();
        }

        handleInput(input:string) {

            //this.searchField.scrollIntoView(true);

            // for short string we just clear the results:
            if(input.length < 2) {
                this.resultRoot.innerHTML = "";
                return;
            }

            // get current storage:
            var pc = <PlayPageController>this.pageController;

            // find all actions matching the name:
            this.currentResults = [];
            pc.storage.diagnosis.forEach( (dx) => {

                // match query with title:
                if(dx.title.toLowerCase().indexOf(input.toLowerCase()) != -1
                    || dx.code.toLowerCase().indexOf(input.toLowerCase()) != -1)
                {
                    this.currentResults.push(dx);
                }
            });

            this.render();
        }


        render() {
            var pc = <PlayPageController>this.pageController;

            // render:
            this.resultRoot.innerHTML = "";
            this.currentResults.forEach( (dx) => {

                // elements:
                var div = document.createElement("div");
                var checkbox = document.createElement("input");
                var text_title = document.createTextNode(dx.displayName);
                div.className = "searchresult";
                checkbox.setAttribute("type", "checkbox");

                div.appendChild(checkbox);
                div.appendChild(text_title);

                this.resultRoot.appendChild(div);

                // set checkbox state:
                checkbox.checked = pc.game.hasPendingDx(dx);

                // add checkbox events:
                div.onclick = () => {
                    pc.game.togglePendingDx(dx);
                    checkbox.checked = pc.game.hasPendingDx(dx);
                    pc.screenManager.signalDataChanged();
                }

            });
        }
    }

    MVC.registerElementController("DiagnosisSearchView", DiagnosisSearchView);

}