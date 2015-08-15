/**
 * Created by knut on 8/12/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class TreatmentSearchView extends SearchView {

        currentResults:TreatmentChoice[] = [];

        constructor(root, pc) {
            super(root, pc);

        }

        focus() {
            this.searchField.focus();
            this.render();
        }

        handleInput(input:string) {

            // for short string we just clear the results:
            if(input.length < 2) {
                this.resultRoot.innerHTML = "";
                return;
            }

            //this.searchField.scrollIntoView(true);

            // get current storage:
            var pc = <PlayPageController>this.pageController;

            // find all actions matching the name:
            this.currentResults = [];
            pc.storage.treatments.forEach( (rx) => {

                // match query with title:
                if(rx.title.toLowerCase().indexOf(input.toLowerCase()) != -1)
                {
                    this.currentResults.push(new TreatmentChoice(rx));
                }
            });

            this.render();
        }


        render() {
            var pc = <PlayPageController>this.pageController;

            // render:
            this.resultRoot.innerHTML = "";
            this.currentResults.forEach( (rx) => {

                this.resultRoot.appendChild(this.renderAction(rx, pc));

            });
        }

        renderAction(rx:TreatmentChoice, pc:PlayPageController):HTMLDivElement {
            // elements:
            var div = document.createElement("div");
            var modifier = document.createElement("div");
            var checkbox = document.createElement("input");
            var text_title = document.createTextNode(rx.displayName);

            div.className = "searchresult";
            modifier.className = "dosetoggle";
            checkbox.setAttribute("type", "checkbox");
            div.appendChild(checkbox);
            
            // add modifiers:
            if(rx.treatment.modifiers) {
                div.appendChild(modifier);
                modifier.innerText = rx.modifier;

                // add modifier toggle dynamics:
                modifier.onclick = (ev) => {
                    rx.nextModifier();
                    modifier.innerText = rx.modifier;
                    ev.stopPropagation();
                    pc.screenManager.signalDataChanged();
                }
            }

            // add text:
            div.appendChild(text_title);

            // set checkbox state:
            checkbox.checked = pc.game.hasPendingRx(rx);

            // add checkbox events:
            div.onclick = () => {
                pc.game.togglePendingRx(rx);
                checkbox.checked = pc.game.hasPendingRx(rx);
                pc.screenManager.signalDataChanged();
            };



            return div;
        }
    }

    MVC.registerElementController("TreatmentSearchView", TreatmentSearchView);

}