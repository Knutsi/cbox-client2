/// <reference path="../../cboxclient.ts" />

module cbox {

    export class FormView extends ElementController{

        private form:Form = null;
        title:HTMLHeadingElement;
        contentRoot:HTMLDivElement;

        constructor(root, pc) {
            super(root, pc);

            this.title = <HTMLHeadingElement>this.player("title");
            this.contentRoot = <HTMLDivElement>this.player("content");
        }


        get formID() {
            return this.form.ident;
        }


        set formID(value) {
            console.log("Form switching to: " + value);

            this.form = null;

            var controller =  <PlayPageController>this.pageController;
            if(!controller.storage.forms)
                return;

            for(var i in controller.storage.forms)
                if(controller.storage.forms[i].ident == value)
                    this.form = controller.storage.forms[i];


            if(this.form)
                this.update();
        }


        update() {
            this.title.innerText = this.form.title;

            // render headlines:
            this.contentRoot.innerHTML = "";

            this.form.headlines.forEach((headline) => {
                this.renderHeadline(headline);
            })
        }


        renderHeadline(headline:Headline) {
            var div = document.createElement("div");
            var h2 = document.createElement("h2");

            div.className = "contentblock";
            div.appendChild(h2);



            this.contentRoot.appendChild(div);

            h2.innerText = headline.title;

            // get actions that can be applied to the case from this headline:

            headline.actions.forEach( (action) => {
                var action_count = this.renderAction(div, action);
            })

        }


        renderAction(parent_div:HTMLDivElement, action:Action):number {
            var count = 0;
            var game = (<PlayPageController>this.pageController).game;
            var problems = game.case_.problems;

            problems.forEach( (problem) => {
                if(action.appliesTo(problem))  {
                    count++;

                    var ap_pair = new ActionProblemPair(action, problem);

                    // create elements:
                    var div = document.createElement("div");
                    var checkbox = document.createElement("input");
                    var text = document.createTextNode(ap_pair.displayName);

                    div.className = "clickable";
                    checkbox.setAttribute("type", "checkbox");
                    checkbox.checked = game.hasPending(ap_pair);

                    parent_div.appendChild(div);
                    div.appendChild(checkbox);
                    div.appendChild(text);

                    // create and assign events:
                    var select = (ev) => {
                        game.togglePending(ap_pair);
                        checkbox.checked = game.hasPending(ap_pair);
                        ev.stopPropagation();
                    };

                    //checkbox.onchange = select;
                    div.onclick = select;
                }
            })


            return count;
        }

    }

    MVC.registerElementController("FormView", FormView);
}