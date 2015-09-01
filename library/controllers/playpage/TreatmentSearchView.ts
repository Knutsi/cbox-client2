/**
 * Created by knut on 8/12/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class TreatmentSearchView extends SearchView {

        static NO_TREATMENT_IDENT = "no-treatment";

        currentResults:TreatmentChoice[] = [];
        noTreatmentButton:HTMLDivElement;

        constructor(root, pc) {
            super(root, pc);

            this.noTreatmentButton = this.player("no-treatment-button");
            this.noTreatmentButton.onclick = () => {
                var ctrlr = <PlayPageController>this.pageController;
                var no_treatment = ctrlr.storage.getTreatment(TreatmentSearchView.NO_TREATMENT_IDENT);
                var treatment_choice = new TreatmentChoice(no_treatment);
                ctrlr.game.pendingTreatments.add([treatment_choice]);
                ctrlr.screenManager.activate("dntscreen");
            }
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
                if(rx.title.toLowerCase().indexOf(input.toLowerCase()) != -1
                    || rx.searchIndex.toLowerCase().indexOf(input.toLowerCase()) != -1)
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
            var text_title = document.createTextNode(rx.displayName + " ");
            var tradenames_span = document.createElement('span');

            div.className = "searchresult";
            modifier.className = "dosetoggle";
            checkbox.setAttribute("type", "checkbox");
            div.appendChild(checkbox);
            
            // add modifiers:
            if(rx.treatment.modifiers) {
                div.appendChild(modifier);
                modifier.textContent = rx.modifier;

                // add modifier toggle dynamics:
                modifier.onclick = (ev) => {
                    rx.nextModifier();
                    modifier.textContent = rx.modifier;
                    ev.stopPropagation();
                    pc.screenManager.signalDataChanged();
                }
            }

            // add text:
            div.appendChild(text_title);

            // add tradename span:
            tradenames_span.textContent = rx.treatment.searchIndex;
            tradenames_span.className = "comment";
            div.appendChild(tradenames_span);

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