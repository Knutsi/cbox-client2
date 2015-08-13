/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class ActionView extends ElementController{

        listRoot:HTMLDivElement;

        constructor(root, pc) {
            super(root, pc);
            var controller = <PlayPageController>this.pageController;

            // grab elements:
            this.listRoot = <HTMLDivElement>this.player("list");

            // render now if loaded, or postpone render to load done:
            if(controller.storage.forms)
                this.render();
            else
                controller.storage.onLoadDone.subscribe(() => { this.render() });

        }

        render() {
            // do casting for ease of access:
            var controller = <PlayPageController>this.pageController;

            controller.storage.forms.forEach( (form) => {
                var div = document.createElement("div");
                div.className = "button";
                div.innerText = form.title;

                this.listRoot.appendChild(div);

                // add events:
                div.onclick = () => { controller.activateForm(form.ident) };
            });
        }


    }

    MVC.registerElementController("ActionView", ActionView);
}